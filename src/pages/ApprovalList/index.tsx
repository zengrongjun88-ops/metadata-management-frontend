import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Card, Tabs, Modal, Form, Input } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import {
  getAllApprovals,
  getMySubmissions,
  getPendingApprovals,
  approveApproval,
  rejectApproval,
  getApprovalDetail,
} from '../../api/approval';
import type { ApprovalFlow, ApprovalActionRequest } from '../../types/approval';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, DEFAULT_OPERATOR } from '../../constants';
import { approvalStatusOptions, approvalStatusColorMap } from '../../constants/options';
import { formatDateTime } from '../../utils/format';

const ApprovalList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ApprovalFlow[]>([]);
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE_NUM,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalFlow | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [form] = Form.useForm();

  const columns: TableProps<ApprovalFlow>['columns'] = [
    {
      title: '审批单号',
      dataIndex: 'flowNo',
      key: 'flowNo',
      width: 200,
    },
    {
      title: '审批类型',
      dataIndex: 'approvalType',
      key: 'approvalType',
      width: 100,
      render: (text: string) => {
        const typeMap: Record<string, string> = {
          CREATE: '创建',
          UPDATE: '更新',
          DELETE: '删除',
        };
        return typeMap[text] || text;
      },
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text: string) => {
        const option = approvalStatusOptions?.find((opt) => opt.value === text);
        return <Tag color={approvalStatusColorMap[text]}>{option?.label || text}</Tag>;
      },
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 120,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 180,
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      width: 180,
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_: any, record: ApprovalFlow) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'PENDING' && activeTab === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const fetchData = async (tab: string, pageNum: number = pagination.current) => {
    setLoading(true);
    try {
      let response;
      if (tab === 'all') {
        response = await getAllApprovals(pageNum, pagination.pageSize);
      } else if (tab === 'mySubmissions') {
        response = await getMySubmissions(DEFAULT_OPERATOR, pageNum, pagination.pageSize);
      } else if (tab === 'pending') {
        response = await getPendingApprovals(DEFAULT_OPERATOR, pageNum, pagination.pageSize);
      }

      if (response) {
        setDataSource(response.data.records);
        setPagination({
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchData(key, 1);
  };

  const handleTableChange: TableProps<ApprovalFlow>['onChange'] = (newPagination) => {
    fetchData(activeTab, newPagination.current);
  };

  const handleViewDetail = async (record: ApprovalFlow) => {
    try {
      const response = await getApprovalDetail(record.id);
      setSelectedApproval(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取详情失败');
    }
  };

  const handleApprove = (record: ApprovalFlow) => {
    setSelectedApproval(record);
    setApprovalAction('approve');
    form.resetFields();
    setApprovalModalVisible(true);
  };

  const handleReject = (record: ApprovalFlow) => {
    setSelectedApproval(record);
    setApprovalAction('reject');
    form.resetFields();
    setApprovalModalVisible(true);
  };

  const handleApprovalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const request: ApprovalActionRequest = {
        approver: DEFAULT_OPERATOR,
        approveComment: values.approveComment,
      };

      if (approvalAction === 'approve') {
        await approveApproval(selectedApproval!.id, request);
        message.success('审批通过');
      } else {
        await rejectApproval(selectedApproval!.id, request);
        message.success('审批拒绝');
      }

      setApprovalModalVisible(false);
      fetchData(activeTab);
    } catch (error) {
      message.error('操作失败');
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, []);

  const tabItems = [
    {
      key: 'all',
      label: '全部审批',
    },
    {
      key: 'mySubmissions',
      label: '我提交的',
    },
    {
      key: 'pending',
      label: '待我审批',
    },
  ];

  return (
    <div>
      <Card>
        <Tabs activeKey={activeTab} items={tabItems} onChange={handleTabChange} />
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title="审批详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedApproval && (
          <div>
            <p>
              <strong>审批单号：</strong>
              {selectedApproval.flowNo}
            </p>
            <p>
              <strong>审批类型：</strong>
              {selectedApproval.approvalType}
            </p>
            <p>
              <strong>审批状态：</strong>
              <Tag color={approvalStatusColorMap[selectedApproval.status]}>
                {
                  approvalStatusOptions?.find((opt) => opt.value === selectedApproval.status)
                    ?.label
                }
              </Tag>
            </p>
            <p>
              <strong>提交人：</strong>
              {selectedApproval.submitter}
            </p>
            <p>
              <strong>提交时间：</strong>
              {formatDateTime(selectedApproval.submitTime)}
            </p>
            <p>
              <strong>审批人：</strong>
              {selectedApproval.approver || '-'}
            </p>
            <p>
              <strong>审批时间：</strong>
              {formatDateTime(selectedApproval.approveTime)}
            </p>
            <p>
              <strong>审批意见：</strong>
              {selectedApproval.approveComment || '-'}
            </p>
            {selectedApproval.changeContent && (
              <div>
                <strong>变更内容：</strong>
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: 16,
                    borderRadius: 4,
                    overflow: 'auto',
                    marginTop: 8,
                  }}
                >
                  {selectedApproval.changeContent}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={approvalAction === 'approve' ? '审批通过' : '审批拒绝'}
        open={approvalModalVisible}
        onOk={handleApprovalSubmit}
        onCancel={() => setApprovalModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="审批意见"
            name="approveComment"
            rules={[{ required: approvalAction === 'reject', message: '拒绝时必须填写审批意见' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入审批意见" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ApprovalList;
