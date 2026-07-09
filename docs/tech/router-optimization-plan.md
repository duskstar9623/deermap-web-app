# 路由架构优化执行说明

> 状态：待执行 | 关联文件：`src/router/`、`src/components/layout/RootLayout.tsx`
> 本文档是路由架构审核后的执行计划，用于指导实施与验收，不是最终架构文档（实施完成后应视需要合并进 `docs/tech/web-app.md`）。

## 1. 背景与审核结论

对 `src/router/` 及相关布局代码做架构审核后，发现以下问题：

1. **关键 Bug（阻断级）**：`src/router/routes.ts` 的 `ROUTES` 常量只有 `bioinformatics: '/bioinfo-analysis'`，没有 `services` 字段；但 `Navbar`/`Footer`/`HeroSection`/`FeaturesSection` 共 4 个文件仍引用不存在的 `ROUTES.services`（TS 属性访问错误）。`docs/tech/web-app.md` 文档中的示例也用的是 `ROUTES.services`，说明这是一次重构改名时漏改导致的回归。
2. **`meta` 字段设计缺陷**：`AppRouteObject.meta`（`title`/`requireAuth`）是自定义扩展字段，但 React Router v7 的 `useMatches()` 只透传官方 `handle` 字段，不包含任意自定义 key，因此运行时无法通过 `useMatches()` 读取 `meta`——是"看起来存在但实际不可用"的死配置，应迁移为官方支持的 `handle` 扩展点。
3. **404 处理简陋**：未匹配路由直接 `<Navigate to="/" replace />` 静默重定向，没有真正的 404 页面，对 UX/SEO 不友好。
4. **无路由级错误边界**：没有 `errorElement`/`useRouteError`，lazy chunk 加载失败或渲染异常会导致白屏无兜底。
5. **无 chunk 加载失败重试**：`lazyPage()` 直接包裹 `import()`，部署后线上旧 tab 命中过期 chunk hash 会永久报错，无重试/刷新兜底。
6. **无路由级 `document.title` 管理**：`RouteMeta.title` 定义了但零消费，所有页面标题都是 `index.html` 里的静态"鹿图科技"。
7. **无 `ScrollRestoration`**：react-router-dom v7 提供 `<ScrollRestoration />`，当前未使用，配合 `AnimatePresence` 的页面切换可能有滚动位置遗留问题。
8. **路径来源不统一**：`router/index.tsx` 里 `pageRoutes` 用硬编码字符串字面量（`'/'`、`'/services'`、`'/academic'` 等），未复用 `ROUTES` 常量，这正是问题 1 未被及时发现的根因（路径散落两处、容易漂移）。
9. **`AuthGuard` 是 Phase 2 预留桩（非 bug）**：`AuthProvider` 被注释未启用，`AuthGuard.tsx` 已实现但当前无路由使用，符合仓库里 Phase 2 stub 的既有约定，不需要现在接入，只需保证未来接入无需改动机制本身。
10. **无法按页面控制 Navbar/Footer 显隐**：`RootLayout.tsx` 写死 `<Navbar /><Outlet /><Footer />`，所有页面共用同一个壳，没有开关。

## 2. 关键决策

| 决策点 | 结论 |
| --- | --- |
| `ROUTES.services` bug 修复方式 | 采用 `/bioinfo-analysis` 作为正式 URL（`services` 是历史命名，已废弃），同步修改所有引用；`src/pages/services` 文件夹名保持不变（只改 URL 和常量引用，不做页面级重命名） |
| Navbar/Footer 显隐控制 | 采用**方案一：`handle` + `useMatches()`**（React Router 官方支持的路由级自定义数据机制），不拆分多套 Layout 组件。原因：目前只是"个别页面不要 Nav/Footer"的简单开关需求，拆多 Layout 会导致 `PageTransition`/`Suspense`/`AnimatePresence` 逻辑重复；且该机制与 `meta`→`handle` 重命名天然契合，可合并成同一套基础设施。未来若出现完全不同的页面壳（如后台管理台），再考虑多 Layout 方案 |
| 预留接口范围 | 仅路由架构层面（类型、注释、guards 接线方式），**不创建**任何新页面/组件（不做 `/login`、`/account`、`/orders` 占位页） |
| 认证拦截方式 | 保持显式 `<AuthGuard>` 包裹模式，不引入基于 `useMatches` 的隐式通用拦截器，避免过度设计 |
| 本次优化范围 | 全部实施（bug 修复 + 预留接口 + 全部最佳实践优化项） |

## 3. 执行阶段

