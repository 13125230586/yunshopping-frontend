// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addReview POST /api/review/add */
export async function addReviewUsingPost(body: API.Review, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/review/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteReview POST /api/review/delete */
export async function deleteReviewUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/review/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listReviewByPage GET /api/review/list/page */
export async function listReviewByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listReviewByPageUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageReviewVO_>('/api/review/list/page', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}
