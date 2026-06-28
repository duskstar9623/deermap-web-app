import { LANGUAGES, LANGUAGE_NAMESPACES } from '@/constants/const';
import { THEME } from '@/constants/const';

/*** Language Toggle Related ***/
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type LanguageCode = keyof typeof LANGUAGES;
export type LanguageNamespace = (typeof LANGUAGE_NAMESPACES)[keyof typeof LANGUAGE_NAMESPACES];

/*** Theme Feature Related ***/
export type Theme = (typeof THEME)[keyof typeof THEME];
