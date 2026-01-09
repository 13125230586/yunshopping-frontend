// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取所有优惠券列表 GET /api/admin/coupon/list */
export async function listAllCouponsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCouponVO_>('/api/admin/coupon/list', {
    method: 'GET',
    ...(options || {}),
  })
}
