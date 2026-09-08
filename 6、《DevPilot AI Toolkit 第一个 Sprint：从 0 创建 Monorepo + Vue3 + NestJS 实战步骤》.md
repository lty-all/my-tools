# DevPilot AI Toolkit

# Sprint 1：从 0 创建 Monorepo + Vue3 + NestJS 实战步骤

> Sprint目标：
>
> **完成一个真正可运行的全栈项目骨架**
>
> 最终效果：
>
> * Vue3 前端运行 ✅
> * NestJS 后端运行 ✅
> * 前后端联调 ✅
> * PostgreSQL + Redis 可用 ✅
> * Docker 环境完成 ✅
> * Git提交规范建立 ✅
>
> 本 Sprint 不开发具体业务功能。

---

# 一、最终项目结构

完成后：

```text
devpilot-toolkit
│
├── apps
│   │
│   ├── web                 # Vue3
│   │
│   └── api                 # NestJS
│
├── packages
│   │
│   ├── types               # 共享类型
│   │
│   └── eslint-config       # 代码规范
│
├── docker
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

# 二、开发环境确认

你的环境：

```text
Windows

↓

WSL2 Ubuntu

↓

Trae

↓

pnpm

↓

Docker
```

非常适合。

---

## 检查版本

终端：

```bash
node -v
```

建议：

```text
>=20
```

---

```bash
pnpm -v
```

建议：

```text
>=9
```

---

```bash
docker -v
```

---

# 三、创建项目仓库

进入你的代码目录：

例如：

```bash
cd ~/projects
```

创建：

```bash
mkdir devpilot-toolkit

cd devpilot-toolkit
```

初始化 Git：

```bash
git init
```

---

创建：

```bash
touch README.md
```

---

第一次提交：

```bash
git add .

