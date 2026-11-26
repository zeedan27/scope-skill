---
name: scope
description: Runs the S.C.O.P.E. framework (Specification, Connections, Organization, Polish, Execution) to build and evolve deterministic, production-grade web apps, full-stack systems, and automations through gated phases and post-launch delta cycles. Use at the start of any new project or vibecoding session, when adding features, fixing bugs, or refining UI/performance on an existing S.C.O.P.E. repo, when transitioning between phases, when choosing a tech stack across the 12 infrastructure layers, when vetting skills/MCP tools, and before any production deployment.
---

# S.C.O.P.E. Framework (System Pilot)

This skill provides the end-to-end engineering protocol. Short, always-on rules live in the project's root `AGENTS.md` (the Constitution). If missing, generate it during Phase 0 from `templates/AGENTS.template.md`.

Always read `references/skills-and-safety.md` and `references/stack-matrix.md` during Phase 0 and Subphase 1A (before drafting any plan or exiting plan mode). At the entry of **every** phase and subphase (`1A`, `1B`, `2`–`5`), call `read_file` on that step's required skill `SKILL.md` files and reference files **before** writing its detailed plan, designing UI, or exiting plan mode:
- `references/stack-matrix.md`: The 12-layer stack, tier definitions (T0/T1/T2), and layer build standards.
- `references/skills-and-safety.md`: Built-in commands, skill & MCP inventory, platform packs, skill count rule, strict vetting checklist, and permission posture.
- `references/config-templates.md`: Settings, hooks, MCP configs, git secret scanning, and UI rule templates.
- `references/caching-and-scaling.md`: Cache-control headers, HTTP security headers, Redis patterns, rate-limit rollouts, probes, and autoscaling.
- `references/ai-and-agents.md`: Runtime AI/LLM and embedded-agent guardrails, tool boundaries, spend caps, and baseline evals (conditional: AI features only).
- `references/recon.md`: Safe inspection of existing sites (authorization tiers, safety rules, cleanroom recreation).

## Operating Principles
1. **Work & Plan Phase-by-Phase (Read Skills → Plan Phase → Execute → Stop)**: Never write a detailed implementation plan for all 5 phases upfront. Greenfield projects run Phases `0 → 5`, while already-initialized S.C.O.P.E. repos enter via **Post-Launch Continuation (`Cycle N+1`)** tracks rather than repeating Phase 0. Phase 1 executes sequentially as **Subphase 1A** (functional, stack, and schema spec + confirmation) followed—for UI projects—by **Subphase 1B** (skill-driven UI/design spec), culminating in Gate 1. At the start of each phase or subphase: (a) check required skills, ask to install missing ones from `references/skills-and-safety.md`, and call `read_file` on their `SKILL.md` files first; (b) write an elaborate plan for **only** the active step in `task_plan.md` using those loaded skills (in `/plan` mode, scope each plan handoff to a single phase or `1A`/`1B` subphase); (c) execute and verify that step; and (d) **stop at the checkpoint/boundary**, present proof in `progress.md`, and wait for user approval before advancing. Because law and memory files preserve state, start a fresh session at phase/cycle boundaries if context grows noisy, and isolate concurrent work on separate branches or worktrees.
2. **Deterministic Over Probabilistic**: LLMs reason probabilistically; business logic, schemas, and tests must be deterministic.
3. **Data-First**: Define schemas and contracts in `architecture/schemas.md` before writing executable code.
4. **Never Skip Gates or Phase Checkpoints**: Gate 1 (Phase 1), Phase 2–4 Checkpoints, and Gate 2 (Phase 5) require stopping and obtaining explicit user confirmation before advancing.
5. **No Hallucinated Business Logic**: Never invent domain requirements. Ask clarifying questions in groups.
6. **Self-Annealing**: On failure, diagnose with root-cause debugging, patch, add a regression test, and update the SOP before moving forward. Three consecutive failures trigger the Three-Strike Breaker.

---

