---
sticky: 1
---

# Go 基础语法

这一部分为 Go 的核心基础语法，不包含语法糖。

## 程序基本结构

包声明和导入

```go
// 包声明
package main

// 导入多个包
// 导入的包必须使用，否则会报错
import (
    "fmt"
    "math"
)

// 主函数
func main() {
    fmt.Println("Hello, World!")
}
```

变量声明

```go
// 显式类型声明
var number int
var name string
var isActive bool

// 多变量声明
var x, y int
var (
    a int
    b float 64
)
```

常量声明

```go
const Pi = 3.14
const (
    StatusOk = 200
    StatusNotFound = 404
)
```

## 命名约定

在 Go 的命名中，有以下一些命名约定。

1. 包内变量，大小写决定可见性
   1. 包级公开标识符：首字母大写。
   2. 包级私有标识符：首字母小写。（都是驼峰命名）
2. 包名
   1. 全部小写字母，无下划线。
   2. 使用单数名词。
   3. 简介明了，避免过长。
3. 接口名
   1. 单方法接口：方法名+`er`后缀。
   2. 多方法接口：描述行为的名称。
4. 错误类型
   1. 错误类型名：`...Error`。
   2. 错误变量名：`Err..`。
5. 方法接收者名
   1. 1-2 个字母的**类型缩写**（例如`c *Client`而不是`client *Client`）
   2. 保持一致性（同一类型的所有方法应使用相同的接收者名）

常用短变量名

| 变量类型 | 推荐名称 | 示例 |
|----------------|----------|-----------------------|
| 任意类型 | `v` | `func(v T)` |
| 数组/切片 | `a` | `a := []int{1,2,3}` |
| 循环索引 | `i`, `j` | `for i := range a` |
| 映射 | `m` | `m := make(map...)` |
| 错误 | `err` | `if err != nil` |
| 上下文 | `ctx` | `func(ctx context.Context)` |
| 字节切片 | `b` | `b := []byte("...")` |
| 缓冲区 | `buf` | `buf := new(bytes.Buffer)` |
| 测试对象 | `t` | `func TestX(t *testing.T)` |

命名习惯总结表

| 元素类型   | 命名风格     | 示例            | 特殊规则           |
| ---------- | ------------ | --------------- | ------------------ |
| 包名       | 全小写       | encoding        | 单数名词           |
| 导出标识符 | PascalCase   | ServerConfig    | 首字母大写         |
| 私有标识符 | camelCase    | internalCache   | 首字母小写         |
| 接口       | -er 后缀     | Stringer        | 描述行为           |
| 错误变量   | Err 前缀     | ErrNotFound     | 驼峰式             |
| 测试函数   | Test 前缀    | TestParseConfig | 参数 t \*testing.T |
| 接收者     | 1-2 字母缩写 | (c \*Client)    | 类型首字母         |
| 首字母缩写 | 全大写       | HTTPHandler     | URL、ID 等         |

## 基本数据类型

| 类型      | 说明                  | 示例                 |
| --------- | --------------------- | -------------------- |
| bool      | 布尔值                | true, false          |
| int       | 整型（平台相关大小）  | 42                   |
| int32     | 32 位整型             | -15                  |
| uint64    | 64 位无符号整型       | 18446744073709551615 |
| float32   | 32 位浮点数           | 3.14159              |
| float64   | 64 位浮点数           | 2.71828              |
| complex64 | 64 位复数             | 1+2i                 |
| byte      | uint8 别名            | 'A'                  |
| rune      | int32 别名（Unicode） | '世'                 |
| string    | 字符串                | "Hello"              |

## 控制结构

条件语句

```go
// 基本 if 语句
if x > 10 {
    fmt.Println("x is greater than 10")
}

// if-else
if y < 0 {
    fmt.Println("y is negative")
}else {
    fmt.Println("y is non-negative")
}

// if-else if
if num < 0 {
    fmt.Println("Negative")
}else if num == 0 {
    fmt.Println("Zero")
} else {
    fmt.Println("Positive")
}
```

循环语句

```go
// 基础 for 循环
for i := 0; i < 10; i = i + 1 {
    fmt.Println(i)
}

// while 等效
n := 5
for n > 0 {
    fmt.Println(n)
    n = n - 1
}


// 无限循环
for {
    fmt.Println("Looping forever")
}

// dowhile
for {
    fmt.Println("Executing at least once")

    if condition {
        break
    }
}
```

Go 只提供了 `for` 这一种循环结构，但可以通过不同的用法覆盖所有的循环场景。

特殊场景

```go
// 集合迭代
// 替代 foreach
nums := []int{1, 2, 3}
for index, value := range nums {
    fmt.Printf("Index:%d Value:%d\n", index, value)
}

// 仅取值
for _, value := range nums {
    fmt.Println(value)
}


// 带条件的 break/continue
for {
    // 复杂逻辑

    if shouldBreak {
        break // 替代 do-while 的条件检查
    }

    if shouldContinue {
        continue
    }
}

// 带标签的循环控制
OuterLoop:
for i := 0; i < 5; i++ {
    for j := 0; j < 5; j++ {
        if i*j == 12 {
            break OuterLoop // 跳出外层循环
        }
    }
}
```

switch 语句
go 的 switch 语句不需要 break

