package com.medicore.hms.controller;
import com.medicore.hms.entity.Admission;
import com.medicore.hms.service.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
public class AdmissionController {
    private final AdmissionService admissionService;
    @GetMapping public ResponseEntity<List<Admission>> getAll() { return ResponseEntity.ok(admissionService.getAllAdmissions()); }
    @GetMapping("/{id}") public ResponseEntity<Admission> getById(@PathVariable Long id) { return ResponseEntity.ok(admissionService.getAdmissionById(id)); }
    @PostMapping public ResponseEntity<Admission> create(@RequestBody Admission admission) { return new ResponseEntity<>(admissionService.admitPatient(admission), HttpStatus.CREATED); }
    @PutMapping("/{id}/discharge") public ResponseEntity<Admission> discharge(@PathVariable Long id) { return ResponseEntity.ok(admissionService.dischargePatient(id)); }
}
