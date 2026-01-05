// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addProduct POST /api/product/add */
export async function addProductUsingPost(
  body: API.ProductAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/product/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteProduct POST /api/product/delete */
export async function deleteProductUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/product/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getProductById GET /api/product/get */
export async function getProductByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseProductVO_>('/api/product/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listProductByPage POST /api/product/list/page */
export async function listProductByPageUsingPost(
  body: API.ProductQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageProductVO_>('/api/product/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listMyProductByPage POST /api/product/my/list/page */
export async function listMyProductByPageUsingPost(
  body: API.ProductQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageProductVO_>('/api/product/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** reviewProduct POST /api/product/review */
export async function reviewProductUsingPost(
  body: API.ProductReviewRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/product/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateProductStatus POST /api/product/status */
export async function updateProductStatusUsingPost(
  body: API.ProductStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/product/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateProduct POST /api/product/update */
export async function updateProductUsingPost(
  body: API.ProductUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/product/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
