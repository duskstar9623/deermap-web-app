import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/app/RootLayout'
import { visualizationRoutes } from '@/pages/visualization/routes'
import { multiomicsRoutes } from '@/pages/multiomics/routes'
import { lazyPage } from './utils'
import type { AppRouteObject } from './types'

const simplePages: AppRouteObject[] = [
  { path: '/', lazy: lazyPage(() => import('@/pages/home')) },
  { path: '/services', lazy: lazyPage(() => import('@/pages/services')) },
  { path: '/academic', lazy: lazyPage(() => import('@/pages/academic')) },
  { path: '/pricing', lazy: lazyPage(() => import('@/pages/pricing')) },
  { path: '/contact', lazy: lazyPage(() => import('@/pages/contact')) },
]

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...simplePages,
      visualizationRoutes,
      multiomicsRoutes,
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
