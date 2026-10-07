-- Seed Data Migration V2
-- Run after V1__initial_schema.sql
-- Creates admin, 2 sellers, 2 customers, and sample data

-- ============================================
-- ADMIN USER
-- ============================================
INSERT INTO users (user_id, role, phone, created_at, updated_at)
VALUES ('admin_1', 'admin', '+15551234000', NOW(), NOW());

-- ============================================
-- SELLER 1
-- ============================================
INSERT INTO users (user_id, role, seller_id, phone, created_at, updated_at)
VALUES ('seller_1_user', 'seller', 'seller_1', '+15551234001', NOW(), NOW());

-- ============================================
-- SELLER 2
-- ============================================
INSERT INTO users (user_id, role, seller_id, phone, created_at, updated_at)
VALUES ('seller_2_user', 'seller', 'seller_2', '+15551234002', NOW(), NOW());

-- ============================================
-- CUSTOMER 1
-- ============================================
INSERT INTO users (user_id, role, phone, created_at, updated_at)
VALUES ('customer_1_user', 'customer', '+15551234003', NOW(), NOW());

-- ============================================
-- CUSTOMER 2
-- ============================================
INSERT INTO users (user_id, role, phone, created_at, updated_at)
VALUES ('customer_2_user', 'customer', '+15551234004', NOW(), NOW());

-- ============================================
-- ORDERS FOR SELLER 1 (customer_1 bought, customer_2 bought)
-- ============================================
INSERT INTO orders (order_id, user_id, seller_id, amount, status, created_at, updated_at)
VALUES ('order_seller1_c1', 'customer_1_user', 'seller_1', 1500.00, 'paid', NOW(), NOW());

INSERT INTO orders (order_id, user_id, seller_id, amount, status, created_at, updated_at)
VALUES ('order_seller1_c2', 'customer_2_user', 'seller_1', 800.00, 'pending', NOW(), NOW());

-- ============================================
-- ORDERS FOR SELLER 2 (customer_1 bought)
-- ============================================
INSERT INTO orders (order_id, user_id, seller_id, amount, status, created_at, updated_at)
VALUES ('order_seller2_c1', 'customer_1_user', 'seller_2', 250.00, 'shipped', NOW(), NOW());

-- ============================================
-- PAYMENTS (with idempotency keys)
-- ============================================
INSERT INTO payments (payment_id, order_id, amount, status, created_at, updated_at, idempotency_key)
VALUES ('pay_seller1_c1', 'order_seller1_c1', 1500.00, 'paid', NOW(), NOW(), 'key_seller1_c1');

INSERT INTO payments (payment_id, order_id, amount, status, created_at, updated_at, idempotency_key)
VALUES ('pay_seller1_c2', 'order_seller1_c2', 800.00, 'pending', NOW(), NOW(), 'key_seller1_c2');

INSERT INTO payments (payment_id, order_id, amount, status, created_at, updated_at, idempotency_key)
VALUES ('pay_seller2_c1', 'order_seller2_c1', 250.00, 'paid', NOW(), NOW(), 'key_seller2_c1');

-- ==========================================--
-- Seller KYC data (document URLs stored)
-- ============================================
UPDATE users SET kyc_status = 'pending', kyc_document_url = 'minio://seller-docs/seller_1/citizenship.pdf'
WHERE user_id = 'seller_1_user';

UPDATE users SET kyc_status = 'pending', kyc_document_url = 'minio://seller-docs/seller_2/pan.pdf'
WHERE user_id = 'seller_2_user';