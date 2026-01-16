# 功能验证指南

本文档提供元数据管理系统前端的详细功能验证步骤，确保所有功能正常运行。

---

## 目录

- [验证前准备](#验证前准备)
- [元数据表管理验证](#元数据表管理验证)
- [审批流程验证](#审批流程验证)
- [操作历史验证](#操作历史验证)
- [验证清单](#验证清单)

---

## 验证前准备

### 1. 环境检查

确保以下服务正常运行：

```bash
# 检查后端服务
curl http://localhost:8080/api/actuator/health

# 检查前端服务
curl http://localhost:3000
```

### 2. 启动服务

**后端服务**:
```bash
cd /Users/zengrongjun/claudespace/metadata-management-system
./bin/start-app.sh
```

**前端服务**:
```bash
cd /Users/zengrongjun/claudespace/metadata-management-frontend
npm run dev
```

### 3. 访问应用

浏览器打开: http://localhost:3000

---

## 元数据表管理验证

### 功能1: 表查询列表

#### 验证步骤

1. 访问首页，点击左侧菜单 "表查询"
2. 验证表格显示：
   - ✅ 表格正常加载
   - ✅ 显示表名、库名、数据源等列
   - ✅ 分页组件正常显示

3. 测试搜索功能：
   - 在搜索框输入关键词（如"user"）
   - 点击"搜索"按钮
   - ✅ 搜索结果正确显示
   - ✅ 分页信息正确更新

4. 测试筛选功能：
   - 选择数据源（如"Hive"）
   - 选择数仓分层（如"dwd"）
   - 点击"搜索"
   - ✅ 筛选结果正确

5. 测试重置功能：
   - 点击"重置"按钮
   - ✅ 所有筛选条件清空
   - ✅ 表格显示全部数据

#### 预期结果

- 表格数据正常显示
- 搜索和筛选功能正常
- 分页功能正常
- 操作按钮可点击

#### 截图示例

![表查询列表](docs/verification/table-list.png)

---

### 功能2: 表详情查看

#### 验证步骤

1. 在表列表中点击任意表名
2. 进入表详情页
3. 验证基础信息卡片：
   - ✅ 表名、库名正确显示
   - ✅ 数据源、数仓分层显示
   - ✅ 责任人、创建时间显示
   - ✅ 表描述正确显示

4. 验证字段信息表格：
   - ✅ 字段列表正确显示
   - ✅ 字段名、类型、注释显示
   - ✅ 主键、可空、加密标识显示

5. 测试操作按钮：
   - 点击"编辑"按钮
   - ✅ 跳转到编辑页面
   - 点击"返回"按钮
   - ✅ 返回列表页

#### 预期结果

- 表详情信息完整显示
- 字段列表正确显示
- 操作按钮功能正常

#### 截图示例

![表详情](docs/verification/table-detail.png)

---

### 功能3: 创建表

#### 验证步骤

1. 点击"新建表"按钮
2. 填写表基础信息：
   - 表名: `test_user_info`
   - 库名: `test_db`
   - 数据源: 选择 `Hive`
   - 表描述: `测试用户信息表`
   - Hive账号: 选择 `hotel`
   - 数仓分层: 选择 `dwd`
   - 一级主题: 选择 `usr`
   - 二级主题: 选择 `mem`
   - 敏感等级: 选择 `L2`
   - 重要等级: 选择 `P1`
   - 责任人: `admin`

3. 添加字段：
   - 点击"添加字段"按钮
   - 填写字段信息：
     - 字段名: `user_id`
     - 字段类型: `BIGINT`
     - 字段描述: `用户ID`
     - 是否主键: 是
   - 再添加第二个字段：
     - 字段名: `user_name`
     - 字段类型: `STRING`
     - 字段描述: `用户名`

4. 生成SQL：
   - 点击"生成SQL"按钮
   - ✅ SQL代码区域显示建表语句
   - ✅ SQL语法正确

5. 校验SQL：
   - 点击"校验SQL"按钮
   - ✅ 显示校验通过提示

6. 提交创建：
   - 点击"创建"按钮
   - ✅ 显示成功提示
   - ✅ 自动跳转到表列表

#### 预期结果

- 表单验证正常
- SQL生成正确
- 创建成功并跳转

#### 截图示例

![创建表](docs/verification/table-create.png)

---

### 功能4: 编辑表

#### 验证步骤

1. 在表列表中点击"编辑"按钮
2. 进入编辑页面
3. 修改表信息：
   - 修改表描述
   - 修改责任人
   - ✅ 原有信息正确回显

4. 修改字段：
   - 修改字段描述
   - 添加新字段
   - ✅ 字段信息正确显示

5. 提交更新：
   - 点击"提交审批"按钮
   - ✅ 显示成功提示
   - ✅ 创建审批单

#### 预期结果

- 编辑表单正确回显
- 修改提交成功
- 创建审批单成功

---

## 审批流程验证

### 功能5: 审批列表

#### 验证步骤

1. 点击左侧菜单"审批管理"
2. 验证审批列表：
   - ✅ 显示所有审批单
   - ✅ 审批单号、类型显示
   - ✅ 状态、提交人、时间显示

3. 测试状态筛选：
   - 选择状态"待审批"
   - 点击搜索
   - ✅ 只显示待审批的单据

4. 测试查看详情：
   - 点击审批单号
   - ✅ 显示审批详情弹窗
   - ✅ 变更内容正确显示

#### 预期结果

- 审批列表正常显示
- 筛选功能正常
- 详情查看正常

#### 截图示例

![审批列表](docs/verification/approval-list.png)

---

### 功能6: 审批操作

#### 验证步骤

1. 在审批列表中找到待审批单据
2. 点击"审批"按钮
3. 填写审批意见：
   - 审批人: `reviewer`
   - 审批意见: `同意修改`

4. 测试通过审批：
   - 点击"通过"按钮
   - ✅ 显示成功提示
   - ✅ 状态变更为"已通过"

5. 测试发布：
   - 点击"发布"按钮
   - ✅ 显示成功提示
   - ✅ 状态变更为"已发布"
   - ✅ 变更已应用到表

6. 测试拒绝审批：
   - 创建新的审批单
   - 点击"拒绝"按钮
   - 填写拒绝理由
   - ✅ 状态变更为"已拒绝"

#### 预期结果

- 审批操作成功
- 状态流转正确
- 变更正确应用

---

## 操作历史验证

### 功能7: 操作历史查询

#### 验证步骤

1. 点击左侧菜单"操作历史"
2. 验证历史列表：
   - ✅ 显示所有操作记录
   - ✅ 操作类型、操作人显示
   - ✅ 操作时间正确显示

3. 测试筛选功能：
   - 选择操作类型"CREATE"
   - 选择时间范围
   - 点击搜索
   - ✅ 筛选结果正确

4. 查看变更详情：
   - 点击"查看详情"按钮
   - ✅ 显示变更前后内容
   - ✅ JSON格式正确显示

#### 预期结果

- 历史记录完整显示
- 筛选功能正常
- 详情查看正常

#### 截图示例

![操作历史](docs/verification/operation-history.png)

---

## API接口验证

### 测试元数据表API

```bash
# 1. 创建表
curl -X POST http://localhost:8080/api/metadata/tables \
  -H "Content-Type: application/json" \
  -d '{
    "dataSource": "Hive",
    "databaseName": "test_db",
    "tableName": "api_test_table",
    "tableComment": "API测试表",
    "warehouseLayer": "dwd",
    "themeFirst": "usr",
    "sensitivityLevel": "L1",
    "owner": "admin",
    "fields": [
      {
        "fieldName": "id",
        "fieldType": "BIGINT",
        "fieldComment": "主键",
        "fieldOrder": 1,
        "isPrimaryKey": 1
      }
    ]
  }'

# 预期响应: {"code":200,"message":"创建成功","data":1}

# 2. 查询表列表
curl http://localhost:8080/api/metadata/tables/page?pageNum=1&pageSize=10

# 预期响应: 分页数据

# 3. 查询表详情
curl http://localhost:8080/api/metadata/tables/1

# 预期响应: 表详情数据

# 4. 生成SQL
curl -X POST http://localhost:8080/api/metadata/tables/generate-sql \
  -H "Content-Type: application/json" \
  -d '{
    "dataSource": "Hive",
    "databaseName": "test_db",
    "tableName": "sql_test",
    "fields": [{"fieldName": "id", "fieldType": "BIGINT", "fieldComment": "ID"}]
  }'

# 预期响应: SQL语句
```

### 测试审批API

```bash
# 1. 创建审批单
curl -X POST http://localhost:8080/api/metadata/approvals \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "approvalType": "UPDATE",
    "changeContent": "修改表描述",
    "submitter": "admin"
  }'

# 2. 提交审批
curl -X POST http://localhost:8080/api/metadata/approvals/1/submit

# 3. 审批通过
curl -X POST http://localhost:8080/api/metadata/approvals/1/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approver": "reviewer",
    "comment": "同意"
  }'

# 4. 发布变更
curl -X POST http://localhost:8080/api/metadata/approvals/1/publish
```

---

## 验证清单

### 元数据表管理 ✅

- [x] 表查询列表显示
- [x] 搜索功能
- [x] 筛选功能
- [x] 分页功能
- [x] 表详情查看
- [x] 创建表
- [x] 字段管理
- [x] SQL生成
- [x] SQL校验
- [x] 编辑表

### 审批流程管理 ✅

- [x] 审批列表显示
- [x] 状态筛选
- [x] 创建审批单
- [x] 提交审批
- [x] 审批通过
- [x] 审批拒绝
- [x] 取消审批
- [x] 发布变更
- [x] 审批详情查看

### 操作历史 ✅

- [x] 历史记录列表
- [x] 操作类型筛选
- [x] 时间范围筛选
- [x] 变更详情查看
- [x] 变更对比

### 通用功能 ✅

- [x] 页面导航
- [x] 响应式布局
- [x] 加载状态
- [x] 错误提示
- [x] 成功提示
- [x] 表单验证

---

## 性能验证

### 加载性能

```bash
# 首页加载时间
# 预期: < 2秒

# 列表查询时间
# 预期: < 1秒

# 详情查询时间
# 预期: < 500ms
```

### 并发测试

使用Apache Bench进行压力测试：

```bash
# 测试表查询接口
ab -n 1000 -c 10 http://localhost:8080/api/metadata/tables/page?pageNum=1&pageSize=10

# 预期:
# - 成功率 > 99%
# - 平均响应时间 < 200ms
```

---

## 浏览器兼容性验证

| 浏览器 | 版本 | 状态 |
|-------|------|------|
| Chrome | 120+ | ✅ 通过 |
| Firefox | 115+ | ✅ 通过 |
| Safari | 16+ | ✅ 通过 |
| Edge | 120+ | ✅ 通过 |

---

## 移动端验证

### 响应式测试

1. 打开Chrome开发者工具
2. 切换到移动设备模拟
3. 测试不同分辨率：
   - iPhone 12 Pro (390x844)
   - iPad Pro (1024x1366)
   - ✅ 布局自适应正常
   - ✅ 操作功能正常

---

## 问题记录

### 已知问题

1. ~~大数据量列表加载慢~~ （已优化分页）
2. ~~SQL预览格式化~~ （已添加代码高亮）

### 待优化项

1. 添加虚拟滚动优化长列表
2. 添加表单自动保存功能
3. 添加批量操作功能

---

## 验证报告模板

### 验证信息

- **验证日期**: 2026-01-15
- **验证人员**: [填写名字]
- **验证环境**: 开发/测试/生产
- **前端版本**: v1.0.0
- **后端版本**: v1.0.0

### 验证结果

- 元数据表管理: ✅ 通过 / ❌ 未通过
- 审批流程管理: ✅ 通过 / ❌ 未通过
- 操作历史: ✅ 通过 / ❌ 未通过

### 问题列表

| 序号 | 问题描述 | 严重程度 | 状态 |
|-----|---------|---------|------|
| 1   | [描述]  | 高/中/低 | 待修复 |

### 验证结论

- [ ] 全部功能验证通过，可以发布
- [ ] 部分功能有问题，需要修复
- [ ] 功能不满足要求，需要重新开发

---

## 联系方式

如在验证过程中遇到问题，请联系：

- **技术支持**: [邮箱]
- **Issues**: https://github.com/your-username/metadata-management-frontend/issues

---

**最后更新**: 2026-01-15
**版本**: v1.0.0
