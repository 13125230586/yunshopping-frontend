// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addAddress POST /api/address/add */
export async function addAddressUsingPost(body: API.Address, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/address/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteAddress POST /api/address/delete */
export async function deleteAddressUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/address/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getAddressList GET /api/address/list */
export async function getAddressListUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAddressVO_>('/api/address/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** setDefaultAddress POST /api/address/setDefault */
export async function setDefaultAddressUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.setDefaultAddressUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/address/setDefault', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** updateAddress POST /api/address/update */
export async function updateAddressUsingPost(body: API.Address, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/address/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
