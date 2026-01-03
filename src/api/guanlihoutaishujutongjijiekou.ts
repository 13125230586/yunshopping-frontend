// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取订单总数 GET /api/admin/statistics/orders/count */
export async function getOrderCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/admin/statistics/orders/count', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 订单状态分布统计 GET /api/admin/statistics/orders/status-distribution */
export async function getOrderStatusDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListDistributionDataVO_>(
    '/api/admin/statistics/orders/status-distribution',
    {
      method: 'GET',
      ...(options || {}),
    }
  )
}

/** 订单趋势统计 GET /api/admin/statistics/orders/trend */
export async function getOrderTrendUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderTrendUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTrendDataVO_>('/api/admin/statistics/orders/trend', {
    method: 'GET',
    params: {
      // days has a default value: 7
      days: '7',
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取数据概览统计 GET /api/admin/statistics/overview */
export async function getOverviewStatisticsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseAdminStatisticsVO_>('/api/admin/statistics/overview', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 商品分类分布统计 GET /api/admin/statistics/products/category-distribution */
export async function getProductCategoryDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListDistributionDataVO_>(
    '/api/admin/statistics/products/category-distribution',
    {
      method: 'GET',
      ...(options || {}),
    }
  )
}

/** 获取待审核商品数 GET /api/admin/statistics/products/pending */
export async function getPendingProductCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/admin/statistics/products/pending', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 销售额趋势统计 GET /api/admin/statistics/sales/trend */
export async function getSalesTrendUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSalesTrendUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTrendDataVO_>('/api/admin/statistics/sales/trend', {
    method: 'GET',
    params: {
      // days has a default value: 7
      days: '7',
      ...params,
    },
    ...(options || {}),
  })
}

/** 店铺等级分布统计 GET /api/admin/statistics/shops/level-distribution */
export async function getShopLevelDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListDistributionDataVO_>(
    '/api/admin/statistics/shops/level-distribution',
    {
      method: 'GET',
      ...(options || {}),
    }
  )
}

/** 获取待审核店铺数 GET /api/admin/statistics/shops/pending */
export async function getPendingShopCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/admin/statistics/shops/pending', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取用户总数 GET /api/admin/statistics/users/count */
export async function getUserCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/admin/statistics/users/count', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 用户角色分布统计 GET /api/admin/statistics/users/role-distribution */
export async function getUserRoleDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListDistributionDataVO_>(
    '/api/admin/statistics/users/role-distribution',
    {
      method: 'GET',
      ...(options || {}),
    }
  )
}
