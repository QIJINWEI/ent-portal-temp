# 宁波企业门户网站

一个现代化的企业门户网站，采用 Next.js + Spring Boot + MySQL 技术栈构建，包含前台展示和后台管理系统。

## 🌟 项目特色

- 🎨 **现代化UI设计** - 基于 Tailwind CSS 的响应式设计
- ✨ **丰富动画效果** - 使用 Framer Motion 实现流畅的页面动画
- 🔐 **完整权限管理** - JWT认证 + 角色权限控制
- 📱 **响应式布局** - 支持PC、平板、手机等多种设备
- ⚡ **高性能** - Next.js 15 App Router + Spring Boot 2.7
- 🗄️ **MySQL数据库** - 可靠的数据存储方案
- 🛡️ **安全防护** - Spring Security + CORS配置
- 💬 **留言系统** - 支持用户在线留言咨询

## 🏗️ 技术栈

### 前端
- **Next.js 15.5.3** - React全栈框架
- **React 19.1.0** - 最新版本的React
- **TypeScript 5** - 类型安全的JavaScript
- **Tailwind CSS 4** - 实用优先的CSS框架
- **Framer Motion 12** - 动画库
- **Lucide React** - 精美的图标库

### 后端
- **Spring Boot 2.7.18** - Java企业级框架
- **Spring Security** - 安全认证框架
- **Spring Data JPA** - 数据访问层
- **MySQL 8.0+** - 关系型数据库
- **JWT** - 无状态认证
- **Maven** - 项目管理工具

## 📋 功能特性

### 前台展示
- 🏠 **首页** - 企业介绍、产品展示、新闻动态
- 🏢 **关于我们** - 公司简介、发展历程、企业文化
- 📦 **产品服务** - 产品展示、服务介绍
- 📞 **联系我们** - 联系方式、在线留言、地理位置
- ✨ **滚动动画** - 丰富的页面交互效果
- 💬 **用户留言** - 支持在线留言咨询，支持中文UTF-8编码

### 后台管理
- 🔐 **用户认证** - 登录/登出、JWT令牌管理
- 👥 **用户管理** - 管理员账户的增删改查
- 🏢 **企业信息管理** - 公司信息的维护
- 📦 **产品管理** - 产品信息的发布和编辑
- 📰 **新闻管理** - 新闻文章的管理
- 💬 **留言管理** - 用户留言的查看、回复和管理
- ⚙️ **系统配置** - 全局配置参数管理
- 📊 **仪表盘** - 数据统计和系统概览

### 权限管理
- 👑 **超级管理员** - 拥有所有权限
- 👤 **管理员** - 基本管理权限
- ✏️ **编辑员** - 内容编辑权限

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Java 11+
- MySQL 8.0+
- Maven 3.6+

### 数据库配置

1. **安装MySQL**（如未安装）
2. **创建数据库和用户**：
   ```sql
   -- 创建数据库
   CREATE DATABASE portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- 创建用户（可选，也可以使用root用户）
   CREATE USER 'portal_user'@'localhost' IDENTIFIED BY '123456';
   GRANT ALL PRIVILEGES ON portal_db.* TO 'portal_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **执行初始化脚本**：
   ```bash
   mysql -u root -p portal_db < backend/sql/init.sql
   ```

### 一键启动（推荐）

#### Windows用户
```bash
# 使用批处理脚本启动
start-with-mysql.bat
```

#### Linux/Mac用户
```bash
# 给脚本执行权限
chmod +x start-with-mysql.sh

# 启动系统
./start-with-mysql.sh
```

### 手动启动

#### 1. 启动后端服务
```bash
cd backend

# 编译项目
mvn clean compile

# 启动应用
mvn spring-boot:run
```

#### 2. 启动前端服务
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问系统

- **前台网站**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin
- **后端API**: http://localhost:8080

### 默认账户

**管理员账户**：
- 用户名：`admin`
- 密码：`admin123`
- 角色：超级管理员

## 🔌 API接口文档

### 认证接口

#### 用户登录
``http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应**：
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "username": "admin",
  "fullName": "系统管理员",
  "role": "SUPER_ADMIN"
}
```

#### 用户登出
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### 管理接口

#### 获取用户列表
```http
GET /api/admin/users?page=0&size=10&sort=id&direction=desc
Authorization: Bearer {token}
```

#### 创建用户
```http
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "password": "password",
  "email": "user@example.com",
  "fullName": "新用户",
  "role": "ADMIN",
  "enabled": true
}
```

#### 获取系统配置
```http
GET /api/admin/configs
Authorization: Bearer {token}
```

### 公开接口

#### 获取企业信息
```http
GET /api/company/main
```

#### 获取产品列表
```http
GET /api/products
```

#### 获取新闻列表
```http
GET /api/news
```

#### 提交用户留言
```http
POST /api/messages
Content-Type: application/json; charset=utf-8

{
  "name": "用户姓名",
  "email": "user@example.com",
  "phone": "13800138000",
  "company": "公司名称",
  "subject": "留言主题",
  "content": "留言内容"
}
```

**响应**：
```json
{
  "id": 1,
  "name": "用户姓名",
  "email": "user@example.com",
  "phone": "13800138000",
  "company": "公司名称",
  "subject": "留言主题",
  "content": "留言内容",
  "isRead": false,
  "isReplied": false,
  "createdAt": "2025-09-24T15:38:49.773",
  "updatedAt": "2025-09-24T15:38:49.773"
}
```

> **注意**：留言接口支持UTF-8中文编码，如果 subject 为空，系统会自动设置为“留言咨询”

## 📁 项目结构

