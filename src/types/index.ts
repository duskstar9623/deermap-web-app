/**
 * 全局 TypeScript 类型定义
 * 与 NestJS API 类型保持同步
 */

/**
 * 用户信息
 */
export interface User {
  id: string
  phoneNumber: string
  nickname?: string
  avatar?: string
  wechatOpenId?: string
  alipayOpenId?: string
  createdAt: string
  updatedAt: string
}

/**
 * 会员档位枚举
 */
export enum MembershipTier {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

/**
 * 会员信息
 */
export interface Membership {
  id: string
  userId: string
  tier: MembershipTier
  startDate: string
  expiryDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * 订单类型枚举
 */
export enum OrderType {
  BASIC_CHART = 'basic_chart',
  CUSTOM_CHART = 'custom_chart',
  MEMBERSHIP = 'membership',
}

/**
 * 订单信息
 */
export interface Order {
  id: string
  userId: string
  type: OrderType
  status: OrderStatus
  originalPrice: number
  discountAmount?: number
  finalPrice: number
  couponCode?: string
  promotionId?: string
  description?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
}

/**
 * 制图任务状态
 */
export enum ChartJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * 制图任务
 */
export interface ChartJob {
  id: string
  orderId: string
  userId: string
  chartType: string
  inputData: Record<string, unknown>
  status: ChartJobStatus
  outputUrl?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

/**
 * API 响应通用格式
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
