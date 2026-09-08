# DevPilot AI Toolkit

> 小而美的开发者工具箱：免登录 · 本地处理 · 中英双语

DevPilot AI Toolkit 当前为**纯前端工具站**：常用开发者工具（JSON 格式化、JWT 解码、正则测试等）、本地隐私工具（字幕时间轴调整、视频转 GIF、EXIF 清理，文件全程不出浏览器）与规划中的 AI 能力（代码解释、报错修复、Commit 生成）。工具列表内置本地注册表，无需后端即可完整运行；NestJS 后端为可选扩展（用户体系、使用历史、AI 额度控制与后续商业化）。

---

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3 + TypeScript + Vite + Vue Router + ffmpeg.wasm（纯静态站点，可脱离后端独立运行） |
| i18n | 轻量自研（zh / en，localStorage 持久化，导航栏一键切换） |
| 后端 | NestJS + Prisma ORM（可选扩展，当前前端不依赖） |
| 数据库 | PostgreSQL 16 + Redis 7 |
| AI | 统一 AIProvider 接口（DeepSeek / GLM / Gemini / OpenAI 兼容） |
| 工程 | pnpm workspace Monorepo + Docker Compose |
| 部署（规划） | Nginx + Cloudflare + Jenkins CI/CD |

## 架构

```
用户 → Cloudflare → Nginx → Vue 静态文件
                          → NestJS API → Prisma ORM → PostgreSQL
                                       → Redis
                                       → AI Provider → DeepSeek / GLM / Gemini
```

## 目录结构

```
devpilot-toolkit
├── apps
│   ├── web                    # Vue3 前端（纯静态工具站）
│   │   └── src
│   │       ├── components    # 通用组件（ToolIcon）
│   │       ├── data           # 本地工具注册表（前端内置，不依赖后端）
│   │       ├── i18n           # 中英双语文案（zh / en + 切换）
│   │       ├── layouts        # 布局组件
│   │       ├── pages          # 页面（Home / Tools / JsonFormatter / SubtitleResync / VideoToGif / ExifCleaner）
│   │       ├── router         # 路由
│   │       └── utils          # 字幕 / EXIF 纯前端处理逻辑
│   └── api                    # NestJS 后端
│       ├── prisma             # schema.prisma（8 张表）
│       └── src
│           ├── modules
│           │   ├── auth       # 认证（骨架，待实现）
│           │   ├── users      # 用户（骨架，待实现）
│           │   ├── tools      # 工具列表 + JSON 格式化接口（已实现）
│           │   ├── ai         # AI 能力（骨架，待实现）
│           │   └── history    # 使用历史（骨架，待实现）
│           └── prisma         # PrismaService 封装
├── packages
│   └── types                  # 前后端共享类型定义
├── docker-compose.yml         # postgres:16 + redis:7 开发环境
├── pnpm-workspace.yaml
└── package.json
```

## 工具清单

### 免费工具（规划 5 个）

| 工具 | Slug | 状态 |
| --- | --- | --- |
| JSON Formatter | `json-formatter` | ✅ 已实现（前端页面 + 后端接口） |
| JWT Decoder | `jwt-decoder` | 🔜 待开发 |
| Regex Tester | `regex-tester` | 🔜 待开发 |
| Timestamp Converter | `timestamp-converter` | 🔜 待开发 |
| Diff Checker | `diff-checker` | 🔜 待开发 |

### 本地隐私工具（规划 3 个）

> 文件全程留在浏览器本地处理，不上传服务器。

| 工具 | Slug | 状态 |
| --- | --- | --- |
| Subtitle Resync（字幕时间轴调整） | `subtitle-resync` | ✅ 已实现（纯前端本地处理） |
| Video to GIF（视频转 GIF） | `video-to-gif` | ✅ 已实现（ffmpeg.wasm 本地转换） |
| EXIF Cleaner（照片元数据清理） | `exif-cleaner` | ✅ 已实现（纯前端本地处理） |

### AI 工具（规划 3 个）

| 工具 | Slug | 状态 |
| --- | --- | --- |
| AI Code Explain | `ai-code-explain` | 🔜 待开发 |
| AI Error Fix | `ai-error-fix` | 🔜 待开发 |
| AI Commit Generator | `ai-commit-generator` | 🔜 待开发 |

