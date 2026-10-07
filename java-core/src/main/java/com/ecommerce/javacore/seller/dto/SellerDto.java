package com.ecommerce.javacore.seller.dto;

public class SellerDto {
    private String id;
    private String userId;
    private String storeName;
    private String kycStatus; // pending, verified, rejected
    private String kycDocumentUrl; // stored path/URL
    private String rating;
    private Long totalSales;

    // Constructors, getters, setters
    public SellerDto() {}

    public SellerDto(String id, String userId, String storeName, String kycStatus, String kycDocumentUrl, String rating, Long totalSales) {
        this.id = id;
        this.userId = userId;
        this.storeName = storeName;
        this.kycStatus = kycStatus;
        this.kycDocumentUrl = kycDocumentUrl;
        this.rating = rating;
        this.totalSales = totalSales;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }
    public String getKycDocumentUrl() { return kycDocumentUrl; }
    public void setKycDocumentUrl(String kycDocumentUrl) { this.kycDocumentUrl = kycDocumentUrl; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public Long getTotalSales() { return totalSales; }
    public void setTotalSales(Long totalSales) { this.totalSales = totalSales; }
}