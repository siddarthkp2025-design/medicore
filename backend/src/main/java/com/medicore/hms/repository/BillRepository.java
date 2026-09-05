package com.medicore.hms.repository;

import com.medicore.hms.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    @Query("SELECT b FROM Bill b WHERE b.patient.id = :patientId ORDER BY b.billingDate DESC")
    List<Bill> findByPatientId(@Param("patientId") Long patientId);

    List<Bill> findByPaymentStatus(String status);

    @Query("SELECT SUM(b.totalAmount) FROM Bill b WHERE b.paymentStatus = :status")
    BigDecimal sumTotalByPaymentStatus(@Param("status") String status);

    List<Bill> findByBillingDateBetween(LocalDate start, LocalDate end);
}
