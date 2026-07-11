/**
 * Contact us / form submission APIs
 * @phase Phase 2 — Contact form is a static submission (e.preventDefault()) in Phase 1, not integrated into the app
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

/** Submit contact form */
const submitContactForm = (params: ContactFormParams) => {
  return requestService.post<null>(endpoints.submit, params);
};

const contactService = {
  submitContactForm,
};

export default contactService;
