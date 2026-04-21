# bio-api 仓库初始化

---

## 1. 创建 NestJS 项目

```bash
# 全局安装 NestJS CLI（如未安装）
pnpm add -g @nestjs/cli

# 创建项目
nest new bio-api --package-manager pnpm --strict

cd bio-api
```

---

## 2. 安装核心依赖

```bash
# 数据库
pnpm add @prisma/client
pnpm add -D prisma

# 配置管理 + 验证
pnpm add @nestjs/config zod

# 缓存 / Redis
pnpm add @nestjs/cache-manager cache-manager @keyv/redis keyv

# 队列
pnpm add @nestjs/bullmq bullmq

# JWT 鉴权
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add -D @types/passport-jwt

# 微信支付 APIv3
pnpm add wechatpay-node-v3 nest-wechatpay-node-v3

# 支付宝商户 SDK
pnpm add alipay-sdk

# 微信 OAuth（网页授权登录）
pnpm add axios

# 文件上传 / OSS
pnpm add ali-oss
pnpm add -D @types/ali-oss

# 短信（手机号验证，选阻云 / 腾讯云短信）
pnpm add tencentcloud-sdk-nodejs  # 或 @alicloud/dysms

# Swagger 文档
pnpm add @nestjs/swagger swagger-ui-express
```

---

## 3. Prisma 初始化

```bash
pnpm exec prisma init --datasource-provider postgresql
```

编辑 `prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String      @id @default(cuid())
  phone          String      @unique                // 主标识，注册时必填
  passwordHash   String?
  name           String?
  avatar         String?
  wechatOpenId   String?     @unique                // 微信登录绑定
  alipayUserId   String?     @unique                // 支付宝登录绑定
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  orders         Order[]
  memberships    Membership[]
}

model Order {
  id              String      @id @default(cuid())
  outTradeNo      String      @unique              // 对外支付单号（幂等键）
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  type            OrderType
  originalPrice   Int                              // 原价（分）
  discountAmount  Int         @default(0)          // 折扣金额（分）
  amount          Int                              // 实收金额 = originalPrice - discountAmount
  couponCode      String?                          // 优惠券码
  promotionId     String?                          // 关联促销活动
  promotion       Promotion?  @relation(fields: [promotionId], references: [id])
  status          OrderStatus @default(PENDING)
  payChannel      String?                          // 'wechat' | 'alipay'
  paidAt          DateTime?
  description     String?                          // 个性化制图/咨询服务说明（后台填写）
  deliveryUrl     String?                          // 交付文件 OSS 签名 URL
  deliveredAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model Membership {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  plan      String   // 'daily' | 'monthly' | 'quarterly' | 'yearly'
  startAt   DateTime
  expireAt  DateTime
  orderId   String?  @unique                      // 关联购买订单
  createdAt DateTime @default(now())
}

model Promotion {
  id            String    @id @default(cuid())
  name          String
  discountType  String    // 'percent' | 'fixed'
  discountValue Int                               // 折扣率（如 80 = 8折）或直减金额（分）
  scope         String    // 'all' | 'membership' | 'chart_single' | 'consulting'
  startAt       DateTime
  endAt         DateTime
  isActive      Boolean   @default(true)
  orders        Order[]
  createdAt     DateTime  @default(now())
}

enum OrderType {
  MEMBERSHIP        // 购买会员
  CHART_SINGLE      // 单次基础制图
  CHART_CUSTOM      // 个性化制图（后台创建）
  PAPER             // 论文业务
  CONSULTING        // 专业咨询
}

enum OrderStatus {
  PENDING           // 待支付
  PAID              // 已支付·制作中
  FULFILLED         // 已完成·可下载
  REFUND_PENDING    // 退款处理中
  REFUNDED          // 已退款
  CANCELLED         // 已取消
}
```

```bash
# 生成 Prisma Client
pnpm exec prisma generate

# 运行迁移（本地开发）
pnpm exec prisma migrate dev --name init
```

---

## 4. 环境变量

创建 `.env`：

```env
# 数据库
DATABASE_URL=postgresql://bio:bio_dev_secret@localhost:5432/bio_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# OSS（阿里云）
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
OSS_REGION=oss-cn-hangzhou
OSS_CDN_BASE=https://your-cdn-domain.com

# 支付（虎皮椒）
XUNHUPAY_APPID=
XUNHUPAY_SECRET=
XUNHUPAY_NOTIFY_URL=https://yourdomain.com/webhook/xunhupay

# 通知
NOTIFY_EMAIL=your@email.com
```

---

## 5. 模块初始化顺序

