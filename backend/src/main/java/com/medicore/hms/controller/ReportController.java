package com.medicore.hms.controller;

import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.security.SecurityUtils;
import com.medicore.hms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    private final SecurityUtils securityUtils;

    @GetMapping("/dashboard/admin")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Admin dashboard is restricted to administrators");
        }
        return ResponseEntity.ok(reportService.getAdminDashboardStats());
    }

    @GetMapping("/dashboard/doctor")
    public ResponseEntity<Map<String, Object>> getDoctorStats(@RequestParam(required = false) Long doctorId) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot access doctor dashboard statistics");
        }
        if (securityUtils.isDoctor()) {
            doctorId = securityUtils.getCurrentDoctorId();
        }
        return ResponseEntity.ok(reportService.getDoctorDashboardStats(doctorId));
    }

    @GetMapping("/dashboard/patient")
    public ResponseEntity<Map<String, Object>> getPatientStats(@RequestParam(required = false) Long patientId) {
        if (securityUtils.isPatient()) {
            // Patient always gets their own dashboard stats; ignore any client-supplied ID
            patientId = securityUtils.getCurrentPatientId();
        } else if (patientId == null) {
            throw new ForbiddenException("Patient ID is required for non-patient callers");
        }
        return ResponseEntity.ok(reportService.getPatientDashboardStats(patientId));
    }

    @GetMapping("/appointments/stats")
    public ResponseEntity<Map<String, Object>> getAppointmentStats() {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied");
        }
        return ResponseEntity.ok(reportService.getAppointmentStats());
    }

    @GetMapping("/revenue/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue() {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Financial reports are restricted to administrators");
        }
        return ResponseEntity.ok(reportService.getMonthlyRevenue());
    }

    @GetMapping("/patients/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyPatients() {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Demographic velocity reports are restricted to administrators");
        }
        return ResponseEntity.ok(reportService.getMonthlyPatientRegistrations());
    }

    @GetMapping("/departments/stats")
    public ResponseEntity<Map<String, Object>> getDepartmentStats() {
        return ResponseEntity.ok(reportService.getDepartmentStats());
    }
}
