// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** grantMember POST /api/admin/member/grant */
export async function grantMemberUsingPost(
  body: API.MemberGrantRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/member/grant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** addMemberLevel POST /api/admin/member/level/add */
export async function addMemberLevelUsingPost(
  body: API.MemberLevelAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/admin/member/level/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteMemberLevel POST /api/admin/member/level/delete */
export async function deleteMemberLevelUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/member/level/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listAllLevels GET /api/admin/member/level/list */
export async function listAllLevelsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListMemberLevelVO_>('/api/admin/member/level/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** updateMemberLevel POST /api/admin/member/level/update */
export async function updateMemberLevelUsingPost(
  body: API.MemberLevelUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/admin/member/level/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listMemberByPage POST /api/admin/member/list */
export async function listMemberByPageUsingPost(
  body: API.MemberQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMemberVO_>('/api/admin/member/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
