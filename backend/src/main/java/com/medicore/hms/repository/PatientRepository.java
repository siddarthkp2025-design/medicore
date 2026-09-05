package com.medicore.hms.repository;

import com.medicore.hms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("SELECT p FROM Patient p WHERE p.user.id = :userId")
    Optional<Patient> findByUserUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Patient> searchByName(@Param("name") String name);

    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPhoneContaining(
            String firstName, String lastName, String phone);

    Optional<Patient> findByPhone(String phone);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Patient p WHERE LOWER(p.email) = LOWER(:email)")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Patient p WHERE p.phone = :phone")
    boolean existsByPhone(@Param("phone") String phone);

    List<Patient> findByBloodGroup(String bloodGroup);

    List<Patient> findByGender(String gender);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.registrationDate >= :startDate")
    long countRegisteredSince(@Param("startDate") java.time.LocalDate startDate);
}
