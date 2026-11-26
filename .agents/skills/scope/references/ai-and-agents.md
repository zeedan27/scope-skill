# Runtime AI and Embedded Agent Standards

Consult this reference conditionally in Subphase 1A, Phase 3, and Phase 5 whenever the application being built includes runtime LLM features, chatbots, RAG pipelines, or embedded/autonomous agents. Standard apps with no runtime AI skip this file.

---

## 1. Credential & Execution Boundary
- **Server-Side Inference Only:** Execute all LLM, embedding, image, audio, and agent calls from authenticated backend routes or an internal AI gateway. Never embed provider API keys in client bundles or pass them to the browser.
- **Build-Time MCP vs. Runtime App Credentials:** Coding-agent MCP servers are developer tools used during construction. Published apps must never depend on developer MCPs; runtime integrations use dedicated, environment-scoped app credentials verified in Phase 2.
- **Session-Derived Identity:** Derive `userId`, tenant ID, and role from the verified server session on every agent run and tool invocation. Never trust caller identity, user IDs, or permission flags supplied in prompt text or client payloads.

---

## 2. Client UI Actions vs. Server App Tools
Strictly separate what an agent can trigger in the browser from what it can mutate on the server:

| Capability | Permitted Scope | Mandatory Guardrails |
|---|---|---|
| **Client UI Actions** | Navigate views, open panels, pre-fill drafts | Schema-validate payloads before dispatch; drop stale actions if the client view closes or disconnects; **never** auto-submit forms, execute purchases, delete records, or alter account settings. |
| **Server App Tools** | Read/write app records, trigger workflows | Authenticate every call against the server session; enforce RBAC and row-level tenancy (`userId`/org scope) inside the tool handler. |
| **External Integrations (User-Facing Runs)** | Third-party APIs connected to the app | Default external integrations to **disabled** or **Read-only** for end-user runs. Never expose persistent dev-boxes, shell sandboxes, or org-wide admin credentials to external users. |

- **Prompt Secret Hygiene:** Keep API keys, webhook URLs, and internal tokens out of system prompts and retrieved context—an agent with web-fetch or URL-rendering tools can exfiltrate prompt secrets into outbound requests.

---

## 3. Three-Checkpoint Guardrails
Enforce deterministic checks and fast classifier guardrails across all three boundaries:
1. **User Input (Before Model):** Screen for prompt-injection overrides, pasted secrets/credentials, and out-of-scope abuse.
2. **Tool / Integration Input (Before Execution):** Intercept destructive or unrequested mutations (bulk deletes, refunds, transfers) and require explicit user confirmation or hard policy block.
3. **Model Output (Before Delivery):** Screen for leaked secrets, cross-tenant PII disclosure, and unauthorized commitments (pricing, refunds, legal guarantees).

- **Rollout Discipline:** Deploy new semantic guardrails in `Warn` (audit/log) mode first to measure false positives before switching to `Block`. Use low-latency classifiers or deterministic regex/schema checks on synchronous user paths so guardrails do not time out.

---

## 4. Two-Tier Spend & Runaway Limits
Cap both individual runs and aggregate app exposure:
- **Per-Run Limits:** Set hard caps on **maximum spend**, **wall-clock duration**, and **step/model-call count** for every agent run. Configure thresholds slightly below true budget ceilings because limits are evaluated between steps while an in-flight call finishes.
- **App-Wide Limits:** Enforce **both** a per-user rate limit (runs per hour) **and** a global rolling 24-hour spend cap across the application. Per-user limits alone fail when attackers spin up new accounts.
- **Immutable Accounting:** Record spend in an append-only ledger; deleting chat threads or conversation history must never decrement rolling spend counters. Return a clear, graceful fallback message when a limit is hit.

---

## 5. Baseline Evaluations, Refusal Tests & Policy Context
- **Curated Test Dataset:** Before launching or changing prompts, tools, or models, assemble a dataset from real/hard user inputs plus **at least one adversarial/refusal case** (e.g., unauthorized data request, prompt injection, or out-of-policy refund).
- **Eval Scope Separation:** Single-pass prompt/instruction evaluations test wording and refusal quality, not multi-step tool execution. Verify tool calling and state changes separately via integration tests or recorded execution traces.
- **Baseline Comparison:** Save a baseline evaluation run before editing instructions or swapping models; compare the new run case-by-case against the baseline before promoting.
- **Non-Bug Policy Context:** Document intentional product refusals and human-escalation boundaries (e.g., *"refunds over $500 escalate to support; never quote unverified prices"*) in `architecture/` SOPs so automated reviewers, debuggers, and eval graders do not treat enforced policy as a bug.
