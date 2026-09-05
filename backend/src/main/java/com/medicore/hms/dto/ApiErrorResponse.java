package com.medicore.hms.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data @Builder public class ApiErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String details;
}
