/**
 * 操作历史API服务
 * 支持Mock模式和真实API模式切换
 */

import { get } from './request';
import { mockHistoryApi } from './mockService';
import { USE_MOCK } from '@/constants';
import type { Result, PageResult } from '../types/common';
import type { OperationHistory } from '../types/approval';

// 根据USE_MOCK配置决定使用Mock服务还是真实API
const api = USE_MOCK ? mockHistoryApi : {
  // 真实API实现
  query: (params: {
    tableId?: number;
    operator?: string;
    pageNum: number;
    pageSize: number;
  }): Promise<Result<PageResult<OperationHistory>>> => {
    // 根据参数决定调用哪个接口
    if (params.tableId) {
      return get<PageResult<OperationHistory>>(`/metadata/history/table/${params.tableId}`, {
        params: { pageNum: params.pageNum, pageSize: params.pageSize },
      });
    } else if (params.operator) {
      return get<PageResult<OperationHistory>>(`/metadata/history/operator/${params.operator}`, {
        params: { pageNum: params.pageNum, pageSize: params.pageSize },
      });
    }
    return Promise.reject({ message: '参数错误：必须提供tableId或operator' });
  },
};

// 导出统一的API接口
export const historyApi = api;

/**
 * 获取表的操作历史
 */
export function getTableHistory(tableId: number, pageNum: number, pageSize: number) {
  return api.query({ tableId, pageNum, pageSize });
}

/**
 * 获取用户的操作历史
 */
export function getUserHistory(operator: string, pageNum: number, pageSize: number) {
  return api.query({ operator, pageNum, pageSize });
}
