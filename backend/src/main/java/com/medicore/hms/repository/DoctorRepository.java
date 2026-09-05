package com.medicore.hms.repository;

import com.medicore.hms.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT d FROM Doctor d WHERE d.user.id = :userId")
    Optional<Doctor> findByUserUserId(@Param("userId") Long userId);

    @Query("SELECT d FROM Doctor d WHERE d.user.id = :userId")
    Optional<Doctor> findByUserId(@Param("userId") Long userId);

    List<Doctor> findByDepartmentId(Long departmentId);

    List<Doctor> findBySpecialization(String specialization);

    List<Doctor> findByStatus(String status);

    @Query("SELECT d FROM Doctor d WHERE LOWER(d.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Doctor> searchByName(@Param("name") String name);
}
