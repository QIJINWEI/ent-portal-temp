-- 创建数据库
CREATE DATABASE IF NOT EXISTS portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE portal_db;

-- 创建管理员用户表
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'ADMIN',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认管理员用户 (密码: admin123)
INSERT IGNORE INTO admin_users (username, password, email, full_name, role) VALUES 
('admin', '$2a$10$7KUW8E7z2DKlnKKzQhJpYuXfZHc.RU8tDj.rBSDL9tK7BSu9WD.4W', 'admin@ningbo.com', '系统管理员', 'SUPER_ADMIN');

-- 创建系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认配置
INSERT IGNORE INTO system_configs (config_key, config_value, description) VALUES 
('site_name', '宁波企业门户', '网站名称'),
('site_description', '专业的企业门户网站', '网站描述'),
('admin_email', 'admin@ningbo.com', '管理员邮箱'),
('maintenance_mode', 'false', '维护模式');

-- 创建企业信息表
CREATE TABLE IF NOT EXISTS company_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone_number VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    business_scope TEXT,
    established_year INT,
    employee_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入企业信息示例数据
INSERT IGNORE INTO company_info (id, name, description, phone_number, email, address, business_scope, established_year, employee_count) VALUES 
(1, '宁波科技有限公司', '专注于企业数字化转型和智能化解决方案，为客户提供全方位的技术服务和咨询。我们拥有专业的技术团队和丰富的行业经验，致力于帮助企业实现数字化升级。', '0574-88888888', 'info@ningbo.com', '宁波市海曙区科技园区创新大厦8楼', '软件开发、系统集成、技术咨询、数字化转型服务', 2018, 150);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    features TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入产品示例数据
INSERT IGNORE INTO products (name, description, category, price, image_url, features, is_active, sort_order) VALUES 
('企业管理系统', '全面的企业资源规划(ERP)系统，集成财务、人力资源、采购、销售等核心业务模块。', '管理软件', 50000.00, '/api/placeholder/400/300', '模块化设计;云端部署;移动端支持;数据分析', TRUE, 1),
('智能客服平台', '基于AI技术的智能客服解决方案，提供7*24小时自动客服服务，大幅提升客户满意度。', '人工智能', 30000.00, '/api/placeholder/400/300', 'AI对话引擎;多渠道接入;知识库管理;工单系统', TRUE, 2),
('数据分析平台', '企业级大数据分析平台，帮助企业挖掘数据价值，支持实时数据处理和可视化展示。', '大数据', 80000.00, '/api/placeholder/400/300', '实时处理;可视化图表;机器学习;数据安全', TRUE, 3),
('移动办公套件', '完整的移动办公解决方案，支持远程办公、视频会议、文档协作等功能。', '办公软件', 20000.00, '/api/placeholder/400/300', '跨平台支持;实时协作;视频会议;文件管理', TRUE, 4),
('云存储服务', '企业级云存储解决方案，提供安全、可靠、高性能的数据存储和备份服务。', '云服务', 15000.00, '/api/placeholder/400/300', '数据加密;自动备份;版本控制;权限管理', TRUE, 5),
('区块链平台', '企业级区块链开发平台，支持智能合约开发和区块链应用部署。', '区块链', 100000.00, '/api/placeholder/400/300', '智能合约;去中心化;安全可信;可扩展性', TRUE, 6);

