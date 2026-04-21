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

# 客户端状态管理
pnpm add zustand

# 游客使用次数检测（设备指纹）
pnpm add @fingerprintjs/fingerprintjs

# 国际化预留
pnpm add next-intl

# Tailwind 插件
pnpm add -D @tailwindcss/typography @tailwindcss/forms

# 代码规范工具
pnpm add -D prettier eslint-config-prettier
pnpm add -D husky lint-staged
pnpm exec husky init

# 类型
pnpm add -D @types/d3 @types/react-plotly.js
```

`package.json` 加入 lint-staged 配置：

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

---

## 3. 项目目录结构初始化

按架构文档约定创建目录：

```bash
# 前端页面路由
pnpm dlx mkdirp `
  "src/app/(frontend)" `
  "src/app/(frontend)/team" `
  "src/app/(frontend)/charts/basic" `
  "src/app/(frontend)/charts/custom" `
  "src/app/(frontend)/paper" `
  "src/app/(frontend)/bioinformatics" `
  "src/app/(frontend)/consulting" `
  "src/app/(frontend)/user/login" `
  "src/app/(frontend)/user/profile" `
  "src/app/(frontend)/user/orders" `
  "src/app/(frontend)/user/membership" `
  "src/app/(frontend)/order/[id]"

# Payload CMS 路由组（Admin 后台）
pnpm dlx mkdirp "src/app/(payload)/admin/[[...segments]]"

# BFF Route Handlers
pnpm dlx mkdirp `
  "src/app/api/auth/login" `
  "src/app/api/auth/logout" `
  "src/app/api/auth/refresh" `
  "src/app/api/auth/wechat" `
  "src/app/api/auth/alipay" `
  "src/app/api/charts/basic" `
  "src/app/api/charts/guest-check" `
  "src/app/api/orders/[id]" `
  "src/app/api/user/profile" `
  "src/app/api/user/membership"

# 组件
pnpm dlx mkdirp `
  src/components/ui `
  src/components/charts `
  src/components/promotions `
  src/components/layout

# Payload CMS
pnpm dlx mkdirp src/payload/collections src/payload/globals

# 工具 / 类型 / Hooks / Store
pnpm dlx mkdirp src/lib src/types src/hooks src/store
```

> Windows PowerShell 中多行命令用 `` ` `` 换行。也可仅创建需要的目录，运行时 Next.js 会自动识别缺失目录。

---

## 4. 配置 Payload CMS

```typescript
// src/payload/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
  }),
  collections: [
    // 后续添加：BannerCollection, TeamCollection, NewsCollection,
    // ChartExampleCollection, MediaCollection
  ],
  globals: [
    // 后续添加：SiteSettings, NavigationGlobal
  ],
  admin: {
    meta: { titleSuffix: ' - Bio Admin' },
  },
  secret: process.env.PAYLOAD_SECRET!,
})
```

`next.config.ts` 中必须用 `withPayload` 包裹：

```typescript
// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // ...your config
}

export default withPayload(nextConfig)
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
# Local: http://localhost:3001  |  Production: http://api:3001
NESTJS_API_URL=http://localhost:3001

# OSS
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
OSS_REGION=
OSS_CDN_BASE=

# 微信 OAuth（服务端）
WECHAT_APP_ID=
WECHAT_APP_SECRET=

# 支付宝 OAuth（服务端）
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=

# 前端可见（浏览器端，用于 OAuth 跳转拼接）
NEXT_PUBLIC_WECHAT_APP_ID=
NEXT_PUBLIC_ALIPAY_APP_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
    { name: 'order', type: 'number', defaultValue: 0 },  // 展示排序
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

### 制图范例畫廊

```typescript
// src/payload/collections/ChartExampleCollection.ts
import type { CollectionConfig } from 'payload'

export const ChartExampleCollection: CollectionConfig = {
  slug: 'chart-examples',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'select', options: [
      { label: '基础制图', value: 'basic' },
      { label: '个性化制图', value: 'custom' },
    ]},
    { name: 'chartType', type: 'text' },          // 'heatmap' | 'volcano' | ...
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'isHighlighted', type: 'checkbox' },  // 首页精选展示
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

### 全局配置（Globals）

```typescript
// src/payload/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'contactEmail', type: 'email' },
    { name: 'contactWechat', type: 'text' },
    { name: 'wechatQrCode', type: 'upload', relationTo: 'media' },
    { name: 'wechatOfficialAccountUrl', type: 'text' }, // 公众号主页链接
    { name: 'footerLinks', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'url', type: 'text' },
    ]},
    { name: 'icp', type: 'text' },  // ICP 备案号
  ],
}
```

```typescript
// src/payload/globals/NavigationGlobal.ts
import type { GlobalConfig } from 'payload'

export const NavigationGlobal: GlobalConfig = {
  slug: 'navigation',
  fields: [
    { name: 'items', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'href', type: 'text', required: true },
      { name: 'isExternal', type: 'checkbox', defaultValue: false },
    ]},
  ],
}
```

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
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@payloadcms/**/*.{js,ts,jsx,tsx}', // Payload Admin UI
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          500: '#22c55e',  // 主品牡色，后续根据 UI 设计稿调整
          900: '#14532d',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // prose 类，用于富文本渲染
    require('@tailwindcss/forms'),       // 表单元素样式重置
  ],
}

export default config
```

---

## 10. 运行开发服务器

```bash
# 前置：本地 Docker 已启动 PostgreSQL + Redis
# 见 docs/implementation/dev-environment.md

# 首次运行，Payload 会自动在 PostgreSQL 中建表（无需手动 migrate）
pnpm dev
# 访问 http://localhost:3000
# Payload Admin：http://localhost:3000/admin
```

**Payload CMS 首次启动说明：**

1. 首次访问 `/admin` 按提示创建第一个管理员账号
2. Payload Admin 账号与 NestJS 用户系统**完全独立**，是两套账号体系
3. 生产环境中同样访问 `/admin` 完成首次上线配置

---

## 开发顺序建议

> **首先建好这四个文件，再写任何业务代码！**  
> `middleware.ts`、`(frontend)/error.tsx`、`(frontend)/not-found.tsx`、`global-error.tsx` 和 `SiteSettings Global`——缺失这些是后期最容易补债的地方。

1. 项目脏架 + Payload CMS 能跑起来
2. 创建 `src/middleware.ts`（路由保护）、`error.tsx`、`not-found.tsx`、`global-error.tsx`、`SiteSettings Global`
3. 首页静态骨架（不接数据，先 UI）
4. 团队页静态骨架，首页行业讯息模块静态骨架
5. 接入 Payload CMS 数据（Banner、Team、News）
6. 用户注册 / 登录页（手机号 + 微信 OAuth + 支付宝 OAuth）
7. 基础制图工具页（`/charts/basic`）— 含游客免费次数检测 BFF 接口
8. 我的订单 / 会员页（`/user/orders`， `/user/membership`）
9. 个性化制图页（`/charts/custom`）— 范例画廊 + 联系 CTA
10. 论文业务页（`/paper`）、生信业务页（`/bioinformatics`）、行业咨询页（`/consulting`）
11. 订单支付页（`/order/[id]`）— 等支付商户号申请下来后联调
