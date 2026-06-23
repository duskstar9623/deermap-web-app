import { createContext } from 'react';
import { THEME_DARK, THEME_LIGHT } from '@/constants/theme';

export type Theme = typeof THEME_LIGHT | typeof THEME_DARK

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
