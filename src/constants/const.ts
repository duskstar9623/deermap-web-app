/**
 * Global application constants.
 */

export enum LANGUAGES {
  zh = 'zh-CN',
  en = 'en-US',
}

export type LanguageCode = `${LANGUAGES}`;

export const DEFAULT_LANGUAGE: LanguageCode = LANGUAGES.zh;

export const LANGUAGE_LABELS: Record<LanguageCode, { label: string; shortLabel: string }> = {
  [LANGUAGES.zh]: { label: '中文', shortLabel: '中' },
  [LANGUAGES.en]: { label: 'English', shortLabel: 'En' },
};
