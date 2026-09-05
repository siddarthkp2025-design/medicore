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
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        return doctorRepository.save(existing);
    }
    public void deleteDoctor(Long id) { doctorRepository.deleteById(id); }
}
