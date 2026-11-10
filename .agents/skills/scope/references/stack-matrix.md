# Stack Matrix: The 12 Infrastructure Layers, Tiers, and Build Standards

## Contents
1. The 12 Infrastructure Layers
2. Project Tiers & Right-Sizing Matrix
3. Layer Decision Table Template
4. Build Standards by Layer
5. Layer → Skill / Tool Map

---

## 1. The 12 Infrastructure Layers
Every production-grade project evaluates all 12 layers. Each layer must be explicitly marked **Required**, **Lite**, or **Deferred** (accompanied by an architectural rationale and a measurable revisit trigger).

| # | Layer | Core Question |
|---|---|---|
| 1 | **Frontend** | What does the user see, interact with, and navigate? |
| 2 | **APIs & Backend Logic** | What are the business contracts, validation rules, and pipelines? |
| 3 | **Database & Storage** | Where does state persist; how is data migrated and backed up? |
| 4 | **Auth & Permissions** | Who is accessing the system, and what actions are authorized? |
| 5 | **Hosting & Deployment** | Where does the system run, and how is it delivered? |
| 6 | **Cloud & Compute** | What compute resources are needed, and what are their cost limits? |
| 7 | **CI/CD & Version Control** | How is code verified, integrated, tested, and rolled back? |
| 8 | **Security & RLS** | How are secrets, data tenants, and boundaries guarded? |
| 9 | **Rate Limiting** | How are public resources shielded from abuse or volumetric spikes? |
| 10 | **Caching & CDN** | What assets and read paths can be accelerated or cached? |
| 11 | **Load Balancing & Scaling** | How does the architecture respond when concurrent traffic grows? |
| 12 | **Error Tracking & Observability** | How are failures detected, diagnosed, and alerted in real time? |

---

## 2. Project Tiers & Right-Sizing Matrix
- **T0 Prototype:** Proof-of-concept, demo, single user, ephemeral or non-critical data.
- **T1 Production:** Active users, business data, strict requirements for reliability and security.
- **T2 Scale:** High concurrency, distributed load, stringent SLA/compliance constraints.

| Layer | T0 (Prototype) | T1 (Production) | T2 (Scale) |
|---|---|---|---|
| **1. Frontend** | Required (Functional) | + Accessibility (WCAG), states, responsiveness | + Performance budgets, micro-frontends |
| **2. APIs & Backend** | Required | + Schema validation, typed error shapes | + Idempotency keys, distributed queues |
| **3. Database & Storage** | Required (Local/SQLite OK) | Managed DB, versioned migrations, backups | + Read replicas, automated failover |
| **4. Auth & Permissions** | Lite (or none if internal) | Required (Role-based access, JWT/session) | + Multi-factor auth (MFA), audit trails |
| **5. Hosting & Deployment** | Local / Preview OK | Required (Staging + Prod environments) | + Multi-region active-active, zero-downtime |
| **6. Cloud & Compute** | Deferred | Required (Right-sized instances, cost caps) | + Autoscaling policies, anomaly alerting |
| **7. CI/CD & Version Control** | Git Required, CI Lite | Automated test/build gates on merge | + Staged canary releases, auto-rollback |
| **8. Security & RLS** | Secrets ignored, basic hygiene | RLS enabled, least privilege, dependency audits | + Threat modeling, penetration testing |
| **9. Rate Limiting** | Deferred | Required on public & compute-heavy routes | + Distributed token-bucket, bot challenge |
| **10. Caching & CDN** | Deferred | Lite (CDN for hashed static assets) | + Multi-tier caching, fine-grained invalidation |
| **11. Load Balancing & Scaling**| Deferred | Lite (Platform-managed scaling) | Required (Reverse proxy, connection pooling) |
| **12. Error Tracking & Logs** | Lite (Structured logs + `progress.md`) | Error tracking tool + human-routed alerts | + SLOs, distributed tracing, runbooks |

**Deferral Rule:** Any Deferred layer must include a concrete revisit trigger (e.g., *"Rate Limiting deferred until public launch or > 500 requests/min"*).

---

## 3. Layer Decision Table Template
Copy this table into `findings.md` during Phase 1 (Specification):

```markdown
| Layer | Status (Required / Lite / Deferred) | Selected Tech | Rationale | Revisit Trigger |
|---|---|---|---|---|
| 1 Frontend | | | | |
| 2 APIs & Backend | | | | |
| 3 Database & Storage | | | | |
| 4 Auth & Permissions | | | | |
| 5 Hosting & Deployment | | | | |
| 6 Cloud & Compute | | | | |
| 7 CI/CD & Version Control | | | | |
| 8 Security & RLS | | | | |
| 9 Rate Limiting | | | | |
| 10 Caching & CDN | | | | |
| 11 Load Balancing & Scaling | | | | |
| 12 Error Tracking & Logs | | | | |
```

---

## 4. Build Standards by Layer
- **Frontend:** Implement 5 UI states (loading, empty, success, error, partial failure). Ensure full keyboard navigation, visible `:focus-visible` styling, and zero secrets leaked in client bundles. Visual tokens must strictly derive from `DESIGN.md`.
- **APIs & Backend:** Validate all input boundaries with schemas (e.g. Zod, Pydantic). Provide consistent error payloads with machine-readable error codes. Ensure mutating operations are idempotent.
- **Database & Storage:** Apply all schema changes via ordered, reversible migrations. Index foreign keys and queried attributes. Verify automated database backups and practice at least one restore (T1+).
- **Auth & Permissions:** Use standardized, vetted auth providers. Enforce authorization checks on the server for every protected route. Never trust client claims.
- **Security & RLS:** Implement Row-Level Security (RLS) on all user-owned records with default-deny policies. Ensure database views execute with `security_invoker`. Run dependency audit scans prior to deployment.
- **Rate Limiting:** Protect public authentication, AI inference, and search endpoints. Return HTTP 429 with `Retry-After` headers. Roll out in dry-run/logging mode before enforcing.
- **Caching & CDN:** Leverage immutable caching for content-hashed assets (`max-age=31536000`). Never cache authenticated API endpoints or private user sessions in shared/public caches.
- **Hosting & CI/CD:** Deploy exclusively via Git pushes through CI pipelines. Maintain strict separation between dev, staging, and production credentials. Test rollbacks.
- **Scaling & Compute:** Set budget limits and instance ceilings. Configure health probes (`/healthz/live`, `/healthz/ready`) and ensure graceful shutdown handling.
- **Observability:** Emit structured JSON logs with correlation IDs, timestamps, and error stacks. Route critical alerts to actionable notification channels.

---

## 5. Layer → Skill / Tool Map
| Layer | Recommended Skills & Tools |
|---|---|
| **1 Frontend** | `/impeccable`, `/frontend-design`, `/web-design-guidelines`, `/vercel-react-best-practices`, `/browser` |
| **2 APIs & Backend** | context7 MCP (live documentation lookup) |
| **3, 4, 8 DB, Auth, Security** | `/supabase` skill + Supabase MCP (when Supabase is chosen) |
| **Payments (within 2 & 8)** | `/stripe-best-practices` |
| **7 CI/CD & Version Control** | Native git worktree tools; GitHub MCP (scoped, narrow toolsets) |
| **12 Observability** | `/systematic-debugging` for root-cause diagnosis; Sentry/Datadog for prod |
| **All Layers** | `/verification-before-completion` before marking any slice complete |