## Phase → Skill & Tool Map
- **Skills (`name` without `/`)** are `SKILL.md` files in `<skills>`, `.agents/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md`, `~/.gemini/config/skills/<name>/SKILL.md`, or `~/.claude/skills/<name>/SKILL.md`. Activate them by calling `read_file` on their `SKILL.md`. If a required skill is not installed, **stop** and ask the user to install it using the command in `references/skills-and-safety.md` (Section 2).
- **Built-in Slash Commands (`/name` with `/`)** are runtime/UI commands (`/grill-me`, `/plan`, `/browser`, `/learn`, `/scope`, `/skills`, `/hooks`, `/mcp`).
- Keep at most 10 core skills and about 14 skills in total (built-in slash commands and MCP servers do not count). Every item below is inventoried, with its install command and guardrails, in `references/skills-and-safety.md`.

| Phase | Skills & Tools |
|---|---|
| **0. Init** | Inspect loaded `<skills>` & `<mcp_servers>` (or built-in `/skills`, `/hooks`, `/mcp`); read `references/skills-and-safety.md` |
| **1A. Functional Spec** | `/grill-me` (product, architecture & constraints discovery), `/plan`, `references/stack-matrix.md`, `references/skills-and-safety.md`, `references/ai-and-agents.md` (if AI in scope) |
| **1B. Design Spec (UI)** | *(UI projects, after 1A locks)* Read `design-taste-frontend` (`taste-skill`) or `frontend-design` + `impeccable` `SKILL.md`; `/plan`; `/browser` (recon only, `references/recon.md`) |
| **2. Connections** | `context7` MCP (docs); platform MCPs (e.g. Supabase, Stripe) if selected; GitHub MCP (scoped) |
| **3. Organization** | `context7` before library/SDK calls; read `supabase`, `stripe-best-practices` `SKILL.md` if in stack; `references/ai-and-agents.md` (if AI in scope); `test-driven-development` (red → green → refactor; skip T0 throwaways), `systematic-debugging` on errors, `verification-before-completion` & `requesting-code-review` on slices; conditional `subagent-driven-development` (T2 or 3+ independent slices) |
| **4. Polish** | Read `impeccable` (polish, critique, audit), `design-taste-frontend` (`taste-skill` browser/finish gate, if chosen), `web-design-guidelines`, and `vercel-react-best-practices` (React/Next) `SKILL.md`; `/browser` |
| **5. Execution** | `/browser` staging smoke tests; `requesting-code-review` pre-Gate 2 check; chosen platform pack; read-only infrastructure & observability MCPs; `/learn` to record session learnings |

### Skill-Skip Red Flags (STOP if you think this)
| Excuse | Reality |
|---|---|
| "User already gave colors/spec, so I'll design it myself" | Never bypass `design-taste-frontend`/`frontend-design` + `impeccable`. Read `SKILL.md` first. |
| "I'll design the UI / `DESIGN.md` alongside 1A discovery to save turns" | UI skills require locked product, surface, stack, and schema specs. Finish and confirm Subphase 1A first, then load UI skills in Subphase 1B. |
| "This task is simple / the skill is overkill" | Simple tasks drift fast. Check and read the phase's skills first. |
| "I remember how this skill works" | Skills evolve. Always call `read_file` on the current `SKILL.md`. |
| "I'll explore or write one quick file first" | Skills govern how you explore and plan. Check skills *before* acting. |
| "I'll plan all 5 phases now to save turns" | Upfront plans make later skills decorative. Plan one phase at a time. |
| "v1 shipped, so I'll patch bugs or add features ad-hoc without `/scope`" | Post-launch work routes through Continuation Tracks (Delta S.C.O.P.E., Fast-Path Anneal, or Refinement Loop) to protect `DESIGN.md`, `schemas.md`, and Gate 2. |

---

## 🟢 Phase 0: Initialization (Mandatory Setup)

*Greenfield & Brownfield/Migration init — if `AGENTS.md` and `architecture/schemas.md` already exist on an initialized repo, skip Phase 0 and jump directly to **🔄 Post-Launch Continuation (`Cycle N+1`)**.*

