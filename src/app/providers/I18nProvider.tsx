import { useEffect, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { loadLocale, type Locale } from '@/i18n'

export type { Locale } from '@/i18n'

/**
 * Wraps the app with react-i18next's I18nextProvider.
 * On mount, if the persisted locale is en-US, lazy-loads its resources.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && saved !== 'zh-CN') {
      loadLocale(saved).then(() => i18n.changeLanguage(saved))
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
