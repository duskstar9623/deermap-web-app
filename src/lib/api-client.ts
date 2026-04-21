import type { ApiResponse } from '@/types'

const API_BASE = process.env.NESTJS_API_URL || 'http://localhost:3001'

/**
 * Generic API client for calling NestJS backend
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fetch chart types available
 */
export async function getChartTypes() {
  return apiCall('/charts/types')
}

/**
 * Create new order
 */
export async function createOrder(data: unknown) {
  return apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string) {
  return apiCall(`/orders?userId=${userId}`)
}

/**
 * Check guest chart limit
 */
export async function checkGuestChartLimit(fingerprint: string) {
  return apiCall('/charts/guest-limit', {
    method: 'POST',
    body: JSON.stringify({ fingerprint }),
  })
}
