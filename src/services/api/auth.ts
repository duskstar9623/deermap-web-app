/**
 * 认证相关 API
 */
import { get, post } from '../http-client';
import requestsConfig from '@/configs/requests.json';
import type { User } from '@/types';

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
export function login(params: LoginByPhoneParams) {
  return post<LoginResult>(endpoints.login, params);
}

/** 登出 */
export function logout() {
  return post<null>(endpoints.logout);
}

/** 刷新 Token */
export function refreshToken() {
  return post<{ accessToken: string }>(endpoints.refreshToken);
}

/** 发送短信验证码 */
export function sendSmsCode(phone: string) {
  return post<null>(endpoints.sendSmsCode, { phone });
}

/** 微信 OAuth 登录 */
export function wechatLogin(code: string) {
  return post<LoginResult>(endpoints.wechatLogin, { code });
}

/** 获取当前用户信息 */
export function getCurrentUser() {
  return get<User>(requestsConfig.endpoints.user.profile);
}
