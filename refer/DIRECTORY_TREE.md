# bio-web 完整目录结构

## 项目总览树

```
bio-web/
│
├── 📁 src/                              # 源代码目录
│   │
│   ├── 📁 app/                          # Next.js App Router 应用程序
│   │   ├── 📁 api/                      # BFF 层 - Route Handlers
│   │   │   ├── 📁 auth/
│   │   │   │   └── route.ts             # 认证接口 (POST: 登录, GET: 检查会话)
│   │   │   ├── 📁 charts/
│   │   │   │   ├── 📁 basic/
│   │   │   │   │   └── route.ts         # 制图生成接口
│   │   │   │   └── 📁 guest-check/
│   │   │   │       └── route.ts         # 游客每日限额检查
│   │   │   └── 📁 orders/
│   │   │       └── route.ts             # 订单管理 (POST: 创建, GET: 查询)
│   │   │
│   │   ├── 📁 (frontend)/               # 前端页面路由分组
│   │   │   ├── 📁 charts/
│   │   │   │   ├── 📁 basic/
│   │   │   │   │   └── page.tsx         # 基础制图工具页面
│   │   │   │   └── 📁 custom/
│   │   │   │       └── page.tsx         # 个性化制图服务页面
│   │   │   │
│   │   │   ├── 📁 news/
│   │   │   │   ├── page.tsx             # 资讯列表页
│   │   │   │   └── 📁 [slug]/
│   │   │   │       └── page.tsx         # 资讯详情页 (待开发)
│   │   │   │
│   │   │   ├── 📁 paper/
│   │   │   │   └── page.tsx             # 论文服务页
│   │   │   │
│   │   │   ├── 📁 user/
│   │   │   │   ├── 📁 profile/
│   │   │   │   │   └── page.tsx         # 用户资料页
│   │   │   │   ├── 📁 orders/
│   │   │   │   │   └── page.tsx         # 订单列表页 (待开发)
│   │   │   │   ├── 📁 membership/
│   │   │   │   │   └── page.tsx         # 会员管理页 (待开发)
│   │   │   │   └── 📁 login/
│   │   │   │       └── page.tsx         # 登录/注册页 (待开发)
│   │   │   │
│   │   │   ├── 📁 order/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── page.tsx         # 订单详情页 (待开发)
│   │   │   │
│   │   │   ├── 📁 consulting/
│   │   │   │   └── page.tsx             # 专业咨询页 (待开发)
│   │   │   │
│   │   │   └── 📁 team/
│   │   │       └── page.tsx             # 团队介绍页
│   │   │
│   │   ├── layout.tsx                   # 根布局 (包含 <html>, <body>)
│   │   ├── page.tsx                     # 首页 (/)
│   │   ├── globals.css                  # 全局样式表
│   │   └── global-error.tsx             # 全局错误处理 (待开发)
│   │
│   ├── 📁 components/                   # React 组件库
│   │   ├── 📁 ui/                       # 基础 UI 组件
│   │   │   ├── Button.tsx               # 按钮组件
│   │   │   ├── Modal.tsx                # 对话框组件
│   │   │   ├── Card.tsx                 # 卡片组件
│   │   │   ├── Loader.tsx               # 加载动画
│   │   │   └── [其他 UI 组件]
│   │   │
│   │   ├── 📁 charts/                   # 图表组件
│   │   │   ├── HeatmapChart.tsx         # 热图 (待开发)
│   │   │   ├── VolcanoPlot.tsx          # 火山图 (待开发)
│   │   │   ├── BoxPlot.tsx              # 箱线图 (待开发)
│   │   │   └── [其他图表组件]
│   │   │
│   │   ├── 📁 promotions/               # 促销相关组件
│   │   │   ├── PriceTag.tsx             # 价格标签 (待开发)
│   │   │   ├── MembershipPrompt.tsx     # 会员提示弹窗 (待开发)
│   │   │   └── [其他促销组件]
│   │   │
│   │   ├── Navigation.tsx               # 导航条组件
│   │   └── Footer.tsx                   # 页脚组件 (待开发)
│   │
│   ├── 📁 lib/                          # 工具函数库
│   │   ├── api-client.ts                # NestJS API 客户端 (通用 API 调用)
│   │   ├── payload.ts                   # Payload CMS 本地 API 工具 (RSC 数据获取)
│   │   ├── utils.ts                     # 通用工具函数 (格式化、验证等)
│   │   ├── hooks.ts                     # React Hooks (待开发)
│   │   └── constants.ts                 # 常量定义 (待开发)
│   │
│   ├── 📁 types/                        # TypeScript 类型定义
│   │   ├── index.ts                     # 主类型文件
│   │   │   ├── ApiResponse<T>           # API 响应类型
│   │   │   ├── User                     # 用户类型
│   │   │   ├── ChartType                # 图表类型
│   │   │   ├── ChartResult              # 图表结果类型
│   │   │   ├── Order                    # 订单类型
│   │   │   ├── Banner                   # Banner 类型
│   │   │   ├── TeamMember               # 团队成员类型
│   │   │   ├── NewsArticle              # 资讯文章类型
│   │   │   └── SiteSettings             # 网站设置类型
│   │   └── [其他类型文件]
│   │
│   ├── 📁 payload/                      # Payload CMS 配置
│   │   ├── 📁 collections/              # CMS Collections 定义
│   │   │   ├── BannerCollection.ts      # 首页 Banner Collection
│   │   │   ├── TeamCollection.ts        # 团队成员 Collection
│   │   │   ├── NewsCollection.ts        # 行业讯息 Collection
│   │   │   └── MediaCollection.ts       # 媒体库 Collection
│   │   │
│   │   └── 📁 globals/                  # CMS Global 配置
│   │       └── SiteGlobal.ts            # 全局站点设置 (Logo, 联系方式等)
│   │
│   └── payload.config.ts                # Payload CMS 主配置文件
│
├── 📁 public/                           # 静态资源目录
│   ├── favicon.ico                      # 网站图标
│   ├── 📁 images/                       # 图片资源
│   ├── 📁 videos/                       # 视频资源
│   └── robots.txt                       # SEO 爬虫协议
│
├── 📄 配置文件
│   ├── package.json                     # NPM 依赖声明
│   ├── tsconfig.json                    # TypeScript 编译配置
│   ├── tsconfig.paths.json              # TypeScript 路径别名配置
│   ├── next.config.js                   # Next.js 配置 (含 Payload 集成)
│   ├── tailwind.config.ts               # Tailwind CSS 配置
│   ├── postcss.config.js                # PostCSS 配置
│   ├── .eslintrc.json                   # ESLint 代码规范配置
│   ├── .prettierrc.js                   # Prettier 代码格式化配置
│   ├── .env.example                     # 环境变量模板 (提交到 Git)
│   ├── .env.local                       # 实际环境变量 (本地开发, 不提交)
│   ├── .gitignore                       # Git 忽略文件规则
│   ├── .gitattributes                   # Git 属性配置 (待创建)
│   └── docker-compose.dev.yml           # Docker 本地开发环境配置
│
├── 📁 .vscode/                          # VSCode 工作区配置
│   ├── settings.json                    # VSCode 工作区设置
│   └── extensions.json                  # 推荐插件列表
│
└── 📚 文档文件
    ├── README.md                        # 项目主文档 (快速开始、使用指南)
    ├── INIT_GUIDE.md                    # 初始化指南 (详细清单、下一步计划)
    ├── FRAMEWORK_INIT_COMPLETE.md       # 初始化完成总结
    └── DIRECTORY_TREE.md                # 本文件 (目录结构说明)
```

