package com.ningbo.portal.service;

import com.ningbo.portal.entity.Product;
import com.ningbo.portal.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> findAll() {
        return productRepository.findAll();
    }
    
    public List<Product> findActiveProducts() {
        return productRepository.findByIsActiveTrueOrderBySortOrder();
    }
    
    public List<Product> findByCategory(String category) {
        return productRepository.findByCategoryAndIsActiveTrue(category);
    }
    
    public List<String> findDistinctCategories() {
        return productRepository.findDistinctCategories();
    }
    
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    public Product save(Product product) {
        return productRepository.save(product);
    }
    
    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}