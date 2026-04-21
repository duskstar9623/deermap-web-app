# 鹿图科技 — 系统架构决策文档

> 日期：2026-04-14（更新：2026-04-21）  
> **品牌**：鹿图科技 ｜ **企业全名**：鹿图（成都）生物科技有限公司 ｜ **项目代号**：deermap  
> 定位：面向生物科研用户的一站式服务平台，以中型企业架构要求设计，预留国际化、售后、多端扩展能力

---

## 技术选型总览

| 层级 | 技术 |
|---|---|
| 前端框架 | Next.js 15 (App Router, TypeScript) |
| 后端框架 | NestJS 10+ (TypeScript) |
| CMS | Payload CMS v3（内嵌于 Next.js） |
| ORM | Prisma |
| 主数据库 | PostgreSQL 16 |
| 缓存 / 队列 | Redis 7 + BullMQ |
| 文件存储 | 阿里云 OSS |
| 支付 | 微信支付（APIv3）+ 支付宝（APIv3） |
| 仓库管理 | 多仓库（Multi-repo）· GitHub |
| 部署 | Docker + 阿里云 自托管（ECS） |
| **前端项目名** | `deermap-web-app` |
| **后端项目名** | `deermap-core-service` |

---

## 整体分层架构

```
Browser / WeChat
     
     ▼
  Nginx（反向代理 + SSL 终止）
     │
     ├──► Next.js App (port 3000)    ← 前端渲染 + BFF + Payload CMS Admin
     │         │ 内部 HTTP
     │         ▼
     └──► NestJS API (port 3001，不对外暴露，仅 /webhook/* 除外)
               │
     ┌─────────┼───────────┐
     ▼         ▼           ▼
PostgreSQL   Redis       OSS (阿里云)
```

---

## 1. 仓库结构 — 多仓库（Multi-repo）

使用两个独立 GitHub 仓库，职责分离，独立 CI/CD 和部署：

| 仓库 | 内容 |
|---|---|
| `deermap-web-app` | Next.js App Router + Payload CMS v3（前端页面、BFF、CMS 管理后台） |
| `deermap-core-service` | NestJS 后端（REST API、支付、队列、媒体等） |

### deermap-web-app 目录结构

```
deermap-web-app/
├── app/                  ← Next.js App Router 页面 & Route Handlers (BFF)
├── components/           ← React 组件（含响应式 UI 组件）
├── payload/              ← Payload CMS Collections、Globals 配置
├── lib/                  ← 工具函数、NestJS API 客户端封装
├── types/                ← 前端 TypeScript 类型（及与后端约定的接口类型）
├── public/
├── package.json
└── ...
```

### deermap-core-service 目录结构

```
deermap-core-service/
├── src/
│   └── ... （见第 3 节模块结构）
├── package.json
└── ...
```

**关键约定：**
- 前后端共享接口类型（请求体、响应体结构）在各仓库中各自维护对应的 TypeScript 类型文件，并通过 API 文档（OpenAPI / Swagger）保持同步，避免引入私有 npm 注册表
- 各仓库独立配置 GitHub Actions CI/CD Pipeline，分别管理各自的 GitHub Secrets
- npm 镜像源配置为 `registry.npmmirror.com`，Docker 镜像源使用云厂商加速地址

---

## 2. 前端 `deermap-web-app` — Next.js App Router

### 页面路由

| 路由 | 内容 |
|---|---|
| `/` | 首页（Hero、服务介绍、成果展示、行业讯息模块） |
| `/team` | 团队介绍页 |
| `/charts/basic` | 基础制图工具页（自助上传数据 → 在线出图） |
| `/charts/custom` | 个性化制图页（服务说明、范例画廊、定价参考、联系 CTA） |
| `/paper` | 论文业务页（服务介绍、联系入口） |
| `/bioinformatics` | 生信业务页（服务方向介绍、定价参考、联系入口） |
| `/consulting` | 行业咨询页（付费 1v1 科研咨询，服务介绍、定价、下单 / 联系入口） |
| `/user/login` | 登录 / 注册页（手机号 + 密码 / 微信 OAuth） |
| `/user/profile` | 个人信息管理 |
| `/user/orders` | 我的订单（历史订单、状态查看、发起支付、下载成品） |
| `/user/membership` | 我的会员（档位、有效期、续费） |
| `/order/[id]` | 订单支付 & 详情页 |
| `/admin` | Payload CMS 管理后台（限内部访问） |