1. **Project Memory**: Create `task_plan.md` (phases, checklists), `findings.md` (research, constraints, Layer Decision Table), and `progress.md` (action log, test evidence). For existing non-S.C.O.P.E. repos or migrations, inspect code read-only first to reverse-populate `findings.md` (incumbent 12-layer state plus non-portable state: live DB data, user accounts, secrets, webhooks, DNS) and `architecture/schemas.md` without overwriting `.git` or valid configs.
2. **Law Documents**: Initialize `architecture/schemas.md`, `architecture/decisions.md` (ADR log), and `architecture/maintenance.md`.
3. **Constitution**: Copy `templates/AGENTS.template.md` to project root as `AGENTS.md` (no frontmatter). If using Claude Code, symlink `CLAUDE.md` to `AGENTS.md`.
4. **Hygiene**: Initialize git (`git init`). Ensure `.gitignore` excludes `.env*` (except `.env.example`), `.tmp/`, `node_modules/`, and `.worktrees/`. Create `.env.example` with variable names only.
5. **Tooling Verification**: Read `references/skills-and-safety.md`. Check your loaded `<skills>` list and local skill directories (plus `/skills` and `/mcp`). If core or UI skills required for this project are missing, present their exact `npx skills add` commands from `references/skills-and-safety.md` and ask the user to approve installing them before planning.
6. **Hard Halt**: Do not write application code in `src/` or `tools/` until Gate 1 passes.

---

## 🏗️ Phase 1: S — Specification (Vision & Logic)

Specification runs in two sequential subphases: confirm **Subphase 1A** before starting **Subphase 1B** (skip **Subphase 1B** for headless backends, CLIs, and automations).

### Subphase 1A: Functional, Stack & Data Specification
1. **Functional Discovery (`/grill-me`)**: Cover Core (North Star goal, integrations, source of truth, primary user actions/surfaces, delivery payload, behavioral "Do Not" rules) and Production (personas, roles/access, compliance, scale, budget, stack constraints). Defer visual/aesthetic questions to Subphase 1B.
2. **Tier, Layer & Skill Selection**: Propose 2–3 Tier/stack options (T0/T1/T2) with tradeoffs; decide **SSR/SSG vs. SPA** upfront whenever public search/AI answer-engine discoverability or social previews matter (preventing costly SPA → SSR migrations); fill the 12-Layer Decision Table in `findings.md` via `references/stack-matrix.md`; read `references/ai-and-agents.md` if runtime AI/agents are in scope; classify surfaces (marketing/company site, app UI/dashboard, docs, or headless); record Subphase 1B UI skills (`design-taste-frontend` vs. `frontend-design` + `impeccable`, noting framework constraints like Next.js static export) and Phase 2–5 Platform Packs (`references/skills-and-safety.md`).
3. **Data-First Modeling**: Define input/output payloads, DB entities/relations, RLS roles/permissions matrix, and API error/response contracts in `architecture/schemas.md` (right-size pure T0 static sites with no backend to static content/asset shapes only).
4. **Threat Modeling (T1+)**: Add a 1-page threat sketch in `findings.md` (critical assets, vectors, mitigations—including privilege escalation/self-role-upgrade, webhook replay/loop vectors, and prompt-injection/runaway-spend caps if AI is in scope).
5. **Phase 1A Checkpoint — Confirm Functional Spec**: Present `findings.md` and `architecture/schemas.md` and pause for user confirmation that scope, stack, and schemas are locked. Headless projects proceed to **Gate 1 Approval**; UI projects advance to **Subphase 1B**.

### Subphase 1B: Design & UI Specification (Conditional — UI Projects Only)
1. **Load UI Skills First (Never Solo)**: Never invent visual design, layout, or `DESIGN.md` solo—even when given colors, fonts, or references. Using Subphase 1A's locked surfaces, call `read_file` on `design-taste-frontend` (`taste-skill`, for websites, landing pages, portfolios, product/place sites) or `frontend-design` (for app UIs/dashboards) **and** `impeccable` `SKILL.md` (mapping per-surface skill/mode on hybrid builds). If missing, stop and ask to install via `references/skills-and-safety.md` (Section 2c).
2. **Design Brief & Optional Reconnaissance**: Ask a concise design batch for unresolved visual inputs (audience mood, brand/copy voice, existing logos/photos, aesthetic anti-patterns). For reference sites, follow `references/recon.md` authorization tiers and inspect via `/browser` without verbatim copying.
3. **Skill-Driven Visual Specification**: Grounded in Subphase 1A's locked routes and `architecture/schemas.md` shapes, run the loaded skill's planning workflow (e.g., `impeccable` `init`/surface modes for `PRODUCT.md`, plus `taste-skill`'s business classification, copy-first rules, `scripts/start.mjs`, `assets/layout/deal.mjs`, and House Rules, or `frontend-design`'s two-pass token/wireframe review). Author `PRODUCT.md`, merge all tokens into `DESIGN.md`, and record the screen-by-screen UI plan in `task_plan.md`.

