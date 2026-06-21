/**
 * Global Application Constants.
 */

/** Language Toggle Related */
export const LANGUAGES = {
  zh: 'zh-CN',
  en: 'en-US'
} as const;

export const LANGUAGE_NAMESPACES = [
  'Global', 'Home', 'Bioinformatics', 'Visualization', 'Multiomics',
  'Academic', 'Pricing', 'Consulting', 'Contact', 'Errors',
] as const;

export const DEFAULT_LANGUAGE_CODE = 'zh';
export const DEFAULT_LANGUAGE = LANGUAGES.zh;
export const DEFAULT_LANGUAGE_NAMESPACE = LANGUAGE_NAMESPACES[0];

export const LANGUAGE_OPTIONS = {
  [LANGUAGES.zh]: {
    label: '简体中文',
    shortLabel: '中',
    value: Object.keys(LANGUAGES)[0]
  },
  [LANGUAGES.en]: {
    label: 'English',
    shortLabel: 'EN',
    value: Object.keys(LANGUAGES)[1]
  }
};
