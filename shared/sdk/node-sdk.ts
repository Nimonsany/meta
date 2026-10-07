// Shared TypeScript SDK - Node.js APIs
// Based on CONTRACT.md specifications
// Even though Agent 2's node-realtime is not ready, frontend can import this
// and type-check against the expected interfaces.

// ============================================
// Node.js API Types (from CONTRACT.md)
// ============================================

export interface UserId {
  userId: string
}

export interface SellerId {
  sellerId: string
}

export interface OrderId {
  orderId: string
}

export interface Amount {
  amount: number
}

export interface ProductId {
  productId: string
}

export interface Qty {
  qty: number
}

// ============================================
// Product Types
// ============================================

export interface Product {
  productId: string
  name: string
  price: number
  category: string
  sellerId: string
  description?: string
  images?: string[]
  stock: number
}

// ============================================
// Order Types (Node / Real-time)
// ============================================

export interface NodeOrder {
  orderId: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  userId: string
  sellerId: string
  amount: number
  items: { productId: string; qty: number }[]
  createdAt: string
  updatedAt: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
}

// ============================================
// Redis Streams Types (from CONTRACT.md)
// ============================================

export interface OrderPaidEvent {
  orderId: string
  status: string
  userId: string
  sellerId: string
  amount: number
  items?: { productId: string; qty: number }[]
  timestamp: string
}

// ============================================
// Node API Interface (even if not implemented yet)
// Frontend can type-check against this
// ============================================

export interface NodeApi {
  // GET /api/node/products/search?q=<query>
  searchProducts: (query: string) => Promise<{
    success: boolean
    products: Product[]
    total: number
    query: string
  }>

  // POST /api/node/delivery/nearest
  getNearestAgent: (lat: number, lng: number) => Promise<{
    success: boolean
    agent: { lat: number; lng: number }
    distance_km: number
  }>

  // WebSocket: tracking:update every 3s
  // Subscribe to: onTrackingUpdate: (agent: DeliveryAgent) => void
  subscribeTracking: (callback: (agent: DeliveryAgent) => void) => void

  // GET /api/node/orders/:orderId (if needed)
  getOrder: (orderId: string) => Promise<{
    success: boolean
    order: NodeOrder
  }>

  // WebSocket events
  events: {
    trackingUpdate: (agent: DeliveryAgent) => void
    orderStatusChange: (orderId: string, status: string) => void
  }
}

// ============================================
// SDK Export
// ============================================

export interface NodeSdk {
  searchProducts: NodeApi['searchProducts']
  getNearestAgent: NodeApi['getNearestAgent']
  subscribeTracking: NodeApi['subscribeTracking']
  getOrder: NodeApi['getOrder']
}

export const nodeSdk: NodeSdk = {
  searchProducts: async (query: string) => {
    // Placeholder - will be replaced by real Node.js service
    // Frontend should use mock: API_URL=http://mock:3001
    throw new Error('Node SDK: call mock server or replace with real API')
  },
  getNearestAgent: async (lat: number, lng: number) => {
    throw new Error('Node SDK: call mock server or replace with real API')
  },
  subscribeTracking: () => {
    console.warn('Node SDK: subscribeTracking called - no WS connection established')
  },
  getOrder: async (orderId: string) => {
    throw new Error('Node SDK: call mock server or replace with real API')
  }
}