---

## 详细说明

### 核心分层

```
🎨 UI Layer (前端页面)
        ↓
🔌 BFF Layer (Route Handlers)
        ↓
🖥️ Backend (NestJS API)
        ↓
💾 Database & Cache
```

### 开发工作流

1. **页面开发** → 在 `src/app/(frontend)/` 创建页面
2. **组件开发** → 在 `src/components/` 创建可复用组件
3. **工具函数** → 在 `src/lib/` 添加业务逻辑
4. **类型定义** → 在 `src/types/` 补充新类型
5. **CMS 配置** → 在 `src/payload/` 定义内容模型
6. **API 调用** → 通过 `src/lib/api-client.ts` 调用后端

### 文件命名规范

```
components/
├── ui/               → 小写 + 描述性名词 (button.tsx, modal.tsx)
├── charts/           → 驼峰式 + 组件名 (HeatmapChart.tsx)
└── promotions/       → 驼峰式 + 组件名 (PriceTag.tsx)

app/
├── (frontend)/       → 路由分组 (圆括号)
├── api/              → API 路由 (api/auth/route.ts)
└── page.tsx          → 页面文件 (小写 page.tsx)

lib/
├── api-client.ts     → 连字符分隔 (api-client.ts)
├── payload.ts        → 小写 + 模块名 (payload.ts)
└── utils.ts          → 小写 + 功能 (utils.ts)
```

