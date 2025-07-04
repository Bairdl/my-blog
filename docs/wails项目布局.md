# Wails 项目布局

Wails 项目有以下布局：

```
.
├── build/
│   ├── appicon.png
│   ├── darwin/
│   └── windows/
├── frontend/
├── go.mod
├── go.sum
├── main.go
└── wails.json
```

## 项目结构概要

- `/main.go` - 主应用
- `/frontend/` - 前端项目文件
- `/build/` - 项目构建目录
- `/build/appicon.png` - 应用程序图标
- `/build/darwin/` - Mac 特定的项目文件
- `/build/windows/` - Windows 特定的项目文件
- `/wails.json` - 项目配置
- `/go.mod` - Go module 文件
- `/go.sum` - Go module 校验文件

`frontend` 目录没有特定于 Wails 的内容，可以是您选择的任何前端项目。

`build` 目录在构建过程中使用。 这些文件可以修改以自定义您的构建。 如果从 build 目录中删除文件，将重新生成默认版本。

`go.mod` 中的默认模块名称是“changeme”。 您应该将其更改为更合适的内容。
