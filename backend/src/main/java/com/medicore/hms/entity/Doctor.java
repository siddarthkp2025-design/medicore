package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "DOCTORS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Doctor {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "doc_seq")
    @SequenceGenerator(name = "doc_seq", sequenceName = "doctor_seq", allocationSize = 1, initialValue = 2001)
    @Column(name = "doctor_id")
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;
    
    @Column(name = "first_name", length = 50) private String firstName;
    @Column(name = "last_name", length = 50) private String lastName;
    @Column(length = 100) private String email;
    @Column(length = 20) private String phone;
    @Column(length = 100) private String specialization;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Column(length = 200) private String qualification;
    @Column(name = "experience_years") private Integer experienceYears;
    @Column(name = "joining_date") private LocalDate joiningDate;
    @Column(length = 20) private String status;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
