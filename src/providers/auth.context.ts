import { createContext } from 'react';
import type { AuthState } from '@/types/pages/user.type';
import type { User } from '@/types/pages/user.type';

export interface AuthContextValue extends AuthState {
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null);
