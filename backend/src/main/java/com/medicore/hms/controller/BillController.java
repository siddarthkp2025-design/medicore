package com.medicore.hms.controller;
import com.medicore.hms.entity.Bill;
import com.medicore.hms.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {
    private final BillingService billingService;
    @GetMapping public ResponseEntity<List<Bill>> getAll() { return ResponseEntity.ok(billingService.getAllBills()); }
    @GetMapping("/{id}") public ResponseEntity<Bill> getById(@PathVariable Long id) { return ResponseEntity.ok(billingService.getBillById(id)); }
    @PostMapping public ResponseEntity<Bill> create(@RequestBody Bill bill) { return new ResponseEntity<>(billingService.generateBill(bill), HttpStatus.CREATED); }
    @PutMapping("/{id}/payment") public ResponseEntity<Bill> processPayment(@PathVariable Long id, @RequestParam String method) { return ResponseEntity.ok(billingService.processPayment(id, method)); }
}
