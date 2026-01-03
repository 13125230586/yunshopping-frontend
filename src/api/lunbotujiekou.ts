// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取启用的轮播图列表 GET /api/banner/list */
export async function listBannerUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListBannerVO_>('/api/banner/list', {
    method: 'GET',
    ...(options || {}),
  })
}
