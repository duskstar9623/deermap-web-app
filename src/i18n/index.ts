import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_NAMESPACES, DEFAULT_LANGUAGE_NAMESPACE } from '@/constants/const';
import { getInitLanguage, saveLanguage } from '@/utils/language';
import zhCN from './zh-CN';

import type { Language } from '@/types/common';

// Initialize the default language
i18n.use(initReactI18next).init({
  resources: {
    [DEFAULT_LANGUAGE]: zhCN,
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: DEFAULT_LANGUAGE_NAMESPACE,
  ns: Object.values(LANGUAGE_NAMESPACES),
  interpolation: { escapeValue: false },
  react: { useSuspense: true }
});

// Lazy-load entry for all non-default language bundles, e.g. { 'en-US': () => import('./en-US/index.ts') }
const languageBundles = Object.fromEntries(
  (Object.keys(LANGUAGES) as Language[])
    .filter(lang => lang !== DEFAULT_LANGUAGE)
    .map(lang => [lang, () => import(`./${lang}/index.ts`)])
);

/************************ Language Feature Actions ************************/

// Lazily load the entire resource bundle for the specified language (skip if already loaded).
async function loadLanguage(language: Language): Promise<void> {
  if (!(language in LANGUAGES) || language === DEFAULT_LANGUAGE) return;
  if (i18n.hasResourceBundle(language, DEFAULT_LANGUAGE_NAMESPACE)) return;

  const loader = languageBundles[language];
  if (!loader) return;
  const { default: resources } = await loader();
  for (const [ns, bundle] of Object.entries(resources)) {
    i18n.addResourceBundle(language, ns, bundle, false, true);
  }
}

// Unified language switching process: 
// load bundle -> switch language -> persist to localStorage
export async function changeLanguage(language: Language): Promise<void> {
  await loadLanguage(language);
  await i18n.changeLanguage(language);
  saveLanguage(language);
}

// Called at app startup to preload the user's preferred language and avoid first-screen flicker.
export async function initializeI18n(): Promise<void> {
  const initLanguage = getInitLanguage();

  // If the user's preference is not the default language, 
  // Load asynchronously before switching so that the first screen shows the correct language directly.
  if (initLanguage !== DEFAULT_LANGUAGE) {
    await changeLanguage(initLanguage);
  }
}

/**************************************************************************/

export default i18n;
