# Shared API Contract

## JWT Format
```json
{
  "userId": "string",
  "role": "string",      // e.g., "buyer", "seller", "admin"
  "sellerId": "string"   // optional, present for seller roles
}
```

## Redis Streams
- **Channel**: `order_events`
- **Message format**:
```json
{
  "orderId": "string",
  "status": "string",    // e.g., "pending", "confirmed", "shipped", "delivered", "cancelled"
  "userId": "string",
  "sellerId": "string",
  "amount": "number"
}
```

## API Naming Conventions
- **Java services**: `/api/java/*` - All Java-backed REST endpoints
- **Node services**: `/api/node/*` - All Node.js real-time / websocket endpoints

## Cross-Service Guarantees
- All services must use the shared `.env` for connection URLs
- JWT secrets must match across Java and Node implementations
- Redis Streams `order_events` must be consumed by any service needing order state