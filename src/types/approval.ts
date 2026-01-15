/**
 * 审批流程类型
 */
export interface ApprovalFlow {
  id: number;
  flowNo: string;
  tableId: number;
  approvalType: string;
  status: string;
  submitter: string;
  submitTime: string;
  approver?: string;
  approveTime?: string;
  approveComment?: string;
  changeContent?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

/**
 * 审批请求
 */
export interface ApprovalRequest {
  tableId: number;
  approvalType: string;
  changeContent: string;
}

/**
 * 审批操作请求
 */
export interface ApprovalActionRequest {
  approver: string;
  approveComment?: string;
}

/**
 * 操作历史类型
 */
export interface OperationHistory {
  id: number;
  tableId: number;
  tableName: string;
  databaseName: string;
  operationType: string;
  operator: string;
  operationTime: string;
  changeContent?: string;
  approvalId?: number;
}
