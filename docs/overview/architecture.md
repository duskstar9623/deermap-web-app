# 鹿图科技 — 系统架构决策文档
  
> **品牌**：鹿图科技 ｜ **企业全名**：鹿图（成都）生物科技有限公司 ｜ **项目代号**：deermap  
> 定位：面向生物科研用户的一站式服务平台，分阶段演进，当前为前端展示阶段
> 最后更新：2026-05-29

---

## 阶段规划总览

| 阶段 | 定位 | 技术形态 |
|---|---|---|
| **Phase 1（当前）** | 品牌展示 + 制图工具 + 业务引流 | Vite + React SPA，纯前端，无后端 |
| **Phase 2** | 接入用户系统 + 订单/支付 | 继续 React + TypeScript（Vite）+ 独立后端服务 |
| **Phase 3** | 完整平台化运营 | 全功能：CMS、会员、促销、通知、售后等 |

> 当前处于 **Phase 1**，以下文档同时记录当前实现和后续阶段的架构规划。

---

## 技术选型

### Phase 1（当前）

| 层级 | 技术 |
|---|---|
| 前端框架 | React 19 + TypeScript（Vite 7 构建） |
| 路由 | React Router v7（createBrowserRouter） |
| 状态管理 | Zustand 5（模块级 store） |
| 样式 | Tailwind CSS 3 + tailwindcss-animate |
| 动画 | Framer Motion |
| 图表 | Recharts |
| HTTP 客户端 | Axios（统一封装 + 拦截器） |
| 国际化 | i18next + react-i18next（中/英双语） |
| 图标 | Lucide React + vite-plugin-svgr（自定义 SVG） |
| 部署 | 静态托管（Nginx / 云 OSS + CDN） |
| **仓库名** | `deermap-web-app` |

### Phase 2–3（规划中）

| 层级 | 技术 |
|---|---|
| 前端框架 | React 19 + TypeScript（Vite，持续演进） |
| 后端框架 | NestJS 10+ (TypeScript) |
| CMS | Payload CMS v3（独立部署或与后端同网络） |
| ORM | Prisma |
| 主数据库 | PostgreSQL 16 |
| 缓存 / 队列 | Redis 7 + BullMQ |
| 文件存储 | 阿里云 OSS |
| 支付 | 微信支付 + 支付宝（个体工商户直连） |
| 部署 | Docker + 阿里云 ECS 自托管 |
| **后端仓库名** | `deermap-core-service` |

---

## 1. 当前前端架构（Phase 1）

### 1.1 项目结构

