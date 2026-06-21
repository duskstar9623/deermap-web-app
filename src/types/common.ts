import { LANGUAGES, LANGUAGE_NAMESPACES } from '@/constants/const';

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type LanguageCode = keyof typeof LANGUAGES;
export type LanguageNamespace = (typeof LANGUAGE_NAMESPACES)[number];
