# deermap-web-app 仓库初始化

---

## 1. 创建 Next.js 项目

```bash
# 在 GitHub 上先创建空仓库 deermap-web-app，然后本地初始化
pnpm create next-app deermap-web-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd deermap-web-app
```

---

## 2. 安装核心依赖

```bash
# Payload CMS v3（与 Next.js 同进程）
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical

# 图表库
pnpm add echarts echarts-for-react
pnpm add react-plotly.js plotly.js-dist-min
pnpm add d3
pnpm add recharts

# UI 组件基础
pnpm add clsx tailwind-merge

# 游客使用次数检测（设备指纹）
pnpm add @fingerprintjs/fingerprintjs

# 国际化预留
pnpm add next-intl

# 类型
pnpm add -D @types/d3 @types/react-plotly.js
```

---

## 3. 项目目录结构初始化

按架构文档约定创建目录：

```bash
# BFF Route Handlers
mkdir -p src/app/api/charts/basic
mkdir -p src/app/api/charts/guest-check
mkdir -p src/app/api/auth
mkdir -p src/app/api/orders

# 前端页面路由
mkdir -p "src/app/(frontend)"
mkdir -p "src/app/(frontend)/charts/basic"
mkdir -p "src/app/(frontend)/charts/custom"
mkdir -p "src/app/(frontend)/paper"
mkdir -p "src/app/(frontend)/bioinformatics"
mkdir -p "src/app/(frontend)/consulting"
mkdir -p "src/app/(frontend)/user/orders"
mkdir -p "src/app/(frontend)/user/profile"
mkdir -p "src/app/(frontend)/user/membership"
mkdir -p "src/app/(frontend)/order/[id]"

# 组件
mkdir -p src/components/charts
mkdir -p src/components/ui
mkdir -p src/components/promotions   # 促销弹窗、价格展示组件

# Payload CMS
mkdir -p src/payload/collections
mkdir -p src/payload/globals

# 工具 & 类型
mkdir -p src/lib
mkdir -p src/types
```

---

## 4. 配置 Payload CMS

```typescript
// src/payload/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nextJsHeaders } from '@payloadcms/next/utilities'

export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
  }),
  collections: [
    // 后续添加：BannerCollection, TeamCollection, NewsCollection
  ],
  globals: [],
  admin: {
    meta: { titleSuffix: ' - Bio Admin' },
  },
  secret: process.env.PAYLOAD_SECRET!,
})
```

---

## 5. 环境变量

创建 `.env.local`（不提交到 Git）：

```env
# 数据库（Payload CMS 共用）
DATABASE_URL=postgresql://bio:bio_dev_secret@localhost:5432/bio_dev

# Payload CMS
PAYLOAD_SECRET=your-random-32-char-secret-here

# NestJS API（内网地址，不对外暴露）
NESTJS_API_URL=http://localhost:3001

# OSS
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
OSS_REGION=
OSS_CDN_BASE=

# 微信 OAuth（网页授权，用于微信一键登录）
WECHAT_APP_ID=
WECHAT_APP_SECRET=

# 支付宝 OAuth（用于支付宝一键登录）
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=
```

`.env.example` 提交到 Git，列出所有变量名（值留空）。

---

## 6. Payload CMS Collections 定义

### 首页 Banner

```typescript
// src/payload/collections/BannerCollection.ts
import type { CollectionConfig } from 'payload'

export const BannerCollection: CollectionConfig = {
  slug: 'banners',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaText', type: 'text' },
    { name: 'ctaUrl', type: 'text' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
```

### 团队成员

```typescript
// src/payload/collections/TeamCollection.ts
import type { CollectionConfig } from 'payload'

export const TeamCollection: CollectionConfig = {
  slug: 'team',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text' },
    { name: 'bio', type: 'richText' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number' },
  ],
}
```

### 行业讯息

> 行业讯息**无独立页面**，以首页模块形式展示，点击跳转至企业微信公众号对应文章，与公众号联动运营。

```typescript
// src/payload/collections/NewsCollection.ts
import type { CollectionConfig } from 'payload'

export const NewsCollection: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },   // 首页模块展示摘要
    { name: 'cover', type: 'upload', relationTo: 'media' },  // 封面图
    { name: 'wechatArticleUrl', type: 'text', required: true }, // 公众号文章链接，点击跳转
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'publishedAt', type: 'date', required: true },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0 },      // 首页展示排序
  ],
}
```

---

## 7. BFF Route Handlers（Next.js → NestJS）

```typescript
// src/lib/api-client.ts
const NESTJS_API_URL = process.env.NESTJS_API_URL!

export async function nestFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${NESTJS_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`NestJS API error: ${res.status}`)
  return res.json()
}
```

---

## 8. 图表组件规范

所有图表组件必须使用动态加载，避免 SSR 报错：

```typescript
// src/components/charts/HeatmapChart.tsx（示例）
'use client'
import dynamic from 'next/dynamic'
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

export function HeatmapChart({ data }: { data: number[][] }) {
  const option = {
    // ECharts options...
  }
  return <ReactECharts option={option} style={{ height: 400 }} />
}
```

---

## 9. Tailwind 配置补充

```typescript
// tailwind.config.ts — 在 content 中包含 payload admin
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './node_modules/@payloadcms/**/*.{js,ts,jsx,tsx}', // Payload UI
],
```

---

## 10. 运行开发服务器

```bash
# 确保本地 Docker 已启动（见 03-dev-environment.md）
# 首次运行 Prisma 迁移（Payload 会自动管理表结构，无需手动）

pnpm dev
# 访问 http://localhost:3000
# Payload Admin：http://localhost:3000/admin
```

---

## 开发顺序建议

1. ✅ 项目脚手架 + Payload CMS 能跑起来
2. 首页静态骨架（不接数据，先 UI）
3. 团队页、行业讯息列表页静态骨架
4. 接入 Payload CMS 数据（Banner、Team、News）
5. 用户注册 / 登录页（手机号 + 微信 OAuth + 支付宝 OAuth）
6. 基础制图工具页（`/charts/basic`）— 含游客免费次数检测 BFF 接口
7. 我的订单 / 会员页（`/user/orders`, `/user/membership`）
8. 个性化制图页（`/charts/custom`）— 范例画廊 + 联系 CTA
9. 论文业务页（`/paper`）、生信业务页（`/bioinformatics`）、行业咨询页（`/consulting`）
10. 订单支付页（`/order/[id]`）— 等支付商户号申请下来后联调
