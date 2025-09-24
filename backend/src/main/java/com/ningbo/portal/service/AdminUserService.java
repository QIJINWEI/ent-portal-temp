package com.ningbo.portal.service;

import com.ningbo.portal.entity.AdminUser;
import com.ningbo.portal.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminUserService {
    
    @Autowired
    private AdminUserRepository adminUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Page<AdminUser> findAll(Pageable pageable) {
        return adminUserRepository.findAll(pageable);
    }
    
    public Optional<AdminUser> findById(Long id) {
        return adminUserRepository.findById(id);
    }
    
    public Optional<AdminUser> findByUsername(String username) {
        return adminUserRepository.findByUsername(username);
    }
    
    public AdminUser save(AdminUser adminUser) {
        if (adminUser.getId() == null) {
            // 新用户，加密密码
            adminUser.setPassword(passwordEncoder.encode(adminUser.getPassword()));
        }
        return adminUserRepository.save(adminUser);
    }
    
    public AdminUser update(AdminUser adminUser) {
        Optional<AdminUser> existingUser = adminUserRepository.findById(adminUser.getId());
        if (existingUser.isPresent()) {
            AdminUser user = existingUser.get();
            user.setUsername(adminUser.getUsername());
            user.setEmail(adminUser.getEmail());
            user.setFullName(adminUser.getFullName());
            user.setRole(adminUser.getRole());
            user.setEnabled(adminUser.getEnabled());
            
            // 如果密码不为空，则更新密码
            if (adminUser.getPassword() != null && !adminUser.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(adminUser.getPassword()));
            }
            
            return adminUserRepository.save(user);
        }
        throw new RuntimeException("用户不存在");
    }
    
    public void deleteById(Long id) {
        adminUserRepository.deleteById(id);
    }
    
    public boolean existsByUsername(String username) {
        return adminUserRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return adminUserRepository.existsByEmail(email);
    }
    
    public void changePassword(Long userId, String newPassword) {
        Optional<AdminUser> userOpt = adminUserRepository.findById(userId);
        if (userOpt.isPresent()) {
            AdminUser user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            adminUserRepository.save(user);
        } else {
            throw new RuntimeException("用户不存在");
        }
    }
}