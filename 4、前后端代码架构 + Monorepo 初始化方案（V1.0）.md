# DevPilot AI Toolkit

# 前后端代码架构 + Monorepo 初始化方案（V1.0）

> 目标：
>
> 建立一个**适合个人独立开发、未来可扩展 SaaS 的工程架构**。
>
> 技术方向：
>
> * 前端：Vue3 + TypeScript
> * 后端：NestJS + Prisma
> * 工程化：pnpm workspace
> * 可选增强：TurboRepo
> * 部署：Docker Compose
> * 开发工具：Trae / VS Code / IDEA 均可

---

# 一、为什么选择 Monorepo？

## 传统方式

两个仓库：

```
github
│
├── devpilot-web

└── devpilot-api
```

问题：

例如用户类型：

后端：

```typescript
class UserDto {

 id:number

 email:string

}
```

前端：

```typescript
interface User {

 id:number

 email:string

}
```

两个地方维护。

---

# Monorepo方式

一个仓库：

```
devpilot-toolkit

├── web

├── api

└── shared
```

共享：

```typescript
export interface User {

 id:number

 email:string

}
```

前后端同步。

---

对于你这种：

> 一个开发者 + AI辅助开发 + 长期迭代

Monorepo 更合适。

---

# 二、最终项目结构

推荐：

```
devpilot-toolkit

│

├── apps
│
│   ├── web
│   │
│   │   Vue3 前端
│   │
│   │
│   └── api
│
│       NestJS 后端
│
│
├── packages
│
│   ├── types
│   │
│   │   前后端共享类型
│
│   ├── ui
│   │
│   │   公共组件
│
│   └── config
│
│
├── docker
│
│
├── docker-compose.yml
│
├── package.json
│
├── pnpm-workspace.yaml
│
└── README.md
```

---

# 三、为什么不用 Turborepo？

很多教程会直接：

```
TurboRepo
+
pnpm
```

但是对于你的第一版：

我建议：

> **先 pnpm workspace，暂时不要 Turbo。**

原因：

你的项目：

```
Vue

NestJS

几个package
```

复杂度不高。

Turbo解决的是：

* 大型项目缓存
* 多应用构建优化
* CI加速

现在没有必要。

---

以后：

用户：

```
10万+

多个前端应用

多个服务
```

再加入。

---

# 四、初始化项目

## 1. 创建目录

```bash
mkdir devpilot-toolkit

cd devpilot-toolkit
```

---

## 2. 初始化 pnpm

```bash
pnpm init
```

生成：

```
package.json
```

---

# 五、配置 pnpm workspace

创建：

```
pnpm-workspace.yaml
```

内容：

```yaml
packages:

  - apps/*

  - packages/*
```

---

目录：

```
apps

packages
```

都会被 pnpm 管理。

---

# 六、初始化 Vue 前端

进入：

```bash
mkdir apps

cd apps
```

创建：

```bash
pnpm create vite web
```

选择：

```
Vue

TypeScript
```

进入：

```bash
cd web
```

安装：

```bash
pnpm install
```

---

最终：

```
apps/web

├── src

├── package.json

└── vite.config.ts
```

---

# 七、Vue前端架构设计

最终：

```
web/src

│

├── api

│   接口请求


├── assets


├── components

│   公共组件


├── layouts

│   页面布局


├── pages

│


├── router


├── stores


├── hooks


├── utils


└── types

```

---

## 页面设计

```
pages


├── Home.vue


├── Tools.vue


├── ToolDetail.vue


├── Login.vue


├── Dashboard.vue


└── Pricing.vue

```

---

# 八、安装前端依赖

## Router

```bash
pnpm add vue-router
```

---

## Pinia

```bash
pnpm add pinia
```

---

## Axios

```bash
pnpm add axios
```

---

## UI方案

推荐：

```
TailwindCSS
+
shadcn-vue
```

原因：

海外 SaaS 产品大量使用。

安装：

```bash
pnpm add tailwindcss
```

---

# 九、初始化 NestJS

回到根目录：

```bash
cd ../../
```

安装：

```bash
pnpm add -g @nestjs/cli
```

创建：

```bash
nest new apps/api
```

选择：

```
pnpm
```

---

结构：

```
apps/api


src


├── auth


├── users


├── tools


├── ai


├── history


├── prisma


main.ts

app.module.ts

```

---

# 十、NestJS模块设计

## auth

负责：

```
登录

JWT

OAuth

权限
```

---

## users

负责：

```
用户信息

个人中心
```

---

## tools

负责：

```
JSON

JWT

Regex

SQL
```

---

## ai

负责：

```
AI调用

模型管理

额度控制
```

---

## history

