// Shared TypeScript SDK for E-commerce Empire Frontend
// import { javaApi, nodeApi } from '@/shared/sdk'
// Uses JWT from localStorage for authentication

// ============================================
// Java SDK - /api/java/*
// ============================================

export interface User {
  userId: string
  role: 'buyer' | 'seller' | 'admin'
  sellerId?: string
}

export interface Order {
  orderId: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  userId: string
  sellerId: string
  amount: number
  items?: { productId: string; qty: number }[]
  createdAt?: string
}

export interface Payment {
  paymentId: string
  orderId: string
  amount: number
  status: 'pending' | 'paid' | 'refunded'
  currency: string
  createdAt?: string
}

export interface Seller {
  sellerId: string
  storeName: string
  kycStatus: 'pending' | 'verified' | 'rejected'
  rating: number
  totalSales: number
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// Java API functions with JWT auth
export const javaApi = {
  // POST /api/java/auth/login
  login: async (userId: string, role: User['role'], sellerId?: string) => {
    const body = { userId, role, sellerId: sellerId || undefined }
    const res = await fetch('/api/java/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (data.accessToken) {
      localStorage.setItem('jwt', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    }
    return data
  },

  // POST /api/java/auth/register
  register: async (userId: string, email: string, password: string, role: User['role'], sellerId?: string) => {
    const body = { userId, email, password, role, sellerId: sellerId || undefined }
    const res = await fetch('/api/java/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return res.json()
  },

  // GET /api/java/auth/me
  me: async () => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch('/api/java/auth/me', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
    return res.json()
  },

  // GET /api/java/sellers/{id}
  getSeller: async (sellerId: string) => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch(`/api/java/sellers/${sellerId}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
    return res.json()
  },

  // PUT /api/java/sellers/kyc
  uploadKyc: async (documentUrl: string, jwt: string) => {
    const res = await fetch('/api/java/sellers/kyc', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentUrl })
    })
    return res.json()
  },

  // GET /api/java/admin/sellers
  listSellersForVerification: async () => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch('/api/java/admin/sellers', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
    return res.json()
  },

  // PUT /api/java/admin/sellers/{id}/verify
  verifySeller: async (sellerId: string, jwt: string) => {
    const res = await fetch(`/api/java/admin/sellers/${sellerId}/verify`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })
    return res.json()
  },

  // GET /api/java/orders/my
  getMyOrders: async () => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch('/api/java/orders/my', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
    return res.json()
  },

  // GET /api/java/orders/seller/my
  getSellerOrders: async () => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch('/api/java/orders/seller/my', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
    return res.json()
  },

  // POST /api/java/orders
  createOrder: async (orderData: { userId: string; sellerId: string; amount: number; items?: any }) => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch('/api/java/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    return res.json()
  },

  // POST /api/java/payments
  payOrder: async (paymentData: { orderId: string; amount: number; currency?: string }) => {
    const jwt = localStorage.getItem('jwt')
    const res = await fetch('/api/java/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `${paymentData.orderId}_${Date.now()}`
      },
      body: JSON.stringify(paymentData)
    })
    return res.json()
  },

  // POST /api/java/payments/refund
  refundPayment: async (paymentId: string, jwt: string) => {
    const res = await fetch('/api/java/payments/refund', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ paymentId })
    })
    return res.json()
  }
} as const

// ============================================
// Node SDK - /api/node/*
// ============================================

export interface NodeProduct {
  productId: string
  name: string
  price: number
  category: string
  sellerId: string
}

export interface DeliveryAgent {
  agentId: string
  lat: number
  lng: number
  status: 'online' | 'delivering' | 'offline'
  timestamp: string
}

export interface NearestAgent {
  agent: { lat: number; lng: number }
  distance_km: number
}

// Node API functions
export const nodeApi = {
  // GET /api/node/products/search?q=product
  searchProducts: async (query: string) => {
    const res = await fetch(`/api/node/products/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    return res.json()
  },

  // POST /api/node/delivery/nearest
  getNearestAgent: async (lat: number, lng: number) => {
    const res = await fetch('/api/node/delivery/nearest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    })
    return res.json()
  },

  // WebSocket / Socket.io connection
  connectTracking: (onUpdate: (agent: DeliveryAgent) => void) => {
    const socket = new WebSocket(`${window.location.origin}/ws/tracking`)
    // Note: In production, use proper Socket.io client
    // This is a placeholder for the mock WS endpoint
    console.log('WebSocket connection established for tracking')
    return socket
  }
} as const

// Export both SDKs
export type { User, Order, Payment, Seller, LoginResponse, NodeProduct, DeliveryAgent, NearestAgent }
export type { javaApi, nodeApi }

export default {
  javaApi,
  nodeApi,
  User,
  Order,
  Payment,
  Seller,
  LoginResponse,
  NodeProduct,
  DeliveryAgent,
  NearestAgent
}