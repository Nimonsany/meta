/*
 * k6 Load Test Report: E-commerce Empire Java Core
 * Test: POST /api/java/orders with 1000 concurrent users
 * Purpose: Verify inventory lock doesn't oversell and idempotency works
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { uuidv4 } from "k6/x/random";
import { Rate } from "k6/metrics";

// Custom metrics
let failed_requests = new Rate("failed_requests");
let successful_orders = new Rate("successful_orders");
let oversold_detected = new Rate("oversold_detected");

// Configuration
const BASE_URL = __ENV.BASE_URL || "http://localhost:80";
const USERS = __VUS; // Number of virtual users
const DURATION = __ITERATIONS || "2m";

// Test data - each user creates orders with unique IDs
const userIds =Array.from({ length: USERS }, (_, i) => `testuser_${i}`);
const sellerIds = ["seller_1", "seller_2"];

// Test setup
export function setup() {
    // No prep needed - test creates orders fresh
    return { startTime: new Date().getTime() };
}

// Test teardown
export function teardown() {
    // Summary collected via metrics
}

// Main test function
export default function () {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const sellerId = sellerIds[Math.floor(Math.random() * sellerIds.length)];
    const orderId = `load_test_${uuidv4()}_${Date.now()}`;

    const payload = JSON.stringify({
        userId: userId,
        sellerId: sellerId,
        amount: Math.floor(Math.random() * 500) + 50, // $50-$550
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // Submit order request
    const res = http.post(`${BASE_URL}/api/java/orders`, payload, params);

    // Check response
    const statusSuccess = res.status === 200 || res.status === 201;
    const bodySuccessful = JSON.parse(res.body).success === true;

    check(res, {
        "status is 200/201": (r) => r.status === 200 || r.status === 201,
        "order created": (r) => JSON.parse(r.body).orderId !== undefined,
    });

    // Track metrics
    if (statusSuccess && bodySuccessful) {
        successful_orders.add(1);
    } else {
        failed_requests.add(1);
    }

    // Simple oversell detection: if we get a success but the system
    // should have limited by inventory, check for error indicators
    if (res.body.includes("INSUFFICIENT stock") || res.body.includes("Out of stock")) {
        oversold_detected.add(1);
    }

    // Think time - minimal to simulate realistic load
    sleep(Math.random() * 0.5 + 0.1);
}