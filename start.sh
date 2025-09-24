#!/bin/bash

echo "正在启动宁波企业门户系统..."

echo ""
echo "========================================"
echo "第一步：启动MySQL数据库"
echo "========================================"
echo "请确保MySQL服务已启动，并执行以下SQL脚本："
echo "backend/sql/init.sql"
echo ""
echo "数据库配置信息："
echo "数据库名: portal_db"
echo "用户名: root"
echo "密码: 123456"
echo "端口: 3306"
echo ""
read -p "按Enter键继续..."

echo ""
echo "========================================"
echo "第二步：启动后端服务"
echo "========================================"
cd backend
echo "正在编译和启动Spring Boot应用..."
mvn clean spring-boot:run -Dmaven.test.skip=true &
BACKEND_PID=$!

# 等待后端启动
sleep 10

echo ""
echo "========================================"
echo "第三步：启动前端服务"
echo "========================================"
cd ../frontend
echo "正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "前端依赖安装失败"
    kill $BACKEND_PID
    exit 1
fi

echo "正在启动前端开发服务器..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "系统启动完成！"
echo "========================================"
echo "前端网站: http://localhost:3000"
echo "管理后台: http://localhost:3000/admin"
echo "后端API: http://localhost:8080"
echo ""
echo "默认管理员账号: admin"
echo "默认管理员密码: admin123"
echo "========================================"

# 等待用户按键退出
echo "按Ctrl+C退出系统"
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait