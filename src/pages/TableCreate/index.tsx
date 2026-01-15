import React, { useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createTable } from '../../api/metadata';
import type { TableCreateRequest } from '../../types/metadata';
import TableForm from './TableForm';

const TableCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: TableCreateRequest) => {
    setLoading(true);
    try {
      await createTable(values);
      message.success('创建成功');
      navigate('/tables');
    } catch (error) {
      message.error('创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tables')}>
          返回
        </Button>
      </Space>

      <Card title="创建元数据表">
        <TableForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default TableCreate;
