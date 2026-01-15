import React, { useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import {
  DatabaseOutlined,
  AuditOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems: MenuItem[] = [
    {
      key: '/tables',
      icon: <DatabaseOutlined />,
      label: '元数据管理',
    },
    {
      key: '/approvals',
      icon: <AuditOutlined />,
      label: '审批管理',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: '操作历史',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/tables')) return ['/tables'];
    if (path.startsWith('/approvals')) return ['/approvals'];
    if (path.startsWith('/history')) return ['/history'];
    return ['/tables'];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <DatabaseOutlined style={{ fontSize: 24, marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 'bold' }}>元数据管理</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer' },
            })}
            <Title level={4} style={{ margin: '0 0 0 16px' }}>
              数据仓库元数据管理系统
            </Title>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
