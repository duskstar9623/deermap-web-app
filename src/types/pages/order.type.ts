/** Order & payment types */

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type OrderType =
  | 'basic_chart'       // Basic charting (per use)
  | 'membership'        // Membership purchase
  | 'custom_chart'      // Custom charting
  | 'paper_service'     // Paper service
  | 'bioinformatics'    // Bioinformatics service
  | 'consulting'        // Industry consulting

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
