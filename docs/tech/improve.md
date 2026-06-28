# 架构改进计划

> 基于 Phase 1 现状评审，面向中大型官网系统的可扩展性改进建议。  
> 按优先级排序，P0 为最高优先级。

---

## P0：引入测试体系

**现状**：项目无任何测试依赖、测试目录或测试文件。

**风险**：随着页面和业务逻辑增长，缺少测试将导致重构恐惧、回归 Bug 频发，中大型系统不可接受。

**改进方案**：

1. 安装 Vitest + React Testing Library + jsdom
2. 配置 `vitest.config.ts`，复用 Vite 的 alias 和插件
3. 建立测试目录约定：
   - `src/utils/__tests__/` — 工具函数单元测试
   - `src/hooks/__tests__/` — 自定义 Hook 测试
   - `src/components/**/__tests__/` — 组件测试
   - `src/services/__tests__/` — API 层 mock 测试
4. 首批测试覆盖范围：
   - `useI18n`、`useAuth`、`useTheme` hooks
   - `http-client.ts` 拦截器逻辑
   - `error-handler.ts` 错误转换
   - `lazyPage()` 工具函数
   - `Card`、`OptimizedImage` 组件渲染
5. 在 `package.json` 添加 `"test": "vitest"` 和 `"test:coverage": "vitest --coverage"` 脚本
6. CI 中集成测试卡点（PR 合并前必须通过）

**验收标准**：核心工具/hooks 测试覆盖率 ≥ 80%，组件快照测试覆盖所有 shared 组件。

---

## P1：国际化（i18n）功能强化

**现状**：`src/i18n/index.ts` 中的语言加载机制存在三个潜在问题：
1. `loadLanguage` 仅检查默认命名空间是否加载，对其他命名空间的加载状态无感知
2. 快速切换语言时，多个 `changeLanguage` 调用会并发加载相同语言，无去重机制
3. 动态 `import()` 失败时无错误处理，会导致应用崩溃

**风险**：
- 某些语言命名空间缺失翻译导致页面显示异常
- 并发加载浪费网络带宽和渲染性能
- 动态导入失败时用户体验受损

**改进方案**：

### 1. 强化 `loadLanguage` 检查逻辑
```typescript
// 检查目标语言的所有命名空间是否已加载
function isLanguageFullyLoaded(language: Language): boolean {
  return Object.values(LANGUAGE_NAMESPACES).every(ns => 
    i18n.hasResourceBundle(language, ns)
  );
}

export async function loadLanguage(language: Language): Promise<void> {
  if (language === DEFAULT_LANGUAGE) return;
  if (isLanguageFullyLoaded(language)) return; // 确保所有命名空间都已加载
  // ... 加载逻辑
}
```

### 2. 去重并发加载
```typescript
// 记录正在进行中的加载操作
const loadingPromises = new Map<Language, Promise<void>>();

export async function loadLanguage(language: Language): Promise<void> {
  if (language === DEFAULT_LANGUAGE) return;
  if (isLanguageFullyLoaded(language)) return;
  
  // 如果该语言已在加载中，复用现有的 Promise
  if (loadingPromises.has(language)) {
    return loadingPromises.get(language)!;
  }
  
  const loadPromise = (async () => {
    const loader = languageBundles[language];
    if (!loader) return;
    const { default: resources } = await loader();
    for (const [ns, bundle] of Object.entries(resources)) {
      i18n.addResourceBundle(language, ns, bundle, false, true);
    }
  })();
  
  loadingPromises.set(language, loadPromise);
  try {
    await loadPromise;
  } finally {
    loadingPromises.delete(language);
  }
}
```

### 3. 添加错误处理
```typescript
export async function changeLanguage(languageCode: LanguageCode): Promise<void> {
  try {
    const targetLanguage = LANGUAGES[languageCode];
    await loadLanguage(targetLanguage);
    await i18n.changeLanguage(targetLanguage);
    saveLanguageCode(languageCode);
  } catch (error) {
    console.error(`Failed to change language to ${languageCode}:`, error);
    // 降级处理：回到默认语言或显示用户提示
    toast.error('语言切换失败，请稍后重试'); // 需结合 P3 Toast 方案
  }
}
```