### Gate 1 Approval (Macro Blueprint — Hard Stop)
Present the Macro Blueprint in `task_plan.md` (locked Subphase 1A + Subphase 1B spec + high-level Phase 2–5 placeholders; do **not** lock detailed Phase 2–5 code steps yet). Do not write `src/` or `tools/` code or exit Gate 1 until approved:
- [ ] **Subphase 1A locked**: Functional discovery, Tier (T0/T1/T2), 12-Layer Decision Table, planned skills/packs, T1+ threat sketch (`findings.md`), and right-sized schemas/contracts (`architecture/schemas.md`) confirmed.
- [ ] **Subphase 1B locked (UI projects)**: `design-taste-frontend` (`taste-skill`) or `frontend-design` **and** `impeccable` `SKILL.md` read via `read_file` and used to author `PRODUCT.md`, `DESIGN.md`, and the screen-by-screen UI plan in `task_plan.md` (or install explicitly skipped by user).

---

## ⚡ Phase 2: C — Connections (Connectivity & Credentials)

1. **Skill-First Phase 2 Plan**: Read `references/config-templates.md` and (if in stack) `supabase` / `stripe-best-practices` `SKILL.md` via `read_file` for local CLI emulator/sandbox rules (ask to install if missing). Expand Phase 2 in `task_plan.md` into a detailed connectivity and handshake plan before running handshakes.
2. **Tooling & Frontmatter**: Confirm skills, hooks, and MCP servers load properly. Ensure `.agents/rules/*.md` files have valid `trigger:` frontmatter.
3. **Secret Hygiene**: The agent must never read, print, or commit `.env` or plain-text secrets. Use environment variables exclusively. Keep keys out of committed workspace configs.
4. **Handshake Verification**: Build and execute minimal test scripts to verify:
   - Database read/write access
   - Auth provider connection
   - External APIs and webhooks
   - Remote git repository and CI pipeline
   - Error tracking and logging capture
5. **Least Privilege & Side-Effect Isolation**: Configure keys with minimum required scopes. Keep development, staging, and production keys separated. MCP keys live only in user global configuration. Pause or sandbox scheduled crons, outbound email/SMS, and live third-party webhooks in preview/staging/branch environments so non-production builds never contact real users or mutate live state.
6. **Isolated Browser**: Run `/browser` in an isolated session or profile with no personal user data or credentials.
7. **Phase 2 Checkpoint — Stop**: Record handshake results in `progress.md`, stop, and obtain user confirmation before reading Phase 3 skills and planning Phase 3.

---

## ⚙️ Phase 3: O — Organization (The 3-Layer Build)

1. **Skill-First Phase 3 Plan**: Before writing code, read `references/stack-matrix.md`, `references/caching-and-scaling.md`, `references/ai-and-agents.md` (if runtime AI/agents are in scope), and every active stack skill's `SKILL.md` (`test-driven-development`, `requesting-code-review`, `verification-before-completion`, `systematic-debugging`, `supabase`, `stripe-best-practices`, chosen Layer 6/9/10 skills, `vercel-react-best-practices`, `design-taste-frontend`, plus conditional `subagent-driven-development` when T2 or 3+ independent slices apply) via `read_file` (ask to install if missing). Expand Phase 3 in `task_plan.md` by mapping target files and responsibilities first, then breaking work into bite-sized Vertical Feature Slices (`<= 5` code files per slice) with exact interfaces, test cases, and one checkable action per step (`write failing test → verify fail → implement → verify pass → review → commit`).

