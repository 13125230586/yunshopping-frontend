// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** activateMember POST /api/member/activate */
export async function activateMemberUsingPost(
  body: API.MemberActivateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/member/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getBenefitLogs GET /api/member/benefits/log */
export async function getBenefitLogsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListMemberBenefitLogVO_>('/api/member/benefits/log', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getMemberInfo GET /api/member/info */
export async function getMemberInfoUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseMemberVO_>('/api/member/info', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getAllLevels GET /api/member/levels */
export async function getAllLevelsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListMemberLevelVO_>('/api/member/levels', {
    method: 'GET',
    ...(options || {}),
  })
}
