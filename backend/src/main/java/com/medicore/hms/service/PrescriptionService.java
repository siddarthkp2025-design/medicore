package com.medicore.hms.service;

import com.medicore.hms.entity.Prescription;
import com.medicore.hms.entity.PrescriptionItem;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.DoctorRepository;
import com.medicore.hms.repository.MedicalRecordRepository;
import com.medicore.hms.repository.MedicineRepository;
import com.medicore.hms.repository.PatientRepository;
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
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;
    private final MedicalRecordRepository medicalRecordRepository;
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
        if (securityUtils.isDoctor()) {
            p.setDoctor(securityUtils.getCurrentDoctor());
        } else if (p.getDoctor() != null && p.getDoctor().getId() != null) {
            p.setDoctor(doctorRepository.findById(p.getDoctor().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + p.getDoctor().getId())));
        }

        if (p.getPatient() != null && p.getPatient().getId() != null) {
            p.setPatient(patientRepository.findById(p.getPatient().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + p.getPatient().getId())));
        } else {
            throw new ResourceNotFoundException("Patient ID is required for issuing prescriptions");
        }

        if (p.getMedicalRecord() != null && p.getMedicalRecord().getId() != null) {
            medicalRecordRepository.findById(p.getMedicalRecord().getId()).ifPresent(p::setMedicalRecord);
        }

        if (p.getPrescriptionDate() == null) {
            p.setPrescriptionDate(LocalDate.now());
        }
        if (p.getItems() != null) {
            for (PrescriptionItem item : p.getItems()) {
                item.setPrescription(p);
                if (item.getMedicine() != null && item.getMedicine().getId() != null) {
                    item.setMedicine(medicineRepository.findById(item.getMedicine().getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + item.getMedicine().getId())));
                } else {
                    throw new ResourceNotFoundException("Valid Medicine ID is required for each prescription item");
                }
            }
        }
        return prescriptionRepository.save(p);
    }
}
