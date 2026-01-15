# 前后端联调快速指南

## 📋 概述

本文档提供前后端项目的快速联调指南，帮助您快速启动完整的元数据管理系统。

---

## 🔧 环境要求

### 后端要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+

### 前端要求
- Node.js 18+
- npm 9+

---

## 🚀 启动步骤

### 步骤1: 准备数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE metadata_mgmt DEFAULT CHARACTER SET utf8mb4;

# 导入Schema
USE metadata_mgmt;
SOURCE /Users/zengrongjun/claudespace/metadata-management-system/src/main/resources/db/schema.sql;

# 退出
exit;
```

### 步骤2: 启动后端服务

```bash
# 进入后端项目目录
cd /Users/zengrongjun/claudespace/metadata-management-system

# 方式1: 使用Maven直接启动（推荐）
mvn spring-boot:run

# 方式2: 先打包再启动
mvn clean package -DskipTests
java -jar target/metadata-management-system.jar

# 验证后端启动成功
curl http://localhost:8080/api/actuator/health
# 预期输出: {"status":"UP"}
```

### 步骤3: 启动前端服务

**新建终端窗口**，执行以下命令：

```bash
# 进入前端项目目录
cd /Users/zengrongjun/claudespace/metadata-management-frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 预期输出:
# VITE v7.x.x ready in xxx ms
# ➜  Local:   http://localhost:3000/
```

### 步骤4: 访问应用

打开浏览器访问: **http://localhost:3000**

---

## 🔍 验证功能

### 1. 测试表查询功能

在浏览器中：
1. 访问首页，看到表查询列表
2. 点击"搜索"按钮，验证API调用
3. 观察浏览器Network面板，确认请求到 `/api/metadata/tables/page`

### 2. 测试表创建功能

1. 点击"新建表"按钮
2. 填写表信息
3. 添加字段
4. 点击"生成SQL"，验证SQL生成
5. 点击"创建"，提交到后端

### 3. 测试审批功能

1. 点击左侧菜单"审批管理"
2. 查看审批列表
3. 测试审批操作

---

## 🐛 常见问题

### Q1: 后端启动失败 - 端口被占用

```bash
# 查找占用8080端口的进程
lsof -i :8080

# 杀死进程
kill -9 <PID>
```

### Q2: 后端启动失败 - 数据库连接错误

检查 `application.yml` 中的数据库配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/metadata_mgmt
    username: root
    password: your_password  # 修改为您的密码
```

### Q3: 前端无法连接后端

确认：
1. 后端已启动并监听8080端口
2. 浏览器访问 http://localhost:8080/api/actuator/health 能正常返回
3. 前端的 `vite.config.ts` 代理配置正确

### Q4: 前端页面空白

1. 打开浏览器开发者工具（F12）
2. 查看Console面板是否有错误
3. 查看Network面板，检查API请求状态

---

## 📊 API验证

### 使用curl测试后端API

```bash
# 1. 健康检查
curl http://localhost:8080/api/actuator/health

# 2. 查询表列表
curl "http://localhost:8080/api/metadata/tables/page?pageNum=1&pageSize=10"

# 3. 创建表
curl -X POST http://localhost:8080/api/metadata/tables \
  -H "Content-Type: application/json" \
  -d '{
    "dataSource": "Hive",
    "databaseName": "test_db",
    "tableName": "test_table",
    "tableComment": "测试表",
    "warehouseLayer": "dwd",
    "themeFirst": "usr",
    "themeSecond": "mem",
    "sensitivityLevel": "L1",
    "importanceLevel": "P1",
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

# 4. 生成SQL
curl -X POST http://localhost:8080/api/metadata/tables/generate-sql \
  -H "Content-Type: application/json" \
  -d '{
    "dataSource": "Hive",
    "databaseName": "test_db",
    "tableName": "test_table",
    "fields": [
      {
        "fieldName": "id",
        "fieldType": "BIGINT",
        "fieldComment": "主键"
      }
    ]
  }'
```

---

## 🔄 开发工作流

### 前端开发

```bash
# 1. 修改代码
# 2. 保存文件（Vite会自动热更新）
# 3. 刷新浏览器验证
# 4. 提交代码
git add .
git commit -m "feat: 添加新功能"
git push
```

### 后端开发

```bash
# 1. 修改代码
# 2. 重启Spring Boot（或使用spring-boot-devtools热更新）
# 3. 测试API
# 4. 提交代码
```

---

## 📦 生产部署

### 后端部署

```bash
# 构建
cd metadata-management-system
mvn clean package -DskipTests

# 部署
java -jar target/metadata-management-system.jar \
  --spring.profiles.active=prod
```

### 前端部署

```bash
# 构建
cd metadata-management-frontend
npm run build

# 部署到Nginx
cp -r dist/* /var/www/metadata-frontend/
```

---

## 🔗 相关链接

- **前端GitHub**: https://github.com/zengrongjun88-ops/metadata-management-frontend
- **后端GitHub**: https://github.com/zengrongjun88-ops/metadata-management-system
- **Swagger文档**: http://localhost:8080/api/doc.html（后端启动后访问）

---

## 💡 提示

1. **开发时推荐使用两个终端窗口**，一个运行后端，一个运行前端
2. **数据库密码**记得修改为您自己的密码
3. **首次启动后端**可能需要等待Maven下载依赖
4. **前端热更新**功能已启用，修改代码后自动刷新

---

## ✅ 快速检查清单

- [ ] MySQL已安装并运行
- [ ] 数据库metadata_mgmt已创建
- [ ] Schema已导入
- [ ] 后端配置文件密码已修改
- [ ] 后端服务已启动（8080端口）
- [ ] 前端依赖已安装
- [ ] 前端服务已启动（3000端口）
- [ ] 浏览器能访问http://localhost:3000
- [ ] API调用正常

---

**最后更新**: 2026-01-15
**适用版本**: 前端v1.0.0 + 后端v1.0.0
