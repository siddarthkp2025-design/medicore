package com.medicore.hms.repository;
import com.medicore.hms.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
    List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);
}
