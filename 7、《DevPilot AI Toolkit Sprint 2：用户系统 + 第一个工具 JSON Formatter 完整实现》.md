# DevPilot AI Toolkit

# Sprint 2：用户系统 + 第一个工具 JSON Formatter 完整实现

> Sprint目标：
>
> 在 Sprint 1 基础上，实现第一个完整业务闭环：
>
> ```
> 用户访问网站
>       ↓
> 注册/登录
>       ↓
> 进入工具中心
>       ↓
> 使用 JSON Formatter
>       ↓
> 保存使用记录
>       ↓
> 查看历史
> ```
>
> 完成后，你的项目从：
>
> **工程骨架**
>
> 变成：
>
> **真正可用 SaaS MVP**

---

# 一、Sprint 2 最终效果

完成：

## 用户系统

支持：

✅ 注册
✅ 登录
✅ JWT认证
✅ 用户信息获取
✅ 路由保护

---

## 工具系统

完成第一个工具：

> JSON Formatter

支持：

输入：

```json
{"name":"devpilot","age":27}
```

输出：

```json
{
  "name": "devpilot",
  "age": 27
}
```

功能：

✅ 格式化

✅ 压缩

✅ 错误提示

✅ 复制

✅ 历史记录

---

# 二、本 Sprint 技术范围

后端：

```
NestJS

├── auth

├── users

├── tools

├── history

└── prisma
```

数据库：

新增：

```
User

Tool

ToolHistory
```

前端：

新增：

```
pages

├── Login.vue

├── Register.vue

├── Tools.vue

└── JsonFormatter.vue
```

---

# 三、数据库设计

## User表

最终：

```prisma
model User {

  id Int @id @default(autoincrement())

  email String @unique

  password String

  username String?

  avatar String?

  createdAt DateTime @default(now())

  histories ToolHistory[]

}
```

---

## Tool表

```prisma
model Tool {


id Int @id @default(autoincrement())


name String


slug String @unique


description String


createdAt DateTime @default(now())


histories ToolHistory[]

}
```

---

## ToolHistory

```prisma
model ToolHistory {


id Int @id @default(autoincrement())


userId Int


toolId Int


input String


output String


createdAt DateTime @default(now())


user User @relation(
fields:[userId],
references:[id]
)


tool Tool @relation(
fields:[toolId],
references:[id]
)

}
```

---

执行：

```bash
npx prisma migrate dev --name add_user_tool
```

---

# 四、后端用户系统实现

---

# Day 1：安装认证依赖

进入：

```
apps/api
```

安装：

```bash
pnpm add @nestjs/jwt passport passport-jwt bcrypt
```

类型：

```bash
pnpm add -D @types/bcrypt
```

---

# 五、Auth模块设计

目录：

```
auth

├── auth.controller.ts

├── auth.service.ts

├── jwt.strategy.ts

├── guards

│   └── jwt.guard.ts

└── dto

    ├── login.dto.ts

    └── register.dto.ts
```

---

# 六、注册接口

接口：

```
POST

/api/v1/auth/register
```

请求：

```json
{
"email":"test@gmail.com",

"password":"123456"
}
```

---

## DTO

register.dto.ts

```typescript
export class RegisterDto {


email:string;


password:string;


}
```

---

# 七、Auth Service

逻辑：

```
接收用户信息

↓

密码bcrypt加密

↓

保存数据库

↓

返回用户
```

---

代码：

```typescript
async register(dto:RegisterDto){


const hash =
await bcrypt.hash(
dto.password,
10
)


return this.prisma.user.create({

data:{

email:dto.email,

password:hash

}

})


}
```

---

# 八、登录接口

接口：

```
POST

/api/v1/auth/login
```

请求：

```json
{
"email":"test@gmail.com",

"password":"123456"
}
```

返回：

```json
{
"access_token":
"xxxxx"
}
```

---

流程：

```
用户密码

↓

bcrypt比较

↓

生成JWT

↓

返回token
```

---

# 九、JWT设计

payload：

```json
{
"id":1,
"email":"test@gmail.com"
}
```

---

token保存：

前端：

```
localStorage
```

或者：

```
httpOnly cookie
```

MVP：

先 localStorage。

---

# 十、用户信息接口

接口：

```
GET

/api/v1/auth/me
```

请求：

Header:

```
Authorization:

Bearer token
```

返回：

```json
{
"id":1,

"email":"test@gmail.com"
}
```

---

# 十一、前端登录页面

创建：

```
pages/Login.vue
```

结构：

```
Login.vue

<form>

邮箱输入

密码输入

登录按钮

</form>
```

---

调用：

```typescript
await login({

email,

password

})
```

---

保存：

```typescript
localStorage.setItem(

"token",

token

)
```

---

# 十二、Axios自动携带Token

修改：

```
src/api/request.ts
```

增加：

```typescript
request.interceptors.request.use(

config=>{


const token =
localStorage.getItem(
"token"
)


if(token){

config.headers.Authorization =
`Bearer ${token}`

}


return config

}

)
```

---

# 十三、第一个工具：JSON Formatter

## 产品页面

路径：

