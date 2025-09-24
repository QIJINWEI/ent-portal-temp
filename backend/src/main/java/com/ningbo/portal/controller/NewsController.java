package com.ningbo.portal.controller;

import com.ningbo.portal.entity.News;
import com.ningbo.portal.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsController {
    
    @Autowired
    private NewsService newsService;
    
    @GetMapping
    public ResponseEntity<Page<News>> getAllNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> news = newsService.findPublishedNews(pageable);
        return ResponseEntity.ok(news);
    }
    
    @GetMapping("/latest")
    public ResponseEntity<List<News>> getLatestNews() {
        List<News> news = newsService.findLatestNews();
        return ResponseEntity.ok(news);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getNewsCategories() {
        List<String> categories = newsService.findDistinctCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<News>> getNewsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> news = newsService.findNewsByCategory(category, pageable);
        return ResponseEntity.ok(news);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        Optional<News> news = newsService.findById(id);
        if (news.isPresent()) {
            // 增加访问次数
            News updatedNews = newsService.incrementViewCount(id);
            return ResponseEntity.ok(updatedNews);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<News> createNews(@RequestBody News news) {
        News savedNews = newsService.save(news);
        return ResponseEntity.ok(savedNews);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @RequestBody News news) {
        Optional<News> existingNews = newsService.findById(id);
        if (existingNews.isPresent()) {
            news.setId(id);
            News updatedNews = newsService.save(news);
            return ResponseEntity.ok(updatedNews);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        Optional<News> news = newsService.findById(id);
        if (news.isPresent()) {
            newsService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}