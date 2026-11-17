# Skills, MCP Integrations, and Agent Safety

## Contents
1. Architectural Division of Labor
2. Skill Inventory (Built-ins, Core, UI, Conditional, Budget)
3. MCP Server Inventory
4. Platform Packs (by Layer)
5. Recon Tools
6. Prohibited & High-Risk Tools
7. Design Skill Overlap Rules
8. Vetting Checklist for External Capabilities
9. Agent Permission Posture & Sandbox Controls
10. Operational Gotchas & Platform Compatibility

---

## 1. Architectural Division of Labor
The S.C.O.P.E. framework governs the **lifecycle process** (phases, decision gates, law documents). Specialized skills and MCP tools are **tactical procedures** invoked during individual phases.

*Precedence Rule:* No skill or MCP prompt overrides root `AGENTS.md` or S.C.O.P.E. gates. When conflicts arise, follow `AGENTS.md` and log the rationale in `findings.md`.

*Deployment Rule (applies everywhere):* Deploy only **committed code** through the platform's Git integration, a CI runner, or the platform's official CLI (CLI commands stay on **Ask**). Never deploy via raw workspace uploads or file-upload MCP tools.

---

## 2. Skill Inventory
Every skill or command referenced by `SKILL.md`, `stack-matrix.md`, or `AGENTS.md` appears in this section.

### 2a. Built-in Commands (Zero Install)
These ship with the agent runtime and do not count toward the skill budget.

| Command | Job | Phase |
|---|---|---|
| `/skills`, `/hooks`, `/mcp` | Verify loaded skills, hooks, and MCP servers | 0, 2 |
| `/grill-me` | Structured discovery interview | 1 |
| `/plan` | Step-by-step planning before execution | 1 |
| `/browser` | Isolated browser: recon, viewport checks, console logs, staging smoke tests | 1, 3, 4, 5 |
| `/learn` | Persist session learnings and project adjustments | 5 |

### 2b. Universal Core Skills
| Skill | Job | Phase |
|---|---|---|
| `scope` | The overarching lifecycle and gating protocol | All |
| `verification-before-completion` | Fresh test evidence before claiming completion | 3, all slices |
| `systematic-debugging` | Multi-phase root-cause investigation; powers self-annealing | 3, on errors |

### 2c. Frontend & UI Skills (UI projects only)
| Skill | Job | Phase |
|---|---|---|
| `frontend-design` | One-time aesthetic direction: palette, type, wireframes | 1 |
| `impeccable` | `PRODUCT.md`/`DESIGN.md` (`/impeccable init`), steering, polish, critique, anti-slop audit | 1, 4 |
| `web-design-guidelines` | Accessibility (WCAG 2.1 AA), semantic markup, UX audits | 4 |
| `vercel-react-best-practices` | React/Next.js performance and hydration rules | 3, 4 |

### 2d. Conditional Skills (only when chosen in the Layer Decision Table)
| Skill | Condition | Layers |
|---|---|---|
| `supabase` (+ Supabase MCP) | Supabase is the backend | 3, 4, 8 |
| `stripe-best-practices` | Payments are in scope | 2, 8 |

### 2e. Skill Budget
- **Core budget:** at most **8** skills from 2b + 2c + 2d combined (built-in commands and MCP servers do not count).
- **Platform packs (Section 4):** each chosen platform adds at most 1–2 skills.
- **Hard ceiling:** about **12 active skills** per project. A new skill must replace or clearly beat an existing one.

---

## 3. MCP Server Inventory
MCP servers are listed here with their posture. Keys never appear in committed configs (see Section 10).

| Server | When | Posture |
|---|---|---|
| **context7** | Phases 2–3, before any library/SDK call | Keyless in workspace config; optional token only in global config. Remote URL (see pinning exception, Section 8). |
| **Playwright MCP** | Optional T1+, repeatable E2E and cache-behavior tests | Pinned (`@playwright/mcp@<version>`); `browser_run_code_unsafe` disabled. |
| **GitHub MCP** | Phase 3/5, CI and PR work | Narrow toolsets only; fine-grained token scoped to the repo. |
| **Supabase MCP** | When Supabase is selected | Point at local CLI/dev project; never hold the service-role key. |
| **Sentry / Datadog MCP** | Phase 5, observability triage | Read-only tokens; production telemetry read access only. |
| **Render / Cloudflare / Arcjet / Upstash / Redis MCP** | Only if that platform is chosen (Section 4) | Phase 5 or scoped tasks only, read-only, disconnected afterward. |
| **Terraform / Cloud Run / AWS / Kubernetes MCP** | T2 or explicit need (Section 4) | Read-only modes; destructive and deploy tools denied or on Ask. |

