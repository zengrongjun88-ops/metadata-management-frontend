# 部署指南

本文档提供元数据管理系统前端的详细部署指南，包括开发环境、测试环境和生产环境的部署方案。

---

## 目录

- [环境要求](#环境要求)
- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [Docker部署](#docker部署)
- [Nginx配置](#nginx配置)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

---

## 环境要求

### 基础环境

| 软件 | 最低版本 | 推荐版本 |
|-----|---------|---------|
| Node.js | 18.0 | 20.x LTS |
| npm | 9.0 | 10.x |
| Git | 2.30 | 最新版 |

### 操作系统

- macOS 10.15+
- Ubuntu 20.04+
- Windows 10+
- CentOS 7+

---

## 开发环境部署

### 1. 克隆代码

```bash
# 克隆仓库
git clone https://github.com/your-username/metadata-management-frontend.git
cd metadata-management-frontend

# 查看分支
git branch -a
```

### 2. 安装依赖

```bash
# 使用npm
npm install

# 或使用pnpm（推荐，更快）
npm install -g pnpm
pnpm install

# 或使用yarn
yarn install
```

### 3. 配置后端地址

编辑 `vite.config.ts`：

```typescript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 后端地址
        changeOrigin: true,
      }
    }
  }
})
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000

### 5. 开发工具推荐

- **IDE**: VSCode
- **插件**:
  - ESLint
  - Prettier
  - TypeScript and JavaScript
  - Reactjs code snippets

---

## 生产环境部署

### 方案1: 静态文件部署

#### 1. 构建生产版本

```bash
# 安装依赖
npm install

# 构建
npm run build

# 构建产物位于 dist/ 目录
ls -lh dist/
```

#### 2. 部署到静态服务器

```bash
# 拷贝到Web服务器
scp -r dist/* user@server:/var/www/metadata-frontend/

# 或使用rsync
rsync -avz dist/ user@server:/var/www/metadata-frontend/
```

#### 3. 配置Web服务器（见下文Nginx配置）

---

### 方案2: Docker部署

#### 1. 创建Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 .dockerignore

```
node_modules
dist
.git
.gitignore
README.md
```

#### 3. 构建镜像

```bash
# 构建Docker镜像
docker build -t metadata-frontend:1.0.0 .

# 查看镜像
docker images | grep metadata-frontend
```

#### 4. 运行容器

```bash
# 运行容器
docker run -d \
  --name metadata-frontend \
  -p 80:80 \
  metadata-frontend:1.0.0

# 查看日志
docker logs -f metadata-frontend

# 停止容器
docker stop metadata-frontend
```

---

### 方案3: Docker Compose部署

#### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: metadata-frontend
    ports:
      - "80:80"
    networks:
      - metadata-network
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    image: metadata-backend:1.0.0
    container_name: metadata-backend
    ports:
      - "8080:8080"
    networks:
      - metadata-network
    restart: unless-stopped

networks:
  metadata-network:
    driver: bridge
```

#### 2. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend

# 停止服务
docker-compose down
```

---

## Nginx配置

### 基础配置

创建 `/etc/nginx/conf.d/metadata-frontend.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 静态文件目录
    root /var/www/metadata-frontend/dist;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求到后端
    location /api {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### HTTPS配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 其他配置同上...
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 重启Nginx

```bash
# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx
```

---

## 环境变量配置

### 开发环境

创建 `.env.development`：

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=元数据管理系统（开发）
```

### 生产环境

创建 `.env.production`：

```bash
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_TITLE=元数据管理系统
```

### 使用环境变量

在代码中使用：

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

---

## CI/CD自动化部署

### GitHub Actions示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy to server
      uses: easingthemes/ssh-deploy@main
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: /var/www/metadata-frontend/
        SOURCE: "dist/"
```

---

## 性能优化建议

### 1. 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
        }
      }
    },
    // 压缩
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

### 2. CDN加速

在 `index.html` 中使用CDN：

```html
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
```

### 3. 缓存策略

Nginx配置：

```nginx
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /index.html {
    add_header Cache-Control "no-cache, must-revalidate";
}
```

---

## 监控和日志

### 1. 访问日志

```bash
# 查看Nginx访问日志
tail -f /var/log/nginx/access.log

# 查看错误日志
tail -f /var/log/nginx/error.log
```

### 2. 性能监控

使用Google Analytics或自建监控：

```html
<!-- index.html -->
<script>
  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 常见问题

### Q1: 构建后页面空白？

**解决方案**:
1. 检查 `vite.config.ts` 中的 `base` 配置
2. 确保Nginx配置了 `try_files`
3. 检查浏览器控制台错误

### Q2: API请求跨域？

**解决方案**:
1. 开发环境使用Vite proxy
2. 生产环境配置Nginx反向代理
3. 后端配置CORS

### Q3: 构建速度慢？

**解决方案**:
1. 使用pnpm代替npm
2. 配置构建缓存
3. 减少不必要的依赖

### Q4: Docker镜像太大？

**解决方案**:
1. 使用多阶段构建
2. 使用alpine基础镜像
3. 清理构建缓存

---

## 回滚方案

### 快速回滚

```bash
# 保留多个版本
cd /var/www/metadata-frontend
mv dist dist.backup
cp -r dist.v1.0.0 dist

# 重启Nginx
sudo systemctl reload nginx
```

### Docker回滚

```bash
# 回滚到旧版本
docker stop metadata-frontend
docker rm metadata-frontend
docker run -d --name metadata-frontend metadata-frontend:1.0.0
```

---

## 安全建议

1. **HTTPS**: 生产环境必须使用HTTPS
2. **隐藏版本**: 隐藏Nginx和Node版本信息
3. **防火墙**: 配置防火墙规则
4. **定期更新**: 及时更新依赖包
5. **备份**: 定期备份代码和配置

---

## 支持

如有问题，请：
1. 查看本文档
2. 提交Issue: https://github.com/your-username/metadata-management-frontend/issues
3. 联系运维团队

---

**最后更新**: 2026-01-15
**版本**: v1.0.0
