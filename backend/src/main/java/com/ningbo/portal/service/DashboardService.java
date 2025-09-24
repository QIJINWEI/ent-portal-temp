package com.ningbo.portal.service;

import com.ningbo.portal.repository.AdminUserRepository;
import com.ningbo.portal.repository.ProductRepository;
import com.ningbo.portal.repository.NewsRepository;
import com.ningbo.portal.repository.CompanyInfoRepository;
import com.ningbo.portal.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    
    @Autowired
    private AdminUserRepository adminUserRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private NewsRepository newsRepository;
    
    @Autowired
    private CompanyInfoRepository companyInfoRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", adminUserRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalNews", newsRepository.count());
        stats.put("totalCompanies", companyInfoRepository.count());
        stats.put("totalMessages", messageRepository.count());
        stats.put("unreadMessages", messageRepository.countUnreadMessages());
        
        return stats;
    }
    
    /**
     * 获取最近活动记录
     */
    public List<Map<String, Object>> getRecentActivities(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // 这里应该从日志或活动记录表中获取真实数据
        // 目前使用模拟数据
        activities.add(createActivity(1L, "2小时前", "新增产品", "智能制造解决方案", "管理员"));
        activities.add(createActivity(2L, "5小时前", "更新新闻", "公司获得技术创新奖", "编辑员"));
        activities.add(createActivity(3L, "1天前", "修改配置", "网站标题更新", "管理员"));
        activities.add(createActivity(4L, "2天前", "新增用户", "编辑员工张三", "超级管理员"));
        activities.add(createActivity(5L, "3天前", "发布新闻", "数字化转型新趋势", "编辑员"));
        
        // 限制返回数量
        return activities.subList(0, Math.min(limit, activities.size()));
    }
    
    private Map<String, Object> createActivity(Long id, String time, String action, String target, String operator) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("id", id);
        activity.put("time", time);
        activity.put("action", action);
        activity.put("target", target);
        activity.put("operator", operator);
        return activity;
    }
}