### CMS — Payload CMS v3

- 与 Next.js 同进程运行，无需独立容器
- 数据存入同一 PostgreSQL 实例
- 管理内容：首页 Banner、团队成员档案、研究成果列表、行业讯息文章（首页模块展示，点击跳转公众号）
- 富文本使用 Lexical 编辑器；图表配置以结构化 JSON 字段存储

### 图表渲染（客户端组件，`dynamic` + `ssr: false`）

| 场景 | 库 |
|---|---|
| 标准生物图表（热图、火山图、箱线图、生存曲线） | `echarts-for-react`（ECharts v6） |
| 专业科学可视化（等高线、三元图、3D 散点） | `react-plotly.js`（plotly.js-dist-min） |
| 自定义生物学图示（进化树、基因结构图、序列 Logo） | D3.js v7 |
| 管理后台 / 数据看板 | Recharts |

### 响应式 UI

**当前阶段**：同时支持桌面端浏览器和移动端浏览器，采用 Mobile-First 响应式设计策略。

- 使用 Tailwind CSS 断点系统（`sm` / `md` / `lg` / `xl`）统一适配桌面与移动浏览器
- 触摸友好的交互设计（按钮尺寸、间距、手势区域）
- 图表组件需在移动屏幕下自适应缩放（ECharts / Plotly 均支持 `resize` 监听）
- 图片使用 `next/image` + `sizes` 属性，配合 CDN 按设备分辨率输出合适尺寸

**后期扩展预留（不在当前阶段实现）：**

| 客户端 | 接入方式 | 预留措施 |
|---|---|---|
| 微信小程序 | 原生小程序 / Taro | NestJS API 已版本化（`/api/v1`），可直接对接；BFF 层无需改动 |
| 原生 APP（iOS / Android） | React Native / Flutter | 同上；JWT 鉴权机制天然支持移动端 Token 携带 |

### BFF 层

- 浏览器流量通过 Next.js Route Handlers（`app/api/`）聚合 NestJS 数据
- 处理 Session Token 转发，屏蔽 NestJS 端口对外暴露
- Next.js Server Actions 用于表单提交与数据变更（下单、支付发起），减少样板代码

---

## 3. 后端 `deermap-core-service` — NestJS

### 模块结构

```
src/
├── app.module.ts
├── config/                  ← ConfigModule（Zod 环境变量校验）
├── common/
│   ├── guards/              ← AuthGuard、RolesGuard、MembershipGuard
│   ├── interceptors/        ← LoggingInterceptor、TransformInterceptor、I18nInterceptor
│   ├── filters/             ← GlobalExceptionFilter
│   ├── decorators/          ← @CurrentUser()、@Roles()、@Public()、@RequireMembership()
│   └── pipes/               ← ZodValidationPipe
├── database/                ← Prisma 全局模块
├── cache/                   ← Redis（@nestjs/cache-manager）
├── auth/
│   ├── auth.service.ts      ← JWT 签发 / 刷新
│   ├── local.strategy.ts    ← 手机号 + 密码登录
│   ├── jwt.strategy.ts      ← JWT Bearer 鉴权
│   ├── wechat-oauth/        ← 微信 OAuth 2.0（网页授权 + 手机号绑定）
│   └── alipay-oauth/        ← 支付宝 OAuth 2.0（auth_code 换 user_id + 手机号绑定）
├── users/                   ← 用户账户管理（注册、信息更新、手机绑定）
├── membership/              ← 会员档位配置、会员状态查询、权益校验
├── orders/                  ← 订单 CRUD、状态流转（适用基础制图 / 个性化制图 / 论文 / 生信 / 行业咨询）
├── payments/
│   ├── wechatpay/           ← 微信支付 APIv3 服务 + Webhook Controller
│   └── alipay/              ← 支付宝 SDK 服务 + Webhook Controller
├── charts/
│   ├── basic/               ← 基础制图权益校验、任务派发、结果存储
│   └── custom/              ← 个性化制图订单管理（后台创建、通知用户支付）
├── paper/                   ← 论文业务模块（订单创建、流程复用 orders 模块）
├── bioinformatics/          ← 生信业务模块（服务项目配置、订单创建、流程复用 orders 模块）
├── consulting/              ← 行业咨询模块（付费 1v1 咨询，订单创建、自助下单 + 后台报价两种路径）
├── news/                    ← 行业讯息模块（首页模块数据聚合，内容由 Payload CMS 管理，无独立列表/详情页）
├── promotions/              ← 促销活动模块（活动配置、折扣计算、优惠券验证）
├── queue/                   ← BullMQ 任务队列 + 基础制图任务 Processor
├── notifications/
│   ├── sms/                 ← 短信验证码（注册 / 手机绑定）
│   ├── email/               ← 邮件通知（订单状态、作品交付）
│   └── wechat-template/     ← 微信服务号模板消息（订单状态推送）
├── delivery/                ← 作品交付模块（生成 OSS 签名 URL、下载记录）
├── after-sales/             ← 售后模块（预留：退款申请、工单、问题反馈）
└── media/                   ← OSS 文件上传 / 签名 URL 生成
```

