// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addToCart POST /api/cart/add */
export async function addToCartUsingPost(
  body: API.CartAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** clearCart POST /api/cart/clear */
export async function clearCartUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/cart/clear', {
    method: 'POST',
    ...(options || {}),
  })
}

/** deleteCartItem POST /api/cart/delete */
export async function deleteCartItemUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/cart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getCartList GET /api/cart/list */
export async function getCartListUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCartVO_>('/api/cart/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** updateQuantity POST /api/cart/update */
export async function updateQuantityUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateQuantityUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/cart/update', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
