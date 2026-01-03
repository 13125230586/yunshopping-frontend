// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** paymentFailed POST /api/payment/callback/failed */
export async function paymentFailedUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.paymentFailedUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/payment/callback/failed', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** paymentCallback POST /api/payment/callback/success */
export async function paymentCallbackUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.paymentCallbackUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/payment/callback/success', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** createPayment POST /api/payment/create */
export async function createPaymentUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.createPaymentUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/payment/create', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getPaymentByOrderId GET /api/payment/get */
export async function getPaymentByOrderIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPaymentByOrderIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePaymentVO_>('/api/payment/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
