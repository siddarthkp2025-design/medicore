package com.medicore.hms.repository;
import com.medicore.hms.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByCategory(String category);
    List<Medicine> findByStockQuantityLessThanEqual(Integer quantity);
    List<Medicine> findByExpiryDateBefore(LocalDate date);
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Medicine> searchByName(@Param("name") String name);
}
