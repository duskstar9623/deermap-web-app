import { LANGUAGES, DEFAULT_LANGUAGE, LOCAL_STORAGE_KEYS } from '@/constants/const';
import localStorageService from '@/services/localStorage.service';
import { isBrowser } from '@/utils/common';

import type { Language } from '@/types/common';

export function getInitLanguage(): Language {
  if (!isBrowser()) return DEFAULT_LANGUAGE;
  const savedLanguage = localStorageService.get<Language>(LOCAL_STORAGE_KEYS.LANGUAGE, DEFAULT_LANGUAGE);
  return savedLanguage in LANGUAGES ? savedLanguage : DEFAULT_LANGUAGE;
}

export function saveLanguage(language: Language): void {
  localStorageService.set<Language>(LOCAL_STORAGE_KEYS.LANGUAGE, language);
}