```
/tools/json-formatter
```

页面：

```
---------------------------------

JSON Formatter


输入区域


[ Format ]


输出区域


[Copy]


---------------------------------

使用说明

FAQ

SEO内容


```

---

# 十四、前端实现

组件：

```
components/tools

└── JsonFormatter.vue
```

---

状态：

```typescript
const input =
ref("")


const output =
ref("")
```

---

格式化：

```typescript
function formatJSON(){


try{


const obj =
JSON.parse(input.value)


output.value =
JSON.stringify(
obj,
null,
2
)


}catch(e){

error.value =
"Invalid JSON"

}


}
```

---

复制：

```typescript
navigator.clipboard.writeText(

output.value

)
```

---

# 十五、后端工具接口

接口：

```
POST

/api/v1/tools/json/execute
```

请求：

```json
{
"input":

"{\"name\":\"test\"}"
}
```

---

返回：

```json
{
"result":

"{\n \"name\":\"test\"\n}"

}
```

---

# 十六、NestJS Tool模块

结构：

```
tools

├── tools.controller.ts

├── tools.service.ts

└── dto

    └── execute-tool.dto.ts
```

---

Controller：

```typescript
@Post(
"json/execute"
)

execute(

@Body()
dto:ExecuteToolDto

){


return this.service.formatJSON(
dto.input
)


}
```

---

Service：

```typescript
formatJSON(input:string){


const obj =
JSON.parse(input)


return {

result:

JSON.stringify(
obj,
null,
2
)

}


}
```

---

# 十七、保存历史记录

用户登录状态：

获取：

```
req.user.id
```

保存：

```typescript
await prisma.toolHistory.create({

data:{


userId:user.id,


toolId:1,


input,


output


}

})
```

---

数据库：

增加：

```
ToolHistory
```

---

# 十八、工具列表

接口：

```
GET

/api/v1/tools
```

返回：

```json
[
{
"name":

"JSON Formatter",

"slug":

"json-formatter"
}
]
```

---

前端：

Tools.vue

展示：

```
卡片列表

JSON Formatter

JWT Decoder

Regex Tester
```

---

# 十九、路由设计

最终：

```
/


首页


/login


登录


/register


注册


/tools


工具列表


/tools/json-formatter


JSON工具


/dashboard


用户中心

```

---

# 二十、增加路由守卫

例如：

Dashboard：

未登录：

跳：

```
/login
```

---

router：

```typescript
router.beforeEach(

(to)=>{


const token =
localStorage.getItem(
"token"
)


if(

to.meta.auth &&
!token

){

return "/login"

}


}

)
```

---

# 二十一、Sprint 2 Trae 使用 Prompt

## 创建 Auth

不要：

> 帮我实现登录

应该：

```
请实现NestJS auth模块。

要求：

1. JWT认证
2. bcrypt密码加密
3. Prisma User模型
4. DTO参数校验
5. REST API
6. 添加Swagger文档

先分析设计，再生成代码。
```

---

## 创建 JSON Formatter

```
实现JSON Formatter工具。

技术：

Vue3
Composition API
TypeScript

要求：

1. 输入JSON
2. 格式化
3. 错误提示
4. 一键复制
5. 调用NestJS API
6. 保存用户历史记录

组件不要超过300行。
```

---

# 二十二、Sprint 2 Git提交规划

建议：

## Commit 1

```
feat: add user authentication
```

包含：

* JWT
* Register
* Login

---

## Commit 2

```
feat: add tool system
```

包含：

* Tool API
* Tool列表

---

## Commit 3

```
feat: add json formatter
```

包含：

* Vue页面
* API
* History

---

# 二十三、Sprint 2完成检查表

## 用户

| 功能   | 完成 |
| ---- | -- |
| 注册   | ✅  |
| 登录   | ✅  |
| JWT  | ✅  |
| 获取用户 | ✅  |

---

## 工具

| 功能             | 完成 |
| -------------- | -- |
| 工具列表           | ✅  |
| JSON Formatter | ✅  |
| 错误提示           | ✅  |
| 复制             | ✅  |

---

## 数据

| 功能       | 完成 |
| -------- | -- |
| User表    | ✅  |
| Tool表    | ✅  |
| History表 | ✅  |

---

# 二十四、完成 Sprint 2 后你的项目状态

从：

```
空项目
```

变成：

```
DevPilot AI Toolkit


首页

↓

登录

↓

工具中心

↓

JSON Formatter

↓

用户历史
```

已经具备：

* 产品形态
* 用户闭环
* 数据闭环
* 第一个 SEO 页面

---

# Sprint 3 下一步

建议进入：

# 《DevPilot AI Toolkit Sprint 3：AI模块设计与多模型接入（DeepSeek / Gemini / GLM）》

重点：

* AI Provider 架构
* OpenAI Compatible API封装
* DeepSeek接入
* GLM接入
* Token统计
* 免费额度限制
* AI Code Explain完整实现

这一阶段会真正体现“AI Developer Toolkit”的核心价值。你之前购买过 GLM、配置过 OpenCode，这部分经验可以直接迁移到产品中。
