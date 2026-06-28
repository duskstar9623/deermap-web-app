/**
 * 订单相关 API
 */
import { get, post } from '../http.service';
import requestsConfig from '@/configs/requests.json';
import type { Order, OrderType, PaymentMethod } from '@/types';

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

/** 获取订单列表 */
export function getOrders(params?: OrderListParams) {
  return get<PaginatedResult<Order>>(endpoints.list, { params });
}

/** 获取订单详情 */
export function getOrderDetail(id: string) {
  const url = endpoints.detail.replace(':id', id);
  return get<Order>(url);
}

/** 创建订单 */
export function createOrder(params: CreateOrderParams) {
  return post<Order>(endpoints.create, params);
}

/** 取消订单 */
export function cancelOrder(id: string) {
  const url = endpoints.cancel.replace(':id', id);
  return post<Order>(url);
}

/** 发起支付 */
export function payOrder(id: string, params: PayOrderParams) {
  const url = endpoints.pay.replace(':id', id);
  return post<{ paymentUrl: string }>(url, params);
}
