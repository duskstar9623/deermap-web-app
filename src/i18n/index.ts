import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/constants/const';
import zhCN from './zh-CN';

export const defaultNS = 'common';
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
  'errors',
] as const;

export type Locale = LanguageCode;
export type Namespace = (typeof namespaces)[number];

function getSavedLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const saved = localStorage.getItem('lang');
  return saved === LANGUAGES.zh || saved === LANGUAGES.en ? saved : DEFAULT_LANGUAGE;
}

const savedLanguage = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    [DEFAULT_LANGUAGE]: zhCN,
  },
  lng: savedLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS,
  ns: namespaces as unknown as string[],
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Lazily load a language's resources and register them into i18next.
 * zh-CN is already loaded synchronously; only en-US requires a network round-trip.
 */
export async function loadLanguage(language: LanguageCode): Promise<void> {
  if (language === DEFAULT_LANGUAGE) return;
  if (i18n.hasResourceBundle(language, defaultNS)) return;

  const { default: resources } = await import('./en-US');
  for (const [ns, bundle] of Object.entries(resources)) {
    i18n.addResourceBundle(language, ns, bundle, true, false);
  }
}

// Keep legacy alias for backward compatibility.
export const loadLocale = loadLanguage;

export default i18n;
