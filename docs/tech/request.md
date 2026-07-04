# 统一请求机制

> 本文档说明项目中 HTTP 请求层的架构设计、使用方法与扩展指南。  
> 最后更新：2026-05-30

---

## 一、架构总览

```
src/
├── configs/
│   └── requests.json            ← API 端点地址 & 全局配置
└── services/
    ├── request.service.ts       ← axios 实例 + 请求/响应拦截器 + 便捷方法
    ├── error.service.ts         ← ApiError 类 + ErrorCode 枚举 + 全局错误处理器
    ├── localStorage.service.ts  ← localStorage 读写封装
    ├── auth.service.ts          ← 认证 API（Phase 2，当前为接口存根）
    ├── orders.service.ts        ← 订单 API（Phase 2，当前为接口存根）
    ├── contact.service.ts       ← 联系表单 API（Phase 2，当前为接口存根）
    └── cookie.service.ts        ← Cookie 读写封装（预留）
```

**设计原则：**

- 所有 API 端点路径集中在 `requests.json`，不散落在业务代码中
- 请求/响应拦截器统一处理 Token 注入与错误转换
- 错误以类型安全的 `ApiError` 类抛出，业务层可精确 catch
- 全局错误处理器可替换，方便接入 UI 通知组件

---

## 二、配置文件 `src/configs/requests.json`

```json
{
  "baseURL": "/api/v1",
  "timeout": 15000,
  "endpoints": {
    "auth": {
      "login": "/auth/login",
      "logout": "/auth/logout",
      "refreshToken": "/auth/refresh",
      "sendSmsCode": "/auth/sms-code",
      "wechatLogin": "/auth/wechat"
    },
    "user": { ... },
    "orders": { ... },
    "charts": { ... },
    "services": { ... },
    "content": { ... },
    "contact": { ... },
    "promotions": { ... }
  }
}
```

| 字段 | 说明 |
|------|------|
| `baseURL` | 所有请求的基础路径前缀。开发时通过 Vite proxy 转发，生产环境由 Nginx 反代 |
| `timeout` | 全局超时时间（毫秒） |
| `endpoints` | 按业务模块组织的端点路径，支持 `:id` 路径参数占位符 |

**新增 API 时**：只需在 `endpoints` 中添加对应路径，再到 `services/` 下创建对应 `*.service.ts` 模块即可。

---

## 三、HTTP 客户端 `services/request.service.ts`

### 3.1 请求拦截器

- **Token 注入**：从 `localStorage` 读取 `deermap_jwt_token`，自动附加 `Authorization: Bearer <token>` 请求头
- **开发日志**：`DEV` 模式下打印请求方法 + URL

### 3.2 响应拦截器

- 成功响应直接返回
- 错误响应自动转换为 `ApiError` 实例并触发全局错误处理器

### 3.3 便捷方法

```ts
import requestService from '@/services/request.service'

// 泛型 T 为 response.data.data 的类型
const res = await requestService.get<User[]>('/users')
const users = res.data.data // 类型为 User[]

// 所有方法挂在 requestService 上：
// requestService.get<T>(url, config?) → Promise<AxiosResponse<ApiResponse<T>>>
// requestService.post<T>(url, data?, config?) → Promise<AxiosResponse<ApiResponse<T>>>
// requestService.put<T>(url, data?, config?) → Promise<AxiosResponse<ApiResponse<T>>>
// requestService.patch<T>(url, data?, config?) → Promise<AxiosResponse<ApiResponse<T>>>
// requestService.del<T>(url, config?) → Promise<AxiosResponse<ApiResponse<T>>>
```

### 3.4 Token 管理

```ts
import requestService from '@/services/request.service'

requestService.setToken('eyJhbG...')   // 登录后存储
requestService.getToken()              // 读取
requestService.removeToken()           // 登出时清除
```

---

## 四、错误处理 `services/error.service.ts`

### 4.1 `ApiError` 类

```ts
class ApiError extends Error {
  code: ErrorCode      // 业务错误码枚举
  status: number       // HTTP 状态码（无响应时为 0）
  details?: Record<string, unknown>  // 后端返回的额外信息

  get isAuthError(): boolean     // 401 / Token 过期
  get isNetworkError(): boolean  // 网络断开 / 超时
}
```

### 4.2 错误码 `ErrorCode`

