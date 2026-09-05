package com.medicore.hms.security;

import com.medicore.hms.entity.Doctor;
import com.medicore.hms.entity.Patient;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.exception.UnauthorizedException;
import com.medicore.hms.repository.DoctorRepository;
import com.medicore.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public CustomUserDetails getCurrentUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return (CustomUserDetails) auth.getPrincipal();
    }

    public Long getCurrentUserId() {
        return getCurrentUserDetails().getId();
    }

    public String getCurrentUserRole() {
        return getCurrentUserDetails().getRole();
    }

    public boolean isPatient() {
        return "PATIENT".equalsIgnoreCase(getCurrentUserRole());
    }

    public boolean isDoctor() {
        return "DOCTOR".equalsIgnoreCase(getCurrentUserRole());
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(getCurrentUserRole());
    }

    public Patient getCurrentPatient() {
        Long userId = getCurrentUserId();
        return patientRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No patient profile found for current user"));
    }

    public Long getCurrentPatientId() {
        return getCurrentPatient().getId();
    }

    public Doctor getCurrentDoctor() {
        Long userId = getCurrentUserId();
        return doctorRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No doctor profile found for current user"));
    }

    public Long getCurrentDoctorId() {
        return getCurrentDoctor().getId();
    }

    /**
     * Enforces that if the current user is a patient, they can only access resources belonging to themselves.
     * Throws ForbiddenException if a patient tries to access another patient's data.
     */
    public void validatePatientAccess(Long targetPatientId) {
        if (isPatient()) {
            Long myPatientId = getCurrentPatientId();
            if (targetPatientId == null || !myPatientId.equals(targetPatientId)) {
                throw new ForbiddenException("Access denied: You do not have permission to access another patient's data");
            }
        }
    }
}
