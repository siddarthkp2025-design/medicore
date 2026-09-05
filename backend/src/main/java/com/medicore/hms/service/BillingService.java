package com.medicore.hms.service;

import com.medicore.hms.entity.Bill;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.BillRepository;
import com.medicore.hms.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {
    private final BillRepository billRepository;
    private final SecurityUtils securityUtils;

    public List<Bill> getAllBills() {
        if (securityUtils.isPatient()) {
            Long patientId = securityUtils.getCurrentPatientId();
            return billRepository.findByPatientId(patientId);
        }
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(bill.getPatient().getId());
        }
        return bill;
    }

    @Transactional
    public Bill generateBill(Bill bill) {
        if (securityUtils.isPatient()) {
            throw new ForbiddenException("Access denied: Patients cannot generate hospital bills");
        }
        if (bill.getItems() != null) {
            bill.getItems().forEach(item -> item.setBill(bill));
        }
        BigDecimal consultation = bill.getConsultationCharge() != null ? bill.getConsultationCharge() : BigDecimal.ZERO;
        BigDecimal room = bill.getRoomCharge() != null ? bill.getRoomCharge() : BigDecimal.ZERO;
        BigDecimal med = bill.getMedicineCharge() != null ? bill.getMedicineCharge() : BigDecimal.ZERO;
        BigDecimal other = bill.getOtherCharges() != null ? bill.getOtherCharges() : BigDecimal.ZERO;
        BigDecimal discount = bill.getDiscount() != null ? bill.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax = bill.getTax() != null ? bill.getTax() : BigDecimal.ZERO;

        bill.setTotalAmount(consultation.add(room).add(med).add(other).subtract(discount).add(tax));
        if (bill.getPaymentStatus() == null) {
            bill.setPaymentStatus("Pending");
        }
        if (bill.getBillingDate() == null) {
            bill.setBillingDate(LocalDate.now());
        }
        return billRepository.save(bill);
    }

    @Transactional
    public Bill processPayment(Long id, String method) {
        Bill bill = getBillById(id);
        // Both patient paying own bill, or admin recording payment
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(bill.getPatient().getId());
        }
        bill.setPaymentStatus("Paid");
        bill.setPaymentMethod(method);
        bill.setPaymentDate(LocalDate.now());
        return billRepository.save(bill);
    }
}
