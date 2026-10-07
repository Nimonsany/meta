package com.ecommerce.javacore.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.ecommerce.javacore.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Autowired
    private AppConfig appConfig;

    public String generateAccessToken(String userId, String role, String sellerId) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        return JWT.create()
                .withIssuer("ecommerce-vault")
                .withClaim("userId", userId)
                .withClaim("role", role)
                .withClaim("sellerId", sellerId != null ? sellerId : "")
                .withExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .sign(algorithm);
    }

    public String generateRefreshToken(String userId) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        return JWT.create()
                .withIssuer("ecommerce-vault")
                .withClaim("userId", userId)
                .withExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .sign(algorithm);
    }

    public String refreshAccessToken(String refreshToken) {
        String userId = JWT.require(HMAC256(jwtSecret))
                .withIssuer("ecommerce-vault")
                .build()
                .verify(refreshToken)
                .getClaim("userId")
                .asString();
        return generateAccessToken(userId, "buyer", null);
    }

    public String encryptPhone(String phone) {
        // AES-256 encryption - simplified for demo
        return phone; // In production: use Cipher with secret key rotation
    }

    public String decryptPhone(String encryptedPhone) {
        return encryptedPhone;
    }
}