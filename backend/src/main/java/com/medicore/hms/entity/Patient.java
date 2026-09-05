package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "PATIENTS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pat_seq")
    @SequenceGenerator(name = "pat_seq", sequenceName = "patient_seq", allocationSize = 1, initialValue = 1001)
    @Column(name = "patient_id")
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;
    
    @Column(name = "first_name", length = 50) private String firstName;
    @Column(name = "last_name", length = 50) private String lastName;
    @Column(name = "date_of_birth") private LocalDate dateOfBirth;
    @Column(length = 10) private String gender;
    @Column(name = "blood_group", length = 5) private String bloodGroup;
    @Column(length = 20) private String phone;
    @Column(length = 100) private String email;
    @Column(length = 500) private String address;
    @Column(name = "emergency_contact_name", length = 100) private String emergencyContactName;
    @Column(name = "emergency_contact_phone", length = 20) private String emergencyContactPhone;
    @Column(name = "registration_date") private LocalDate registrationDate;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
