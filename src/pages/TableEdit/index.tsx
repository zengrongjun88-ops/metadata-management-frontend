import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getTableById, updateTable } from '../../api/metadata';
import type { TableCreateRequest, TableUpdateRequest } from '../../types/metadata';
import TableForm from '../TableCreate/TableForm';

const TableEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<TableCreateRequest>>();

  const fetchTableDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getTableById(Number(id));
      setInitialValues(response.data);
    } catch (error) {
      message.error('获取表详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: TableCreateRequest) => {
    if (!id) return;

    setSubmitLoading(true);
    try {
      const updateData: TableUpdateRequest = {
        id: Number(id),
        tableComment: values.tableComment,
        hiveAccount: values.hiveAccount,
        warehouseLayer: values.warehouseLayer,
        themeFirst: values.themeFirst,
        themeSecond: values.themeSecond,
        sensitivityLevel: values.sensitivityLevel,
        importanceLevel: values.importanceLevel,
        partitionType: values.partitionType,
        partitionRetentionDays: values.partitionRetentionDays,
        updateFrequency: values.updateFrequency,
        owner: values.owner,
        customTags: values.customTags,
      };

      await updateTable(Number(id), updateData);
      message.success('更新成功');
      navigate('/tables');
    } catch (error) {
      message.error('更新失败');
    } finally {
      setSubmitLoading(false);
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

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tables')}>
          返回
        </Button>
      </Space>

      <Card title="编辑元数据表">
        {initialValues && (
          <TableForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        )}
      </Card>
    </div>
  );
};

export default TableEdit;
