/**
 * Order-related APIs
 * @phase Phase 2 — Interface stubs in Phase 1, not integrated into the app
 */
import requestService from './request.service';
import requestsConfig from '@/configs/requests.json';
import type { Order, OrderType, PaymentMethod } from '@/types/pages/order.type';

const endpoints = requestsConfig.endpoints.orders;

export interface CreateOrderParams {
  type: OrderType
  title: string
  description?: string
  couponCode?: string
}

export interface PayOrderParams {
  paymentMethod: PaymentMethod
}

export interface OrderListParams {
  page?: number
  pageSize?: number
  status?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Get order list */
const getOrders = (params?: OrderListParams) => {
  return requestService.get<PaginatedResult<Order>>(endpoints.list, { params });
};

/** Get order details */
const getOrderDetail = (id: string) => {
  const url = endpoints.detail.replace(':id', id);
  return requestService.get<Order>(url);
};

/** Create order */
const createOrder = (params: CreateOrderParams) => {
  return requestService.post<Order>(endpoints.create, params);
};

/** Cancel order */
const cancelOrder = (id: string) => {
  const url = endpoints.cancel.replace(':id', id);
  return requestService.post<Order>(url);
};

/** Initiate payment */
const payOrder = (id: string, params: PayOrderParams) => {
  const url = endpoints.pay.replace(':id', id);
  return requestService.post<{ paymentUrl: string }>(url, params);
};

const ordersService = {
  getOrders,
  getOrderDetail,
  createOrder,
  cancelOrder,
  payOrder,
};

export default ordersService;
