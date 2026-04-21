// API Request/Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// User Types
export interface User {
  id: string
  email: string
  phone?: string
  name?: string
  role: 'guest' | 'user' | 'member' | 'admin'
  membershipStatus?: 'free' | 'monthly' | 'yearly'
  membershipExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Chart Types
export interface ChartGenerationRequest {
  chartType: ChartType
  dataFile: File
  options?: ChartOptions
}

export type ChartType =
  | 'heatmap'
  | 'volcano'
  | 'boxplot'
  | 'survival'
  | 'contour'
  | 'ternary'

export interface ChartOptions {
  title?: string
  xLabel?: string
  yLabel?: string
  colors?: string[]
  [key: string]: unknown
}

export interface ChartResult {
  id: string
  type: ChartType
  imageUrl: string
  svgData?: string
  createdAt: Date
  expiresAt: Date
}

// Order Types
export interface Order {
  id: string
  userId: string
  type: 'chart' | 'custom_design' | 'paper_service'
  amount: number
  currency: 'CNY' | 'USD'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  createdAt: Date
  updatedAt: Date
}

// Payload CMS Types
export interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: { url: string }
  ctaText?: string
  ctaUrl?: string
  isActive: boolean
  order: number
}

export interface TeamMember {
  id: string
  name: string
  title?: string
  bio?: string
  avatar?: { url: string }
  email?: string
  order: number
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: { url: string }
  author?: string
  category: 'Industry News' | 'Research Trends' | 'Policy Updates' | 'Case Studies'
  publishedAt: Date
  isPublished: boolean
}

export interface SiteSettings {
  title: string
  description?: string
  logo?: { url: string }
  contactEmail?: string
  contactPhone?: string
  wechatCode?: { url: string }
}
