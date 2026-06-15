import type { AppRouteObject } from './types';

/**
 * Creates a lazy route loader compatible with React Router's `lazy` property.
 * Wraps dynamic imports to extract the default export as `Component`.
 */
export function lazyPage(
  importFn: () => Promise<{ default: React.ComponentType }>
): NonNullable<AppRouteObject['lazy']> {
  return async () => {
    const module = await importFn();
    return { Component: module.default };
  };
}
