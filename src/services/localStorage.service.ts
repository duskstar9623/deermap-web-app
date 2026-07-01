import { isBrowser } from '@/utils/common';
import type { LocalStorageService } from '@/types/services/localStorage.type';

const localStorageService: LocalStorageService = {
	get<T>(key: string, defaultValue: T): T {
		if (!isBrowser()) return defaultValue;

		try {
			const raw = window.localStorage.getItem(key);
			if (raw === null) return defaultValue;
			return JSON.parse(raw) as T;
		} catch (error) {
			console.error(`[localStorage] get failed: ${key}`, error);
			return defaultValue;
		}
	},

	set<T>(key: string, value: T): void {
		if (!isBrowser()) return;

		try {
			if (value === undefined) {
				window.localStorage.removeItem(key);
				return;
			}
			window.localStorage.setItem(key, JSON.stringify(value));
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

export default localStorageService;