Follow the 3-Layer Architecture for every feature:
- **Layer 1: Architecture (`architecture/`)**: Standard Operating Procedures (SOPs) in Markdown describing goals, inputs, logic, and error boundaries. Stack SOPs include `data.md`, `auth.md`, `security.md`, `rate-limiting.md`, `caching.md`, etc. *Rule: Update the SOP before modifying code.*
- **Layer 2: Navigation**: Agent reasoning and deterministic routing between tools and SOPs. Avoid ad-hoc multi-step jumps.
- **Layer 3: Tools & Code**: Deterministic, test-covered code. Application source lives in `src/`; ops and automation scripts live in `tools/`. Intermediates go in `.tmp/`.

### Vertical Slice Workflow
For each vertical feature slice:
1. **Scope Gate**: List all target files. If touching more than 5 code files, pause and split the slice.
2. **Docs Update**: Update the relevant SOP and `architecture/schemas.md` if data shapes or logic change.
3. **Implementation**: Follow `test-driven-development` (write failing test first, watch it fail, write minimal code to pass; skip only for T0 throwaway prototypes) and consult `context7` for current library/SDK documentation.
4. **Verification & Review**: Execute typechecks, tests, and build commands with fresh `verification-before-completion` proof, and dispatch a fresh code review via `requesting-code-review` at slice completion / Phase 3 checkpoint.
5. **UI Check (if applicable)**: Verify viewports (mobile, tablet, desktop) and console logs via `/browser`.
6. **Commit**: Append verification evidence to `progress.md` and create a small, conventional commit.

**Phase 3 Checkpoint — Stop**: Once all planned slices and tests are verified and logged in `progress.md`, stop and obtain user confirmation before reading Phase 4 skills and planning Phase 4.

---

## ✨ Phase 4: P — Polish (Refinement, UI & Quality)

