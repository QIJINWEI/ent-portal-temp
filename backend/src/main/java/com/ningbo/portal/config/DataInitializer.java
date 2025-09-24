package com.ningbo.portal.config;

import com.ningbo.portal.entity.CompanyInfo;
import com.ningbo.portal.entity.News;
import com.ningbo.portal.entity.Product;
import com.ningbo.portal.repository.CompanyInfoRepository;
import com.ningbo.portal.repository.NewsRepository;
import com.ningbo.portal.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private CompanyInfoRepository companyInfoRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private NewsRepository newsRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // 初始化公司信息
        if (companyInfoRepository.count() == 0) {
            CompanyInfo company = new CompanyInfo();
            company.setName("宁波数字科技有限公司");
            company.setDescription("专业的数字化转型服务提供商，为企业提供全方位的技术解决方案和咨询服务");
            company.setPhoneNumber("+86 574-8888-8888");
            company.setEmail("contact@ningbo-tech.com");
            company.setAddress("浙江省宁波市高新区创新路123号");
            company.setBusinessScope("软件开发、系统集成、技术咨询、数字化转型");
            company.setEstablishedYear(2014);
            company.setEmployeeCount(50);
            companyInfoRepository.save(company);
        }
        
        // 初始化产品信息
        if (productRepository.count() == 0) {
            Product[] products = {
                createProduct("企业官网开发", "专业的企业官网设计开发服务", "网站开发", new BigDecimal("50000"), "响应式设计,SEO优化,高性能,安全可靠", 1),
                createProduct("移动应用开发", "iOS、Android原生应用及跨平台应用开发", "移动应用", new BigDecimal("80000"), "原生体验,跨平台兼容,性能优化,用户友好", 2),
                createProduct("企业管理系统", "ERP、CRM、OA等企业管理系统定制开发", "系统集成", new BigDecimal("120000"), "模块化设计,流程自动化,数据分析,权限管理", 3),
                createProduct("电商平台解决方案", "完整的电商平台搭建，包含支付、物流等功能", "电商平台", new BigDecimal("150000"), "多端同步,支付集成,订单管理,数据分析", 4),
                createProduct("云端部署服务", "云服务器部署、容器化、微服务架构设计", "云服务", new BigDecimal("30000"), "弹性扩展,高可用性,自动化部署,监控运维", 5),
                createProduct("数据分析平台", "大数据分析、商业智能、数据可视化解决方案", "数据分析", new BigDecimal("100000"), "实时分析,可视化报表,智能决策,预测分析", 6)
            };
            
            for (Product product : products) {
                productRepository.save(product);
            }
        }
        
        // 初始化新闻信息
        if (newsRepository.count() == 0) {
            News[] newsArticles = {
                createNews("数字化转型新趋势：AI技术在企业管理中的应用", 
                         "探讨人工智能技术如何助力企业实现智能化管理，提升运营效率和决策质量", 
                         "随着人工智能技术的快速发展，越来越多的企业开始将AI技术应用到日常管理中...", 
                         "技术前沿", "张三", "5分钟"),
                         
                createNews("云原生架构：企业数字化基础设施的演进", 
                         "解析云原生技术如何重塑企业IT架构，为数字化转型提供更强大的技术支撑", 
                         "云原生架构作为现代企业IT基础设施的重要组成部分，正在成为数字化转型的关键技术...", 
                         "云计算", "李四", "8分钟"),
                         
                createNews("2024年企业数字化转型报告发布", 
                         "最新行业报告显示，数字化转型已成为企业发展的核心战略，成功率大幅提升", 
                         "根据最新发布的《2024年企业数字化转型报告》，今年企业数字化转型的成功率达到75%...", 
                         "行业报告", "王五", "6分钟"),
                         
                createNews("微服务架构在大型企业中的实践经验", 
                         "分享某大型制造企业成功实施微服务架构的完整过程和关键经验总结", 
                         "微服务架构作为现代软件架构的重要模式，在大型企业中的应用越来越广泛...", 
                         "案例分析", "赵六", "7分钟"),
                         
                createNews("数据安全新规范：企业如何应对数据合规挑战", 
                         "深入分析最新数据安全法规对企业的影响，提供实用的合规建议和解决方案", 
                         "随着《数据安全法》和《个人信息保护法》的正式实施，企业面临着更加严格的数据合规要求...", 
                         "数据安全", "孙七", "4分钟"),
                         
                createNews("低代码平台助力中小企业快速数字化", 
                         "介绍低代码开发平台如何帮助中小企业以更低成本、更快速度实现数字化转型", 
                         "低代码开发平台作为一种新兴的软件开发方式，正在为中小企业的数字化转型提供新的可能...", 
                         "解决方案", "周八", "6分钟")
            };
            
            for (News news : newsArticles) {
                newsRepository.save(news);
            }
        }
    }
    
    private Product createProduct(String name, String description, String category, BigDecimal price, String features, int sortOrder) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);
        product.setFeatures(features);
        product.setIsActive(true);
        product.setSortOrder(sortOrder);
        return product;
    }
    
    private News createNews(String title, String excerpt, String content, String category, String author, String readTime) {
        News news = new News();
        news.setTitle(title);
        news.setExcerpt(excerpt);
        news.setContent(content);
        news.setCategory(category);
        news.setAuthor(author);
        news.setReadTime(readTime);
        news.setIsPublished(true);
        news.setPublishedAt(LocalDateTime.now().minusDays((long) (Math.random() * 30)));
        news.setViewCount(0L);
        return news;
    }
}