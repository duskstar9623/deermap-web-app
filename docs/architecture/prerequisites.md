# 前置条件准备

> 在写第一行业务代码之前，把这些基础工作并行推进。

---

## 1. 域名注册 ✅ 已完成

- [x] 在阿里云（万网）注册域名
- [x] 推荐使用 `.com` / `.cn`，`.bio` 也契合业务（但备案略麻烦）
- [x] 域名实名认证（身份证）

---

## 2. ICP 备案 ✅ 已完成

- [x] 在云厂商控制台提交 ICP 备案申请并通过
- [ ] 购买云服务器（ECS，2核2G 起步，约 ¥50–80/月）并绑定备案域名
- [ ] 备案通过后，在 DNS 解析中配置 A 记录指向服务器 IP

---

## 3. SSL 证书

- [ ] 备案通过后申请免费 DV 证书（云厂商控制台，DigiCert/TrustAsia 免费版，有效期 1 年）
- [ ] 下载证书文件（`.pem` + `.key`），后续配置 Nginx 使用
- [ ] 设置证书到期提醒（或启用自动续签）

---

## 4. 云服务器配置

- [ ] 服务器操作系统：Ubuntu 22.04 LTS（推荐）
- [ ] 安全组 / 防火墙开放端口：`22`（SSH）、`80`（HTTP）、`443`（HTTPS）
- [ ] SSH 配置：生成密钥对，禁用密码登录
- [ ] 安装 Docker + Docker Compose

```bash
# Ubuntu 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose Plugin
sudo apt install docker-compose-plugin

# 配置 Docker 镜像加速（阿里云容器镜像服务加速，需登录 https://cr.console.aliyun.com 获取专属加速地址）
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": ["https://<your-acr-id>.mirror.aliyuncs.com"]
}
EOF
sudo systemctl restart docker
```

- [ ] 配置 NTP 时间同步（支付签名必须）

```bash
sudo apt install ntp -y
sudo systemctl enable ntp
# 验证时间偏差
ntpq -p
```

---

## 5. 数据库 / 缓存（ECS 自建，已决策）

> 复用现有 ECS 内置 Docker 容器运行 PostgreSQL + Redis，通过备份策略保障可靠性。未来迁移云托管时只需修改环境变量。

### 挂载独立数据盘（强烈推荐）

```bash
# ECS 控制台购买独立云盘（推荐 40GB+，SSD 类型），挂载到 /opt/bio/data
mkfs.ext4 /dev/vdb
mkdir -p /opt/bio/data
mount /dev/vdb /opt/bio/data
# 开机自动挂载
echo '/dev/vdb /opt/bio/data ext4 defaults 0 0' >> /etc/fstab
```

### Docker Compose 数据层配置

```yaml
# docker-compose.yml （数据期新广角配置片段）
services:
  postgres:
    image: postgres:16-alpine
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
```

```bash
# 初始化目录
mkdir -p /opt/bio/data/pg /opt/bio/data/redis
```

### 自动备份脚本

```bash
# /opt/bio/scripts/backup.sh
#!/bin/bash
set -e
source /opt/bio/.env   # 加载环境变量
DATE=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="/tmp/pg_backup_${DATE}.sql.gz"

docker exec bio-postgres-1 pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$DUMP_FILE"

# 上传至 OSS（选装 ossutil: https://help.aliyun.com/document_detail/120075.html）
ossutil cp "$DUMP_FILE" "oss://${OSS_BUCKET}/db-backups/$(basename $DUMP_FILE)"

rm -f "$DUMP_FILE"
echo "[$(date)] Backup OK"
```

```bash
# 赋予执行权限并添加 cron
chmod +x /opt/bio/scripts/backup.sh
crontab -e
# 加入以下一行：每天凌晨 3 点备份
0 3 * * * /opt/bio/scripts/backup.sh >> /var/log/bio-backup.log 2>&1
```

> OSS Bucket 中对 `db-backups/` 路径配置「生命周期管理」规则，30 天后自动删除。

- [ ] 初始化目录：`mkdir -p /opt/bio/data/pg /opt/bio/data/redis /opt/bio/scripts`
- [ ] 将备份脚本放入 `/opt/bio/scripts/backup.sh` 并赋权
- [ ] 添加 cron 定时任务
- [ ] 首次手动执行备份脚本验证可用性
- [ ] OSS Bucket 配置 30 天生命周期删除规则
- [ ] 将 `DATABASE_URL`、`REDIS_URL` 写入 `.env`

---

## 6. OSS 文件存储

- [ ] 开通阿里云 OSS
- [ ] 创建 Bucket（私有权限）
- [ ] 创建 RAM 子账号，只授予 OSS 读写权限
- [ ] 记录 `AccessKeyId` 和 `AccessKeySecret`
- [ ] 开通 CDN 并绑定 Bucket（图片加速访问）

---

## 7. 支付平台账号（个体工商户直连方案）

> 支付方案已确认：以**个体工商户**身份直接接入微信支付 APIv3 + 支付宝开放平台，无需第三方聚合支付。

### 微信支付

- [ ] 办理个体工商户营业执照（微信支付要求个体工商户资质）
- [ ] 在微信支付商户平台（pay.weixin.qq.com）申请商户号
- [ ] 开通 H5 支付、JSAPI 支付、Native 支付权限
- [ ] 配置 H5 支付域名白名单
- [ ] 下载商户证书（`.pem`）与商户 API 私钥，记录 `mchid`、`serial_no`
- [ ] 设置微信支付 Webhook 回调地址（`https://yourdomain.com/webhook/wechatpay`，需已 ICP 备案）

### 支付宝

- [ ] 在支付宝开放平台（open.alipay.com）创建应用
- [ ] 配置应用公钚 / 私钚（RSA2）
- [ ] 开通电脑网站支付、手机网站支付权限
- [ ] 设置 异步通知地址（`notify_url`）和 同步返回地址（`return_url`），均需已 ICP 备案域名
- [ ] 记录 `app_id`

---

## 8. GitHub 仓库 ✅ 部分完成

- [x] 创建 `deermap-web-app` 仓库（Private）
- [x] 创建 `deermap-core-service` 仓库（Private）
- [ ] 在两个仓库分别配置 GitHub Secrets（部署用）：
  - `SERVER_HOST`、`SERVER_USER`、`SERVER_SSH_KEY`
  - `DATABASE_URL`、`REDIS_URL`
  - `OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BUCKET`、`OSS_REGION`
  - `WECHAT_MCH_ID`、`WECHAT_MCH_SERIAL_NO`、`WECHAT_API_V3_KEY`、`WECHAT_PRIVATE_KEY`
  - `ALIPAY_APP_ID`、`ALIPAY_PRIVATE_KEY`、`ALIPAY_PUBLIC_KEY`
