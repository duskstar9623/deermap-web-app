# Web App 技术文档

> 鹿图科技（DeerMap）前端 Web 应用的完整技术说明，涵盖目录结构、文件职责、技术栈、页面渲染机制、交互逻辑及开发方式。

---

## 目录

1. [技术栈总览](#技术栈总览)
2. [目录结构与文件职责](#目录结构与文件职责)
3. [页面渲染与初始化机制](#页面渲染与初始化机制)
4. [交互逻辑与状态管理](#交互逻辑与状态管理)
5. [路由系统](#路由系统)
6. [国际化（i18n）](#国际化i18n)
7. [HTTP 服务层](#http-服务层)
8. [样式系统](#样式系统)
9. [构建与开发方式](#构建与开发方式)

---

## 技术栈总览

| 分类 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | React | 19 | UI 渲染 |
| 语言 | TypeScript | 5.9 | 类型安全 |
| 构建 | Vite | 7 | 开发服务器 + 生产构建 |
| 路由 | React Router | v7 | SPA 客户端路由 |
| 状态管理 | Zustand | 5 | 模块级轻量 Store |
| 全局状态 | React Context | — | Auth / Theme / I18n |
| 样式 | Tailwind CSS | 3.4 | 原子化 CSS |
| 动画 | Framer Motion | 12 | 页面过渡 + 微交互 |
| 图表 | Recharts | 2.15 | 数据可视化 |
| HTTP | Axios | 1.16 | API 请求 |
| 国际化 | i18next + react-i18next | 26/17 | 多语言 |
| 图标 | Lucide React | — | SVG 图标库 |
| SVG 组件 | vite-plugin-svgr | 5 | SVG → React 组件 |
| 动画扩展 | tailwindcss-animate | 1.0 | Tailwind 动画工具类 |

---

## 目录结构与文件职责

```
deermap-web-app/
├── index.html                 # HTML 入口模板，挂载 #root 节点
├── package.json               # 依赖声明 + 脚本命令
├── vite.config.ts             # Vite 配置（插件、别名、分包策略）
├── tsconfig.json              # TypeScript 编译选项（严格模式、路径别名 @/）
├── tsconfig.node.json         # Node 侧 TS 配置（用于 vite.config.ts）
├── tailwind.config.js         # Tailwind 配置（自定义颜色、插件）
├── postcss.config.js          # PostCSS 管道（autoprefixer + tailwindcss）
├── eslint.config.js           # ESLint 平面配置
├── CLAUDE.md                  # AI 辅助编码行为准则
│
├── docs/                      # 项目文档
│   ├── overview/
│   │   ├── architecture.md    # 架构概览（三阶段规划）
│   │   └── business.md        # 商业策略文档
│   └── tech/
│       ├── assets.md          # 静态资源管理规范
│       ├── improve.md         # 架构改进计划（P0–P4 优先级）
│       ├── request.md         # HTTP 请求层规范
│       ├── style-governance-plan.md  # 样式治理计划
│       └── web-app.md         # 本文件
│
├── public/                    # 不经 Vite 处理的静态资源（直接 copy 到 dist/）
│   ├── charts/                # 图表类型示例缩略图 (.png)
│   ├── images/
│   │   ├── analysis/          # 分析流程配图
│   │   ├── backgrounds/       # 全屏背景图
│   │   ├── cards/             # 卡片封面图
│   │   ├── hero/              # 首页英雄区视频/图片
│   │   ├── omics/             # 组学领域配图
│   │   └── workflow/          # 工作流示意图
│   └── workflow-steps/        # 各组学分步骤配图
│
└── src/                       # 源代码根目录
    ├── main.tsx               # 应用入口：初始化 i18n → 渲染 React 树
    ├── App.tsx                # 根组件：Provider 包裹 + RouterProvider
    ├── index.css              # 全局 CSS：Tailwind 指令 + CSS 变量（主题色）
    ├── vite-env.d.ts          # Vite 环境类型声明
    │
    ├── assets/                # 需 Vite 处理的静态资源（会被 hash 重命名）
    │   ├── fonts/             # 自定义字体文件（预留）
    │   ├── icons/
    │   │   ├── index.ts       # SVG 图标统一导出（Logo, LogoDark）
    │   │   ├── logo.svg       # 品牌 Logo（通过 ?react 后缀导入为组件）
    │   │   ├── logo-dark.svg  # 暗色 Logo
    │   │   └── social/        # 社交媒体图标（预留）
    │   ├── images/            # 需构建处理的图片（预留）
    │   └── svgs/              # 通用 SVG 素材（预留）
    │
    ├── components/            # 可复用组件库
    │   ├── common/            # 通用功能组件
    │   │   └── LanguageSwitcher/
    │   │       └── index.tsx  # 语言切换器组件
    │   ├── layout/            # 布局组件
    │   │   ├── PageTransition.tsx  # 页面过渡动画包装器（fade + slide）
    │   │   ├── RootLayout.tsx     # 根布局：Navbar + AnimatePresence + Suspense + Footer
    │   │   ├── Navbar/
    │   │   │   └── index.tsx       # 顶部导航栏（响应式 + 移动端汉堡菜单）
    │   │   └── Footer/
    │   │       └── index.tsx       # 页脚（品牌信息 + 链接矩阵）
    │   └── shared/            # 通用 UI 组件
    │       ├── index.ts       # 统一导出入口
    │       ├── Button.tsx     # 按钮组件
    │       ├── Input.tsx      # 输入框组件
    │       ├── Select.tsx     # 下拉选择器
    │       ├── Modal.tsx      # 弹窗组件
    │       ├── Toast.tsx      # Toast 通知
    │       ├── Badge.tsx      # 标签/徽章组件
    │       ├── Skeleton.tsx   # 骨架屏（Skeleton / PageSkeleton）
    │       ├── Tabs.tsx       # 标签页组件
    │       ├── Card/
    │       │   └── index.tsx  # 通用卡片（图片 + 图标 + 内容）
    │       ├── Image/
    │       │   └── index.tsx  # 优化图片（lazy/priority/fallback/CLS 防抖）
    │       └── WorkflowSection/
    │           └── index.tsx  # 组学工作流步骤展示区块
    │
    ├── providers/             # 全局 Provider
    │   ├── index.tsx          # AppProviders 组合（Theme → I18n → Auth 嵌套顺序）
    │   ├── ThemeProvider.tsx  # 主题 Provider（light/dark，localStorage 持久化）
    │   ├── theme.context.ts   # Theme Context 定义
    │   ├── I18nProvider.tsx   # i18n Provider（懒加载非默认语言）
    │   ├── AuthProvider.tsx   # 认证 Provider（骨架，Phase 2 对接后端）
    │   └── auth.context.ts    # Auth Context 定义
    │
    ├── configs/               # 运行时配置
    │   └── requests.json      # API 配置（baseURL、timeout、endpoints 路径表）
    │
    ├── constants/             # 编译时常量
    │   ├── assets.ts          # public/ 资源路径常量表（ASSETS 对象）
    │   └── const.ts           # 应用级常量（主题色、语言枚举、Storage key 等）
    │
    ├── hooks/                 # 自定义 Hooks
    │   ├── useAuth.ts         # 封装 AuthContext 消费 + 空值保护
    │   ├── useI18n.ts         # 封装 i18next（含 setLocale 懒加载切换）
    │   ├── useLocalStorage.ts # localStorage 读写 Hook（带类型）
    │   └── useTheme.ts        # 封装 ThemeContext 消费 + 空值保护
    │
    ├── i18n/                  # 国际化配置
    │   ├── index.ts           # i18next 初始化（同步加载 zh-CN，懒加载 en-US）
    │   ├── zh-CN/             # 中文资源包（默认语言，同步打包）
    │   │   ├── index.ts       # 聚合导出所有命名空间
    │   │   ├── Global.json    # 公共文案（导航、按钮、品牌名、页脚等）
    │   │   ├── Home.json      # 首页文案
    │   │   ├── Bioinformatics.json  # 生信服务页文案
    │   │   ├── Visualization.json   # 可视化/图表页文案
    │   │   ├── Multiomics.json      # 多组学模块文案
    │   │   ├── Academic.json        # 学术服务页文案
    │   │   ├── Pricing.json         # 定价套餐页文案
    │   │   ├── Consulting.json      # 行业咨询文案
    │   │   ├── Contact.json         # 联系页文案
    │   │   └── Errors.json          # 错误信息文案
    │   └── en-US/             # 英文资源包（动态 import 懒加载）
    │       └── （结构同 zh-CN）
    │
    ├── pages/                 # 页面模块（按功能域划分）
    │   ├── home/
    │   │   ├── index.tsx      # 首页（Hero 视频 + 数据统计 + 功能卡片）
    │   │   └── components/
    │   ├── services/
    │   │   ├── index.tsx      # 生信分析服务页
    │   │   └── components/
    │   ├── visualization/
    │   │   ├── index.tsx      # 可视化模块布局壳（Outlet 转发）
    │   │   ├── ListPage.tsx   # 图表类型列表页
    │   │   ├── ChartToolPage.tsx  # 在线制图工具页
    │   │   ├── routes.tsx     # 模块路由配置
    │   │   ├── config.ts      # 图表类型静态数据 + i18n key 映射
    │   │   ├── store.ts       # Zustand Store（图表选择 + 参数状态）
    │   │   └── components/
    │   ├── multiomics/
    │   │   ├── index.tsx      # 多组学模块布局壳
    │   │   ├── ListPage.tsx   # 组学类型列表页
    │   │   ├── OmicsDetailPage.tsx  # 组学详情页（根据路径区分类型）
    │   │   ├── routes.tsx     # 模块路由配置
    │   │   └── components/
    │   ├── academic/
    │   │   ├── index.tsx      # 学术服务页
    │   │   └── components/
    │   ├── pricing/
    │   │   ├── index.tsx      # 定价套餐页
    │   │   └── components/
    │   └── contact/
    │       ├── index.tsx      # 联系/咨询表单页（Phase 1 静态，Phase 2 对接 API）
    │       └── components/
    │
    ├── router/                # 路由系统
    │   ├── index.tsx          # createBrowserRouter 实例化（组合所有路由）
    │   ├── routes.ts          # ROUTES 路径常量表（集中管理，as const）
    │   ├── types.ts           # AppRouteObject 类型定义（扩展 RouteObject + meta）
    │   ├── utils.ts           # lazyPage() 工具函数（代码分割辅助）
    │   └── guards/
    │       └── AuthGuard.tsx  # 路由级鉴权守卫（Phase 2，当前未挂载路由）
    │
    ├── services/              # API 服务层
    │   ├── index.ts           # 统一导出入口（便捷方法、Token、错误类型）
    │   ├── request.service.ts # Axios 封装（拦截器、Token、错误转换、便捷方法）
    │   ├── error.service.ts   # 统一错误处理（ApiError 类、ErrorCode 枚举）
    │   ├── localStorage.service.ts  # localStorage 读写封装
    │   ├── auth.service.ts    # 认证 API（Phase 2，当前为接口存根）
    │   ├── orders.service.ts  # 订单 API（Phase 2，当前为接口存根）
    │   └── contact.service.ts # 联系表单 API（Phase 2，当前为接口存根）
    │
    ├── types/                 # 全局类型定义
    │   ├── common.type.ts     # Language、LanguageCode、Theme 等通用类型
    │   ├── services/
    │   │   └── localStorage.type.ts  # 服务层相关类型（LocalStorageService 等）
    │   └── pages/
    │       ├── user.type.ts   # User、MembershipTier、AuthState
    │       ├── order.type.ts  # Order、OrderStatus、OrderType、PaymentMethod
    │       └── chart.type.ts  # ChartType、ColorPalette、ChartConfig
    │
    └── utils/                 # 工具函数
        ├── common.ts          # 通用工具函数
        └── language.ts        # 语言/i18n 辅助函数
```

---

## 页面渲染与初始化机制

### 启动流程（从浏览器加载到首屏渲染）

```
浏览器请求 index.html
  │
  ├── <div id="root"></div>    → React 挂载点
  └── <script src="/src/main.tsx">
        │
        ├── import './index.css'       → 注入 Tailwind + CSS 变量
        ├── import './i18n'            → 同步初始化 i18next（zh-CN 内联打包）
        └── createRoot(#root).render(
              <StrictMode>
                <App />                → 进入 React 树
              </StrictMode>
            )
```

### React 组件树渲染顺序

```
App
 └── AppProviders                    ← 全局 Provider 嵌套
      ├── ThemeProvider              ← 读取 localStorage → 设置 data-theme
      │   └── I18nProvider           ← 检测 locale → 按需懒加载 en-US
      │       └── AuthProvider       ← 初始化认证状态（当前为骨架）
      │           └── RouterProvider ← React Router 接管渲染
      │                └── RootLayout
      │                     ├── Navbar           ← 固定顶部导航
      │                     └── <main>
      │                          ├── AnimatePresence   ← 管理页面切换动画
      │                          │   └── PageTransition ← fade+slide 动画
      │                          │       └── Suspense   ← 等待 lazy 加载
      │                          │           └── <Outlet />  ← 当前路由页面
      │                          └── Footer            ← 页脚
```

### 关键机制说明

| 机制 | 实现方式 |
|------|----------|
| **代码分割** | 每个页面通过 `lazyPage(() => import('./xxx'))` 动态导入，Vite 自动生成独立 chunk |
| **页面过渡** | `AnimatePresence` + `PageTransition` 组件实现 fade+slide（opacity 0→1, y 10→0） |
| **加载态** | `<Suspense fallback={<div className="min-h-screen" />}>` 避免布局抖动 |
| **主题切换** | CSS 变量方案：`[data-theme="dark"]` 覆盖 `:root` 变量，Tailwind 通过 `rgb(var(--color-xxx) / <alpha-value>)` 引用 |
| **i18n 初始化** | zh-CN 同步打入主包（零延迟）；en-US 仅在用户切换时动态 import 并注册 |
| **SSR 兼容** | `typeof window === 'undefined'` 检查确保 ThemeProvider 在非浏览器环境不报错 |

---

## 交互逻辑与状态管理

### 状态管理三层模型

```
┌─────────────────────────────────────────────────────┐
│  React Context（全局跨切关注点）                       │
│  · Auth (user, isAuthenticated, login, logout)       │
│  · Theme (theme, toggleTheme, setTheme)              │
│  · I18n (via react-i18next I18nextProvider)          │
├─────────────────────────────────────────────────────┤
│  Zustand Store（模块级持久状态）                       │
│  · useVisualizationStore                             │
│    - selectedChart / chartParams                     │
│    - 跨页面导航后保留状态（不随路由销毁）                 │
├─────────────────────────────────────────────────────┤
│  Local State（组件级 UI 状态）                         │
│  · useState (mobileOpen, formData, etc.)             │
│  · 随组件卸载自动清理                                  │
└─────────────────────────────────────────────────────┘
```

### 典型交互模式

#### 1. 页面导航

```tsx
const navigate = useNavigate()
navigate(ROUTES.services)  // 使用集中常量，类型安全
```

- 导航触发 → React Router 匹配路由 → `lazy()` 加载模块 → `Suspense` 等待 → `PageTransition` 动画入场

#### 2. 国际化切换

```tsx
const { setLocale } = useI18n()
await setLocale('en-US')
// 1. loadLocale('en-US') → 动态 import en-US 资源包
// 2. i18n.changeLanguage('en-US') → 触发全组件树 re-render
// 3. localStorage.setItem('locale', 'en-US') → 下次刷新保持
```

#### 3. 主题切换

```tsx
const { toggleTheme } = useTheme()
toggleTheme()
// 1. setState → theme 变为 'dark'
// 2. useEffect → document.documentElement.setAttribute('data-theme', 'dark')
// 3. localStorage.setItem('theme', 'dark')
// 4. CSS 变量自动切换 → 所有使用 Tailwind color token 的元素即时变色
```

#### 4. API 调用流程

```tsx
// Phase 2 示例 — login from auth.service.ts
import { login } from '@/services/auth.service'

const result = await login({ phone, code })
// 1. 调用 post<LoginResult>(endpoints.login, params)
// 2. 请求拦截器 → 注入 Bearer Token（如有）
// 3. 响应拦截器 → 200: 返回 data | 非200: 转换为 ApiError
// 4. 全局错误处理器被触发（可用于统一 toast 提示）
```

#### 5. 路由守卫

```tsx
<AuthGuard>
  <ProtectedPage />
</AuthGuard>
// 消费 useAuth() → 未登录时 Navigate to="/" replace
```

#### 6. 列表交互 + 动画

```tsx
// 典型 stagger 模式（卡片列表逐个入场）
{items.map((item, i) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    viewport={{ once: true }}
  >
    ...
  </motion.div>
))}
```

---

## 路由系统

### 架构设计

- **集中路径常量**：`src/router/routes.ts` 中的 `ROUTES` 对象（`as const` 确保类型安全）
- **模块自治路由**：每个复杂模块（visualization、multiomics）拥有自己的 `routes.tsx`
- **懒加载工具**：`lazyPage()` 统一封装动态导入，返回 `{ Component }` 格式

### 路由表结构

```
/                       → HomePage
/services               → ServicesPage
/academic               → AcademicPage
/pricing                → PricingPage
/contact                → ContactPage
/visualization          → VisualizationLayout
  ├── /                 → ListPage (index route)
  └── /chart-tool       → ChartToolPage
/multiomics             → MultiomicsLayout
  ├── /                 → ListPage (index route)
  ├── /genomics         → OmicsDetailPage
  ├── /transcriptomics  → OmicsDetailPage
  ├── /proteomics       → OmicsDetailPage
  └── /metabolomics     → OmicsDetailPage
*                       → Navigate to /（兜底重定向）
```

### 嵌套路由模块化

```tsx
// src/pages/visualization/routes.tsx
export const visualizationRoutes: AppRouteObject = {
  path: '/visualization',
  lazy: lazyPage(() => import('./index')),  // Layout 壳
  children: [
    { index: true, lazy: lazyPage(() => import('./ListPage')) },
    { path: 'chart-tool', lazy: lazyPage(() => import('./ChartToolPage')) },
  ],
}
```

模块 Layout 通过 `<Outlet />` 渲染子路由内容。

---

## 国际化（i18n）

### 架构

- **默认语言**：zh-CN（同步打入主 bundle，零加载延迟）
- **可选语言**：en-US（动态 `import()` 懒加载，仅在用户切换时下载）
- **命名空间**：每个页面对应一个 namespace JSON 文件

### 命名空间列表

| Namespace | 对应内容 |
|-----------|----------|
| `Global` | 导航、按钮、品牌名、页脚等全局文案 |
| `Home` | 首页 Hero/Stats/Features |
| `Bioinformatics` | 生信服务页 |
| `Visualization` | 可视化/图表页 |
| `Multiomics` | 多组学模块 |
| `Academic` | 学术服务页 |
| `Pricing` | 定价套餐页 |
| `Consulting` | 行业咨询 |
| `Contact` | 联系页 |
| `Errors` | 错误信息 |

### 使用约定

```tsx
// 页面专属 namespace（通过 LANGUAGE_NAMESPACES 常量）
const { t } = useTranslation(LANGUAGE_NAMESPACES.HOME)

// 同时使用 Global namespace（别名 tc）
const { t: tc } = useTranslation(LANGUAGE_NAMESPACES.GLOBAL)

// 调用
t('hero.titleLine1')
tc('action.explore')
```

---

## HTTP 服务层

### 分层架构

```
configs/requests.json           ← 配置层：baseURL + endpoints 路径表
services/request.service.ts    ← 传输层：Axios 实例 + 拦截器 + 便捷方法
services/error.service.ts      ← 错误层：ApiError 类 + ErrorCode + 全局处理器
services/*.service.ts          ← 业务层：按领域分模块的 API 函数（Phase 2 存根）
```

### 请求生命周期

```
API 函数调用 (e.g. login from auth.service.ts)
  → post<LoginResult>(endpoints.login, params)
    → 请求拦截器
      · 注入 Authorization: Bearer {token}
      · DEV 环境打印日志
    → axios 发送请求
    → 响应拦截器
      · 成功 (2xx): 直接返回 AxiosResponse<ApiResponse<T>>
      · 失败: transformError() → ApiError
        · 取消: ErrorCode.CANCELLED
        · 无响应: NETWORK_ERROR / TIMEOUT
        · 有响应: 按 HTTP 状态码映射 ErrorCode
      · 触发全局错误处理器
      · Promise.reject(apiError)
```

### 统一响应结构

```typescript
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}
```

### Token 管理

- 存储位置：`localStorage('access_token')`
- 注入方式：请求拦截器自动读取并添加 `Authorization` 头
- 导出工具：`getToken()` / `setToken()` / `removeToken()`

---

## 样式系统

### CSS 变量 + Tailwind 方案

主题色通过 CSS 变量定义（RGB 值格式），Tailwind 配置中引用为 `rgb(var(--color-xxx) / <alpha-value>)` 以支持透明度调节。

```css
/* index.css */
:root {
  --color-primary: 26 31 113;     /* #1a1f71 */
  --color-accent: 99 102 241;     /* #6366f1 */
  --color-background: 255 255 255;
  ...
}

[data-theme="dark"] {
  --color-primary: 139 147 255;
  --color-background: 17 24 39;
  ...
}
```

### Tailwind 约定

| 约定 | 说明 |
|------|------|
| 内容容器 | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| 响应式断点 | `sm:` (640px) / `md:` (768px) / `lg:` (1024px) |
| 卡片基础 | `rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300` |
| 动画工具 | 通过 `tailwindcss-animate` 插件提供 `animate-in` / `animate-out` 等类 |

### 自定义颜色 Token

除通用色（primary/accent/background 等），还定义了组学领域专属色：

- `genomics` — 基因组学蓝
- `transcriptomics` — 转录组学红
- `proteomics` — 蛋白质组学紫
- `metabolomics` — 代谢组学绿

---

## 构建与开发方式

### NPM 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（HMR 热更新） |
| `npm run build` | TypeScript 类型检查 + Vite 生产构建 |
| `npm run lint` | ESLint 检查 |
| `npm run preview` | 本地预览生产构建产物 |

### Vite 配置要点

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), svgr(...)],
  resolve: { alias: { "@": "./src" } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          recharts: ['recharts'],
          'framer-motion': ['framer-motion'],
        }
      }
    }
  }
})
```

**分包策略**：将大型第三方库拆分为独立 chunk，利用浏览器缓存，减少主包体积。

### 开发规范

#### 新增页面流程

1. 在 `src/pages/<pageName>/` 创建 `index.tsx`（页面主组件）
2. 在 `src/i18n/zh-CN/` 和 `en-US/` 添加对应 namespace JSON
3. 在 `src/i18n/*/index.ts` 中注册新 namespace
4. 在 `src/router/routes.ts` 添加路径常量
5. 在 `src/router/index.tsx` 添加路由条目（使用 `lazyPage()`）
6. 如需独立路由树：在页面目录下创建 `routes.tsx` 模块路由

#### 新增 API 接口流程

1. 在 `src/configs/requests.json` 的 `endpoints` 中添加路径
2. 在 `src/services/` 下创建或追加 `*.service.ts` 模块文件
3. 使用 `get<T>` / `post<T>` 等泛型方法，传入 endpoint 路径
4. 在 `src/types/` 定义请求/响应类型
5. 按需在 `src/services/index.ts` 中导出

#### 组件规范

- **声明方式**：`function ComponentName()` 命名函数（非箭头函数）
- **页面导出**：`export default`
- **共享组件导出**：named export + `export default`
- **Props 类型**：同文件定义 `interface XxxProps`
- **图片属性**：必须添加 `loading="lazy"` + `decoding="async"` + `width`/`height`
- **常量定义**：使用 `as const` 断言

#### 路径别名

```typescript
// tsconfig.json
"paths": { "@/*": ["./src/*"] }

// 使用
import { ROUTES } from '@/router/routes'
```

---

## 附录：类型系统概览

### User 领域

```typescript
type MembershipTier = 'free' | 'daily' | 'monthly' | 'quarterly' | 'yearly'

interface User {
  id: string
  phone: string
  nickname: string
  avatar?: string
  wechatBound: boolean
  membership: { tier: MembershipTier; expiresAt: string | null }
  createdAt: string
}
```

### Order 领域

```typescript
type OrderType = 'basic_chart' | 'membership' | 'custom_chart'
             | 'paper_service' | 'bioinformatics' | 'consulting'
type OrderStatus = 'pending_payment' | 'paid' | 'in_progress'
               | 'completed' | 'cancelled' | 'refunded'
type PaymentMethod = 'wechat' | 'alipay'
```

### Chart 领域

```typescript
interface ChartType { id: string; name: string; img: string; description?: string; tags?: string[] }
interface ChartConfig { titleFontSize: number; labelFontSize: number; ... }
interface ColorPalette { name: string; colors: string[]; filter?: string }
```
