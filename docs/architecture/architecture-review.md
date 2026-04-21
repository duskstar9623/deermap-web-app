# 架构 Review 总结

> 日期：2026-04-20（更新：2026-04-21）  
> 基于 `docs/architecture/architecture-decision.md` 与 `docs/business/business-overview.md`

---

## ✅ 架构整体评价

整体设计以中型企业架构标准出发，技术选型主流、扩展性强，适合当前阶段快速落地后持续演进：

- **Next.js + NestJS 分层**合理：BFF 模式屏蔽后端细节，后期扩展小程序 / App 成本低
- **Payload CMS 同进程方案**务实：节省一个容器，管理后台开箱即用，资讯 / 内容运营无需改代码
- **BullMQ 异步队列**适配基础制图场景：自助任务异步处理，与人工个性化制图流程互不干扰
- **Multi-repo 职责分离**：前后端独立部署与版本控制，适合小团队并行开发
- **订单模块统一**：基础制图、个性化制图、论文业务、生信业务、行业咨询共用一套 `orders` + `payments` 链路，无重复开发

---

## ✅ 已解决关键问题

### 支付方案（已确认）

注册**个体工商户**后直接接入微信支付 APIv3 + 支付宝开放平台，直连官方 API，无平台风险，费率最优。  
无需第三方聚合支付，原支付模块方案不变。

### ICP 备案 + 域名注册（已完成）

域名已注册并完成 ICP 备案。`notify_url` 备案域名条件已满足，支付 Webhook 上线无阻。  
云服务器尚未购买，DNS A 记录待服务器到位后配置。

### GitHub 仓库（已完成）

`deermap-web-app` 与 `deermap-core-service` 两个私有仓库已创建。待后续配置 GitHub Actions CI/CD 和 Secrets。

---

## ⚠️ 当前风险 & 待处理事项

### 🟡 P1：ICP 备案必须在支付 Webhook 上线前完成

> ✅ **已完成**：域名已注册，ICP 备案已通过，DNS A 记录已配置。

### ✅ 数据库部署方式（已决策）

**决策：ECS 自建 PostgreSQL + Redis，备份上传 OSS。**

高可靠保障措施：
- Docker Named Volume 保证容器重建数据不丢失；`restart: unless-stopped` 自动恢复
- Redis 开启 AOF 持久化，避免崩溃后队列数据丢失
- `pg_dump` + cron 每日凌晨 3 点自动备份并上传至 OSS（保留 30 天）
- Docker `healthcheck` 监控容器健康状态
- 推荐单独挂载阿里云数据盘（>/= 40GB）存放数据，与系统盘隔离

未来平滑迁移至云托管（PolarDB + ApsaraDB）只需修改 `DATABASE_URL` / `REDIS_URL` 环境变量，无需改动任何业务代码。具体方案见 `architecture-decision.md` 第 5 节。

### 🟡 P2：业务定价尚未确定，影响订单模型与下单页开发

`business-overview.md` 中多个关键项仍为"待决策"：
- 各档会员价格、单次制图定价、个性化制图分档定价、退款策略
- 生信业务标准分析项目固定定价表
- 行业咨询具体服务项目、定价分档

建议在开发 `/user/orders` 和支付模块前先拍板，否则订单模型会反复改。

### 🟢 P3：图表库三库同时引入，初期包体较重

ECharts + Plotly + D3 全量引入，首次加载 JS 体积较大。  
使用 `dynamic import` + `ssr: false` 按需加载（已在文档中要求，执行时注意落实）。

---

## 推荐开发顺序

```
第 1 周（并行）✅ 已完成
  ├── ✅ 提交 ICP 备案申请（已通过）
  ├── ✅ 域名注册（已完成）
  ├── ✅ 创建 GitHub 仓库（已完成）
  ├── 购买云服务器（ECS）
  ├── 办理个体工商户营业执照
  └── 拍板定价决策（见 business-overview.md 待决策项）

第 2–3 周
  └── 搜建基础设施（云服务器、数据库、OSS、Redis）→ 见 prerequisites.md
  └── 本地开发环境初始化 → 见 03-dev-environment.md

第 4–6 周
  ├── deermap-web-app：首页（含行业讯息模块）、团队页、制图展示页（静态 / CMS 驱动）→ 见 04-deermap-web-app-init.md
  └── deermap-core-service：用户注册 / 登录（手机号 + 微信 OAuth）、会员模块 → 见 05-deermap-core-service-init.md

第 7–8 周
  ├── 支付集成（微信支付 APIv3 + 支付宝，申请营业执照后同步推进）
  ├── 订单模块（基础制图 / 个性化制图 / 论文 / 生信 / 行业咨询共用）
  └── 基础制图工具页 + BullMQ 任务队列

第 9 周
  ├── 个性化制图页 & 后台创建订单流程
  ├── 论文业务页 & 生信业务页
  ├── 行业咨询页
  └── 作品交付模块（OSS 签名 URL + 通知）

第 10 周
  ├── CMS 内容录入（首页 Banner、团队资料、行业讯息文章）
  └── 部署上线 → 见 06-deployment.md
```

