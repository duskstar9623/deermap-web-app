/**
 * Theme constants for programmatic access.
 * CSS variables are the source of truth; these are for JS-only contexts (e.g. SVG fills, chart libs).
 */
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
