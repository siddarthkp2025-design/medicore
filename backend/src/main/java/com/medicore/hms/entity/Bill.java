package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "BILLS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bill_seq")
    @SequenceGenerator(name = "bill_seq", sequenceName = "bill_seq", allocationSize = 1, initialValue = 7001)
    @Column(name = "bill_id")
    private Long id;
    
    @ManyToOne @JoinColumn(name = "patient_id") private Patient patient;
    @ManyToOne @JoinColumn(name = "appointment_id") private Appointment appointment;
    @ManyToOne @JoinColumn(name = "admission_id") private Admission admission;
    
    @Column(name = "consultation_charge") private BigDecimal consultationCharge;
    @Column(name = "room_charge") private BigDecimal roomCharge;
    @Column(name = "medicine_charge") private BigDecimal medicineCharge;
    @Column(name = "other_charges") private BigDecimal otherCharges;
    private BigDecimal discount;
    private BigDecimal tax;
    @Column(name = "total_amount") private BigDecimal totalAmount;
    
    @Column(name = "payment_status", length = 20) private String paymentStatus;
    @Column(name = "payment_method", length = 20) private String paymentMethod;
    @Column(name = "billing_date") private LocalDate billingDate;
    @Column(name = "payment_date") private LocalDate paymentDate;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<BillItem> items;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
