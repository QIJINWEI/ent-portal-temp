package com.ningbo.portal.service;

import com.ningbo.portal.entity.CompanyInfo;
import com.ningbo.portal.repository.CompanyInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyInfoService {
    
    @Autowired
    private CompanyInfoRepository companyInfoRepository;
    
    public List<CompanyInfo> findAll() {
        return companyInfoRepository.findAll();
    }
    
    public Optional<CompanyInfo> findById(Long id) {
        return companyInfoRepository.findById(id);
    }
    
    public CompanyInfo save(CompanyInfo companyInfo) {
        return companyInfoRepository.save(companyInfo);
    }
    
    public void deleteById(Long id) {
        companyInfoRepository.deleteById(id);
    }
    
    public CompanyInfo getMainCompanyInfo() {
        List<CompanyInfo> companies = companyInfoRepository.findAll();
        return companies.isEmpty() ? null : companies.get(0);
    }
}