/**
 * API 错误类型定义与统一错误处理
 */

/** 后端标准错误响应结构 */
export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

/** 业务错误码枚举 */
export enum ErrorCode {
  // 通用
  UNKNOWN = 'UNKNOWN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',

  // 认证相关
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  FORBIDDEN = 'FORBIDDEN',

  // 业务相关
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
}

/** 统一的 API 错误类 */
export class ApiError extends Error {
  readonly code: ErrorCode
  readonly status: number
  readonly details?: Record<string, unknown>

  constructor(
    code: ErrorCode,
    message: string,
    status: number = 0,
    details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }

  /** 是否为认证错误（需要重新登录） */
  get isAuthError(): boolean {
    return this.code === ErrorCode.UNAUTHORIZED || this.code === ErrorCode.TOKEN_EXPIRED
  }

  /** 是否为网络层错误 */
  get isNetworkError(): boolean {
    return this.code === ErrorCode.NETWORK_ERROR || this.code === ErrorCode.TIMEOUT
  }
}

/** HTTP 状态码 → ErrorCode 映射 */
export function mapHttpStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 401:
      return ErrorCode.UNAUTHORIZED
    case 403:
      return ErrorCode.FORBIDDEN
    case 404:
      return ErrorCode.NOT_FOUND
    case 409:
      return ErrorCode.CONFLICT
    case 422:
      return ErrorCode.VALIDATION_ERROR
    case 429:
      return ErrorCode.RATE_LIMITED
    default:
      return status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.UNKNOWN
  }
}

/**
 * 全局错误处理器
 * 可通过 setGlobalErrorHandler 替换默认行为
 */
export type ErrorHandler = (error: ApiError) => void

let globalErrorHandler: ErrorHandler = (error: ApiError) => {
  // 默认行为：控制台输出，实际项目中可接入 toast/notification
  if (error.isAuthError) {
    console.warn('[API] 认证失效，请重新登录', error.message)
  } else if (error.isNetworkError) {
    console.warn('[API] 网络异常', error.message)
  } else {
    console.error('[API] 请求错误', error.code, error.message)
  }
}

export function setGlobalErrorHandler(handler: ErrorHandler): void {
  globalErrorHandler = handler
}

export function getGlobalErrorHandler(): ErrorHandler {
  return globalErrorHandler
}
