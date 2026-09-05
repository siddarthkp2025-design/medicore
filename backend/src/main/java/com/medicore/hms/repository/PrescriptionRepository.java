package com.medicore.hms.repository;

import com.medicore.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT p FROM Prescription p WHERE p.doctor.id = :doctorId ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByDoctorId(@Param("doctorId") Long doctorId);
}
