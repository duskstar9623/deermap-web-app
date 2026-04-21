# 前置条件准备

> 在写第一行业务代码之前，把这些基础工作并行推进。

---

## 1. 域名注册

- [ ] 在阿里云（万网）或腾讯云注册域名
- [ ] 推荐使用 `.com` / `.cn`，`.bio` 也契合业务（但备案略麻烦）
- [ ] 域名实名认证（身份证）

---

## 2. ICP 备案 ⚠️ 最长耗时项

> 支付 Webhook 的 `notify_url` 必须是已备案域名，不备案无法上线支付功能。

- [ ] 购买云服务器（备案需要绑定到具体服务器）
  - 推荐：腾讯云 / 阿里云轻量应用服务器，2核2G 起步，约 ¥50–80/月
- [ ] 在云厂商控制台提交 ICP 备案申请
  - 个人备案：身份证正反面 + 手持照片
  - **预留 7–20 个工作日**，提交后不可修改服务器
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

# 配置 Docker 镜像加速（腾讯云加速地址）
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
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

## 5. 数据库 / 缓存（云托管版，推荐初期使用）

| 服务 | 推荐规格 | 月费参考 |
|---|---|---|
| PostgreSQL | 腾讯云 TDSQL-C Serverless 或 阿里云 PolarDB 最小规格 | ¥30–80/月 |
| Redis | 腾讯云 Redis 社区版 256MB | ¥15–30/月 |

- [ ] 创建数据库实例，记录连接字符串
- [ ] 创建 Redis 实例，记录 `redis://` 连接地址
- [ ] 将数据库加入云服务器所在 VPC，**不对公网开放**

---

## 6. OSS 文件存储

- [ ] 开通阿里云 OSS 或腾讯云 COS
- [ ] 创建 Bucket（私有权限）
- [ ] 创建 RAM 子账号（阿里云）/ 子用户（腾讯云），只授予 OSS 读写权限
- [ ] 记录 `AccessKeyId` 和 `AccessKeySecret`
- [ ] 开通 CDN 并绑定 Bucket（图片加速访问）

---

## 7. 支付平台账号（个人账户方案）

假设使用虎皮椒（见 `01-payment-options.md`）：

- [ ] 注册虎皮椒账号：https://xunhupay.com
- [ ] 绑定个人微信收款码（截图上传或扫码绑定）
- [ ] 绑定个人支付宝收款码
- [ ] 获取 `APPID` 和 `AppSecret`
- [ ] 记录回调地址格式要求

---

## 8. GitHub 仓库

- [ ] 创建 `bio-web` 仓库（Private）
- [ ] 创建 `bio-api` 仓库（Private）
- [ ] 在两个仓库分别配置 GitHub Secrets（部署用）：
  - `SERVER_HOST`、`SERVER_USER`、`SERVER_SSH_KEY`
  - `DATABASE_URL`、`REDIS_URL`
  - `OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`
  - `XUNHUPAY_APPID`、`XUNHUPAY_SECRET`（或其他支付平台凭证）
