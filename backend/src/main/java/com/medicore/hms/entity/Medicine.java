package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MEDICINES")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Medicine {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "med_seq")
    @SequenceGenerator(name = "med_seq", sequenceName = "medicine_seq", allocationSize = 1)
    @Column(name = "medicine_id")
    private Long id;
    
    @Column(length = 200) private String name;
    @Column(length = 100) private String category;
    @Column(length = 200) private String manufacturer;
    @Column(name = "unit_price") private BigDecimal unitPrice;
    @Column(name = "stock_quantity") private Integer stockQuantity;
    @Column(name = "expiry_date") private LocalDate expiryDate;
    @Column(name = "reorder_level") private Integer reorderLevel;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
