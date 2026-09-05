package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ADMISSIONS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Admission {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "adm_seq")
    @SequenceGenerator(name = "adm_seq", sequenceName = "admission_seq", allocationSize = 1, initialValue = 4001)
    @Column(name = "admission_id")
    private Long id;
    
    @ManyToOne @JoinColumn(name = "patient_id") private Patient patient;
    @ManyToOne @JoinColumn(name = "room_id") private Room room;
    @ManyToOne @JoinColumn(name = "doctor_id") private Doctor doctor;
    
    @Column(name = "admission_date") private LocalDate admissionDate;
    @Column(name = "expected_discharge_date") private LocalDate expectedDischargeDate;
    @Column(name = "actual_discharge_date") private LocalDate actualDischargeDate;
    @Column(length = 500) private String diagnosis;
    @Column(length = 20) private String status;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
