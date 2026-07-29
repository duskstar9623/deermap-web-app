import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { THEME, LOCAL_STORAGE_KEYS } from '@/constants/const';
import localStorageService from '@/services/localStorage.service';
import { ThemeContext } from './context/theme.context';
import { isBrowser } from '@/utils/common';

import type { Theme } from '@/types/common';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme state, use user's preferred first and default to LIGHT if none exists.
  const [theme, setTheme] = useState<Theme>(() => {
    if (!isBrowser()) return THEME.LIGHT;
    return localStorageService.get<Theme>(LOCAL_STORAGE_KEYS.THEME, THEME.LIGHT);
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorageService.set<Theme>(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Memoize the toggleTheme function to avoid creating a new function instance on every render.
  const toggleTheme = useCallback(
    () => setTheme((prev: Theme) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)),
    []
  );
  // Memoize the value object to avoid creating a new object instance on every render,
  // Reducing unnecessary re-renders.
  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
