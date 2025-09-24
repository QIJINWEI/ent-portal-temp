package com.ningbo.portal.repository;

import com.ningbo.portal.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    Page<News> findByIsPublishedTrueOrderByPublishedAtDesc(Pageable pageable);
    
    List<News> findTop6ByIsPublishedTrueOrderByPublishedAtDesc();
    
    Page<News> findByCategoryAndIsPublishedTrueOrderByPublishedAtDesc(String category, Pageable pageable);
    
    @Query("SELECT DISTINCT n.category FROM News n WHERE n.isPublished = true")
    List<String> findDistinctCategories();
}