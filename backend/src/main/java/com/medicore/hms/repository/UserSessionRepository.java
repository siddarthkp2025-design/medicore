package com.medicore.hms.repository;

import com.medicore.hms.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    List<UserSession> findByUserIdOrderByLoginAtDesc(Long userId);
    List<UserSession> findTop50ByOrderByLoginAtDesc();
}
