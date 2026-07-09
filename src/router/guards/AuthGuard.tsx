import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { ROUTES } from '../paths';

/**
 * Route-level auth guard.
 * Wrap protected route elements with this component.
 *
 * Usage in routes.tsx:
 *   element: <AuthGuard><ProtectedPage /></AuthGuard>
 *
 * Future protected routes should also set `handle: { requireAuth: true }` so
 * that UI layers (badges, breadcrumbs, page metadata) can indicate the
 * authentication requirement. The actual access control remains the explicit
 * `<AuthGuard>` wrapper above.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <>{children}</>;
}
