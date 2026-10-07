package com.ecommerce.shared.dtos;

import java.util.List;
import java.util.Date;

public class OrderPaidEvent {
    private String orderId;
    private String status;
    private String userId;
    private String sellerId;
    private Double amount;
    private List<Item> items;
    private Date timestamp;

    // Default constructor for Redis stream deserialization
    public OrderPaidEvent() {}

    public OrderPaidEvent(String orderId, String status, String userId, String sellerId, Double amount, List<Item> items, Date timestamp) {
        this.orderId = orderId;
        this.status = status;
        this.userId = userId;
        this.sellerId = sellerId;
        this.amount = amount;
        this.items = items;
        this.timestamp = timestamp;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public static class Item {
        private String productId;
        private Integer qty;

        public Item() {}

        public Item(String productId, Integer qty) {
            this.productId = productId;
            this.qty = qty;
        }

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public Integer getQty() { return qty; }
        public void setQty(Integer qty) { this.qty = qty; }
    }
}