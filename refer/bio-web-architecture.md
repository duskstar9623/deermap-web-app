# bio-web 前端应用 — 详细技术架构文档

> 版本：v1.0 · 2026-04-20  
> 定位：Next.js 15 App Router 全栈前端，承担页面渲染、BFF 聚合层、Payload CMS 管理后台三重职责。  
> 本文档逐步解释 `04-bio-web-init.md` 每一步的目的与意义，并从架构合理性、扩展性、可维护性角度进行审视和补充。

---

## 目录

1. [整体定位与职责边界](#1-整体定位与职责边界)
2. [初始化步骤详解](#2-初始化步骤详解)
   - [Step 1：创建 Next.js 项目](#step-1创建-nextjs-项目)
   - [Step 2：安装核心依赖](#step-2安装核心依赖)
   - [Step 3：目录结构设计](#step-3目录结构设计)
   - [Step 4：配置 Payload CMS](#step-4配置-payload-cms)
   - [Step 5：环境变量管理](#step-5环境变量管理)
   - [Step 6：Payload CMS Collections](#step-6payload-cms-collections)
   - [Step 7：BFF 层设计](#step-7bff-层设计)
   - [Step 8：图表组件规范](#step-8图表组件规范)
   - [Step 9：Tailwind 配置](#step-9tailwind-配置)
   - [Step 10：开发服务器启动](#step-10开发服务器启动)
3. [架构补漏：init 文档未覆盖的关键内容](#3-架构补漏init-文档未覆盖的关键内容)
4. [架构合理性审视](#4-架构合理性审视)
5. [完整目录结构参考](#5-完整目录结构参考)

---

## 1. 整体定位与职责边界

bio-web 是一个「三合一」应用，运行在同一个 Next.js 进程（port 3000）中：

```
┌─────────────────────────────────────────────────────┐
│                   bio-web (port 3000)               │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  前端页面     │  │  BFF 层      │  │  Payload │  │
│  │  (RSC/Client)│  │  app/api/    │  │  CMS     │  │
│  │              │  │  Route       │  │  /admin  │  │
│  │  面向用户所有 │  │  Handlers    │  │          │  │
│  │  页面渲染    │  │              │  │  内容管理 │  │
│  └──────────────┘  └──────┬───────┘  └──────────┘  │
│                           │                         │
└───────────────────────────┼─────────────────────────┘
                            │ 内网 HTTP
                            ▼
                    NestJS API (port 3001)
```

**职责边界原则：**

| 事情 | 应该在哪里做 |
|---|---|
| 页面 HTML 渲染（SEO 相关） | Next.js Server Component（RSC） |
| CMS 内容（Banner、团队、资讯文章）读取 | 直接在 RSC 里调用 Payload Local API（同进程，零延迟） |
| 用户登录态、JWT Token 管理 | BFF Route Handler（`app/api/auth/`） |
| 调用 NestJS 业务 API（订单、会员、制图任务） | BFF Route Handler（`app/api/`）转发，浏览器不直连 NestJS |
| 表单提交、数据变更 | Server Actions（Next.js 原生，无需手写 API 路由） |
| 重交互客户端组件（图表、富文本编辑器） | `'use client'` + `dynamic import + ssr: false` |
| 内容运营（Banner、文章编辑） | `/admin` Payload CMS 后台，无需改代码 |

---

## 2. 初始化步骤详解

### Step 1：创建 Next.js 项目

```bash
pnpm create next-app bio-web \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

**每个参数的意义：**

| 参数 | 作用 | 为什么 |
|---|---|---|
| `--typescript` | 启用 TypeScript | 全栈 TS，与 NestJS 共享类型风格，减少运行时错误 |
| `--tailwind` | 内置 Tailwind CSS | 原子化 CSS，响应式布局首选，与 Payload CMS UI 兼容 |
| `--eslint` | 启用 ESLint | 代码规范强制执行，CI 中可作为检查门禁 |
| `--app` | 使用 App Router（非 Pages Router） | Next.js 15 推荐方案，支持 RSC、Server Actions、嵌套布局 |
| `--src-dir` | 源码放入 `src/` | 项目根目录更干净，`src/` 与配置文件分离 |
| `--import-alias "@/*"` | `@/` 映射到 `src/` | 避免 `../../../` 相对路径地狱 |

> **注意：** 使用 pnpm 而非 npm/yarn，与 bio-api 保持一致，节省磁盘空间（硬链接 node_modules），CI 速度更快。

---

### Step 2：安装核心依赖

#### Payload CMS v3

```bash
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical
```

| 包 | 作用 |
|---|---|
| `payload` | Payload CMS 核心 |
| `@payloadcms/next` | Next.js 集成适配器，提供 `withPayload()`、Local API、Route Handlers |
| `@payloadcms/db-postgres` | PostgreSQL 数据库适配器，共用 bio-web 的 `DATABASE_URL` |
| `@payloadcms/richtext-lexical` | 官方富文本编辑器（基于 Lexical），用于资讯内容编辑 |

Payload CMS v3 的核心优势：与 Next.js 同进程，读取 CMS 内容时直接调用 `getPayload()` **本地 API**，零网络开销，无需额外 HTTP 请求。

#### 图表库

```bash
pnpm add echarts echarts-for-react      # 标准统计图表
pnpm add react-plotly.js plotly.js-dist-min  # 专业科学可视化
pnpm add d3                              # 完全自定义图示
pnpm add recharts                        # 管理后台数据看板
```

**为什么四库并用（不是多余）：**

| 库 | 适用场景 | 不可替代的理由 |
|---|---|---|
| ECharts | 热图、火山图、箱线图、生存曲线 | 中文文档友好，配置式 API，支持大数据量 |
| Plotly | 等高线、三元图、3D 散点 | 科学出版级可视化，内置坐标轴格式，支持 WebGL |
| D3 | 进化树、基因结构图、序列 Logo | 完全自定义 SVG/Canvas 渲染，其他库无法表达这类非标准图 |
| Recharts | 管理后台看板 | 轻量、纯 React，不需要 ECharts 的复杂配置 |

> **包体控制：** 四个库不能全量打包进首屏。所有图表组件必须 `dynamic import + ssr: false`（见 Step 8）。

#### 设备指纹

```bash
pnpm add @fingerprintjs/fingerprintjs
```

用于游客每日 1 次免费制图的客户端识别（配合后端 Redis 计数，详见 Step 7 BFF 章节）。

> **用开源版（非 Pro）：** FingerprintJS 开源版精度约 60–80%，对于「降低滥用门槛」已足够，无需付费 Pro 版的 99% 精度。

#### 国际化预留

```bash
pnpm add next-intl
```

当前**不实现**国际化功能，但提前安装可以：1) 在目录结构上预留 `[locale]` 路由段的扩展空间；2) 养成使用 `t('key')` 代替硬编码中文字符串的习惯，后续国际化迁移成本极低。

---

### Step 3：目录结构设计

#### Route Groups（路由分组）的意义

```
src/app/
├── (frontend)/          ← 路由组（不影响 URL）
│   ├── layout.tsx       ← 公共导航栏、页脚布局
│   └── ...所有用户页面
├── api/                 ← BFF Route Handlers
│   └── ...BFF 接口
└── (payload)/           ← Payload CMS 专属路由组（后续添加）
    └── admin/[[...segments]]/ ← /admin 后台
```

使用 `(frontend)` Route Group 的好处：
- `(frontend)/layout.tsx` 只负责用户面向的导航栏/页脚，**不会污染** `/api/` 和 `/admin`  
- 后续加 `(auth)/layout.tsx` 可单独给登录页设计全屏布局，无需修改其他页面

#### 完整目录规划说明

| 目录 | 用途 |
|---|---|
| `src/app/(frontend)/` | 所有用户可见页面，共享导航/页脚布局 |
| `src/app/api/` | BFF Route Handlers，代理 NestJS API、处理 Auth |
| `src/components/ui/` | 原子级 UI 组件（Button、Input、Modal 等） |
| `src/components/charts/` | 图表业务组件（已封装 dynamic import） |
| `src/components/promotions/` | 促销相关组件（价格标签、活动弹窗、折扣 Badge） |
| `src/payload/collections/` | Payload CMS Collection 配置 |
| `src/payload/globals/` | Payload CMS Global 配置（站点设置、导航、页脚链接） |
| `src/lib/` | 工具函数、NestJS API Client、Payload Local API 封装 |
| `src/types/` | 全局 TypeScript 类型，与 NestJS OpenAPI 同步维护 |
| `src/hooks/` | ⚠️ **init 文档缺失**，见第 3 节补充 |
| `src/store/` | ⚠️ **init 文档缺失**，见第 3 节补充（轻量客户端状态） |
| `src/middleware.ts` | ⚠️ **init 文档缺失**，见第 3 节补充（Auth 路由保护） |

---

### Step 4：配置 Payload CMS

```typescript
// src/payload/payload.config.ts
export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
  collections: [],
  globals: [],
  admin: { meta: { titleSuffix: ' - Bio Admin' } },
  secret: process.env.PAYLOAD_SECRET!,
})
```

**关键点解释：**

- **`lexicalEditor()`：** Payload v3 默认富文本编辑器，基于 Meta 开源的 Lexical，输出可序列化的 JSON（而非 HTML 字符串），前端渲染时使用 `@payloadcms/richtext-lexical` 的 `RichText` 组件将其转换为 JSX。

- **`postgresAdapter`：** Payload 和 NestJS（Prisma）**共用同一个 PostgreSQL 实例**，Payload 负责管理自己的 CMS 表（`banners`、`team`、`news` 等），Prisma 负责业务表（`users`、`orders` 等），互不干扰。

- **`PAYLOAD_SECRET`：** 用于 Payload 自身的 Session 加密，与 NestJS 的 `JWT_SECRET` 是两套独立密钥，**不要混用**。

**还需在 `next.config.ts` 中包裹 `withPayload`：**

```typescript
// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // ...你的配置
}

export default withPayload(nextConfig)
```

---

### Step 5：环境变量管理

**当前 `.env.local` 覆盖的变量：**

```
DATABASE_URL          → Payload CMS 读写 PostgreSQL
PAYLOAD_SECRET        → Payload CMS Session 加密
NESTJS_API_URL        → BFF 层内网转发地址
OSS_*                 → 前端直传 OSS（若有预签名 URL 功能）
WECHAT_APP_ID/SECRET  → 微信网页 OAuth 登录
ALIPAY_APP_ID/KEY     → 支付宝 OAuth 登录
```

**分环境管理规范：**

| 文件 | 用途 | 是否提交 Git |
|---|---|---|
| `.env.local` | 本地开发（优先级最高） | ❌ 加入 `.gitignore` |
| `.env.example` | 展示所有变量名（值留空） | ✅ 必须提交 |
| `.env.production` | CI/CD Secrets 注入（不存文件） | ❌ 通过 GitHub Secrets 注入 |

> **安全原则：** 微信 `APP_SECRET`、支付宝私钥等敏感值**只在服务端使用**（BFF Route Handlers 或 Server Actions），永远不暴露给浏览器。客户端只需 `NEXT_PUBLIC_` 前缀的公开变量（如 `NEXT_PUBLIC_WECHAT_APP_ID` 用于前端发起 OAuth 跳转）。

**⚠️ init 文档遗漏：** 需补充以下客户端公开变量：

```env
# 前端可见（NEXT_PUBLIC_ 前缀）
NEXT_PUBLIC_WECHAT_APP_ID=    # 微信网页授权跳转用
NEXT_PUBLIC_ALIPAY_APP_ID=    # 支付宝授权跳转用
NEXT_PUBLIC_SITE_URL=         # 当前域名，用于 OAuth 回调地址拼接
```

---

### Step 6：Payload CMS Collections

#### BannerCollection

首页 Hero 区域横幅，`isActive` 字段支持多条 Banner 按需上下线，无需改代码部署。

```typescript
fields: [
  { name: 'title', type: 'text', required: true },
  { name: 'subtitle', type: 'text' },
  { name: 'image', type: 'upload', relationTo: 'media' },
  { name: 'ctaText', type: 'text' },
  { name: 'ctaUrl', type: 'text' },
  { name: 'isActive', type: 'checkbox', defaultValue: true },
  // ⚠️ 建议补充排序字段：
  { name: 'order', type: 'number', defaultValue: 0 },
]
```

#### TeamCollection

团队成员档案，`order` 字段控制展示顺序，运营人员可直接在后台调整顺序。

#### NewsCollection

行业讯息文章，`slug` 用于 SEO 友好的 URL（`/news/some-article-title`），`isPublished` 控制草稿/上线状态，`publishedAt` 支持定时发布逻辑。

**⚠️ 建议补充的 Collections：**

```typescript
// src/payload/collections/ChartExampleCollection.ts
// 个性化制图 & 基础制图的范例图展示（画廊）
export const ChartExampleCollection: CollectionConfig = {
  slug: 'chart-examples',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'select', options: ['basic', 'custom'] },
    { name: 'chartType', type: 'text' },       // 'heatmap' | 'volcano' | ...
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
    { name: 'isHighlighted', type: 'checkbox' }, // 首页精选展示
  ],
}
```

```typescript
// src/payload/globals/SiteSettings.ts
// 站点全局配置（联系方式、微信二维码、页脚链接）
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'contactEmail', type: 'email' },
    { name: 'contactWechat', type: 'text' },
    { name: 'wechatQrCode', type: 'upload', relationTo: 'media' },
    { name: 'footerLinks', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'url', type: 'text' },
    ]},
    { name: 'icp', type: 'text' },             // ICP 备案号
  ],
}
```

```typescript
// src/payload/globals/NavigationGlobal.ts
// 导航菜单配置（运营人员可调整导航项）
export const NavigationGlobal: GlobalConfig = {
  slug: 'navigation',
  fields: [
    { name: 'items', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'href', type: 'text' },
      { name: 'isExternal', type: 'checkbox' },
    ]},
  ],
}
```

---

### Step 7：BFF 层设计

BFF（Backend for Frontend）层是 bio-web 最重要的架构模式，**明确隔离了「浏览器可达的接口」与「NestJS 后端」**。

#### 核心 API Client

```typescript
// src/lib/api-client.ts
// 服务端专用（BFF Route Handlers & Server Actions 调用）
export async function nestFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NESTJS_API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    // Next.js 15 fetch 缓存默认 no-store，动态请求无需额外配置
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new ApiError(res.status, err.message ?? 'NestJS API error')
  }
  return res.json()
}
```

#### 游客制图次数检测 BFF

这是一个关键的安全接口，**必须在服务端校验**，客户端只做辅助。

```typescript
// src/app/api/charts/guest-check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { nestFetch } from '@/lib/api-client'

export async function POST(req: NextRequest) {
  const { fingerprint } = await req.json()

  // 获取真实 IP（Nginx 已配置 X-Forwarded-For 可信）
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'

  // 转发给 NestJS 做 Redis 计数校验
  const result = await nestFetch<{ allowed: boolean; remaining: number }>(
    '/api/v1/charts/guest-check',
    {
      method: 'POST',
      body: JSON.stringify({ fingerprint, ip, date: new Date().toISOString().slice(0, 10) }),
    }
  )

  return NextResponse.json(result)
}
```

#### Auth 相关 BFF

```typescript
// src/app/api/auth/login/route.ts       → 手机号+密码登录，获取 JWT，写 HttpOnly Cookie
// src/app/api/auth/wechat/route.ts      → 微信 OAuth 回调处理
// src/app/api/auth/alipay/route.ts      → 支付宝 OAuth 回调处理
// src/app/api/auth/logout/route.ts      → 清除 Cookie
// src/app/api/auth/refresh/route.ts     → 刷新 Token
```

**JWT 存储方式：HttpOnly Cookie（而非 localStorage）**

```typescript
// 登录成功后设置 Cookie
response.cookies.set('access_token', jwt, {
  httpOnly: true,    // JS 无法读取，防 XSS
  secure: true,      // 仅 HTTPS
  sameSite: 'lax',   // 防 CSRF（允许普通跳转携带）
  maxAge: 60 * 60 * 24 * 7, // 7 天
  path: '/',
})
```

> 比 localStorage 更安全：XSS 攻击无法读取 HttpOnly Cookie。

---

### Step 8：图表组件规范

所有图表库**必须**客户端动态加载，原因：这些库直接操作 DOM/Canvas，在 Node.js SSR 环境中会报错（`window is not defined`）。

```typescript
// src/components/charts/HeatmapChart.tsx
'use client'
import dynamic from 'next/dynamic'
import type { EChartsOption } from 'echarts'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <ChartSkeleton height={400} />,  // 加载骨架屏，避免布局跳动
})

