package com.medicore.hms.controller;

import com.medicore.hms.entity.Patient;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.security.SecurityUtils;
import com.medicore.hms.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<Patient>> getAll(@RequestParam(required = false) String search,
                                                @RequestParam(required = false) String bloodGroup) {
        if (securityUtils.isPatient()) {
            // A patient may only see their own profile
            return ResponseEntity.ok(Collections.singletonList(securityUtils.getCurrentPatient()));
        }
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(patientService.searchPatients(search));
        }
        if (bloodGroup != null && !bloodGroup.isEmpty()) {
            return ResponseEntity.ok(patientService.getPatientsByBloodGroup(bloodGroup));
        }
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/me")
    public ResponseEntity<Patient> getCurrentPatientProfile() {
        return ResponseEntity.ok(securityUtils.getCurrentPatient());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getById(@PathVariable Long id) {
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(id);
        }
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot register other patient accounts");
        }
        return new ResponseEntity<>(patientService.createPatient(patient), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient patient) {
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(id);
        }
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Access denied: Only administrators can delete patient records");
        }
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