```go
// 基本 switch
switch os := "linux"; os {
case "windows":
    fmt.Println("Running on Windows")
case "linux":
    fmt.Println("Running on Linux")
default:
    fmt.Println("Unknown OS")
}

// 无值 switch
// 将switch 当作一组if-else链来使用
num := 75
switch {
case num < 50:
    fmt.Println("Below 50")
case num < 100:
    fmt.Println("Below 100")
default:
    fmt.Println("100 or above")
}
```

## 复合数据类型

数组

```go
// 声明并初始化
var arr [3]int
arr[0] = 1
arr[1] = 2
arr[2] = 3

// 字面量初始化
primes := [6]int{2, 3, 5, 7, 11, 13}
```

切片

```go
// 创建切片
var s []int
s = []int{1, 2, 3}

// 从数组创建
arr := [5]int{1, 2, 3, 4, 5}
slice := arr[1:4] // [2, 3, 4]

// 使用 make 创建
s2 := make([]int, 5) // 长度5，容量5
s3 := make([]int, 3, 5) // 长度3，容量5
```

结构体

```go
// 定义结构体
type Person struct {
    Name string
    Age  int
}

// 创建结构体实例
var p1 Person
p1.Name = "Alice"
p1.Age = 30

// 字面量初始化
p2 := Person{Name: "Bob", Age: 25}
p3 := Person{"Charlie", 35}
```

映射

```go
// 创建映射
var m map[string]int
m = make(map[string]int)

// 添加键值对
m["one"] = 1
m["two"] = 2

// 字面量初始化
grades := map[string]int{
    "Alice": 92,
    "Bob":   85,
}
```

## 函数

函数定义

```go
// 无参数无返回值
func sayHello() {
    fmt.Println("Hello!")
}

// 带参数
func add(x int, y int) {
    fmt.Println(x + y)
}

// 带返回值
func multiply(x int, y int) int {
    return x * y
}

// 多返回值
func divide(dividend int, divisor int) (int, int) {
    quotient := dividend / divisor
    remainder := dividend % divisor
    return quotient, remainder
}
```

函数调用

```go
sayHello()
add(5, 3)
result := multiply(4, 6)
q, r := divide(10, 3)
```

## 指针

```go
func pointerBasics() {
    var a int = 42
    var p *int = &a // p 指向 a

    fmt.Println(a)  // 42
    fmt.Println(*p) // 42 (解引用)

    *p = 21 // 通过指针修改值
    fmt.Println(a) // 21
}
```

`make`函数用于初始化内建的数据结构（切片、映射和通道），并分配内存以及设置初始参数。它返回的是被初始化的（非零值）对象，而不是指针。

`make`函数有三种使用形式：

```go
// 切片：指定类型、长度和容量（容量可选）
make([]T, len)
make([]T, len, cap)
// 映射：指定键值类型，可指定初始容量（可选）
make(map[K]V)
make(map[K]V, initialCapacity)
// 通道：指定元素类型和缓冲区容量（容量可选）
make(chan T)
make(chan T, capacity)
```

| 类型 | 初始化内容                       |
| ---- | -------------------------------- |
| 切片 | 底层数组 + 切片头（ptr/len/cap） |
| 映射 | 哈希表桶数组 + 溢出桶结构        |
| 通道 | 环形缓冲区 + 协程同步原语        |

## 方法和接口

### 方法

```go
type Rectangle struct {
    Width  float64
    Height float64
}

// 值接收者方法
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// 指针接收者方法
func (r *Rectangle) Scale(factor float64) {
    r.Width = r.Width * factor
    r.Height = r.Height * factor
}
```

1. **值接收者方法 (Value Receiver)**:

   ```go
   type T struct{}
   func (t T) M() {}
   ```

   - **调用对象**：可以通过值类型或指针类型调用（Go 会自动转换）
   - **操作对象**：方法内操作的是接收者的**副本**，对原始对象的修改不会影响原值
2. **指针接收者方法 (Pointer Receiver)**:

   ```go
   type T struct{}
   func (t *T) M() {}
   ```

   - **调用对象**：可以通过指针类型或值类型调用（Go 会自动取地址）
   - **操作对象**：方法内操作的是接收者**指针指向的原始对象**，修改会影响原值
     **核心区别**：

- 值接收者：方法内修改不影响原接收者（安全但可能低效，因为复制）
- 指针接收者：方法内修改会影响原接收者（高效，避免大对象复制）

### 接口

```go
type Shape interface {
    Area() float64
}

func printArea(s Shape) {
    fmt.Println("Area:", s.Area())
}

func main() {
    rect := Rectangle{Width: 10, Height: 5}
    printArea(rect) // 调用 Area 方法
}
```

## 错误处理

```go
func divide(a, b float64) (float64, error) {
    if b == 0.0 {
        return 0.0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10.0, 2.0)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
}
```

## 并发基础

goroutine

```go
func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    // 启动 goroutine
    go say("world")
    say("hello")
}
```

通道

```go
func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum // 发送结果到通道
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}

    // 创建通道
    c := make(chan int)

    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)

    // 从通道接收
    x := <-c
    y := <-c

    fmt.Println(x, y, x+y)
}
```

## defer 语句

```go
func main() {
    // 打开文件
    f, err := os.Open("filename.txt")
    if err != nil {
        fmt.Println("Error opening file:", err)
        return
    }

    // 延迟关闭文件
    defer f.Close()

    // 处理文件内容...
}
```
