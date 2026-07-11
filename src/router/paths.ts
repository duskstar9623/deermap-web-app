/**
 * Route constants configuration hub
 * Note: nested child routes must use relative paths and cannot start with '/'
 */
import type { RecursiveRoutePath } from '@/types/util';

const ROUTES = {
  Home: '/',
  Bioinformatics: '/bioinfo-analysis',
  Multiomics: {
    Root: '/multiomics',
    Genomics: 'genomics',
    Transcriptomics: 'transcriptomics',
    Proteomics: 'proteomics',
    Metabolomics: 'metabolomics',
  },
  Visualization: {
    Root: '/visualization',
    ChartTool: 'chart',
    CustomVisualization: 'custom-draw',
  },
  Academic: '/academic',
  Pricing: '/pricing',
  Contact: '/contact',
} as const;

export type RoutePath = RecursiveRoutePath<typeof ROUTES>;
export default ROUTES;
