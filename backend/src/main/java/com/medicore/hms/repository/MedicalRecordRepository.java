package com.medicore.hms.repository;

import com.medicore.hms.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.id = :patientId ORDER BY m.visitDate DESC")
    List<MedicalRecord> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.doctor.id = :doctorId ORDER BY m.visitDate DESC")
    List<MedicalRecord> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.id = :patientId ORDER BY m.visitDate DESC")
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(@Param("patientId") Long patientId);
}
