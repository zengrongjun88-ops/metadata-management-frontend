import { get, post } from './request';
import type { PageResult } from '../types/common';
import type { ApprovalFlow, ApprovalRequest, ApprovalActionRequest } from '../types/approval';

/**
 * 创建审批单
 */
export function createApproval(data: ApprovalRequest) {
  return post<number>('/metadata/approvals', data);
}

/**
 * 提交审批
 */
export function submitApproval(id: number) {
  return post<void>(`/metadata/approvals/${id}/submit`);
}

/**
 * 审批通过
 */
export function approveApproval(id: number, data: ApprovalActionRequest) {
  return post<void>(`/metadata/approvals/${id}/approve`, data);
}

/**
 * 审批拒绝
 */
export function rejectApproval(id: number, data: ApprovalActionRequest) {
  return post<void>(`/metadata/approvals/${id}/reject`, data);
}

/**
 * 取消审批
 */
export function cancelApproval(id: number) {
  return post<void>(`/metadata/approvals/${id}/cancel`);
}

/**
 * 发布变更
 */
export function publishApproval(id: number) {
  return post<void>(`/metadata/approvals/${id}/publish`);
}

/**
 * 获取审批详情
 */
export function getApprovalDetail(id: number) {
  return get<ApprovalFlow>(`/metadata/approvals/${id}`);
}

/**
 * 获取我提交的审批单
 */
export function getMySubmissions(submitter: string, pageNum: number, pageSize: number) {
  return get<PageResult<ApprovalFlow>>('/metadata/approvals/my-submissions', {
    params: { submitter, pageNum, pageSize },
  });
}

/**
 * 获取待我审批的审批单
 */
export function getPendingApprovals(approver: string, pageNum: number, pageSize: number) {
  return get<PageResult<ApprovalFlow>>('/metadata/approvals/pending', {
    params: { approver, pageNum, pageSize },
  });
}

/**
 * 获取所有审批单
 */
export function getAllApprovals(pageNum: number, pageSize: number) {
  return get<PageResult<ApprovalFlow>>('/metadata/approvals/all', {
    params: { pageNum, pageSize },
  });
}
