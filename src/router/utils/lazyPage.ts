import type { AppRouteObject } from '../types';
import { LOCAL_STORAGE_KEYS } from '@/constants/const';

/**
 * Creates a lazy route loader compatible with React Router's `lazy` property.
 * Wraps dynamic imports to extract the default export as `Component`.
 *
 * If the dynamic import fails (typical after a deployment when an old tab
 * requests a chunk with a stale hash), we attempt a single page reload using
 * `sessionStorage` as a guard to prevent an infinite reload loop. If the reload
 * has already been attempted in this session, the error is re-thrown so it can
 * reach the route `errorElement`.
 */
export function lazyPage(
  importFn: () => Promise<{ default: React.ComponentType }>
): NonNullable<AppRouteObject['lazy']> {
  return async () => {
    try {
      const module = await importFn();
      return { Component: module.default };
    } catch (error) {
      const alreadyRetried = sessionStorage.getItem(LOCAL_STORAGE_KEYS.CHUNK_RETRY) === '1';

      if (!alreadyRetried) {
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.CHUNK_RETRY, '1');
        window.location.reload();
        // Return a never-resolving promise so React Router stays in a loading
        // state until the reload completes.
        return new Promise(() => {});
      }

      throw error;
    }
  };
}
