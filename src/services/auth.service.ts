/**
 * Authentication-related APIs
 * @phase Phase 2 — Interface stubs in Phase 1, not integrated into the app
 */
import requestService from './request.service';
import requestsConfig from '@/configs/requests.json';
import type { User } from '@/types/pages/user.type';

const endpoints = requestsConfig.endpoints.auth;

export interface LoginByPhoneParams {
  phone: string
  code: string
}

export interface LoginResult {
  accessToken: string
  user: User
}

/** Login with phone number + verification code */
const login = (params: LoginByPhoneParams) => {
  return requestService.post<LoginResult>(endpoints.login, params);
};

/** Log out */
const logout = () => {
  return requestService.post<null>(endpoints.logout);
};

/** Refresh Token */
const refreshToken = () => {
  return requestService.post<{ accessToken: string }>(endpoints.refreshToken);
};

/** Send SMS verification code */
const sendSmsCode = (phone: string) => {
  return requestService.post<null>(endpoints.sendSmsCode, { phone });
};

/** WeChat OAuth login */
const wechatLogin = (code: string) => {
  return requestService.post<LoginResult>(endpoints.wechatLogin, { code });
};

/** Get current user info */
const getCurrentUser = () => {
  return requestService.get<User>(requestsConfig.endpoints.user.profile);
};

const authService = {
  login,
  logout,
  refreshToken,
  sendSmsCode,
  wechatLogin,
  getCurrentUser,
};

export default authService;
