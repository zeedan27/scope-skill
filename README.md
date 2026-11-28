# SCOPE Framework (`scope`)

> **S.C.O.P.E.** — Specification · Connections · Organization · Polish · Execution  
> An open-source, deterministic engineering protocol and agent skill for vibecoding, full-stack application development, and autonomous software delivery. Compatible with **Google Antigravity** and **Claude Code**.

---

## 🎯 What is the SCOPE Framework?

Modern AI agents and vibecoders build fast, but speed without structure leads to hallucinated business logic, leaky abstractions, missing tests, and brittle deployments.

The **S.C.O.P.E. Framework** turns probabilistic LLMs into reliable, deterministic software pilots through a structured 5-phase engineering protocol:

```
  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
  │ S:Specification │ ──> │  C:Connections  │ ──> │ O:Organization  │ ──> │   P:Polish   │ ──> │   E:Execution   │
  │ (1A Spec/1B UI) │     │ (Auth & Links)  │     │ (3-Layer Build) │     │ (UI & Perf)  │     │ (Gated Release) │
  └─────────────────┘     └─────────────────┘     └─────────────────┘     └──────────────┘     └─────────────────┘
           │                                                                                             │
        Gate 1: Blueprint Approval                                                                   Gate 2: Production Gate
           ▲                                                                                             │
           └─────── Cycle N+1: Track A Delta Feature · Track B Fast-Path Anneal · Track C Refinement ────┘
```

### The 5 Phases:
1. **Specification** *(formerly Blueprint)*: Runs in two sequential subphases — **Subphase 1A** (optional `go`/`needs-clarification`/`kill` viability triage when validating an idea, `/grill-me` functional discovery with bounded `[NEEDS CLARIFICATION]` ambiguity scan & spec-quality check, brownfield/migration onboarding if existing code lacks `AGENTS.md`, T0/T1/T2 tiering, SSR vs. SPA rendering choice, 12-layer stack evaluation, runtime AI guardrails if applicable, and data-first schemas + T1+ observable contract semantics) followed once locked by **Subphase 1B** *(UI projects)* (skill-driven `PRODUCT.md`, `DESIGN.md`, and screen specs via `design-taste-frontend` or `frontend-design` + `impeccable`). **Gate 1 Hard Halt.**
2. **Connections** *(formerly Link)*: Credential posture, sandboxed handshakes, read-only MCP verification, environment validation, and preview/branch side-effect isolation.
3. **Organization** *(formerly Architect)*: 3-layer engineering build (Architecture SOPs → Navigation → Deterministic Tools). Read-only pre-build Consistency Audit across law docs and `task_plan.md`, vertical feature slices with mandatory test proof and runtime AI tool/spend-cap boundaries when AI is in scope, and an append-only Convergence Audit against locked intent before the Phase 3 Checkpoint.
4. **Polish** *(formerly Stylize)*: Payload formatting, UI accessibility audit (WCAG 2.1 AA), state completeness (Loading, Empty, Error), public SEO/compliance/i18n freeze checks, and zero leaked secrets.
5. **Execution** *(formerly Trigger)*: Automated Gate 2 production readiness checklist (HTTP security headers, field-level RLS, multi-role `/browser` smoke flows, AI baseline/refusal evals), Git-driven deployment, CDN/cache optimization, and operational runbooks.

### Post-Launch Continuation (`Cycle N+1`):
Once v1 ships (`AGENTS.md` + `architecture/schemas.md` exist), `/scope` skips Phase 0, checks `Deferred` revisit triggers in `findings.md`, archives completed `task_plan.md` / verbose `progress.md` logs to `architecture/archive/`, and routes ongoing work into one of three tracks:
- **Track A — Delta S.C.O.P.E.** *(New features, integrations, or layer promotions)*: Delta 1A → Delta 1B *(extending within existing `DESIGN.md`)* → Gate 1 → Phase 2 *(only if adding external services/secrets)* → Phase 3 → 4 → 5.
- **Track B — Fast-Path Anneal** *(Bugfixes & missed edge cases)*: `systematic-debugging` → SOP update → TDD regression slice (`test-driven-development`) → Phase 5 Deploy Rule *(escalates to Track A if schemas, roles/RLS, or product rules change)*.
- **Track C — Refinement Loop** *(UI, UX, copy, a11y, perf, or redesign)*: Look-preserving polish enters directly at Phase 4 → 5 against `DESIGN.md`; explicit full redesigns enter at Subphase 1B.

