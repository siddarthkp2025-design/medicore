package com.medicore.hms.service;

import com.medicore.hms.entity.Patient;
import com.medicore.hms.entity.User;
import com.medicore.hms.exception.BadRequestException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.PatientRepository;
import com.medicore.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for user id: " + userId));
    }

    public List<Patient> searchPatients(String query) {
        return patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPhoneContaining(
                query, query, query);
    }

    @Transactional
    public Patient createPatient(Patient patient) {
        // Create a user account for the patient
        String username = "p." + patient.getFirstName().toLowerCase() + "." + patient.getLastName().toLowerCase();

        // Check if username already exists and make unique
        String baseUsername = username;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setEmail(patient.getEmail() != null ? patient.getEmail() : username + "@medicore.com");
        user.setRole("PATIENT");
        user.setIsActive(1);
        user = userRepository.save(user);

        patient.setUser(user);
        if (patient.getRegistrationDate() == null) {
            patient.setRegistrationDate(LocalDate.now());
        }
        return patientRepository.save(patient);
    }

    @Transactional
    public Patient updatePatient(Long id, Patient updated) {
        Patient existing = getPatientById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setGender(updated.getGender());
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());
        existing.setEmergencyContactName(updated.getEmergencyContactName());
        existing.setEmergencyContactPhone(updated.getEmergencyContactPhone());
        return patientRepository.save(existing);
    }

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }

    public long count() {
        return patientRepository.count();
    }

    public List<Patient> getPatientsByBloodGroup(String bloodGroup) {
        return patientRepository.findByBloodGroup(bloodGroup);
    }
}
