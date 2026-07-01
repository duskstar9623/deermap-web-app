export interface LocalStorageService {
	get<T>(key: string, defaultValue: T): T;
	set<T>(key: string, value: T): void;
	remove(key: string): void;
}
