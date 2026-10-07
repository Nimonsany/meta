# Mock Node Server

Simple Express + Socket.io mock server for the E-commerce Empire platform.

## Purpose

When the `node-realtime` service (Agent 2) is not yet ready, Frontend Agent 3 can use this mock by setting:

```
API_URL=http://mock:3001
```

This allows frontend development to continue without waiting for the Node.js backend.

## Endpoints

### GET /api/node/products/search?q=<query>

Search for products by name or category.

**Query Parameters:**
- `q` - Search query (optional)

**Response:**
```json
{
  "success": true,
  "products": [...],
  "total": 5,
  "query": "search term"
}
```

### POST /api/node/delivery/nearest

Get the nearest delivery agent position for a given location.

**Request Body:**
```json
{
  "lat": 27.71,
  "lng": 85.31
}
```

**Response:**
```json
{
  "success": true,
  "agent": { "lat": 27.7112, "lng": 85.3145 },
  "distance_km": 0.3
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "uptime": 123.456
}
```

## Socket.io Events

### connection

Emitted when a client connects.

### tracking:update (every 3 seconds)

Emitted to all connected clients with moving delivery agent position.

**Payload:**
```json
{
  "agentId": "a1b2c3d4",
  "lat": 27.7143,
  "lng": 85.3127,
  "status": "online", // or "delivering"
  "timestamp": "2026-05-13T10:00:00Z"
}
```

## Usage with Frontend

Set the API base URL to the mock server:

```javascript
// In your frontend .env or config
VITE_API_URL=http://mock:3001
// or
API_URL=http://localhost:3001
```

Then import the shared SDK (see /shared/sdk/) which will automatically route to the mock server.

## Development

```bash
# Install dependencies
npm install

# Start mock server
npm start

# Or with hot reload
npm run dev

# Build and run via Docker
docker build -t node-mock .
docker run -d -p 3001:3001 node-mock
```

## Production Note

This is a **mock** only for development. When the real `node-realtime` service is ready, update `API_URL` to point to the real service:

```
API_URL=http://node-realtime:3000
```

The mock endpoints and Socket.io format match the CONTRACT.md specifications so the transition is seamless.