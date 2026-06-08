import { useTranslation } from 'react-i18next'
import i18n, { loadLocale } from '@/i18n'
import type { Locale } from '@/i18n'

/**
 * Convenience hook wrapping react-i18next.
 * Usage:
 *   const { t, locale, setLocale } = useI18n('home')
 */
export function useI18n(ns?: string | string[]) {
  const { t } = useTranslation(ns)

  const locale = (i18n.language || 'zh-CN') as Locale

  const setLocale = async (newLocale: Locale) => {
    await loadLocale(newLocale)
    await i18n.changeLanguage(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  return { t, locale, setLocale }
}
