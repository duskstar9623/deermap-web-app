import { createContext } from 'react';
import type { AuthState } from '@/types/business/user';
import type { User } from '@/types/business/user';

export interface AuthContextValue extends AuthState {
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null);
