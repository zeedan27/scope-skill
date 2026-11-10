# Skills, MCP Integrations, and Agent Safety

## Contents
1. Architectural Division of Labor
2. Core Skill Inventory & Platform Packs
3. Prohibited & High-Risk Tools
4. Vetting Checklist for External Capabilities
5. Agent Permission Posture & Sandbox Controls
6. Operational Gotchas & Platform Compatibility

---

## 1. Architectural Division of Labor
The S.C.O.P.E. framework governs the **lifecycle process** (phases, decision gates, law documents). Specialized skills and MCP tools are **tactical procedures** invoked during individual phases. 

*Precedence Rule:* No skill or MCP prompt overrides root `AGENTS.md` or S.C.O.P.E. gates. When conflicts arise, follow `AGENTS.md` and log the rationale in `findings.md`.

---

## 2. Core Skill Inventory & Platform Packs
Maintain a lean tool surface. Keep active project skills below 8–10 to avoid token dilution and conflicting system instructions.

### Universal Core Skills
- `scope`: The overarching system lifecycle and gating protocol.
- `verification-before-completion`: Ensures test execution and fresh proof before claiming completion.
- `systematic-debugging`: Multi-phase root-cause investigation; powers self-annealing loops.

### Frontend & UI Skills
- `frontend-design`: Initial aesthetic direction, color tokens, type systems, wireframes.
- `impeccable`: Design documentation (`DESIGN.md`), component steering, anti-slop rules.
- `web-design-guidelines`: Accessibility (WCAG 2.1 AA), semantic markup, and UX audits.
- `vercel-react-best-practices`: Framework-specific performance and hydration rules (React/Next.js).

### Platform Packs (Install selectively based on Layer Decision Table)
Install only the specific skill required for your chosen stack; avoid mass installation of entire vendor catalogs.

| Platform / Layer | Target Skill / MCP | Guardrails & Best Practices |
|---|---|---|
| **Vercel** | Git deployment integration; optional `vercel-optimize` | Never use unauthenticated upload skills. Deploy via Git. |
| **Render** | Individual skills from `render-oss/skills` + Render MCP | Keep blueprint approvals on user confirmation. |
| **Railway** | `use-railway` CLI skill | Keep CLI commands in Ask-before-run mode. |
| **Fly.io** | `fly` skill (`superfly/skills`) | Pin version; keep CLI commands on Ask. |
| **Cloudflare** | `wrangler` CLI + `workers-best-practices` | Deploy via CLI; use MCP strictly for read-only telemetry. |
| **Supabase** | `supabase` skill + Supabase MCP | Use local CLI emulation for testing; protect service role keys. |
| **Stripe** | `stripe-best-practices` | Restrict tests to Stripe sandbox environments. |
| **Rate Limiting** | `upstash-ratelimit-js` or `arcjet` skill + MCP | Run rules in dry-run mode before enforcing; promote with user approval. |
| **Redis** | `redis-best-practices` | Keep MCPs read-only; use `SCAN` instead of `KEYS *`. |
| **IaC (Terraform)** | `hashicorp/terraform-mcp-server` (read-only registry) | Keep operational writes and destructive actions denied. |

---

## 3. Prohibited & High-Risk Tools
The following tools and patterns violate safety baselines:
- **Workspace-Upload Deployment Scripts** (e.g. `deploy-to-vercel`, raw workspace upload tools): Bypasses source control, exposes untracked files, and fails on binary assets. Always deploy via Git.
- **Unvetted Catalog Mega-Bundles**: Installing hundreds of skills floods context windows and degrades model accuracy.
- **Stealth Browsers & Anti-Bot Bypasses**: Never use tools designed to crack CAPTCHAs, bypass paywalls, or spoof user fingerprints.
- **Write-Enabled Cluster Tools in Production**: Kubernetes or cloud admin MCPs with live mutating rights must never be connected during standard development.
- **Deprecated or Unmaintained Tools**: Avoid abandoned MCPs or skills that execute unrestricted database scans.

---

## 4. Vetting Checklist for External Capabilities
Before installing any new agent skill, package, or MCP server:
1. **Provenance:** Verify official vendor backing or active, reputable open-source maintainers.
2. **Code Audit:** Inspect `SKILL.md` and associated scripts. Flag any arbitrary network requests, file-upload handlers, or workspace-wide scans.
3. **Execution Purity:** Reject skills that download instructions dynamically at runtime without pinning.
4. **Pinning:** Explicitly pin package versions, Docker tags, and commit hashes. Never depend on `@latest` or untagged images.
5. **License & Size:** Confirm OSI-compliant licensing; verify documentation is concise (< 500 lines).
6. **Documentation:** Record the newly vetted dependency in `architecture/decisions.md`.
7. **User Consent:** Always request explicit user approval before installing third-party extensions.

---

## 5. Agent Permission Posture & Sandbox Controls
- **Operating Mode:** Run with OS terminal sandboxing enabled. Never activate unrestricted/turbo modes when external network access or infrastructure MCPs are reachable.
- **Precedence Hierarchy:** `Deny` > `Ask` > `Allow`.
  - *Hard Deny:* `rm -rf`, `sudo`, arbitrary `curl`, infrastructure deletion commands, reading/writing `.env`, modifying `.git/` internals.
  - *Require Approval (Ask):* Package installations, unsandboxed executions, git pushes, cloud deployment commands.
  - *Safe Allow:* Local read operations, unit test runs, linter invocations, typechecks.
- **Browser Isolation:** Keep browser automation sessions strictly isolated from user accounts, personal sessions, and sensitive credentials.

---

## 6. Operational Gotchas & Platform Compatibility
- **Rule Frontmatter:** In Antigravity, `.agents/rules/*.md` files require valid snake_case `trigger:` frontmatter (`always_on`, `model_decision`, `glob`, `manual`). Unrecognized triggers are ignored.
- **Nesting Limits:** Skills are discovered one level deep: `skills/<name>/SKILL.md`.
- **Cross-Platform Tooling:** Hooks in Antigravity use native tool names (`run_command`, `write_file`, etc.), whereas Claude Code relies on its own tool nomenclature. Keep hooks decoupled from platform-specific subagents.
- **Secret Separation:** Workspace configs (`.agents/mcp_config.json`) are committed to version control and must remain completely secret-free. Personal API keys belong solely in global user configuration files.
