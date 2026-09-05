package com.medicore.hms.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenProvider {
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        return Jwts.builder()
                .subject((userPrincipal.getUsername()))
                .claim("id", userPrincipal.getId())
                .claim("role", userPrincipal.getRole())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }
    public String getUserNameFromJwtToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
        }
        return false;
    }
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
        return claimsResolver.apply(claims);
    }
}
