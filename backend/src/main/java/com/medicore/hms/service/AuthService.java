package com.medicore.hms.service;

import com.medicore.hms.dto.LoginRequest;
import com.medicore.hms.dto.LoginResponse;
import com.medicore.hms.dto.RegisterRequest;
import com.medicore.hms.entity.Patient;
import com.medicore.hms.entity.User;
import com.medicore.hms.exception.BadRequestException;
import com.medicore.hms.repository.DoctorRepository;
import com.medicore.hms.repository.PatientRepository;
import com.medicore.hms.repository.UserRepository;
import com.medicore.hms.security.CustomUserDetails;
import com.medicore.hms.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String fullName = userDetails.getUsername();
        if ("PATIENT".equalsIgnoreCase(userDetails.getRole())) {
            var pat = patientRepository.findByUserUserId(userDetails.getId());
            if (pat.isPresent()) {
                fullName = pat.get().getFirstName() + " " + pat.get().getLastName();
            }
        } else if ("DOCTOR".equalsIgnoreCase(userDetails.getRole())) {
            var doc = doctorRepository.findByUserUserId(userDetails.getId());
            if (doc.isPresent()) {
                fullName = "Dr. " + doc.get().getFirstName() + " " + doc.get().getLastName();
            }
        } else if ("ADMIN".equalsIgnoreCase(userDetails.getRole())) {
            fullName = "System Administrator";
        }

        return LoginResponse.builder()
                .token(jwt)
                .role(userDetails.getRole())
                .userId(userDetails.getId())
                .username(userDetails.getUsername())
                .fullName(fullName)
                .build();
    }

    @Transactional
    public void registerPatient(RegisterRequest request) {
        log.info("Attempting public patient registration for username: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken. Please choose another.");
        }

        if (userRepository.existsByEmail(request.getEmail()) || patientRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered. Please use another email.");
        }

        if (request.getPhone() != null && patientRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number '" + request.getPhone() + "' is already registered.");
        }

        // 1. Create USERS record with role strictly enforced as PATIENT
        User user = User.builder()
                .username(request.getUsername().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail().trim().toLowerCase())
                .role("PATIENT")
                .isActive(1)
                .build();

        User savedUser = userRepository.save(user);

        // 2. Create PATIENTS record linked to the saved user
        Patient patient = Patient.builder()
                .user(savedUser)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone().trim())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .address(request.getAddress())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .registrationDate(LocalDate.now())
                .build();

        patientRepository.save(patient);

        log.info("Successfully registered new patient {} {} with User ID: {} and Patient ID: {}",
                patient.getFirstName(), patient.getLastName(), savedUser.getId(), patient.getId());
    }
}
