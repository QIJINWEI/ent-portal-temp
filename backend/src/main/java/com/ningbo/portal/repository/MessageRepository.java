package com.ningbo.portal.repository;

import com.ningbo.portal.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // 按阅读状态查询
    Page<Message> findByIsReadOrderByCreatedAtDesc(Boolean isRead, Pageable pageable);
    
    // 按回复状态查询
    Page<Message> findByIsRepliedOrderByCreatedAtDesc(Boolean isReplied, Pageable pageable);
    
    // 按创建时间倒序查询所有
    Page<Message> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 统计未读留言数量
    @Query("SELECT COUNT(m) FROM Message m WHERE m.isRead = false")
    long countUnreadMessages();
    
    // 统计未回复留言数量
    @Query("SELECT COUNT(m) FROM Message m WHERE m.isReplied = false")
    long countUnrepliedMessages();
}