**关键配置：**

```ts
// main.ts
app.setGlobalPrefix('api/v1', { exclude: ['webhook/(.*)'] });
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```

支付 Webhook Controller 使用 `@Public()` 装饰器排除 JWT 鉴权。

---

## 4. 支付集成

> **方案已确认**：以**个体工商户**身份直接接入微信支付 APIv3 和支付宝开放平台，无需第三方聚合支付。

### 微信支付

- SDK：`wechatpay-node-v3` + `nest-wechatpay-node-v3`（NestJS DI 封装）
- 支持：H5 支付、JSAPI 支付、Native 支付、退款

**完整流程：**
1. 用户下单 → Next.js Route Handler → NestJS `OrdersService.create()`
2. NestJS 调用微信支付 API 创建 `prepay_id`
3. 前端唤起支付（JSAPI：`WeixinJSBridge.invoke`；H5：跳转 `h5_url`）
4. 微信异步 POST 到 `/webhook/wechatpay`（AES-256-GCM 解密 + 验签）
5. 幂等更新订单状态，触发后续通知

### 支付宝

- SDK：官方 `alipay-sdk` v4（需 Node.js ≥ 18.20.0）
- 支持：电脑网站支付、手机网站支付、App 支付

**完整流程：**
1. 后端生成支付表单 / 跳转 URL（`pageExecute('alipay.trade.page.pay')`）
2. 用户完成支付后，支付宝异步 POST 到 `/webhook/alipay`
3. 用 `checkNotifySignV2()` 验签，幂等更新订单状态

### 通用注意事项

- 两个 Webhook 端点均需排除 JWT 鉴权（`@Public()` 装饰器）
- Webhook 处理必须**幂等**：以 `out_trade_no` 作为去重键，配合 Redis 分布式锁
- `notify_url` 必须是**已 ICP 备案域名 + 有效 HTTPS 证书**
- H5 支付（微信）仅用于非微信浏览器；微信内部使用 JSAPI 支付
- 服务器 NTP 时间同步必须保证偏差 < 5 分钟，否则支付签名校验失败

---

## 5. 数据层

### 部署方式：ECS 自建（已决策）

> 初期复用现有 ECS 自建 PostgreSQL + Redis，节约成本。通过备份策略 + 容器重启策略保障可靠性。未来订单量上来后可平滑迁移至阿里云 PolarDB / ApsaraDB。

| 组件 | 部署方式 | 用途 |
|---|---|---|
| PostgreSQL 16 | Docker 容器，挂载命名卷 | 主 DB：用户、订单、支付记录、CMS 内容 |
| Redis 7 | Docker 容器，挂载命名卷 | Session 缓存、BullMQ 队列、支付幂等锁 |
| OSS | 阿里云 OSS（`ali-oss`） | 图表文件、上传数据、团队照片、CMS 媒体 |

- 文件资源通过 CDN 加速（阿里云 CDN），使用签名 URL 控制访问权限
- 文件 Blob **不存入** PostgreSQL

### 高可靠保障方案

**1. 持久化：使用 Docker Named Volume，不使用 bind mount**

```yaml
# docker-compose.yml 数据存储配置
services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - pg_data:/var/lib/postgresql/data   # Named Volume，宏机重启 / 容器重建后数据不丢失
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes   # 开启 AOF 持久化
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  pg_data:
  redis_data:
```

**2. 自动备份：每日 `pg_dump` + 上传 OSS（cron 定时）**

