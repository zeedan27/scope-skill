---
name: scope
description: Runs the S.C.O.P.E. framework (Specification, Connections, Organization, Polish, Execution) to build deterministic, production-grade web apps, full-stack systems, and automations through gated phases. Use at the start of any new project or vibecoding session, when transitioning between phases, when choosing a tech stack across the 12 infrastructure layers, when vetting skills/MCP tools, and before any production deployment.
---

# S.C.O.P.E. Framework (System Pilot)

This skill provides the end-to-end engineering protocol. Short, always-on rules live in the project's root `AGENTS.md` (the Constitution). If missing, generate it during Phase 0 from `templates/AGENTS.template.md`.

Read supporting references only when prompted by a specific phase:
- `references/stack-matrix.md`: The 12-layer stack, tier definitions (T0/T1/T2), and layer build standards.
- `references/skills-and-safety.md`: Skill/MCP inventory, platform packs, strict vetting checklist, and permission posture.
- `references/config-templates.md`: Settings, hooks, MCP configs, git secret scanning, and UI rule templates.
- `references/caching-and-scaling.md`: Cache-control headers, Redis patterns, rate-limit rollouts, probes, and autoscaling.
- `references/recon.md`: Safe inspection of existing sites (authorization tiers, safety rules, cleanroom recreation).

## Operating Principles
1. **Work Phase-by-Phase**: Declare your active phase and intended deliverables at the start of each turn.
2. **Deterministic Over Probabilistic**: LLMs reason probabilistically; business logic, schemas, and tests must be deterministic.
3. **Data-First**: Define schemas and contracts in `architecture/schemas.md` before writing executable code.
4. **Never Skip Gates**: Gate 1 (Blueprint Approval) and Gate 2 (Production Readiness) require explicit user sign-off.
5. **No Hallucinated Business Logic**: Never invent domain requirements. Ask clarifying questions in groups.
6. **Self-Annealing**: On failure, diagnose with root-cause debugging, patch, add a regression test, and update the SOP before moving forward. Three consecutive failures trigger the Three-Strike Breaker.

---

## Phase → Skill & Tool Map
Invoke specialized skills by name when needed; autonomous discovery can be unreliable.

| Phase | Skills & Tools |
|---|---|
| **0. Init** | Built-in `/skills`, `/hooks`, `/mcp` to verify runtime configuration |
| **1. Specification** | `/grill-me` (discovery), `/plan`, `/frontend-design` & `/impeccable init` (UI projects), `/browser` (recon only) |
| **2. Connections** | context7 MCP (docs); platform MCPs (e.g. Supabase, Stripe) if selected |
| **3. Organization** | context7 before library/SDK calls; `/supabase`, `/stripe-best-practices` if in stack; `/systematic-debugging` on errors; `/verification-before-completion` on slice completion |
| **4. Polish** | `/impeccable` (polish, critique, audit), `/web-design-guidelines`, `/vercel-react-best-practices` (React/Next), `/browser` |
| **5. Execution** | `/browser` staging smoke tests; read-only infrastructure MCPs; `/learn` to record session learnings |

---

## 🟢 Phase 0: Initialization (Mandatory Setup)

1. **Project Memory**: Create `task_plan.md` (phases, checklists), `findings.md` (research, constraints, Layer Decision Table), and `progress.md` (action log, test evidence).
2. **Law Documents**: Initialize `architecture/schemas.md`, `architecture/decisions.md` (ADR log), and `architecture/maintenance.md`.
3. **Constitution**: Copy `templates/AGENTS.template.md` to project root as `AGENTS.md` (no frontmatter). If using Claude Code, symlink `CLAUDE.md` to `AGENTS.md`.
4. **Hygiene**: Initialize git (`git init`). Ensure `.gitignore` excludes `.env*` (except `.env.example`), `.tmp/`, `node_modules/`, and `.worktrees/`. Create `.env.example` with variable names only.
5. **Tooling Verification**: Run `/skills` and `/mcp`. Review `references/skills-and-safety.md`.
6. **Hard Halt**: Do not write application code in `src/` or `tools/` until Gate 1 passes.

