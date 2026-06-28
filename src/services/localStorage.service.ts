import {
  StorageServiceError,
  type StorageErrorHandler,
} from '@/types/services';

let storageErrorHandler: StorageErrorHandler = (error: StorageServiceError) => {
  console.error('[Storage]', error.operation, error.key ?? '-', error.message, error.cause);
};

function handleStorageError(error: StorageServiceError): void {
  storageErrorHandler(error);
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function parseStorageValue<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as T;
  }
}

export function setStorageErrorHandler(handler: StorageErrorHandler): void {
  storageErrorHandler = handler;
}

export function getStorageErrorHandler(): StorageErrorHandler {
  return storageErrorHandler;
}

export const localStorageService = {
  get<T>(key: string, defaultValue: T): T {
    if (!isBrowser()) return defaultValue;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;

      return parseStorageValue<T>(raw);
    } catch (cause) {
      handleStorageError(new StorageServiceError('get', 'Failed to read localStorage value.', key, cause));
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;

    try {
      const serialized = JSON.stringify(value);

      if (serialized === undefined) {
        window.localStorage.removeItem(key);
        return;
      }

      window.localStorage.setItem(key, serialized);
    } catch (cause) {
      handleStorageError(new StorageServiceError('set', 'Failed to write localStorage value.', key, cause));
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;

    try {
      window.localStorage.removeItem(key);
    } catch (cause) {
      handleStorageError(new StorageServiceError('remove', 'Failed to remove localStorage value.', key, cause));
    }
  },
};

export { StorageServiceError, type StorageErrorHandler } from '@/types/services';
