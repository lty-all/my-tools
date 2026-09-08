# DevPilot AI Toolkit

# 数据库详细设计 + API 接口文档（V1.0）

> 目标：
>
> 支撑 **AI Developer Toolkit SaaS MVP** 上线。
>
> 第一版重点：
>
> * 用户体系
> * 工具中心
> * AI调用
> * 使用记录
> * 免费额度控制
> * 会员体系预留
> * SEO内容管理预留
>
> 技术：
>
> * PostgreSQL
> * Prisma ORM
> * NestJS REST API

---

# 一、数据库整体设计

## ER关系图

```text
                 User
                  |
        --------------------
        |                  |
   ToolHistory        Subscription
        |
        |
      Tool


User
 |
 |
AIUsage


Tool
 |
 |
ToolCategory
```

---

# 二、数据库表设计

---

# 1. User 用户表

## 用途

保存注册用户。

支持：

* GitHub 登录
* Google 登录
* Email 登录

---

## Prisma Schema

```prisma
model User {

  id Int @id @default(autoincrement())


  email String @unique

  username String?


  avatar String?


  provider String
  // github/google/email


  providerId String?


  role UserRole @default(USER)


  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt


  histories ToolHistory[]

  aiUsages AIUsage[]

  subscription Subscription?

}
```

---

## 示例数据

| 字段       | 值                                       |
| -------- | --------------------------------------- |
| id       | 1                                       |
| email    | [test@gmail.com](mailto:test@gmail.com) |
| provider | google                                  |
| role     | USER                                    |

---

# 2. Tool 工具表

## 用途

存储所有工具。

例如：

JSON Formatter

JWT Decoder

AI Code Explain

---

```prisma
model Tool {


id Int @id @default(autoincrement())


name String


slug String @unique


description String


categoryId Int


icon String?


isAI Boolean @default(false)


isPublished Boolean @default(true)


createdAt DateTime @default(now())


category ToolCategory @relation(
fields:[categoryId],
references:[id]
)


histories ToolHistory[]

}
```

---

## 数据示例

| name            | slug            | AI    |
| --------------- | --------------- | ----- |
| JSON Formatter  | json-formatter  | false |
| AI Code Explain | ai-code-explain | true  |

---

# 3. ToolCategory 工具分类

例如：

```text
Code Tools

AI Tools

Converter

Generator
```

Schema：

```prisma
model ToolCategory {


id Int @id @default(autoincrement())


name String


slug String @unique


sort Int @default(0)


tools Tool[]

}
```

---

数据：

| id | name       |
| -- | ---------- |
| 1  | Code Tools |
| 2  | AI Tools   |
| 3  | Generator  |

---

# 4. ToolHistory 使用记录

## 用途

保存：

用户使用过什么工具。

例如：

用户：

JSON格式化100次。

---

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

# 5. AIUsage AI调用记录

## 用途

控制：

免费额度。

统计：

Token消耗。

---

```prisma
model AIUsage {


id Int @id @default(autoincrement())


userId Int


model String


tokens Int


feature String


createdAt DateTime @default(now())


user User @relation(
fields:[userId],
references:[id]
)

}
```

---

示例：

```text
user:

tiYu


调用:

DeepSeek


功能:

code-explain


tokens:

1200
```

---

# 6. Subscription 会员表

未来 Stripe 使用。

```prisma
model Subscription {


id Int @id @default(autoincrement())


userId Int @unique


plan PlanType


stripeCustomerId String?


stripeSubscriptionId String?


status String


expireAt DateTime?


createdAt DateTime @default(now())


user User @relation(
fields:[userId],
references:[id]
)

}
```

---

会员：

```text
FREE

PRO

TEAM
```

---

# 7. ApiKey API密钥表（预留）

未来：

开放 API。

---

```prisma
model ApiKey {


id Int @id @default(autoincrement())


userId Int


key String @unique


name String


lastUsedAt DateTime?


createdAt DateTime @default(now())

}
```

---

# 8. Blog SEO内容表（预留）

SEO非常重要。

例如：

文章：

"How to format JSON"

---

```prisma
model Article {


id Int @id @default(autoincrement())


title String


slug String @unique


content String


description String


published Boolean


createdAt DateTime @default(now())

}
```

---

# 三、枚举设计

## 用户角色

```prisma
enum UserRole {

 USER

 ADMIN

}
```

---

## 套餐

```prisma
enum PlanType {


FREE


PRO


TEAM


}
```

---

# 四、完整数据库关系

```text

User

 |
 |
 +------------ ToolHistory

 |
 |
 +------------ AIUsage


 |
 |
 +------------ Subscription



ToolCategory

 |

Tool

 |

ToolHistory


```

---

# 五、API设计规范

统一：

```
/api/v1
```

例如：

