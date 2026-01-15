import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Table,
  Modal,
  Row,
  Col,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormProps, TableProps } from 'antd';
import type { TableCreateRequest, MetadataField } from '../../types/metadata';
import {
  dataSourceOptions,
  warehouseLayerOptions,
  primaryThemeOptions,
  sensitivityLevelOptions,
  importanceLevelOptions,
  partitionTypeOptions,
  updateFrequencyOptions,
  fieldTypeOptions,
  yesNoOptions,
} from '../../constants/options';
import { generateSql } from '../../api/metadata';

interface TableFormProps {
  initialValues?: Partial<TableCreateRequest>;
  onSubmit: (values: TableCreateRequest) => void;
  loading?: boolean;
}

const TableForm: React.FC<TableFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState<MetadataField[]>(initialValues?.fields || []);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<MetadataField | null>(null);
  const [fieldForm] = Form.useForm();
  const [sqlModalVisible, setSqlModalVisible] = useState(false);
  const [generatedSql, setGeneratedSql] = useState('');

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
      width: 150,
    },
    {
      title: '字段描述',
      dataIndex: 'fieldComment',
      key: 'fieldComment',
      width: 200,
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
      render: (value: number) => (value === 1 ? '是' : '否'),
    },
    {
      title: '可为空',
      dataIndex: 'isNullable',
      key: 'isNullable',
      width: 80,
      render: (value: number) => (value === 1 ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: MetadataField, index: number) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditField(record, index)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteField(index)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddField = () => {
    setEditingField(null);
    fieldForm.resetFields();
    fieldForm.setFieldsValue({
      fieldOrder: fields.length + 1,
      isPrimaryKey: 0,
      isNullable: 1,
      isEncrypted: 0,
      isPartitionKey: 0,
    });
    setFieldModalVisible(true);
  };

  const handleEditField = (field: MetadataField, index: number) => {
    setEditingField({ ...field, fieldOrder: index });
    fieldForm.setFieldsValue(field);
    setFieldModalVisible(true);
  };

  const handleDeleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    // 重新排序
    newFields.forEach((field, i) => {
      field.fieldOrder = i + 1;
    });
    setFields(newFields);
  };

  const handleFieldModalOk = async () => {
    try {
      const values = await fieldForm.validateFields();
      if (editingField && editingField.fieldOrder !== undefined) {
        // 编辑
        const newFields = [...fields];
        newFields[editingField.fieldOrder] = values;
        setFields(newFields);
      } else {
        // 新增
        setFields([...fields, values]);
      }
      setFieldModalVisible(false);
    } catch (error) {
      console.error('Field form validation failed:', error);
    }
  };

  const handleGenerateSql = async () => {
    try {
      const values = await form.validateFields();
      const tableData: TableCreateRequest = {
        ...values,
        fields,
      };
      const response = await generateSql(tableData);
      setGeneratedSql(response.data);
      setSqlModalVisible(true);
    } catch (error) {
      message.error('生成SQL失败');
    }
  };

  const handleSubmit: FormProps['onFinish'] = async (values) => {
    if (fields.length === 0) {
      message.error('请至少添加一个字段');
      return;
    }

    const tableData: TableCreateRequest = {
      ...values,
      fields,
    };

    onSubmit(tableData);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.fields) {
        setFields(initialValues.fields);
      }
    }
  }, [initialValues]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="表名"
              name="tableName"
              rules={[{ required: true, message: '请输入表名' }]}
            >
              <Input placeholder="请输入表名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="数据库名"
              name="databaseName"
              rules={[{ required: true, message: '请输入数据库名' }]}
            >
              <Input placeholder="请输入数据库名" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="表描述"
          name="tableComment"
          rules={[{ required: true, message: '请输入表描述' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入表描述" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="数据源"
              name="dataSource"
              rules={[{ required: true, message: '请选择数据源' }]}
            >
              <Select placeholder="请选择数据源" options={dataSourceOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Hive账号" name="hiveAccount">
              <Input placeholder="请输入Hive账号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="责任人"
              name="owner"
              rules={[{ required: true, message: '请输入责任人' }]}
            >
              <Input placeholder="请输入责任人域账号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="数仓分层"
              name="warehouseLayer"
              rules={[{ required: true, message: '请选择数仓分层' }]}
            >
              <Select placeholder="请选择数仓分层" options={warehouseLayerOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="一级主题"
              name="themeFirst"
              rules={[{ required: true, message: '请选择一级主题' }]}
            >
              <Select placeholder="请选择一级主题" options={primaryThemeOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="二级主题" name="themeSecond">
              <Input placeholder="请输入二级主题" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="敏感等级"
              name="sensitivityLevel"
              rules={[{ required: true, message: '请选择敏感等级' }]}
            >
              <Select placeholder="请选择敏感等级" options={sensitivityLevelOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="重要等级"
              name="importanceLevel"
              rules={[{ required: true, message: '请选择重要等级' }]}
            >
              <Select placeholder="请选择重要等级" options={importanceLevelOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="更新频率"
              name="updateFrequency"
              rules={[{ required: true, message: '请选择更新频率' }]}
            >
              <Select placeholder="请选择更新频率" options={updateFrequencyOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="分区类型"
              name="partitionType"
              rules={[{ required: true, message: '请选择分区类型' }]}
            >
              <Select placeholder="请选择分区类型" options={partitionTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="分区保留天数" name="partitionRetentionDays">
              <InputNumber
                placeholder="请输入分区保留天数"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="自定义标签" name="customTags">
          <Input placeholder="请输入自定义标签，多个标签用逗号分隔" />
        </Form.Item>

        <Form.Item label="字段列表">
          <Button type="dashed" onClick={handleAddField} icon={<PlusOutlined />} block>
            添加字段
          </Button>
          <Table
            columns={fieldColumns}
            dataSource={fields}
            rowKey={(_record, index) => index?.toString() || '0'}
            pagination={false}
            style={{ marginTop: 16 }}
            scroll={{ x: 900 }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
            <Button onClick={handleGenerateSql}>生成SQL预览</Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        title={editingField ? '编辑字段' : '添加字段'}
        open={fieldModalVisible}
        onOk={handleFieldModalOk}
        onCancel={() => setFieldModalVisible(false)}
        width={800}
      >
        <Form form={fieldForm} layout="vertical">
          <Form.Item label="字段序号" name="fieldOrder">
            <InputNumber disabled style={{ width: '100%' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="字段名"
                name="fieldName"
                rules={[{ required: true, message: '请输入字段名' }]}
              >
                <Input placeholder="请输入字段名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="字段类型"
                name="fieldType"
                rules={[{ required: true, message: '请选择字段类型' }]}
              >
                <Select placeholder="请选择字段类型" options={fieldTypeOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="字段描述"
            name="fieldComment"
            rules={[{ required: true, message: '请输入字段描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入字段描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="是否主键" name="isPrimaryKey">
                <Select options={yesNoOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否可为空" name="isNullable">
                <Select options={yesNoOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="是否加密" name="isEncrypted">
                <Select options={yesNoOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否分区键" name="isPartitionKey">
                <Select options={yesNoOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="敏感等级" name="sensitivityLevel">
                <Select
                  placeholder="请选择敏感等级"
                  allowClear
                  options={sensitivityLevelOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="默认值" name="defaultValue">
                <Input placeholder="请输入默认值" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="生成的建表SQL"
        open={sqlModalVisible}
        onOk={() => setSqlModalVisible(false)}
        onCancel={() => setSqlModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setSqlModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
          {generatedSql}
        </pre>
      </Modal>
    </>
  );
};

export default TableForm;
