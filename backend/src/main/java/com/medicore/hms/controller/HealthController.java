package com.medicore.hms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        String dbInfo = "Supabase PostgreSQL";
        String dbStatus = "UP";
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                dbInfo = conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion();
            } catch (Exception e) {
                dbStatus = "DOWN";
            }
        }
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP".equals(dbStatus) ? "UP" : "DEGRADED");
        response.put("service", "MediCore HMS Backend");
        response.put("database", dbInfo);
        response.put("databaseStatus", dbStatus);
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}
