import { useMemo } from 'react';
import { useMatches } from 'react-router-dom';

import type { RouteHandle } from '../types';

/**
 * Returns the merged `handle` for the current matched route chain.
 *
 * React Router's `useMatches()` only exposes the official `handle` field for
 * route-level custom data. For nested routes, handles are merged from the root
 * down to the leaf, with child values overriding parent values.
 */
export default function useRouteHandle(): RouteHandle {
  const matches = useMatches();

  return useMemo(
    () => matches.reduce<RouteHandle>((merged, match) => {
      const handle = match.handle as RouteHandle | undefined;
      if (handle && typeof handle === 'object') {
        return { ...merged, ...handle };
      }
      return merged;
    }, {}),
    [matches],
  );
}
