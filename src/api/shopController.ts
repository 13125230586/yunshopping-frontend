// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addShop POST /api/shop/add */
export async function addShopUsingPost(body: API.ShopAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/shop/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteShop POST /api/shop/delete */
export async function deleteShopUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/shop/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getShopById GET /api/shop/get */
export async function getShopByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getShopByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseShopVO_>('/api/shop/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listShopByPage POST /api/shop/list/page */
export async function listShopByPageUsingPost(
  body: API.ShopQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageShopVO_>('/api/shop/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** reviewShop POST /api/shop/review */
export async function reviewShopUsingPost(
  body: API.ShopReviewRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/shop/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateShopStatus POST /api/shop/status */
export async function updateShopStatusUsingPost(
  body: API.ShopStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/shop/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateShop POST /api/shop/update */
export async function updateShopUsingPost(
  body: API.ShopUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/shop/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
