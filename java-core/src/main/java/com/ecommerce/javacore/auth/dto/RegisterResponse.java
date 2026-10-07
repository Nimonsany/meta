package com.ecommerce.javacore.auth.dto;

public class RegisterResponse {
    private String userId;
    private String token;
    private String role;

    public RegisterResponse(String userId, String token, String role) {
        this.userId = userId;
        this.token = token;
        this.role = role;
    }

    public String getUserId() { return userId; }
    public String getToken() { return token; }
    public String getRole() { return role; }
}