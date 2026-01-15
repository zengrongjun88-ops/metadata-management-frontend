import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Button, Tag, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { getTableById } from '../../api/metadata';
import type { MetadataTable, MetadataField } from '../../types/metadata';
import {
  sensitivityLevelColorMap,
  importanceLevelColorMap,
  yesNoOptions,
} from '../../constants/options';
import { formatDateTime, formatFileSize, parseJSON } from '../../utils/format';

const TableDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<MetadataTable | null>(null);

  const fieldColumns: TableProps<MetadataField>['columns'] = [
    {
      title: '序号',
      dataIndex: 'fieldOrder',
      key: 'fieldOrder',
      width: 80,
    },
    {
      title: '字段名',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 200,
    },
    {
      title: '字段描述',
      dataIndex: 'fieldComment',
      key: 'fieldComment',
      width: 250,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 120,
    },
    {
      title: '主键',
      dataIndex: 'isPrimaryKey',
      key: 'isPrimaryKey',
      width: 80,
      render: (value: number) => (
        <Tag color={value === 1 ? 'success' : 'default'}>
          {yesNoOptions?.find((opt) => opt.value === value)?.label}
        </Tag>
      ),
    },
    {
      title: '可为空',
      dataIndex: 'isNullable',
      key: 'isNullable',
      width: 80,
      render: (value: number) => (
        <Tag color={value === 1 ? 'warning' : 'default'}>
          {yesNoOptions?.find((opt) => opt.value === value)?.label}
        </Tag>
      ),
    },
    {
      title: '加密',
      dataIndex: 'isEncrypted',
      key: 'isEncrypted',
      width: 80,
      render: (value: number) => (
        <Tag color={value === 1 ? 'error' : 'default'}>
          {yesNoOptions?.find((opt) => opt.value === value)?.label}
        </Tag>
      ),
    },
    {
      title: '分区键',
      dataIndex: 'isPartitionKey',
      key: 'isPartitionKey',
      width: 80,
      render: (value: number) => (
        <Tag color={value === 1 ? 'processing' : 'default'}>
          {yesNoOptions?.find((opt) => opt.value === value)?.label}
        </Tag>
      ),
    },
    {
      title: '敏感等级',
      dataIndex: 'sensitivityLevel',
      key: 'sensitivityLevel',
      width: 100,
      render: (text: string) =>
        text ? <Tag color={sensitivityLevelColorMap[text]}>{text}</Tag> : '-',
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 120,
      render: (text: string) => text || '-',
    },
  ];

  const fetchTableDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getTableById(Number(id));
      setTableData(response.data);
    } catch (error) {
      message.error('获取表详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!tableData) {
    return null;
  }

  const customTags = parseJSON<string[]>(tableData.customTags);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tables')}>
          返回
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/tables/edit/${id}`)}
        >
          编辑
        </Button>
      </Space>

      <Card title="表基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="表名">{tableData.tableName}</Descriptions.Item>
          <Descriptions.Item label="数据库名">{tableData.databaseName}</Descriptions.Item>
          <Descriptions.Item label="数据源">{tableData.dataSource}</Descriptions.Item>
          <Descriptions.Item label="Hive账号">{tableData.hiveAccount || '-'}</Descriptions.Item>
          <Descriptions.Item label="表大小">
            {formatFileSize(tableData.tableSize)}
          </Descriptions.Item>
          <Descriptions.Item label="数仓分层">
            {tableData.warehouseLayer?.toUpperCase()}
          </Descriptions.Item>
          <Descriptions.Item label="一级主题">
            {tableData.themeFirst?.toUpperCase()}
          </Descriptions.Item>
          <Descriptions.Item label="二级主题">
            {tableData.themeSecond || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="敏感等级">
            <Tag color={sensitivityLevelColorMap[tableData.sensitivityLevel]}>
              {tableData.sensitivityLevel}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="重要等级">
            <Tag color={importanceLevelColorMap[tableData.importanceLevel]}>
              {tableData.importanceLevel}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="分区类型">{tableData.partitionType}</Descriptions.Item>
          <Descriptions.Item label="分区保留天数">
            {tableData.partitionRetentionDays || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新频率">{tableData.updateFrequency}</Descriptions.Item>
          <Descriptions.Item label="责任人">{tableData.owner}</Descriptions.Item>
          <Descriptions.Item label="自定义标签" span={2}>
            {customTags.length > 0 ? (
              <Space>
                {customTags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Space>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="表描述" span={2}>
            <div dangerouslySetInnerHTML={{ __html: tableData.tableComment || '-' }} />
          </Descriptions.Item>
          <Descriptions.Item label="创建人">{tableData.createBy}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDateTime(tableData.createTime)}
          </Descriptions.Item>
          <Descriptions.Item label="更新人">{tableData.updateBy || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDateTime(tableData.updateTime)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="字段信息">
        <Table
          columns={fieldColumns}
          dataSource={tableData.fields}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1400 }}
        />
      </Card>

      {tableData.createSql && (
        <Card title="建表SQL" style={{ marginTop: 16 }}>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
            {tableData.createSql}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default TableDetail;
