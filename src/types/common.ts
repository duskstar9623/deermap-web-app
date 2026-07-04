import { LANGUAGES, LANGUAGE_NAMESPACES, THEME } from '@/constants/const';

/*** Language Toggle Related ***/
export type Language = keyof typeof LANGUAGES;
export type LanguageNamespace = (typeof LANGUAGE_NAMESPACES)[keyof typeof LANGUAGE_NAMESPACES];

/*** Theme Feature Related ***/
export type Theme = (typeof THEME)[keyof typeof THEME];
