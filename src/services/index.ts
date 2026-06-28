export { default as httpClient } from './http.service';
export { get, post, put, patch, del, getToken, setToken, removeToken } from './http.service';
export type { ApiResponse } from './http.service';

export { ApiError, ErrorCode, setGlobalErrorHandler } from './error.service';
export type { ApiErrorResponse, ErrorHandler } from './error.service';

export {
	localStorageService,
	StorageServiceError,
	setStorageErrorHandler,
	getStorageErrorHandler,
} from './localStorage.service';
export type { StorageErrorHandler } from '@/types/services';

export { authApi, ordersApi, contactApi } from './api';