```bash
# /opt/bio/scripts/backup.sh
#!/bin/bash
set -e
DATE=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="/tmp/pg_backup_${DATE}.sql.gz"

# 备份 PostgreSQL
docker exec bio_postgres_1 pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$DUMP_FILE"

# 上传至阿里云 OSS
# 依赖 ossutil CLI： https://help.aliyun.com/document_detail/120075.html
ossutil cp "$DUMP_FILE" "oss://${OSS_BUCKET}/db-backups/$(basename $DUMP_FILE)"

# 清理 7 天以前的本地临时文件
find /tmp -name 'pg_backup_*.sql.gz' -mtime +1 -delete

echo "[$(date)] Backup completed: $DUMP_FILE"
```

```bash
# 添加 cron 任务：每天凌晨 3 点执行
crontab -e
# 加入以下一行：
0 3 * * * /opt/bio/scripts/backup.sh >> /var/log/bio-backup.log 2>&1
```

> OSS 备份保留 30 天，可在 OSS Bucket 生命周期管理规则中配置自动过期删除。

**3. 如果 ECS 磁盘被占满：使用阿里云数据盘挂载到 `/opt/bio/data`**

```bash
# ECS 控制台购买独立云盘（推荐 40GB+）后挂载
mkfs.ext4 /dev/vdb
mkdir -p /opt/bio/data
mount /dev/vdb /opt/bio/data
echo '/dev/vdb /opt/bio/data ext4 defaults 0 0' >> /etc/fstab
```

### 未来迁移至云托管方案

> 当订单量增大、运维压力增加或需要高可用主从切换时，可平滑迁移至阿里云 PolarDB for PostgreSQL + ApsaraDB for Redis。

**迁移步骤（停机窗口 < 30 分钟）：**

```bash
# 1. 基于最新备份恢复到 PolarDB
pg_restore -h <polardb-host> -U <user> -d <dbname> < latest_backup.sql

# 2. 调整 .env 环境变量
DATABASE_URL=postgresql://<user>:<pass>@<polardb-host>:5432/<dbname>
REDIS_URL=redis://:<pass>@<apsaradb-host>:6379

# 3. docker-compose 中移除 postgres / redis 服务块
# 4. 重启 web + api 容器
docker compose up -d web api
```

> 应用层使用标准 `DATABASE_URL` / `REDIS_URL` 环境变量连接，切换时**无需改一行代码**。

---

## 6. 科研制图服务流程

### 6.1 基础制图（自助）

```
用户选择图表类型 → 上传数据文件
        │
        ▼
BFF 校验会员权益（MembershipGuard）
        │
        ├── 无权限 → 引导购买会员 / 单次付费
        │
        ▼
BullMQ 任务入队（charts/basic）
        │
        ▼
Worker 处理制图任务 → 生成图表文件 → 上传 OSS
        │
        ▼
返回预览 & 下载链接（OSS 签名 URL）
```

### 6.2 个性化制图（人工 1v1）

```
用户浏览范例 & 定价参考 → 通过表单 / 微信联系团队
        │
        ▼
团队微信沟通确认需求 & 报价
        │
        ▼
【后台操作】运营人员在 /admin 为该用户创建专属订单
   （填写：用户账号 / 服务描述 / 价格 / 预计交付时间）
        │
        ▼
系统通知用户（站内消息 + 微信模板消息）
   → 「您的定制订单已生成，请前往订单页完成支付」
        │
        ▼
用户在 /user/orders 发起支付（微信支付 / 支付宝）
        │
        ▼
Webhook 回调 → 订单状态更新为「已支付 · 制作中」
        │
        ▼
运营人员完成制图 → 上传成品到 OSS
   → 后台标记「已完成」→ 通知用户下载
        │
        ▼
用户在 /user/orders 查看签名 URL 下载成品（限时有效）
```

> **论文业务**复用相同的后台创建订单 → 通知 → 支付 → 交付流程，不单独开发订单链路。

---

## 7. 部署架构

```yaml
# docker-compose.yml（初期）
services:
  nginx:     # SSL 终止 + 反向代理
  web:       # Next.js (port 3000)
  api:       # NestJS (port 3001，仅内网可访问，/webhook/* 除外)
  postgres:  # PostgreSQL
  redis:     # Redis
```

初期使用 `docker-compose`，未来可迁移至 Docker Swarm 或 K8s。

**上线前检查清单：**
- [x] ICP 备案完成
- [ ] 购买云服务器并完成部署环境配置
- [ ] 域名 A 记录已指向服务器
- [ ] 域名 SSL 证书配置（使用云厂商免费 DV 证书）
- [ ] 微信支付商户号注册、H5 域名白名单配置
- [ ] 支付宝开放平台创建应用、`notify_url` / `return_url` 域名注册
- [ ] 服务器 NTP 时间同步配置
- [ ] npm 镜像源切换为 `registry.npmmirror.com`
- [ ] Docker 镜像源配置为云厂商加速地址