| 错误码 | 含义 | 触发场景 |
|--------|------|----------|
| `NETWORK_ERROR` | 网络异常 | 无响应 |
| `TIMEOUT` | 请求超时 | 超过 `timeout` 配置 |
| `CANCELLED` | 请求取消 | 主动 abort |
| `UNAUTHORIZED` | 未认证 | HTTP 401 |
| `TOKEN_EXPIRED` | Token 过期 | 预留，业务层可依据后端特定 code 触发 |
| `FORBIDDEN` | 无权限 | HTTP 403 |
| `NOT_FOUND` | 资源不存在 | HTTP 404 |
| `CONFLICT` | 资源冲突 | HTTP 409 |
| `VALIDATION_ERROR` | 参数校验失败 | HTTP 422 |
| `RATE_LIMITED` | 限流 | HTTP 429 |
| `SERVER_ERROR` | 服务器错误 | HTTP 5xx |
| `UNKNOWN` | 未知错误 | 其他 |

### 4.3 全局错误处理器

默认行为是 console 输出。可在应用初始化时替换为接入 UI 通知：

```ts
import { setGlobalErrorHandler, ApiError, ErrorCode } from '@/services'
import { toast } from 'your-toast-library'

setGlobalErrorHandler((error: ApiError) => {
  if (error.isAuthError) {
    toast.error('登录已过期，请重新登录')
    // 跳转登录页
    return
  }
  if (error.code === ErrorCode.RATE_LIMITED) {
    toast.warning('操作过于频繁，请稍后再试')
    return
  }
  toast.error(error.message)
})
```

---

## 五、使用示例

### 5.1 基本调用

```ts
// Phase 2 示例 — auth.service.ts
import authService from '@/services/auth.service'
import requestService from '@/services/request.service'

async function handleLogin(phone: string, code: string) {
  const res = await authService.login({ phone, code })
  const { accessToken, user } = res.data.data

  requestService.setToken(accessToken)
  // 更新用户状态...
}
```

### 5.2 带错误处理

```ts
// Phase 2 示例 — orders.service.ts
import ordersService from '@/services/orders.service'
import { ApiError, ErrorCode } from '@/services/error.service'

async function loadOrders() {
  try {
    const res = await ordersService.getOrders({ page: 1, pageSize: 10 })
    return res.data.data
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.code === ErrorCode.UNAUTHORIZED) {
        // 引导用户登录
      } else if (err.code === ErrorCode.NOT_FOUND) {
        // 显示空状态
      }
      // 其他错误已被全局处理器处理
    }
    return null
  }
}
```

### 5.3 路径参数替换

对于包含 `:id` 占位符的端点，API 方法内部已自动替换：

```ts
// orders.ts 内部实现
export function getOrderDetail(id: string) {
  const url = endpoints.detail.replace(':id', id)
  return get<Order>(url)
}

// 调用方（Phase 2）
await getOrderDetail('order_abc123')
// 实际请求: GET /api/v1/orders/order_abc123
```

---

## 六、后端响应约定

所有后端接口应返回统一 JSON 结构：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

错误响应：

```json
{
  "code": "VALIDATION_ERROR",
  "message": "手机号格式不正确",
  "details": {
    "field": "phone",
    "constraint": "isMobilePhone"
  }
}
```

---

## 七、开发环境代理配置

当前 `vite.config.ts` 未配置代理。如需避免跨域，可在 `vite.config.ts` 中补充：

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 八、扩展指南

### 新增一个 API 模块

1. 在 `src/configs/requests.json` 的 `endpoints` 中添加路径
2. 在 `src/services/` 下创建新 `*.service.ts` 文件（如 `charts.service.ts`）
3. 使用 `get<T>` / `post<T>` 等方法，传入 endpoint 路径
4. 完成，可在业务组件中通过 `import { getCharts } from '@/services/charts.service'` 使用

### 需要请求取消（如搜索防抖）

```ts
import requestService from '@/services/request.service'

const controller = new AbortController()

requestService.httpClient.get('/search', {
  params: { q: keyword },
  signal: controller.signal,
})

// 取消请求
controller.abort()
```

### 需要文件上传

```ts
import requestService from '@/services/request.service'

const formData = new FormData()
formData.append('file', file)

await requestService.post('/media/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
    setProgress(percent)
  },
})
```
