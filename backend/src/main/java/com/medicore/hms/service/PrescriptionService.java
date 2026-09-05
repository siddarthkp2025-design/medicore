package com.medicore.hms.service;

import com.medicore.hms.entity.Prescription;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.PrescriptionRepository;
import com.medicore.hms.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final SecurityUtils securityUtils;

    public List<Prescription> getAllPrescriptions() {
        if (securityUtils.isPatient()) {
            return prescriptionRepository.findByPatientId(securityUtils.getCurrentPatientId());
        }
        if (securityUtils.isDoctor()) {
            return prescriptionRepository.findByDoctorId(securityUtils.getCurrentDoctorId());
        }
        return prescriptionRepository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(p.getPatient().getId());
        }
        return p;
    }

    @Transactional
    public Prescription createPrescription(Prescription p) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot issue medical prescriptions");
        }
        if (securityUtils.isDoctor() && (p.getDoctor() == null || p.getDoctor().getId() == null)) {
            p.setDoctor(securityUtils.getCurrentDoctor());
        }
        if (p.getPrescriptionDate() == null) {
            p.setPrescriptionDate(LocalDate.now());
        }
        if (p.getItems() != null) {
            p.getItems().forEach(item -> item.setPrescription(p));
        }
        return prescriptionRepository.save(p);
    }
}
