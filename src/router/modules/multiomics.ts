import lazyPage from '@/router/utils/lazyPage';
import ROUTES from '@/router/paths';

import type { AppRouteObject } from '@/router/types';

export const multiomicsRoutes: AppRouteObject = {
  path: ROUTES.Multiomics.Root,
  lazy: lazyPage(() => import('@/pages/Multiomics')),
  handle: { title: 'nav.multiomics' },
  children: [
    {
      index: true,
      lazy: lazyPage(() => import('@/pages/Multiomics/ListPage')),
      handle: { title: 'nav.multiomics' }
    },
    {
      path: ROUTES.Multiomics.Genomics,
      lazy: lazyPage(() => import('@/pages/Multiomics/OmicsDetailPage')),
      handle: { title: 'Multiomics:omics.genomics.title' }
    },
    {
      path: ROUTES.Multiomics.Transcriptomics,
      lazy: lazyPage(() => import('@/pages/Multiomics/OmicsDetailPage')),
      handle: { title: 'Multiomics:omics.transcriptomics.title' }
    },
    {
      path: ROUTES.Multiomics.Proteomics,
      lazy: lazyPage(() => import('@/pages/Multiomics/OmicsDetailPage')),
      handle: { title: 'Multiomics:omics.proteomics.title' }
    },
    {
      path: ROUTES.Multiomics.Metabolomics,
      lazy: lazyPage(() => import('@/pages/Multiomics/OmicsDetailPage')),
      handle: { title: 'Multiomics:omics.metabolomics.title' }
    },
  ],
};
