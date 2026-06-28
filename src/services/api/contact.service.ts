/**
 * 联系我们 / 表单提交 API
 */
import { post } from '../http.service';
import requestsConfig from '@/configs/requests.json';

const endpoints = requestsConfig.endpoints.contact;

export interface ContactFormParams {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

/** 提交联系表单 */
export function submitContactForm(params: ContactFormParams) {
  return post<null>(endpoints.submit, params);
}
