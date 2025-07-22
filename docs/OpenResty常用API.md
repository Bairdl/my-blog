---
sticky: 1
---

# OpenResty 常用 API

## 请求处理与响应

请求处理

|API 名称 | 功能描述 |
|---------|----------|
|`ngx.req.get_headers()`| 获取请求头。|
|`ngx.req.get_uri_args()`| 获取 URL 参数。 |
|`ngx.req.read_body()`| 读取请求体。|
|`ngx.req.get_post_args()`| 获取 POST 参数。|
|`ngx.exit()` | 终止请求处理。|
|`ngx.redirect()`|请求重定向。|

响应返回

|API 名称 | 功能描述 |
|---------|----------|
|`ngx.status()`| 设置响应状态码。|
|`ngx.header()`| 设置响应头。|
|`ngx.send_headers()`| 发送响应头。|
|`ngx.say()`| 发送响应内容，每个参数后追加一个换行。|
|`ngx.print()`| 发送响应内容，不做修改。|
|`ngx.flush(true)`|刷新缓冲区。|

在 OpenResty 中，响应头相关的配置是由默认配置的，开发者可以直接使用`ngx.say()` 或者 `ngx.print()` 来返回响应内容。

如果开发者需要自定义响应头，就必须在第一次调用 `ngx.say()` ， `ngx.print()` 或者显式调用 `ngx.send_headers()` 前进行。因为一旦响应头发送就不能再进行修改。

在使用 `ngx.say()` 或者 `ngx.print()` 发送响应内容后，并不会立即发送消息，而是将内容写入 nginx 的缓冲区。
其实际发送时机取决于缓冲区是否满，是否显式调用 `ngx.flush(true)`，请求处理是否结束（Lua 代码执行完毕自动刷新）。

代码示例

```lua
-- 阶段 1：准备阶段（此时响应头尚未发送）
ngx.status = 404                      -- 可以修改
ngx.header["Content-Type"] = "text/html" -- 可以修改

-- 阶段 2：首次输出（触发响应头发送！）
ngx.print("<html><body>")             -- 此处响应头被锁定并发送

-- 阶段 3：后续操作（响应头已不可修改）
ngx.status = 200                      -- 无效！已发送404
ngx.header["Content-Type"] = "text/plain" -- 无效！已发送text/html

-- 阶段 4：写入响应体（缓冲中）
ngx.print("Hello ")                   -- 写入缓冲区
ngx.say("World!")                     -- 写入缓冲区（自动加\n）

-- 阶段 5：刷新缓冲区（可选）
ngx.flush(true)  -- 强制立即发送当前缓冲区内容

-- 阶段 6：更多内容
ngx.say("End of response")            -- 写入缓冲区

-- 阶段 7：请求结束（自动刷新剩余缓冲区）
```

## 网络通信（Cosocket API）

| API 名称                 | 功能描述        |
| ------------------------ | --------------- |
| `ngx.socket.tcp()`       | 创建 TCP socket |
| `sock:connect()`         | 连接远程服务器  |
| `sock:send()`            | 发送数据        |
| `sock:receive()`         | 接受数据        |
| `ngx.socket.udp()`       | 创建 UDP socket |
| `ngx.location.capture()` | 发布内部子请求  |

## 定时器与后台任务

| API 名称            | 功能描述         |
| ------------------- | ---------------- |
| `ngx.timer.at()`    | 创建定时器       |
| `ngx.timer.every()` | 创建周期性定时器 |

## 变量与上下文

| API 名称          | 功能描述                      |
| ----------------- | ----------------------------- |
| `ngx.var`         | 访问 Nginx 变量               |
| `ngx.ctx`         | 请求级别的 Lua 表，跨阶段共享 |
| `ngx.shared.DICT` | 共享内存字典，跨 worker       |
| `dict:set()`      | 设置共享内存值                |
| `dict:get()`      | 获取共享内存值                |

`ngx.var` 与 `ngx.ctx` 的区别

| 特性         | ngx.var                        | ngx.ctx                   |
| ------------ | ------------------------------ | ------------------------- |
| 本质         | Nginx 变量系统接口             | 每个请求独立的 Lua 表     |
| 数据类型     | 主要字符串                     | 任意 Lua 值（表、函数等） |
| 作用域       | 整个请求+子请求                | 仅当前请求                |
| 是否需要声明 | 自定义变量需要 nginx.conf 声明 | 无需声明，直接使用        |
| 性能         | 较高开销（C 函数调用）         | 极低开销（纯 Lua 表操作） |
| 共享性       | 父子请求共享                   | 父子请求独立              |
| 适用场景     | 访问内置变量/与其他模块交互    | 请求内阶段间传递复杂数据  |
| 生命周期     | 随请求结束                     | 随请求结束                |
| 线程安全     | 是                             | 是（每个请求独立）        |

`ngx.var`适用场景

```lua
-- 1. 访问内置变量
local client_ip = ngx.var.remote_addr

-- 2. 与 Nginx 配置交互
ngx.var.limit_rate = 0  -- 暂停传输

-- 3. 跨子请求共享数据
ngx.var.shared_data = "value"
```

`ngx.ctx` 适用场景

```lua
-- 1. 跨阶段传递复杂数据
rewrite_by_lua_block {
    ngx.ctx.user = authenticate_user()
}

content_by_lua_block {
    process_request(ngx.ctx.user)
}

-- 2. 存储临时计算结果
ngx.ctx.cache = heavy_computation()

-- 3. 避免重复计算
if not ngx.ctx.processed then
    do_expensive_work()
    ngx.ctx.processed = true
end
```

## 日志与调试

| API 名称        | 功能描述   |
| --------------- | ---------- |
| `ngx.log()`     | 记录日志   |
| `ngx.print_r()` | 打印表结构 |

`ngx.log()` 用于记录日志，其输出默认会写入到 Nginx 的错误日志文件中。

Nginx 只会记录等于或高于配置级别的日志：

| 日志级别常量 | 数值 | 说明 |
| ------------ | ---- | ---- |
| ngx.EMERG    | 0    | 紧急 |
| ngx.ALERT    | 1    | 警报 |
| ngx.CRIT     | 2    | 严重 |
| ngx.ERR      | 3    | 错误 |
| ngx.WARN     | 4    | 警告 |
| ngx.NOTICE   | 5    | 通知 |
| ngx.INFO     | 6    | 信息 |
| ngx.DEBUG    | 7    | 调试 |

日志的配置通常在`nginx.conf`中。

```txt
http {
    error_log /var/log/nginx/error.log warn;
}
```
