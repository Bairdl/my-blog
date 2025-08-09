---
- tags:
    - GUI 库
    - 跨平台
---
# wails 安装

Wails 是一个可以使用 Go 和 Web 技术编写桌面应用的项目。

可以将其视为 Go 的快速并且轻量的 Electron 替代品。

## 支持平台

- Windows 10/11 AMD64/ARM64
- MacOS 10.13+ AMD64
- MacOS 11.0+ ARM64
- Linux AMD64/ARM64

## 依赖

- Go 1.20+
- NPM (Node 15+)

### 特定平台依赖

可运行 `wails doctor` 查看。

## 安装 Wails

运行 `go install github.com/wailsapp/wails/v2/cmd/wails@latest` 安装 Wails CLI。

注意：如果您遇到了类似于以下内容的错误：

```
....\Go\pkg\mod\github.com\wailsapp\wails\v2@v2.1.0\pkg\templates\templates.go:28:12: pattern all:ides/*: no matching files found
```

请检查您是否已安装 Go 1.18+ ︰

```sh
go version
```

## 系统检查

运行 `wails doctor` 将检查您是否安装了正确的依赖项。 如果没有，它会就缺少的内容提供建议以帮助纠正问题。