**验收标准**：
- 快速切换语言多次，网络面板仅显示一次 `en-US.js` 加载
- 动态导入异常时有适当的错误日志和用户提示
- 所有命名空间的翻译完整加载

---

## P2：拆分胖页面组件

**现状**：各页面（如 `home/index.tsx`）将 Hero、Stats、Features 等多个大区块全部内联在单文件中，`pages/*/components/` 目录均为空（仅有 `.gitkeep`）。

**风险**：随着产品迭代，单页面文件膨胀至 500+ 行，难以维护和协作开发。

**改进方案**：

每个页面的独立区块拆为子组件：

```
src/pages/home/
├── index.tsx              ← 仅负责组合各 Section
├── components/
│   ├── HeroSection.tsx    ← 首屏视频 Hero
│   ├── StatsSection.tsx   ← 数据统计展示
│   └── FeaturesSection.tsx ← 功能卡片区
```

**拆分原则**：
- 单个组件文件不超过 150 行
- 每个 Section 独立管理自己的动画、数据、事件
- 页面 `index.tsx` 仅做布局编排（import + 排列顺序）
- Props 尽量简单，Section 内部自行调用 `useTranslation`

**验收标准**：所有页面 `index.tsx` 不超过 80 行，各 Section 组件单文件不超过 150 行。

---

## P3：构建原子组件层（Design System 基础）

**现状**：`src/components/shared/` 仅有 Card、Image、WorkflowSection 三个组件，缺少基础 UI 原子组件。页面中大量重复的按钮、表单、弹窗样式直接内联。

**风险**：UI 一致性难以保证，新页面开发效率低，样式修改需全局搜索。

**改进方案**：

建立 `src/components/ui/` 原子组件目录：

```
src/components/ui/
├── Button.tsx         ← variant: primary | secondary | ghost | outline
├── Input.tsx          ← 含 label、error message、disabled 状态
├── Select.tsx         ← 下拉选择器
├── Modal.tsx          ← 模态弹窗（Portal + 动画）
├── Toast.tsx          ← 全局消息通知
├── Badge.tsx          ← 标签/徽章
├── Skeleton.tsx       ← 加载骨架屏
├── Tabs.tsx           ← 选项卡切换
└── index.ts           ← 统一导出
```

**设计规范**：
- 所有组件支持 `className` prop 透传（方便 Tailwind 覆写）
- 颜色使用 CSS 变量 / Tailwind token，不硬编码色值
- 动画使用 Framer Motion，保持全站动效一致
- 组件 API 参考 shadcn/ui 设计，保持简洁

**验收标准**：首页和联系页的所有按钮/输入框替换为 `ui/` 组件，样式一致。

---

## P4：全局 Toast/Notification 接入错误处理

**现状**：`error-handler.ts` 的全局错误处理器仅 `console.warn/error`，用户无法感知 API 错误。

**风险**：用户操作失败（网络超时、表单提交失败等）无任何可见反馈，体验差。

**改进方案**：

1. 实现 `ToastProvider` + `useToast` hook：
   ```tsx
   // src/components/ui/Toast.tsx — Framer Motion 动画驱动
   // src/providers/ToastProvider.tsx — 管理 toast 队列
   // src/hooks/useToast.ts — 暴露 toast.success / toast.error / toast.info
   ```

2. 在 `AppProviders` 中注入 `ToastProvider`

3. 在应用初始化时调用 `setGlobalErrorHandler` 接入 Toast：
   ```typescript
   setGlobalErrorHandler((error) => {
     if (error.isAuthError) {
       toast.error('登录已过期，请重新登录')
       // 跳转登录页
     } else if (error.isNetworkError) {
       toast.error('网络异常，请检查连接')
     } else {
       toast.error(error.message)
     }
   })
   ```

