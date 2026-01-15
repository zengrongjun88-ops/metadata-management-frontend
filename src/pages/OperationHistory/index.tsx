import React, { useState } from 'react';
import { Table, Button, Form, Input, Space, message, Card } from 'antd';
import type { TableProps } from 'antd';
import { getUserHistory } from '../../api/history';
import type { OperationHistory } from '../../types/approval';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '../../constants';
import { formatDateTime } from '../../utils/format';

const OperationHistoryPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OperationHistory[]>([]);
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE_NUM,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const columns: TableProps<OperationHistory>['columns'] = [
    {
      title: '表名',
      dataIndex: 'tableName',
      key: 'tableName',
      width: 200,
    },
    {
      title: '数据库名',
      dataIndex: 'databaseName',
      key: 'databaseName',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 120,
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
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      width: 180,
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '变更内容',
      dataIndex: 'changeContent',
      key: 'changeContent',
      width: 300,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '审批单ID',
      dataIndex: 'approvalId',
      key: 'approvalId',
      width: 120,
      render: (id: number) => id || '-',
    },
  ];

  const fetchData = async (params: { operator?: string; pageNum?: number }) => {
    setLoading(true);
    try {
      const pageNum = params.pageNum || pagination.current;
      const pageSize = pagination.pageSize;

      let response;
      if (params.operator) {
        response = await getUserHistory(params.operator, pageNum, pageSize);
      } else {
        // 如果没有搜索条件，显示空数据
        setDataSource([]);
        setPagination({
          current: DEFAULT_PAGE_NUM,
          pageSize: DEFAULT_PAGE_SIZE,
          total: 0,
        });
        setLoading(false);
        return;
      }

      setDataSource(response.data.records);
      setPagination({
        current: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    if (!values.operator) {
      message.warning('请输入操作人');
      return;
    }
    fetchData({ operator: values.operator, pageNum: 1 });
  };

  const handleReset = () => {
    form.resetFields();
    setDataSource([]);
    setPagination({
      current: DEFAULT_PAGE_NUM,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    });
  };

  const handleTableChange: TableProps<OperationHistory>['onChange'] = (newPagination) => {
    const values = form.getFieldsValue();
    fetchData({
      operator: values.operator,
      pageNum: newPagination.current,
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="operator" label="操作人">
            <Input placeholder="请输入操作人域账号" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="操作历史记录">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default OperationHistoryPage;
