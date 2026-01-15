# 前端架构设计文档

## 文档信息

| 项目名称 | 元数据管理系统前端 |
|---------|------------------|
| 文档版本 | 1.0.0 |
| 编写日期 | 2026-01-15 |
| 编写人   | System |
| 状态     | 已完成 |

---

## 目录

- [1. 前端架构概述](#1-前端架构概述)
- [2. 技术选型](#2-技术选型)
- [3. 项目结构设计](#3-项目结构设计)
- [4. 状态管理设计](#4-状态管理设计)
- [5. 路由设计](#5-路由设计)
- [6. API通信设计](#6-api通信设计)
- [7. 组件设计](#7-组件设计)
- [8. 性能优化](#8-性能优化)

---

## 1. 前端架构概述

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                          用户层                               │
│                    浏览器 (Chrome/Firefox/Safari)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         展示层                                │
│              React 19 + TypeScript 5.9                        │
│              Ant Design 5.29 组件库                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         应用层                                │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │  页面组件     │   布局组件    │      通用组件            │ │
│  │  Pages       │   Layouts    │    Components           │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         服务层                                │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │  API服务     │   工具函数    │      类型定义            │ │
│  │  API         │   Utils      │      Types              │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      后端API服务                              │
│                  http://localhost:8080/api                    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 设计原则

- **组件化**: 模块化开发，提高代码复用性
- **类型安全**: 完整的TypeScript类型定义
- **响应式**: 适配多种设备和屏幕尺寸
- **性能优先**: 代码分割、懒加载、缓存优化
- **用户体验**: 友好的交互和错误提示

---

## 2. 技术选型

### 2.1 核心框架

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| React | 19.2 | 最新版本，性能提升，Hooks生态完善 |
| TypeScript | 5.9 | 类型安全，开发体验好 |
| Vite | 7.2 | 构建速度快，开发体验极佳 |

### 2.2 UI框架

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| Ant Design | 5.29 | 企业级UI组件库，组件丰富 |
| @ant-design/icons | 6.1 | 配套图标库 |
| @ant-design/pro-components | 2.8 | 高级业务组件 |

### 2.3 工具库

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| React Router | 7.12 | 官方路由库，功能强大 |
| Axios | 1.13 | HTTP客户端，拦截器支持 |
| Day.js | 1.11 | 轻量级日期处理库 |

---

## 3. 项目结构设计

### 3.1 目录结构

```
src/
├── api/                      # API服务层
│   ├── request.ts            # Axios配置和拦截器
│   ├── metadata.ts           # 元数据表API
│   ├── approval.ts           # 审批流程API
│   └── history.ts            # 操作历史API
│
├── components/               # 通用组件
│   └── (待扩展)
│
├── constants/                # 常量配置
│   ├── index.ts              # 基础常量
│   └── options.ts            # 下拉选项配置
│
├── hooks/                    # 自定义Hooks
│   └── (待扩展)
│
├── layouts/                  # 布局组件
│   └── MainLayout.tsx        # 主布局
│
├── pages/                    # 页面组件
│   ├── TableList/            # 表查询列表
│   ├── TableDetail/          # 表详情
│   ├── TableCreate/          # 表创建
│   ├── TableEdit/            # 表编辑
│   ├── ApprovalList/         # 审批列表
│   └── OperationHistory/     # 操作历史
│
├── routes/                   # 路由配置
│   └── index.tsx             # 路由定义
│
├── types/                    # TypeScript类型定义
│   ├── common.ts             # 通用类型
│   ├── enums.ts              # 枚举类型
│   ├── metadata.ts           # 元数据类型
│   └── approval.ts           # 审批类型
│
├── utils/                    # 工具函数
│   ├── format.ts             # 格式化工具
│   └── storage.ts            # 本地存储工具
│
├── App.tsx                   # 应用主组件
├── App.css                   # 全局样式
└── main.tsx                  # 应用入口
```

### 3.2 模块职责

#### API服务层 (`src/api/`)

**职责**:
- 封装所有HTTP请求
- 统一处理请求和响应
- 错误处理和拦截

**示例**:
```typescript
// src/api/metadata.ts
import request from './request';
import type { MetadataTable, TableSearchRequest } from '@/types';

export const metadataApi = {
  // 分页查询
  pageQuery: (params: TableSearchRequest) =>
    request.get('/metadata/tables/page', { params }),

  // 查询详情
  getById: (id: number) =>
    request.get(`/metadata/tables/${id}`),

  // 创建表
  create: (data: TableCreateRequest) =>
    request.post('/metadata/tables', data),
};
```

#### 类型定义层 (`src/types/`)

**职责**:
- 定义所有TypeScript类型和接口
- 确保类型安全
- 与后端API保持一致

**示例**:
```typescript
// src/types/metadata.ts
export interface MetadataTable {
  id: number;
  tableName: string;
  databaseName: string;
  dataSource: DataSourceType;
  tableComment: string;
  // ... 其他字段
}

export interface TableSearchRequest {
  keyword?: string;
  dataSource?: string;
  pageNum: number;
  pageSize: number;
}
```

#### 页面组件层 (`src/pages/`)

**职责**:
- 实现具体业务功能
- 调用API服务
- 管理页面状态
- 处理用户交互

**示例**:
```typescript
// src/pages/TableList/index.tsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Form, Input, Button } from 'antd';
import { metadataApi } from '@/api/metadata';

const TableList: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const res = await metadataApi.pageQuery(params);
      setData(res.data.records);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="表查询">
      {/* ... */}
    </Card>
  );
};
```

---

## 4. 状态管理设计

### 4.1 状态管理方案

采用**React Hooks + Context**进行状态管理，无需引入Redux等重量级状态管理库。

```typescript
// 使用useState管理组件内部状态
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);

// 使用useEffect处理副作用
useEffect(() => {
  fetchData();
}, []);
```

### 4.2 全局状态（待扩展）

如需全局状态，可使用Context API：

```typescript
// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
```

---

## 5. 路由设计

### 5.1 路由配置

使用React Router 7实现单页应用路由：

```typescript
// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import TableList from '@/pages/TableList';
import TableDetail from '@/pages/TableDetail';
import TableCreate from '@/pages/TableCreate';
import TableEdit from '@/pages/TableEdit';
import ApprovalList from '@/pages/ApprovalList';
import OperationHistory from '@/pages/OperationHistory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <TableList /> },
      { path: 'tables', element: <TableList /> },
      { path: 'tables/:id', element: <TableDetail /> },
      { path: 'tables/create', element: <TableCreate /> },
      { path: 'tables/:id/edit', element: <TableEdit /> },
      { path: 'approvals', element: <ApprovalList /> },
      { path: 'history', element: <OperationHistory /> },
    ],
  },
]);
```

### 5.2 路由守卫（待扩展）

可添加路由守卫实现权限控制：

```typescript
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

## 6. API通信设计

### 6.1 Axios配置

```typescript
// src/api/request.ts
import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, message: msg, data } = response.data;
    if (code === 200) {
      return { data };
    } else {
      message.error(msg || '请求失败');
      return Promise.reject(new Error(msg));
    }
  },
  (error) => {
    message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);
```

### 6.2 API统一格式

**请求格式**:
```typescript
// GET请求
metadataApi.getById(1);

// POST请求
metadataApi.create({
  tableName: 'test_table',
  databaseName: 'test_db',
  // ...
});
```

**响应格式**:
```typescript
// 成功响应
{
  code: 200,
  message: '操作成功',
  data: { /* 数据 */ }
}

// 分页响应
{
  code: 200,
  data: {
    records: [],
    total: 100,
    pageNum: 1,
    pageSize: 10
  }
}
```

---

## 7. 组件设计

### 7.1 组件分类

**页面组件** (Pages):
- 负责具体业务逻辑
- 调用API服务
- 管理页面状态

**布局组件** (Layouts):
- MainLayout: 主布局（侧边栏+顶栏+内容区）

**业务组件** (Components, 待扩展):
- 可复用的业务组件
- 例如：TableSelector、FieldEditor等

### 7.2 组件开发规范

**函数式组件**:
```typescript
interface Props {
  title: string;
  onSubmit: (data: any) => void;
}

const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // 组件逻辑
  return <div>{title}</div>;
};

export default MyComponent;
```

**Props类型定义**:
- 所有Props必须定义接口
- 使用React.FC泛型

**命名规范**:
- 组件文件使用PascalCase
- 函数使用camelCase
- 常量使用UPPER_SNAKE_CASE

---

## 8. 性能优化

### 8.1 代码分割

使用动态import实现路由级代码分割：

```typescript
const TableList = lazy(() => import('@/pages/TableList'));
const TableDetail = lazy(() => import('@/pages/TableDetail'));

// 使用Suspense包裹
<Suspense fallback={<Loading />}>
  <TableList />
</Suspense>
```

### 8.2 构建优化

**Vite配置**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  }
})
```

### 8.3 缓存策略

**列表查询缓存**:
```typescript
const [cacheKey, setCacheKey] = useState('');

const fetchData = async (params) => {
  const key = JSON.stringify(params);
  if (key === cacheKey) return; // 相同参数不重复请求

  setCacheKey(key);
  // ... 执行请求
};
```

**本地存储缓存**:
```typescript
// src/utils/storage.ts
export const storage = {
  get: (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};
```

### 8.4 性能监控

使用React DevTools Profiler监控组件渲染性能：

```typescript
import { Profiler } from 'react';

const onRenderCallback = (
  id, phase, actualDuration, baseDuration, startTime, commitTime
) => {
  console.log(`${id} 渲染耗时: ${actualDuration}ms`);
};

<Profiler id="TableList" onRender={onRenderCallback}>
  <TableList />
</Profiler>
```

---

## 9. 安全设计

### 9.1 XSS防护

- 使用React默认的XSS防护
- 避免使用dangerouslySetInnerHTML
- 用户输入内容进行转义

### 9.2 CSRF防护

```typescript
// 请求拦截器添加CSRF Token
request.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

### 9.3 敏感信息保护

- 密码等敏感信息不存储在localStorage
- Token使用HttpOnly Cookie存储
- HTTPS传输加密

---

## 10. 测试策略（待实施）

### 10.1 单元测试

使用Vitest + React Testing Library：

```typescript
import { render, screen } from '@testing-library/react';
import TableList from './TableList';

describe('TableList', () => {
  it('should render table correctly', () => {
    render(<TableList />);
    expect(screen.getByText('表查询')).toBeInTheDocument();
  });
});
```

### 10.2 集成测试

使用Cypress进行端到端测试：

```javascript
describe('Table Management', () => {
  it('should create table successfully', () => {
    cy.visit('/tables/create');
    cy.get('[name="tableName"]').type('test_table');
    cy.get('[type="submit"]').click();
    cy.contains('创建成功').should('be.visible');
  });
});
```

---

## 11. 部署架构

### 11.1 开发环境

```bash
npm run dev
```

访问: http://localhost:3000

### 11.2 生产环境

```bash
npm run build
```

构建产物部署到Nginx：

```nginx
server {
    listen 80;
    root /var/www/metadata-frontend/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
    }
}
```

---

## 12. 技术亮点

1. **现代化技术栈**: React 19 + TypeScript 5 + Vite 7
2. **完整的类型系统**: 100%类型覆盖，编译时类型检查
3. **企业级UI**: Ant Design 5组件库
4. **高性能**: 代码分割、懒加载、Vite极速构建
5. **开发体验**: ESLint、Prettier、Hot Reload
6. **可维护性**: 清晰的项目结构和代码规范

---

## 13. 未来规划

### Phase 1: 当前完成 ✅
- React项目架构搭建
- 元数据表管理功能
- 审批流程功能
- 操作历史功能

### Phase 2: 计划中
- [ ] 添加单元测试和E2E测试
- [ ] 实现国际化(i18n)支持
- [ ] 添加暗黑模式
- [ ] 实现数据标准管理页面
- [ ] 实现数仓管理页面

### Phase 3: 后续优化
- [ ] 性能监控和日志上报
- [ ] PWA支持
- [ ] 移动端适配优化
- [ ] 数据可视化大屏

---

**版本历史**

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2026-01-15 | 初始版本 | System |

---

**附录**

- [React官方文档](https://react.dev/)
- [Ant Design官方文档](https://ant.design/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Vite官方文档](https://vitejs.dev/)
