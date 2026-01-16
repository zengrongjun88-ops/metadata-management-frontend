/**
 * Mock API服务
 * 模拟后端API响应,用于前端功能验收
 */

import {
  mockTables,
  mockFields,
  mockApprovals,
  mockHistory,
  generateTableId,
  generateFieldId,
  generateApprovalId,
  generateHistoryId,
} from './mockData';
import type { Result, PageResult } from '@/types/common';
import type { MetadataTable, TableSearchRequest, TableCreateRequest } from '@/types/metadata';
import type { ApprovalFlow } from '@/types/approval';
import type { OperationHistory } from '@/types/approval';

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 包装成Result格式的响应
function wrapResult<T>(data: T): Result<T> {
  return {
    code: 200,
    message: 'success',
    data,
    timestamp: Date.now(),
  };
}

// ==================== 元数据表Mock API ====================

export const mockMetadataApi = {
  // 分页查询
  pageQuery: async (params: TableSearchRequest): Promise<Result<PageResult<MetadataTable>>> => {
    await delay();

    let filteredTables = [...mockTables];

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredTables = filteredTables.filter(table =>
        table.tableName.toLowerCase().includes(keyword) ||
        table.databaseName.toLowerCase().includes(keyword) ||
        (table.tableComment && table.tableComment.toLowerCase().includes(keyword))
      );
    }

    // 数据源筛选
    if (params.dataSource) {
      filteredTables = filteredTables.filter(table => table.dataSource === params.dataSource);
    }

    // 数仓分层筛选
    if (params.warehouseLayer) {
      filteredTables = filteredTables.filter(table => table.warehouseLayer === params.warehouseLayer);
    }

    // 一级主题筛选
    if (params.themeFirst) {
      filteredTables = filteredTables.filter(table => table.themeFirst === params.themeFirst);
    }

    // 责任人筛选
    if (params.owner) {
      filteredTables = filteredTables.filter(table => table.owner === params.owner);
    }

    // 分页
    const pageNum = params.pageNum || 1;
    const pageSize = params.pageSize || 10;
    const total = filteredTables.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const records = filteredTables.slice(start, end);

    // 为每个表添加字段信息
    const tablesWithFields = records.map(table => ({
      ...table,
      fields: mockFields[table.id] || [],
    }));

    return {
      data: {
        records: tablesWithFields,
        total,
        pageNum,
        pageSize,
      },
    };
  },

  // 根据ID查询详情
  getById: async (id: number): Promise<Result<MetadataTable>> => {
    await delay(300);

    const table = mockTables.find(t => t.id === id);
    if (!table) {
      return Promise.reject({ message: '表不存在' });
    }

    return {
      data: {
        ...table,
        fields: mockFields[id] || [],
      },
    };
  },

  // 根据数据库名和表名查询
  getByName: async (databaseName: string, tableName: string): Promise<Result<MetadataTable>> => {
    await delay(300);

    const table = mockTables.find(
      t => t.databaseName === databaseName && t.tableName === tableName
    );

    if (!table) {
      return Promise.reject({ message: '表不存在' });
    }

    return {
      data: {
        ...table,
        fields: mockFields[table.id] || [],
      },
    };
  },

  // 创建表
  create: async (data: TableCreateRequest): Promise<Result<number>> => {
    await delay(800);

    const newId = generateTableId();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTable: MetadataTable = {
      id: newId,
      tableName: data.tableName,
      databaseName: data.databaseName,
      dataSource: data.dataSource,
      tableComment: data.tableComment || '',
      hiveAccount: data.hiveAccount || '',
      tableSize: 0,
      warehouseLayer: data.warehouseLayer,
      themeFirst: data.themeFirst,
      themeSecond: data.themeSecond || '',
      sensitivityLevel: data.sensitivityLevel,
      importanceLevel: data.importanceLevel || 'P2',
      partitionType: data.partitionType || '',
      partitionRetentionDays: data.partitionRetentionDays || 0,
      updateFrequency: data.updateFrequency || '',
      owner: data.owner || 'admin',
      customTags: data.customTags || '',
      createSql: data.createSql || '',
      createBy: 'admin',
      createTime: now,
      updateBy: 'admin',
      updateTime: now,
      deleted: 0,
    };

    mockTables.push(newTable);

    // 添加字段
    if (data.fields && data.fields.length > 0) {
      mockFields[newId] = data.fields.map((field, index) => ({
        id: generateFieldId(),
        tableId: newId,
        fieldName: field.fieldName,
        fieldComment: field.fieldComment || '',
        fieldType: field.fieldType,
        fieldOrder: index + 1,
        isPrimaryKey: field.isPrimaryKey || 0,
        isNullable: field.isNullable !== undefined ? field.isNullable : 1,
        isEncrypted: field.isEncrypted || 0,
        sensitivityLevel: field.sensitivityLevel || 'L1',
        defaultValue: field.defaultValue || null,
        createBy: 'admin',
        createTime: now,
        updateBy: 'admin',
        updateTime: now,
        deleted: 0,
      }));
    }

    // 记录操作历史
    const history = {
      id: generateHistoryId(),
      tableId: newId,
      operationType: 'CREATE' as any,
      operator: 'admin',
      operationTime: now,
      beforeContent: null,
      afterContent: JSON.stringify({
        tableName: data.tableName,
        databaseName: data.databaseName,
        tableComment: data.tableComment,
      }),
      operationDesc: `创建表 ${data.databaseName}.${data.tableName}`,
      createBy: 'system',
      createTime: now,
      deleted: 0,
    };
    mockHistory.unshift(history);

    return {
      data: newId,
    };
  },

  // 更新表
  update: async (id: number, data: any): Promise<Result<void>> => {
    await delay(600);

    const index = mockTables.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject({ message: '表不存在' });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const oldTable = { ...mockTables[index] };

    mockTables[index] = {
      ...mockTables[index],
      ...data,
      updateBy: 'admin',
      updateTime: now,
    };

    // 记录操作历史
    const history = {
      id: generateHistoryId(),
      tableId: id,
      operationType: 'UPDATE' as any,
      operator: 'admin',
      operationTime: now,
      beforeContent: JSON.stringify(oldTable),
      afterContent: JSON.stringify(mockTables[index]),
      operationDesc: `更新表 ${mockTables[index].databaseName}.${mockTables[index].tableName}`,
      createBy: 'system',
      createTime: now,
      deleted: 0,
    };
    mockHistory.unshift(history);

    return { data: undefined };
  },

  // 删除表
  delete: async (id: number): Promise<Result<void>> => {
    await delay(400);

    const index = mockTables.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject({ message: '表不存在' });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const table = mockTables[index];

    mockTables[index].deleted = 1;
    mockTables[index].updateTime = now;

    // 记录操作历史
    const history = {
      id: generateHistoryId(),
      tableId: id,
      operationType: 'DELETE' as any,
      operator: 'admin',
      operationTime: now,
      beforeContent: JSON.stringify(table),
      afterContent: null,
      operationDesc: `删除表 ${table.databaseName}.${table.tableName}`,
      createBy: 'system',
      createTime: now,
      deleted: 0,
    };
    mockHistory.unshift(history);

    return { data: undefined };
  },

  // 生成建表SQL
  generateSql: async (data: any): Promise<Result<string>> => {
    await delay(400);

    const { dataSource, databaseName, tableName, tableComment, fields } = data;

    let sql = `CREATE TABLE IF NOT EXISTS ${databaseName}.${tableName} (\n`;

    if (fields && fields.length > 0) {
      sql += fields.map((field: any) => {
        let line = `  ${field.fieldName} ${field.fieldType}`;
        if (field.fieldComment) {
          line += ` COMMENT '${field.fieldComment}'`;
        }
        return line;
      }).join(',\n');
    }

    sql += '\n)';

    if (tableComment) {
      sql += `\nCOMMENT '${tableComment}'`;
    }

    if (dataSource === 'Hive') {
      sql += '\nSTORED AS PARQUET';
    }

    sql += ';';

    return { data: sql };
  },

  // 校验SQL
  validateSql: async (sql: string, dataSource: string): Promise<Result<void>> => {
    await delay(600);

    // 简单的SQL校验
    if (!sql || sql.trim().length === 0) {
      return Promise.reject({ message: 'SQL不能为空' });
    }

    if (!sql.toUpperCase().includes('CREATE TABLE')) {
      return Promise.reject({ message: 'SQL语法错误：必须包含CREATE TABLE语句' });
    }

    // 检查危险SQL
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE'];
    for (const keyword of dangerousKeywords) {
      if (sql.toUpperCase().includes(keyword)) {
        return Promise.reject({ message: `SQL包含危险关键字：${keyword}` });
      }
    }

    return { data: undefined };
  },
};