---

## 🚀 One-Command Installation

### Via `npx skills` (Universal)
```bash
npx skills add zeedan27/scope-skill --skill scope
```

### Via Antigravity CLI (`agy`)
```bash
agy plugin install https://github.com/zeedan27/scope-skill.git
```

---

## 💻 Manual Installation

### Global Installation (User Level)

#### macOS / Linux
```bash
# Clone the repository
git clone https://github.com/zeedan27/scope-skill.git /tmp/scope-skill

# For Claude Code
mkdir -p ~/.claude/skills
cp -r /tmp/scope-skill/skills/scope ~/.claude/skills/

# For Google Antigravity
mkdir -p ~/.gemini/config/skills
cp -r /tmp/scope-skill/skills/scope ~/.gemini/config/skills/

# Cleanup
rm -rf /tmp/scope-skill
```

#### Windows (PowerShell)
```powershell
# Clone the repository
git clone https://github.com/zeedan27/scope-skill.git "$env:TEMP\scope-skill"

# For Claude Code
New-Item -ItemType Directory -Force -Path "$HOME\.claude\skills"
Copy-Item -Path "$env:TEMP\scope-skill\skills\scope" -Destination "$HOME\.claude\skills" -Recurse -Force

# For Google Antigravity
New-Item -ItemType Directory -Force -Path "$HOME\.gemini\config\skills"
Copy-Item -Path "$env:TEMP\scope-skill\skills\scope" -Destination "$HOME\.gemini\config\skills" -Recurse -Force

# Cleanup
Remove-Item -Path "$env:TEMP\scope-skill" -Recurse -Force
```

### Workspace Installation (Project Level)
Drop the skill directly into your project repository to share with your team:

```bash
# For Google Antigravity
mkdir -p .agents/skills
cp -r /path/to/scope-skill/skills/scope .agents/skills/

# For Claude Code
mkdir -p .claude/skills
cp -r /path/to/scope-skill/skills/scope .claude/skills/
```

---

## 🕹️ Usage Guide

### Triggering via Slash Command
Simply type:
```text
/scope
```
or initialize a new project or post-launch cycle with:
```text
/scope initialize this project as a T1 SaaS web application
/scope add team billing to our shipped app
/scope fix the checkout webhook retry bug
```

### Triggering via Natural Language
Because `SKILL.md` includes trigger-optimized frontmatter, your agent will also activate the protocol automatically when you say:
- *"Let's build a full-stack web application using the SCOPE protocol."*
- *"Run the SCOPE framework to architect and ship this feature."*
- *"Review our stack against the 12 infrastructure layers before we deploy."*

---

## 📂 Skill Architecture & Progressive Disclosure

The `scope` skill uses a token-efficient architecture designed for progressive disclosure:

```plaintext
skills/scope/
├── SKILL.md                          # Main protocol (< 250 lines, token-optimized)
├── templates/
│   └── AGENTS.template.md            # The always-on project constitution (AGENTS.md)
└── references/
    ├── stack-matrix.md               # The 12 infrastructure layers & tier standards
    ├── spec-and-convergence.md       # Viability triage, ambiguity/spec quality, contracts, consistency & convergence audits
    ├── skills-and-safety.md          # Built-ins, skill & MCP inventory, packs & vetting
    ├── config-templates.md           # Permissions, hooks, MCP configs & UI rules
    ├── caching-and-scaling.md        # Cache & HTTP security headers, Redis, probes & scaling
    ├── ai-and-agents.md              # Runtime AI/agent guardrails, spend caps & evals (conditional)
    └── recon.md                      # Safe inspection of reference websites
```

Run `node scripts/skill-tools.mjs sync` to sync the three skill copies and `node scripts/skill-tools.mjs check` to validate them.

> **Note:** Vendor names, versions, advisories and benchmark claims in this skill come from third-party research notes and were not independently verified. Check each repository and advisory before installing.

---

## 📄 License
MIT License. Free to use, adapt, and distribute for personal and commercial projects.