```
deermap-web-app/
├── src/
│   ├── components/           ← 共享组件（Layout、Card、Image、WorkflowSection）
│   │   └── layout/           ← 布局组件（Navbar、Footer、PageTransition、RootLayout）
│   ├── providers/            ← 全局 Providers（Auth、I18n、Theme）
│   ├── router/               ← 路由系统
│   │   ├── index.tsx         ← createBrowserRouter 路由定义
│   │   ├── routes.ts         ← 路由路径常量 ROUTES
│   │   ├── types.ts          ← AppRouteObject 类型扩展
│   │   ├── utils.ts          ← lazyPage 懒加载工具
│   │   └── guards/           ← 路由守卫（AuthGuard）
│   ├── pages/                ← 按业务模块划分的页面组件
│   │   ├── home/             ← 首页
│   │   ├── services/         ← 生信分析服务页
│   │   ├── visualization/    ← 可视化（图表画廊 + 在线制图工具）
│   │   ├── multiomics/       ← 多组学（总览 + 各组学详情页）
│   │   ├── academic/         ← 学术服务页
│   │   ├── pricing/          ← 定价方案页
│   │   └── contact/          ← 联系我们页
│   ├── services/             ← HTTP 请求层（axios 封装 + API 模块）
│   ├── configs/              ← 配置文件（requests.json）
│   ├── constants/            ← 路由常量、资源路径常量、主题配置
│   ├── hooks/                ← 自定义 Hooks（useAuth、useI18n、useTheme）
│   ├── i18n/                 ← 国际化资源（zh-CN / en-US）
│   ├── assets/               ← 构建管道资源（icons、svg、fonts）
│   ├── types/                ← TypeScript 类型定义
│   └── utils/                ← 工具函数
├── public/                   ← 静态资源（图表缩略图、工作流程图、大图）
├── docs/                     ← 项目文档
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### 1.2 页面路由

| 路由 | 页面 | 对应业务模块 |
|---|---|---|
| `/` | 首页 | 信息展示 |
| `/services` | 生信分析服务 | 生信分析 |
| `/visualization` | 图表类型展示画廊 | 可视化 |
| `/visualization/chart-tool` | 在线制图工具 | 可视化（基础制图） |
| `/multiomics` | 多组学总览 | 多组学 |
| `/multiomics/genomics` | 基因组学详情 | 多组学 |
| `/multiomics/transcriptomics` | 转录组学详情 | 多组学 |
| `/multiomics/proteomics` | 蛋白质组学详情 | 多组学 |
| `/multiomics/metabolomics` | 代谢组学详情 | 多组学 |
| `/academic` | 学术服务 | 学术服务 |
| `/pricing` | 定价方案 | 定价展示 |
| `/contact` | 联系我们 | 联系我们 |

路由路径常量统一定义在 `src/router/routes.ts` 的 `ROUTES` 对象中，全应用通过引用该常量导航。

### 1.3 关键设计决策

**路由架构**：使用 `createBrowserRouter` + 嵌套路由。可视化和多组学模块各自定义子路由文件（`pages/visualization/routes.tsx`、`pages/multiomics/routes.tsx`），由根路由聚合。路由类型通过 `AppRouteObject` 扩展支持 `meta`（title、requiresAuth）。

**代码分割**：所有页面均使用 `lazyPage()` 工具函数实现 `React.lazy()` 懒加载，配合 `Suspense` fallback 优化首屏性能。

**状态管理**：使用 Zustand 管理模块级状态（如可视化模块的 `useVisualizationStore`），轻量且无 boilerplate。全局状态通过 Context Provider 层管理（Auth、Theme、I18n）。

**国际化**：已内置 i18next 双语支持（zh-CN / en-US），所有页面文案通过 JSON 资源文件管理，为后续多语言扩展打好基础。

**响应式设计**：采用 Tailwind CSS 断点系统（`sm` / `md` / `lg` / `xl`）做 Mobile-First 响应式适配。

**页面动画**：使用 Framer Motion `AnimatePresence` + `PageTransition` 组件实现页面切换动画和组件入场动效。

**组件复用**：多组学详情页（4 个组学方向）共用 `OmicsDetailPage` 组件，通过路由路径区分数据来源。

**构建优化**：Vite `manualChunks` 配置将 react-vendor、i18n、recharts、framer-motion 拆分为独立 chunk，优化缓存利用率。

### 1.4 图表制图工具

当前已实现的在线制图工具（`/visualization/chart-tool`）功能：
- 支持 10+ 图表类型（折线图、柱状图、散点图、PCA 图、火山图、饼图、面积图、雷达图等）
- 数据输入方式：CSV/TSV/Excel 文件上传、粘贴数据
- 参数调整面板：配色方案、字号、图表尺寸（含预设和自定义）
- 基于 Recharts 的实时预览
- 状态管理：Zustand store（`useVisualizationStore`）管理选中图表和参数配置
- 导出功能（规划中）

> 当前阶段图表完全在浏览器端渲染，无需后端服务。功能永久免费。

---

## 2. 后续阶段架构规划（Phase 2–3）

### 2.1 整体分层架构

```
Browser / WeChat
     │
     ▼
  Nginx（反向代理 + SSL 终止）
     │
  ├──► React Web App (port 3000)  ← Vite 构建产物 + 前端网关层（可选）
     │         │ 内部 HTTP
     │         ▼
     └──► NestJS API (port 3001，不对外暴露，仅 /webhook/* 除外)
               │
     ┌─────────┼───────────┐
     ▼         ▼           ▼
PostgreSQL   Redis       OSS (阿里云)
```

### 2.2 仓库结构 — 多仓库（Multi-repo）

| 仓库 | 内容 |
|---|---|
| `deermap-web-app` | React + TypeScript + Vite 前端应用（页面、路由、可视化工具） |
| `deermap-core-service` | NestJS 后端（REST API、支付、队列、媒体等） |

**关键约定：**
- 前后端接口类型通过 API 文档（OpenAPI / Swagger）保持同步
- 各仓库独立 CI/CD Pipeline
- npm 镜像源配置为 `registry.npmmirror.com`

### 2.3 前端持续演进方案（React + TypeScript + Vite）

持续演进时遵循：
- 维持 `src/pages/` + `src/router/` 的模块化组织，不迁移为文件系统路由
- 现有 i18n 资源、Tailwind、Framer Motion、Zustand 按当前架构持续复用
- 对 SEO 需求通过预渲染/静态化方案增强，而非更换前端框架
- `src/services/` 保持统一 HTTP 封装，对接后端 API 与支付能力

### 2.4 页面路由（Phase 2 规划）

在当前路由基础上新增：

| 新增路由 | 内容 |
|---|---|
| `/user/login` | 登录 / 注册页 |
| `/user/profile` | 个人信息管理 |
| `/user/orders` | 我的订单 |
| `/user/membership` | 我的会员 |
| `/order/[id]` | 订单支付 & 详情页 |
| `/admin` | Payload CMS 管理后台（限内部访问） |

### 2.5 CMS — Payload CMS v3

- 可独立部署，并通过 API 与前端/后端服务集成
- 数据存入同一 PostgreSQL 实例
- 管理内容：首页 Banner、行业讯息文章、服务项目配置、促销活动
- 富文本使用 Lexical 编辑器

### 2.6 BFF 层

- 浏览器流量可通过 Nginx 网关或独立 API Gateway 聚合 NestJS 数据
- 处理 Session Token 转发，屏蔽 NestJS 端口对外暴露
- 仅支付 Webhook 直接由 NestJS 处理（稳定性要求）

---

## 3. 后端 `deermap-core-service`（Phase 2–3）

### 模块结构

```
src/
├── app.module.ts
├── config/                  ← 环境变量校验
├── common/                  ← Guards、Interceptors、Filters、Decorators、Pipes
├── database/                ← Prisma 全局模块
├── cache/                   ← Redis 缓存
├── auth/                    ← JWT 鉴权、手机号登录、微信 OAuth
├── users/                   ← 用户账户管理
├── membership/              ← 会员档位配置、权益校验
├── orders/                  ← 统一订单 CRUD、状态流转
├── payments/                ← 微信支付 + 支付宝（Webhook 处理）
├── charts/                  ← 基础制图权益校验、个性化制图订单管理
├── promotions/              ← 促销活动模块（全局赋能）
├── notifications/           ← 短信、邮件、微信模板消息
├── delivery/                ← 作品交付（签名 URL 生成）
└── media/                   ← 文件上传 / 存储
```

### 关键设计要点

- API 版本化前缀 `/api/v1`，便于后期多端接入
- 支付 Webhook 端点排除 JWT 鉴权
- 所有付费业务（个性化制图、生信分析、学术服务、行业咨询、会员）共用统一订单模块
- 促销模块作为全局赋能，可影响所有付费业务

---

## 4. 支付集成（Phase 2）

> 以**个体工商户**身份直接接入微信支付和支付宝，无需第三方聚合支付。

### 核心流程

1. 用户下单 → BFF 转发 → NestJS 创建订单
2. 后端调用支付渠道 API 生成支付凭证
3. 前端唤起支付（微信 JSAPI / H5；支付宝网页支付）
4. 支付成功 → 异步回调 Webhook → 幂等更新订单状态 → 触发通知

### 注意事项

- Webhook 处理必须幂等
- `notify_url` 须已 ICP 备案域名 + HTTPS 证书
- 微信内浏览器用 JSAPI 支付，外部浏览器用 H5 支付

### 前期过渡

在支付系统接入之前，所有收费业务通过**线下支付**完成（用户支付宝/微信个人转账 → 运营人员手动确认）。

---

## 5. 数据层（Phase 2–3）

### 部署方式：ECS 自建

> 初期复用现有 ECS 自建 PostgreSQL + Redis，节约成本。未来可平滑迁移至云托管服务。

| 组件 | 用途 |
|---|---|
| PostgreSQL 16 | 主 DB：用户、订单、支付记录、CMS 内容 |
| Redis 7 | Session 缓存、任务队列、支付幂等锁 |
| 阿里云 OSS | 文件存储（图表文件、上传数据、媒体资源） |

### 可靠性保障

- Docker Named Volume 持久化数据
- 每日自动备份 PostgreSQL 至 OSS
- Redis 开启 AOF 持久化
- 文件资源通过 CDN 加速

### 未来迁移路径

订单量增大后可迁移至阿里云 PolarDB + ApsaraDB for Redis，应用层使用标准环境变量连接，切换时无需改代码。

---

## 6. 部署架构

### Phase 1（当前）

Vite 构建产物为纯静态文件，部署方式：
- 方案 A：阿里云 OSS 静态网站托管 + CDN 加速
- 方案 B：ECS Nginx 直接托管静态文件

### Phase 2–3

```yaml
# docker-compose.yml
services:
  nginx:     # SSL 终止 + 反向代理
  web:       # React Web App 静态资源服务 (port 3000)
  api:       # NestJS (port 3001，仅内网可访问)
  postgres:  # PostgreSQL
  redis:     # Redis
```

**上线前检查清单：**
- [x] ICP 备案完成
- [ ] 域名 A 记录指向服务器
- [ ] SSL 证书配置
- [ ] 微信支付商户号注册
- [ ] 支付宝开放平台应用创建
- [ ] 服务器 NTP 时间同步

---

## 7. 关键决策记录

### 长期前端框架决策（React + TypeScript + Vite）

当前与后续阶段统一采用 **React + TypeScript + Vite**。在不更换框架的前提下，通过工程化优化（预渲染、缓存、构建分包、网关层）满足 SEO、性能与业务扩展需求。

### React Router 作为长期路由方案

持续使用 **React Router**：路由配置集中、模块边界清晰、与现有懒加载和页面组织方式一致。

### Recharts vs ECharts vs Plotly

Phase 1 选 **Recharts**：轻量、React 原生、满足当前图表类型需求。Phase 2 可按需引入 ECharts（标准统计图表）、Plotly（专业科学可视化）、D3（完全自定义生物图示）。

### Payload CMS v3 vs Strapi v5（Phase 2 选型）

选 **Payload CMS v3**：可独立部署并通过 API 集成，无外部 SaaS 依赖，共用 PostgreSQL。

### Prisma vs TypeORM（Phase 2 选型）

选 **Prisma**：TypeScript 类型生成质量高，迁移管理完善，Schema 文件即文档。

---

## 8. 响应式与多端策略

**当前阶段**：同时支持桌面端和移动端浏览器，采用 Mobile-First 响应式设计。

- Tailwind CSS 断点系统统一适配
- 触摸友好的交互设计
- 图表组件移动端自适应缩放

**后期扩展预留：**

| 客户端 | 接入方式 | 前提条件 |
|---|---|---|
| 微信小程序 | 原生 / Taro | API 版本化 + JWT 鉴权（Phase 2 具备） |
| 原生 App | React Native / Flutter | 同上 |

---

## 9. 未来扩展规划

以下扩展项在架构设计中已预留空间，可按需逐步接入：

| 扩展方向 | 建议接入时机 |
|---|---|
| **国际化 SEO** | 用户量出现明显海外来源时（当前已有 i18n 基础） |
| **售后模块** | 第一笔退款纠纷出现时 |
| **微信小程序 / 原生 App** | 移动端流量占比超 40% 时 |
| **企业账号 / 团队协作** | 有明显 B 端团队采购需求时 |
| **搜索增强** | 内容超 200 篇或用户反映搜索体验差时 |
| **运营数据看板** | 月活用户超 500 时 |
| **API 开放平台** | 有机构用户提出程序化批量制图需求时 |

---

## 10. 测试策略

### Phase 1（当前）

| 层级 | 工具 | 重点 |
|---|---|---|
| 组件测试 | React Testing Library | 页面组件渲染、图表工具交互 |
| E2E 测试 | Playwright | 页面导航、制图工具完整流程 |

### Phase 2–3

| 层级 | 工具 | 重点 |
|---|---|---|
| 单元测试 | Jest + `@nestjs/testing` | 支付服务逻辑、订单状态流转 |
| 集成测试 | Supertest | API 端点验证 |
| E2E 测试 | Playwright | 完整下单 → 支付 → 回调 → 状态更新链路 |
| 支付联调 | 支付宝沙箱 / 微信真实小额 | 回调验证 |
