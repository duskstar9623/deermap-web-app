import type { RouteObject } from 'react-router-dom'

/**
 * Extended route configuration with metadata.
 * Uses RouteObject as base to maintain full compatibility with createBrowserRouter.
 */
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
}

export type AppRouteObject = RouteObject & {
  meta?: RouteMeta
  children?: AppRouteObject[]
}
