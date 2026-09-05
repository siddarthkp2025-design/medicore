package com.medicore.hms.controller;

import com.medicore.hms.entity.Doctor;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.security.SecurityUtils;
import com.medicore.hms.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @PostMapping
    public ResponseEntity<Doctor> create(@RequestBody Doctor doc) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Only administrators can register new doctors");
        }
        return new ResponseEntity<>(doctorService.createDoctor(doc), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Doctor doc) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Only administrators can update doctor profiles");
        }
        return ResponseEntity.ok(doctorService.updateDoctor(id, doc));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Only administrators can remove doctors");
        }
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
