export interface BaseResponse<T = any> {
  code: number
  data: T
  message: string
}

export interface Page<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface PageRequest {
  current?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
}

export interface DeleteRequest {
  id: number
}