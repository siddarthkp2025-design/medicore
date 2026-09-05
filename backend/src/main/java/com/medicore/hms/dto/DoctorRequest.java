package com.medicore.hms.dto;
import lombok.Data;
@Data public class DoctorRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private Long departmentId;
}
