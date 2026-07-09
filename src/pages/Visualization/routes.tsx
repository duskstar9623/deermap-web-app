import { lazyPage } from '@/router/utils/lazyPage';
import { ROUTES } from '@/router/paths';
import type { AppRouteObject } from '@/router/types';

export const visualizationRoutes: AppRouteObject = {
  path: ROUTES.visualization,
  lazy: lazyPage(() => import('./index')),
  handle: { title: 'nav.visualization' },
  children: [
    { index: true, lazy: lazyPage(() => import('./ListPage')), handle: { title: 'nav.visualization' } },
    { path: 'chart-tool', lazy: lazyPage(() => import('./ChartToolPage')), handle: { title: 'footer.chartTool' } },
  ],
};