-- 创建新闻表
CREATE TABLE IF NOT EXISTS news (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    image_url VARCHAR(500),
    author VARCHAR(100),
    read_time VARCHAR(20),
    is_published BOOLEAN DEFAULT FALSE,
    view_count BIGINT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入新闻示例数据
INSERT IGNORE INTO news (title, excerpt, content, category, image_url, author, read_time, is_published, view_count, published_at) VALUES 
('数字化转型新趋势：AI技术在企业管理中的应用', '探讨人工智能技术如何助力企业实现智能化管理，提升运营效率和决策质量...', '随着人工智能技术的快速发展，越来越多的企业开始将AI技术应用到管理流程中。从智能客服到自动化决策，AI正在重塑企业的运营模式。\n\n在客户服务方面，智能客服系统能够24小时不间断地为客户提供服务，通过自然语言处理技术理解客户需求，并给出准确的回答。这不仅提高了客户满意度，也大大降低了人工成本。\n\n在数据分析领域，机器学习算法能够从海量数据中挖掘出有价值的商业洞察，帮助管理层做出更明智的决策。预测分析、风险评估、市场趋势预测等应用正在成为企业竞争的重要优势。\n\n然而，AI技术的应用也面临着数据安全、算法透明度、员工技能转型等挑战。企业需要制定合适的AI战略，确保技术应用与业务目标相匹配。', '技术前沿', '/api/placeholder/600/400', '张三', '5分钟', TRUE, 120, '2024-01-15 10:00:00'),
('云原生架构：企业数字化基础设施的演进', '云原生技术如何帮助企业构建更加灵活、可扩展的IT基础设施...', '云原生架构代表了现代软件开发和部署的最佳实践。通过容器化、微服务、DevOps等技术，企业能够构建更加敏捷和弹性的IT系统。\n\n容器化技术使得应用程序能够在任何环境中一致地运行，大大简化了部署和运维的复杂性。Kubernetes等容器编排平台进一步提供了自动化的服务管理和弹性伸缩能力。\n\n微服务架构将复杂的单体应用拆分为多个独立的服务，每个服务可以独立开发、部署和扩展。这种架构模式提高了系统的可维护性和可扩展性。\n\n持续集成和持续部署(CI/CD)流水线实现了从代码提交到生产部署的全自动化过程，大大提高了软件交付的速度和质量。\n\n云原生架构的采用需要组织文化和技术能力的同步转型，包括DevOps文化的建立、团队技能的提升等。', '技术前沿', '/api/placeholder/600/400', '李四', '8分钟', TRUE, 95, '2024-01-10 14:30:00'),
('企业数据安全：构建全方位的防护体系', '在数字化时代，如何保护企业核心数据资产，建立完善的安全防护机制...', '数据安全已成为企业数字化转型过程中的重中之重。随着数据价值的不断提升和法规要求的日益严格，企业必须建立全方位的数据安全防护体系。\n\n身份认证与访问控制是数据安全的第一道防线。多因子认证、零信任架构等技术确保只有授权用户才能访问敏感数据。基于角色的访问控制(RBAC)和基于属性的访问控制(ABAC)提供了精细化的权限管理。\n\n数据加密技术保护数据在传输和存储过程中的安全。端到端加密确保数据在整个生命周期中都得到保护。密钥管理系统负责加密密钥的安全生成、分发和轮换。\n\n数据备份与灾难恢复机制确保在发生安全事件时能够快速恢复业务。定期的备份测试和灾难恢复演练是确保系统可用性的关键。\n\n安全监控和事件响应系统能够实时检测安全威胁并快速响应。安全信息与事件管理(SIEM)系统整合各种安全日志，提供统一的安全态势感知。', '网络安全', '/api/placeholder/600/400', '王五', '6分钟', TRUE, 78, '2024-01-08 09:15:00'),
('敏捷开发与DevOps：加速软件交付的最佳实践', '探讨敏捷开发方法论和DevOps文化如何提高软件开发效率和质量...', '敏捷开发和DevOps文化正在成为现代软件开发的标准实践。这些方法论不仅提高了软件交付的速度，也显著改善了软件质量和团队协作效率。\n\nScrum和Kanban等敏捷框架通过迭代式开发、持续反馈和团队自组织，使开发团队能够快速响应需求变化。每日站会、冲刺回顾等实践促进了团队内部的沟通和协作。\n\nDevOps文化打破了开发和运维之间的壁垒，强调全生命周期的协作。通过自动化测试、持续集成、基础设施即代码等实践，实现了从开发到部署的端到端自动化。\n\n测试驱动开发(TDD)和行为驱动开发(BDD)确保了代码质量和需求的准确实现。自动化测试金字塔模型指导团队建立高效的测试策略。\n\n监控和可观测性是DevOps实践的重要组成部分。通过日志聚合、指标监控、分布式追踪等技术，团队能够快速发现和解决生产环境中的问题。', '软件开发', '/api/placeholder/600/400', '赵六', '7分钟', TRUE, 156, '2024-01-05 16:45:00'),
('物联网与边缘计算：连接万物的智能未来', '物联网技术如何与边缘计算结合，为企业创造新的业务价值...', '物联网(IoT)和边缘计算的结合正在开启一个万物互联的智能时代。这种技术组合为企业提供了前所未有的数据洞察和业务优化机会。\n\n物联网设备收集来自物理世界的实时数据，包括温度、湿度、位置、运动状态等。这些数据为企业提供了深入了解运营状况的窗口。\n\n边缘计算将数据处理能力推向网络边缘，使得设备能够在本地进行数据分析和决策。这种架构减少了网络延迟，提高了系统响应速度，同时降低了带宽成本。\n\n在制造业，智能传感器和边缘计算结合实现了预测性维护，通过分析设备运行数据预测故障，避免意外停机。在零售业，智能货架和客流分析系统优化了库存管理和客户体验。\n\n数据安全和隐私保护是IoT部署的重要考虑因素。设备认证、数据加密、安全更新机制等措施确保了IoT系统的安全性。\n\n随着5G网络的普及，IoT和边缘计算的应用场景将进一步扩展，为企业数字化转型提供更多可能性。', '技术前沿', '/api/placeholder/600/400', '陈七', '9分钟', TRUE, 203, '2024-01-03 11:20:00'),
('低代码平台：让业务人员也能开发应用', '低代码开发平台如何降低应用开发门槛，加速企业数字化进程...', '低代码开发平台正在改变传统的软件开发模式，让非技术背景的业务人员也能参与应用开发，大大加速了企业的数字化进程。\n\n传统的软件开发需要专业的编程技能和大量的时间投入。低代码平台通过可视化的开发环境、拖拽式的界面设计、预构建的组件库，将复杂的编程工作简化为直观的配置过程。\n\n业务用户能够直接参与应用开发，减少了需求传达中的信息损失，确保开发出的应用更贴近实际业务需求。这种"公民开发者"模式大大缩短了从需求提出到应用上线的周期。\n\n低代码平台通常提供丰富的集成能力，能够轻松连接现有的企业系统和第三方服务。API管理、数据连接器、工作流引擎等功能支持复杂的业务场景。\n\n然而，低代码平台也有其局限性。对于复杂的业务逻辑和高性能要求的应用，传统的编程方式仍然是必要的。企业需要根据具体场景选择合适的开发方式。\n\n治理和安全是低代码平台部署的重要考虑因素。企业需要建立相应的开发规范和审核机制，确保应用质量和数据安全。', '软件开发', '/api/placeholder/600/400', '刘八', '6分钟', TRUE, 89, '2024-01-01 13:30:00');