### Phase 0 — 关键 Bug 修复
优先级最高，需在其余重构前完成，避免带着错误引用做后续修改。以下 5 项互相独立，可并行：

- [ ] `src/components/layout/Navbar/index.tsx`：`ROUTES.services` → `ROUTES.bioinformatics`
- [ ] `src/components/layout/Footer/index.tsx`：同上
- [ ] `src/pages/home/components/FeaturesSection.tsx`：同上
- [ ] `src/pages/home/components/HeroSection.tsx`：同上
- [ ] `docs/tech/web-app.md` 第 314 行示例注释同步更新为 `ROUTES.bioinformatics`

### Phase 1 — 路由一致性重构
依赖 Phase 0 完成；1-3 与 4-5 之间有依赖顺序（见备注）。

- [ ] `src/router/index.tsx`：`pageRoutes` 全部改用 `ROUTES` 常量而非字面量路径（`ROUTES.home`、`ROUTES.bioinformatics`、`ROUTES.academic`、`ROUTES.pricing`、`ROUTES.contact`），消除路径散落两处的根因
- [ ] `src/router/types.ts`：`RouteMeta` → `RouteHandle`，`AppRouteObject.meta` → `AppRouteObject.handle`。字段扩展为：
  ```ts
  interface RouteHandle {
    title?: string
    requireAuth?: boolean
    hideNavbar?: boolean
    hideFooter?: boolean
  }
  ```
  对齐 React Router 官方 `handle` 扩展点，使其能被 `useMatches()` 真正读取
- [ ] 全仓搜索 `.meta` 在路由相关代码中的使用（目前只有 `types.ts` 定义，无消费方），确认改名不影响其他逻辑
- [ ] 新建 `src/router/useRouteHandle.ts`：封装 `useMatches()`，将匹配链上从根到叶所有路由的 `handle` 按顺序合并（叶子路由字段覆盖祖先），返回合并后的单一 `RouteHandle` 对象。嵌套路由（如 `visualizationRoutes`/`multiomicsRoutes` 的 parent+children）中，子路由可以只覆盖自己关心的字段（比如只设 `hideFooter`），其余字段仍从祖先路由继承 *（依赖上一步的类型改动）*
- [ ] `src/components/layout/RootLayout.tsx`：引入 `useRouteHandle()`，取出 `hideNavbar`/`hideFooter`（默认 `false`，保证现有页面行为不变），把硬编码的 `<Navbar />`、`<Footer />` 改为条件渲染 *（依赖上一步）*

### Phase 2 — 最佳实践加固
依赖 Phase 1 的 `handle` 类型与 `useRouteHandle`。

- [ ] **404 页面**：新建 `src/pages/not-found/index.tsx`（简洁 404 UI，复用现有页面结构风格），`router/index.tsx` 中 `{ path: '*', element: <Navigate to="/" replace /> }` 改为 `{ path: '*', lazy: lazyPage(() => import('@/pages/not-found')) }`
- [ ] **路由错误边界**：新建 `src/router/RouteErrorBoundary.tsx`，内部用 `useRouteError()` 捕获渲染异常/lazy 失败，展示友好兜底 UI + "重新加载"按钮；在 `router/index.tsx` 根路由对象（`element: <RootLayout />` 所在项）上添加 `errorElement: <RouteErrorBoundary />`
- [ ] **lazy chunk 失败重试**：增强 `src/router/utils.ts` 的 `lazyPage()`，捕获动态 `import()` 失败（典型部署后 chunk hash 过期场景），用 `sessionStorage` 做单次重试标记后 `window.location.reload()`，避免死循环；重试仍失败则继续抛出交给 `RouteErrorBoundary` 兜底
- [ ] **路由级 `document.title`**：
  - 为每个路由（`pageRoutes`、`visualizationRoutes`、`multiomicsRoutes` 及其 children、404 路由）补充 `handle: { title: <i18n key> }`，优先复用已存在的 `nav.*` / 页面自身 i18n key，缺失的（如 404 页）在对应命名空间新增最小必要的 key
  - 新建 `src/hooks/useRouteTitle.ts`：复用 `src/router/useRouteHandle.ts` 取得合并后的 `handle.title`，用 i18n 全局实例 `t()` 翻译并拼接站点名后写入 `document.title`；语言切换时应同步更新（依赖 `useI18n().currentLanguage` 触发重算）
  - 在 `src/components/layout/RootLayout.tsx` 中调用一次 `useRouteTitle()`
