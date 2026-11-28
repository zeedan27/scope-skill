# Specification Quality, Contracts, Consistency, and Convergence

Consult this reference during **Subphase 1A**, **Phase 3 Entry** (before writing application code), **Phase 3 Pre-Checkpoint**, and **Post-Launch Track A** (`Delta 1A` / `Delta Phase 3`).

---

## 1. Optional Pre-Spec Viability Triage (`Go / Needs-Clarification / Kill`)

Use this lightweight triage **only** when evaluating an unvalidated idea, comparing product bets, or deciding whether something is worth building before committing to full Phase 0 scaffolding. Skip directly to Subphase 1A when build intent is already established.

Record a compact 4-part assessment in `findings.md` (no `src/` or `tools/` scaffolding until `go`):
1. **Supporting & Opposing Evidence:** Gather concrete evidence both *for* and *against* the idea. Label uncited assumptions explicitly—assumptions are not established facts.
2. **Problem & Cost of Inaction:** Define target users, the core problem, measurable success metrics, explicit non-goals, and the cost of doing nothing.
3. **Concept Options:** Outline 2–3 concept-level approaches with rough appetite, key constraints, and trade-offs (defer implementation details to Subphase 1A/Phase 3).
4. **Decision Verdict:**
   - `go`: Proceed to Phase 0 / Subphase 1A using the recommended concept.
   - `needs-clarification`: List specific blocking unknowns to resolve before committing.
   - `kill`: Stop and preserve the recorded rationale; stopping early is a valid engineering outcome.

---

## 2. Ambiguity Scan, `[NEEDS CLARIFICATION]` & Spec Quality ("Unit Tests for English")

During Subphase 1A (and Track A Delta 1A), run a structured ambiguity scan before locking `findings.md` and `architecture/schemas.md`:

| Category | What Must Be Clear |
|---|---|
| **1. Functional Scope & Non-Goals** | Primary user goals, measurable outcomes, explicit out-of-scope items, and role/permission boundaries. |
| **2. Domain & Data Lifecycle** | Entities, identity/uniqueness invariants, state transitions, retention/deletion rules, and expected scale. |
| **3. Interaction & UX Flows** | Critical user journeys, 5 UI states (loading, empty, success, partial error, fatal error), accessibility, and i18n rules. |
| **4. Non-Functional & Quotas** | Latency/throughput targets, durability, host ToS/sleep limits, and quota-exhaustion behavior. |
| **5. Integrations & Failures** | Auth handshakes, timeouts, retries, rate limits, webhook replay/loop guards, and fallback behavior. |
| **6. Edge Cases & Abuse** | Double-submit/concurrency races, self-role elevation, malformed inputs, and AI spend/refusal bounds. |

### Bounded Clarification & Inline Markers
- Ask at most **5 targeted, high-impact questions** per grouped clarification round; skip low-impact details or questions already answered by user input/tier defaults.
- Encode confirmed answers directly into `findings.md` and `architecture/schemas.md`.
- Mark unresolved blockers inline as `[NEEDS CLARIFICATION: <specific question>]`.
- **Gate 1 Hard Rule:** Zero `[NEEDS CLARIFICATION: ...]` markers may remain at Gate 1. Resolve each in place, or move non-blocking items to `Deferred` in `findings.md` with rationale and a concrete revisit trigger.

### Spec Quality Check ("Unit Tests for English")
Before confirming the Phase 1A Checkpoint, audit the *requirements themselves* (not implementation behavior):
- Replace vague adjectives (*"fast"*, *"prominent"*, *"graceful"*, *"secure"*) with measurable thresholds or explicit Tier standards.
- Ensure error, timeout, empty, and unauthorized behaviors are specified alongside happy paths.
- State intentional policy refusals and out-of-scope rules explicitly so downstream reviews and evals do not mistake enforced boundaries for defects.

---

## 3. Observable Contract Semantics (T1/T2 Boundaries)

