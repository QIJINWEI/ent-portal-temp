package com.ningbo.portal.service;

import com.ningbo.portal.entity.Message;
import com.ningbo.portal.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    public List<Message> findAll() {
        return messageRepository.findAll();
    }
    
    public Page<Message> findAllMessages(Pageable pageable) {
        return messageRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    public Page<Message> findByReadStatus(Boolean isRead, Pageable pageable) {
        return messageRepository.findByIsReadOrderByCreatedAtDesc(isRead, pageable);
    }
    
    public Page<Message> findByReplyStatus(Boolean isReplied, Pageable pageable) {
        return messageRepository.findByIsRepliedOrderByCreatedAtDesc(isReplied, pageable);
    }
    
    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }
    
    public Message save(Message message) {
        return messageRepository.save(message);
    }
    
    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }
    
    // 标记为已读
    public Message markAsRead(Long id) {
        Optional<Message> messageOptional = messageRepository.findById(id);
        if (messageOptional.isPresent()) {
            Message message = messageOptional.get();
            message.setIsRead(true);
            return messageRepository.save(message);
        }
        return null;
    }
    
    // 回复留言
    public Message replyMessage(Long id, String replyContent) {
        Optional<Message> messageOptional = messageRepository.findById(id);
        if (messageOptional.isPresent()) {
            Message message = messageOptional.get();
            message.setReplyContent(replyContent);
            message.setIsReplied(true);
            message.setReplyTime(LocalDateTime.now());
            message.setIsRead(true); // 回复时同时标记为已读
            return messageRepository.save(message);
        }
        return null;
    }
    
    // 获取统计信息
    public long getUnreadCount() {
        return messageRepository.countUnreadMessages();
    }
    
    public long getUnrepliedCount() {
        return messageRepository.countUnrepliedMessages();
    }
}