/**
 * 客户端状态管理 store
 * 使用 Zustand 管理轻量级客户端状态
 */

import { create } from 'zustand'
import type { User, Membership } from '@/types'

interface AuthState {
  user: User | null
  membership: Membership | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setMembership: (membership: Membership | null) => void
  setIsLoading: (isLoading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  membership: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setMembership: (membership) => set({ membership }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, membership: null }),
}))

/**
 * UI 状态管理
 */
interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
