import i18n, { changeLanguage } from '@/i18n';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/constants/const';

import type { Language } from '@/types/common';

/**
 * Convenience hook wrapping react-i18next.
 * Usage: const { language, setLanguage } = useI18n()
 */
export default function useI18n() {
  const currentLanguage = (i18n.resolvedLanguage || DEFAULT_LANGUAGE) as Language;
  const setLanguage = async (newLanguage: Language) => {
    if (!(newLanguage in LANGUAGES)) return;
    await changeLanguage(newLanguage);
  };

  return { currentLanguage, setLanguage };
}
