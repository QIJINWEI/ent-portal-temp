package com.ningbo.portal.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class PasswordTestRunner implements CommandLineRunner {
    
    @Override
    public void run(String... args) throws Exception {
        if (args.length > 0 && args[0].equals("test-password")) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String password = "admin123";
            String hashedPassword = encoder.encode(password);
            
            System.out.println("=== 密码测试 ===");
            System.out.println("原始密码: " + password);
            System.out.println("哈希密码: " + hashedPassword);
            
            boolean matches = encoder.matches(password, hashedPassword);
            System.out.println("密码匹配: " + matches);
            
            // 测试数据库中的哈希
            String dbHash = "$2a$10$YUB1CqZeXj2YXzqaygF55u94WKX4gNxh7Qnl3QK9SQ5Z7gE9QKnxu";
            boolean dbMatches = encoder.matches(password, dbHash);
            System.out.println("数据库哈希匹配: " + dbMatches);
            
            // 生成一个新的哈希用于更新数据库
            String newHash = encoder.encode(password);
            System.out.println("新的哈希: " + newHash);
        }
    }
}