---

## 8. 关键决策说明

### Payload CMS v3 vs Strapi v5

选 **Payload CMS v3**：与 Next.js 同进程运行，无需额外容器，共用 PostgreSQL，无外部 SaaS 依赖，无数据出境风险。若团队更偏好独立 CMS 系统，可改用 Strapi v5 作为独立容器部署。

### BFF：Next.js Route Handlers vs 独立 BFF 服务

浏览器流量全走 **Next.js Route Handlers**，NestJS 不对外暴露；仅支付 Webhook 直接由 NestJS 处理（稳定性更强，不受前端部署影响）。NestJS 已采用 `/api/v1` 版本前缀、标准 JWT 鉴权，当后期需接入微信小程序或原生 App 时，只需在 Nginx 配置中开放对应路径即可，无需改造接口层。

### Prisma vs TypeORM

选 **Prisma**：TypeScript 类型生成质量更高，迁移管理完善，Schema 文件即文档；生成的类型可在 `deermap-core-service` 内直接使用，并通过 OpenAPI 文档同步给 `deermap-web-app`。

### ECharts vs Plotly vs D3

三者并用、分工明确：ECharts 负责标准统计图表（中文社区友好），Plotly 负责专业科学图表，D3 负责完全自定义的生物学图示。

---

## 9. 未来扩展规划

架构从第一天起以中型企业标准设计，以下扩展项已在当前架构中预留接口，**不影响现有模块的改动即可逐步接入**：

| 扩展方向 | 预留措施 | 建议接入时机 |
|---|---|---|
| **国际化（i18n）** | Next.js `next-intl`；NestJS 响应支持 `Accept-Language`；数据库文本字段预留 `_en` 后缀字段或 JSON 多语言结构；Payload CMS 开启 Localization | 用户量出现明显海外来源时 |
| **售后模块** | `after-sales/` 目录已预留；订单状态机预留 `REFUND_PENDING`、`REFUND_DONE`、`DISPUTE` 状态 | 第一笔退款纠纷出现时；或会员用户量超 300 时 |
| **微信小程序 / 原生 App** | API 已版本化（`/api/v1`）；JWT 鉴权天然支持移动端 Token；微信 OAuth 模块可复用 UnionID | 移动端流量占比超 40% 时 |
| **企业账号 / 团队协作会员** | `users` 表预留 `organization_id` 字段；`membership` 模块支持按组织维度校验 | 有明显 B 端团队采购需求时 |
| **搜索增强（Meilisearch）** | 资讯 / 作品数据结构规范化，易于索引；NestJS 可新增 `search/` 模块对接 | 资讯文章超 200 篇，或用户反映搜索体验差时 |
| **积分 / 优惠券系统** | `orders` 模块预留 `discount_amount`、`coupon_code` 字段 | 需做用户留存运营活动时 |
| **运营数据看板** | NestJS 预留 `analytics/` 模块；可对接 Grafana + PostgreSQL，或轻量第三方（如 Umami） | 月活用户超 500 时 |
| **API 开放平台（机构调用）** | API 已版本化；可在 `auth/` 模块增加 API Key 鉴权策略，配合 Rate Limiting | 有机构用户提出程序化批量制图需求时 |
| **多语言 SEO** | Next.js App Router 支持 `[locale]` 路由段；`next-sitemap` 生成多语言 sitemap | 与国际化同步推进 |
| **容器编排升级** | 当前 `docker-compose`；配置文件规范化，可平滑迁移至 Docker Swarm 或 K8s | 容器数超过 8 个，或需要跨机器编排时 |

---

## 10. 测试策略

| 层级 | 工具 | 重点 |
|---|---|---|
| 单元测试 | Jest + `@nestjs/testing` | 支付服务解密逻辑、订单幂等处理 |
| 组件测试 | React Testing Library | 图表组件渲染、下单表单 |
| E2E 测试 | Playwright | 完整下单 → 支付 → 回调 → 状态更新链路 |
| 支付联调 | 支付宝沙箱 / 微信真实小额（¥0.01） | 微信沙箱环境不稳定，建议真实商户号测试 |

本地开发时使用 VS Code Dev Tunnels 或 `ngrok` 将 Webhook 端口公网暴露，接收真实支付回调。
