package com.ningbo.portal.controller;

import com.ningbo.portal.entity.Message;
import com.ningbo.portal.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @PostMapping
    public ResponseEntity<?> createMessage(@Valid @RequestBody Message message) {
        try {
            // 新留言默认为未读未回复状态
            message.setIsRead(false);
            message.setIsReplied(false);
            
            // 如果主题为空，设置默认主题
            if (message.getSubject() == null || message.getSubject().trim().isEmpty()) {
                message.setSubject("留言咨询");
            }
            
            Message savedMessage = messageService.save(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("提交留言失败：" + e.getMessage());
        }
    }
}