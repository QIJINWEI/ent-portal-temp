package com.ningbo.portal.entity;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "姓名不能为空")
    @Size(max = 100, message = "姓名长度不能超过100字符")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @Column(nullable = false)
    private String email;
    
    @Size(max = 20, message = "电话号码长度不能超过20字符")
    private String phone;
    
    @Size(max = 100, message = "公司名称长度不能超过100字符")
    private String company;
    
    @Size(max = 200, message = "主题长度不能超过200字符")
    private String subject;
    
    @NotBlank(message = "留言内容不能为空")
    @Column(length = 2000, nullable = false)
    private String content;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "is_replied")
    private Boolean isReplied = false;
    
    @Column(name = "reply_content", length = 2000)
    private String replyContent;
    
    @Column(name = "reply_time")
    private LocalDateTime replyTime;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 构造函数
    public Message() {}
    
    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public Boolean getIsReplied() {
        return isReplied;
    }
    
    public void setIsReplied(Boolean isReplied) {
        this.isReplied = isReplied;
    }
    
    public String getReplyContent() {
        return replyContent;
    }
    
    public void setReplyContent(String replyContent) {
        this.replyContent = replyContent;
    }
    
    public LocalDateTime getReplyTime() {
        return replyTime;
    }
    
    public void setReplyTime(LocalDateTime replyTime) {
        this.replyTime = replyTime;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}