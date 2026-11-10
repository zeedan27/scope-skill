# Caching, Rate Limiting, Load Balancing, and Scaling

Consult these reference standards whenever Layers 9, 10, or 11 are marked Required or Lite in the Layer Decision Table.

---

## 1. HTTP Caching Headers
- **Hashed Static Assets:** `Cache-Control: public, max-age=31536000, immutable`.
- **Public Dynamic HTML / Unauthenticated APIs:** `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=86400, stale-if-error=86400`.
- **Authenticated / User-Specific Routes:** `Cache-Control: private, no-store`.
- **Core Security Invariant:** Never emit `public` or `s-maxage` on endpoints inspecting `Authorization` headers, session tokens, or private cookies.
- **Header Variation (`Vary`):** Specify only `Accept-Encoding` on public endpoints. Setting `Vary: Cookie` or `Vary: User-Agent` drops cache hit ratios drastically.
- **Edge Cache Keys:** Normalize incoming query parameters at the CDN edge (strip marketing tokens like `utm_*`, `fbclid`, `gclid`).
- **Tag-Based Invalidation:** Apply cache tags (`Cache-Tag`, `Surrogate-Key`) and purge targeted tags upon mutations rather than flushing entire zones.

---

## 2. Application-Level Caching
- **Next.js (v16.3+):** Migrate deprecated `revalidate` and `dynamic` exports to `"use cache"` and `cacheComponents: true`. Validate behaviors using Playwright instant tests.
- **Redis & In-Memory Stores:**
  - Enforce explicit TTLs on all cache keys.
  - Group pipeline requests to minimize network roundtrips.
  - Never execute unbounded `KEYS *` queries in production environments; use iterative `SCAN`.
  - Point developer MCPs exclusively at local or staging Redis instances with read-only ACL credentials.

---

## 3. Rate Limiting Strategy
- Choose **one** centralized rate-limiting solution per project (e.g., Upstash Ratelimit or Arcjet).
- Define tier-specific limits across route categories: Authentication, Search, Mutating APIs, AI Generation, and Webhooks.
- Roll out new rules in dry-run/audit mode first to observe traffic thresholds before switching to active blocking.
- Key counters by user identity for authenticated sessions; fall back to client IP for public routes.
- Decide fail-open vs. fail-closed postures explicitly: fail closed on authentication and costly AI pipelines.
- Return HTTP 429 status codes with informative `Retry-After` headers.

---

## 4. Load Balancing, Probes, and Scaling
- **Stateless Architecture:** Eliminate in-memory session persistence. Back sessions, tokens, and rate limits with Redis or persistent storage.
- **Health Probes:**
  - *Liveness (`/healthz/live`):* Verifies process responsiveness. Never include external dependencies (e.g. databases), avoiding cascading service restarts during downstream outages.
  - *Readiness (`/healthz/ready`):* Checks database, cache, and downstream connectivity. Balancers pull instances out of traffic upon failure.
  - *Startup (`/healthz/startup`):* Shields slow initialization processes from premature termination.
- **Graceful Termination:** Upon receiving `SIGTERM`:
  1. Transition readiness probe to HTTP 503.
  2. Wait a brief drain period (5–10s) to allow upstream proxies to update routes.
  3. Complete in-flight requests, close connections, and exit cleanly.
- **Timeout Alignment:** Maintain keep-alive timeouts longer than upstream proxy/load balancer idle timeouts (e.g., server keep-alive of 65s behind a 60s proxy) to eliminate intermittent HTTP 502 errors.
- **Database Connection Pooling:** Maintain total worker connections below the database's `max_connections` threshold. Deploy transactional poolers (e.g., PgBouncer, Supavisor) when scaling out horizontally.
- **Autoscaling:** Trigger scaling events based on request concurrency, queue backlog, or p95 response latency rather than CPU utilization alone. Scale up aggressively; scale down conservatively with stabilization windows. Set firm instance maximums.