按以下顺序逐步创建模块，每步测试后再推进：

### 第一批（基础设施模块）

```bash
nest g module database
nest g module cache
nest g module config
```

```typescript
// src/database/database.module.ts
import { Global, Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Global()
@Module({
  providers: [{ provide: PrismaClient, useValue: new PrismaClient() }],
  exports: [PrismaClient],
})
export class DatabaseModule {}
```

### 第二批（业务核心）

```bash
nest g module auth
nest g service auth
nest g module users
nest g service users
nest g controller users
```

### 第三批（订单 + 支付）

```bash
nest g module orders
nest g service orders
nest g controller orders
nest g module payments
nest g service payments/wechatpay payments
nest g controller payments/wechatpay payments
nest g service payments/alipay payments
nest g controller payments/alipay payments
```

### 第四批（业务扩展模块）

```bash
nest g module charts
nest g module consulting
nest g module paper
nest g module promotions
nest g service promotions
nest g module delivery
nest g service delivery
```

### 第五批（队列 + 文件 + 通知）

```bash
nest g module queue
nest g processor queue/chart-task queue
nest g module media
nest g service media
nest g controller media
nest g module notifications
nest g service notifications/sms notifications
nest g service notifications/email notifications
nest g service notifications/wechat-template notifications
```

---

## 6. main.ts 配置

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局前缀（Webhook 排除）
  app.setGlobalPrefix('api/v1', { exclude: ['webhook/(.*)'] })

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  // CORS（仅允许 bio-web 域名）
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // Swagger（仅开发环境）
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Bio API')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const doc = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, doc)
  }

  await app.listen(3001)
}
bootstrap()
```

---

## 7. 支付 Webhook Controller

### 微信支付

```typescript
// src/payments/wechatpay/wechatpay.controller.ts
import { Controller, Post, Req, Headers } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { WechatpayService } from './wechatpay.service'
import { Request } from 'express'

@Controller('webhook')
export class WechatpayController {
  constructor(private readonly wechatpayService: WechatpayService) {}

  // 注意：微信支付 Webhook 需要原始 Body（Buffer）用于验签
  // main.ts 中需启用 rawBody: true
  @Public()
  @Post('wechatpay')
  async handleWebhook(
    @Req() req: Request,
    @Headers('wechatpay-timestamp') timestamp: string,
    @Headers('wechatpay-nonce') nonce: string,
    @Headers('wechatpay-signature') signature: string,
    @Headers('wechatpay-serial') serial: string,
  ) {
    return this.wechatpayService.handleNotify({
      rawBody: req.rawBody,
      timestamp, nonce, signature, serial,
    })
  }
}
```

```typescript
// src/payments/wechatpay/wechatpay.service.ts (核心逻辑示意)
@Injectable()
export class WechatpayService {
  async handleNotify({ rawBody, timestamp, nonce, signature, serial }) {
    // 1. 验签（用 wechatpay-node-v3 提供的 verifySign 或手动验证）
    // 2. AES-256-GCM 解密 resource 字段
    // 3. 幂等更新订单：where { outTradeNo, status: PENDING } → PAID
    // 4. 触发后续通知（展示订单状态更新）
    return { code: 'SUCCESS', message: ''成功'' }
  }
}
```

### 支付宝

```typescript
// src/payments/alipay/alipay.controller.ts
@Controller('webhook')
export class AlipayController {
  constructor(private readonly alipayService: AlipayService) {}

  @Public()
  @Post('alipay')
  async handleWebhook(@Body() body: Record<string, string>) {
    return this.alipayService.handleNotify(body)
  }
}
```

```typescript
// src/payments/alipay/alipay.service.ts (核心逻辑示意)
@Injectable()
export class AlipayService {
  async handleNotify(body: Record<string, string>) {
    // 1. checkNotifySignV2() 验签
    // 2. trade_status === 'TRADE_SUCCESS' 时处理
    // 3. 幂等更新订单：where { outTradeNo: out_trade_no, status: PENDING } → PAID
    // 4. 触发后续通知
    return 'success'
  }
}
```

> **注意事项：**
> - 微信支付 Webhook 需在 `main.ts` 中启用 `rawBody: true`（`NestFactory.create(AppModule, { rawBody: true })`）
> - 两个 Webhook 均使用 Redis 分布式锁（`SET NX EX`）保证幂等，以 `outTradeNo` 为 key
> - Webhook 处理必须在 5 秒内返回（默认超时要求）

---

## 8. 运行开发服务器

```bash
pnpm run start:dev
# API 文档：http://localhost:3001/api/docs
```
