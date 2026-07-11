/**
 * API error type definitions and unified error handling
 */
import i18n from '@/i18n';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

/** Backend standard error response structure */
export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

/** Business error code enum */
export enum ErrorCode {
  // General
  UNKNOWN = 'UNKNOWN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',

  // Authentication related
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  FORBIDDEN = 'FORBIDDEN',

  // Business related
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
}

/** Unified API error class */
export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;
  readonly messageKey?: string;

  constructor(
    code: ErrorCode,
    message: string,
    status: number = 0,
    details?: Record<string, unknown>,
    messageKey?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.messageKey = messageKey;
  }

  /** Whether it is an authentication error (requires re-login) */
  get isAuthError(): boolean {
    return this.code === ErrorCode.UNAUTHORIZED || this.code === ErrorCode.TOKEN_EXPIRED;
  }

  /** Whether it is a network layer error */
  get isNetworkError(): boolean {
    return this.code === ErrorCode.NETWORK_ERROR || this.code === ErrorCode.TIMEOUT;
  }
}

/** HTTP status code → ErrorCode mapping */
const mapHttpStatusToErrorCode = (status: number): ErrorCode => {
  switch (status) {
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 409:
      return ErrorCode.CONFLICT;
    case 422:
      return ErrorCode.VALIDATION_ERROR;
    case 429:
      return ErrorCode.RATE_LIMITED;
    default:
      return status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.UNKNOWN;
  }
};

const translateError = (key: string) => i18n.t(key, { ns: LANGUAGE_NAMESPACES.ERRORS, defaultValue: '' }) as string;

const getErrorMessage = (error: ApiError): string => {
  if (error.messageKey) {
    return translateError(error.messageKey) || error.message;
  }
  return error.message;
};

/**
 * Global error handler
 * Default behavior can be replaced via setGlobalErrorHandler
 */
export type ErrorHandler = (error: ApiError) => void

let globalErrorHandler: ErrorHandler = (error: ApiError) => {
  const message = getErrorMessage(error);

  // Default behavior: console output; in real projects can be integrated with toast/notification
  if (error.isAuthError) {
    console.warn('[API]', translateError('console.authWarning'), message);
  } else if (error.isNetworkError) {
    console.warn('[API]', translateError('console.networkWarning'), message);
  } else {
    console.error('[API]', translateError('console.requestError'), error.code, message);
  }
};

const setGlobalErrorHandler = (handler: ErrorHandler): void => {
  globalErrorHandler = handler;
};

const getGlobalErrorHandler = (): ErrorHandler => {
  return globalErrorHandler;
};

const errorService = {
  mapHttpStatusToErrorCode,
  setGlobalErrorHandler,
  getGlobalErrorHandler,
};

export default errorService;