---

## 🏗️ Phase 1: S — Specification (Vision & Logic)

1. **Discovery**: Conduct structured discovery (e.g., via `/grill-me`). Ask focused batches:
   - *Core*: North Star goal, necessary integrations, source of truth, delivery payload, behavioral "Do Not" rules.
   - *Production*: User personas, roles/access control, compliance/sensitivity, scale expectations, budget, stack constraints.
   - *Design (UI)*: Target audience, aesthetic tone, reference products, anti-patterns.
2. **Tier & Layer Selection**: Select Tier (T0 Prototype, T1 Production, T2 Scale). Complete the Layer Decision Table in `findings.md` using the template from `references/stack-matrix.md`.
3. **Data-First Modeling**: In `architecture/schemas.md`, define input/output payload shapes, database entities/relations, roles/permissions matrix (for RLS), and API response/error contracts.
4. **Visual Direction (UI)**: Initialize `PRODUCT.md` and define token palettes, type scale, and layouts in `DESIGN.md`. `DESIGN.md` is the single source of truth for visual tokens.
5. **Threat Modeling (T1+)**: Add a 1-page threat sketch in `findings.md` covering critical assets, threat vectors, and mitigations.
6. **Reconnaissance (Optional)**: If analyzing an existing reference site, consult `references/recon.md` and confirm the authorization class. Inspect layout and network flows using `/browser`. Never copy code, text, or assets verbatim.
7. **Gate 1 Approval**: Present the complete specification in `task_plan.md`. Obtain explicit user approval before writing code.

---

## ⚡ Phase 2: C — Connections (Connectivity & Credentials)

1. **Tooling & Frontmatter**: Confirm skills, hooks, and MCP servers load properly. Ensure `.agents/rules/*.md` files have valid `trigger:` frontmatter.
2. **Secret Hygiene**: The agent must never read, print, or commit `.env` or plain-text secrets. Use environment variables exclusively. Keep keys out of committed workspace configs.
3. **Handshake Verification**: Build and execute minimal test scripts to verify:
   - Database read/write access
   - Auth provider connection
   - External APIs and webhooks
   - Remote git repository and CI pipeline
   - Error tracking and logging capture
4. **Least Privilege**: Configure keys with minimum required scopes. Keep development, staging, and production keys separated. MCP keys live only in user global configuration.
5. **Isolated Browser**: Run `/browser` in an isolated session or profile with no personal user data or credentials.

---

## ⚙️ Phase 3: O — Organization (The 3-Layer Build)

Follow the 3-Layer Architecture for every feature:
- **Layer 1: Architecture (`architecture/`)**: Standard Operating Procedures (SOPs) in Markdown describing goals, inputs, logic, and error boundaries. Stack SOPs include `data.md`, `auth.md`, `security.md`, `rate-limiting.md`, `caching.md`, etc. *Rule: Update the SOP before modifying code.*
- **Layer 2: Navigation**: Agent reasoning and deterministic routing between tools and SOPs. Avoid ad-hoc multi-step jumps.
- **Layer 3: Tools & Code**: Deterministic, test-covered code. Application source lives in `src/`; ops and automation scripts live in `tools/`. Intermediates go in `.tmp/`.

### Vertical Slice Workflow
For each vertical feature slice:
1. **Scope Gate**: List all target files. If touching more than 5 code files, pause and split the slice.
2. **Docs Update**: Update the relevant SOP and `architecture/schemas.md` if data shapes or logic change.
3. **Implementation**: Consult context7 for current library/SDK documentation. Write clean, modular code with accompanying unit/integration tests.
4. **Verification**: Execute typechecks, tests, and build commands. Capture terminal output as proof.
5. **UI Check (if applicable)**: Verify viewports (mobile, tablet, desktop) and console logs via `/browser`.
6. **Commit**: Append verification evidence to `progress.md` and create a small, conventional commit.

*Reference: Consult `references/stack-matrix.md` and `references/caching-and-scaling.md` during implementation.*

---

## ✨ Phase 4: P — Polish (Refinement, UI & Quality)

