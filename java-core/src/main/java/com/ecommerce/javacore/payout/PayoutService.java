package com.ecommerce.javacore.payout;

import com.ecommerce.javacore.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PayoutService {

    @Autowired
    private AppConfig appConfig;

    public String processPayout(String paymentId, String sellerId, double amount) {
        // Process payout to seller (bank transfer, crypto, etc.)
        return "payout_" + paymentId + "_" + sellerId;
    }

    public String getPayoutStatus(String payoutId) {
        // Check payout status
        return "status_" + payoutId;
    }
}