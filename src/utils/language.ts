import { LANGUAGES, DEFAULT_LANGUAGE_CODE, LOCAL_STORAGE_KEYS } from '@/constants/const';
import type { LanguageCode, Language } from '@/types/common.type';
import { localStorageService } from '@/services/localStorage.service';

export function getLanguageCode(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE_CODE;
  const saved = localStorageService.get<string>(LOCAL_STORAGE_KEYS.LANGUAGE, '');
  return saved in LANGUAGES ? (saved as LanguageCode) : DEFAULT_LANGUAGE_CODE;
}

export function getLanguage(): Language {
  return LANGUAGES[getLanguageCode()];
}

export function saveLanguageCode(code: LanguageCode): void {
  localStorageService.set(LOCAL_STORAGE_KEYS.LANGUAGE, code);
}
