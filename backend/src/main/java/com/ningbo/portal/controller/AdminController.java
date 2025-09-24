package com.ningbo.portal.controller;

import com.ningbo.portal.entity.AdminUser;
import com.ningbo.portal.entity.SystemConfig;
import com.ningbo.portal.entity.Product;
import com.ningbo.portal.entity.News;
import com.ningbo.portal.entity.Message;
import com.ningbo.portal.service.AdminUserService;
import com.ningbo.portal.service.SystemConfigService;
import com.ningbo.portal.service.DashboardService;
import com.ningbo.portal.service.ProductService;
import com.ningbo.portal.service.NewsService;
import com.ningbo.portal.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminUserService adminUserService;
    
    @Autowired
    private SystemConfigService systemConfigService;
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private NewsService newsService;
    
    @Autowired
    private MessageService messageService;
    
    // ========== 用户管理 ==========
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Page<AdminUser>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<AdminUser> users = adminUserService.findAll(pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<AdminUser> getUser(@PathVariable Long id) {
        Optional<AdminUser> user = adminUserService.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUser adminUser) {
        try {
            // 检查用户名是否已存在
            if (adminUserService.existsByUsername(adminUser.getUsername())) {
                return ResponseEntity.badRequest().body("用户名已存在");
            }
            
            // 检查邮箱是否已存在
            if (adminUser.getEmail() != null && 
                adminUserService.existsByEmail(adminUser.getEmail())) {
                return ResponseEntity.badRequest().body("邮箱已存在");
            }
            
            AdminUser savedUser = adminUserService.save(adminUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建用户失败：" + e.getMessage());
        }
    }
    
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUser adminUser) {
        try {
            adminUser.setId(id);
            AdminUser updatedUser = adminUserService.update(adminUser);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新用户失败：" + e.getMessage());
        }
    }
    
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminUserService.deleteById(id);
            return ResponseEntity.ok("用户删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除用户失败：" + e.getMessage());
        }
    }
    
    @PostMapping("/users/{id}/change-password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("password");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("密码不能为空");
            }
            
            adminUserService.changePassword(id, newPassword);
            return ResponseEntity.ok("密码修改成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("修改密码失败：" + e.getMessage());
        }
    }
    
    // ========== 系统配置管理 ==========
    
    @GetMapping("/configs")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<SystemConfig>> getConfigs() {
        List<SystemConfig> configs = systemConfigService.findAll();
        return ResponseEntity.ok(configs);
    }
    
    @GetMapping("/configs/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<SystemConfig> getConfig(@PathVariable Long id) {
        Optional<SystemConfig> config = systemConfigService.findById(id);
        return config.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/configs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createConfig(@Valid @RequestBody SystemConfig systemConfig) {
        try {
            if (systemConfigService.existsByConfigKey(systemConfig.getConfigKey())) {
                return ResponseEntity.badRequest().body("配置键已存在");
            }
            
            SystemConfig savedConfig = systemConfigService.save(systemConfig);
            return ResponseEntity.ok(savedConfig);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建配置失败：" + e.getMessage());
        }
    }
    
    @PutMapping("/configs/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateConfig(@PathVariable Long id, @Valid @RequestBody SystemConfig systemConfig) {
        try {
            systemConfig.setId(id);
            SystemConfig savedConfig = systemConfigService.save(systemConfig);
            return ResponseEntity.ok(savedConfig);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新配置失败：" + e.getMessage());
        }
    }
    
    @DeleteMapping("/configs/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteConfig(@PathVariable Long id) {
        try {
            systemConfigService.deleteById(id);
            return ResponseEntity.ok("配置删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除配置失败：" + e.getMessage());
        }
    }
    
    // ========== 仪表盘统计 ==========
    
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取统计数据失败：" + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/dashboard/activities")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities(
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<Map<String, Object>> activities = dashboardService.getRecentActivities(limit);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    // ========== 产品管理 ==========
    
    @GetMapping("/products")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        try {
            List<Product> products = productService.findAll(); // 返回全量数据，包括isActive=false
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/products/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Product> getProductForAdmin(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/products")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
        try {
            Product savedProduct = productService.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建产品失败：" + e.getMessage());
        }
    }
    
    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        try {
            product.setId(id);
            Product updatedProduct = productService.save(product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新产品失败：" + e.getMessage());
        }
    }
    
    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteById(id);
            return ResponseEntity.ok("产品删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除产品失败：" + e.getMessage());
        }
    }
    
    // ========== 新闻管理 ==========
    
    @GetMapping("/news")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<News>> getAllNewsForAdmin() {
        try {
            List<News> newsList = newsService.findAll(); // 返回全量数据，包括isPublished=false
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/news/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<News> getNewsForAdmin(@PathVariable Long id) {
        Optional<News> news = newsService.findById(id);
        return news.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/news")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> createNews(@Valid @RequestBody News news) {
        try {
            News savedNews = newsService.save(news);
            return ResponseEntity.ok(savedNews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建新闻失败：" + e.getMessage());
        }
    }
    
    @PutMapping("/news/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> updateNews(@PathVariable Long id, @Valid @RequestBody News news) {
        try {
            news.setId(id);
            News updatedNews = newsService.save(news);
            return ResponseEntity.ok(updatedNews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新新闻失败：" + e.getMessage());
        }
    }
    
    @DeleteMapping("/news/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteNews(@PathVariable Long id) {
        try {
            newsService.deleteById(id);
            return ResponseEntity.ok("新闻删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除新闻失败：" + e.getMessage());
        }
    }
    
    // ========== 留言管理 ==========
    
    @GetMapping("/messages")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Page<Message>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) Boolean isReplied) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Message> messages;
            
            if (isRead != null) {
                messages = messageService.findByReadStatus(isRead, pageable);
            } else if (isReplied != null) {
                messages = messageService.findByReplyStatus(isReplied, pageable);
            } else {
                messages = messageService.findAllMessages(pageable);
            }
            
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Page.empty());
        }
    }
    
    @GetMapping("/messages/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Message> getMessage(@PathVariable Long id) {
        Optional<Message> message = messageService.findById(id);
        return message.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/messages/{id}/mark-read")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> markMessageAsRead(@PathVariable Long id) {
        try {
            Message message = messageService.markAsRead(id);
            if (message != null) {
                return ResponseEntity.ok("已标记为已读");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("标记失败：" + e.getMessage());
        }
    }
    
    @PostMapping("/messages/{id}/reply")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> replyMessage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String replyContent = request.get("replyContent");
            if (replyContent == null || replyContent.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("回复内容不能为空");
            }
            
            Message message = messageService.replyMessage(id, replyContent);
            if (message != null) {
                return ResponseEntity.ok(message);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("回复失败：" + e.getMessage());
        }
    }
    
    @DeleteMapping("/messages/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteById(id);
            return ResponseEntity.ok("留言删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除留言失败：" + e.getMessage());
        }
    }
    
    @GetMapping("/messages/stats")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMessageStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("unreadCount", messageService.getUnreadCount());
            stats.put("unrepliedCount", messageService.getUnrepliedCount());
            stats.put("totalCount", messageService.findAll().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取统计信息失败：" + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}