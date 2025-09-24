package com.ningbo.portal.repository;

import com.ningbo.portal.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
    
    Optional<SystemConfig> findByConfigKey(String configKey);
    
    boolean existsByConfigKey(String configKey);
}