```
GET

/api/v1/tools
```

---

# 六、认证模块 API

## 1. 获取当前用户

GET

```
/api/v1/auth/me
```

返回：

```json
{
"id":1,
"email":"test@gmail.com",
"role":"USER"
}
```

---

## 2. Google登录

GET

```
/api/v1/auth/google
```

流程：

```text
用户点击

↓

Google OAuth

↓

回调

↓

生成JWT

↓

登录成功
```

---

# 七、工具模块 API

---

# 1. 获取工具列表

GET

```
/api/v1/tools
```

参数：

```
?page=1

&category=ai
```

返回：

```json
{
"data":[

{
"id":1,

"name":"JSON Formatter",

"slug":"json"

}

]

}
```

---

# 2. 获取工具详情

GET

```
/api/v1/tools/:slug
```

例如：

```
/tools/json-formatter
```

返回：

```json
{
"name":"JSON Formatter",

"description":"Format JSON online",

"isAI":false
}
```

---

# 八、工具执行 API

## JSON Formatter

POST

```
/api/v1/tools/json/execute
```

请求：

```json
{
"input":
"{\"name\":\"test\"}"
}
```

返回：

```json
{
"result":
{
"name":"test"
}
}
```

---

# 九、AI模块 API

---

## 1. AI代码解释

POST

```
/api/v1/ai/explain
```

请求：

```json
{

"code":

"function test(){}"


}
```

返回：

```json
{

"result":

"这个函数作用是..."

}
```

---

## 2. AI错误分析

POST

```
/api/v1/ai/debug
```

请求：

```json
{

"error":

"npm install error"


}
```

返回：

```json
{

"reason":"版本冲突",

"solution":

"执行..."

}
```

---

## 3. AI Commit生成

POST

```
/api/v1/ai/commit
```

请求：

```json
{

"diff":

"+ add login"

}
```

返回：

```json
{

"message":

"feat: add user login"

}
```

---

# 十、历史记录 API

## 获取历史

GET

```
/api/v1/history
```

返回：

```json
[
{
"tool":"json",

"time":"2026-07-30"
}
]
```

---

## 删除历史

DELETE

```
/api/v1/history/:id
```

---

# 十一、会员 API

## 当前套餐

GET

```
/api/v1/subscription
```

返回：

```json
{

"plan":"PRO",

"expireAt":

"2026-12-01"

}
```

---

## 创建支付订单

POST

```
/api/v1/payment/create
```

请求：

```json
{
"plan":"PRO"
}
```

返回：

```json
{

"url":

"stripe checkout url"

}
```

---

# 十二、AI额度控制设计

免费用户：

```text
每天5次AI
```

逻辑：

请求AI：

↓

查询：

```sql
AIUsage
```

↓

判断：

```text
今天次数 < 5
```

↓

调用模型。

---

NestJS：

伪代码：

```typescript
async checkLimit(userId){


const count =
await usage.countToday(userId)


if(count>=5){

throw Error(
"Daily limit reached"
)

}

}
```

---

# 十三、NestJS模块对应

最终：

```
src

├── auth

│

├── users

│

├── tools

│

├── ai

│

├── history

│

├── subscription

│

├── payment

│

├── prisma

│

└── common

```

---

# 十四、V1开发优先级

不要全部实现。

## 第一阶段（必须）

数据库：

✅ User

✅ Tool

✅ ToolCategory

✅ ToolHistory

API：

✅ 登录

✅ 工具列表

✅ 工具执行

---

## 第二阶段

增加：

✅ AIUsage

✅ AI模块

✅ 限流

---

## 第三阶段

增加：

✅ Subscription

✅ Stripe

✅ ApiKey

---

# 十五、你的第一版实际落地顺序

我建议：

## Day 1

创建项目：

```bash
pnpm create turbo
```

生成：

```
apps/web

apps/api
```

---

## Day 2-3

完成：

NestJS：

* Prisma
* PostgreSQL
* User

Vue：

* Layout
* Router
* Login

---

## Day 4-7

完成：

工具系统：

```text
JSON Formatter

JWT Decoder

Base64

UUID

Regex
```

---

## Day 8-14

接 AI：

```text
AI Code Explain

AI Error Fix

AI Commit
```

---

## Day 15-30

部署：

```text
Docker

Nginx

Cloudflare

Domain

SEO
```

---

# 下一步建议：

继续设计第四份：

**《DevPilot AI Toolkit 前后端代码架构 + Monorepo 初始化方案》**

这份会直接回答：

* pnpm workspace 怎么建
* TurboRepo 是否需要
* NestJS 初始化命令
* Vue 初始化命令
* Docker Compose 文件
* Trae 开发流程
* Git 分支规范

完成后基本可以直接开工。你目前的 2核2G 服务器也完全能够承载 V1。
