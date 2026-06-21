import { createContext } from 'react';
import type { AuthState } from '@/types/user';
import type { User } from '@/types/user';

export interface AuthContextValue extends AuthState {
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null);
