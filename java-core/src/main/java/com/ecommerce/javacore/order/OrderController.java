package com.ecommerce.javacore.order;

import com.ecommerce.javacore.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java/orders")
public class OrderController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private AppConfig appConfig;

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest request) {
        // Publish to Redis Stream: order_events
        String orderId = "order_" + System.currentTimeMillis();
        redisTemplate.opsForStream().add(
                appConfig.getRedis().getStreamName(),
                "orderId", orderId,
                "status", "PAID",
                "userId", request.getUserId(),
                "sellerId", request.getSellerId(),
                "amount", String.valueOf(request.getAmount())
        );

        return ResponseEntity.ok("Order created: " + orderId);
    }

    static class OrderRequest {
        private String userId;
        private String sellerId;
        private double amount;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getSellerId() { return sellerId; }
        public void setSellerId(String sellerId) { this.sellerId = sellerId; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }
}