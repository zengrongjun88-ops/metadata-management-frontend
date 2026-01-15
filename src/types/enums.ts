/**
 * 数据源类型常量
 */
export const DataSourceType = {
  HIVE: 'Hive',
  PAIMON: 'Paimon',
  ICEBERG: 'Iceberg',
  CLICKHOUSE: 'ClickHouse',
  BIGQUERY: 'BigQuery',
  STARROCKS: 'StarRocks',
} as const;

export type DataSourceType = (typeof DataSourceType)[keyof typeof DataSourceType];

/**
 * 数仓分层常量
 */
export const WarehouseLayer = {
  ODS: 'ods',
  EDW: 'edw',
  CDM: 'cdm',
  MID: 'mid',
  DIM: 'dim',
  DWD: 'dwd',
  DWS: 'dws',
  ADS: 'ads',
} as const;

export type WarehouseLayer = (typeof WarehouseLayer)[keyof typeof WarehouseLayer];

/**
 * 一级主题常量
 */
export const PrimaryTheme = {
  USR: 'usr',
  MKT: 'mkt',
  ORD: 'ord',
  FIN: 'fin',
  PRD: 'prd',
  PRJ: 'prj',
  TRF: 'trf',
  SRV: 'srv',
} as const;

export type PrimaryTheme = (typeof PrimaryTheme)[keyof typeof PrimaryTheme];

/**
 * 敏感等级常量
 */
export const SensitivityLevel = {
  L1: 'L1',
  L2: 'L2',
  L3: 'L3',
  L4: 'L4',
} as const;

export type SensitivityLevel = (typeof SensitivityLevel)[keyof typeof SensitivityLevel];

/**
 * 重要等级常量
 */
export const ImportanceLevel = {
  P0: 'P0',
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
} as const;

export type ImportanceLevel = (typeof ImportanceLevel)[keyof typeof ImportanceLevel];

/**
 * 分区类型常量
 */
export const PartitionType = {
  FULL: 'FULL',
  INCR: 'INCR',
  NONE: 'NONE',
} as const;

export type PartitionType = (typeof PartitionType)[keyof typeof PartitionType];

/**
 * 更新频率常量
 */
export const UpdateFrequency = {
  REALTIME: 'REALTIME',
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  ON_DEMAND: 'ON_DEMAND',
} as const;

export type UpdateFrequency = (typeof UpdateFrequency)[keyof typeof UpdateFrequency];

/**
 * 审批状态常量
 */
export const ApprovalStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  PUBLISHED: 'PUBLISHED',
} as const;

export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

/**
 * 操作类型常量
 */
export const OperationType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type OperationType = (typeof OperationType)[keyof typeof OperationType];

/**
 * 字段类型常量
 */
export const FieldType = {
  STRING: 'STRING',
  INT: 'INT',
  BIGINT: 'BIGINT',
  DOUBLE: 'DOUBLE',
  DECIMAL: 'DECIMAL',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  TIMESTAMP: 'TIMESTAMP',
  ARRAY: 'ARRAY',
  MAP: 'MAP',
  STRUCT: 'STRUCT',
} as const;

export type FieldType = (typeof FieldType)[keyof typeof FieldType];
