package com.medicore.hms.repository;

import com.medicore.hms.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    @Query("SELECT a FROM Admission a WHERE a.patient.id = :patientId ORDER BY a.admissionDate DESC")
    List<Admission> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Admission a WHERE a.doctor.id = :doctorId ORDER BY a.admissionDate DESC")
    List<Admission> findByDoctorId(@Param("doctorId") Long doctorId);

    List<Admission> findByStatus(String status);

    @Query("SELECT a FROM Admission a WHERE a.room.id = :roomId")
    List<Admission> findByRoomId(@Param("roomId") Long roomId);
}
