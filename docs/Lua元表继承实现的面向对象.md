# Lua 元表继承实现面向对象（OOP）

## 1. 背景：Lua 只有表和元表

- **表（table）** 是 Lua 里唯一能放“字段”的对象。
- **元表（metatable）** 用来给表“打补丁”，最常见的是 `__index`。
- 当 `t.foo` 找不到时：  
  ① 看 `t` 有没有元表；  
  ② 看元表里有没有 `__index`；  
  ③ 如果 `__index` 是表，就继续去那个表里找；如果是函数，就调用它。

这样就天然形成了“原型链”式的查找，等价于 JavaScript 的原型继承。

---

## 2. 手写一个最朴素的“类”

```lua
local Person = {}
Person.__index = Person

-- 构造函数
function Person:new(name, age)
    local obj = { name = name, age = age }
    setmetatable(obj, self)   -- self 此时等于 Person
    return obj
end

-- 成员方法
function Person:speak()
    print(("I am %s, age %d"):format(self.name, self.age))
end

-- 创建实例
local p = Person:new("Alice", 30)
p:speak()   --> I am Alice, age 30
```

---

## 3. 单继承：Student 继承 Person

### 3.1 直接继承（最简）

```lua
local Student = {}
setmetatable(Student, { __index = Person })   -- Student 继承 Person
Student.__index = Student

function Student:new(name, age, grade)
    -- 先让父类帮我们初始化 name/age
    local obj = Person:new(name, age)
    setmetatable(obj, self)   -- 把 obj 的元表换成 Student
    obj.grade = grade
    return obj
end

function Student:study()
    print(("%s is studying grade %s"):format(self.name, self.grade))
end

local s = Student:new("Bob", 18, "A")
s:speak()   -- 来自 Person
s:study()   -- 来自 Student
```

### 3.2 解决“super”链

Lua 本身没有 `super`，但可以在对象里保留一个字段 `_class`，或在构造时把父类存起来：

```lua
function Student:new(...)
    local obj = Person:new(...)   -- 先调父类
    setmetatable(obj, self)
    obj._super = Person           -- 保留父类引用
    return obj
end

-- 手动调父类方法
function Student:speak()
    self._super.speak(self)       -- 相当于 super:speak()
    print("Also a student.")
end
```

---

## 4. 多重继承（Mixin/接口）

Lua 的 `__index` 可以是函数，于是可以一次性查多张表：

```lua
-- 工具函数：在多个父表里顺序查找字段
local function search(k, parents)
    for i = 1, #parents do
        local v = parents[i][k]
        if v then return v end
    end
end

-- 创建一个“多重继承”类
function createClass(...)
    local parents = { ... }
    local cls = {}
    cls.__index = function(t, k)
        return search(k, parents)
    end
    return cls
end

-- 示例：Student 同时继承 Person、Loggable
local Loggable = {}
function Loggable:log(msg) print("[LOG]", msg) end

local Student = createClass(Person, Loggable)
setmetatable(Student, Student)  -- 让它也能作为实例的元表

function Student:new(name, age, grade)
    local obj = setmetatable({}, self)
    obj.name, obj.age, obj.grade = name, age, grade
    return obj
end

local s = Student:new("Carol", 20, "B")
s:speak()   -- 来自 Person
s:log("hello")  -- 来自 Loggable
```

---

## 5. 完整的 `class.lua` 模块

很多项目会封装一个通用模块，避免重复代码。下面是一份可直接使用的 **单文件实现**（支持单继承 + mixin）：

```lua
-- class.lua
local function class(super, ...)
    local cls = {}
    cls.__index = cls

    -- 继承
    if super then
        cls.super = super
        setmetatable(cls, { __index = super })
    end

    -- 构造函数
    function cls:new(...)
        local obj = setmetatable({}, self)
        if obj.initialize then obj:initialize(...) end
        return obj
    end

    -- Mixin
    for _, mixin in ipairs({...}) do
        for k, v in pairs(mixin) do
            if k ~= "__index" then cls[k] = v end
        end
    end
    return cls
end

return class
```

使用示例：

```lua
local class = require "class"

local Animal = class(nil)   -- 没有父类
function Animal:initialize(name)
    self.name = name
end
function Animal:voice() print(self.name .. " makes a sound") end

local Dog = class(Animal)
function Dog:voice() print(self.name .. " barks") end

local d = Dog:new("Rex")
d:voice()   --> Rex barks
```

---

## 6. 构造链与初始化顺序

- 如果父类也有 `initialize`，子类需要手动调用：

  ```lua
  function Dog:initialize(name, breed)
      self.super.initialize(self, name)  -- 先让父类构造
      self.breed = breed
  end
  ```

- 如果忘记把 `self` 传进去，父类会找不到字段（常见 bug）。

---

## 7. 内存与性能

| 场景         | 建议                                    |
| ------------ | --------------------------------------- |
| 元表链过长   | 不要超过 3 层，否则查找性能下降         |
| 动态增删字段 | 尽量一次性建好表，避免触发 rehash       |
| 大对象池     | 用 `table.clear` 或对象池重用实例       |
| 调试         | 在 `__index` 函数里加打印，可追踪继承链 |

---

## 8. 调试技巧

- 打印继承链：

  ```lua
  local t = Student:new()
  local mt = getmetatable(t)
  while mt do
      print(mt)
      mt = getmetatable(mt)
  end
  ```

- 开启 `debug.getmetatable` 可查看元表内容。

---

## 9. 小结（思维导图）

```txt
Lua OOP
├── 表(table)  → 实例
├── 元表(metatable.__index) → 原型/类
├── 继承
│   ├── 单继承：setmetatable(Sub, {__index = Super})
│   ├── 多重继承：__index = function 查多张表
│   └── Mixin：循环拷贝字段
├── 构造链
│   ├── new → initialize
│   └── super 手动调用
└── 封装
    ├── 模块 require
    ├── local 变量
    └── 命名约定 _private
```

---

这份笔记覆盖了从“零”到“生产可用”的所有细节：

- 复制 `class.lua` 就能用；
- 想手写也提供了最小可运行片段；
- 多重继承、调试、性能都给了可落地的做法。
