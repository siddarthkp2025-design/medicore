package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;

@Entity
@Table(name = "BILL_ITEMS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BillItem {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bill_item_seq")
    @SequenceGenerator(name = "bill_item_seq", sequenceName = "bill_item_seq", allocationSize = 1)
    @Column(name = "bill_item_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "bill_id")
    @JsonIgnore
    private Bill bill;
    
    @Column(length = 200) private String description;
    @Column(length = 50) private String category;
    private BigDecimal amount;
    private Integer quantity;
}
