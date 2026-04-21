/**
 * 自定义 React Hooks
 */

'use client'

import { useCallback } from 'react'
import { useAuthStore } from '@/store'

/**
 * 使用用户信息 Hook
 */
export const useUser = () => {
  const { user, setUser, setIsLoading } = useAuthStore()

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setUser, setIsLoading])

  return { user, fetchUser }
}

/**
 * 检查用户登录状态 Hook
 */
export const useIsAuthenticated = () => {
  const { user } = useAuthStore()
  return !!user
}

/**
 * 获取会员信息 Hook
 */
export const useMembership = () => {
  const { membership, setMembership } = useAuthStore()

  const fetchMembership = useCallback(async () => {
    try {
      const response = await fetch('/api/user/membership')
      if (response.ok) {
        const data = await response.json()
        setMembership(data)
      }
    } catch (error) {
      console.error('Failed to fetch membership:', error)
    }
  }, [setMembership])

  return { membership, fetchMembership }
}
