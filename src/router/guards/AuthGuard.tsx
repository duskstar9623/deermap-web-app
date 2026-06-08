import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { ReactNode } from 'react'
import { ROUTES } from '../routes'

/**
 * Route-level auth guard.
 * Wrap protected route elements with this component.
 *
 * Usage in routes.tsx:
 *   element: <AuthGuard><ProtectedPage /></AuthGuard>
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}
