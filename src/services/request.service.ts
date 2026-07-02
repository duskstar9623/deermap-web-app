/**
 * 统一 HTTP 客户端
 *
 * 基于 axios 封装，提供：
 * - 请求/响应拦截器
 * - 统一错误处理
 * - Token 自动注入
 * - 请求重试（可选）
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';
import requestsConfig from '@/configs/requests.json';
import { LOCAL_STORAGE_KEYS } from '@/constants/const';
import i18n from '@/i18n';
import localStorageService from './localStorage.service';
import {
  ApiError,
  ErrorCode,
  type ApiErrorResponse,
} from './error.service';
import errorService from './error.service';

// ─── 通用响应结构 ───────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ─── Token 存取 ─────────────────────────────────────────────
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

// ─── 创建 axios 实例 ────────────────────────────────────────
const httpClient: AxiosInstance = axios.create({
  baseURL: requestsConfig.baseURL,
  timeout: requestsConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── 请求拦截器 ─────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 自动注入 Token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[HTTP] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ─── 响应拦截器 ─────────────────────────────────────────────
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[HTTP] ← ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const apiError = transformError(error);

    // 触发全局错误处理
    const handler = errorService.getGlobalErrorHandler();
    handler(apiError);

    return Promise.reject(apiError);
  },
);

// ─── 错误转换 ───────────────────────────────────────────────
function transformError(error: AxiosError<ApiErrorResponse>): ApiError {
  const translate = (key: string) => i18n.t(key, { ns: 'errors', defaultValue: '' }) as string;

  // 请求被取消
  if (axios.isCancel(error)) {
    return new ApiError(ErrorCode.CANCELLED, translate('http.cancelled'));
  }

  // 无响应（网络错误 / 超时）
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new ApiError(ErrorCode.TIMEOUT, translate('http.timeout'));
    }
    return new ApiError(ErrorCode.NETWORK_ERROR, translate('http.networkError'));
  }

  // 有响应，根据状态码处理
  const { status, data } = error.response;
  const code = errorService.mapHttpStatusToErrorCode(status);
  const message = data?.message || error.message || translate('http.unknown');
  const details = data?.details;

  return new ApiError(code, message, status, details);
}

// ─── 便捷方法 ───────────────────────────────────────────────
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
