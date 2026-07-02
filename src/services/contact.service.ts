/**
 * 联系我们 / 表单提交 API
 * @phase Phase 2 — Phase 1 联系表单为静态提交（e.preventDefault()），不集成到应用
 */
import requestService from './request.service';
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
const submitContactForm = (params: ContactFormParams) => {
  return requestService.post<null>(endpoints.submit, params);
};

const contactService = {
  submitContactForm,
};

export default contactService;
