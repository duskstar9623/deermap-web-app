import { LOCAL_STORAGE_OBJECT_PREFIX } from '@/constants/const';
import type { LocalStorageService } from '@/types/services';
import { isValidValue } from '@/utils/common';

const isBrowser = (): boolean => isValidValue(window) && isValidValue(window?.localStorage);

const serialize = <T>(value: T): string | undefined => {
	if (value === undefined) return undefined;
	if (typeof value === 'string') return value;
	return `${LOCAL_STORAGE_OBJECT_PREFIX}${JSON.stringify(value)}`;
};

const deserialize = <T>(raw: string): T => {
	if (raw.startsWith(LOCAL_STORAGE_OBJECT_PREFIX)) {
		try {
			return JSON.parse(raw.slice(LOCAL_STORAGE_OBJECT_PREFIX.length)) as T;
		} catch {
			return raw as T;
		}
	}
	return raw as T;
};

export const localStorageService: LocalStorageService = {
	get<T>(key: string, defaultValue: T): T {
		if (!isBrowser()) return defaultValue;

		try {
			const raw = window.localStorage.getItem(key);
			if (raw === null) return defaultValue;
			return deserialize<T>(raw);
		} catch (error) {
			console.error(`[localStorage] get failed: ${key}`, error);
			return defaultValue;
		}
	},

	set<T>(key: string, value: T): void {
		if (!isBrowser()) return;

		try {
			const serialized = serialize(value);
			if (serialized === undefined) {
				window.localStorage.removeItem(key);
				return;
			}
			window.localStorage.setItem(key, serialized);
		} catch (error) {
			console.error(`[localStorage] set failed: ${key}`, error);
		}
	},

	remove(key: string): void {
		if (!isBrowser()) return;

		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`[localStorage] remove failed: ${key}`, error);
		}
	},
};