A payload schema alone does not define an interface contract. For T1+ APIs, webhooks, background queues, CLIs, and cross-service boundaries (skip for pure T0 prototypes), document these observable obligations in `architecture/schemas.md`:
1. **Authoritative Owner & Consumers:** Name the single authoritative owner for each boundary; consumers reference or pin agreed contract versions and never invent unagreed provider behavior.
2. **Idempotency, Retry & Timeout Semantics:** Specify idempotency keys or event deduplication rules, request timeout budgets, and safe behavior under duplicate delivery.
3. **Ordering & State-Transition Guarantees:** Define stale/out-of-order event handling and the invariant that failed mutations leave prior valid state intact.
4. **Compatibility & Rollout Order:** Prefer additive, backward-compatible changes; deploy provider support before enabling dependent consumer behavior, and verify rollback compatibility for persisted state.

---

## 4. Pre-Build Consistency Audit (Strictly Read-Only — Phase 3 Entry)

Run this **strictly read-only** audit after expanding Phase 3 Vertical Feature Slices in `task_plan.md` and **before** writing any `src/` or `tools/` code (greenfield Phase 3 and Track A):

1. **Constitution & Gate Conflicts (`CRITICAL`):** Check every planned slice against `AGENTS.md` (`Always`, `Never`, Precedence, Deploy Rule). Any conflict is automatically `CRITICAL`—adjust `task_plan.md`, never dilute `AGENTS.md`.
2. **Requirement, Schema, Threat & Screen Coverage (`HIGH`):** Verify every locked requirement and T1+ threat mitigation in `findings.md`, every entity/constrained field/RLS rule/contract guarantee in `architecture/schemas.md`, and every UI screen in `DESIGN.md`/`task_plan.md` maps to `>= 1` Phase 3 slice.
3. **Cross-Artifact Drift (`HIGH` / `MEDIUM`):** Confirm entity/field names, types, roles, routes, and chosen libraries match across all law documents and `task_plan.md`, with zero leftover `[NEEDS CLARIFICATION]` markers.
4. **Unmapped Slices (`MEDIUM`):** Flag tasks in `task_plan.md` that trace to no requirement, layer standard, or SOP (unrequested gold-plating).

Log the compact audit summary in `progress.md`. Resolve all `CRITICAL` and `HIGH` plan gaps in `task_plan.md` (or ask the user on intent conflicts) before starting Slice 1.

---

## 5. Pre-Checkpoint Convergence Audit (Append-Only — End of Phase 3)

Run this audit after all planned Phase 3 slices pass tests and **before** stopping at the **Phase 3 Checkpoint** (greenfield Phase 3 and Track A).

### Sole Source of Intent
Audit the live codebase (`src/`, `tools/`, `tests/`, migrations) against `AGENTS.md`, `findings.md`, `architecture/schemas.md`, `PRODUCT.md`/`DESIGN.md`, and `task_plan.md`. Running code is evidence, never a replacement specification: **never** rewrite specs, schemas, or `DESIGN.md`—or delete/renumber existing `task_plan.md` tasks—to excuse missing or divergent code.

### Gap Classification
- `missing`: Unbuilt requirement, constrained field, RLS policy, threat mitigation, contract guarantee, or UI screen.
- `partial`: Happy path exists, but boundary validation, error/empty states, or edge-case behavior are incomplete.
- `contradicts`: Implementation violates `AGENTS.md` (always `CRITICAL`), `architecture/schemas.md`, `DESIGN.md`, or locked business rules.
- `unrequested`: Unapproved behavior or scope creep outside the locked blueprint.

### Append-Only Resolution
- **Converged** *(zero actionable `CRITICAL`/`HIGH` gaps; any `MEDIUM`/`LOW` items resolved or logged)*: Leave `task_plan.md` unchanged, record `Converged` with checked counts in `progress.md`, and stop at the **Phase 3 Checkpoint** for user sign-off.
- **Gaps Found:** Append a new `### Phase 3 Convergence Slices` block to Phase 3 in `task_plan.md` (ordered `CRITICAL` first, each citing source doc/section + gap type), implement them through the Vertical Slice Workflow (`<= 5` files, TDD, fresh verification, review), and re-run convergence before stopping at the Phase 3 Checkpoint.
- **Intent Evolution vs. Defect:** If implementation discoveries genuinely require changing a locked requirement, schema, or rule, **stop and ask the user**. Once approved, update `findings.md`, `architecture/schemas.md`, and `architecture/decisions.md` first, then align `task_plan.md` and code.
