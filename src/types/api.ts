export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
}