- [ ] **ScrollRestoration**：在 `RootLayout.tsx` 中引入 `<ScrollRestoration />`（来自 `react-router-dom`），关注与 `AnimatePresence` 退场动画的时序是否有滚动跳动，必要时用 `getKey` 对齐 `location.pathname`

### Phase 3 — 未来接口预留（仅架构，不建页面）
可与 Phase 2 并行。

- [ ] 保留 `AuthGuard.tsx` 现状（手动包裹用法：`element: <AuthGuard><Page /></AuthGuard>`），在其文件头注释里补一句说明：未来受保护路由应同时设置 `handle: { requireAuth: true }` 用于 UI 层展示"需登录"提示/面包屑等场景，认证拦截仍由 `AuthGuard` 显式包裹完成
- [ ] 不新增任何 `/login`、`/account`、`/orders` 路由或页面文件——待该功能真正启动时，只需：启用 `AuthProvider`（取消 `providers/index.tsx` 注释）→ 新增页面 → 路由项包 `<AuthGuard>` 并加 `handle.requireAuth`，无需改动路由框架本身
- [ ] Navbar/Footer 显隐机制本身在 Phase 1 已经建好（`handle.hideNavbar`/`hideFooter` + `useRouteHandle` + `RootLayout` 条件渲染），但**当前不给任何现有路由设置这两个字段**（现有页面保持"两者都显示"的默认行为）。未来某页面需要隐藏 Nav/Footer 时，只需在其路由对象上加一行 `handle: { hideNavbar: true }` 或 `{ hideFooter: true }`，无需再改机制

## 4. 涉及文件清单

| 文件 | 变更说明 |
| --- | --- |
| `src/router/routes.ts` | 保持不变（`bioinformatics: '/bioinfo-analysis'` 已正确，无需改值） |
| `src/router/index.tsx` | `pageRoutes` 改用 `ROUTES` 常量；404 路由改真实页面；根路由加 `errorElement` |
| `src/router/types.ts` | `RouteMeta`→`RouteHandle`，`meta`→`handle`，新增 `hideNavbar`/`hideFooter` |
| `src/router/utils.ts` | `lazyPage()` 加 chunk 失败重试 |
| `src/router/useRouteHandle.ts`（新建） | 合并匹配链上的 `handle`，供 `RootLayout` 和 `useRouteTitle` 共用 |
| `src/router/RouteErrorBoundary.tsx`（新建） | 路由级错误兜底 UI |
| `src/pages/not-found/index.tsx`（新建） | 404 页面 |
| `src/hooks/useRouteTitle.ts`（新建） | 路由级 `document.title` 管理 |
| `src/components/layout/RootLayout.tsx` | 消费 `useRouteHandle()` 控制 Navbar/Footer 条件渲染；挂载 `useRouteTitle()`；加 `<ScrollRestoration />` |
| `src/components/layout/Navbar/index.tsx`、`Footer/index.tsx` | 修 `ROUTES.services` bug |
| `src/pages/home/components/FeaturesSection.tsx`、`HeroSection.tsx` | 修 `ROUTES.services` bug |
| `src/pages/visualization/routes.tsx`、`src/pages/multiomics/routes.tsx` | 补充 `handle.title`（未来需要隐藏 nav/footer 的页面在此加 `hideNavbar`/`hideFooter`） |
| `docs/tech/web-app.md` | 更新示例引用 |
| `src/router/guards/AuthGuard.tsx` | 补充注释说明未来接线方式（不改逻辑） |

## 5. 验收清单

- [ ] `npm run build`（内含 `tsc --noEmit`）：确认 `ROUTES.services` 错误消失，且新增 `handle`/新文件无类型错误
- [ ] 手动跑通所有导航入口（Navbar、Footer、Hero、FeaturesSection、多组学/可视化详情页返回按钮），确认跳转到 `/bioinfo-analysis` 而非 404
- [ ] 手动访问一个不存在路径（如 `/foo`），确认展示新 404 页面而非跳回首页
- [ ] 手动切换页面观察浏览器标签页标题是否随路由变化，并切换中/英文验证标题翻译同步更新
- [ ] 临时在某个懒加载页面组件里 `throw new Error('test')`，确认 `RouteErrorBoundary` 兜底 UI 正常展示而非白屏崩溃
- [ ] 检查滚动行为：从长页面底部跳转到新路由后滚动位置是否重置到顶部
- [ ] 临时给某一个路由（如 `chart-tool`）加 `handle: { hideFooter: true }`，验证该页面 Footer 消失、其余页面不受影响；再加 `hideNavbar: true` 验证 Navbar 也能独立隐藏；改完记得移除临时测试代码（除非确实要保留）
