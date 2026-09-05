package com.medicore.hms.repository;

import com.medicore.hms.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByDoctorId(@Param("doctorId") Long doctorId);

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByStatus(String status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.appointmentTime = :time")
    Optional<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(@Param("doctorId") Long doctorId, @Param("date") LocalDate date, @Param("time") String time);

    long countByStatus(String status);

    List<Appointment> findByAppointmentDateBetween(LocalDate start, LocalDate end);
}
