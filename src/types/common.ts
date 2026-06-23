import { LANGUAGES, LANGUAGE_NAMESPACES } from '@/constants/const';
import { THEME } from '@/constants/const';

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type LanguageCode = keyof typeof LANGUAGES;
export type LanguageNamespace = (typeof LANGUAGE_NAMESPACES)[number];

export type Theme = (typeof THEME)[keyof typeof THEME];
