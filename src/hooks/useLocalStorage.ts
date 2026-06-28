import { useCallback, useState } from 'react';
import { localStorageService } from '@/services/localStorage.service';

type SetLocalStorageValue<T> = T | ((previous: T) => T)

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: SetLocalStorageValue<T>) => void, () => void] {
  const [value, setValue] = useState<T>(() => localStorageService.get(key, defaultValue));

  const setStoredValue = useCallback((nextValue: SetLocalStorageValue<T>) => {
    setValue((previous) => {
      const resolved = typeof nextValue === 'function'
        ? (nextValue as (previous: T) => T)(previous)
        : nextValue;

      localStorageService.set(key, resolved);
      return resolved;
    });
  }, [key]);

  const removeStoredValue = useCallback(() => {
    localStorageService.remove(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
}
