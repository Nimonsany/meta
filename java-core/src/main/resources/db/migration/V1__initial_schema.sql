-- Migration: 1_create_tables_and_row_level_security.sql

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    seller_id VARCHAR(255),
    phone VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table with Row Level Security
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    seller_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payouts table
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    payout_id VARCHAR(255) UNIQUE NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    seller_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own orders
CREATE POLICY user_own_orders ON orders
    USING (user_id = current_setting('app.current_user_id'));

-- Create policy: sellers can see orders where they are the seller
CREATE POLICY seller_own_orders ON orders
    USING (seller_id = current_setting('app.current_seller_id'));

-- Create policy: admins can see all orders
CREATE POLICY admin_all_orders ON orders
    USING (current_setting('app.current_user_role') = 'admin');

-- Enable Row Level Security on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: users can see payments for their own orders
CREATE POLICY user_own_payments ON payments
    USING (order_id IN (SELECT order_id FROM orders WHERE user_id = current_setting('app.current_user_id')));

-- Policy: sellers can see payments for their orders
CREATE POLICY seller_own_payments ON payments
    USING (order_id IN (SELECT order_id FROM orders WHERE seller_id = current_setting('app.current_seller_id')));

-- Enable Row Level Security on payouts table
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Policy: sellers can see payouts for their payments
CREATE POLICY seller_own_payouts ON payouts
    USING (payment_id IN (SELECT payment_id FROM payments WHERE seller_id = current_setting('app.current_seller_id')));

-- Policy: admins can see all payouts
CREATE POLICY admin_all_payouts ON payouts
    USING (current_setting('app.current_user_role') = 'admin');

-- Indexes for performance
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE UNIQUE INDEX idx_payments_idempotency_key ON payments(idempotency_key);

-- Sequences for ID generation
CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payout_seq START WITH 1 INCREMENT BY 1;