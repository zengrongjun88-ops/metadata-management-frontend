/**
 * 审批流程API服务
 * 支持Mock模式和真实API模式切换
 */

import { get, post } from './request';
import { mockApprovalApi } from './mockService';
import { USE_MOCK } from '@/constants';
import type { Result, PageResult } from '../types/common';
import type { ApprovalFlow, ApprovalRequest, ApprovalActionRequest } from '../types/approval';

// 根据USE_MOCK配置决定使用Mock服务还是真实API
const api = USE_MOCK ? mockApprovalApi : {
  // 真实API实现
  create: (data: ApprovalRequest): Promise<Result<number>> => {
    return post<number>('/metadata/approvals', data);
  },

  submit: (id: number): Promise<Result<void>> => {
    return post<void>(`/metadata/approvals/${id}/submit`);
  },

  approve: (id: number, data: ApprovalActionRequest): Promise<Result<void>> => {
    return post<void>(`/metadata/approvals/${id}/approve`, data);
  },

  reject: (id: number, data: ApprovalActionRequest): Promise<Result<void>> => {
    return post<void>(`/metadata/approvals/${id}/reject`, data);
  },

  cancel: (id: number): Promise<Result<void>> => {
    return post<void>(`/metadata/approvals/${id}/cancel`);
  },

  publish: (id: number): Promise<Result<void>> => {
    return post<void>(`/metadata/approvals/${id}/publish`);
  },

  getDetail: (id: number): Promise<Result<ApprovalFlow>> => {
    return get<ApprovalFlow>(`/metadata/approvals/${id}`);
  },

  getMySubmissions: (submitter: string, pageNum: number, pageSize: number): Promise<Result<PageResult<ApprovalFlow>>> => {
    return get<PageResult<ApprovalFlow>>('/metadata/approvals/my-submissions', {
      params: { submitter, pageNum, pageSize },
    });
  },

  getPendingApprovals: (approver: string, pageNum: number, pageSize: number): Promise<Result<PageResult<ApprovalFlow>>> => {
    return get<PageResult<ApprovalFlow>>('/metadata/approvals/pending', {
      params: { approver, pageNum, pageSize },
    });
  },

  getAllApprovals: (pageNum: number, pageSize: number): Promise<Result<PageResult<ApprovalFlow>>> => {
    return get<PageResult<ApprovalFlow>>('/metadata/approvals/all', {
      params: { pageNum, pageSize },
    });
  },
};

// 导出统一的API接口
export const approvalApi = api;

/**
 * 创建审批单
 */
export function createApproval(data: ApprovalRequest) {
  return api.create(data);
}

/**
 * 提交审批
 */
export function submitApproval(id: number) {
  return api.submit(id);
}

/**
 * 审批通过
 */
export function approveApproval(id: number, data: ApprovalActionRequest) {
  return api.approve(id, data);
}

/**
 * 审批拒绝
 */
export function rejectApproval(id: number, data: ApprovalActionRequest) {
  return api.reject(id, data);
}

/**
 * 取消审批
 */
export function cancelApproval(id: number) {
  return api.cancel(id);
}

/**
 * 发布变更
 */
export function publishApproval(id: number) {
  return api.publish(id);
}

/**
 * 获取审批详情
 */
export function getApprovalDetail(id: number) {
  return api.getDetail(id);
}

/**
 * 获取我提交的审批单
 */
export function getMySubmissions(submitter: string, pageNum: number, pageSize: number) {
  return api.getMySubmissions(submitter, pageNum, pageSize);
}

/**
 * 获取待我审批的审批单
 */
export function getPendingApprovals(approver: string, pageNum: number, pageSize: number) {
  return api.getPendingApprovals(approver, pageNum, pageSize);
}

/**
 * 获取所有审批单
 */
export function getAllApprovals(pageNum: number, pageSize: number) {
  return api.getAllApprovals(pageNum, pageSize);
}
