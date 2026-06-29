/** User & authentication types */

export type MembershipTier = 'free' | 'daily' | 'monthly' | 'quarterly' | 'yearly'

export interface User {
  id: string
  phone: string
  nickname: string
  avatar?: string
  wechatBound: boolean
  membership: {
    tier: MembershipTier
    expiresAt: string | null // ISO date string
  }
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
