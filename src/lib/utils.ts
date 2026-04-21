/**
 * Generate device fingerprint for guest user identification
 */
export async function generateFingerprint(): Promise<string> {
  try {
    const { FingerprintJS } = await import('@fingerprintjs/fingerprintjs')
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    return result.visitorId
  } catch (error) {
    console.error('Failed to generate fingerprint:', error)
    // Fallback to simple localStorage-based identifier
    return getLocalStorageFallback()
  }
}

function getLocalStorageFallback(): string {
  const key = 'bio_device_id'
  let deviceId = typeof window !== 'undefined' ? localStorage.getItem(key) : null

  if (!deviceId) {
    deviceId = 'guest-' + Math.random().toString(36).substr(2, 9)
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, deviceId)
    }
  }

  return deviceId
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate phone number (Chinese format)
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone.replace(/\D/g, ''))
}

/**
 * Get remaining free charts for guest user
 */
export function getRemainingFreeCharts(usedToday: number): number {
  const FREE_CHARTS_PER_DAY = 1
  return Math.max(0, FREE_CHARTS_PER_DAY - usedToday)
}
