import { lazyPage } from '@/router/utils/lazyPage';
import { ROUTES } from '@/router/paths';
import type { AppRouteObject } from '@/router/types';

export const multiomicsRoutes: AppRouteObject = {
  path: ROUTES.multiomics,
  lazy: lazyPage(() => import('./index')),
  handle: { title: 'nav.multiomics' },
  children: [
    { index: true, lazy: lazyPage(() => import('./ListPage')), handle: { title: 'nav.multiomics' } },
    { path: 'genomics', lazy: lazyPage(() => import('./OmicsDetailPage')), handle: { title: 'Multiomics:omics.genomics.title' } },
    { path: 'transcriptomics', lazy: lazyPage(() => import('./OmicsDetailPage')), handle: { title: 'Multiomics:omics.transcriptomics.title' } },
    { path: 'proteomics', lazy: lazyPage(() => import('./OmicsDetailPage')), handle: { title: 'Multiomics:omics.proteomics.title' } },
    { path: 'metabolomics', lazy: lazyPage(() => import('./OmicsDetailPage')), handle: { title: 'Multiomics:omics.metabolomics.title' } },
  ],
};
