# Skills, MCP Integrations, and Agent Safety

## Contents
1. Architectural Division of Labor
2. Skill Inventory (Built-ins, Core, UI, Conditional, Skill Count)
3. MCP Server Inventory
4. Platform Packs (by Layer)
5. Prohibited & High-Risk Tools
6. Vetting Checklist for External Capabilities
7. Agent Permission Posture & Sandbox Controls
8. Operational Gotchas & Platform Compatibility

---

## 1. Architectural Division of Labor
The S.C.O.P.E. framework governs the **lifecycle process** (phase boundaries, checkpoints, decision gates, law documents). Specialized skills and MCP tools are **tactical procedures** invoked during individual phases—**each phase's loaded skills author the detailed tactical plan and execution steps inside that phase**.

*Precedence Rule:* No skill or MCP prompt overrides root `AGENTS.md` or S.C.O.P.E. gates. When conflicts arise, follow `AGENTS.md` and log the rationale in `findings.md`.

*Deploy Rule:* Deploy only committed code, through Git (the platform's Git integration or CI) or the platform's own CLI with the user's approval. Before any CLI deploy: `git status` is clean, ignore files (`.gitignore` and the platform's ignore file) are verified to exclude secrets, and staging or preview comes first. Never use tools that upload a local folder or file contents as tool arguments (for example `deploy-to-vercel`, `cloud-run/deploy-local-folder`, or inline MCP file deploys).

---

## 2. Skill Inventory
Every skill, slash command, and MCP server referenced by `SKILL.md`, `templates/AGENTS.template.md`, `references/stack-matrix.md`, `references/recon.md`, `references/caching-and-scaling.md`, or `references/config-templates.md` is inventoried here (Sections 2–4).

- **Slash commands (`/name`):** Built-in UI/CLI shortcuts (Section 2a).
- **Skills (`name`):** `SKILL.md` packages (Sections 2b–2d and Section 4). Activate them by calling `read_file` on `<skill-dir>/SKILL.md` (under `<skills>`, `.agents/skills/`, `.claude/skills/`, `~/.gemini/config/skills/`, or `~/.claude/skills/`), never by treating them as `/slash-commands`.

### 2a. Built-in Slash Commands (Zero Install)
These ship with the agent runtime and do not count toward the skill limit.

| Command | Job | Phase |
|---|---|---|
| `/scope` | Load the S.C.O.P.E. protocol and initialize a project or feature | All |
| `/skills`, `/hooks`, `/mcp` | Verify loaded skills, hooks, and MCP servers | 0, 2 |
| `/grill-me` | Conduct structured functional & system discovery interviews | 1A |
| `/plan` | Produce a step-by-step plan before execution | 1A, 1B (and per phase) |
| `/browser` | Isolated browser for recon, viewport/console checks, and staging smoke tests | 1B, 3, 4, 5 |
| `/learn` | Persist session learnings and project adjustments | 5 |

### 2b. Universal Core Skills
| Skill | Job | Phase | Source / Install Command |
|---|---|---|---|
| `scope` | The overarching lifecycle and gating protocol | All | `npx skills add zeedan27/scope-skill --skill scope` |
| `verification-before-completion` | Require fresh test proof before claiming completion | 3, all slices | `npx skills add obra/superpowers --skill verification-before-completion` |
| `systematic-debugging` | Multi-phase root-cause investigation; powers self-annealing | 3, 5, on errors | `npx skills add obra/superpowers --skill systematic-debugging` |
| `test-driven-development` | Write failing test first (red → green → refactor) before production code (skip for T0 throwaways) | 3, all slices | `npx skills add obra/superpowers --skill test-driven-development` |
| `requesting-code-review` | Dispatch a fresh-context code reviewer against requirements and plan | 3, 5 (pre-merge / Gate 2) | `npx skills add obra/superpowers --skill requesting-code-review` |