interface HeatmapChartProps {
  data: number[][]
  xLabels: string[]
  yLabels: string[]
}

export function HeatmapChart({ data, xLabels, yLabels }: HeatmapChartProps) {
  const option: EChartsOption = { /* ... */ }
  return (
    <ReactECharts
      option={option}
      style={{ height: 400 }}
      notMerge         // 每次 props 变化完整更新 option
      lazyUpdate       // 批量更新，性能优化
    />
  )
}
```

**图表组件骨架屏（防止 CLS）：**

```typescript
// src/components/charts/ChartSkeleton.tsx
export function ChartSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div
      className="animate-pulse bg-gray-100 rounded-lg w-full"
      style={{ height }}
      aria-label="图表加载中"
    />
  )
}
```

---

### Step 9：Tailwind 配置

```typescript
// tailwind.config.ts
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './node_modules/@payloadcms/**/*.{js,ts,jsx,tsx}',
],
```

为什么要包含 `@payloadcms/**`：Payload CMS Admin UI 的组件使用 Tailwind 类名，不包含会导致 `/admin` 页面样式丢失。

**建议补充的 Tailwind 配置：**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@payloadcms/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          500: '#22c55e',   // 主品牌色，后续根据 UI 设计稿调整
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // prose 类，用于资讯文章富文本渲染
    require('@tailwindcss/forms'),       // 表单元素默认样式重置
  ],
}

export default config
```

```bash
pnpm add -D @tailwindcss/typography @tailwindcss/forms
```

---

### Step 10：开发服务器启动

```bash
# 前置：本地 Docker 启动 PostgreSQL + Redis（见 03-dev-environment.md）
pnpm dev
```

**Payload CMS 首次启动说明：**

1. 首次运行 Payload 会自动在 PostgreSQL 中创建所有 CMS 表（migration 自动执行）
2. 访问 `http://localhost:3000/admin` 按提示创建第一个管理员账号
3. Payload Admin 账号与 NestJS 用户系统**完全独立**，是两套账号体系

---

## 3. 架构补漏：init 文档未覆盖的关键内容

### 3.1 Next.js Middleware（路由保护）

**缺失风险：** 没有 Middleware，`/user/*`、`/order/*` 等需登录的页面在服务端渲染阶段无法保护，SEO 爬虫或未登录用户会直接看到页面骨架（或报错）。

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// 需要登录才能访问的路径
const PROTECTED_PATHS = ['/user', '/order']
// 已登录用户不应访问的路径（登录页）
const AUTH_PATHS = ['/user/login']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const { pathname } = req.nextUrl

  // 已登录 → 不允许再进登录页
  if (token && AUTH_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/user/orders', req.url))
  }

  // 未登录 → 保护页面跳转登录
  if (!token && PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    const loginUrl = new URL('/user/login', req.url)
    loginUrl.searchParams.set('redirect', pathname) // 登录后跳回原页面
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 排除静态文件和 Payload Admin（Admin 有自己的鉴权）
    '/((?!_next/static|_next/image|favicon.ico|admin).*)',
  ],
}
```

---

### 3.2 客户端状态管理

当前 init 文档没有提及客户端状态方案。推荐轻量方案：

**推荐：Zustand（轻量，无 Provider 模板代码）**

```bash
pnpm add zustand
```

```typescript
// src/store/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { id: string; name: string; phone: string } | null
  membership: { plan: string; expireAt: string } | null
  setUser: (user: AuthState['user']) => void
  setMembership: (m: AuthState['membership']) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      membership: null,
      setUser: (user) => set({ user }),
      setMembership: (membership) => set({ membership }),
      clear: () => set({ user: null, membership: null }),
    }),
    { name: 'bio-auth' }  // localStorage 持久化 key
  )
)
```

> **用途：** 存储已登录用户的基本信息和会员状态，用于 Header 展示登录态、会员 Badge、制图权限提示等客户端即时响应场景。**不存储 JWT**（JWT 放 HttpOnly Cookie，不经过 JS）。

---

### 3.3 通用 Hooks

```typescript
// src/hooks/useAuth.ts —— 读取登录态，配合 Zustand
// src/hooks/useMembership.ts —— 判断会员权益，驱动 UI 状态（是否显示「升级会员」）
// src/hooks/useGuestLimit.ts —— 管理游客免费次数（调用 /api/charts/guest-check，驱动弹窗）
```

```typescript
// src/hooks/useGuestLimit.ts
'use client'
import { useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export function useGuestLimit() {
  const [checking, setChecking] = useState(false)

  async function checkAndProceed(onAllowed: () => void, onDenied: () => void) {
    setChecking(true)
    const fp = await FingerprintJS.load()
    const { visitorId } = await fp.get()

    const res = await fetch('/api/charts/guest-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint: visitorId }),
    })
    const { allowed } = await res.json()

    setChecking(false)
    allowed ? onAllowed() : onDenied()
  }

  return { checkAndProceed, checking }
}
```

---

### 3.4 错误边界与全局错误处理

Next.js App Router 的 `error.tsx` 文件系统需要主动创建，否则任何未捕获错误都会导致白屏。

```typescript
// src/app/(frontend)/error.tsx  —— 前端页面通用错误边界
// src/app/(frontend)/not-found.tsx  —— 404 页面
// src/app/global-error.tsx  —— 根级别错误（含 layout 崩溃）
```

---

### 3.5 SEO 基础配置

Next.js 15 通过 `metadata` export 配置 SEO，需要在关键页面落实：

```typescript
// src/app/(frontend)/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: { template: '%s | BioDemo', default: 'BioDemo — 专业科研绘图服务' },
  description: '提供热图、火山图、进化树等专业科研图表制作服务',
  openGraph: { type: 'website', locale: 'zh_CN' },
}
```

---

### 3.6 促销价格展示组件

`src/components/promotions/` 目录在结构中已预留，需要明确组件职责：

```typescript
// src/components/promotions/PriceTag.tsx
// 根据当前活动状态动态展示：折扣价 + 划线原价 + 角标
interface PriceTagProps {
  originalPrice: number
  promotionPrice?: number     // 有活动时传入
  isVip?: boolean             // 会员状态（展示「已享权益」而非价格）
  size?: 'sm' | 'md' | 'lg'
}

// src/components/promotions/PromotionBanner.tsx
// 有效期内活动的醒目横幅（可配合倒计时）

// src/components/promotions/UpgradeModal.tsx
// 游客次数用完 / 非会员点击受限 → 引导升级会员的弹窗
```

---

### 3.7 代码规范与 Git Hooks

**init 文档未提及**，但对多人协作和长期维护至关重要：

```bash
pnpm add -D prettier eslint-config-prettier
pnpm add -D husky lint-staged
pnpm exec husky init
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

`.husky/pre-commit`：
```bash
pnpm exec lint-staged
```

---

### 3.8 字体加载（性能）

Next.js 15 内置 `next/font`，自动处理字体子集化和 CDN 托管，避免 Google Fonts 外链（对中国用户加载慢）：

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

中文字体注意：不要通过 `next/font` 加载完整中文字体（体积过大），推荐使用系统字体栈或按需加载方案（如 fontmin CDN）。

---

## 4. 架构合理性审视

### ✅ 合理的设计

| 设计 | 合理性说明 |
|---|---|
| Next.js App Router + RSC | SEO 型页面（资讯、团队、首页）全量 SSR，无 JS 开销；交互型页面（制图工具）按需 hydrate |
| Payload CMS 同进程 | CMS 内容读取零延迟（Local API），省一个容器，管理后台开箱即用 |
| BFF 层代理 NestJS | NestJS 不对外暴露，所有业务 API 经 BFF 统一鉴权转发，安全边界清晰 |
| HttpOnly Cookie 存 JWT | 防 XSS Token 劫持，比 localStorage 更安全 |
| Route Groups `(frontend)` | 布局隔离，用户页面 / BFF / Admin 互不干扰 |
| `dynamic import + ssr:false` | 图表库体积大，按需加载是唯一合理方案 |
| 促销字段内置 Order 模型 | 折扣计算在服务端完成，前端只展示结果，防止客户端篡改价格 |

### ⚠️ 需要注意的权衡

| 问题 | 影响 | 建议 |
|---|---|---|
| Payload CMS 与 Next.js 同进程 | CMS 配置变更需重新部署 Next.js | 接受这个代价，换取零额外容器；内容变更（文章、Banner）不需要重部署，只有 Collection 结构变更才需要 |
| 四个图表库全量引入 | 首屏 JS 体积风险 | 所有图表组件严格 `dynamic import`，使用 `next/bundle-analyzer` 周期性检查包大小 |
| Multi-repo 类型同步依赖 OpenAPI | 手动维护有滞后风险 | 后期考虑在 CI 中加入「bio-api Swagger JSON → bio-web types 自动生成」脚本（openapi-typescript） |
| Payload 和 Prisma 共用 PostgreSQL | 表命名冲突风险 | Payload 表名前缀为 `payload_`，Prisma 表名按业务命名，约定不要出现 `payload_` 前缀的 Prisma 表 |

### 🔮 扩展性评估

| 扩展场景 | 当前架构的支撑能力 |
|---|---|
| 国际化（中/英双语） | `next-intl` 已安装，加 `[locale]` 路由段即可；Payload CMS Localization 功能原生支持 |
| 新增业务页面（咨询、论文） | 在 `(frontend)/` 下新增目录，加对应 BFF Route Handler，无需改动其他模块 |
| 微信小程序 | BFF 层无需改动，NestJS API 已版本化，小程序直连 `/api/v1` |
| A/B 测试 | Next.js Middleware 可按 Cookie 分流，Payload CMS 可配置多套 Banner 内容 |
| 多租户 / 企业账号 | `useAuthStore` 加 `organization` 字段，路由层面加 `/org/[orgId]/` 前缀（当前无需，预留思路） |

---

## 5. 完整目录结构参考

```
bio-web/
├── src/
│   ├── app/
│   │   ├── (frontend)/                    ← 用户页面（共享导航/页脚）
│   │   │   ├── layout.tsx                 ← 导航栏、页脚、全局 Providers
│   │   │   ├── page.tsx                   ← 首页 /
│   │   │   ├── team/page.tsx              ← /team
│   │   │   ├── charts/
│   │   │   │   ├── basic/page.tsx         ← /charts/basic
│   │   │   │   └── custom/page.tsx        ← /charts/custom
│   │   │   ├── paper/page.tsx             ← /paper
│   │   │   ├── consulting/page.tsx        ← /consulting
│   │   │   ├── news/
│   │   │   │   ├── page.tsx               ← /news
│   │   │   │   └── [slug]/page.tsx        ← /news/[slug]
│   │   │   ├── user/
│   │   │   │   ├── login/page.tsx         ← /user/login
│   │   │   │   ├── profile/page.tsx       ← /user/profile
│   │   │   │   ├── orders/page.tsx        ← /user/orders
│   │   │   │   └── membership/page.tsx    ← /user/membership
│   │   │   ├── order/[id]/page.tsx        ← /order/[id]
│   │   │   ├── error.tsx                  ← 页面级错误边界
│   │   │   └── not-found.tsx              ← 404 页面
│   │   ├── api/                           ← BFF Route Handlers
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   ├── wechat/route.ts        ← 微信 OAuth 回调
│   │   │   │   └── alipay/route.ts        ← 支付宝 OAuth 回调
│   │   │   ├── charts/
│   │   │   │   ├── basic/route.ts         ← 发起制图任务
│   │   │   │   └── guest-check/route.ts   ← 游客次数校验
│   │   │   ├── orders/route.ts
│   │   │   ├── orders/[id]/route.ts
│   │   │   └── user/
│   │   │       ├── profile/route.ts
│   │   │       └── membership/route.ts
│   │   ├── (payload)/                     ← Payload CMS 路由组
│   │   │   └── admin/[[...segments]]/
│   │   │       ├── page.tsx
│   │   │       └── custom.scss
│   │   ├── layout.tsx                     ← 根 layout（font、全局 CSS）
│   │   └── global-error.tsx               ← 根级错误边界
│   │
│   ├── components/
│   │   ├── ui/                            ← 原子组件（Button、Input、Dialog、Badge...）
│   │   ├── charts/                        ← 图表业务组件
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── VolcanoChart.tsx
│   │   │   ├── ChartSkeleton.tsx
│   │   │   └── index.ts
│   │   ├── promotions/                    ← 促销相关组件
│   │   │   ├── PriceTag.tsx
│   │   │   ├── PromotionBanner.tsx
│   │   │   └── UpgradeModal.tsx
│   │   └── layout/                        ← 布局组件（Navbar、Footer、Sidebar）
│   │
│   ├── payload/
│   │   ├── payload.config.ts
│   │   ├── collections/
│   │   │   ├── BannerCollection.ts
│   │   │   ├── TeamCollection.ts
│   │   │   ├── NewsCollection.ts
│   │   │   ├── ChartExampleCollection.ts  ← 制图范例画廊
│   │   │   └── MediaCollection.ts         ← 媒体文件
│   │   └── globals/
│   │       ├── SiteSettings.ts            ← 联系方式、ICP
│   │       └── NavigationGlobal.ts        ← 导航菜单配置
│   │
│   ├── lib/
│   │   ├── api-client.ts                  ← nestFetch 封装
│   │   ├── payload-client.ts              ← Payload Local API 封装
│   │   ├── auth.ts                        ← Token 读取、用户信息工具函数
│   │   └── utils.ts                       ← clsx/tailwind-merge 等通用工具
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMembership.ts
│   │   └── useGuestLimit.ts
│   │
│   ├── store/
│   │   └── auth.ts                        ← Zustand 登录态 Store
│   │
│   ├── types/
│   │   ├── api.ts                         ← NestJS API 响应类型（与 OpenAPI 同步）
│   │   ├── payload.ts                     ← Payload CMS 生成类型（自动生成）
│   │   └── common.ts                      ← 通用类型（分页、响应包装等）
│   │
│   └── middleware.ts                      ← 路由保护
│
├── public/
│   └── ...静态资源
├── .env.local                             ← ❌ 不提交
├── .env.example                           ← ✅ 提交
├── next.config.ts                         ← withPayload 包裹
├── tailwind.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── package.json
```

---

> **最后一条建议：** 在开始写第一行业务代码之前，先把 `middleware.ts`、`error.tsx`、`not-found.tsx` 和 `SiteSettings Global` 建好。这四个文件的缺失是最容易在后期「补债」的地方。