```
dningbo_portal_ui/
├── frontend/                 # 前端项目
│   ├── app/                 # Next.js App Router
│   │   ├── admin/           # 管理后台页面
│   │   │   ├── login/       # 登录页面
│   │   │   ├── dashboard/   # 仪表盘
│   │   │   ├── users/       # 用户管理
│   │   │   └── configs/     # 系统配置
│   │   ├── about/           # 关于我们页面
│   │   ├── products/        # 产品页面
│   │   ├── contact/         # 联系我们页面
│   │   └── layout.tsx       # 根布局
│   ├── components/          # 组件目录
│   │   ├── admin/           # 管理后台组件
│   │   ├── sections/        # 页面区块组件
│   │   └── ui/              # 基础UI组件
│   ├── hooks/               # 自定义Hook
│   │   └── useAuth.tsx      # 认证Hook
│   ├── lib/                 # 工具库
│   │   ├── api.ts           # 前台API
│   │   ├── admin-api.ts     # 管理后台API
│   │   └── types.ts         # 类型定义
│   └── middleware.ts        # 路由中间件
│
├── backend/                 # 后端项目
│   ├── src/main/java/com/ningbo/portal/
│   │   ├── controller/      # 控制器
│   │   │   ├── AuthController.java
│   │   │   ├── AdminController.java
│   │   │   ├── CompanyController.java
│   │   │   ├── ProductController.java
│   │   │   └── NewsController.java
│   │   ├── entity/          # 实体类
│   │   │   ├── AdminUser.java
│   │   │   ├── SystemConfig.java
│   │   │   ├── CompanyInfo.java
│   │   │   ├── Product.java
│   │   │   └── News.java
│   │   ├── repository/      # 数据访问层
│   │   ├── service/         # 服务层
│   │   ├── config/          # 配置类
│   │   │   ├── SecurityConfig.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   ├── util/            # 工具类
│   │   │   └── JwtUtil.java
│   │   └── dto/             # 数据传输对象
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── sql/                 # SQL脚本
│   │   └── init.sql
│   └── pom.xml              # Maven配置
│
├── start-with-mysql.bat     # Windows启动脚本(MySQL版)
├── start-with-mysql.sh      # Linux/Mac启动脚本(MySQL版)
├── start.bat                # Windows启动脚本(H2版)
├── start.sh                 # Linux/Mac启动脚本(H2版)
├── DEPLOYMENT.md            # 部署指南
└── README.md                # 项目说明
```

## 🔧 常见问题解决

### 留言接口问题

**问题**：提交留言时返回 403 Forbidden 错误

**解决方案**：
1. 检查 Spring Security 配置，确保 `/api/messages` 接口允许匿名访问
2. 确认请求头包含 `Content-Type: application/json; charset=utf-8`

**问题**：中文字符显示乱码

**解决方案**：
1. 确保请求头包含 `charset=utf-8`
2. 检查数据库连接配置中的编码设置

### 端口冲突问题

**问题**：启动时提示 "Port 8080 is already in use"

**解决方案**：
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID号> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### 数据库连接问题

**问题**：无法连接到 MySQL 数据库

**解决方案**：
1. 确认 MySQL 服务已启动
2. 检查数据库配置信息（用户名、密码、数据库名）
3. 确认数据库已创建并执行了初始化脚本

## 🛠️ 开发指南

### 数据库管理

#### 切换数据库

**使用MySQL（推荐）**：
- 使用 `start-with-mysql.bat` 或 `start-with-mysql.sh`
- 修改 `backend/src/main/resources/application.properties` 中的数据库配置

**使用H2（开发测试）**：
- 使用 `start.bat` 或 `start.sh`
- H2控制台：http://localhost:8080/h2-console

#### 数据库迁移

1. 备份现有数据
2. 执行新的SQL脚本
3. 重启应用程序

### 权限配置

系统支持三种角色：
- **SUPER_ADMIN**: 超级管理员，拥有所有权限
- **ADMIN**: 管理员，拥有基本管理权限
- **EDITOR**: 编辑员，只能编辑内容

### 自定义配置

#### 前端配置
- 修改 `frontend/lib/admin-api.ts` 中的API地址
- 修改 `frontend/tailwind.config.js` 自定义样式

#### 后端配置
- 修改 `backend/src/main/resources/application.properties`
- JWT密钥和过期时间配置
- 数据库连接配置
- CORS跨域配置

## 📦 部署指南

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目作者：[宁波企业门户团队]
- 邮箱：[contact@ningbo-portal.com]
- 项目链接：[https://github.com/your-username/dningbo_portal_ui]

## 📝 更新日志

### v1.1.0 (2025-09-24)

#### 新增功能
- ✅ **留言系统**：完整的用户留言功能
- ✅ **UTF-8支持**：完全支持中文字符编码
- ✅ **权限优化**：留言接口免认证访问

#### 问题修复
- 🔧 修复留言接口 403 Forbidden 错误
- 🔧 解决中文字符编码问题
- 🔧 优化字段验证规则，支持可选主题

#### 技术升级
- ⬆️ Next.js 升级至 15.5.3
- ⬆️ React 升级至 19.1.0
- ⬆️ Tailwind CSS 升级至 v4

### v1.0.0 (2025-09-23)

#### 初始版本
- ✅ 基础企业门户网站功能
- ✅ 管理后台系统
- ✅ JWT 认证系统
- ✅ 响应式设计
- ✅ MySQL 数据库支持

---

## 🔗 相关链接

- [📝 部署指南](./DEPLOYMENT.md)
- [📊 API 文档](待补充)
- [📝 更新日志](待补充)

---

🎉 **感谢使用宁波企业门户网站！**