import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Tag, message, Card } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { pageQueryTables, deleteTable } from '../../api/metadata';
import type { MetadataTable, TableSearchRequest } from '../../types/metadata';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '../../constants';
import {
  dataSourceOptions,
  warehouseLayerOptions,
  primaryThemeOptions,
  sensitivityLevelColorMap,
  importanceLevelColorMap,
} from '../../constants/options';
import { formatDateTime, formatFileSize } from '../../utils/format';

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<MetadataTable[]>([]);
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE_NUM,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const columns: TableProps<MetadataTable>['columns'] = [
    {
      title: '表名',
      dataIndex: 'tableName',
      key: 'tableName',
      width: 200,
      fixed: 'left',
      render: (text: string, record: MetadataTable) => (
        <a onClick={() => navigate(`/tables/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      key: 'tableComment',
      width: 200,
      ellipsis: true,
    },
    {
      title: '数据库名',
      dataIndex: 'databaseName',
      key: 'databaseName',
      width: 150,
    },
    {
      title: '数据源',
      dataIndex: 'dataSource',
      key: 'dataSource',
      width: 120,
    },
    {
      title: '数仓分层',
      dataIndex: 'warehouseLayer',
      key: 'warehouseLayer',
      width: 100,
      render: (text: string) => text?.toUpperCase(),
    },
    {
      title: '一级主题',
      dataIndex: 'themeFirst',
      key: 'themeFirst',
      width: 100,
      render: (text: string) => text?.toUpperCase(),
    },
    {
      title: '敏感等级',
      dataIndex: 'sensitivityLevel',
      key: 'sensitivityLevel',
      width: 100,
      render: (text: string) => (
        <Tag color={sensitivityLevelColorMap[text]}>{text}</Tag>
      ),
    },
    {
      title: '重要等级',
      dataIndex: 'importanceLevel',
      key: 'importanceLevel',
      width: 100,
      render: (text: string) => (
        <Tag color={importanceLevelColorMap[text]}>{text}</Tag>
      ),
    },
    {
      title: '表大小',
      dataIndex: 'tableSize',
      key: 'tableSize',
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      key: 'owner',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: any, record: MetadataTable) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/tables/detail/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/tables/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async (params?: Partial<TableSearchRequest>) => {
    setLoading(true);
    try {
      const searchParams: TableSearchRequest = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      };

      const response = await pageQueryTables(searchParams);
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
    fetchData({ ...values, pageNum: 1 });
  };

  const handleReset = () => {
    form.resetFields();
    fetchData({ pageNum: 1 });
  };

  const handleDelete = async (record: MetadataTable) => {
    try {
      await deleteTable(record.id!);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleTableChange: TableProps<MetadataTable>['onChange'] = (newPagination) => {
    const values = form.getFieldsValue();
    fetchData({
      ...values,
      pageNum: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="tableName" label="表名">
            <Input placeholder="请输入表名" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="databaseName" label="数据库名">
            <Input placeholder="请输入数据库名" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="dataSource" label="数据源">
            <Select
              placeholder="请选择数据源"
              allowClear
              style={{ width: 150 }}
              options={dataSourceOptions}
            />
          </Form.Item>
          <Form.Item name="warehouseLayer" label="数仓分层">
            <Select
              placeholder="请选择数仓分层"
              allowClear
              style={{ width: 150 }}
              options={warehouseLayerOptions}
            />
          </Form.Item>
          <Form.Item name="themeFirst" label="一级主题">
            <Select
              placeholder="请选择一级主题"
              allowClear
              style={{ width: 150 }}
              options={primaryThemeOptions}
            />
          </Form.Item>
          <Form.Item name="owner" label="责任人">
            <Input placeholder="请输入责任人" allowClear style={{ width: 150 }} />
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

      <Card
        title="元数据表列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/tables/create')}>
            创建表
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1800 }}
        />
      </Card>
    </div>
  );
};

export default TableList;