**验收标准**：任何 API 调用失败后，页面右上角弹出 Toast 提示，3 秒后自动消失。

---

## P5：环境变量管理

**现状**：API `baseURL`、`timeout` 等配置硬编码在 `src/configs/requests.json` 中，无法区分开发/测试/生产环境。

**风险**：多环境部署时需手动修改配置文件，容易出错且不利于 CI/CD。

**改进方案**：

1. 创建环境变量文件：
   ```
   .env                  ← 默认值（开发环境）
   .env.production       ← 生产环境
   .env.staging          ← 预发布环境（可选）
   ```

2. 变量定义：
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_API_TIMEOUT=15000
   VITE_APP_ENV=development
   ```

3. 修改 `http-client.ts`：
   ```typescript
   const httpClient = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL,
     timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
   })
   ```

4. `requests.json` 保留 endpoints 路径定义，移除 baseURL/timeout

5. 添加 `src/vite-env.d.ts` 类型增强：
   ```typescript
   interface ImportMetaEnv {
     readonly VITE_API_BASE_URL: string
     readonly VITE_API_TIMEOUT: string
     readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
   }
   ```

**验收标准**：`npm run build` 生产包中 API 地址为线上地址，本地开发指向本地/测试服务器。

---

## P6：SEO / Pre-rendering 方案（Phase 1 持续期较长时）

**现状**：纯 SPA（CSR），搜索引擎爬虫无法抓取动态渲染内容，官网首页几乎无法被百度/Google 收录。

**风险**：如果 Phase 1 持续 6 个月以上，品牌曝光和自然流量将受严重影响。

**改进方案（二选一）**：

**方案 A：Vite Pre-render 插件（轻量）**
- 使用 `vite-plugin-prerender`（或 `vite-ssg`）在构建时生成关键页面的静态 HTML
- 适用页面：`/`、`/services`、`/academic`、`/pricing`、`/contact`
- 改动最小，不影响现有路由架构

**方案 B：保持 React + Vite 并引入静态化方案（重量）**
- 如果 Phase 2 启动时间在 3 个月内，优先补齐站点级 SEO 与预渲染，而非迁移框架
- 通过路由级预渲染与缓存策略提升收录与首屏性能

**建议**：如 Phase 2 时间不确定，优先采用方案 A 作为过渡。

**验收标准**：`curl` 首页 HTML 能看到完整的标题、描述和核心内容文本。

---

## P7：性能监控

**现状**：无 Web Vitals 采集、无错误上报、无用户行为追踪。

**改进方案**：

1. 集成 `web-vitals` 库，采集 LCP/FID/CLS/TTFB
2. 接入监控平台（可选：Sentry、阿里云 ARMS、自建上报）
3. 在 `main.tsx` 初始化时注册：
   ```typescript
   import { onCLS, onFID, onLCP } from 'web-vitals'
   onCLS(console.log)
   onFID(console.log)
   onLCP(console.log)
   ```

**验收标准**：生产环境可查看核心 Web Vitals 指标数据。

---

## 总结

| 优先级 | 改进项 | 预估工时 | 收益 |
|--------|--------|----------|------|
| P0 | 测试体系 | 2-3 天 | 重构安全网，代码质量保障 |
| P1 | i18n 功能强化 | 1 天 | 国际化稳定性、性能优化 |
| P2 | 拆分胖页面 | 1-2 天 | 可维护性、协作效率 |
| P3 | 原子组件层 | 3-5 天 | UI 一致性、开发效率 |
| P4 | Toast 错误反馈 | 1 天 | 用户体验 |
| P5 | 环境变量 | 0.5 天 | 部署流程规范化 |
| P6 | SEO Pre-render | 1-2 天 | 搜索引擎收录 |
| P7 | 性能监控 | 0.5 天 | 线上质量可观测 |

建议按优先级从上至下逐步推进，P0–P4 在进入 Phase 2 前完成。
