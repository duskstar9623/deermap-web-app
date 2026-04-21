# bio-web 框架初始化指南

## 📋 项目初始化清单

本文档列出了 bio-web 项目框架初始化的所有完成情况。

### ✅ 完成的任务

#### 1. 项目基础结构 ✓

- [x] 创建 Next.js 15 App Router 项目结构
- [x] 配置 TypeScript（严格模式）
- [x] 配置 Tailwind CSS
- [x] 配置 ESLint

#### 2. 目录结构 ✓

创建了完整的目录树，包括：

**BFF Route Handlers:**
- [x] `src/app/api/auth/` - 认证相关
- [x] `src/app/api/charts/basic/` - 基础制图
- [x] `src/app/api/charts/guest-check/` - 游客次数检查
- [x] `src/app/api/orders/` - 订单管理

**前端页面:**
- [x] `src/app/(frontend)/` - 前端路由分组
- [x] `src/app/(frontend)/charts/basic/` - 基础制图页
- [x] `src/app/(frontend)/charts/custom/` - 个性化制图页
- [x] `src/app/(frontend)/news/` - 资讯列表
- [x] `src/app/(frontend)/paper/` - 论文服务页
- [x] `src/app/(frontend)/team/` - 团队介绍页
- [x] `src/app/(frontend)/user/` - 用户中心
  - [x] profile - 个人资料
  - [x] orders - 订单列表
  - [x] membership - 会员管理

**支持目录:**
- [x] `src/components/ui/` - UI 组件库
- [x] `src/components/charts/` - 图表组件
- [x] `src/components/promotions/` - 促销组件
- [x] `src/payload/collections/` - CMS Collections
- [x] `src/payload/globals/` - CMS 全局配置
- [x] `src/lib/` - 工具函数库
- [x] `src/types/` - TypeScript 类型定义
- [x] `public/` - 静态资源目录

#### 3. 核心配置文件 ✓

- [x] `package.json` - 依赖声明
- [x] `tsconfig.json` - TypeScript 配置
- [x] `next.config.js` - Next.js 配置（含 Payload 集成）
- [x] `tailwind.config.ts` - Tailwind CSS 配置
- [x] `postcss.config.js` - PostCSS 配置
- [x] `.eslintrc.json` - ESLint 配置
- [x] `.prettierrc.js` - Prettier 代码格式化配置

#### 4. 环境配置 ✓

- [x] `.env.example` - 环境变量模板
- [x] `.gitignore` - Git 忽略文件
- [x] `.vscode/extensions.json` - VS Code 推荐插件
- [x] `.vscode/settings.json` - VS Code 工作区设置
- [x] `docker-compose.dev.yml` - 本地开发数据库配置

#### 5. Payload CMS 配置 ✓

**Collections:**
- [x] `BannerCollection.ts` - 首页 Banner
- [x] `TeamCollection.ts` - 团队成员
- [x] `NewsCollection.ts` - 行业讯息
- [x] `MediaCollection.ts` - 媒体库

**Globals:**
- [x] `SiteGlobal.ts` - 全局站点设置

**主配置:**
- [x] `payload.config.ts` - Payload CMS 主配置文件

#### 6. 页面框架 ✓

- [x] `src/app/layout.tsx` - 根布局
- [x] `src/app/globals.css` - 全局样式
- [x] `src/app/page.tsx` - 首页
- [x] `src/app/(frontend)/team/page.tsx` - 团队页
- [x] `src/app/(frontend)/charts/basic/page.tsx` - 基础制图页
- [x] `src/app/(frontend)/charts/custom/page.tsx` - 个性化制图页
- [x] `src/app/(frontend)/news/page.tsx` - 资讯列表页
- [x] `src/app/(frontend)/paper/page.tsx` - 论文服务页
- [x] `src/app/(frontend)/user/profile/page.tsx` - 用户资料页

#### 7. BFF Layer (Route Handlers) ✓

- [x] `src/app/api/auth/route.ts` - 认证接口
- [x] `src/app/api/charts/basic/route.ts` - 制图生成接口
- [x] `src/app/api/charts/guest-check/route.ts` - 游客限额检查
- [x] `src/app/api/orders/route.ts` - 订单管理接口

#### 8. UI 组件库 ✓

- [x] `src/components/ui/Button.tsx` - 按钮组件
- [x] `src/components/ui/Modal.tsx` - 对话框组件
- [x] `src/components/ui/Card.tsx` - 卡片组件
- [x] `src/components/ui/Loader.tsx` - 加载动画
- [x] `src/components/Navigation.tsx` - 导航条组件

#### 9. 工具函数库 ✓

- [x] `src/lib/api-client.ts` - NestJS API 客户端
- [x] `src/lib/utils.ts` - 通用工具函数
- [x] `src/lib/payload.ts` - Payload CMS 本地 API 工具

#### 10. TypeScript 类型定义 ✓

- [x] `src/types/index.ts` - 完整的类型定义
  - [x] API 响应类型
  - [x] 用户类型
  - [x] 图表类型
  - [x] 订单类型
  - [x] Payload CMS 类型

#### 11. 文档 ✓

