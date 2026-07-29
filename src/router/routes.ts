import { createElement } from 'react';
import RootLayout from '@/components/layout/RootLayout';
import RouteErrorBoundary from '@/pages/RouteError';
import ROUTES from './paths';
import lazyPage from './utils/lazyPage';
import { multiomicsRoutes } from './modules/multiomics';
import { visualizationRoutes } from './modules/visualization';

import type { AppRouteObject } from './types';

const singlePageRoutes: AppRouteObject[] = [
  // Home page
  {
    path: ROUTES.Home,
    lazy: lazyPage(() => import('@/pages/Home')),
  },
  // Bioinformatics analysis page
  {
    path: ROUTES.Bioinformatics,
    lazy: lazyPage(() => import('@/pages/Bioinformatics')),
    handle: { title: 'nav.services' }
  },
  // Academic page
  {
    path: ROUTES.Academic,
    lazy: lazyPage(() => import('@/pages/Academic')),
    handle: { title: 'nav.academic' }
  },
  // Pricing page
  {
    path: ROUTES.Pricing,
    lazy: lazyPage(() => import('@/pages/Pricing')),
    handle: { title: 'nav.pricing' }
  },
  // Contact page
  {
    path: ROUTES.Contact,
    lazy: lazyPage(() => import('@/pages/Contact')),
    handle: { title: 'nav.contact' }
  }
];

const appRoutes: AppRouteObject[] = [
  {
    element: createElement(RootLayout),
    errorElement: createElement(RouteErrorBoundary),
    children: [
      ...singlePageRoutes,
      visualizationRoutes,
      multiomicsRoutes,
      // 404 Not Found route
      {
        path: '*',
        lazy: lazyPage(() => import('@/pages/NotFound')),
        handle: { title: 'Errors:404.title' }
      },
    ],
  },
];

export default appRoutes;
