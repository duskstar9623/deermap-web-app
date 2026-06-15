import { useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types/user';
import type { AuthState } from '@/types/user';
import { AuthContext } from './auth-context';

/**
 * Auth provider skeleton.
 * Current implementation: always unauthenticated.
 * Future: integrate with backend auth API (JWT / session).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback((user: User) => {
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
