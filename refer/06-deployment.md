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
    image: ghcr.io/YOUR_GITHUB_USERNAME/bio-web:latest
    expose:
      - "3000"
    env_file: .env
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: ghcr.io/YOUR_GITHUB_USERNAME/bio-api:latest
    expose:
      - "3001"
    env_file: .env
    restart: unless-stopped

networks:
  default:
    name: bio_network
```

> 数据库和 Redis 使用云托管服务，不在 docker-compose 中定义。

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

### bio-web

```dockerfile
# bio-web/Dockerfile
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

### bio-api

```dockerfile
# bio-api/Dockerfile
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

### bio-web（.github/workflows/deploy.yml）

```yaml
name: Deploy bio-web

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
          docker build -t ghcr.io/${{ github.repository_owner }}/bio-web:latest .
          docker push ghcr.io/${{ github.repository_owner }}/bio-web:latest

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

> bio-api 的 workflow 结构类似，替换镜像名即可。

---

## 6. 数据库迁移（生产环境）

```bash
# 在服务器上执行（通过 SSH 或 GitHub Actions 步骤）
docker run --rm \
  --env DATABASE_URL="${DATABASE_URL}" \
  ghcr.io/YOUR_GITHUB_USERNAME/bio-api:latest \
  npx prisma migrate deploy
```

> `prisma migrate deploy` 只执行已生成的迁移文件，不生成新迁移，适合生产环境。

---

## 7. 上线前检查清单

- [ ] ICP 备案已通过，域名 A 记录已指向服务器
- [ ] SSL 证书已配置并有效
- [ ] 所有生产环境变量已填写（`.env` 文件）
- [ ] 虎皮椒后台已配置正确的 `notify_url`（`https://yourdomain.com/webhook/xunhupay`）
- [ ] 服务器 NTP 时间同步正常（`date` 命令验证）
- [ ] 数据库迁移已运行（`prisma migrate deploy`）
- [ ] PostgreSQL / Redis 连接测试通过
- [ ] OSS Bucket 权限和 CDN 配置验证
- [ ] Payload CMS Admin 首次登录（`/admin`），创建管理员账号
- [ ] 支付流程端到端测试（微信 + 支付宝各发起一笔 ¥0.01 测试单）
- [ ] Webhook 收到回调 + 订单状态更新正常
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

# 手动数据库备份
docker run --rm postgres:16-alpine \
  pg_dump "$DATABASE_URL" > /opt/bio/backups/$(date +%Y%m%d).sql
```