git commit -m "chore: init project"
```

---

# 四、初始化 pnpm Monorepo

## 1. 初始化根项目

```bash
pnpm init
```

生成：

```text
package.json
```

---

修改：

```json
{
  "name": "devpilot-toolkit",
  "version": "0.1.0",
  "private": true
}
```

---

## 2. 创建 workspace

创建：

```bash
touch pnpm-workspace.yaml
```

内容：

```yaml
packages:
  - apps/*
  - packages/*
```

---

现在：

```text
devpilot-toolkit

├── apps

└── packages
```

---

# 五、创建 Vue3 前端

进入：

```bash
mkdir apps

cd apps
```

执行：

```bash
pnpm create vite web
```

选择：

```text
Vue

TypeScript
```

---

进入：

```bash
cd web
```

安装：

```bash
pnpm install
```

测试：

```bash
pnpm dev
```

看到：

```text
Local:

http://localhost:5173
```

说明成功。

---

# 六、整理 Vue 项目结构

进入：

```bash
src
```

删除：

```text
components/HelloWorld.vue
```

创建：

```text
src

├── api

├── assets

├── components

├── layouts

├── pages

├── router

├── stores

├── hooks

├── utils

└── types
```

---

## 安装基础依赖

返回：

```bash
cd apps/web
```

安装：

### Router

```bash
pnpm add vue-router
```

### Pinia

```bash
pnpm add pinia
```

### Axios

```bash
pnpm add axios
```

---

# 七、配置 Vue Router

创建：

```text
src/router/index.ts
```

内容：

```ts
import {
  createRouter,
  createWebHistory
} from 'vue-router'


const router = createRouter({

history:createWebHistory(),

routes:[

{
 path:"/",
 component:()=>import("../pages/Home.vue")
}

]

})


export default router
```

---

创建：

```text
src/pages/Home.vue
```

内容：

```vue
<template>

<div>

<h1>
DevPilot AI Toolkit
</h1>

</div>

</template>
```

---

修改：

main.ts

```ts
import router from "./router"

app.use(router)
```

---

测试：

访问：

```
localhost:5173
```

显示：

```
DevPilot AI Toolkit
```

---

# 八、创建 NestJS 后端

回到根目录：

```bash
cd ../../
```

执行：

```bash
nest new apps/api
```

选择：

```text
pnpm
```

---

进入：

```bash
cd apps/api
```

启动：

```bash
pnpm start:dev
```

默认：

```
localhost:3000
```

返回：

```
Hello World!
```

成功。

---

# 九、整理 NestJS 架构

进入：

```text
src
```

删除：

```text
app.controller.spec.ts
```

---

创建模块：

```bash
nest g module modules/auth

nest g module modules/users

nest g module modules/tools

nest g module modules/ai

nest g module modules/history
```

---

最终：

```text
src

├── modules

│
├── auth

├── users

├── tools

├── ai

└── history


├── common

├── config

└── prisma
```

---

# 十、配置 API 前缀

main.ts

修改：

```typescript
app.setGlobalPrefix(
"api/v1"
)
```

现在：

访问：

```
localhost:3000/api/v1
```

---

# 十一、配置 Swagger

安装：

```bash
pnpm add @nestjs/swagger
```

---

main.ts：

加入：

```typescript
const config =
new DocumentBuilder()

.setTitle(
"DevPilot API"
)

.setVersion("1.0")

.build()
```

启动：

访问：

```
localhost:3000/api
```

看到接口文档。

---

# 十二、前后端联调

## 后端创建测试接口

tools.controller.ts

```typescript
@Get()
findAll(){

return [

{
id:1,
name:"JSON Formatter"
}

]

}
```

---

接口：

```
GET

/api/v1/tools
```

返回：

```json
[
 {
  "id":1,
  "name":"JSON Formatter"
 }
]
```

---

# 十三、Vue Axios封装

创建：

```text
src/api/request.ts
```

内容：

```ts
import axios from "axios"


const request =
axios.create({

baseURL:
"http://localhost:3000/api/v1"

})


export default request
```

---

测试：

```ts
request.get("/tools")
```

成功拿到数据。

---

# 十四、Docker 环境

根目录：

创建：

```text
docker-compose.yml
```

内容：

```yaml
services:

 postgres:

  image: postgres:16

  container_name: devpilot-postgres

  environment:

   POSTGRES_USER: postgres

   POSTGRES_PASSWORD: 123456

   POSTGRES_DB: devpilot


  ports:

   - "5432:5432"


 redis:

  image: redis:7

  container_name: devpilot-redis


  ports:

   - "6379:6379"
```

---

启动：

```bash
docker compose up -d
```

检查：

```bash
docker ps
```

看到：

```text
devpilot-postgres

devpilot-redis
```

---

# 十五、NestJS连接数据库

安装：

```bash
pnpm add prisma @prisma/client
```

初始化：

```bash
npx prisma init
```

生成：

```text
prisma

└── schema.prisma
```

---

修改：

.env

```env
DATABASE_URL=
"postgresql://postgres:123456@localhost:5432/devpilot"
```

---

# 十六、创建第一个 Prisma Model

schema.prisma：

```prisma
model User {

 id Int @id @default(autoincrement())

 email String @unique

 createdAt DateTime @default(now())

}
```

---

迁移：

```bash
npx prisma migrate dev
```

---

生成：

```text
数据库User表
```

---

# 十七、创建共享类型 package

回根目录：

```bash
mkdir packages/types
```

结构：

```text
packages/types

src

└── user.ts
```

---

user.ts：

```ts
export interface User {

id:number

email:string

}
```

---

# 十八、配置根命令

根 package.json：

```json
{
"scripts":{

"dev:web":
"pnpm --filter web dev",

"dev:api":
"pnpm --filter api start:dev"

}
}
```

---

启动：

前端：

```bash
pnpm dev:web
```

后端：

```bash
pnpm dev:api
```

---

# 十九、Git提交规划

完成 Sprint 1：

提交：

```bash
git add .

git commit -m "feat: setup fullstack monorepo"
```

目录：

```text
commit history


chore: init project

feat: setup vue app

feat: setup nest api

feat: add docker environment

feat: add prisma database

feat: setup api communication
```

---

# 二十、Sprint 1完成检查表

## 工程

| 项目             | 完成 |
| -------------- | -- |
| pnpm workspace | ✅  |
| Vue3           | ✅  |
| NestJS         | ✅  |
| Git            | ✅  |

---

## 后端

| 项目         | 完成 |
| ---------- | -- |
| 模块结构       | ✅  |
| Swagger    | ✅  |
| API Prefix | ✅  |

---

## 数据库

| 项目         | 完成 |
| ---------- | -- |
| PostgreSQL | ✅  |
| Prisma     | ✅  |
| Migration  | ✅  |

---

## 前端

| 项目     | 完成  |
| ------ | --- |
| Router | ✅   |
| Pinia  | 待使用 |
| Axios  | ✅   |

---

## DevOps

| 项目             | 完成 |
| -------------- | -- |
| Docker Compose | ✅  |
| Redis          | ✅  |

---

# Sprint 1结束后，你已经拥有：

一个真正企业级结构：

```
Vue3

    ↓ HTTP

NestJS

    ↓ Prisma

PostgreSQL

    ↓

Redis

    ↓

Docker
```

这已经不是 Demo，而是 SaaS 产品基础架构。

---

# Sprint 2 下一步

进入：

# 《DevPilot AI Toolkit Sprint 2：用户系统 + 第一个工具 JSON Formatter 完整实现》

会开始写真正业务：

* NestJS Auth模块
* JWT登录
* Prisma User表
* Vue登录页面
* JSON Formatter工具
* 前后端完整闭环

完成 Sprint 2 后，你的网站已经具备第一个可用版本。
