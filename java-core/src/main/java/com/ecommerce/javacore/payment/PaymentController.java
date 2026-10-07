package com.ecommerce.javacore.payment;

import com.ecommerce.javacore.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AppConfig appConfig;

    @PostMapping
    public ResponseEntity<String> processPayment(@RequestBody PaymentRequest request,
                                                 @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        String paymentRef = paymentService.processPayment(request);
        // In production: store result keyed by idempotencyKey for retry safety
        return ResponseEntity.ok().header("X-Idempotency-Key", idempotencyKey)
                .body(paymentRef);
    }

    @PostMapping("/refund")
    public ResponseEntity<String> refundPayment(@RequestBody String paymentId) {
        String refundRef = paymentService.refundPayment(paymentId);
        return ResponseEntity.ok(refundRef);
    }

    static class PaymentRequest {
        private String paymentId;
        private String orderId;
        private double amount;
        private String currency;

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
    }
}