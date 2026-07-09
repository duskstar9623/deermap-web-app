import { createElement } from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { multiomicsRoutes } from '@/pages/Multiomics/routes';
import { visualizationRoutes } from '@/pages/Visualization/routes';
import { RouteErrorBoundary } from '@/pages/RouteError';
import { ROUTES } from './paths';
import { lazyPage } from './utils/lazyPage';

import type { AppRouteObject } from './types';

const pageRoutes: AppRouteObject[] = [
  { path: ROUTES.home, lazy: lazyPage(() => import('@/pages/Home')), handle: { title: 'nav.home' } },
  { path: ROUTES.bioinformatics, lazy: lazyPage(() => import('@/pages/Bioinformatics')), handle: { title: 'nav.services' } },
  { path: ROUTES.academic, lazy: lazyPage(() => import('@/pages/Academic')), handle: { title: 'nav.academic' } },
  { path: ROUTES.pricing, lazy: lazyPage(() => import('@/pages/Pricing')), handle: { title: 'nav.pricing' } },
  { path: ROUTES.contact, lazy: lazyPage(() => import('@/pages/Contact')), handle: { title: 'nav.contact' } },
];

export const appRoutes: AppRouteObject[] = [
  {
    element: createElement(RootLayout),
    errorElement: createElement(RouteErrorBoundary),
    children: [
      ...pageRoutes,
      visualizationRoutes,
      multiomicsRoutes,
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFound')), handle: { title: 'Errors:notFound.title' } },
    ],
  },
];

export { ROUTES } from './paths';
export type { RoutePath } from './paths';
