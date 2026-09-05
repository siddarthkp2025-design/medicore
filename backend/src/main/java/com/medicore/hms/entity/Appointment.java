package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "APPOINTMENTS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apt_seq")
    @SequenceGenerator(name = "apt_seq", sequenceName = "appointment_seq", allocationSize = 1, initialValue = 3001)
    @Column(name = "appointment_id")
    private Long id;
    
    @ManyToOne @JoinColumn(name = "patient_id") private Patient patient;
    @ManyToOne @JoinColumn(name = "doctor_id") private Doctor doctor;
    @ManyToOne @JoinColumn(name = "department_id") private Department department;
    
    @Column(name = "appointment_date") private LocalDate appointmentDate;
    @Column(name = "appointment_time", length = 10) private String appointmentTime;
    @Column(length = 500) private String reason;
    @Column(length = 20) private String status;
    @Column(length = 1000) private String notes;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
