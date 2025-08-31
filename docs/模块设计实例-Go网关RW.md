# 模块设计实例：基于Go的网关Reader和Writer

非常好，我们来深入剖析TCP模块中Reader和Writer的设计，这是网关数据流的入口和出口，至关重要。

---

## 一、Reader 和 Writer 是并发的吗？

**是的，绝对是并发的，并且是高性能设计的核心。**

- **每个TCP连接都拥有自己独立的Reader和Writer Goroutine**。这意味着1万个连接就会对应2万个Goroutine（1万读 + 1万写）。
- 这种“每连接一个Goroutine”的模式是Go语言处理网络连接的**标准和高性能做法**。得益于Go轻量级Goroutine的调度，这种方式可以轻松支撑数十万连接。

---

## 二、它们需要维护状态吗？

**需要，但它们的状态是“连接级”的，而不是“全局级”的。**

- **Reader状态**：维护当前连接的**读缓冲區**、**解包状态**（如处理粘包半包）、**解码器状态**等。这些状态对于每个连接都是独立的。
- **Writer状态**：维护**写缓冲區**、**编码器状态**等。同样也是连接独立的。
- **关键点**：Reader和Writer**不维护**像用户是否登录这样的**业务状态**。业务状态由 `Session` 对象维护，它们只是通过Session来获取或设置状态。

---

## 三、主要逻辑是什么？

### Reader Goroutine 的主要逻辑（职责单一）

1. **循环读**：在一个 `for` 循环中，不断地从 `net.Conn` 中读取二进制数据。
2. **解帧**：应用网络协议（如长度字段、分隔符等）解决TCP粘包/半包问题，分离出一个完整的应用层数据包。
3. **解码**：将二进制数据包用Protobuf解码成Go结构体（请求对象）。
4. **转发**：将解码后的请求对象（**附带SessionID**）放入**全局的请求Channel** (`logicReqChan`)中，交给Logic Processor处理。
5. **监听退出**：同时监听 `ctx.Done()` 信号和连接错误，一旦收到信号，就退出循环，结束Goroutine。

```go
func (s *Session) readLoop(ctx context.Context) {
    defer s.close() // 退出时关闭连接和资源
    buffer := make([]byte, 4096)
    
    for {
        select {
        case <-ctx.Done():
            return
        default:
            n, err := s.conn.Read(buffer)
            if err != nil {
                // 处理错误（如EOF、超时、连接重置）
                return
            }
            // 1. 解帧 & 2. 解码
            request, err := s.unpackAndDecode(buffer[:n])
            if err != nil {
                // 处理协议解析错误
                continue
            }
            // 3. 转发到Logic Processor
            s.logicReqChan <- &LogicRequest{
                SessionID: s.ID,
                Data:      request,
            }
        }
    }
}
```

### Writer Goroutine 的主要逻辑（职责单一）

1. **循环监听**：在一个 `for-select` 循环中，监听两个Channel：
    - **专属响应Channel** (`sess.responseChan`)：等待Logic Processor或HTTP Handler发来的需要写回客户端的消息。
    - **退出信号** (`ctx.Done()`)。
2. **编码**：将响应Go结构体用Protobuf编码成二进制。
3. **组帧**：根据网络协议，为二进制数据添加帧头（如长度字段）。
4. **写入**：将完整的帧通过 `net.Conn.Write` 写入TCP连接。
5. **错误处理**：处理写入失败的情况（如连接已断开）。

```go
func (s *Session) writeLoop(ctx context.Context) {
    defer s.close()
    
    for {
        select {
        case <-ctx.Done():
            return
        case response, ok := <-s.responseChan:
            if !ok { // Channel被关闭，通常意味着Session被清理
                return
            }
            // 1. 编码 & 2. 组帧
            data, err := s.encodeAndPack(response)
            if err != nil {
                // 处理编码错误
                continue
            }
            // 3. 写入网络
            _, err = s.conn.Write(data)
            if err != nil {
                // 处理写失败（连接已断开）
                return
            }
        }
    }
}
```

---

## 四、需要与哪些模块通信？

### Reader 的通信

- **→ Logic Processor**：通过**全局Channel** (`logicReqChan`) **发送**请求。这是Reader**唯一**的对外通信。

### Writer 的通信

- **← Logic Processor**：通过**Session专属Channel** (`sess.responseChan`) **接收**需要发送给客户端的响应。
- **← HTTP Handler**：同样通过**Session专属Channel** (`sess.responseChan`) **接收**后端服务主动推送的消息。

### 它们与SessionManager的关系

- **间接关系**：Reader/Writer不直接调用SessionManager。它们被创建时，已经和某个Session绑定了。Session的生与死由SessionManager管理，Reader/Writer负责在连接断开时通知SessionManager（例如通过调用 `sess.close()`，内部会触发SessionManager的清理操作）。

---

## 五、实现时需要注意什么？

1. **连接保活与超时**：必须在 `net.Conn` 上设置**读/写超时**（`SetReadDeadline`），否则连接僵死会导致Goroutine泄漏。通常会在每次成功读写后重置超时时间。

2. **粘包与半包处理**：这是TCP编程的基石。Reader中必须有**完善的解帧逻辑**，不能假设一次 `Read` 调用就能读到一个完整的应用层数据包。

3. **Goroutine泄漏**：必须确保在连接关闭、发生错误或收到关机信号时，Goroutine能够成功退出循环。`defer s.close()` 是关键。

4. **Channel关闭处理**：Writer在监听 `sess.responseChan` 时，必须检查Channel是否已被关闭（`ok`标志）。这是Session被销毁时，通知Writer退出的重要机制。

5. **错误处理与资源清理**：任何一步出错（读错、写错、解码错）都应导致连接被关闭，并释放所有关联的资源（包括从SessionManager中注销）。

6. **背压（Backpressure）处理**：
    - 如果Writer的写入速度跟不上接收响应的速度，`sess.responseChan` 可能会被填满。
    - 这时，Logic Processor在发送响应时会被阻塞，从而形成背压，最终会减缓对后端服务的请求速度。这是一种**自动的流量控制**。
    - 通常将 `sess.responseChan` 设为无缓冲或小缓冲Channel，以便快速传递背压信号。

## 总结

Reader和Writer是网关的**I/O工人**，它们的设计遵循了：

- **并发**：每连接一对 Goroutine。
- **单一职责**：Reader只管读和解码，Writer只管编码和写。
- **状态独立**：状态与连接绑定，而非全局。
- **通信简化**：通过Channel与核心逻辑模块解耦。
- **健壮性**：完善的错误处理和资源清理机制。

这种设计是Go网络编程的经典模式，完美利用了Goroutine和Channel的优势，实现了高性能和高可维护性。
