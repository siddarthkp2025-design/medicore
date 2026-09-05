package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ROOMS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_seq")
    @SequenceGenerator(name = "room_seq", sequenceName = "room_seq", allocationSize = 1)
    @Column(name = "room_id")
    private Long id;
    
    @Column(name = "room_number", length = 20, unique = true) private String roomNumber;
    @Column(name = "room_type", length = 30) private String roomType;
    @Column(name = "floor_number") private Integer floorNumber;
    @Column(name = "daily_charge") private BigDecimal dailyCharge;
    @Column(length = 20) private String status;
    
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
