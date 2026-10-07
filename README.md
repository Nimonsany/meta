# E-commerce Empire Monorepo

This is a monorepo for a hybrid multi-seller e-commerce platform. **Do not create separate docker-compose files or environments.**

## Folder Structure
- `/java-core` - Agent 1: Java backend services (empty, use ROOT docker-compose.yml)
- `/node-realtime` - Agent 2: Node.js realtime services (empty, use ROOT docker-compose.yml)
- `/frontend` - Agent 3: Frontend application (empty, use ROOT docker-compose.yml)
- `/infra` - Shared infrastructure (nginx, tiles, OSRM, services)
- `docker-compose.yml` - **ROOT** compose file (shared by all agents)
- `.env.example` - Shared environment variables (critical - same file for all)
- `CONTRACT.md` - Shared API contract

## Development Workflow

### All Agents
1. Work **only** inside your assigned folder (`/java-core`, `/node-realtime`, or `/frontend`)
2. Use the **ROOT** `docker-compose.yml` at the monorepo root for all services
3. Use the shared `.env.example` for all environment variables - **do not create your own `.env`**
4. Follow the API naming conventions in `CONTRACT.md`:
   - Java: `/api/java/*`
   - Node: `/api/node/*`

### Agent 1 (Java Core)
- Develop Java services in `/java-core`
- Depends on: postgres, redis (defined in docker-compose.yml)
- Expose API under `/api/java/*`

### Agent 2 (Node Realtime)
- Develop Node.js services in `/node-realtime`
- Depends on: mongo, redis, meilisearch, minio (defined in docker-compose.yml)
- Expose API under `/api/node/*`

### Agent 3 (Frontend)
- Develop frontend application in `/frontend`
- Consumes APIs from java-core and node-realtime through nginx

## Infrastructure
- All services defined in root `docker-compose.yml`
- Nginx at `infra/nginx/nginx.conf` routes traffic:
  - `/api/java/*` -> java-core:8080
  - `/api/node/*` -> node-realtime:3000
  - `/tiles/*` -> tileserver:8080
  - `/route/*` -> osrm:5000
- Shared resources: redis (locks, cart, geo, streams), postgres, mongo, meilisearch, minio

## Getting Started
1. Clone this repo
2. Copy `.env.example` to `.env` (same file for all agents)
3. Run `docker-compose up -d`
4. Begin development in your assigned folder