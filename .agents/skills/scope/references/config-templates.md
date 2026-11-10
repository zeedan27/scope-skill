# Configuration Templates

Use these reference templates for configuring security postures, agent hooks, secret screening, and UI constraints across Antigravity and Claude Code environments.

---

## 1. Global Agent Permissions
File path: `~/.gemini/antigravity-cli/settings.json` (or platform equivalent)

```json
{
  "agentMode": "auto",
  "enableTerminalSandbox": true,
  "allowNonWorkspaceAccess": false,
  "permissions": {
    "allow": [
      "command(git status)",
      "command(git diff)",
      "command(git log)",
      "command(regex:npm run (build|lint|test|typecheck))",
      "execute_url(localhost)"
    ],
    "deny": [
      "command(rm -rf)",
      "command(sudo)",
      "command(regex:curl .*)",
      "command(regex:.*(terraform destroy|pulumi destroy|railway delete|fly apps destroy).*)",
      "read_file(.env)",
      "read_file(.env.local)",
      "write_file(.env)",
      "write_file(.git/)",
      "write_file(/Users/*/.ssh)",
      "write_file(C:\\Users\\*\\.ssh)"
    ],
    "ask": [
      "unsandboxed(*)",
      "command(git push)",
      "command(regex:npm (install|i) .*)",
      "command(regex:(vercel|railway|wrangler|render|fly|gcloud|terraform|pulumi) .*)",
      "mcp(render/approve_blueprint)",
      "mcp(arcjet/promote-rule)",
      "mcp(cloud-run/deploy-local-folder)"
    ]
  }
}
```

*Key Rule:* `Deny` rules strictly override `Ask` rules. Destructive infrastructure teardowns remain permanently blocked.

---

## 2. Project Hooks
File path: `<project>/.agents/hooks.json`

Execute typechecks and linters upon task completion rather than after individual edits to avoid false stops during multi-file refactoring:

```json
{
  "typecheck-at-stop": {
    "enabled": true,
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "npx tsc --noEmit", "timeout": 60 }
        ]
      }
    ]
  }
}
```

---

## 3. Secret Scanning Configuration
Enforce secret detection locally and in CI pipelines using tools such as `gitleaks`.

Add a pre-commit check or CI job:
```yaml
name: Secret Scan
on: [push, pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
```

---

## 4. MCP Server Configurations

### Global Config (Private Keys Allowed)
File path: `~/.gemini/config/mcp_config.json`
```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_PRIVATE_TOKEN" }
    }
  }
}
```

### Workspace Config (Committed to Repository — Zero Keys Allowed)
File path: `<project>/.agents/mcp_config.json`
```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@0.0.30"],
      "disabledTools": ["browser_run_code_unsafe"],
      "timeoutSeconds": 120
    }
  }
}
```

---

## 5. UI Rule Specification
File path: `<project>/.agents/rules/ui-components.md`

```markdown
---
trigger: glob
globs: "src/components/**/*.tsx, src/app/**/*.tsx"
description: Visual standards, accessibility, and design-token adherence for UI components.
---

# UI Component Standards
- Prevent generic styling patterns (e.g. unprompted dark purple gradients, generic 3-card features, all-caps pill labels).
- Ensure every interactive element exposes a `:focus-visible` ring, handles keyboard events, and provides ARIA labels.
- Map all component styles directly to CSS variables from `DESIGN.md`. Never introduce unvetted hardcoded hex colors.
```

---

## 6. Standard `.gitignore` Additions
Ensure every S.C.O.P.E. project excludes secrets, scratch environments, and ephemeral traces:

```gitignore
# Environment & Secrets
.env
.env.*
!.env.example

# Build & Dependencies
node_modules/
dist/
.next/

# Intermediates & Recon
.tmp/
*.har
cookies.json

# Worktrees
.worktrees/
```
