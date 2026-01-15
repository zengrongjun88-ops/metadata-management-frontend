/**
 * 统一返回结果类型
 */
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 分页返回结果类型
 */
export interface PageResult<T = any> {
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
  records: T[];
}

/**
 * 分页请求参数
 */
export interface PageRequest {
  pageNum: number;
  pageSize: number;
}
