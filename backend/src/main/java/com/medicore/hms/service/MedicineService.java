package com.medicore.hms.service;
import com.medicore.hms.entity.Medicine;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private final MedicineRepository medicineRepository;
    public List<Medicine> getAllMedicines() { return medicineRepository.findAll(); }
    public Medicine getMedicineById(Long id) { return medicineRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Medicine not found")); }
    public Medicine createMedicine(Medicine m) { return medicineRepository.save(m); }
    public Medicine updateMedicine(Long id, Medicine m) {
        Medicine existing = getMedicineById(id);
        existing.setName(m.getName());
        existing.setStockQuantity(m.getStockQuantity());
        return medicineRepository.save(existing);
    }
    public void deleteMedicine(Long id) { medicineRepository.deleteById(id); }
    public List<Medicine> getLowStock() {
        return medicineRepository.findByStockQuantityLessThanEqual(10); // Simplified
    }
    public List<Medicine> getExpiring() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now().plusDays(90));
    }
}
