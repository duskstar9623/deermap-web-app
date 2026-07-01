/** Order & payment types */

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type OrderType =
  | 'basic_chart'       // 基础制图（按次）
  | 'membership'        // 会员购买
  | 'custom_chart'      // 个性化制图
  | 'paper_service'     // 论文业务
  | 'bioinformatics'    // 生信业务
  | 'consulting'        // 行业咨询

export type PaymentMethod = 'wechat' | 'alipay'

export interface Order {
  id: string
  userId: string
  type: OrderType
  status: OrderStatus
  title: string
  description: string
  originalPrice: number
  discountAmount: number
  finalPrice: number
  couponCode?: string
  promotionId?: string
  paymentMethod?: PaymentMethod
  deliveryUrl?: string        // OSS signed URL for deliverables
  deliveryExpiresAt?: string  // ISO date
  createdAt: string
  paidAt?: string
  completedAt?: string
}