Infrastructure MCP servers connect **only in Phase 5**, read-only, and are removed afterward. Never connect them during recon.

---

## 4. Platform Packs (Install selectively based on Layer Decision Table)
Install only the specific skill required for your chosen stack; never install a vendor's whole catalog. Re-check names and versions against the vendor's repository before installing.

| Layer | Platform | Target Skill / MCP | Guardrails & Best Practices |
|---|---|---|---|
| 5 | **Vercel** | Git integration; optional `vercel-optimize` (T1+) | Never `deploy-to-vercel` (Section 6). Deploy via Git. |
| 5 | **Render** | 1–3 individual skills from `render-oss/skills` + Render MCP | Keep `approve_blueprint` on Ask. |
| 5, 6 | **Railway** | `use-railway` CLI skill | CLI deploys from committed code only; CLI on Ask. |
| 5 | **Fly.io** | `fly` skill (`superfly/skills`) | Pin version; CLI deploys from committed code only; CLI on Ask. |
| 6 | **Cloudflare Workers** | `wrangler` + `workers-best-practices` | Deploy via `wrangler` CLI (on Ask) from committed code or CI; MCP strictly read-only telemetry on a non-production account. |
| 6 | **GCP Cloud Run** | `cloud-run-mcp` ≥ v1.11.0, pinned | Deploy tools on Ask; `deploy-local-folder` denied; set max instances and billing cap. |
| 6 | **AWS** (T2) | `awslabs` servers with `READ_OPERATIONS_ONLY="true"` | Read-only IAM role. |
| 6 | **IaC (Terraform)** (T2) | `hashicorp/terraform-mcp-server` (registry toolset) | Pinned; operational writes and destroy denied; `plan` before `apply`. |
| 3, 4, 8 | **Supabase** | `supabase` skill + Supabase MCP | Use local CLI emulation for testing; protect service-role keys. |
| 2, 8 | **Stripe** | `stripe-best-practices` | Restrict tests to Stripe sandbox environments. |
| 9 | **Rate Limiting** | Choose **one**: `upstash-ratelimit-js` or `arcjet` skill + MCP | Dry-run first; `promote-rule` on Ask; promote with user approval. |
| 10 | **Redis** | `redis-best-practices` | MCPs read-only ACL user, never production; `SCAN` instead of `KEYS *`. |
| 10 | **Next.js caching** (16.3+) | Vercel Next.js cache-components skills | Only when Next.js is in stack. |
| 10, 11 | **CDN headers, probes, pooling** | No skill: `caching-and-scaling.md` | — |
| 11 | **Scaling** | The platform's own scaling skill; Kubernetes only at T2 (`containers/kubernetes-mcp-server`, non-destructive toolsets) | Never connect write-enabled cluster tools during normal work. |
| 12 | **Observability** | Sentry/Datadog (+ read-only MCP) | Test event before Gate 2. |

---

## 5. Recon Tools
- **Core:** built-in `/browser` in an isolated profile.
- **Optional:** local design-token extractors (e.g. `designlang`), only after passing Section 8, outputting to `.tmp/recon/`.
- **Prohibited:** hosted scraping proxies, stealth/login-bypass modes, unvetted browser extensions. Full rules live in `recon.md`.

---

## 6. Prohibited & High-Risk Tools
- **Workspace-Upload Deployment** (e.g. `deploy-to-vercel`, inline file-upload MCP deploy tools, `cloud-run` `deploy-local-folder`): Bypasses source control, exposes untracked files, and fails on binary assets.
- **Unvetted Catalog Mega-Bundles**: Installing whole vendor catalogs or "awesome" bundles floods context windows and degrades model accuracy.
- **Stealth Browsers & Anti-Bot Bypasses**: Never use tools designed to crack CAPTCHAs, bypass paywalls or logins, or spoof fingerprints.
- **Write-Enabled Cluster Tools in Production**: Kubernetes or cloud admin MCPs with live mutating rights must never be connected during standard development.
- **Deprecated or Unmaintained Tools**: Avoid abandoned MCPs, vulnerable versions (e.g. `cloud-run-mcp` < v1.11.0), or tools that run unbounded scans (`KEYS *`).
- **Duplicate Planning Systems**: Skills that replace Specification (e.g. separate spec-driven or brainstorming planners) create a second source of truth.

