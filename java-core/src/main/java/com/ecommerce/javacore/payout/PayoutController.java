package com.ecommerce.javacore.payout;

import com.ecommerce.javacore.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java/payouts")
public class PayoutController {

    @Autowired
    private PayoutService payoutService;

    @Autowired
    private AppConfig appConfig;

    @PostMapping
    public ResponseEntity<String> processPayout(@RequestBody PayoutRequest request) {
        String payoutRef = payoutService.processPayout(
                request.getPaymentId(),
                request.getSellerId(),
                request.getAmount()
        );
        return ResponseEntity.ok(payoutRef);
    }

    @GetMapping("/{payoutId}")
    public ResponseEntity<String> getStatus(@PathVariable String payoutId) {
        String status = payoutService.getPayoutStatus(payoutId);
        return ResponseEntity.ok(status);
    }

    static class PayoutRequest {
        private String paymentId;
        private String sellerId;
        private double amount;

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
        public String getSellerId() { return sellerId; }
        public void setSellerId(String sellerId) { this.sellerId = sellerId; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }
}