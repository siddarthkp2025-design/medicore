package com.medicore.hms.controller;
import com.medicore.hms.entity.MedicalRecord;
import com.medicore.hms.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {
    private final MedicalRecordService recordService;
    @GetMapping public ResponseEntity<List<MedicalRecord>> getAll() { return ResponseEntity.ok(recordService.getAllRecords()); }
    @GetMapping("/{id}") public ResponseEntity<MedicalRecord> getById(@PathVariable Long id) { return ResponseEntity.ok(recordService.getRecordById(id)); }
    @PostMapping public ResponseEntity<MedicalRecord> create(@RequestBody MedicalRecord record) { return new ResponseEntity<>(recordService.createRecord(record), HttpStatus.CREATED); }
    @PutMapping("/{id}") public ResponseEntity<MedicalRecord> update(@PathVariable Long id, @RequestBody MedicalRecord record) { return ResponseEntity.ok(recordService.updateRecord(id, record)); }
}
