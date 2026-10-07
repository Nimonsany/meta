package com.ecommerce.javacore.inventory;

import com.ecommerce.javacore.config.AppConfig;
import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@Service
public class InventoryService {

    @Autowired
    private RedissonClient redissonClient;

    @Autowired
    private AppConfig appConfig;

    public boolean reserveItems(String orderId, String sellerId, int quantity) {
        RLock lock = redissonClient.getLock("inventory:" + sellerId);
        try {
            if (lock.tryLock(30, 5, TimeUnit.SECONDS)) {
                // Simulate SELECT FOR UPDATE - in real app: lock DB row
                // Check stock, deduct, etc.
                return true;
            }
            return false;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        } finally {
            lock.unlock();
        }
    }

    public boolean releaseItems(String orderId, String sellerId, int quantity) {
        RLock lock = redissonClient.getLock("inventory:" + sellerId);
        try {
            if (lock.tryLock(30, 5, TimeUnit.SECONDS)) {
                // Release stock
                return true;
            }
            return false;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        } finally {
            lock.unlock();
        }
    }
}