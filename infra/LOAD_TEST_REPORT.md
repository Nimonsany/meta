# Load Test Report: E-commerce Empire Java Core

## Test Configuration
- **Tool**: k6 (load testing)
- **Endpoint**: `POST /api/java/orders`
- **Concurrent Users**: 1000 (VUs)
- **Duration**: 2 minutes
- **Base URL**: `http://localhost:80` (through nginx reverse proxy)
- **Test Data**: Random user/seller combos, amounts $50-$550

## Test Script
- File: `/infra/scripts/load_test.js`
- Each VU generates a unique orderId using `uuidv4()`
- Payload includes: userId, sellerId, amount (random $50-$550)
- Rate limiting applied via nginx: 60/m per IP, 10/s for /api/java/auth/login

## Key Metrics Monitored

### 1. Successful Orders Rate
- **Metric**: `successful_orders`
- **Target**: All 1000 orders should complete without errors
- **Pass Criteria**: > 95% success rate (some failures expected due to network/rate limits)

### 2. Failed Requests Rate
- **Metric**: `failed_requests`
- **Target**: Minimal failures
- **Pass Criteria**: < 5% failure rate

### 3. Oversell Detection
- **Metric**: `oversold_detected`
- **Target**: 0 (zero overselling)
- **Pass Criteria**: `oversold_detected` must remain at 0
- **What it checks**: Response body for "INSUFFICIENT stock" or "Out of stock" indicators

### 4. Inventory Lock Integrity
- The test verifies that Redis Redlock + SELECT FOR UPDATE pattern
- Each order reserves items for a specific seller
- No two orders for the same seller should exceed available stock
- **Pass Criteria**: Inventory counts remain consistent (test validates via Redis state)

## Expected Results on DigitalOcean $24 Droplet

### With 1 vCPU / 2GB RAM Droplet:
- **Throughput**: ~50-100 orders/second (limited by Redis + PostgreSQL)
- **95th percentile latency**: ~200-500ms per order
- **Memory usage**: ~500MB (Java Heap + Redis)
- **CPU usage**: ~40-60% peak

### Pass/Fail Criteria

| Metric | Pass Threshold | Fail Threshold |
|--------|---------------|----------------|
| successful_orders | > 950 (95%) | < 900 (90%) |
| failed_requests | < 50 (5%) | > 100 (10%) |
| oversold_detected | 0 | > 0 |
| avg response time | < 500ms | > 2s |

## Remediation if Tests Fail

### If oversold_detected > 0:
- Review Redis Redlock timeout configuration
- Ensure SELECT FOR UPDATE is properly indexed
- Check for race conditions in inventory service

### If failed_requests > 10%:
- Increase nginx rate limit zone size
- Add more Redis replicas
- Optimize PostgreSQL queries
- Consider connection pooling

### If response time > 500ms:
- Enable HTTP keep-alive
- Optimize Redis operations
- Add read replicas for PostgreSQL
- Review GC logs for Java heap issues

## Run the Test Locally

```bash
# Install k6 if not present
brew install k6  # macOS
# or: sudo apt-get install k6  # Ubuntu

# Run with 100 VUs for 30 seconds
k6 run -vus 100 -duration 30s infra/scripts/load_test.js \
    -e BASE_URL="http://localhost:80"

# Or with Docker
docker run --rm -v $(pwd):/loadtest grafana/k6 k6 run /loadtest/infra/scripts/load_test.js \
    -vus 100 -duration 30s -e BASE_URL="http://localhost:80"
```

## DigitalOcean $24 Droplet Notes

On a 1CPU/2GB droplet:
- k6 runner resource: ~200MB RAM, ~5% CPU per 100 VUs
- Recommended: Start with 100 VUs, scale up gradually
- Monitor: `docker stats` for container resource usage
- Redis is the bottleneck - consider upstash or managed Redis for higher loads