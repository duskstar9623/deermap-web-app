import { lazyPage } from '@/router/utils';
import type { AppRouteObject } from '@/router/types';

export const visualizationRoutes: AppRouteObject = {
  path: '/visualization',
  lazy: lazyPage(() => import('./index')),
  children: [
    { index: true, lazy: lazyPage(() => import('./ListPage')) },
    { path: 'chart-tool', lazy: lazyPage(() => import('./ChartToolPage')) },
  ],
};
