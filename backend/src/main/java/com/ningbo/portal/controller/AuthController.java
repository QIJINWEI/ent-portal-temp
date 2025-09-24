package com.ningbo.portal.controller;

import com.ningbo.portal.dto.LoginRequest;
import com.ningbo.portal.dto.LoginResponse;
import com.ningbo.portal.entity.AdminUser;
import com.ningbo.portal.service.AdminUserService;
import com.ningbo.portal.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private AdminUserService adminUserService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // 认证用户
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            // 生成JWT token
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            
            // 获取用户信息
            Optional<AdminUser> userOpt = adminUserService.findByUsername(loginRequest.getUsername());
            if (userOpt.isPresent()) {
                AdminUser user = userOpt.get();
                LoginResponse response = new LoginResponse(
                        token,
                        user.getUsername(),
                        user.getFullName(),
                        user.getRole().name()
                );
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("用户不存在");
            }
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("用户名或密码错误");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("登录失败：" + e.getMessage());
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT是无状态的，logout主要在前端处理，删除本地存储的token
        return ResponseEntity.ok("退出登录成功");
    }
}