---

## 快速导航

### 📄 首次使用这里

1. [README.md](./README.md) - 了解项目结构和使用方法
2. [INIT_GUIDE.md](./INIT_GUIDE.md) - 初始化步骤和开发清单

### 🏗️ 架构相关

- [src/payload/](./src/payload/) - CMS 数据模型定义
- [src/lib/api-client.ts](./src/lib/api-client.ts) - 与后端 API 通信
- [src/types/](./src/types/) - 全局类型定义

### 🎨 UI 开发

- [src/components/ui/](./src/components/ui/) - 基础 UI 组件
- [src/app/globals.css](./src/app/globals.css) - 全局样式
- [tailwind.config.ts](./tailwind.config.ts) - Tailwind 配置

### 📱 页面开发

- [src/app/(frontend)/](./src/app/(frontend)/) - 所有前端页面
- [src/app/page.tsx](./src/app/page.tsx) - 首页

### 🔌 API 集成

- [src/app/api/](./src/app/api/) - BFF 层端点
- [src/lib/api-client.ts](./src/lib/api-client.ts) - API 客户端

---

## 关键文件说明

### 配置文件

| 文件 | 用途 | 关键配置 |
|---|---|---|
| `next.config.js` | Next.js 配置 | Payload CMS 集成、Webpack 配置 |
| `tsconfig.json` | TypeScript | 严格模式、路径别名 |
| `tailwind.config.ts` | 样式系统 | 主题颜色、扩展工具类 |
| `.env.example` | 环境变量模板 | 数据库、API、第三方服务 |
| `docker-compose.dev.yml` | 本地开发环境 | PostgreSQL、Redis 容器配置 |

### 核心代码文件

| 文件 | 用途 |
|---|---|
| `src/app/page.tsx` | 首页 (Hero、服务介绍、资讯预览) |
| `src/app/layout.tsx` | 全局布局 (HTML、metadata、font) |
| `src/lib/api-client.ts` | API 通信统一入口 |
| `src/lib/payload.ts` | CMS 内容获取 (RSC) |
| `src/payload.config.ts` | Payload CMS 主配置 |
| `src/types/index.ts` | 所有 TypeScript 类型定义 |

---

## 文件大小参考

```
Total Files: ~35 files
Total Lines: ~2000+ lines of code

Distribution:
├── Pages & Components: 45%
├── Configuration: 20%
├── Utils & Types: 20%
├── Payload CMS: 10%
└── Documentation: 5%
```

---

## 下一步扩展建议

### 新增页面
```bash
# 1. 创建目录
mkdir -p src/app/(frontend)/new-page

# 2. 创建页面文件
touch src/app/(frontend)/new-page/page.tsx

# 3. 添加 Metadata 和内容
# (参考现有页面)
```

### 新增组件
```bash
# 1. 创建组件文件
touch src/components/ui/NewComponent.tsx

# 2. 在 src/components/ui/index.ts 导出
# (如果有 index.ts)

# 3. 在页面中使用
# import { NewComponent } from '@/components/ui'
```

### 新增 CMS Collection
```bash
# 1. 创建 Collection 文件
touch src/payload/collections/NewCollection.ts

# 2. 定义 CollectionConfig

# 3. 在 payload.config.ts 注册
```

---

## 文件查找快速索引

| 功能 | 位置 |
|---|---|
| 首页内容 | `src/app/page.tsx` |
| 导航菜单 | `src/components/Navigation.tsx` |
| UI 按钮 | `src/components/ui/Button.tsx` |
| API 调用 | `src/lib/api-client.ts` |
| CMS 集合 | `src/payload/collections/` |
| 环境变量 | `.env.example` |
| 构建配置 | `next.config.js` |
| 类型定义 | `src/types/index.ts` |

---

**最后更新**: 2026-04-20  
**框架版本**: 1.0.0