负责：

```
使用历史
```

---

# 十一、数据库接入

安装 Prisma：

进入 api：

```bash
cd apps/api
```

```bash
pnpm add prisma @prisma/client
```

初始化：

```bash
npx prisma init
```

生成：

```
prisma

└── schema.prisma
```

---

# 十二、共享类型 package

创建：

```
packages/types
```

结构：

```
packages/types

├── src

│   ├── user.ts

│   ├── tool.ts

│   └── ai.ts

└── package.json
```

---

例如：

user.ts

```typescript
export interface User {


id:number


email:string


avatar?:string


}
```

---

前端：

```typescript
import {

User

}

from "@devpilot/types"
```

---

后端：

```typescript
import {

User

}

from "@devpilot/types"
```

---

# 十三、根 package.json

最终：

```json
{

"name":"devpilot-toolkit",


"private":true,


"scripts":{


"dev":"pnpm --parallel dev",


"build":"pnpm --recursive build"


}

}
```

---

执行：

启动全部：

```bash
pnpm dev
```

同时启动：

```
Vue

Nest
```

---

# 十四、环境变量设计

不要写死。

根目录：

```
.env
```

---

## 前端

```
VITE_API_URL=http://localhost:3000
```

---

## 后端

```
DATABASE_URL=

JWT_SECRET=

OPENAI_KEY=

DEEPSEEK_KEY=

STRIPE_KEY=
```

---

# 十五、本地开发流程

你的环境：

```
Windows

↓

WSL Ubuntu

↓

Trae

↓

pnpm

↓

Docker
```

---

启动数据库：

```bash
docker compose up postgres redis
```

启动项目：

```bash
pnpm dev
```

---

# 十六、Docker设计

docker-compose.yml

```yaml
services:


 postgres:

  image:postgres


  environment:

   POSTGRES_PASSWORD:123456


  ports:

   - 5432:5432



 redis:

  image:redis


  ports:

   - 6379:6379

```

---

# 十七、Git规范

推荐：

main

生产：

```
main
```

---

develop

开发：

```
develop
```

---

feature：

```
feature/json-tool

feature/ai-module
```

---

提交：

使用：

Conventional Commit

例如：

新增：

```
feat: add json formatter
```

修复：

```
fix: fix jwt decode issue
```

优化：

```
refactor: optimize ai service
```

---

# 十八、Trae开发方式（重点）

不要：

> “帮我生成整个项目”

容易失控。

推荐：

---

## 第一步

让 Trae：

```
创建 monorepo 基础结构
```

---

## 第二步

```
实现 NestJS 用户模块

要求：

REST API

Prisma

JWT
```

---

## 第三步

```
实现 Vue 登录页面

要求：

Vue3

Composition API

TypeScript
```

---

## 第四步

一个模块一个模块。

例如：

```
实现 JSON Formatter Tool

要求：

支持格式化

错误提示

复制

历史记录

单元测试
```

---

# 十九、第一版开发顺序（非常重要）

不要乱。

## Sprint 1

工程基础：

✅ Monorepo

✅ Vue

✅ Nest

✅ Docker

✅ PostgreSQL

---

## Sprint 2

用户：

✅ 注册

✅ 登录

✅ 用户中心

---

## Sprint 3

工具：

✅ JSON

✅ JWT

✅ Regex

✅ Base64

---

## Sprint 4

AI：

✅ Code Explain

✅ Error Fix

✅ Commit

---

## Sprint 5

上线：

✅ Docker部署

✅ Nginx

✅ Cloudflare

✅ SEO

---

# 二十、针对你的情况的最终建议

你的现状：

* 4年前端
* Vue 熟悉
* TS 正在加强
* 后端经验不足
* 已经玩过 Docker / Jenkins / 云服务器
* 有 AI 工具使用经验

所以这个项目最大的价值不是马上赚钱，而是：

一次性补齐：

```
前端高级能力
+
Node后端
+
数据库
+
AI工程
+
DevOps
+
海外SaaS
```

最终你的简历可以形成：

> 独立设计并开发 AI Developer Toolkit SaaS 平台，采用 Vue3 + NestJS + PostgreSQL + Docker 部署，支持 AI 多模型调用、用户体系、会员订阅和海外部署。

这对于你准备后续跳槽（尤其 5 年左右前端岗位）会非常有价值。

---

下一步建议继续设计：

**《DevPilot AI Toolkit 第一阶段开发任务拆解（30天执行计划）》**

会细化到：

* 每天做什么
* 每个 Commit 做什么
* Trae 每一步应该输入什么 Prompt
* 哪些地方必须自己写，不要交给 AI

这样可以直接进入开发阶段。
