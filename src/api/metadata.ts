import { get, post, put, del } from './request';
import type { PageResult } from '../types/common';
import type {
  MetadataTable,
  TableSearchRequest,
  TableCreateRequest,
  TableUpdateRequest,
} from '../types/metadata';

/**
 * 分页查询元数据表
 */
export function pageQueryTables(params: TableSearchRequest) {
  return get<PageResult<MetadataTable>>('/metadata/tables/page', { params });
}

/**
 * 根据ID查询元数据表详情
 */
export function getTableById(id: number) {
  return get<MetadataTable>(`/metadata/tables/${id}`);
}

/**
 * 根据数据库名和表名查询表详情
 */
export function getTableByName(databaseName: string, tableName: string) {
  return get<MetadataTable>('/metadata/tables/name', {
    params: { databaseName, tableName },
  });
}

/**
 * 创建元数据表
 */
export function createTable(data: TableCreateRequest) {
  return post<number>('/metadata/tables', data);
}

/**
 * 更新元数据表
 */
export function updateTable(id: number, data: TableUpdateRequest) {
  return put<void>(`/metadata/tables/${id}`, data);
}

/**
 * 删除元数据表
 */
export function deleteTable(id: number) {
  return del<void>(`/metadata/tables/${id}`);
}

/**
 * 生成建表SQL
 */
export function generateSql(data: TableCreateRequest) {
  return post<string>('/metadata/tables/generate-sql', data);
}

/**
 * 校验SQL语法
 */
export function validateSql(sql: string, dataSource: string) {
  return post<void>('/metadata/tables/validate-sql', null, {
    params: { sql, dataSource },
  });
}
