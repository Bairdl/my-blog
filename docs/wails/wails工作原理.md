# Wails 工作原理

Wails 应用程序是一个带有 webkit 前端的标准的 Go 应用程序。  
应用程序的 Go 部分由应用程序代码和一个运行时库组成，该库提供了许多有用的操作，例如控制应用程序窗口。  
前端是一个 webkit 窗口，将显示前端资源。前端还可以使用运行时库的 JS 版本。也可以将 Go 方法绑定到前端，这些将显示为可以调用的 JS 方法。

## 主应用程序

### 概述

主应用程序由对 `wails.Run()` 的调用组成。  
该函数接受描述应用程序窗口大小、窗口标题、 使用的资源等应用程序配置。

基本应用程序可能如下所示：

`app.go`

```go
package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
```

`main.go`

```go
package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "nexa",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
```

选项概要

- `Title` ：标题栏文本。
- `Width` & `Height` ：窗口的尺寸
- `Assets` ： 应用程序的前端资产
- `OnStartUp` ： 创建窗口并即将开始加载前端资源时的回调
- `OnShutdown` ：应用程序即将退出时的回调。
- `Bind` ： 希望向前端暴露的一部分结构体示例。

`Assets` 选项是必需的，因为不存在没有前端资产的Wails 应用。  
这些资产是希望在Web应用程序中找到任何文件-html、js、css、svg、png等。  
当应用程序启动时，将尝试从资产中加载 `index.html`，并且前端将基本作为浏览器工作。

> [!NOTE] embed 包  
> 从 Go 1.16 开始，标准库新增了 `embed` 包，允许在编译时直接将文件（如 HTML、CSS、JS、图片等）嵌入到 Go 二进制程序中。  
> 使用方式：
> ``` go
> import "embed"
> 
> //go:embed static/*.css templates/*.html
> var staticFiles embed.FS
> ```
> 这样，staticFiles 就可以在运行时访问这些文件，而无需额外部署它们。

> [!NOTE] //go:embed 
> Go 的官方语法，一种 编译指示（Directive），告诉 Go 编译器在编译时嵌入指定的文件或目录。  
> 必须以 `//go:embed` 开头（不能有空格），后面紧跟要嵌入的文件路径（支持通配符 `*`）。

启动时，Wails 将遍历嵌入的文件，寻找包含的 `index.html` 。  
所有其他资源将相对于该目录加载。

由于可用于生产的二进制文件使用包含在 `embed.FS` 中的文件，因此应用程序不需要附带任何外部文件。

在开发模式下使用 wails dev 命令，资产从磁盘加载，任何更改都会导致“实时重新加载”。 资产的位置将从 `embed.FS` 推断。

### 应用程序回调

在加载前端 `index.html` 之前，会对 应用启动回调 中提供的函数进行调用。  
一个标准的 Go context 被传递给这个方法。

调用运行时需要此 context，因此标准模式是在此方法中保存对它的引用。  
