package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MEDICAL_RECORDS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalRecord {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "mr_seq")
    @SequenceGenerator(name = "mr_seq", sequenceName = "medical_record_seq", allocationSize = 1, initialValue = 5001)
    @Column(name = "record_id")
    private Long id;
    
    @ManyToOne @JoinColumn(name = "patient_id") private Patient patient;
    @ManyToOne @JoinColumn(name = "doctor_id") private Doctor doctor;
    
    @Column(name = "visit_date") private LocalDate visitDate;
    @Column(length = 1000) private String symptoms;
    @Column(length = 1000) private String diagnosis;
    @Column(length = 1000) private String treatment;
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
