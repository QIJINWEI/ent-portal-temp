package com.ningbo.portal.controller;

import com.ningbo.portal.entity.CompanyInfo;
import com.ningbo.portal.service.CompanyInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyInfoController {
    
    @Autowired
    private CompanyInfoService companyInfoService;
    
    @GetMapping
    public ResponseEntity<List<CompanyInfo>> getAllCompanyInfo() {
        List<CompanyInfo> companies = companyInfoService.findAll();
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/main")
    public ResponseEntity<CompanyInfo> getMainCompanyInfo() {
        CompanyInfo company = companyInfoService.getMainCompanyInfo();
        if (company != null) {
            return ResponseEntity.ok(company);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CompanyInfo> getCompanyInfoById(@PathVariable Long id) {
        Optional<CompanyInfo> company = companyInfoService.findById(id);
        return company.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<CompanyInfo> createCompanyInfo(@RequestBody CompanyInfo companyInfo) {
        CompanyInfo savedCompany = companyInfoService.save(companyInfo);
        return ResponseEntity.ok(savedCompany);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CompanyInfo> updateCompanyInfo(@PathVariable Long id, @RequestBody CompanyInfo companyInfo) {
        Optional<CompanyInfo> existingCompany = companyInfoService.findById(id);
        if (existingCompany.isPresent()) {
            companyInfo.setId(id);
            CompanyInfo updatedCompany = companyInfoService.save(companyInfo);
            return ResponseEntity.ok(updatedCompany);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompanyInfo(@PathVariable Long id) {
        Optional<CompanyInfo> company = companyInfoService.findById(id);
        if (company.isPresent()) {
            companyInfoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}