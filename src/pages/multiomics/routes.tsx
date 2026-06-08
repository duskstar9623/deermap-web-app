import { lazyPage } from '@/router/utils'
import type { AppRouteObject } from '@/router/types'

export const multiomicsRoutes: AppRouteObject = {
  path: '/multiomics',
  lazy: lazyPage(() => import('./index')),
  children: [
    { index: true, lazy: lazyPage(() => import('./ListPage')) },
    { path: 'genomics', lazy: lazyPage(() => import('./OmicsDetailPage')) },
    { path: 'transcriptomics', lazy: lazyPage(() => import('./OmicsDetailPage')) },
    { path: 'proteomics', lazy: lazyPage(() => import('./OmicsDetailPage')) },
    { path: 'metabolomics', lazy: lazyPage(() => import('./OmicsDetailPage')) },
  ],
}
