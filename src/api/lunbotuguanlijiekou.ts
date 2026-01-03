// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 新增轮播图 POST /api/admin/banner/add */
export async function addBannerUsingPost(
  body: API.BannerAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/admin/banner/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除轮播图 POST /api/admin/banner/delete */
export async function deleteBannerUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/banner/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页查询轮播图 POST /api/admin/banner/list */
export async function listBannerByPageUsingPost(
  body: API.BannerQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageBannerVO_>('/api/admin/banner/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量修改排序 POST /api/admin/banner/sort */
export async function batchUpdateSortUsingPost(
  body: API.BannerSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/banner/sort', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改轮播图状态 POST /api/admin/banner/status */
export async function updateBannerStatusUsingPost(
  body: API.BannerStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/banner/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改轮播图 POST /api/admin/banner/update */
export async function updateBannerUsingPost(
  body: API.BannerUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/banner/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
