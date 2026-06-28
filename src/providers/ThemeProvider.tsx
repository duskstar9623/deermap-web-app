import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { THEME, LOCAL_STORAGE_KEYS } from '@/constants/const';
import type { Theme } from '@/types/common';
import { localStorageService } from '@/services/localStorage.service';
import { ThemeContext } from './theme.context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 初始化主题状态，优先从 localStorage 获取用户偏好主题，如果没有则默认使用 LIGHT 主题
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return THEME.LIGHT;
    return localStorageService.get<Theme>(LOCAL_STORAGE_KEYS.THEME, THEME.LIGHT);
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorageService.set(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // 缓存 toggleTheme 函数，避免在每次渲染时创建新的函数实例
  const toggleTheme = useCallback(
    () => setTheme((prev: Theme) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)),
    []
  );
  // 缓存 value 对象，避免在每次渲染时创建新的对象实例，从而减少不必要的重新渲染
  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
