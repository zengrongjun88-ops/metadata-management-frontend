/**
 * 元数据字段类型
 */
export interface MetadataField {
  id?: number;
  tableId?: number;
  fieldOrder: number;
  fieldName: string;
  fieldComment: string;
  fieldType: string;
  isPrimaryKey: number;
  isNullable: number;
  isEncrypted: number;
  isPartitionKey: number;
  sensitivityLevel?: string;
  defaultValue?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

/**
 * 元数据表类型
 */
export interface MetadataTable {
  id?: number;
  tableName: string;
  tableComment: string;
  databaseName: string;
  dataSource: string;
  hiveAccount?: string;
  tableSize?: number;
  warehouseLayer: string;
  themeFirst: string;
  themeSecond?: string;
  sensitivityLevel: string;
  importanceLevel: string;
  partitionType: string;
  partitionRetentionDays?: number;
  updateFrequency: string;
  owner: string;
  customTags?: string;
  createSql?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  fields?: MetadataField[];
}

/**
 * 表查询请求
 */
export interface TableSearchRequest {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  tableName?: string;
  databaseName?: string;
  dataSource?: string;
  warehouseLayer?: string;
  themeFirst?: string;
  owner?: string;
  sensitivityLevel?: string;
  importanceLevel?: string;
}

/**
 * 表创建请求
 */
export interface TableCreateRequest {
  tableName: string;
  tableComment: string;
  databaseName: string;
  dataSource: string;
  hiveAccount?: string;
  warehouseLayer: string;
  themeFirst: string;
  themeSecond?: string;
  sensitivityLevel: string;
  importanceLevel: string;
  partitionType: string;
  partitionRetentionDays?: number;
  updateFrequency: string;
  owner: string;
  customTags?: string;
  createSql?: string;
  fields: MetadataField[];
}

/**
 * 表更新请求
 */
export interface TableUpdateRequest {
  id: number;
  tableComment?: string;
  hiveAccount?: string;
  warehouseLayer?: string;
  themeFirst?: string;
  themeSecond?: string;
  sensitivityLevel?: string;
  importanceLevel?: string;
  partitionType?: string;
  partitionRetentionDays?: number;
  updateFrequency?: string;
  owner?: string;
  customTags?: string;
}

/**
 * 字段创建请求
 */
export interface FieldCreateRequest {
  tableId: number;
  fieldOrder: number;
  fieldName: string;
  fieldComment: string;
  fieldType: string;
  isPrimaryKey: number;
  isNullable: number;
  isEncrypted: number;
  isPartitionKey: number;
  sensitivityLevel?: string;
  defaultValue?: string;
}

/**
 * 字段更新请求
 */
export interface FieldUpdateRequest {
  id: number;
  fieldComment?: string;
  fieldType?: string;
  isNullable?: number;
  isEncrypted?: number;
  sensitivityLevel?: string;
  defaultValue?: string;
}