### 2c. Frontend & UI Skills (Conditional — UI projects only)
| Skill | Condition | Job | Phase | Source / Install Command |
|---|---|---|---|---|
| `design-taste-frontend` (`taste-skill`) | UI projects (pick one: `design-taste-frontend` or `frontend-design`) | Anti-slop art direction, dealt palette/type/hero tokens (merge into `DESIGN.md`), real-browser layout/perf checker, and finish gate for websites & landing pages | 1B, 3, 4 | `npx skills add Leonxlnx/taste-skill --skill design-taste-frontend` |
| `frontend-design` | UI projects (pick one: `frontend-design` or `design-taste-frontend`) | One-time aesthetic direction for app UIs/dashboards: palette, type, wireframes (merge into `DESIGN.md`) | 1B | `npx skills add anthropics/skills --skill frontend-design` |
| `impeccable` | UI projects | `PRODUCT.md`/`DESIGN.md` setup, steering, polish, critique, anti-slop audit | 1B, 4 | `npx skills add pbakaus/impeccable --skill impeccable` |
| `web-design-guidelines` | UI projects | Accessibility (WCAG 2.1 AA), semantic markup, and UX audits | 4 | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` |
| `vercel-react-best-practices` | React/Next.js UI projects | React/Next.js performance and hydration rules | 3, 4 | `npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices` |

### 2d. Conditional & Optional Skills and Tools
| Skill / Tool | Condition | Job | Phase | Source / Install Command |
|---|---|---|---|---|
| `supabase` | Conditional: Supabase chosen (Layers 3, 4, 8) | Schema, auth, RLS, and local CLI emulation patterns | 3 | `npx skills add supabase/agent-skills --skill supabase` |
| `stripe-best-practices` | Conditional: payments in scope (Layers 2, 8) | Checkout, webhook verification, and sandbox testing | 3 | `npx skills add stripe/ai --skill stripe-best-practices` |
| `designlang` | Optional: during recon after Section 6 vetting | Local design-token extractor outputting to `.tmp/recon/` (`references/recon.md`) | 1B | Local CLI extractor (`references/recon.md`; vet per Section 6) |
| `subagent-driven-development` | Conditional: T2 scale or Phase 3 with 3+ independent vertical slices | Execute independent planned slices via isolated subagents with review gates | 3 | `npx skills add obra/superpowers --skill subagent-driven-development` |

### 2e. Skill Count Rule
Keep at most 10 core skills and about 14 skills in total (built-in slash commands and MCP servers do not count). Each chosen platform pack (Section 4) adds at most 1–2 skills, and a new skill must replace or clearly beat an existing one. Install skills individually with `--skill <name>`—never install full multi-skill bundles.

### 2f. Missing-Skill & Phase-Entry Planning Protocol — Never Improvise Alone
1. **Check local installation:** Look in your loaded `<skills>` list and local skill directories (`.agents/skills/`, `.claude/skills/`, `~/.gemini/config/skills/`, `~/.claude/skills/`).
2. **Stop and ask before bypassing:** If a skill required for the active phase or subphase (especially `design-taste-frontend` or `frontend-design` plus `impeccable` in Subphase 1B for UI projects, after Subphase 1A locks functional specs) is missing, **do not invent the design or workflow yourself**. Present the exact `npx skills add` command from Tables 2b–2d (append `-g` for global install) and ask the user whether to install it or explicitly approve skipping it.
3. **Read before designing:** Once installed (or already present), call `read_file` on its `SKILL.md` and follow its workflow before authoring `PRODUCT.md`, `DESIGN.md`, or implementation code.
4. **Plan one phase or subphase at a time from its skills:** At the start of each phase or subphase (`1A`, `1B`, and `2` through `5`), read that step's required `SKILL.md` files first, then write its detailed execution plan in `task_plan.md`. Complete the step, record proof in `progress.md`, and stop at the checkpoint/boundary before planning the next step.

---

## 3. MCP Server Inventory
Every MCP server referenced across the protocol appears here. Workspace configs must contain zero keys (see Section 8).

| Server | Condition | Job | Phase | Posture |
|---|---|---|---|---|
| `context7` | Core (docs lookup) | Live library/SDK documentation lookup | 2, 3 | Keyless in workspace config; remote HTTP MCP exception (Section 6). |
| `Playwright MCP` (`playwright`, `@playwright/mcp`) | Optional at T1+ | Repeatable E2E and Next.js cache-behavior tests | 3, 4, 5 | Exact pinned version; `browser_run_code_unsafe` disabled. |
| `GitHub MCP` | Optional (GitHub CI/PRs) | Scoped PR, issue, and CI workflow checks | 2, 3, 5 | Narrow toolsets only; fine-grained repo-scoped token. |
| `Supabase MCP` | Conditional: Supabase chosen | Local/dev schema and query inspection | 2, 3 | Point at local CLI/dev project; never expose service-role key. |
| `Stripe MCP` | Conditional: Stripe chosen | Sandbox payment and webhook inspection | 2, 3 | Sandbox environment keys only. |
| `Sentry / Datadog MCP` | Conditional: Sentry or Datadog chosen | Production error and telemetry triage | 5 | Read-only tokens; production telemetry read access only. |
| `Render MCP` | Conditional: Render chosen | Blueprint planning (`render/approve_blueprint`) & telemetry | 5 | `render/approve_blueprint` on Ask; read-only afterward. |
| `Cloudflare MCP` | Conditional: Cloudflare chosen | Worker bindings & observability telemetry | 5 | Read-only telemetry on non-production account. |
| `Arcjet MCP` | Conditional: Arcjet chosen | Rate-limit rule inspection & promotion (`arcjet/promote-rule`) | 3, 5 | Dry-run first; `arcjet/promote-rule` on Ask. |
| `Upstash MCP` | Conditional: Upstash chosen | Rate-limit / Redis key telemetry | 5 | Read-only key; disconnected after Phase 5. |
| `Redis MCP` | Conditional: Redis chosen | Local/staging key inspection (`SCAN`, never `KEYS *`) | 3, 5 | Read-only ACL user; never production. |
| `Terraform MCP` (`hashicorp/terraform-mcp-server`) | Conditional: T2 IaC chosen | Read-only provider/module registry lookup | 3, 5 | Pinned; registry toolset only; writes & destroy denied. |
| `GCP Cloud Run MCP` (`cloud-run-mcp`) | Conditional: GCP Cloud Run chosen | Service status & deployment checks | 5 | Pinned; `cloud-run/deploy-local-folder` denied (Deploy Rule). |

Infrastructure MCP servers connect **only in Phase 5**, read-only, and are disconnected afterward. Never connect them during recon.

---

## 4. Platform Packs (Install selectively based on Layer Decision Table)
Install only the specific skill required for your chosen stack; avoid mass installation of vendor catalogs. Re-check repository names and advisories before installing.

| Layer | Platform | Target Skill / MCP (Conditional) | Phase | Job & Guardrails |
|---|---|---|---|---|
| 5 | **Vercel** | Git integration; optional `vercel-optimize` (`vercel-labs/agent-skills`, T1+) | 5 | Usage & route audit; follow the Deploy Rule (Section 1). |
| 5 | **Render** | Individual skills from `render-oss/skills` + Render MCP | 5 | Blueprints & service logs; keep `render/approve_blueprint` on Ask; follow the Deploy Rule (Section 1). |
| 5, 6 | **Railway** | `use-railway` CLI skill (`railwayapp/railway-skills`) | 5 | Service management; follow the Deploy Rule (Section 1); CLI on Ask. |
| 5 | **Fly.io** | `fly` skill (`superfly/skills`) | 5 | App config & releases; pin version; follow the Deploy Rule (Section 1); CLI on Ask. |
| 6 | **Cloudflare** | `wrangler` CLI + `workers-best-practices` (`cloudflare/skills`) (+ Cloudflare MCP) | 3, 5 | Worker patterns & releases; follow the Deploy Rule (Section 1); MCP read-only telemetry. |
| 6 | **GCP Cloud Run** | `cloud-run-mcp` (+ `gcloud` CLI) | 5 | Service inspection & releases; follow the Deploy Rule (Section 1); `cloud-run/deploy-local-folder` denied; set max instances and billing cap. |
| 6 | **IaC (Terraform / Pulumi)** | `hashicorp/terraform-mcp-server` (or `pulumi` CLI, Optional) | 3, 5 | Registry lookup / IaC plans (T2); operational writes and destroys denied; `plan` before `apply`. |
| 3, 4, 8 | **Supabase** | `supabase` skill (`supabase/agent-skills`) + Supabase MCP | 2, 3 | Local CLI emulation, schema & RLS verification; protect service-role keys. |
| 2, 8 | **Stripe** | `stripe-best-practices` (`stripe/ai`) + Stripe MCP | 2, 3 | Checkout & webhook safety; restrict tests to Stripe sandbox environments. |
| 9 | **Rate Limiting** | Choose **one**: `upstash-ratelimit-js` (`upstash/skills` + Upstash MCP) or `arcjet` (+ Arcjet MCP) | 3, 5 | Endpoint throttling; dry-run first; `arcjet/promote-rule` on Ask. |
| 10 | **Redis & Caching** | `redis-best-practices` (`upstash/skills`, + optional Redis MCP); Next.js caching pointer → `references/caching-and-scaling.md` | 3, 5 | Redis TTL/key patterns (`SCAN`, never `KEYS *`). Next.js `next-cache-components` skills (Conditional: Next.js only; confirm your version) live in `references/caching-and-scaling.md` (Section 2). |
| 12 | **Observability** | Sentry / Datadog (+ read-only MCP) | 5 | Error tracking & alert routing; confirm test event before Gate 2. |

**AWS and Kubernetes:** Not in the default packs. Only on explicit need: read-only credentials or toolsets, and run the vetting checklist first.

---

## 5. Prohibited & High-Risk Tools
- **Upload-Based Deployment Tools** (e.g., `deploy-to-vercel`, `cloud-run/deploy-local-folder`, inline MCP file deploys): Violate the Deploy Rule (Section 1), bypass source control, expose untracked files, and fail on binary assets.
- **Unvetted Catalog Mega-Bundles**: Install skills individually with `--skill <name>`. Installing entire vendor catalogs or full multi-skill bundles (such as installing all of `obra/superpowers` at once) exceeds the skill limit and degrades model accuracy.
- **Stealth Browsers & Anti-Bot Bypasses**: Never use tools designed to crack CAPTCHAs, bypass paywalls or logins, or spoof fingerprints.
- **Write-Enabled Cluster Tools in Production**: Cloud admin or cluster MCPs with live mutating rights must never be connected during standard development.
- **Deprecated or Vulnerable Tools**: Avoid abandoned MCPs, versions with known security advisories, or tools that execute unbounded scans (`KEYS *`).
- **Duplicate Planning Systems**: Skills that replace Specification or `AGENTS.md` gates create a second source of truth.

---

## 6. Vetting Checklist for External Capabilities
Before installing any new agent skill, package, or MCP server:
1. **Provenance:** Verify official vendor backing or active, reputable open-source maintainers. Check open security issues.
2. **Code Audit:** Inspect `SKILL.md` and associated scripts. Flag arbitrary network requests, file-upload handlers, `git add .`, writes outside the workspace, or MCP auto-approval settings.
3. **Execution Purity:** Reject skills that download instructions dynamically at runtime without pinning.
4. **Pinning:** `npx`, `uvx`, `go install`, and Docker images must use exact pinned versions, never `@latest` or an untagged image. The exception is remote HTTP MCP servers (for example `context7`), which cannot be version-pinned. For those: use only the official vendor endpoint, put no keys in the committed workspace config, and restrict tools with `enabledTools`/`disabledTools` where possible.
5. **License & Size:** Confirm OSI-compliant licensing; verify `SKILL.md` is concise (< 500 lines).
6. **Package Reality Check:** Confirm the package exists on its registry (age, downloads, linked repo) before installing.
7. **Documentation:** Record the newly vetted dependency (source URL, version/commit, job) in `architecture/decisions.md`.
8. **User Consent:** Always request explicit user approval before installing third-party extensions.

---

## 7. Agent Permission Posture & Sandbox Controls
- **Operating Mode:** Run with OS terminal sandboxing enabled. Never activate unrestricted/turbo modes when external network access or infrastructure MCPs are reachable.
- **Precedence Hierarchy:** `Deny` > `Ask` > `Allow` (templates in `references/config-templates.md`).
  - *Hard Deny:* `rm -rf`, `sudo`, arbitrary `curl`, infrastructure destroy commands, `cloud-run/deploy-local-folder`, reading/writing `.env`, modifying `.git/` internals, `.ssh` (both Unix and Windows paths).
  - *Require Approval (Ask):* Package installations, unsandboxed executions, `git push`, platform CLIs (`vercel`, `railway`, `wrangler`, `render`, `fly`, `gcloud`, `terraform`, `pulumi`), `render/approve_blueprint`, `arcjet/promote-rule`.
  - *Safe Allow:* Local read operations, unit test runs, linter invocations, typechecks.
- **Browser Isolation:** Keep `/browser` sessions strictly isolated from user accounts, personal sessions, and sensitive credentials.

---

## 8. Operational Gotchas & Platform Compatibility
- **Rule Frontmatter:** In Antigravity, `.agents/rules/*.md` files require valid snake_case `trigger:` frontmatter (`always_on`, `model_decision`, `glob`, `manual`). Unrecognized triggers are ignored. Root `AGENTS.md` takes no frontmatter.
- **Nesting Limits:** Skills are discovered one level deep: `skills/<name>/SKILL.md`.
- **Cross-Platform Tooling:** Hooks in Antigravity use native tool names (`run_command`, `write_file`, etc.), whereas Claude Code relies on its own tool nomenclature. Keep hook commands quoted and avoid bare `.sh` hook commands on Windows. If `design-taste-frontend` (`taste-skill`) is used on Windows, invoke its `gate.mjs` script via a quoted `node` command rather than a POSIX `for f in ...` shell hook, and ignore `.taste-skill/` in `.gitignore`.
- **Secret Separation:** Workspace configs (`.agents/mcp_config.json`) are committed to version control and must remain completely secret-free. Personal API keys belong solely in global user configuration files.
