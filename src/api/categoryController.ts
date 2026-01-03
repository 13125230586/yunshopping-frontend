// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addCategory POST /api/category/add */
export async function addCategoryUsingPost(body: API.Category, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteCategory POST /api/category/delete */
export async function deleteCategoryUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/category/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getCategoryTree GET /api/category/tree */
export async function getCategoryTreeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCategoryVO_>('/api/category/tree', {
    method: 'GET',
    ...(options || {}),
  })
}

/** updateCategory POST /api/category/update */
export async function updateCategoryUsingPost(
  body: API.Category,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
