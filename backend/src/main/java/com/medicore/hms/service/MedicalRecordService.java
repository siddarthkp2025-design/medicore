package com.medicore.hms.service;

import com.medicore.hms.entity.MedicalRecord;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.MedicalRecordRepository;
import com.medicore.hms.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository recordRepository;
    private final SecurityUtils securityUtils;

    public List<MedicalRecord> getAllRecords() {
        if (securityUtils.isPatient()) {
            return recordRepository.findByPatientId(securityUtils.getCurrentPatientId());
        }
        if (securityUtils.isDoctor()) {
            return recordRepository.findByDoctorId(securityUtils.getCurrentDoctorId());
        }
        return recordRepository.findAll();
    }

    public MedicalRecord getRecordById(Long id) {
        MedicalRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(record.getPatient().getId());
        }
        return record;
    }

    @Transactional
    public MedicalRecord createRecord(MedicalRecord record) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot author clinical medical records");
        }
        if (securityUtils.isDoctor() && (record.getDoctor() == null || record.getDoctor().getId() == null)) {
            record.setDoctor(securityUtils.getCurrentDoctor());
        }
        if (record.getVisitDate() == null) {
            record.setVisitDate(LocalDate.now());
        }
        return recordRepository.save(record);
    }

    @Transactional
    public MedicalRecord updateRecord(Long id, MedicalRecord record) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot modify clinical medical records");
        }
        MedicalRecord existing = getRecordById(id);
        existing.setDiagnosis(record.getDiagnosis());
        existing.setSymptoms(record.getSymptoms());
        existing.setTreatment(record.getTreatment());
        existing.setNotes(record.getNotes());
        return recordRepository.save(existing);
    }
}