> 前端已内置本地工具注册表（`apps/web/src/data/tools.ts`），页面数据不依赖后端接口；后端 `GET /api/v1/tools` 注册表保留作为可选扩展。已上线工具：JSON Formatter、Subtitle Resync、Video to GIF、EXIF Cleaner（本地隐私工具计算全部在前端完成，Video to GIF 依赖 `ffmpeg.wasm`，构建时由 `copy:ffmpeg` 脚本将核心文件拷贝至 `public/ffmpeg/`）。

## 数据库设计（Prisma）

| 表 | 用途 | 阶段 |
| --- | --- | --- |
| User | 用户（GitHub / Google / Email 登录） | MVP |
| ToolCategory | 工具分类 | MVP |
| Tool | 工具元数据 | MVP |
| ToolHistory | 用户使用记录 | MVP |
| AIUsage | AI 调用与 Token 统计、额度控制 | Sprint 3 |
| Subscription | 会员（Stripe） | 后续 |
| ApiKey | 开放 API（预留） | 后续 |
| Article | SEO 博客内容（预留） | 后续 |

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装与启动（纯前端即可运行）

```bash
# 1. 安装依赖
pnpm install

# 2. 启动前端开发服务（无需数据库 / 后端）
pnpm dev:web      # http://localhost:5173

# 3.（可选）启动后端 + 数据库
docker compose up -d
cp apps/api/.env apps/api/.env.local   # 按需修改 DATABASE_URL / JWT_SECRET 等
pnpm db:migrate
pnpm dev:api      # http://localhost:3000
```

### 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 并行启动前端 + 后端 |
| `pnpm dev:web` | 启动 Vue 前端 |
| `pnpm dev:api` | 启动 NestJS 后端（watch 模式） |
| `pnpm build` | 构建全部子包 |
| `pnpm db:migrate` | 执行 Prisma 迁移 |
| `pnpm db:studio` | 打开 Prisma Studio 管理数据 |

## API 规范

- 统一前缀：`/api/v1`
- 认证：JWT（Bearer Token）
- 文档：Swagger（NestJS 集成）
- 模块：`auth` / `users` / `tools` / `ai` / `history` / `subscription` / `payment`

### 已实现接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/tools` | 获取工具列表 |
| POST | `/api/v1/tools/json/execute` | JSON 格式化 |

## 开发路线（30 天计划）

- **Sprint 1（已完成）**：Monorepo 骨架 + Vue3 + NestJS + Prisma + Docker + 前后端联调
- **Sprint 2（进行中）**：用户系统（注册/登录/JWT）+ JSON Formatter 闭环 + 补齐免费工具 + 本地隐私工具线
- **Sprint 3**：AI Provider 架构 + Code Explain / Error Fix / Commit Generator + 额度限制
- **Sprint 4**：生产部署（Docker + Nginx + Cloudflare + Jenkins CI/CD）+ SEO + 正式发布
- **后续**：Stripe 会员（FREE / PRO $9 / TEAM $29）、开放 API、广告、Affiliate

## 设计文档索引

| 编号 | 文档 |
| --- | --- |
| 00 | 项目开发总结与步骤梳理.md |
| 1 | 产品 PRD.md |
| 2 | 技术设计文档（TDD）.md |
| 3 | 数据库详细设计 + API接口文档.md |
| 4 | 前后端代码架构 + Monorepo 初始化方案（V1.0）.md |
| 5 | 第一阶段开发任务拆解（30天执行计划）.md |
| 6 | Sprint 1：Monorepo + Vue3 + NestJS 实战步骤.md |
| 7 | Sprint 2：用户系统 + 第一个工具 JSON Formatter.md |
| 8 | AI模块设计与多模型接入.md |
| 9 | Docker生产部署 + Nginx + Cloudflare + Jenkins CICD.md |

## Git 规范

- Conventional Commit：`feat` / `fix` / `refactor` / `chore`
- 分支：`main` / `develop` / `feature-xxx`

---

DevPilot AI Toolkit v0.1.0 · 私有项目 · 仅供学习与内部开发
