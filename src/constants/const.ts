/**
 * Global Application Constants.
 */

/*** Language Toggle Related ***/
export const LANGUAGES = {
  'zh-CN': { label: '简体中文', shortLabel: '中', value: 'zh-CN' },
  'en-US': { label: 'English', shortLabel: 'EN', value: 'en-US' }
} as const;

export const LANGUAGE_NAMESPACES = {
  GLOBAL:         'Global',
  HOME:           'Home',
  BIOINFORMATICS: 'Bioinformatics',
  VISUALIZATION:  'Visualization',
  MULTIOMICS:     'Multiomics',
  ACADEMIC:       'Academic',
  PRICING:        'Pricing',
  CONSULTING:     'Consulting',
  CONTACT:        'Contact',
  ERRORS:         'Errors'
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES['zh-CN'].value;
export const DEFAULT_LANGUAGE_NAMESPACE = LANGUAGE_NAMESPACES.GLOBAL;

/*** Theme Feature Related ***/
export const THEME = { LIGHT: 'light', DARK: 'dark' } as const;
export const THEME_COLORS = {
  primary: '#1a1f71',
  primaryLight: '#4b5bab',
  primaryDark: '#0f1244',
  accent: '#6366f1',
  accentLight: '#8b5cf6',
  genomics: '#1a1f71',
  transcriptomics: '#c0392b',
  proteomics: '#6c5ce7',
  metabolomics: '#00b894',
} as const;

/*** Services Related ***/
export const DEERMAP_STORAGE_PREFIX = 'deermap';

/*** Others ***/
export const LOCAL_STORAGE_KEYS = {
  THEME: `${DEERMAP_STORAGE_PREFIX}_theme`,
  LANGUAGE: `${DEERMAP_STORAGE_PREFIX}_language`,
  CHUNK_RETRY: `${DEERMAP_STORAGE_PREFIX}_chunk_retry`,
  ACCESS_TOKEN: `${DEERMAP_STORAGE_PREFIX}_jwt_token`
} as const;
