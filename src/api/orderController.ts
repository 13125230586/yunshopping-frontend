// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** cancelOrder POST /api/order/cancel */
export async function cancelOrderUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelOrderUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/cancel', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** confirmReceipt POST /api/order/confirm */
export async function confirmReceiptUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.confirmReceiptUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/confirm', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** createOrder POST /api/order/create */
export async function createOrderUsingPost(
  body: API.OrderCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteOrder POST /api/order/delete */
export async function deleteOrderUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteOrderUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/order/delete', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getOrderDetail GET /api/order/get */
export async function getOrderDetailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderDetailUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOrderVO_>('/api/order/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listOrderByPage POST /api/order/list/page */
export async function listOrderByPageUsingPost(
  body: API.OrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageOrderVO_>('/api/order/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSellerOrderDetail GET /api/order/seller/get */
export async function getSellerOrderDetailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSellerOrderDetailUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOrderVO_>('/api/order/seller/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listSellerOrderByPage POST /api/order/seller/list/page */
export async function listSellerOrderByPageUsingPost(
  body: API.OrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageOrderVO_>('/api/order/seller/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
