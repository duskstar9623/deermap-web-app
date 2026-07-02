/**
 * 认证相关 API
 * @phase Phase 2 — Phase 1 中为接口存根，不集成到应用
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

/** 手机号 + 验证码登录 */
const login = (params: LoginByPhoneParams) => {
  return requestService.post<LoginResult>(endpoints.login, params);
};

/** 登出 */
const logout = () => {
  return requestService.post<null>(endpoints.logout);
};

/** 刷新 Token */
const refreshToken = () => {
  return requestService.post<{ accessToken: string }>(endpoints.refreshToken);
};

/** 发送短信验证码 */
const sendSmsCode = (phone: string) => {
  return requestService.post<null>(endpoints.sendSmsCode, { phone });
};

/** 微信 OAuth 登录 */
const wechatLogin = (code: string) => {
  return requestService.post<LoginResult>(endpoints.wechatLogin, { code });
};

/** 获取当前用户信息 */
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
