import { LANGUAGES, DEFAULT_LANGUAGE_CODE, LOCAL_STORAGE_KEYS } from '@/constants/const';
import localStorageService from '@/services/localStorage.service';

import type { LanguageCode, Language } from '@/types/common.type';

export function getLanguageCode(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE_CODE;
  const saved = localStorageService.get<LanguageCode>(LOCAL_STORAGE_KEYS.LANGUAGE, DEFAULT_LANGUAGE_CODE);
  return saved in LANGUAGES ? saved : DEFAULT_LANGUAGE_CODE;
}

export function getLanguage(): Language {
  return LANGUAGES[getLanguageCode()];
}

export function saveLanguageCode(code: LanguageCode): void {
  localStorageService.set<LanguageCode>(LOCAL_STORAGE_KEYS.LANGUAGE, code);
}
