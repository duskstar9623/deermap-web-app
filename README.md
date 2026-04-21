# Bio-Web 前端应用 🧬

> Next.js 15 全栈前端应用，为中型生物信息技术企业的官网系统

## 📋 项目概览

Bio-Web 是一个**Next.js 15 + Payload CMS v3** 的现代化科研服务平台前端，为生物学家和研究人员提供一站式科研工具和内容。

### 核心功能

- **信息展示** - 企业官网、团队介绍、资讯中心
- **基础制图** - 在线自助生成标准化科研图表
- **个性化制图** - 专业设计师 1v1 定制服务
- **论文服务** - 论文润色、排版、图表优化
- **会员系统** - 灵活的用户权益和计费模式

## 🏗️ 项目结构

```
bio-web/
├── src/
│   ├── app/
│   │   ├── api/              # BFF Route Handlers
│   │   │   ├── auth/         # 认证相关
│   │   │   ├── charts/       # 图表生成服务
│   │   │   └── orders/       # 订单管理
│   │   ├── (frontend)/       # 前端页面路由
│   │   │   ├── charts/       # 制图工具页面
│   │   │   ├── news/         # 资讯中心
│   │   │   ├── paper/        # 论文服务
│   │   │   ├── team/         # 团队介绍
│   │   │   └── user/         # 用户中心
│   │   ├── layout.tsx        # 全局布局
│   │   ├── page.tsx          # 首页
│   │   └── globals.css       # 全局样式
│   ├── components/           # React 组件
│   │   ├── ui/              # 基础 UI 组件
│   │   ├── charts/          # 图表组件
│   │   ├── promotions/      # 促销相关组件
│   │   └── Navigation.tsx   # 导航条
│   ├── lib/                 # 工具函数
│   │   ├── api-client.ts    # NestJS API 客户端
│   │   ├── payload.ts       # Payload CMS 本地 API
│   │   └── utils.ts         # 通用工具函数
│   ├── types/               # TypeScript 类型定义
│   ├── payload/             # Payload CMS 配置
│   │   ├── collections/     # CMS Collections
│   │   └── globals/         # CMS 全局设置
│   └── payload.config.ts    # Payload CMS 主配置
├── public/                  # 静态资源
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── .env.example
```

## 🚀 快速开始

### 前置要求

- Node.js ≥ 20.x LTS
- pnpm 9.x+
- Docker Desktop（用于本地数据库）
- PostgreSQL 16（或通过 Docker 运行）
- Redis 7（或通过 Docker 运行）

### 安装步骤

1. **克隆仓库并进入目录**
```bash
cd bio-web
```

2. **配置 npm 镜像源（国内用户）**
```bash
pnpm config set registry https://registry.npmmirror.com
```

3. **安装依赖**
```bash
pnpm install
```

4. **启动本地数据库**
```bash
# 在项目根目录创建 docker-compose.dev.yml（见下文）
docker compose -f docker-compose.dev.yml up -d
```

5. **配置环境变量**
```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入数据库和服务 URL
```

6. **初始化数据库**
```bash
# Payload CMS 会自动创建表结构
pnpm dev
```

7. **访问应用**
```
- 前台网站: http://localhost:3000
- CMS 后台: http://localhost:3000/admin
- 默认用户: 见 Payload 初始化文档
```

### Docker Compose 本地开发配置

在 `docker-compose.dev.yml` 中：

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: bio_dev
      POSTGRES_USER: bio
      POSTGRES_PASSWORD: bio_dev_secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_dev_data:
