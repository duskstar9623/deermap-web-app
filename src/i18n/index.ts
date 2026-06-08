import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './zh-CN'

export const defaultNS = 'common'

export const namespaces = [
  'common',
  'home',
  'services',
  'visualization',
  'multiomics',
  'academic',
  'pricing',
  'industry-consulting',
  'contact',
] as const

export type Namespace = (typeof namespaces)[number]
export type Locale = 'zh-CN' | 'en-US'

const savedLocale = (typeof window !== 'undefined'
  ? localStorage.getItem('locale')
  : null) as Locale | null

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': zhCN,
  },
  lng: savedLocale || 'zh-CN',
  fallbackLng: 'zh-CN',
  defaultNS,
  ns: namespaces as unknown as string[],
  interpolation: {
    escapeValue: false,
  },
})

/**
 * Lazily load a locale's resources and register them into i18next.
 * zh-CN is already loaded synchronously; only en-US requires a network round-trip.
 */
export async function loadLocale(locale: Locale): Promise<void> {
  if (locale === 'zh-CN') return
  if (i18n.hasResourceBundle(locale, 'common')) return

  const { default: resources } = await import('./en-US')
  for (const [ns, bundle] of Object.entries(resources)) {
    i18n.addResourceBundle(locale, ns, bundle, true, false)
  }
}

export default i18n
