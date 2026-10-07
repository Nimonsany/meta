# E-commerce Empire Integration Checklist

**Purpose**: Agent 4 must verify these 20 checks before any service is considered production-ready.
**Scope**: Covers Java Core, Node.js, Frontend, Infrastructure, and Data contracts.

## 🔐 Authentication & Security

| # | Check | Status | Notes |
|---|-------|--------|-------|
| [ ] | **1. JWT_SECRET identical** in Java `.env`, Node `.env`, and Mock config | | The `JWT_SECRET=supersecret_shared_jwt_12345_must_be_same_for_java_and_node` from `.env.example` must be exactly the same across all services |
| [ ] | **2. JWT token format valid** `{userId, role, sellerId}` | | Verify JWT claims match the contract format. Decode tokens at jwt.io to verify |
| [ ] | **3. JWT authentication on Java endpoints** | | All `/api/java/*` endpoints (except `/login`, `/register`) must require Bearer token |
| [ ] | **4. JWT authentication on Node endpoints** | | Protected Node routes must validate JWT (or public routes must be documented) |
| [ ] | **5. Admin JWT separate from user JWT** | | `adminJwt` and `sellerJwt` must be different tokens with different role claims |

## 📡 Redis Streams & API Contract

| # | Check | Status | Notes |
|---|-------|--------|-------|
| [ ] | **6. Redis Stream `order_events` channel exists** | | Must be configured in Redis; Java publishes XADD, Node subscribes |
| [ ] | **7. OrderPaidEvent message format matches CONTRACT.md** | | `{orderId, status, userId, sellerId, amount, items, timestamp}` |
| [ ] | **8. Java publishes XADD to `order_events`** | | Format: `XADD order_events * orderId <id> status <status>` |
| [ ] | **9. Node subscribes to `order_events`** | | Node.js must consume Redis Streams and update real-time state |
| [ ] | **10. API naming convention** | | Java: `/api/java/*` ; Node: `/api/node/*` ; Both must not conflict |

## 🌐 Routing & Network

| # | Check | Status | Notes |
|---|-------|--------|-------|
| [ ] | **11. Nginx routes `/api/java/*` → java-core:8080** | | Verify in `/infra/nginx/nginx.conf` |
| [ ] | **12. Nginx routes `/api/node/*` → node-realtime:3000** | | Or mock: `mock:3001` when node-realtime not ready |
| [ ] | **13. Nginx routes `/tiles/*` → tileserver:8080** | | Mount `./infra/tiles/nepal.mbtiles` |
| [ ] | **14. Nginx routes `/route/*` → osrm:5000** | | GPS routing service |
| [ ] | **15. Nginx rate limiting active** | | `limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m` |
| [ ] | **16. Auth login rate limit: 10 req/s** | | `limit_req_zone $binary_remote_addr zone=auth_login:10r/s` |
| [ ] | **17. Client body size limited to 10M** | | `client_max_body_size 10M` in nginx config |
| [ ] | **18. `/actuator/*` blocked from public** | | Only `127.0.0.1` allowed; others get 403 |
| [ ] | **19. Internal services NOT exposed publicly** | | PostgreSQL (5432), MongoDB (27017), Redis (6379), MinIO (9000) must be internal only |
| [ ] | **19b. UFW confirms only 22/80/443 open** | | `ufw status` should show these 3 ports only |

## 🗄️ Database & Storage

| # | Check | Status | Notes |
|---|-------|--------|-------|
| [ ] | **20. PostgreSQL RLS (Row Level Security) enabled** | | Policies must block seller A from fetching seller B's orders |
| [ ] | **21. PostgreSQL indexes exist** | | `idx_orders_seller_id`, `idx_orders_user_id`, `UNIQUE idx_payments_idempotency_key` |
| [ ] | **22. MinIO bucket is private** | | Object storage for KYC documents, product images |
| [ ] | **23. MongoDB collections and indexes ready** | | For node-realtime: products, cart, sessions |
| [ ] | **24. MinIO health check passing** | | `mc ping` or `curl http://minio:9000/minio/health/live` |

## 🎨 Frontend

| # | Check | Status | Notes |
|---|-------|--------|-------|
| [ ] | **25. Frontend uses `/api/*` not `localhost`** | | All API calls must go through nginx reverse proxy, not direct localhost:8080 |
| [ ] | **26. Frontend uses shared SDK** `/shared/sdk/` | | Import `{ javaApi, nodeApi } from '@/shared/sdk'` — do not hardcode fetch URLs |
| [ ] | **27. JWT stored in localStorage and sent via Authorization header** | | Pattern: `localStorage.getItem('jwt')` + `Bearer ${jwt}` |
| [ ] | **28. Mock fallback works** | | Set `API_URL=http://mock:3001` and frontend should still function |
| [ ] | **29. Redis Stream events received by frontend** | | Real-time order status updates visible in UI |

## 📦 Deployment

| # | Check | Status | Notes |
|---|-------|--------|-------|
| [ ] | **30. ROOT docker-compose.yml has all 9 services** | | postgres, mongo, redis, meilisearch, minio, tileserver, osrm, java-core, node-realtime, nginx |
| [ ] | **31. `.env.example` is shared and identical for all agents** | | No agent-specific `.env` files |
| [ ] | **32. Docker builds succeed** `./mvnw package` (Java) + `npm run build` (Node) | | |
| [ ] | **33. Crontab backup script enabled** | | `0 2 * * * /opt/ecommerce-empire/infra/scripts/backup.sh` |
| [ ] | **34. CI/CD pipeline `.github/workflows/deploy.yml`** | | SSH to droplet, git pull, docker compose up -d --build |

## ✅ Final Sign-off

All 34 checks above must be **green** before the monorepo is considered production-ready.

**Reviewer**: Agent 4  
**Date**: 
**Comments**: