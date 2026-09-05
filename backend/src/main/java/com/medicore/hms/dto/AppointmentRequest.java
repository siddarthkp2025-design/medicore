package com.medicore.hms.dto;
import lombok.Data;
import java.time.LocalDate;
@Data public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private Long departmentId;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String reason;
}