// ==================== 审批流程Mock API ====================

export const mockApprovalApi = {
  // 创建审批单
  create: async (data: any): Promise<Result<number>> => {
    await delay(600);

    const newId = generateApprovalId();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newApproval: ApprovalFlow = {
      id: newId,
      flowNo: `APPR-2024-${String(newId).padStart(3, '0')}`,
      tableId: data.tableId,
      approvalType: data.approvalType || 'UPDATE',
      status: 'DRAFT',
      submitter: data.submitter || 'admin',
      submitTime: now,
      approver: null,
      approveTime: null,
      approveComment: null,
      changeContent: data.changeContent || '',
      createBy: 'admin',
      createTime: now,
      updateBy: 'admin',
      updateTime: now,
      deleted: 0,
    };

    mockApprovals.unshift(newApproval);

    return { data: newId };
  },

  // 提交审批
  submit: async (id: number): Promise<Result<void>> => {
    await delay(400);

    const approval = mockApprovals.find(a => a.id === id);
    if (!approval) {
      return Promise.reject({ message: '审批单不存在' });
    }

    approval.status = 'PENDING';
    approval.submitTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return { data: undefined };
  },

  // 审批通过
  approve: async (id: number, data: any): Promise<Result<void>> => {
    await delay(600);

    const approval = mockApprovals.find(a => a.id === id);
    if (!approval) {
      return Promise.reject({ message: '审批单不存在' });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    approval.status = 'APPROVED';
    approval.approver = data.approver || 'admin';
    approval.approveTime = now;
    approval.approveComment = data.comment || '';
    approval.updateTime = now;

    return { data: undefined };
  },

  // 审批拒绝
  reject: async (id: number, data: any): Promise<Result<void>> => {
    await delay(600);

    const approval = mockApprovals.find(a => a.id === id);
    if (!approval) {
      return Promise.reject({ message: '审批单不存在' });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    approval.status = 'REJECTED';
    approval.approver = data.approver || 'admin';
    approval.approveTime = now;
    approval.approveComment = data.comment || '';
    approval.updateTime = now;

    return { data: undefined };
  },

  // 取消审批
  cancel: async (id: number): Promise<Result<void>> => {
    await delay(400);

    const approval = mockApprovals.find(a => a.id === id);
    if (!approval) {
      return Promise.reject({ message: '审批单不存在' });
    }

    approval.status = 'CANCELLED';
    approval.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return { data: undefined };
  },

  // 发布变更
  publish: async (id: number): Promise<Result<void>> => {
    await delay(800);

    const approval = mockApprovals.find(a => a.id === id);
    if (!approval) {
      return Promise.reject({ message: '审批单不存在' });
    }

    if (approval.status !== 'APPROVED') {
      return Promise.reject({ message: '只有已通过的审批单才能发布' });
    }

    approval.status = 'PUBLISHED';
    approval.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return { data: undefined };
  },

  // 获取审批详情
  getDetail: async (id: number): Promise<Result<ApprovalFlow>> => {
    await delay(300);

    const approval = mockApprovals.find(a => a.id === id);
    if (!approval) {
      return Promise.reject({ message: '审批单不存在' });
    }

    return { data: approval };
  },

  // 获取我提交的审批单
  getMySubmissions: async (
    submitter: string,
    pageNum: number,
    pageSize: number
  ): Promise<Result<PageResult<ApprovalFlow>>> => {
    await delay(400);

    const filtered = mockApprovals.filter(a => a.submitter === submitter);
    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const records = filtered.slice(start, end);

    return {
      data: {
        records,
        total,
        pageNum,
        pageSize,
      },
    };
  },

  // 获取待我审批的审批单
  getPendingApprovals: async (
    approver: string,
    pageNum: number,
    pageSize: number
  ): Promise<Result<PageResult<ApprovalFlow>>> => {
    await delay(400);

    const filtered = mockApprovals.filter(a => a.status === 'PENDING');
    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const records = filtered.slice(start, end);

    return {
      data: {
        records,
        total,
        pageNum,
        pageSize,
      },
    };
  },

  // 获取所有审批单
  getAllApprovals: async (
    pageNum: number,
    pageSize: number
  ): Promise<Result<PageResult<ApprovalFlow>>> => {
    await delay(400);

    const total = mockApprovals.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const records = mockApprovals.slice(start, end);

    return {
      data: {
        records,
        total,
        pageNum,
        pageSize,
      },
    };
  },
};

// ==================== 操作历史Mock API ====================

export const mockHistoryApi = {
  // 查询操作历史
  query: async (params: any): Promise<Result<PageResult<OperationHistory>>> => {
    await delay(400);

    let filtered = [...mockHistory];

    // 表ID筛选
    if (params.tableId) {
      filtered = filtered.filter(h => h.tableId === params.tableId);
    }

    // 操作类型筛选
    if (params.operationType) {
      filtered = filtered.filter(h => h.operationType === params.operationType);
    }

    // 操作人筛选
    if (params.operator) {
      filtered = filtered.filter(h => h.operator === params.operator);
    }

    // 时间范围筛选
    if (params.startTime) {
      filtered = filtered.filter(h => h.operationTime >= params.startTime);
    }
    if (params.endTime) {
      filtered = filtered.filter(h => h.operationTime <= params.endTime);
    }

    // 分页
    const pageNum = params.pageNum || 1;
    const pageSize = params.pageSize || 10;
    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const records = filtered.slice(start, end);

    return {
      data: {
        records,
        total,
        pageNum,
        pageSize,
      },
    };
  },
};