```

启动：
```bash
docker compose -f docker-compose.dev.yml up -d
```

## 📚 主要依赖

| 包 | 版本 | 用途 |
|---|---|---|
| **next** | ^15.1.0 | Next.js 框架 |
| **react** | ^19.0.0 | React 库 |
| **typescript** | ^5.5.0 | TypeScript 支持 |
| **payload** | ^3.5.0 | CMS 核心 |
| **echarts** | ^5.5.0 | 统计图表库 |
| **recharts** | ^2.13.0 | React 图表库 |
| **d3** | ^7.8.0 | 数据可视化库 |
| **plotly.js** | ^2.32.0 | 科学可视化库 |
| **tailwindcss** | ^3.4.0 | CSS 原子化框架 |
| **next-intl** | ^3.22.0 | 国际化支持 |

## 🔧 开发

### 启动开发服务器

```bash
pnpm dev
```

应用会在 http://localhost:3000 启动，文件变化时自动热重载。

### 构建生产版本

```bash
pnpm build
pnpm start
```

### 代码检查

```bash
pnpm lint
```

## 🏗️ 架构设计

### 三层架构

```
┌─────────────────────────────────┐
│   前端页面 (RSC)                │
│   └─ Server Components          │
│   └─ 直接调用 Payload Local API│
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   BFF 层 (Route Handlers)       │
│   └─ app/api/* 目录             │
│   └─ 转发到 NestJS API          │
│   └─ 用户认证、权限管理        │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   NestJS API (port 3001)        │
│   └─ 业务逻辑                   │
│   └─ 数据库操作                 │
│   └─ 支付、队列处理             │
└─────────────────────────────────┘
```

### 关键约定

1. **页面渲染**: 使用 Server Components (RSC) 获取 SEO 友好的 HTML
2. **CMS 内容**: 直接在 RSC 中调用 Payload Local API，零网络开销
3. **用户交互**: 通过 BFF 层的 Route Handlers 转发请求，不暴露 NestJS 端口
4. **客户端状态**: 需要复杂交互时使用 `'use client'` 组件
5. **图表渲染**: 动态导入图表库，避免首屏体积过大

## 🔐 环境变量

### 必需变量

```env
# 数据库
DATABASE_URL=postgresql://bio:bio_dev_secret@localhost:5432/bio_dev

# Payload CMS
PAYLOAD_SECRET=your-32-char-random-secret

# 后端 API
NESTJS_API_URL=http://localhost:3001

# 文件存储
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
OSS_REGION=
OSS_CDN_BASE=
```

### 可选变量

```env
# 第三方登录
WECHAT_APP_ID=
WECHAT_APP_SECRET=
ALIPAY_APP_ID=

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📱 页面路由

| 路由 | 描述 |
|---|---|
| `/` | 首页 |
| `/team` | 团队介绍 |
| `/charts/basic` | 基础制图工具 |
| `/charts/custom` | 个性化制图服务 |
| `/paper` | 论文服务 |
| `/news` | 资讯列表 |
| `/news/[slug]` | 资讯详情 |
| `/user/profile` | 用户资料 |
| `/user/orders` | 订单列表 |
| `/user/membership` | 会员管理 |
| `/admin/*` | Payload CMS 后台 |

## 🎨 UI 组件库

自建轻量级 UI 组件库，基于 Tailwind CSS：

- `Button` - 按钮（多种样式）
- `Card` - 卡片
- `Modal` - 对话框
- `Loader` - 加载动画
- `Navigation` - 导航条

使用方式：

```tsx
import { Button, Modal } from '@/components/ui'

export default function Example() {
  return <Button variant="primary">Click me</Button>
}
```

## 🔗 与 NestJS API 集成

BFF 层提供以下端点，用于调用后端 API：

- `POST /api/auth` - 登录/注册
- `POST /api/charts/guest-check` - 检查游客每日限额
- `POST /api/charts/basic` - 提交制图任务
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表

工具函数在 `src/lib/api-client.ts`：

```tsx
import { apiCall, createOrder } from '@/lib/api-client'

// 调用 API
const response = await createOrder({ chartType: 'heatmap' })
```

## 🛠️ 常见任务

### 添加新页面

1. 在 `src/app/(frontend)/` 中创建新目录
2. 创建 `page.tsx`
3. 导出默认组件

```tsx
// src/app/(frontend)/new-page/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Page | Bio-Web',
}

export default function NewPage() {
  return <main>Page content</main>
}
```

### 添加 CMS Collection

1. 在 `src/payload/collections/` 创建新文件
2. 定义 Collection 配置
3. 在 `payload.config.ts` 中导入并注册

```tsx
// src/payload/collections/YourCollection.ts
import type { CollectionConfig } from 'payload'

export const YourCollection: CollectionConfig = {
  slug: 'your-collection',
  fields: [
    { name: 'title', type: 'text', required: true },
  ],
}
```

### 调用 Payload Local API

在 Server Components 中直接使用：

```tsx
import { getBanners } from '@/lib/payload'

export default async function BannerSection() {
  const banners = await getBanners()
  
  return (
    <div>
      {banners.docs.map(banner => (
        <div key={banner.id}>{banner.title}</div>
      ))}
    </div>
  )
}
```

## 🧪 测试

```bash
# 运行测试（待配置）
pnpm test
```

## 📦 部署

### 构建

```bash
pnpm build
```

### 部署到云平台

支持部署到：
- 阿里云 ECS + 自托管 Docker
- 腾讯云 CVM + 自托管 Docker
- Vercel（Next.js 官方推荐）

详见 `refer/06-deployment.md`

## 🤝 贡献指南

1. 创建 Feature Branch: `git checkout -b feature/amazing-feature`
2. 提交更改: `git commit -m 'Add amazing feature'`
3. 推送到分支: `git push origin feature/amazing-feature`
4. 开启 Pull Request

## 📄 许可证

Proprietary License - 仅限企业内部使用

## 📞 联系方式

- 邮件: dev@bio-web.com
- 微信: [企业微信]

---

**最后更新**: 2026-04-20