1. **Skill-First Phase 4 Plan**: Call `read_file` on `impeccable`, `design-taste-frontend` (`taste-skill`, if chosen), `web-design-guidelines`, and `vercel-react-best-practices` (React/Next) `SKILL.md` files (ask to install if missing). Expand Phase 4 in `task_plan.md` into a detailed audit and remediation checklist derived from those loaded skills before modifying components.
2. **Payload & Formatting**: Refine outward-facing output formats (emails, reports, notifications, UI copy).
3. **Design Audit**: Read and apply `impeccable` `SKILL.md` (and run `design-taste-frontend`'s real-browser consistency and finish-gate checks when `taste-skill` is chosen) to steer and polish components against `DESIGN.md`. Eliminate generic AI styling (avoid random neon gradients, repetitive 3-card layouts, or uniform rounded blobs).
4. **Accessibility & UX**: Aesthetic steering does not prove accessibility—audit against `web-design-guidelines` `SKILL.md`. Verify real WCAG contrast ratios, `:focus-visible` outlines, keyboard navigability, semantic tags, and explicit form labels.
5. **State Completeness**: Ensure every view handles 5 essential states: Loading, Empty, Success, Partial Error, and Fatal Error.
6. **Framework Performance**: For React/Next.js, apply `vercel-react-best-practices` `SKILL.md`. Sanitize bundles to ensure no environment secrets leak client-side.
7. **Discoverability, Compliance & Localization (Conditional)**: On public/marketing surfaces, verify `<title>`, favicon, Open Graph metadata, `robots.txt`, and `sitemap.xml`; when user accounts or personal data exist, verify privacy/terms pages and an in-app account + data deletion path; when i18n is in scope, translate target locales **only after base-language copy freezes**, verifying RTL layout and locale date/number/currency formatting.
8. **Phase 4 Checkpoint & User Review — Stop**: Demonstrate working flows and audit passes via `/browser` or screenshots, log proof in `progress.md`, and stop for explicit user sign-off before reading Phase 5 skills and planning Phase 5.

---

## 🛰️ Phase 5: E — Execution (Deployment, CI/CD & Production Gate)

### Production Readiness Gate (Gate 2)
Do not deploy until all items are validated and logged in `progress.md`, or explicitly marked Deferred in the Layer Decision Table:
- [ ] Local and CI builds, typechecks, and tests pass with fresh evidence.
- [ ] Secret scan passes (e.g. gitleaks); no secrets in git history, configs, or captures; `.env.example` is complete.
- [ ] Authentication verified per role: server-derived session identity, negative (unauthorized) access tests, no self-role elevation, and OAuth apps out of provider testing-mode caps.
- [ ] Row-Level Security (RLS) **and field-level projection** verified: User A cannot read or modify User B's records, and shared/public responses strip private fields.
- [ ] Server-authoritative pricing/entitlements, webhook signature/replay/loop guards, and HTTP security headers (`HSTS`, clickjacking `CSP` / `X-Frame-Options`, `Permissions-Policy`, `HttpOnly`/`Secure` cookies) verified; zero open Critical findings (any waived lower-severity finding logged as Accepted Risk in `architecture/decisions.md`).
- [ ] Rate limiting active on sensitive/public endpoints (dry-run validated first).
- [ ] Preview/branch crons and outbound messaging isolated from production; runtime AI guardrails, two-tier spend/step caps, and baseline + refusal evals verified (`references/ai-and-agents.md`, if AI in scope).
- [ ] Database migrations execute cleanly; backup verified (T1+).
- [ ] Dependency security audit clean.
- [ ] Structured logging and error tracker verified with a test event.
- [ ] Health and readiness endpoints (`/healthz/live`, `/healthz/ready`, and `/healthz/startup` if startup is slow) verified.
- [ ] Documented rollback procedure verified.
- [ ] Cost caps and budget alerts set (T1+).
- [ ] Staging smoke test passed via `/browser` using **Steps → Explicit Success Criteria → Cleanup** across dedicated test accounts/roles (signed-out + multi-user/role handoff; distinguish Assertion Failures from Execution Errors in `progress.md`).
- [ ] Final code review completed via `requesting-code-review` (T1+).
- [ ] Deployment follows the Deploy Rule (Execution Step 2): `git status` is clean, `.gitignore` and platform ignore files exclude secrets, and staging/preview comes first.

### Execution Steps
1. **Skill-First Phase 5 Plan**: Call `read_file` on `references/caching-and-scaling.md`, `references/skills-and-safety.md` (Deploy Rule), and the chosen Layer 5/6 Platform Pack `SKILL.md` (ask to install if missing), and expand Phase 5 in `task_plan.md` with the platform-specific release, Gate 2 verification, and rollback plan before running Gate 2 or deploying.
2. **Deploy Rule**: Deploy only committed code, through Git (the platform's Git integration or CI) or the platform's own CLI with the user's approval. Before any CLI deploy: `git status` is clean, ignore files (`.gitignore` and the platform's ignore file) are verified to exclude secrets, and staging or preview comes first. Never use tools that upload a local folder or file contents as tool arguments (for example `deploy-to-vercel`, `cloud-run/deploy-local-folder`, or inline MCP file deploys). Connect infrastructure MCPs only for this phase in read-only mode, and disconnect immediately after.
3. **CI/CD Enforcement**: Merges must require green automated checks on feature branches.
4. **Resilience & Scaling**: Configure CDN caching headers, load-balancer health probes, and connection pooling (see `references/caching-and-scaling.md`).
5. **Maintenance & Handoff**: Finalize `architecture/maintenance.md` with operational runbooks, rollback steps, secret rotation guides, and revisit triggers for Deferred layers. Run `/learn` to store project adjustments.

---

## 🛠️ Definition of Done
1. Final payload is live in production/staging or delivered as specified.
2. Gate 2 checklist is fully satisfied with recorded evidence in `progress.md`.
3. Every layer in the Layer Decision Table has an explicit status and justified revisit trigger.
4. Root `AGENTS.md`, SOPs, and `architecture/maintenance.md` accurately mirror production reality.
5. Clean verification outputs are documented, and the user has signed off.

---

## 🔄 Post-Launch Continuation (Cycle N+1 — Evolution, Fixes & Polish)

Use this path whenever `AGENTS.md` and `architecture/schemas.md` already exist. Never restart Phase 0 or re-deal an existing `DESIGN.md` unless explicitly asked for a visual redesign.

### 1. Context Sync & Cycle Rollover (Mandatory Entry)
1. **Sync State**: Read `AGENTS.md`, `findings.md`, `architecture/schemas.md`, `PRODUCT.md`/`DESIGN.md` (if UI), `task_plan.md`, `progress.md`, and `git log -5`.
2. **Check Revisit Triggers**: Review every `Deferred` layer in `findings.md`; promote any triggered layer into the new cycle's scope.
3. **Archive Completed Cycles**: When starting a new cycle after Phase 5, move the finished `task_plan.md` checklist and verbose prior-cycle logs from `progress.md` into `architecture/archive/cycle-<NN>.md`, keep a concise milestone summary in `progress.md`, and reset `task_plan.md` and `AGENTS.md` (`Current Cycle & Phase`) for `Cycle <N+1>`. Evergreen law docs (`AGENTS.md`, `findings.md`, `architecture/*`, `PRODUCT.md`, `DESIGN.md`) are updated in place—never duplicated.

### 2. Continuation Track Router
| Post-Launch Need | Track | Path Through S.C.O.P.E. |
|---|---|---|
| **New feature, integration, or layer promotion** | **Track A: Delta S.C.O.P.E.** | **Delta 1A** (scoped `/grill-me` on delta only; update `findings.md` & `architecture/schemas.md`; confirm **Phase 1A Checkpoint**) → **Delta 1B** *(UI only: read `impeccable` + `design-taste-frontend`/`frontend-design` `SKILL.md`; extend screens strictly within existing `DESIGN.md` tokens & voice—never re-deal palette/type)* → **Gate 1 Approval** → **Phase 2** *only if adding a new external service, webhook, MCP, or secret* (else skip) → **Phase 3 → Phase 4** (touched/new views) **→ Phase 5**. |
| **Bugfix, regression, or missed edge case** | **Track B: Fast-Path Anneal** | If the fix requires changing DB schemas, roles/RLS, or product rules, **stop, ask the user, and escalate to Track A**. Otherwise skip Phases 1–2: read `systematic-debugging` `SKILL.md` for root cause → update the relevant SOP in `architecture/` for the missed invariant → **Phase 3** vertical slice (`test-driven-development`: write failing regression test first → minimal fix → `verification-before-completion` + `requesting-code-review`) → `/browser` verification if UI touched → **Phase 5** regression suite & Deploy Rule. |
| **UI, UX, copy, a11y, perf, or visual redesign** | **Track C: Refinement Loop** | *Preserve look (default):* enter at **Phase 4** (read `impeccable`, `web-design-guidelines`, `vercel-react-best-practices`, or `design-taste-frontend` `SKILL.md`; plan audit checklist in `task_plan.md`; apply against incumbent `DESIGN.md`; stop at **Phase 4 Checkpoint**) → **Phase 5**. *Full visual redesign (explicit user request only):* enter at **Subphase 1B** (replace `DESIGN.md` world via loaded UI skills + **Gate 1 Approval**) → **Phase 3/4 → Phase 5**. |

---

## 📂 Target Project File Structure
```plaintext
├── AGENTS.md              # Project Constitution (concise, always-on)
├── task_plan.md           # Active cycle phases, goals, checklists, task state
├── findings.md            # Research notes, Layer Decision Table, threat model
├── progress.md            # Activity log, test runs, verification evidence
├── PRODUCT.md / DESIGN.md # Product brief and visual tokens (single source of truth)
├── .env / .env.example    # Local secrets (ignored) / Template names (committed)
├── architecture/          # SOPs (data.md, auth.md, etc.), schemas.md, decisions.md, maintenance.md, archive/
├── src/                   # Core application source code
├── tools/                 # Operational and automation scripts
├── tests/                 # Unit, integration, and E2E test suites
├── .agents/               # skills/, rules/, hooks.json, mcp_config.json
├── .github/workflows/     # CI/CD pipelines
└── .tmp/                  # Scratch files, test outputs, recon captures (ignored)
```
