import { get } from './request';
import type { PageResult } from '../types/common';
import type { OperationHistory } from '../types/approval';

/**
 * 获取表的操作历史
 */
export function getTableHistory(tableId: number, pageNum: number, pageSize: number) {
  return get<PageResult<OperationHistory>>(`/metadata/history/table/${tableId}`, {
    params: { pageNum, pageSize },
  });
}

/**
 * 获取用户的操作历史
 */
export function getUserHistory(operator: string, pageNum: number, pageSize: number) {
  return get<PageResult<OperationHistory>>(`/metadata/history/operator/${operator}`, {
    params: { pageNum, pageSize },
  });
}
