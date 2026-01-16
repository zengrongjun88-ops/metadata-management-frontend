/**
 * 元数据表API服务
 * 支持Mock模式和真实API模式切换
 */

import request from './request';
import { mockMetadataApi } from './mockService';
import { USE_MOCK } from '@/constants';
import type { Result, PageResult } from '@/types/common';
import type { MetadataTable, TableSearchRequest, TableCreateRequest, TableUpdateRequest } from '@/types/metadata';

// 根据USE_MOCK配置决定使用Mock服务还是真实API
const api = USE_MOCK ? mockMetadataApi : {
  // 真实API实现
  pageQuery: (params: TableSearchRequest): Promise<Result<PageResult<MetadataTable>>> => {
    return request.get('/metadata/tables/page', { params });
  },

  getById: (id: number): Promise<Result<MetadataTable>> => {
    return request.get(`/metadata/tables/${id}`);
  },

  getByName: (databaseName: string, tableName: string): Promise<Result<MetadataTable>> => {
    return request.get('/metadata/tables/name', { params: { databaseName, tableName } });
  },

  create: (data: TableCreateRequest): Promise<Result<number>> => {
    return request.post('/metadata/tables', data);
  },

  update: (id: number, data: TableUpdateRequest): Promise<Result<void>> => {
    return request.put(`/metadata/tables/${id}`, data);
  },

  delete: (id: number): Promise<Result<void>> => {
    return request.delete(`/metadata/tables/${id}`);
  },

  generateSql: (data: any): Promise<Result<string>> => {
    return request.post('/metadata/tables/generate-sql', data);
  },

  validateSql: (sql: string, dataSource: string): Promise<Result<void>> => {
    return request.post('/metadata/tables/validate-sql', null, { params: { sql, dataSource } });
  },
};

// 导出统一的API接口
export const metadataApi = api;

// 导出便捷函数（保持向后兼容）
/**
 * 分页查询元数据表
 */
export function pageQueryTables(params: TableSearchRequest) {
  return api.pageQuery(params);
}

/**
 * 根据ID查询元数据表详情
 */
export function getTableById(id: number) {
  return api.getById(id);
}

/**
 * 根据数据库名和表名查询表详情
 */
export function getTableByName(databaseName: string, tableName: string) {
  return api.getByName(databaseName, tableName);
}

/**
 * 创建元数据表
 */
export function createTable(data: TableCreateRequest) {
  return api.create(data);
}

/**
 * 更新元数据表
 */
export function updateTable(id: number, data: TableUpdateRequest) {
  return api.update(id, data);
}

/**
 * 删除元数据表
 */
export function deleteTable(id: number) {
  return api.delete(id);
}

/**
 * 生成建表SQL
 */
export function generateSql(data: TableCreateRequest) {
  return api.generateSql(data);
}

/**
 * 校验SQL语法
 */
export function validateSql(sql: string, dataSource: string) {
  return api.validateSql(sql, dataSource);
}

export default api;
