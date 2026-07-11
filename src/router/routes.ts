import { createElement } from 'react';
import RootLayout from '@/components/layout/RootLayout';
import RouteErrorBoundary from '@/pages/RouteError';
import ROUTES from './paths';
import { lazyPage } from './utils/lazyPage';

import { multiomicsRoutes } from '@/router/modules/multiomics';
import { visualizationRoutes } from '@/router/modules/visualization';

import type { AppRouteObject } from './types';

export { default as ROUTES } from './paths';
export type { RoutePath } from './paths';

const pageRoutes: AppRouteObject[] = [
  { path: ROUTES.Home, lazy: lazyPage(() => import('@/pages/Home')), handle: { title: 'nav.home' } },
  { path: ROUTES.Bioinformatics, lazy: lazyPage(() => import('@/pages/Bioinformatics')), handle: { title: 'nav.services' } },
  { path: ROUTES.Academic, lazy: lazyPage(() => import('@/pages/Academic')), handle: { title: 'nav.academic' } },
  { path: ROUTES.Pricing, lazy: lazyPage(() => import('@/pages/Pricing')), handle: { title: 'nav.pricing' } },
  { path: ROUTES.Contact, lazy: lazyPage(() => import('@/pages/Contact')), handle: { title: 'nav.contact' } },
];

const appRoutes: AppRouteObject[] = [
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

export default appRoutes;
