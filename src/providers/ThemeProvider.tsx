import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { THEME_DARK, THEME_LIGHT, THEME_STORAGE_KEY } from '@/constants/theme';
import { ThemeContext, type Theme } from './theme-context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return THEME_LIGHT;
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || THEME_LIGHT;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme(prev => (prev === THEME_LIGHT ? THEME_DARK : THEME_LIGHT)),
    []
  );

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
