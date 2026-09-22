package com.medicore.hms.controller;

import com.medicore.hms.dto.LoginRequest;
import com.medicore.hms.dto.LoginResponse;
import com.medicore.hms.dto.RegisterRequest;
import com.medicore.hms.entity.UserSession;
import com.medicore.hms.repository.UserSessionRepository;
import com.medicore.hms.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserSessionRepository userSessionRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                               HttpServletRequest request) {
        String ip = getClientIp(request);
        String ua = request.getHeader("User-Agent");
        return ResponseEntity.ok(authService.authenticateUser(loginRequest, ip, ua));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.registerPatient(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Patient account registered successfully. You can now log in.",
                "username", registerRequest.getUsername()
        ));
    }

    /** Admin-only: view last 50 login events across all users */
    @GetMapping("/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserSession>> getLoginSessions() {
        return ResponseEntity.ok(userSessionRepository.findTop50ByOrderByLoginAtDesc());
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
