package com.medicore.hms.service;
import com.medicore.hms.entity.Department;
import com.medicore.hms.exception.ConflictException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.DepartmentRepository;
import com.medicore.hms.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;

    public List<Department> getAllDepartments() { return departmentRepository.findAll(); }
    public Department getDepartmentById(Long id) { return departmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Department not found")); }
    public Department createDepartment(Department d) { return departmentRepository.save(d); }
    public Department updateDepartment(Long id, Department d) {
        Department existing = getDepartmentById(id);
        existing.setName(d.getName());
        return departmentRepository.save(existing);
    }
    public void deleteDepartment(Long id) {
        if (!doctorRepository.findByDepartmentId(id).isEmpty()) {
            throw new ConflictException("Cannot delete department with active doctors");
        }
        departmentRepository.deleteById(id);
    }
}
