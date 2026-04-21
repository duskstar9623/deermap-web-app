# 本地开发环境初始化

---

## 1. 本地依赖安装

| 工具 | 版本要求 | 安装方式 |
|---|---|---|
| Node.js | ≥ 20.x LTS | https://nodejs.org 或 `nvm` |
| pnpm | 最新 | `npm i -g pnpm` |
| Docker Desktop | 最新 | https://www.docker.com/products/docker-desktop |
| Git | 最新 | https://git-scm.com |

```bash
# 验证安装
node -v   # v20.x.x
pnpm -v   # 9.x.x
docker -v
```

---

## 2. 配置 npm 镜像源（国内加速）

```bash
# 全局设置
pnpm config set registry https://registry.npmmirror.com

# 验证
pnpm config get registry
```

---

## 3. 本地 Docker Compose（开发用）

在任意目录创建 `docker-compose.dev.yml`，仅启动依赖服务，不运行应用本身：

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: bio_dev
      POSTGRES_USER: bio
      POSTGRES_PASSWORD: bio_dev_secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_dev_data:
```

```bash
# 启动本地数据库和 Redis
docker compose -f docker-compose.dev.yml up -d

# 停止
docker compose -f docker-compose.dev.yml down
```

---

## 4. VS Code 推荐插件

```json
// .vscode/extensions.json（在两个仓库根目录创建）
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "ms-azuretools.vscode-docker",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 5. 支付 Webhook 本地调试

由于 Webhook 需要公网可访问的 URL，本地开发时使用 VS Code Dev Tunnels 或 ngrok：

```bash
# 使用 VS Code Dev Tunnels（推荐，无需额外安装）
# 在 VS Code 中：左下角 → Ports → Forward a Port → 输入 3001

# 或使用 ngrok
npm i -g ngrok
ngrok http 3001
# 复制生成的 https://xxxxx.ngrok.io 作为 notify_url
```

> 注意：每次重启 ngrok，URL 会变化，需要在虎皮椒后台重新填写回调地址。
