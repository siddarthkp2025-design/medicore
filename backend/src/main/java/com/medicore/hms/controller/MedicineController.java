package com.medicore.hms.controller;
import com.medicore.hms.entity.Medicine;
import com.medicore.hms.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService medicineService;
    @GetMapping public ResponseEntity<List<Medicine>> getAll() { return ResponseEntity.ok(medicineService.getAllMedicines()); }
    @GetMapping("/{id}") public ResponseEntity<Medicine> getById(@PathVariable Long id) { return ResponseEntity.ok(medicineService.getMedicineById(id)); }
    @PostMapping public ResponseEntity<Medicine> create(@RequestBody Medicine m) { return new ResponseEntity<>(medicineService.createMedicine(m), HttpStatus.CREATED); }
    @PutMapping("/{id}") public ResponseEntity<Medicine> update(@PathVariable Long id, @RequestBody Medicine m) { return ResponseEntity.ok(medicineService.updateMedicine(id, m)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { medicineService.deleteMedicine(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/low-stock") public ResponseEntity<List<Medicine>> getLowStock() { return ResponseEntity.ok(medicineService.getLowStock()); }
    @GetMapping("/expiring") public ResponseEntity<List<Medicine>> getExpiring() { return ResponseEntity.ok(medicineService.getExpiring()); }
}
