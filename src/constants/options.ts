import type { SelectProps } from 'antd';

/**
 * 数据源类型选项
 */
export const dataSourceOptions: SelectProps['options'] = [
  { label: 'Apache Hive', value: 'Hive' },
  { label: 'Apache Paimon', value: 'Paimon' },
  { label: 'Apache Iceberg', value: 'Iceberg' },
  { label: 'ClickHouse', value: 'ClickHouse' },
  { label: 'Google BigQuery', value: 'BigQuery' },
  { label: 'StarRocks', value: 'StarRocks' },
];

/**
 * 数仓分层选项
 */
export const warehouseLayerOptions: SelectProps['options'] = [
  { label: 'ODS - 操作数据层', value: 'ods' },
  { label: 'EDW - 企业数据仓库层', value: 'edw' },
  { label: 'CDM - 公共数据模型层', value: 'cdm' },
  { label: 'MID - 中间层', value: 'mid' },
  { label: 'DIM - 维度层', value: 'dim' },
  { label: 'DWD - 明细数据层', value: 'dwd' },
  { label: 'DWS - 汇总数据层', value: 'dws' },
  { label: 'ADS - 应用数据层', value: 'ads' },
];

/**
 * 一级主题选项
 */
export const primaryThemeOptions: SelectProps['options'] = [
  { label: 'USR - 用户主题', value: 'usr' },
  { label: 'MKT - 营销主题', value: 'mkt' },
  { label: 'ORD - 订单主题', value: 'ord' },
  { label: 'FIN - 财务主题', value: 'fin' },
  { label: 'PRD - 产品主题', value: 'prd' },
  { label: 'PRJ - 项目主题', value: 'prj' },
  { label: 'TRF - 流量主题', value: 'trf' },
  { label: 'SRV - 服务主题', value: 'srv' },
];

/**
 * 敏感等级选项
 */
export const sensitivityLevelOptions: SelectProps['options'] = [
  { label: 'L1 - 公开', value: 'L1' },
  { label: 'L2 - 内部', value: 'L2' },
  { label: 'L3 - 敏感', value: 'L3' },
  { label: 'L4 - 高度敏感', value: 'L4' },
];

/**
 * 重要等级选项
 */
export const importanceLevelOptions: SelectProps['options'] = [
  { label: 'P0 - 核心', value: 'P0' },
  { label: 'P1 - 重要', value: 'P1' },
  { label: 'P2 - 一般', value: 'P2' },
  { label: 'P3 - 低', value: 'P3' },
];

/**
 * 分区类型选项
 */
export const partitionTypeOptions: SelectProps['options'] = [
  { label: 'FULL - 全量', value: 'FULL' },
  { label: 'INCR - 增量', value: 'INCR' },
  { label: 'NONE - 无分区', value: 'NONE' },
];

/**
 * 更新频率选项
 */
export const updateFrequencyOptions: SelectProps['options'] = [
  { label: 'REALTIME - 实时', value: 'REALTIME' },
  { label: 'HOURLY - 小时', value: 'HOURLY' },
  { label: 'DAILY - 天', value: 'DAILY' },
  { label: 'WEEKLY - 周', value: 'WEEKLY' },
  { label: 'MONTHLY - 月', value: 'MONTHLY' },
  { label: 'ON_DEMAND - 按需', value: 'ON_DEMAND' },
];

/**
 * 字段类型选项
 */
export const fieldTypeOptions: SelectProps['options'] = [
  { label: 'STRING', value: 'STRING' },
  { label: 'INT', value: 'INT' },
  { label: 'BIGINT', value: 'BIGINT' },
  { label: 'DOUBLE', value: 'DOUBLE' },
  { label: 'DECIMAL', value: 'DECIMAL' },
  { label: 'BOOLEAN', value: 'BOOLEAN' },
  { label: 'DATE', value: 'DATE' },
  { label: 'TIMESTAMP', value: 'TIMESTAMP' },
  { label: 'ARRAY', value: 'ARRAY' },
  { label: 'MAP', value: 'MAP' },
  { label: 'STRUCT', value: 'STRUCT' },
];

/**
 * 审批状态选项
 */
export const approvalStatusOptions: SelectProps['options'] = [
  { label: '草稿', value: 'DRAFT' },
  { label: '待审批', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
  { label: '已取消', value: 'CANCELLED' },
  { label: '已发布', value: 'PUBLISHED' },
];

/**
 * 操作类型选项
 */
export const operationTypeOptions: SelectProps['options'] = [
  { label: '创建', value: 'CREATE' },
  { label: '更新', value: 'UPDATE' },
  { label: '删除', value: 'DELETE' },
];

/**
 * 是否选项
 */
export const yesNoOptions: SelectProps['options'] = [
  { label: '否', value: 0 },
  { label: '是', value: 1 },
];

/**
 * 审批状态标签颜色映射
 */
export const approvalStatusColorMap: Record<string, string> = {
  DRAFT: 'default',
  PENDING: 'processing',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
  PUBLISHED: 'success',
};

/**
 * 敏感等级标签颜色映射
 */
export const sensitivityLevelColorMap: Record<string, string> = {
  L1: 'success',
  L2: 'processing',
  L3: 'warning',
  L4: 'error',
};

/**
 * 重要等级标签颜色映射
 */
export const importanceLevelColorMap: Record<string, string> = {
  P0: 'error',
  P1: 'warning',
  P2: 'processing',
  P3: 'default',
};
