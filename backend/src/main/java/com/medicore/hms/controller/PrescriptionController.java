package com.medicore.hms.controller;
import com.medicore.hms.entity.Prescription;
import com.medicore.hms.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;
    @GetMapping public ResponseEntity<List<Prescription>> getAll() { return ResponseEntity.ok(prescriptionService.getAllPrescriptions()); }
    @GetMapping("/{id}") public ResponseEntity<Prescription> getById(@PathVariable Long id) { return ResponseEntity.ok(prescriptionService.getPrescriptionById(id)); }
    @PostMapping public ResponseEntity<Prescription> create(@RequestBody Prescription p) { return new ResponseEntity<>(prescriptionService.createPrescription(p), HttpStatus.CREATED); }
}
