package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "PRESCRIPTIONS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Prescription {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "presc_seq")
    @SequenceGenerator(name = "presc_seq", sequenceName = "prescription_seq", allocationSize = 1, initialValue = 6001)
    @Column(name = "prescription_id")
    private Long id;
    
    @ManyToOne @JoinColumn(name = "patient_id") private Patient patient;
    @ManyToOne @JoinColumn(name = "doctor_id") private Doctor doctor;
    @ManyToOne @JoinColumn(name = "record_id") private MedicalRecord medicalRecord;
    
    @Column(name = "prescription_date") private LocalDate prescriptionDate;
    @Column(length = 500) private String notes;
    
    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL)
    private List<PrescriptionItem> items;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
