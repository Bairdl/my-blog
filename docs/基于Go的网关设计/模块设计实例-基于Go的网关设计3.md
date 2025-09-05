# 基于Go的网关设计3

基于Go的游戏服务器网关。

## 主要功能

管理与客户端建立的TCP连接。
接收来自客户端的请求，处理后使用HTTP方式向服务端请求对应信息，将响应返回给客户端。
接收来自服务端的HTTP形式的推送消息，转发给客户端。

要点：

1. 客户端TCP连接的管理。
2. 会话管理。
3. 玩家管理。
4. 请求消息的处理。
5. 服务端主动推送。
6. 并发逻辑。

## 当前模块设计

当前设计中主要分为以下模块：

1. gate 模块：包含 tcp 服务（接收来自客户端的连接）和http服务（接收来自服务端的推送）。
2. log 模块：日志记录。
3. player 模块：player 的管理，单个player内部状态的维护，缓存player下线期间的消息。
4. message 模块：为player提供缓存消息的功能。
5. session 模块：session的管理，单个session状态的维护，接收来自客户端的请求，转发给worker处理，返回响应给客户端。
6. worker 模块：worker的管理，单个worker状态的维护，处理任务，并向服务端请求。
7. service 模块：提供对特殊消息的处理逻辑（如重连等）。

### player 模块

包含 PlayerManager 和 Player 两个结构体。  

PlayerManager 提供以下功能：

1. 添加 Player 。
2. 删除 Player 。
3. 根据 PlayerId 查询对应输入管道。
4. 定期清理闲置Player 。

Player 提供以下功能：

1. 基础字段的查询，如 SessionId 。
2. 缓存离线期间的消息。

### session 模块

SessionManager 提供以下功能：

1. 创建 Session 。
2. 删除 Session 。
3. 根据 Id 查询对应输出管道。
4. Session 验证定时器。
5. Session 关闭定时器。

Session 提供以下功能：

1. Session 基础状态的访问。
2. 接收来自客户端的消息。
3. 将消息封装后发送到 Worker 处理。
4. 将响应消息发送到客户端。