- [x] `README.md` - 项目主文档
- [x] `INIT_GUIDE.md` - 本初始化指南

---

## 🚀 下一步操作

### 立即可做的事

1. **在项目根目录复制配置文件**
```bash
cd bio-web
cp .env.example .env.local
```

2. **启动本地数据库**
```bash
docker compose -f docker-compose.dev.yml up -d
```

3. **安装依赖**
```bash
pnpm install
```

4. **启动开发服务器**
```bash
pnpm dev
```

访问 http://localhost:3000 查看首页。

---

## 📝 需要开发的功能

### 高优先级（核心功能）

- [ ] **Payload CMS 数据库初始化**
  - [ ] 创建首个用户账户
  - [ ] 添加示例 Banner
  - [ ] 添加团队成员数据
  - [ ] 发布示例资讯

- [ ] **用户认证系统**
  - [ ] 实现 JWT Token 生成和验证
  - [ ] 实现用户登录/注册逻辑
  - [ ] 集成微信 OAuth
  - [ ] Cookie 和 Session 管理

- [ ] **游客制图限额系统**
  - [ ] 集成 FingerprintJS 客户端
  - [ ] Redis 计数逻辑
  - [ ] 每日限额检查

- [ ] **图表生成功能**
  - [ ] 实现各类图表的前端渲染（ECharts, Plotly, D3, Recharts）
  - [ ] 数据验证和转换
  - [ ] 与 NestJS API 对接

- [ ] **订单和支付系统**
  - [ ] 订单创建流程
  - [ ] 微信支付集成
  - [ ] 支付宝支付集成
  - [ ] 支付状态回调处理

- [ ] **会员系统**
  - [ ] 会员权益检查
  - [ ] 自动过期时间处理
  - [ ] 会员优惠展示

### 中优先级（增强功能）

- [ ] **文件上传和 OSS 集成**
  - [ ] 前端文件上传组件
  - [ ] 与阿里云 OSS / 腾讯云 COS 对接
  - [ ] 文件大小限制和格式验证

- [ ] **响应式设计优化**
  - [ ] 移动端菜单
  - [ ] 平板设备适配
  - [ ] 触摸交互优化

- [ ] **国际化实现**
  - [ ] next-intl 集成
  - [ ] 多语言 UI 翻译
  - [ ] 语言切换器

- [ ] **SEO 和元数据**
  - [ ] Open Graph 标签
  - [ ] Twitter Card
  - [ ] Sitemap 生成

### 低优先级（可选功能）

- [ ] **分析和监控**
  - [ ] Google Analytics 集成
  - [ ] 错误追踪
  - [ ] 性能监控

- [ ] **国际化支持**
  - [ ] 中文、英文、日文等语言支持
  - [ ] RTL 语言支持

- [ ] **PWA 功能**
  - [ ] Service Worker
  - [ ] 离线支持

---

## 📦 依赖注意事项

### 推荐安装

当启动开发服务器后，Payload CMS 可能会提示需要额外的依赖。按照提示安装：

```bash
pnpm add @payloadcms/bundler-webpack
```

### 可选依赖

某些图表库可能需要额外的系统依赖（如 Canvas 支持）。如遇到问题，参考官方文档。

---

## 🔧 常见问题排查

### Q: PostgreSQL 连接失败
**A:** 检查 `DATABASE_URL` 是否正确，确保 Docker Compose 已启动：
```bash
docker compose -f docker-compose.dev.yml ps
```

### Q: 端口 3000 已占用
**A:** 修改 `.env.local` 中的 `NEXT_PUBLIC_APP_URL`，或者停止占用该端口的进程。

### Q: Payload CMS 后台无法访问
**A:** 确保 Next.js 开发服务器已启动，并检查 `/admin` 路由是否被正确配置。

### Q: 构建失败（TypeScript 错误）
**A:** 清除缓存重新构建：
```bash
rm -rf .next
pnpm build
```

---

## 📊 项目统计

```
总文件数: ~25 个核心文件
代码行数: ~2000+ 行
TypeScript 类型: 15+ 个主要类型
React 组件: 5+ 个基础 UI 组件
Payload CMS Collections: 4 个
页面路由: 9+ 个
API 端点: 4 个主要 BFF 路由
```

---

## 🎯 架构遵循原则

1. ✅ **关注点分离** - 页面、BFF、后端职责明确
2. ✅ **类型安全** - 全程 TypeScript，减少运行时错误
3. ✅ **性能优先** - Server Components 优先，图表库动态导入
4. ✅ **可扩展性** - 模块化结构，易于添加新功能
5. ✅ **开发者体验** - 详细文档、推荐配置、开发工具

---

## 📚 相关文档

- 📖 [主 README](./README.md) - 项目使用指南
- 🏗️ [架构文档](../refer/bio-web-architecture.md) - 详细技术架构
- 🎯 [业务概览](../refer/business-overview.md) - 企业和产品信息
- 🚀 [部署指南](../refer/06-deployment.md) - 生产部署说明

---

**初始化完成时间**: 2026-04-20
**框架版本**: 1.0.0
**维护人**: Dev Team
