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
  │ (Data & Logic)  │     │ (Auth & Links)  │     │ (3-Layer Build) │     │ (UI & Perf)  │     │ (Gated Release) │
  └─────────────────┘     └─────────────────┘     └─────────────────┘     └──────────────┘     └─────────────────┘
           │                                                                                             │
        Gate 1: Blueprint Approval                                                                   Gate 2: Production Gate
```

### The 5 Phases:
1. **Specification** *(formerly Blueprint)*: Deep discovery, tier definition (T0/T1/T2), 12-layer stack evaluation, data-first schemas, and UI design token definition. **Gate 1 Hard Halt.**
2. **Connections** *(formerly Link)*: Credential posture, sandboxed handshakes, read-only MCP verification, and environment validation.
3. **Organization** *(formerly Architect)*: 3-layer engineering build (Architecture SOPs → Navigation → Deterministic Tools). Vertical feature slices with mandatory test proof.
4. **Polish** *(formerly Stylize)*: Payload formatting, UI accessibility audit (WCAG 2.1 AA), state completeness (Loading, Empty, Error), and zero leaked secrets.
5. **Execution** *(formerly Trigger)*: Automated Gate 2 production readiness checklist, Git-driven deployment, CDN/cache optimization, and operational runbooks.

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
or initialize a new project with:
```text
/scope initialize this project as a T1 SaaS web application
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
├── SKILL.md                          # Main protocol (< 200 lines, token-optimized)
├── templates/
│   └── AGENTS.template.md            # The always-on project constitution (AGENTS.md)
└── references/
    ├── stack-matrix.md               # The 12 infrastructure layers & tier standards
    ├── skills-and-safety.md          # Skill inventory, platform packs & vetting rules
    ├── config-templates.md           # Permissions, hooks, MCP configs & UI rules
    ├── caching-and-scaling.md        # Cache headers, Redis, probes & scaling limits
    └── recon.md                      # Safe inspection of reference websites
```

---

## 📄 License
MIT License. Free to use, adapt, and distribute for personal and commercial projects.
