package com.ecommerce.javacore.auth.dto;

public class RegisterRequest {
    private String userId;
    private String email;
    private String password;
    private String role; // customer, seller, delivery_agent
    private String sellerType; // e.g., "clothing", "electronics"

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getSellerType() { return sellerType; }
    public void setSellerType(String sellerType) { this.sellerType = sellerType; }
}