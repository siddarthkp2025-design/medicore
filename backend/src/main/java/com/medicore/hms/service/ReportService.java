package com.medicore.hms.service;

import com.medicore.hms.entity.Appointment;
import com.medicore.hms.entity.MedicalRecord;
import com.medicore.hms.entity.Prescription;
import com.medicore.hms.repository.*;
import com.medicore.hms.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final RoomRepository roomRepository;
    private final BillRepository billRepository;
    private final MedicineRepository medicineRepository;
    private final AdmissionRepository admissionRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final DepartmentRepository departmentRepository;
    private final SecurityUtils securityUtils;

    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("todayAppointments", appointmentRepository.findByAppointmentDate(LocalDate.now()).size());
        stats.put("availableRooms", roomRepository.countByStatus("Available"));
        stats.put("pendingBills", billRepository.findByPaymentStatus("Pending").size());

        // Monthly revenue
        List<?> paidBills = billRepository.findByPaymentStatus("Paid");
        double monthlyRevenue = paidBills.stream()
                .mapToDouble(bill -> {
                    try {
                        var totalField = bill.getClass().getDeclaredField("totalAmount");
                        totalField.setAccessible(true);
                        Object val = totalField.get(bill);
                        if (val instanceof java.math.BigDecimal) {
                            return ((java.math.BigDecimal) val).doubleValue();
                        }
                        return 0.0;
                    } catch (Exception e) {
                        return 0.0;
                    }
                }).sum();
        stats.put("monthlyRevenue", monthlyRevenue);

        // Appointment trends (last 6 months)
        List<Map<String, Object>> apptTrends = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate mStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate mEnd = mStart.plusMonths(1).minusDays(1);
            List<Appointment> apptsInMonth = appointmentRepository.findByAppointmentDateBetween(mStart, mEnd);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", mStart.getMonth().toString().substring(0, 3));
            item.put("total", apptsInMonth.size());
            apptTrends.add(item);
        }
        stats.put("appointmentTrends", apptTrends);

        // Revenue trends (last 6 months)
        List<Map<String, Object>> revTrends = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate mStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate mEnd = mStart.plusMonths(1).minusDays(1);
            List<?> mBills = billRepository.findByBillingDateBetween(mStart, mEnd);
            double sum = mBills.stream().mapToDouble(b -> {
                try {
                    var f = b.getClass().getDeclaredField("totalAmount");
                    f.setAccessible(true);
                    Object v = f.get(b);
                    return v instanceof java.math.BigDecimal ? ((java.math.BigDecimal) v).doubleValue() : 0.0;
                } catch (Exception e) { return 0.0; }
            }).sum();
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", mStart.getMonth().toString().substring(0, 3));
            item.put("total", sum);
            revTrends.add(item);
        }
        stats.put("revenueTrends", revTrends);

        // Department breakdown
        List<Map<String, Object>> deptStats = new ArrayList<>();
        departmentRepository.findAll().forEach(dept -> {
            Map<String, Object> d = new LinkedHashMap<>();
            d.put("name", dept.getName());
            d.put("value", doctorRepository.findByDepartmentId(dept.getId()).size());
            deptStats.add(d);
        });
        stats.put("departmentStats", deptStats);

        // Recent appointments (limit to 5)
        List<Appointment> allAppts = appointmentRepository.findAll();
        allAppts.sort((a, b) -> b.getAppointmentDate().compareTo(a.getAppointmentDate()));
        stats.put("recentAppointments", allAppts.stream().limit(5).collect(Collectors.toList()));

        // Recent patients (limit to 5)
        var allPatients = patientRepository.findAll();
        allPatients.sort((a, b) -> b.getId().compareTo(a.getId()));
        stats.put("recentPatients", allPatients.stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    public Map<String, Object> getDoctorDashboardStats(Long doctorId) {
        if (doctorId == null && securityUtils.isDoctor()) {
            doctorId = securityUtils.getCurrentDoctorId();
        }
        Map<String, Object> stats = new LinkedHashMap<>();

        var doctorAppts = appointmentRepository.findByDoctorId(doctorId);
        var todayAppts = doctorAppts.stream()
                .filter(a -> LocalDate.now().equals(a.getAppointmentDate()))
                .collect(Collectors.toList());
        stats.put("todayAppointments", todayAppts.size());

        var upcomingAppts = doctorAppts.stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().isAfter(LocalDate.now()))
                .collect(Collectors.toList());
        stats.put("upcomingAppointments", upcomingAppts.size());

        long uniquePatients = doctorAppts.stream()
                .filter(a -> a.getPatient() != null)
                .map(a -> a.getPatient().getId())
                .distinct().count();
        stats.put("totalPatients", uniquePatients);

        long pendingConsultations = doctorAppts.stream()
                .filter(a -> "Scheduled".equalsIgnoreCase(a.getStatus()) || "Confirmed".equalsIgnoreCase(a.getStatus()))
                .count();
        stats.put("pendingConsultations", pendingConsultations);

        stats.put("recentMedicalRecords", medicalRecordRepository.findByDoctorId(doctorId).stream().limit(5).collect(Collectors.toList()));
        stats.put("recentPrescriptions", prescriptionRepository.findByDoctorId(doctorId).stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    public Map<String, Object> getPatientDashboardStats(Long patientId) {
        if (securityUtils.isPatient()) {
            patientId = securityUtils.getCurrentPatientId();
        } else {
            securityUtils.validatePatientAccess(patientId);
        }

        Map<String, Object> stats = new LinkedHashMap<>();

        var allAppts = appointmentRepository.findByPatientId(patientId);
        var upcomingAppts = allAppts.stream()
                .filter(a -> a.getAppointmentDate() != null && (a.getAppointmentDate().isAfter(LocalDate.now()) || a.getAppointmentDate().equals(LocalDate.now())))
                .filter(a -> "Scheduled".equalsIgnoreCase(a.getStatus()) || "Confirmed".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());

        stats.put("upcomingAppointment", !upcomingAppts.isEmpty() ? upcomingAppts.get(0) : null);
        stats.put("appointmentHistory", allAppts.stream().limit(5).collect(Collectors.toList()));

        var records = medicalRecordRepository.findByPatientId(patientId);
        stats.put("recentMedicalRecord", !records.isEmpty() ? records.get(0) : null);

        var prescList = prescriptionRepository.findByPatientId(patientId);
        stats.put("activePrescriptions", prescList);

        var patientBills = billRepository.findByPatientId(patientId);
        var pendingBills = patientBills.stream()
                .filter(b -> "Pending".equalsIgnoreCase(b.getPaymentStatus()))
                .collect(Collectors.toList());
        stats.put("outstandingBills", pendingBills);

        return stats;
    }

    public Map<String, Object> getAppointmentStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("scheduled", appointmentRepository.countByStatus("Scheduled"));
        stats.put("confirmed", appointmentRepository.countByStatus("Confirmed"));
        stats.put("completed", appointmentRepository.countByStatus("Completed"));
        stats.put("cancelled", appointmentRepository.countByStatus("Cancelled"));
        stats.put("noShow", appointmentRepository.countByStatus("No Show"));
        stats.put("total", appointmentRepository.count());
        return stats;
    }

    public List<Map<String, Object>> getMonthlyRevenue() {
        List<Map<String, Object>> revenue = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            List<?> monthBills = billRepository.findByBillingDateBetween(monthStart, monthEnd);

            Map<String, Object> monthData = new LinkedHashMap<>();
            monthData.put("month", monthStart.getMonth().toString().substring(0, 3) + " " + monthStart.getYear());
            monthData.put("revenue", monthBills.stream()
                    .mapToDouble(bill -> {
                        try {
                            var totalField = bill.getClass().getDeclaredField("totalAmount");
                            totalField.setAccessible(true);
                            Object val = totalField.get(bill);
                            if (val instanceof java.math.BigDecimal) {
                                return ((java.math.BigDecimal) val).doubleValue();
                            }
                            return 0.0;
                        } catch (Exception e) {
                            return 0.0;
                        }
                    }).sum());
            revenue.add(monthData);
        }
        return revenue;
    }

    public Map<String, Object> getDepartmentStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalDepartments", departmentRepository.count());
        return stats;
    }

    public List<Map<String, Object>> getMonthlyPatientRegistrations() {
        List<Map<String, Object>> registrations = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            Map<String, Object> monthData = new LinkedHashMap<>();
            monthData.put("month", monthStart.getMonth().toString().substring(0, 3) + " " + monthStart.getYear());
            monthData.put("count", patientRepository.countRegisteredSince(monthStart));
            registrations.add(monthData);
        }
        return registrations;
    }
}
