import { LANGUAGES, DEFAULT_LANGUAGE_CODE } from '@/constants/const';
import { LanguageCode, Language } from '@/types';

const STORAGE_KEY = 'deermap_language';

export function getLanguageCode(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE_CODE;
  const saved = localStorage.getItem(STORAGE_KEY) || '';
  return saved in LANGUAGES ? (saved as LanguageCode) : DEFAULT_LANGUAGE_CODE;
}

export function getLanguage(): Language {
  return LANGUAGES[getLanguageCode()];
}

export function saveLanguageCode(code: LanguageCode): void {
  localStorage.setItem(STORAGE_KEY, code);
}
