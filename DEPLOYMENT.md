# 企业门户网站部署指南

## 前端部署

### 1. 构建前端应用
```bash
cd frontend
npm run build
```

### 2. 静态部署（推荐）
将 `out` 目录或 `.next` 目录部署到静态服务器：
- **Vercel**：推荐选择，支持自动部署
- **Netlify**：适合静态网站部署
- **Nginx**：自建服务器部署

### 3. Vercel 部署（推荐）
1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量：
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   ```
4. 部署完成

## 后端部署

### 1. 构建 JAR 包
```bash
cd backend
mvn clean package
```

### 2. Docker 部署（推荐）

创建 `backend/Dockerfile`：
```dockerfile
FROM openjdk:11-jre-slim
COPY target/portal-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

构建和运行：
```bash
docker build -t portal-backend .
docker run -p 8080:8080 portal-backend
```

### 3. 传统部署
```bash
java -jar target/portal-backend-1.0.0.jar
```

### 4. 生产环境配置

创建 `application-prod.properties`：
```properties
# 生产数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/portal_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# 安全配置
spring.web.cors.allowed-origins=https://your-frontend-domain.com

# 日志配置
logging.level.com.ningbo.portal=INFO
logging.level.org.springframework.web=WARN
```

## 环境变量配置

### 前端环境变量
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 后端环境变量
```bash
# 数据库配置
DB_URL=jdbc:mysql://localhost:3306/portal_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# 跨域配置
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 数据库初始化

### MySQL 数据库设置
```sql
-- 创建数据库
CREATE DATABASE portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'portal_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON portal_db.* TO 'portal_user'@'%';
FLUSH PRIVILEGES;
```

## 监控和维护

### 1. 健康检查
- 前端：访问 `https://your-domain.com`
- 后端：访问 `https://your-api-domain.com/actuator/health`

### 2. 日志监控
- 前端：使用 Vercel 或 Netlify 的内置日志
- 后端：配置日志收集系统（如 ELK Stack）

### 3. 性能监控
- 使用 Google Analytics 监控前端性能
- 使用 Spring Boot Actuator 监控后端性能

## 安全考虑

### 1. HTTPS 配置
- 前端：Vercel/Netlify 自动提供 HTTPS
- 后端：使用 Nginx 反向代理配置 SSL

### 2. API 安全
- 实施 API 频率限制
- 添加 JWT 认证（如需要）
- 配置 CORS 策略

### 3. 数据库安全
- 使用强密码
- 限制数据库访问权限
- 定期备份数据

## 扩展性考虑

### 1. CDN 配置
- 前端静态资源使用 CDN 加速
- 图片资源优化和压缩

### 2. 缓存策略
- 前端：浏览器缓存和 CDN 缓存
- 后端：Redis 缓存热点数据

### 3. 负载均衡
- 多实例部署
- 使用 Nginx 或云负载均衡器

## 备份策略

### 1. 代码备份
- 使用 Git 版本控制
- 定期推送到多个远程仓库

### 2. 数据库备份
```bash
# 每日自动备份
mysqldump -u portal_user -p portal_db > backup_$(date +%Y%m%d).sql
```

### 3. 配置文件备份
- 备份所有配置文件
- 使用版本控制管理配置变更