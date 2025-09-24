package com.ningbo.portal.service;

import com.ningbo.portal.entity.SystemConfig;
import com.ningbo.portal.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SystemConfigService {
    
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    
    public List<SystemConfig> findAll() {
        return systemConfigRepository.findAll();
    }
    
    public Optional<SystemConfig> findById(Long id) {
        return systemConfigRepository.findById(id);
    }
    
    public Optional<SystemConfig> findByConfigKey(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey);
    }
    
    public String getConfigValue(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey)
                .map(SystemConfig::getConfigValue)
                .orElse(null);
    }
    
    public String getConfigValue(String configKey, String defaultValue) {
        return systemConfigRepository.findByConfigKey(configKey)
                .map(SystemConfig::getConfigValue)
                .orElse(defaultValue);
    }
    
    public SystemConfig save(SystemConfig systemConfig) {
        return systemConfigRepository.save(systemConfig);
    }
    
    public SystemConfig saveOrUpdate(String configKey, String configValue, String description) {
        Optional<SystemConfig> existingConfig = systemConfigRepository.findByConfigKey(configKey);
        
        if (existingConfig.isPresent()) {
            SystemConfig config = existingConfig.get();
            config.setConfigValue(configValue);
            if (description != null) {
                config.setDescription(description);
            }
            return systemConfigRepository.save(config);
        } else {
            SystemConfig newConfig = new SystemConfig(configKey, configValue, description);
            return systemConfigRepository.save(newConfig);
        }
    }
    
    public void deleteById(Long id) {
        systemConfigRepository.deleteById(id);
    }
    
    public void deleteByConfigKey(String configKey) {
        Optional<SystemConfig> config = systemConfigRepository.findByConfigKey(configKey);
        config.ifPresent(systemConfig -> systemConfigRepository.delete(systemConfig));
    }
    
    public boolean existsByConfigKey(String configKey) {
        return systemConfigRepository.existsByConfigKey(configKey);
    }
}