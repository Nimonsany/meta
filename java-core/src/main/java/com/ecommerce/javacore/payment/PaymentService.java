package com.ecommerce.javacore.payment;

import com.ecommerce.javacore.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@Service
public class PaymentService {

    @Autowired
    private AppConfig appConfig;

    public String processPayment(PaymentRequest request) {
        // Idempotency check - in production: check DB by idempotency key
        // Process payment (Stripe, PayPal, etc.)
        return "payment_" + request.getPaymentId();
    }

    public String refundPayment(String paymentId) {
        // Refund processing
        return "refund_" + paymentId;
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