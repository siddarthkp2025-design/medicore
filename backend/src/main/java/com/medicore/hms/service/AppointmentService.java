package com.medicore.hms.service;

import com.medicore.hms.dto.AppointmentRequest;
import com.medicore.hms.entity.Appointment;
import com.medicore.hms.entity.Department;
import com.medicore.hms.entity.Doctor;
import com.medicore.hms.entity.Patient;
import com.medicore.hms.exception.ConflictException;
import com.medicore.hms.exception.ForbiddenException;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.AppointmentRepository;
import com.medicore.hms.repository.DepartmentRepository;
import com.medicore.hms.repository.DoctorRepository;
import com.medicore.hms.repository.PatientRepository;
import com.medicore.hms.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final SecurityUtils securityUtils;

    public List<Appointment> getAllAppointments() {
        if (securityUtils.isPatient()) {
            return appointmentRepository.findByPatientId(securityUtils.getCurrentPatientId());
        }
        if (securityUtils.isDoctor()) {
            return appointmentRepository.findByDoctorId(securityUtils.getCurrentDoctorId());
        }
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        if (securityUtils.isPatient()) {
            securityUtils.validatePatientAccess(apt.getPatient().getId());
        }
        return apt;
    }

    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        Patient patient;
        if (securityUtils.isPatient()) {
            patient = securityUtils.getCurrentPatient();
        } else {
            if (request.getPatientId() == null) {
                throw new ResourceNotFoundException("Patient ID is required for administrative appointment booking");
            }
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(doctor.getDepartment());
        } else {
            department = doctor.getDepartment();
        }

        Optional<Appointment> conflict = appointmentRepository.findByDoctorIdAndAppointmentDateAndAppointmentTime(
                doctor.getId(), request.getAppointmentDate(), request.getAppointmentTime());
        if (conflict.isPresent() && !"Cancelled".equalsIgnoreCase(conflict.get().getStatus())) {
            throw new ConflictException("Doctor already has an appointment scheduled at this date and time");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status("Scheduled")
                .build();

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateStatus(Long id, String status) {
        Appointment apt = getAppointmentById(id); // automatically checks patient access
        if (securityUtils.isPatient()) {
            // Patient can only cancel their own appointment
            if (!"Cancelled".equalsIgnoreCase(status)) {
                throw new ForbiddenException("Patients can only cancel their appointments");
            }
        }
        apt.setStatus(status);
        return appointmentRepository.save(apt);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        Appointment apt = getAppointmentById(id); // checks patient access
        appointmentRepository.delete(apt);
    }
}
