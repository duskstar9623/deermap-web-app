/**
 * Unified HTTP client
 *
 * Wrapped around axios, providing:
 * - Request/response interceptors
 * - Unified error handling
 * - Automatic token injection
 * - Optional request retry
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';
import requestsConfig from '@/configs/requests.json';
import { LOCAL_STORAGE_KEYS, LANGUAGE_NAMESPACES } from '@/constants/const';
import i18n from '@/i18n';
import localStorageService from './localStorage.service';
import {
  ApiError,
  ErrorCode,
  type ApiErrorResponse,
} from './error.service';
import errorService from './error.service';

// ─── Common response structure ─────────────────────────────
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ─── Token access ──────────────────────────────────────────
const TOKEN_KEY = LOCAL_STORAGE_KEYS.ACCESS_TOKEN;

const getToken = (): string | null => {
  return localStorageService.get<string | null>(TOKEN_KEY, null);
};

const setToken = (token: string): void => {
  localStorageService.set(TOKEN_KEY, token);
};

const removeToken = (): void => {
  localStorageService.remove(TOKEN_KEY);
};

// ─── Create axios instance ─────────────────────────────────
const httpClient: AxiosInstance = axios.create({
  baseURL: requestsConfig.baseURL,
  timeout: requestsConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor ───────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auto-inject Token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Development environment log
    if (import.meta.env.DEV) {
      console.log(`[HTTP] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ─── Response interceptor ──────────────────────────────────
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Development environment log
    if (import.meta.env.DEV) {
      console.log(`[HTTP] ← ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const apiError = transformError(error);

    // Trigger global error handling
    const handler = errorService.getGlobalErrorHandler();
    handler(apiError);

    return Promise.reject(apiError);
  },
);

// ─── Error transformation ──────────────────────────────────
function transformError(error: AxiosError<ApiErrorResponse>): ApiError {
  const translate = (key: string) => i18n.t(key, { ns: LANGUAGE_NAMESPACES.ERRORS, defaultValue: '' }) as string;

  // Request cancelled
  if (axios.isCancel(error)) {
    return new ApiError(ErrorCode.CANCELLED, translate('http.cancelled'), 0, undefined, 'http.cancelled');
  }

  // No response (network error / timeout)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new ApiError(ErrorCode.TIMEOUT, translate('http.timeout'), 0, undefined, 'http.timeout');
    }
    return new ApiError(ErrorCode.NETWORK_ERROR, translate('http.networkError'), 0, undefined, 'http.networkError');
  }

  // Has response, handle based on status code
  const { status, data } = error.response;
  const code = errorService.mapHttpStatusToErrorCode(status);
  const fallbackMessageKey = status >= 500 ? 'http.unknown' : undefined;
  const message = data?.message || (fallbackMessageKey ? translate(fallbackMessageKey) : '') || error.message || translate('http.unknown');
  const details = data?.details;

  return new ApiError(code, message, status, details, fallbackMessageKey);
}

// ─── Convenience methods ───────────────────────────────────
const get = <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return httpClient.get<ApiResponse<T>>(url, config);
};

const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return httpClient.post<ApiResponse<T>>(url, data, config);
};

const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return httpClient.put<ApiResponse<T>>(url, data, config);
};

const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return httpClient.patch<ApiResponse<T>>(url, data, config);
};

const del = <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return httpClient.delete<ApiResponse<T>>(url, config);
};

const requestService = {
  httpClient,
  getToken,
  setToken,
  removeToken,
  get,
  post,
  put,
  patch,
  del,
};

export default requestService;
