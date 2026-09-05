package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "DEPARTMENTS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dept_seq")
    @SequenceGenerator(name = "dept_seq", sequenceName = "department_seq", allocationSize = 1)
    @Column(name = "department_id")
    private Long id;
    
    @Column(length = 100) private String name;
    @Column(length = 500) private String description;
    @Column(length = 200) private String location;
    @Column(length = 20) private String phone;
    @Column(name = "is_active") private Integer isActive;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