1. **Payload & Formatting**: Refine outward-facing output formats (emails, reports, notifications, UI copy).
2. **Design Audit**: Audit components against `DESIGN.md`. Eliminate generic AI styling (avoid random neon gradients, repetitive 3-card layouts, or uniform rounded blobs).
3. **Accessibility & UX**: Audit with `/web-design-guidelines`. Verify WCAG contrast ratios, `:focus-visible` outlines, keyboard navigability, semantic tags, and explicit form labels.
4. **State Completeness**: Ensure every view handles 5 essential states: Loading, Empty, Success, Partial Error, and Fatal Error.
5. **Framework Performance**: For React/Next.js, adhere to `/vercel-react-best-practices`. Sanitize bundles to ensure no environment secrets leak client-side.
6. **User Review**: Demonstrate working flows via `/browser` or screenshots and receive review approval before proceeding to deployment.

---

## 🛰️ Phase 5: E — Execution (Deployment, CI/CD & Production Gate)

### Production Readiness Gate (Gate 2)
Do not deploy until all items are validated and logged in `progress.md`, or explicitly marked Deferred in the Layer Decision Table:
- [ ] Local and CI builds, typechecks, and tests pass with fresh evidence.
- [ ] Secret scan passes (e.g. gitleaks); no secrets in git history, configs, or captures; `.env.example` is complete.
- [ ] Authentication verified per role, including negative (unauthorized) access tests.
- [ ] Row-Level Security (RLS) verified: User A cannot read or modify User B's records.
- [ ] Rate limiting active on sensitive/public endpoints (dry-run validated first).
- [ ] Database migrations execute cleanly; backup verified (T1+).
- [ ] Dependency security audit clean.
- [ ] Structured logging and error tracker verified with a test event.
- [ ] Health and readiness endpoints (`/healthz/live`, `/healthz/ready`) verified.
- [ ] Documented rollback procedure verified.
- [ ] Cost caps and budget alerts set (T1+).
- [ ] Staging smoke test passed via `/browser`.

### Execution Steps
1. **Deploy Exclusively via Git**: Push to the platform's Git integration or CI/CD runner. Never upload raw workspace archives or unauthenticated binaries. Connect infrastructure MCPs only for this phase in read-only mode, and disconnect immediately after.
2. **CI/CD Enforcement**: Merges must require green automated checks on feature branches.
3. **Resilience & Scaling**: Configure CDN caching headers, load-balancer health probes, and connection pooling (see `references/caching-and-scaling.md`).
4. **Maintenance & Handoff**: Finalize `architecture/maintenance.md` with operational runbooks, rollback steps, secret rotation guides, and revisit triggers for Deferred layers. Run `/learn` to store project adjustments.

---

## 🛠️ Definition of Done
1. Final payload is live in production/staging or delivered as specified.
2. Gate 2 checklist is fully satisfied with recorded evidence in `progress.md`.
3. Every layer in the Layer Decision Table has an explicit status and justified revisit trigger.
4. Root `AGENTS.md`, SOPs, and `architecture/maintenance.md` accurately mirror production reality.
5. Clean verification outputs are documented, and the user has signed off.

## 📂 Target Project File Structure
```plaintext
├── AGENTS.md              # Project Constitution (concise, always-on)
├── task_plan.md           # Phases, goals, checklists, task state
├── findings.md            # Research notes, Layer Decision Table, threat model
├── progress.md            # Activity log, test runs, verification evidence
├── PRODUCT.md / DESIGN.md # Product brief and visual tokens (single source of truth)
├── .env / .env.example    # Local secrets (ignored) / Template names (committed)
├── architecture/          # SOPs (data.md, auth.md, etc.) + schemas.md, decisions.md, maintenance.md
├── src/                   # Core application source code
├── tools/                 # Operational and automation scripts
├── tests/                 # Unit, integration, and E2E test suites
├── .agents/               # skills/, rules/, hooks.json, mcp_config.json
├── .github/workflows/     # CI/CD pipelines
└── .tmp/                  # Scratch files, test outputs, recon captures (ignored)
```
