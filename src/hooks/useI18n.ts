import { useTranslation } from 'react-i18next';
import i18n, { loadLanguage } from '@/i18n';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/constants/const';
import type { Language } from '@/types/common';

/**
 * Convenience hook wrapping react-i18next.
 * Usage:
 *   const { t, language, setLanguage } = useI18n('home')
 */
export function useI18n(ns?: string | string[]) {
  const { t } = useTranslation(ns);

  const language = (i18n.language || DEFAULT_LANGUAGE) as Language;

  const setLanguage = async (newLanguage: Language) => {
    if (newLanguage !== LANGUAGES.zh && newLanguage !== LANGUAGES.en) return;
    await loadLanguage(newLanguage);
    await i18n.changeLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage);
  };

  // Keep legacy aliases for backward compatibility.
  const locale = language;
  const setLocale = setLanguage;

  return { t, language, setLanguage, locale, setLocale };
}
