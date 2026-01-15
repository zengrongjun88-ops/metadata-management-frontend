# 元数据管理系统前端

基于 React 18 + TypeScript + Vite + Ant Design 5 的现代化前端应用。

## 项目结构

```
src/
├── api/                    # API服务层
│   ├── request.ts         # Axios配置和请求拦截器
│   ├── metadata.ts        # 元数据表API
│   ├── approval.ts        # 审批流程API
│   └── history.ts         # 操作历史API
├── types/                 # TypeScript类型定义
│   ├── common.ts          # 通用类型
│   ├── enums.ts           # 枚举类型
│   ├── metadata.ts        # 元数据类型
│   └── approval.ts        # 审批类型
├── constants/             # 常量配置
│   ├── index.ts           # 基础常量
│   └── options.ts         # 下拉选项配置
├── utils/                 # 工具函数
│   ├── format.ts          # 格式化工具
│   └── storage.ts         # 本地存储工具
├── layouts/               # 布局组件
│   └── MainLayout.tsx     # 主布局
├── pages/                 # 页面组件
│   ├── TableList/         # 表列表页
│   ├── TableDetail/       # 表详情页
│   ├── TableCreate/       # 表创建页
│   ├── TableEdit/         # 表编辑页
│   ├── ApprovalList/      # 审批列表页
│   └── OperationHistory/  # 操作历史页
├── routes/                # 路由配置
│   └── index.tsx          # 路由定义
├── App.tsx                # 应用主组件
├── App.css                # 全局样式
└── main.tsx               # 应用入口
```

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite 7
- **UI组件库**: Ant Design 5
- **路由**: React Router 6
- **HTTP客户端**: Axios
- **日期处理**: Day.js
- **图标**: Ant Design Icons

## 功能特性

### 1. 元数据管理
- 表查询列表：支持多条件搜索、分页查询
- 表详情：查看表的完整信息和字段列表
- 表创建：创建新的元数据表，支持字段配置
- 表编辑：编辑已有元数据表的信息
- SQL生成：自动生成建表SQL

### 2. 审批管理
- 全部审批：查看所有审批单
- 我提交的：查看当前用户提交的审批单
- 待我审批：查看待审批的审批单
- 审批操作：支持审批通过/拒绝

### 3. 操作历史
- 按操作人查询操作历史
- 查看详细的变更记录

## 开发指南

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## API配置

### 开发环境
后端API地址配置在 `vite.config.ts` 中：
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
}
```

### 生产环境
生产环境需要在Nginx或其他Web服务器中配置反向代理：
```nginx
location /api {
    proxy_pass http://backend-server:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 核心功能说明

### 1. 类型安全
- 完整的TypeScript类型定义
- 与后端API完全对应的类型系统
- 编译时类型检查

### 2. 状态管理
- 使用React Hooks进行状态管理
- 表单状态使用Ant Design Form组件管理

### 3. 请求处理
- 统一的请求拦截器
- 统一的错误处理
- 统一的响应格式处理

### 4. 路由配置
- 使用React Router进行路由管理
- 支持嵌套路由
- 支持路由参数

### 5. UI组件
- 基于Ant Design 5构建
- 响应式布局
- 统一的设计风格

## 主要页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/tables` | 表列表页 | 元数据表查询列表 |
| `/tables/detail/:id` | 表详情页 | 查看表详细信息 |
| `/tables/create` | 表创建页 | 创建新的元数据表 |
| `/tables/edit/:id` | 表编辑页 | 编辑元数据表 |
| `/approvals` | 审批列表页 | 审批管理 |
| `/history` | 操作历史页 | 查看操作历史 |

## 开发规范

### 1. 代码风格
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Airbnb JavaScript风格指南

### 2. 组件开发
- 使用函数式组件和Hooks
- 组件单一职责原则
- 合理拆分组件

### 3. 命名规范
- 组件文件使用PascalCase命名
- 工具函数文件使用camelCase命名
- 常量使用UPPER_SNAKE_CASE命名

### 4. 类型定义
- 优先使用interface定义类型
- 为所有函数参数和返回值定义类型
- 避免使用any类型

## 注意事项

1. **API调用**: 所有API调用都应通过api目录下的服务函数进行，不要直接使用axios
2. **错误处理**: 使用统一的错误处理机制，在请求拦截器中处理
3. **用户反馈**: 使用Ant Design的message组件给用户反馈
4. **表单验证**: 使用Ant Design Form的验证功能
5. **分页处理**: 统一使用PageResult类型处理分页数据

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 待优化项

1. 添加单元测试
2. 添加E2E测试
3. 优化打包体积
4. 添加PWA支持
5. 添加国际化支持
6. 添加主题切换功能

## License

MIT
