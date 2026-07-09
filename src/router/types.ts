import type { RouteObject } from 'react-router-dom';

/**
 * React Router v7 officially supports arbitrary route-level data through the
 * `handle` property. It is surfaced by `useMatches()` at runtime, unlike custom
 * fields such as `meta` which are stripped by the router.
 */
export interface RouteHandle {
  /** Page title i18n key. Consumed by `useRouteTitle()` to update `document.title`. */
  title?: string
  /** 
   * Marks a route that requires authentication.
   * Actual interception is still performed by wrapping the route element with `<AuthGuard>`. 
   */
  requireAuth?: boolean
  /** When true, the global `Navbar` is hidden on this route. */
  hideNavbar?: boolean
  /** When true, the global `Footer` is hidden on this route. */
  hideFooter?: boolean
}

export type AppRouteObject = RouteObject & {
  handle?: RouteHandle
  children?: AppRouteObject[]
}
