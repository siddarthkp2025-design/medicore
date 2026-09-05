package com.medicore.hms.controller;

import com.medicore.hms.dto.LoginRequest;
import com.medicore.hms.dto.LoginResponse;
import com.medicore.hms.dto.RegisterRequest;
import com.medicore.hms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.registerPatient(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Patient account registered successfully. You can now log in.",
                "username", registerRequest.getUsername()
        ));
    }
}
