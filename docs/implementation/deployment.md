# 部署与上线

---

## 1. 服务器目录结构

```bash
/opt/bio/
├── docker-compose.yml
├── .env                    # 生产环境变量（不提交 Git）
├── nginx/
│   ├── nginx.conf
│   └── ssl/
│       ├── cert.pem
│       └── key.pem
└── backups/                # 数据库备份（定时脚本）
```

---

## 2. 生产 docker-compose.yml

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    restart: unless-stopped

  web:
    image: ghcr.io/YOUR_GITHUB_USERNAME/deermap-web-app:latest
    expose:
      - "3000"
    env_file: .env
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: ghcr.io/YOUR_GITHUB_USERNAME/deermap-core-service:latest
    expose:
      - "3001"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    expose:
      - "5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pg_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    expose:
      - "6379"
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
    driver: local
    driver_opts:
      type: none
      device: /opt/bio/data/pg
      o: bind
  redis_data:
    driver: local
    driver_opts:
      type: none
      device: /opt/bio/data/redis
      o: bind

networks:
  default:
    name: bio_network
```

> PostgreSQL 和 Redis 均以 Docker 容器自建方式运行（ECS 自建，已决策），数据持久化到独立挂载目录 `/opt/bio/data/`。详见 `docs/architecture/prerequisites.md` 第 5 节。

---

## 3. Nginx 配置

```nginx
# nginx/nginx.conf
events { worker_connections 1024; }

http {
  # HTTP → HTTPS 重定向
  server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # 所有请求走 Next.js
    location / {
      proxy_pass http://web:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 支付 Webhook 直接走 NestJS（稳定性更高）
    location /webhook/ {
      proxy_pass http://api:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_read_timeout 30s;
    }
  }
}
```

---

## 4. Dockerfile

### deermap-web-app

```dockerfile
# deermap-web-app/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### deermap-core-service

```dockerfile
# deermap-core-service/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

---

## 5. GitHub Actions CI/CD

### deermap-web-app（.github/workflows/deploy.yml）

```yaml
name: Deploy deermap-web-app

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build and push Docker image
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker build -t ghcr.io/${{ github.repository_owner }}/deermap-web-app:latest .
          docker push ghcr.io/${{ github.repository_owner }}/deermap-web-app:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/bio
            docker compose pull web
            docker compose up -d web
            docker image prune -f
```

> deermap-core-service 的 workflow 结构类似，替换镜像名即可。

---

## 6. 数据库迁移（生产环境）

```bash
# 在服务器上执行（通过 SSH 或 GitHub Actions 步骤）
docker run --rm \
  --env DATABASE_URL="${DATABASE_URL}" \
  ghcr.io/YOUR_GITHUB_USERNAME/deermap-core-service:latest \
  npx prisma migrate deploy
```

> `prisma migrate deploy` 只执行已生成的迁移文件，不生成新迁移，适合生产环境。

---

## 7. 上线前检查清单

**基础设施**
- [x] ICP 备案已通过
- [ ] 云服务器已购买，独立数据盘已挂载至 `/opt/bio/data`
- [ ] 域名 A 记录已指向服务器 IP
- [ ] SSL 证书已配置并有效
- [ ] 服务器 NTP 时间同步正常（`date` 命令验证，偏差 < 5 分钟）
- [ ] Docker + Docker Compose 已安装，镜像加速已配置
- [ ] `/opt/bio/data/pg` 和 `/opt/bio/data/redis` 目录已创建
- [ ] 自动备份脚本已部署，cron 已配置（见 `prerequisites.md` 第 5 节）

**应用部署**
- [ ] 所有生产环境变量已填写（`.env` 文件，含 `POSTGRES_*`、`REDIS_URL`、`NESTJS_API_URL=http://api:3001`）
- [ ] 数据库迁移已运行（`prisma migrate deploy`）
- [ ] PostgreSQL / Redis 健康检查通过（`docker compose ps`）
- [ ] OSS Bucket 权限和 CDN 配置验证
- [ ] Payload CMS Admin 首次登录（`/admin`），创建管理员账号

**支付验收**
- [ ] 微信支付：商户号申请完成，`notify_url` 配置为 `https://yourdomain.com/webhook/wechatpay`
- [ ] 支付宝：开放平台应用配置完成，`notify_url` 配置为 `https://yourdomain.com/webhook/alipay`
- [ ] 支付流程端到端测试（微信 + 支付宝各发起一笔 ¥0.01 测试单）
- [ ] Webhook 收到回调 + 订单状态更新正常

**兼容性**
- [ ] 移动端浏览器测试（iOS Safari + Android Chrome）

---

## 8. 日常维护

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f web
docker compose logs -f api

# 更新服务（新版本发布后）
docker compose pull
docker compose up -d

# 手动触发一次备份（同脚本逻辑）
bash /opt/bio/scripts/backup.sh

# 查看备份日志
tail -f /var/log/bio-backup.log
```
