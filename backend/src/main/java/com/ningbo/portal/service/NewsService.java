package com.ningbo.portal.service;

import com.ningbo.portal.entity.News;
import com.ningbo.portal.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NewsService {
    
    @Autowired
    private NewsRepository newsRepository;
    
    public List<News> findAll() {
        return newsRepository.findAll();
    }
    
    public Page<News> findPublishedNews(Pageable pageable) {
        return newsRepository.findByIsPublishedTrueOrderByPublishedAtDesc(pageable);
    }
    
    public List<News> findLatestNews() {
        return newsRepository.findTop6ByIsPublishedTrueOrderByPublishedAtDesc();
    }
    
    public Page<News> findNewsByCategory(String category, Pageable pageable) {
        return newsRepository.findByCategoryAndIsPublishedTrueOrderByPublishedAtDesc(category, pageable);
    }
    
    public List<String> findDistinctCategories() {
        return newsRepository.findDistinctCategories();
    }
    
    public Optional<News> findById(Long id) {
        return newsRepository.findById(id);
    }
    
    public News save(News news) {
        if (news.getIsPublished() && news.getPublishedAt() == null) {
            news.setPublishedAt(LocalDateTime.now());
        }
        return newsRepository.save(news);
    }
    
    public void deleteById(Long id) {
        newsRepository.deleteById(id);
    }
    
    public News incrementViewCount(Long id) {
        Optional<News> newsOptional = newsRepository.findById(id);
        if (newsOptional.isPresent()) {
            News news = newsOptional.get();
            news.setViewCount(news.getViewCount() + 1);
            return newsRepository.save(news);
        }
        return null;
    }
}