package com.medicore.hms.service;
import com.medicore.hms.entity.Doctor;
import com.medicore.hms.entity.User;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.DoctorRepository;
import com.medicore.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public List<Doctor> getAllDoctors() { return doctorRepository.findAll(); }
    public Doctor getDoctorById(Long id) { return doctorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found")); }
    
    @Transactional
    public Doctor createDoctor(Doctor doctor) {
        if(doctor.getUser() != null) {
            User user = doctor.getUser();
            user.setRole("DOCTOR");
            userRepository.save(user);
        }
        return doctorRepository.save(doctor);
    }
    public Doctor updateDoctor(Long id, Doctor updated) {
        Doctor existing = getDoctorById(id);
        if (updated.getFirstName() != null) existing.setFirstName(updated.getFirstName());
        if (updated.getLastName() != null) existing.setLastName(updated.getLastName());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getSpecialization() != null) existing.setSpecialization(updated.getSpecialization());
        if (updated.getQualification() != null) existing.setQualification(updated.getQualification());
        if (updated.getExperienceYears() != null) existing.setExperienceYears(updated.getExperienceYears());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getDepartment() != null) existing.setDepartment(updated.getDepartment());
        return doctorRepository.save(existing);
    }
    public void deleteDoctor(Long id) { doctorRepository.deleteById(id); }
}
