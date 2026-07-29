import type { RouteObject } from 'react-router-dom';

/**
 * React Router V7 mounts arbitrary custom data on the route through `handle` property.
 * At runtime, it can be read through `useMatches()` hook.
 */
export interface RouteHandle {
  // Page title i18n key, consumed by `useRouteTitle()` to update `document.title`.
  title?: string
  // Marks a route that requires authentication.
  // Actual interception is still performed by wrapping the route element with `<AuthGuard>`.
  requireAuth?: boolean
  // When true, the global `Navbar` is hidden on this route.
  hideNavbar?: boolean
  // When true, the global `Footer` is hidden on this route.
  hideFooter?: boolean
}

export type AppRouteObject = RouteObject & {
  handle?: RouteHandle
  children?: AppRouteObject[]
}
