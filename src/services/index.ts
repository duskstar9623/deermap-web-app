export { default as httpClient } from './http-client';
export { get, post, put, patch, del, getToken, setToken, removeToken } from './http-client';
export type { ApiResponse } from './http-client';

export { ApiError, ErrorCode, setGlobalErrorHandler } from './error-handler';
export type { ApiErrorResponse, ErrorHandler } from './error-handler';

export { authApi, ordersApi, contactApi } from './api';
