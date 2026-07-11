import { lazyPage } from '@/router/utils/lazyPage';
import ROUTES from '@/router/paths';
import type { AppRouteObject } from '@/router/types';

export const visualizationRoutes: AppRouteObject = {
  path: ROUTES.Visualization.Root,
  lazy: lazyPage(() => import('@/pages/Visualization')),
  handle: { title: 'nav.visualization' },
  children: [
    { index: true, lazy: lazyPage(() => import('@/pages/Visualization/ListPage')), handle: { title: 'nav.visualization' } },
    { path: ROUTES.Visualization.ChartTool, lazy: lazyPage(() => import('@/pages/Visualization/ChartToolPage')), handle: { title: 'footer.chartTool' } },
  ],
};
