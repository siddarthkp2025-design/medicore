package com.medicore.hms.service;

import com.medicore.hms.entity.Admission;
import com.medicore.hms.entity.Room;
import com.medicore.hms.exception.ConflictException;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.AdmissionRepository;
import com.medicore.hms.repository.DoctorRepository;
import com.medicore.hms.repository.PatientRepository;
import com.medicore.hms.repository.RoomRepository;
import com.medicore.hms.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdmissionService {
    private final AdmissionRepository admissionRepository;
    private final RoomRepository roomRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final SecurityUtils securityUtils;

    public List<Admission> getAllAdmissions() {
        if (securityUtils.isPatient()) {
            return admissionRepository.findByPatientId(securityUtils.getCurrentPatientId());
        }
        if (securityUtils.isDoctor()) {
            return admissionRepository.findByDoctorId(securityUtils.getCurrentDoctorId());
        }
        return admissionRepository.findAll();
    }

    public Admission getAdmissionById(Long id) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission not found with id: " + id));
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(admission.getPatient().getId());
        }
        return admission;
    }

    @Transactional
    public Admission admitPatient(Admission admission) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot process inpatient admissions");
        }

        if (admission.getRoom() == null || admission.getRoom().getId() == null) {
            throw new ResourceNotFoundException("Room ID is required for admission");
        }
        Room room = roomRepository.findById(admission.getRoom().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + admission.getRoom().getId()));
        if (!"Available".equalsIgnoreCase(room.getStatus())) {
            throw new ConflictException("Room is not available (Current status: " + room.getStatus() + ")");
        }

        if (admission.getPatient() != null && admission.getPatient().getId() != null) {
            admission.setPatient(patientRepository.findById(admission.getPatient().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + admission.getPatient().getId())));
        } else {
            throw new ResourceNotFoundException("Patient ID is required for admission");
        }

        if (securityUtils.isDoctor()) {
            admission.setDoctor(securityUtils.getCurrentDoctor());
        } else if (admission.getDoctor() != null && admission.getDoctor().getId() != null) {
            admission.setDoctor(doctorRepository.findById(admission.getDoctor().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + admission.getDoctor().getId())));
        }

        room.setStatus("Occupied");
        roomRepository.save(room);
        admission.setRoom(room);
        admission.setStatus("Admitted");
        if (admission.getAdmissionDate() == null) {
            admission.setAdmissionDate(LocalDate.now());
        }
        return admissionRepository.save(admission);
    }

    @Transactional
    public Admission dischargePatient(Long id) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot authorize discharges");
        }
        Admission admission = getAdmissionById(id);
        admission.setActualDischargeDate(LocalDate.now());
        admission.setStatus("Discharged");
        Room room = admission.getRoom();
        if (room != null) {
            room.setStatus("Available");
            roomRepository.save(room);
        }
        return admissionRepository.save(admission);
    }
}
