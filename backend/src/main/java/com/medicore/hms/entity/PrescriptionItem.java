package com.medicore.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "PRESCRIPTION_ITEMS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PrescriptionItem {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "presc_item_seq")
    @SequenceGenerator(name = "presc_item_seq", sequenceName = "prescription_item_seq", allocationSize = 1)
    @Column(name = "item_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "prescription_id")
    @JsonIgnore
    private Prescription prescription;
    
    @ManyToOne @JoinColumn(name = "medicine_id") private Medicine medicine;
    
    @Column(length = 100) private String dosage;
    @Column(length = 100) private String frequency;
    @Column(length = 100) private String duration;
    @Column(length = 500) private String instructions;
}
