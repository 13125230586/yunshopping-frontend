// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取用户可用的优惠券列表 GET /api/coupon/available */
export async function getAvailableCouponsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAvailableCouponsUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListUserCouponVO_>('/api/coupon/available', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取用户的所有优惠券列表 GET /api/coupon/my */
export async function getMyCouponsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListUserCouponVO_>('/api/coupon/my', {
    method: 'GET',
    ...(options || {}),
  })
}
