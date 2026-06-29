# Deermap Web App —— 项目分析报告与上手指南

> 面向 React + TypeScript 初学者。本文会逐句解析关键文件，并在合适位置给出优化建议。

---

## 目录

- [Deermap Web App —— 项目分析报告与上手指南](#deermap-web-app--项目分析报告与上手指南)
  - [目录](#目录)
  - [1. 项目简介](#1-项目简介)
  - [2. 技术栈一览](#2-技术栈一览)
  - [3. 目录结构详解](#3-目录结构详解)
  - [4. 快速启动](#4-快速启动)
  - [5. 核心文件逐句解析](#5-核心文件逐句解析)
    - [5.1 应用入口 `main.tsx`](#51-应用入口-maintsx)
    - [5.2 根组件 `App.tsx`](#52-根组件-apptsx)
    - [5.3 全局 Provider 组合 `providers/index.tsx`](#53-全局-provider-组合-providersindextsx)
    - [5.4 主题系统 `ThemeProvider.tsx`](#54-主题系统-themeprovidertsx)
    - [5.5 路由配置 `router/index.tsx`](#55-路由配置-routerindextsx)
    - [5.6 页面骨架 `RootLayout.tsx`](#56-页面骨架-rootlayouttsx)
    - [5.7 HTTP 客户端 `request.service.ts`](#57-http-客户端-requestservicets)
    - [5.8 错误系统 `error.service.ts`](#58-错误系统-errorservicets)
    - [5.9 本地存储服务 `localStorage.service.ts`](#59-本地存储服务-localstorageservicets)
    - [5.10 i18n 多语言 `i18n/index.ts`](#510-i18n-多语言-i18nindexts)
    - [5.11 全局常量 `constants/const.ts`](#511-全局常量-constantsconstts)
    - [5.12 类型定义 `types/common.ts`](#512-类型定义-typescommonts)
    - [5.13 共享组件 `Button.tsx` / `Card/index.tsx`](#513-共享组件-buttontsx--cardindextsx)
  - [6. 重要设计模式解读](#6-重要设计模式解读)
    - [模式一：Context + Hook 封装](#模式一context--hook-封装)
    - [模式二：Context 与 Provider 分离](#模式二context-与-provider-分离)
    - [模式三：路由懒加载 + 骨架屏](#模式三路由懒加载--骨架屏)
    - [模式四：服务层（Service Layer）](#模式四服务层service-layer)
  - [7. 数据流全景图](#7-数据流全景图)
  - [8. 优化建议汇总](#8-优化建议汇总)
    - [🔴 高优先级](#-高优先级)
    - [🟡 中优先级](#-中优先级)
    - [🟢 低优先级 / 长期改进](#-低优先级--长期改进)
  - [附录：常用命令速查](#附录常用命令速查)

---

## 1. 项目简介

**Deermap** 是一个面向科研用户的一站式科研服务平台，提供：

| 模块 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 平台入口与功能导览 |
| 多组学 | `/multiomics` | 基因组、转录组、蛋白质组、代谢组服务 |
| 可视化 | `/visualization` | 数据可视化分析工具 |
| 学术服务 | `/academic` | 学术支持相关功能 |
| 定价 | `/pricing` | 服务定价页 |
| 联系我们 | `/contact` | 用户联系表单 |

---

## 2. 技术栈一览

```
React 19          → UI 框架
TypeScript 5.9    → 静态类型检查
Vite 7            → 构建工具（极速热更新）
React Router 7    → 前端路由
Tailwind CSS 3    → 原子化 CSS
Framer Motion 12  → 动画库
i18next 26        → 多语言国际化
Axios 1           → HTTP 请求库
Zustand 5         → 轻量状态管理（当前预置，未大规模使用）
Recharts 2        → 图表库
lucide-react      → 图标库
```

> **为什么选这些库？**
> - **Vite** 比 Create React App (CRA) 快 10~100 倍，适合现代项目。
> - **Tailwind** 不需要手写 CSS 文件，减少命名烦恼。
> - **Framer Motion** 用声明式 API 写动画，比手写 CSS keyframes 直观。
> - **i18next** 是最成熟的前端国际化方案，支持懒加载语言包。

---

## 3. 目录结构详解

```
src/
├── main.tsx              # 应用唯一入口，启动前先初始化 i18n
├── App.tsx               # 根组件，组装 Provider + Router
├── index.css             # 全局样式，定义 CSS 变量（主题色）
│
├── assets/               # 静态资源：字体、图标、SVG
├── components/
│   ├── common/           # 通用 UI 功能组件（如语言切换）
│   ├── layout/           # 布局组件：Navbar、Footer、RootLayout
│   └── shared/           # 跨页面复用的原子/分子组件
│       ├── Button.tsx
│       ├── Card/
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── ...
│
├── configs/
│   └── requests.json     # HTTP 请求基础配置（baseURL、timeout）
│
├── constants/
│   └── const.ts          # 全局常量（语言、主题、localStorage key）
│
├── hooks/                # 自定义 React Hook
│   ├── useTheme.ts       # 读取/切换主题
│   ├── useI18n.ts        # 读取/切换语言
│   ├── useAuth.ts        # 读取认证状态
│   └── useLocalStorage.ts
│
├── i18n/                 # 国际化资源
│   ├── index.ts          # i18n 实例配置与懒加载逻辑
│   ├── zh-CN/            # 中文翻译文件（默认语言，随主包加载）
│   └── en-US/            # 英文翻译文件（懒加载）
│
├── pages/                # 页面组件，每个子目录对应一条路由
│   ├── home/
│   ├── multiomics/
│   ├── visualization/
│   └── ...
│
├── providers/            # React Context 提供者
│   ├── index.tsx         # 所有 Provider 的组合出口
│   ├── ThemeProvider.tsx
│   ├── I18nProvider.tsx
│   ├── AuthProvider.tsx
│   ├── theme.context.ts  # Context 对象定义（与 Provider 分离）
│   └── auth.context.ts
│
├── router/               # 路由配置
│   ├── index.tsx         # createBrowserRouter 入口
│   ├── routes.ts         # 路径常量（如 ROUTES.home）
│   ├── types.ts          # 路由类型扩展
│   ├── utils.ts          # lazyPage 工具函数
│   └── guards/
│       └── AuthGuard.tsx # 路由守卫
│
├── services/             # 业务服务层
│   ├── request.service.ts     # axios 封装，统一 HTTP 客户端
│   ├── error.service.ts       # 错误类型、错误码、全局错误处理
│   ├── localStorage.service.ts # localStorage 安全封装
│   ├── auth.service.ts        # 认证 API（Phase 2 预置存根）
│   ├── orders.service.ts      # 订单 API（Phase 2 预置存根）
│   └── contact.service.ts     # 联系表单 API（Phase 2 预置存根）
│
├── types/                # TypeScript 类型定义
│   ├── common.ts         # 语言、主题等基础类型
│   ├── services.ts       # Service 层接口类型
│   └── business/         # 业务实体类型（User 等）
│
└── utils/                # 纯函数工具
    ├── common.ts
    └── language.ts       # 语言工具函数
```

---

## 4. 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 3. 构建生产包（先做类型检查，再打包）
npm run build

# 4. 本地预览生产包
npm run preview

# 5. 代码风格检查
npm run lint
```

> **注意**：`npm run build` 等同于 `tsc --noEmit && vite build`，它会先做完整的 TypeScript 类型检查，任何类型错误都会阻止打包。如果只想快速验证类型，直接跑 `npx tsc --noEmit`。

---

## 5. 核心文件逐句解析

### 5.1 应用入口 `main.tsx`

```tsx
import { StrictMode } from 'react';
// StrictMode 是 React 提供的调试工具，不影响生产环境
// 它会故意把组件渲染两次，帮助发现副作用（Effect）的问题

import { createRoot } from 'react-dom/client';
// createRoot 是 React 18+ 的新 API，替代老的 ReactDOM.render

import './index.css';
import App from './App.tsx';

async function bootstrap() {
  // ① 先异步导入 i18n 的初始化函数（动态 import，按需加载）
  const { initializeI18n } = await import('./i18n');
  
  // ② 等待 i18n 初始化完成（会读取用户语言偏好、懒加载对应语言包）
  // 必须在渲染前完成，否则首屏会闪烁默认语言后再跳到用户语言
  await initializeI18n();

  // ③ 挂载 React 应用到 index.html 里 id="root" 的 div
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// 调用 bootstrap 函数，启动应用
bootstrap();
```

**关键设计**：`bootstrap()` 是一个异步函数。先等 i18n 准备好再渲染，避免了"先显示中文再闪变英文"的问题。这种"先初始化再渲染"的模式在处理异步初始化时非常常见。

---

### 5.2 根组件 `App.tsx`

```tsx
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/providers';   // @ 是 src/ 的路径别名
import { router } from '@/router';

function App() {
  return (
    // AppProviders：把所有全局 Context（主题、语言、认证）套在最外层
    <AppProviders>
      {/* RouterProvider：把路由注入整个应用 */}
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
```

**关键设计**：`App.tsx` 故意写得极简——它只做两件事：包裹全局 Context、注册路由。具体逻辑分散到 `providers/` 和 `router/`，保持职责单一。

> 💡 **`@/` 路径别名**：在 `vite.config.ts` 中配置了 `@ → src/`，所以 `@/providers` 等价于 `src/providers`。这样避免了 `../../../../` 这种难看的相对路径。

---

### 5.3 全局 Provider 组合 `providers/index.tsx`

```tsx
import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { AuthProvider } from './AuthProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // 嵌套顺序很重要！外层 Provider 的值可以被内层使用
    // ThemeProvider 在最外层：让内部所有组件（含 I18n、Auth）都能读取主题
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          {children}  {/* children 是 <RouterProvider>，即整个应用 */}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
```

**关键设计**：把所有 Provider 集中到一个文件，App.tsx 只需调用 `<AppProviders>`，新增全局 Provider 时也只改这一处，而不是污染 App.tsx。

> ⚠️ **优化建议 1**：目前 Provider 嵌套是手动维护的，如果将来 Provider 超过 5~6 个，可以考虑写一个 `compose` 辅助函数来避免"圣诞树"结构：
> ```tsx
> // 方案参考（compose 工具）
> const providers = [ThemeProvider, I18nProvider, AuthProvider];
> export function AppProviders({ children }) {
>   return providers.reduceRight(
>     (acc, Provider) => <Provider>{acc}</Provider>,
>     children
>   );
> }
> ```

---

### 5.4 主题系统 `ThemeProvider.tsx`

```tsx
import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { THEME, LOCAL_STORAGE_KEYS } from '@/constants/const';
import type { Theme } from '@/types/common';
import { localStorageService } from '@/services/localStorage.service';
import { ThemeContext } from './theme.context';

export function ThemeProvider({ children }: { children: ReactNode }) {

  // ① useState 的惰性初始化（传入函数而非值）
  // 只在组件第一次渲染时执行，避免每次渲染都读 localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return THEME.LIGHT; // SSR 兼容
    return localStorageService.get<Theme>(LOCAL_STORAGE_KEYS.THEME, THEME.LIGHT);
  });

  // ② theme 变化时，同步写入 HTML 根元素属性 和 localStorage
  // data-theme="dark" 会触发 index.css 中 [data-theme="dark"] 的 CSS 变量切换
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorageService.set(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // ③ useCallback 缓存函数引用，依赖数组为空 [] 表示函数永不重建
  // 避免每次渲染都生成新函数，导致消费 Context 的子组件不必要地重新渲染
  const toggleTheme = useCallback(
    () => setTheme((prev: Theme) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)),
    []
  );

  // ④ useMemo 缓存传给 Context 的 value 对象
  // 如果不用 useMemo，每次 ThemeProvider 渲染都会产生新对象，
  // 导致所有消费 ThemeContext 的组件重新渲染（即使 theme 没变）
  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**主题切换原理**：CSS 变量 + `data-theme` 属性。

```
用户点击切换 → toggleTheme() → setTheme('dark')
                                       ↓
                    useEffect: document.documentElement.setAttribute('data-theme', 'dark')
                                       ↓
                    index.css: [data-theme="dark"] { --color-primary: ...; ... }
                                       ↓
                    Tailwind: bg-primary 读取 --color-primary，颜色自动变换
```

> 💡 **关键知识点**：Context 的 `value` 如果是对象字面量 `{ a, b }`，每次渲染都是新引用，所有消费者都会重新渲染。用 `useMemo` 包裹可以解决这个问题。

---

### 5.5 路由配置 `router/index.tsx`

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { visualizationRoutes } from '@/pages/visualization/routes';
import { multiomicsRoutes } from '@/pages/multiomics/routes';
import { lazyPage } from './utils';
import type { AppRouteObject } from './types';

// ① 简单页面集中定义，结构清晰
const simplePages: AppRouteObject[] = [
  { path: '/',          lazy: lazyPage(() => import('@/pages/home')) },
  { path: '/services',  lazy: lazyPage(() => import('@/pages/services')) },
  { path: '/academic',  lazy: lazyPage(() => import('@/pages/academic')) },
  { path: '/pricing',   lazy: lazyPage(() => import('@/pages/pricing')) },
  { path: '/contact',   lazy: lazyPage(() => import('@/pages/contact')) },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,   // ② 所有路由共享同一个布局（Navbar + Footer）
    children: [
      ...simplePages,          // ③ 展开简单页面路由
      visualizationRoutes,     // 可视化子路由（定义在 pages/visualization/routes.tsx）
      multiomicsRoutes,        // 多组学子路由（嵌套路由，见下方）
      { path: '*', element: <Navigate to="/" replace /> }, // ④ 404 重定向到首页
    ],
  },
]);
```

**`lazyPage` 工具函数**（`router/utils.ts`）：

```tsx
// 将动态 import 包装为 React Router 7 的 lazy 格式
export function lazyPage(importFn) {
  return async () => {
    const module = await importFn();           // 动态加载页面模块
    return { Component: module.default };      // 返回 React Router 期望的格式
  };
}
```

**多组学嵌套路由**（`pages/multiomics/routes.tsx`）：

```
/multiomics              → ListPage（列表页）
/multiomics/genomics     → OmicsDetailPage（详情页）
/multiomics/transcriptomics
/multiomics/proteomics
/multiomics/metabolomics
```

**路由层次结构**：

```
createBrowserRouter
└── RootLayout（Navbar + Footer 框架）
    ├── /             → Home（懒加载）
    ├── /academic     → Academic（懒加载）
    ├── /multiomics   → multiomics/index（懒加载）
    │   ├── index     → ListPage
    │   └── :omics    → OmicsDetailPage
    └── *             → 重定向到 /
```

> 💡 **懒加载的好处**：首次加载时浏览器只下载当前路由所需的 JS，其他页面的代码会在用户导航时才按需下载，显著加快首屏速度。

---

### 5.6 页面骨架 `RootLayout.tsx`

```tsx
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { PageSkeleton } from '@/components/shared';

export function RootLayout() {
  // useLocation 获取当前路径，用作 AnimatePresence 的 key
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-0 overflow-y-auto">
        {/* AnimatePresence：监听子组件的挂载/卸载，触发进出场动画
            mode="wait" 表示：等旧页面退出动画完成后，再播放新页面进入动画 */}
        <AnimatePresence mode="wait">
          {/* key={location.pathname}：每次路由变化，React 会认为这是一个新元素，
              从而触发 PageTransition 的进出场动画 */}
          <PageTransition key={location.pathname}>
            {/* Suspense：在懒加载页面还没加载完时，显示骨架屏 fallback */}
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />  {/* 当前路由匹配的页面会在这里渲染 */}
            </Suspense>
          </PageTransition>
        </AnimatePresence>
        <Footer />
      </main>
    </div>
  );
}
```

**页面切换动画原理**（`PageTransition.tsx`）：

```tsx
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}    // 进入前：透明 + 向下偏移 10px
      animate={{ opacity: 1, y: 0 }}     // 进入后：完全不透明 + 回到原位
      exit={{ opacity: 0, y: -10 }}      // 退出时：透明 + 向上偏移 10px
      transition={{ duration: 0.3 }}     // 动画时长 0.3 秒
    >
      {children}
    </motion.div>
  );
}
```

---

### 5.7 HTTP 客户端 `request.service.ts`

这是与后端通信的核心模块，基于 axios 封装。

```
┌─────────────────────────────────────────────┐
│               HTTP 请求流程                   │
│                                             │
│  业务代码调用 get/post/put/del               │
│      ↓                                      │
│  请求拦截器（注入 Token、打印日志）            │
│      ↓                                      │
│  axios 发出 HTTP 请求                        │
│      ↓                                      │
│  响应拦截器（解包数据 / 统一处理错误）         │
│      ↓                                      │
│  返回 ApiResponse<T> 或抛出 ApiError         │
└─────────────────────────────────────────────┘
```

**关键代码片段**：

```ts
// Token 自动注入
httpClient.interceptors.request.use((config) => {
  const token = getToken();                          // 从 localStorage 读 JWT
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // 写入请求头
  }
  return config;
});
```

```ts
// 便捷方法（业务代码直接用这些，不直接操作 httpClient）
export function get<T>(url, config?)    // GET 请求
export function post<T>(url, data?)     // POST 请求
export function put<T>(url, data?)      // PUT 请求
export function del<T>(url, config?)    // DELETE 请求
```

**通用响应结构**：

```ts
interface ApiResponse<T> {
  code: number       // 业务状态码
  message: string    // 提示信息
  data: T            // 实际数据（泛型，由调用方指定类型）
}
```

> ⚠️ **优化建议 2**：当前响应拦截器需要补全（文件中的响应拦截器部分未在此处展示完整）。建议在响应拦截器中统一解包 `response.data.data`，这样业务代码就不需要每次都 `.data.data`。

---

### 5.8 错误系统 `error.service.ts`

```ts
// ① 业务错误码枚举（比 HTTP 状态码更语义化）
export enum ErrorCode {
  UNKNOWN         = 'UNKNOWN',
  NETWORK_ERROR   = 'NETWORK_ERROR',
  TIMEOUT         = 'TIMEOUT',
  UNAUTHORIZED    = 'UNAUTHORIZED',   // 需要重新登录
  TOKEN_EXPIRED   = 'TOKEN_EXPIRED',
  FORBIDDEN       = 'FORBIDDEN',      // 无权限
  NOT_FOUND       = 'NOT_FOUND',
  SERVER_ERROR    = 'SERVER_ERROR',
  // ...
}

// ② 统一的 API 错误类（继承内置 Error）
export class ApiError extends Error {
  readonly code: ErrorCode;   // 业务错误码
  readonly status: number;    // HTTP 状态码
  readonly details?;          // 额外错误信息

  // 便捷判断方法
  get isAuthError(): boolean { ... }    // 是否需要重新登录
  get isNetworkError(): boolean { ... } // 是否是网络问题
}

// ③ 全局错误处理器（可被替换）
// 默认行为：打印到控制台
// 实际项目中可替换为 Toast 通知或错误上报
let globalErrorHandler: ErrorHandler = (error) => { ... };
export function setGlobalErrorHandler(handler) { globalErrorHandler = handler; }
```

> 💡 **设计亮点**：通过 `setGlobalErrorHandler` 可以在应用启动时注入 Toast 通知，实现全局统一的错误提示，业务代码无需每个请求都写 `catch`。

---

### 5.9 本地存储服务 `localStorage.service.ts`

原生 `localStorage` 只能存储字符串，这个服务解决了以下问题：

| 问题 | 解决方案 |
|------|---------|
| 只能存字符串，无法存对象 | 序列化时用前缀标记，反序列化时自动 JSON.parse |
| 服务端渲染（SSR）会报错 | `isBrowser()` 检查，SSR 环境直接返回默认值 |
| 存取失败会抛异常 | `try/catch` 捕获，失败时返回 `defaultValue` 或静默失败 |

```ts
// 序列化：字符串直接存，对象用前缀 __obj__ + JSON.stringify
const serialize = <T>(value: T): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  return `${LOCAL_STORAGE_OBJECT_PREFIX}${JSON.stringify(value)}`;
};

// 反序列化：检查前缀，有则 JSON.parse，无则直接返回字符串
const deserialize = <T>(raw: string): T => {
  if (raw.startsWith(LOCAL_STORAGE_OBJECT_PREFIX)) {
    return JSON.parse(raw.slice(LOCAL_STORAGE_OBJECT_PREFIX.length)) as T;
  }
  return raw as T;
};
```

---

### 5.10 i18n 多语言 `i18n/index.ts`

```ts
// ① 初始化 i18next，只预加载中文（默认语言）
i18n.use(initReactI18next).init({
  resources: { [DEFAULT_LANGUAGE]: zhCN },  // 中文资源随主包加载
  lng: DEFAULT_LANGUAGE,                    // 默认语言
  fallbackLng: DEFAULT_LANGUAGE,            // 找不到翻译时回退到中文
  ns: Object.values(LANGUAGE_NAMESPACES),   // 命名空间列表（模块化翻译文件）
  interpolation: { escapeValue: false },    // 关闭 HTML 转义（React 已自动处理 XSS）
});

// ② 非默认语言（英文）的懒加载
const languageBundles = {
  [LANGUAGES.en]: () => import('./en-US')  // 用户切换到英文时才动态加载
};

// ③ 应用启动时的初始化：读取用户偏好语言
export async function initializeI18n(): Promise<void> {
  const savedLanguageCode = getLanguageCode(); // 从 localStorage 读
  if (savedLanguageCode !== DEFAULT_LANGUAGE_CODE) {
    // 如果用户偏好英文，先加载英文包，再切换，避免首屏闪烁
    await loadLanguage(targetLanguage);
    await i18n.changeLanguage(targetLanguage);
  }
}
```

**命名空间**是 i18next 的模块化机制，翻译文件按功能拆分：

```
i18n/zh-CN/
  Global.json        → 全局通用文本（导航栏、按钮等）
  Home.json          → 首页专属文本
  Multiomics.json    → 多组学页面文本
  ...
```

在组件中使用：

```tsx
const { t } = useI18n('Home');        // 指定命名空间
const title = t('hero.title');        // 读取 Home.json 中 hero.title 的值
```

---

### 5.11 全局常量 `constants/const.ts`

```ts
// 语言标识符
export const LANGUAGES = {
  zh: 'zh-CN',
  en: 'en-US'
} as const;
// "as const" 让 TypeScript 把值推断为字面量类型（'zh-CN'），而不是宽泛的 string

// localStorage 存储 key（统一前缀，避免与其他应用冲突）
export const LOCAL_STORAGE_KEYS = {
  THEME:        'deermap_theme',
  LANGUAGE:     'deermap_language',
  ACCESS_TOKEN: 'deermap_jwt_token'
} as const;

// 主题枚举
export const THEME = { LIGHT: 'light', DARK: 'dark' } as const;
```

> 💡 **`as const` 的作用**：
> ```ts
> // 不用 as const：
> const THEME = { LIGHT: 'light' }; // THEME.LIGHT 的类型是 string
>
> // 用了 as const：
> const THEME = { LIGHT: 'light' } as const; // THEME.LIGHT 的类型是字面量 'light'
> ```
> 配合 `typeof THEME[keyof typeof THEME]` 就能得到精确的联合类型 `'light' | 'dark'`，而不是宽泛的 `string`。

---

### 5.12 类型定义 `types/common.ts`

```ts
import { LANGUAGES, LANGUAGE_NAMESPACES } from '@/constants/const';
import { THEME } from '@/constants/const';

// 从常量对象的值推导类型，而不是手动写 'zh-CN' | 'en-US'
// 这样修改 LANGUAGES 时，类型自动跟随更新，无需同步维护
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
// = 'zh-CN' | 'en-US'

export type LanguageCode = keyof typeof LANGUAGES;
// = 'zh' | 'en'

export type Theme = (typeof THEME)[keyof typeof THEME];
// = 'light' | 'dark'
```

> 💡 **`typeof obj[keyof typeof obj]` 是 TypeScript 的常用技巧**，用于从常量对象提取所有值的联合类型。这比手写 `'light' | 'dark'` 更安全，因为改常量时类型自动同步。

---

### 5.13 共享组件 `Button.tsx` / `Card/index.tsx`

**Button.tsx**：

```tsx
// 变体样式映射，集中管理，避免样式散落在各组件
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-white hover:bg-primary-light',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  ghost:     'bg-transparent text-gray-700 hover:bg-gray-100',
  outline:   'border border-primary text-primary bg-transparent hover:bg-primary/5',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }) {
  // 如果调用方传了 className，则完全覆盖默认样式（逃生舱）
  // 如果没传，则用 variant + size 组合出默认样式
  const computedClass = className ? className : [...].join(' ');

  return (
    // motion.button 比普通 button 多了动画属性
    <motion.button
      whileHover={{ scale: 1.05 }}  // 悬停时放大 5%
      whileTap={{ scale: 0.95 }}    // 点击时缩小 5%
      {...rest}                     // 展开其余 HTML button 属性（onClick、disabled 等）
      className={computedClass}
    >
      {children}
    </motion.button>
  );
}
```

**Card/index.tsx** 的入场动画：

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}     // 初始：透明 + 向下 30px
  whileInView={{ opacity: 1, y: 0 }}  // 进入视口时：显示 + 回到原位
  viewport={{ once: true }}           // 只触发一次（滚动回来不重复播放）
>
```

---

## 6. 重要设计模式解读

### 模式一：Context + Hook 封装

项目中每个 Context 都配套一个同名 Hook：

```
ThemeContext  ←→  useTheme()
AuthContext   ←→  useAuth()
```

Hook 内部做了边界检查：

```ts
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  // 这行会在组件写在 ThemeProvider 外部时立刻报错，而不是静默返回 undefined
  return ctx;
}
```

> **好处**：调用方不需要判断 `ctx` 是否为 `null`，错误会被明确指出。

### 模式二：Context 与 Provider 分离

每个 Context 对象放在单独的 `*.context.ts` 文件，Provider 放在 `*.Provider.tsx`：

```
theme.context.ts  → createContext（纯数据）
ThemeProvider.tsx → 状态逻辑 + 提供 value
useTheme.ts       → 消费 Context
```

> **好处**：避免循环依赖，文件职责更单一。

### 模式三：路由懒加载 + 骨架屏

```
用户访问 /academic
    ↓
React Router 调用 lazyPage(() => import('@/pages/academic'))
    ↓
浏览器动态下载 academic.chunk.js
    ↓
下载期间：Suspense 显示 PageSkeleton（骨架屏）
    ↓
下载完成：渲染真实页面（带 PageTransition 进场动画）
```

### 模式四：服务层（Service Layer）

页面组件不直接调用 `axios`，而是通过 `request.service.ts` 封装的 `get/post/put/del`。这样做的好处：

- 换掉 axios 只需改一个文件
- 拦截器（Token 注入、错误处理）自动生效
- 业务代码更简洁

---

## 7. 数据流全景图

```
用户操作
    ↓
页面组件（/pages/*）
    ↓
自定义 Hook（useTheme / useI18n / useAuth）
    ↓
Context（ThemeContext / AuthContext）        ← Provider 在 providers/ 中维护状态
    ↓（需要持久化时）
localStorageService.set/get                 ← 读写浏览器 localStorage
    ↓（需要请求 API 时）
request.service.ts (get/post/put/del)       ← axios 拦截器处理 Token、错误
    ↓
后端 API
```

---

## 8. 优化建议汇总

以下按优先级排列：

### 🔴 高优先级

**1. 响应拦截器补全**  
`request.service.ts` 的响应拦截器应统一解包 `response.data`，避免业务代码每次都 `.data.data`：

```ts
httpClient.interceptors.response.use(
  (response) => response.data,      // 直接返回业务数据层
  (error: AxiosError) => {
    const apiError = transformError(error);
    getGlobalErrorHandler()(apiError);
    return Promise.reject(apiError);
  }
);
```

**2. 注入全局 Toast 错误处理器**  
在 `main.tsx` 的 `bootstrap()` 中调用 `setGlobalErrorHandler`，把所有 API 错误接入 Toast 通知系统，而不是只打印到控制台。

---

### 🟡 中优先级

**3. 路由 `routes.ts` 常量使用**  
项目中已定义了 `ROUTES` 常量（如 `ROUTES.home`），确保所有 `<Link to="...">` 和 `<Navigate to="...">` 都使用常量而不是硬编码字符串，防止路径拼写错误。

**4. Tailwind 主题色避免魔法字符串**  
已通过 CSS 变量实现 `primary` / `accent` 等语义色，保持一致性。注意不要在业务代码中直接写 `bg-[#1a1f71]` 这样的硬编码颜色，应优先用 `bg-primary`。

**5. 页面级 `<title>` 管理**  
当前路由切换时浏览器标签页标题不会更新。可以在 `RootLayout` 中监听 `location.pathname` 并更新 `document.title`，提升 SEO 和用户体验。

```tsx
// 方案参考
useEffect(() => {
  const routeTitles: Record<string, string> = {
    '/': 'Deermap - 科研服务平台',
    '/multiomics': '多组学分析 - Deermap',
  };
  document.title = routeTitles[location.pathname] ?? 'Deermap';
}, [location.pathname]);
```

---

### 🟢 低优先级 / 长期改进

**6. 引入 React Query / SWR**  
当 Phase 2 的 API 接入后，`auth.service.ts`、`orders.service.ts` 等会产生大量异步状态（loading / error / data）。建议引入 [TanStack Query](https://tanstack.com/query) 来管理服务端状态，避免在组件里手写 `useState` + `useEffect` 的样板代码。

**7. 表单校验库**  
联系页面（`/contact`）的表单当前需要手动校验。可引入 [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) 组合，声明式定义校验规则，减少代码量并提升可维护性。

**8. 端到端测试**  
建议引入 [Playwright](https://playwright.dev/) 对关键用户路径（首页加载、路由跳转、语言切换）做 E2E 测试，保障重构不破坏已有功能。

---

## 附录：常用命令速查

| 操作 | 命令 |
|------|------|
| 启动开发服务器 | `npm run dev` |
| 类型检查（不打包） | `npx tsc --noEmit` |
| 打包生产版本 | `npm run build` |
| 预览生产包 | `npm run preview` |
| ESLint 代码检查 | `npm run lint` |
| 新增翻译词条 | 在 `i18n/zh-CN/*.json` 和 `i18n/en-US/*.json` 中同步添加 |
| 新增路由页面 | 在 `pages/` 下建目录 → 在 `router/index.tsx` 中用 `lazyPage` 注册 |
| 新增全局常量 | 写入 `constants/const.ts` → 在 `types/common.ts` 中推导对应类型 |
