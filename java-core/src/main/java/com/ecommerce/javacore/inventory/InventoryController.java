package com.ecommerce.javacore.inventory;

import com.ecommerce.javacore.config.AppConfig;
import org.redisson.api.RLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private AppConfig appConfig;

    @PostMapping("/reserve")
    public ResponseEntity<String> reserve(@RequestBody ReserveRequest request) {
        boolean success = inventoryService.reserveItems(
                request.getOrderId(),
                request.getSellerId(),
                request.getQuantity()
        );
        if (success) {
            return ResponseEntity.ok("Reserved " + request.getQuantity() + " items for order " + request.getOrderId());
        }
        return ResponseEntity.badRequest().body("Failed to reserve items");
    }

    static class ReserveRequest {
        private String orderId;
        private String sellerId;
        private int quantity;

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getSellerId() { return sellerId; }
        public void setSellerId(String sellerId) { this.sellerId = sellerId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}