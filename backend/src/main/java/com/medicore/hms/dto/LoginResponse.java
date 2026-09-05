package com.medicore.hms.dto;
import lombok.Builder;
import lombok.Data;
@Data @Builder public class LoginResponse {
    private String token;
    private String role;
    private Long userId;
    private String username;
    private String fullName;
}
