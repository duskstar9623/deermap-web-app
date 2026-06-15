import { useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { loadLanguage } from '@/i18n';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/constants/const';

export type { LanguageCode } from '@/constants/const';

/**
 * Wraps the app with react-i18next's I18nextProvider.
 * On mount, if the persisted language is not the default, lazy-loads its resources.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('lang') as LanguageCode | null;
    if (saved && saved !== DEFAULT_LANGUAGE && (saved === LANGUAGES.zh || saved === LANGUAGES.en)) {
      loadLanguage(saved).then(() => i18n.changeLanguage(saved));
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