---

## 7. Design Skill Overlap Rules
- `DESIGN.md` is the single source of visual tokens. Output from `frontend-design` and recon extraction is merged into it, never kept as a second design file.
- `frontend-design` runs once in Phase 1; `impeccable` steers and polishes afterward; `web-design-guidelines` audits.
- Aesthetic steering does not prove accessibility: verify real contrast ratios and keyboard behavior.

---

## 8. Vetting Checklist for External Capabilities
Before installing any new agent skill, package, or MCP server:
1. **Provenance:** Verify official vendor backing or active, reputable open-source maintainers. Read open security issues.
2. **Code Audit:** Inspect `SKILL.md` and associated scripts. Flag arbitrary network requests, file-upload handlers, `git add .`, writes outside the workspace, or MCP auto-approval settings.
3. **Execution Purity:** Reject skills that download instructions dynamically at runtime without pinning.
4. **Pinning:** Pin package versions, Docker tags, and commit hashes. Never depend on `@latest` or untagged images.
   - *Remote MCP exception:* Hosted HTTP MCP servers (e.g. context7) cannot be version-pinned. Allow only official vendor endpoints, prefer keyless or read-only access, restrict tools via `enabledTools`/`disabledTools`, and record the endpoint in `architecture/decisions.md`.
5. **License & Size:** Confirm OSI-compliant licensing; verify `SKILL.md` is concise (< 500 lines).
6. **Package Reality Check:** Confirm the package exists on its registry (age, downloads, linked repo); hallucinated package names are an attack route.
7. **Documentation:** Record the vetted dependency (source URL, version/commit, job) in `architecture/decisions.md`.
8. **User Consent:** Always request explicit user approval before installing third-party extensions.

---

## 9. Agent Permission Posture & Sandbox Controls
- **Operating Mode:** Run with OS terminal sandboxing enabled. Never activate unrestricted/turbo modes when external network access or infrastructure MCPs are reachable.
- **Precedence Hierarchy:** `Deny` > `Ask` > `Allow` (templates in `config-templates.md`).
  - *Hard Deny:* `rm -rf`, `sudo`, arbitrary `curl`, infrastructure destroy commands, upload-based deploy tools, reading/writing `.env`, modifying `.git/` internals, `.ssh`.
  - *Require Approval (Ask):* Package installations, unsandboxed executions, git pushes, platform CLIs (`vercel`, `railway`, `wrangler`, `render`, `fly`, `gcloud`, `terraform`, `pulumi`), blueprint approvals, rate-limit rule promotion.
  - *Safe Allow:* Local read operations, unit test runs, linter invocations, typechecks.
- **Credentials:** Read-only by default; grant write only for a specific task. Set spend caps and max instance counts on every platform.
- **Browser Isolation:** Keep `/browser` sessions in a separate profile with no logins, personal sessions, or sensitive credentials.

---

## 10. Operational Gotchas & Platform Compatibility
- **Rule Frontmatter:** In Antigravity, `.agents/rules/*.md` files require valid snake_case `trigger:` frontmatter (`always_on`, `model_decision`, `glob`, `manual`). Unrecognized triggers are ignored. Root `AGENTS.md` takes no frontmatter.
- **Nesting Limits:** Skills are discovered one level deep: `skills/<name>/SKILL.md`.
- **Cross-Platform Tooling:** Hooks in Antigravity use native tool names (`run_command`, `write_file`, etc.), whereas Claude Code relies on its own tool nomenclature (`Bash`, `Edit`, `Write`). Check imported skills for hard-coded `.claude/` paths.
- **Secret Separation:** Workspace configs (`.agents/mcp_config.json`) are committed to version control and must remain completely secret-free (no keys in headers or args). Personal API keys belong solely in global user configuration files.
