/**
 * Centralized route path constants.
 * All navigation across the app should reference these paths.
 */
export const ROUTES = {
  home: '/',
  services: '/services',
  visualization: '/visualization',
  chartTool: '/visualization/chart-tool',
  multiomics: '/multiomics',
  genomics: '/multiomics/genomics',
  transcriptomics: '/multiomics/transcriptomics',
  proteomics: '/multiomics/proteomics',
  metabolomics: '/multiomics/metabolomics',
  academic: '/academic',
  pricing: '/pricing',
  contact: '/contact',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
