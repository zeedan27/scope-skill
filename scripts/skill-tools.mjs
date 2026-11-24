#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const SOURCE_DIR = path.join(REPO_ROOT, ".agents", "skills", "scope");
const TARGET_DIRS = [
  path.join(REPO_ROOT, ".claude", "skills", "scope"),
  path.join(REPO_ROOT, "skills", "scope"),
];

const SKILL_FOLDER_NAME = "scope";
const SKILL_COUNT_PHRASE = "at most 10 core skills and about 14 skills in total";
const SKILL_EXCLUSION_PHRASE = "built-in slash commands and mcp servers do not count";

function walkFiles(dir, baseDir = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      results.push({ fullPath, relPath });
    }
  }
  return results.sort((a, b) => a.relPath.localeCompare(b.relPath));
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function syncCopies() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }
  const sourceFiles = walkFiles(SOURCE_DIR);
  for (const targetDir of TARGET_DIRS) {
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    for (const file of sourceFiles) {
      const dest = path.join(targetDir, file.relPath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(file.fullPath, dest);
    }
    console.log(`Synced ${sourceFiles.length} files -> ${path.relative(REPO_ROOT, targetDir)}`);
  }
}

function parseMarkdownTableRows(sectionText) {
  const lines = sectionText.split(/\r?\n/);
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith("|") && i + 1 < lines.length && /^\|\s*[-:]+/.test(lines[i + 1].trim())) {
      const headers = lines[i]
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i]
          .trim()
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        rows.push(cells);
        i++;
      }
      tables.push({ headers, rows });
    } else {
      i++;
    }
  }
  return tables;
}

function extractSections(markdown) {
  const sections = {};
  const lines = markdown.split(/\r?\n/);
  let current = "_preamble";
  let buf = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(.+)$/);
    if (m) {
      sections[current] = buf.join("\n");
      current = m[1].trim();
      buf = [];
    } else {
      buf.push(line);
    }
  }
  sections[current] = buf.join("\n");
  return sections;
}

function extractReferencedTools(filesContentMap) {
  const referenced = new Set();
  const ignoreSlash = new Set(["healthz/live", "healthz/ready", "healthz/startup"]);

  for (const [relPath, text] of Object.entries(filesContentMap)) {
    if (relPath === "references/skills-and-safety.md") continue;

    // 1. Backticked slash commands (e.g. `/grill-me`, `/impeccable init`)
    for (const m of text.matchAll(/`\/([a-z0-9-]+)(?:\s+[a-z0-9-]+)?`/gi)) {
      const fullAfterSlash = m[0].slice(2, -1);
      if (fullAfterSlash.startsWith("healthz/")) continue;
      if (ignoreSlash.has(fullAfterSlash)) continue;
      referenced.add(m[1].toLowerCase());
    }

    // 2. Backticked skill / tool names known in context
    for (const m of text.matchAll(/`([a-z0-9-]+)`/gi)) {
      const tok = m[1].toLowerCase();
      if (
        [
          "scope",
          "context7",
          "playwright",
          "wrangler",
          "workers-best-practices",
          "upstash-ratelimit-js",
          "arcjet",
          "redis-best-practices",
          "designlang",
          "next-cache-components",
          "deploy-to-vercel",
          "vercel-optimize",
          "use-railway",
          "stripe-best-practices",
          "verification-before-completion",
          "systematic-debugging",
          "test-driven-development",
          "requesting-code-review",
          "subagent-driven-development",
          "frontend-design",
          "design-taste-frontend",
          "taste-skill",
          "impeccable",
          "web-design-guidelines",
          "vercel-react-best-practices",
          "supabase",
        ].includes(tok)
      ) {
        referenced.add(tok);
      }
    }

    // 3. MCP tool references in config-templates.md (e.g. mcp(render/approve_blueprint))
    for (const m of text.matchAll(/mcp\(([a-z0-9-]+\/[a-z0-9_-]+)\)/gi)) {
      referenced.add(m[1].toLowerCase());
    }

    // 4. mcpServers JSON keys in config-templates.md (parse JSON blocks accurately)
    for (const m of text.matchAll(/```json\r?\n([\s\S]*?)\r?\n```/g)) {
      try {
        const parsed = JSON.parse(m[1]);
        if (parsed && parsed.mcpServers && typeof parsed.mcpServers === "object") {
          for (const key of Object.keys(parsed.mcpServers)) {
            referenced.add(key.toLowerCase());
          }
        }
      } catch {
        // Ignore non-MCP or invalid JSON blocks
      }
    }

    // 5. CLI names in ask regex in config-templates.md
    for (const m of text.matchAll(/command\(regex:\(([^)]+)\)\s+\.\*\)/g)) {
      for (const cli of m[1].split("|")) {
        referenced.add(cli.trim().toLowerCase());
      }
    }

    // 6. Named MCP servers / vendors in prose/tables
    for (const m of text.matchAll(/\b(context7|GitHub MCP|Supabase MCP|Stripe MCP|Terraform MCP|GCP Cloud Run MCP|Playwright MCP|Sentry|Datadog|Vercel|Render|Railway|Fly\.io|Cloudflare)\b/g)) {
      referenced.add(m[1].toLowerCase());
    }
  }

  return referenced;
}

function checkAll() {
  const errors = [];
  const fail = (msg) => errors.push(msg);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Missing source skill directory: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // 0. Check copy parity across .agents, .claude, and skills
  const sourceFiles = walkFiles(SOURCE_DIR);
  const sourceMap = new Map(sourceFiles.map((f) => [f.relPath, sha256(f.fullPath)]));

  for (const targetDir of TARGET_DIRS) {
    const relTarget = path.relative(REPO_ROOT, targetDir);
    if (!fs.existsSync(targetDir)) {
      fail(`Missing skill copy directory: ${relTarget}`);
      continue;
    }
    const targetFiles = walkFiles(targetDir);
    const targetMap = new Map(targetFiles.map((f) => [f.relPath, sha256(f.fullPath)]));

    for (const [relPath, hash] of sourceMap) {
      if (!targetMap.has(relPath)) {
        fail(`${relTarget} is missing file: ${relPath}`);
      } else if (targetMap.get(relPath) !== hash) {
        fail(`${relTarget}/${relPath} differs from .agents/skills/scope/${relPath}`);
      }
    }
    for (const relPath of targetMap.keys()) {
      if (!sourceMap.has(relPath)) {
        fail(`${relTarget} has extra file not in source: ${relPath}`);
      }
    }
  }

  const filesContent = {};
  for (const f of sourceFiles) {
    filesContent[f.relPath] = fs.readFileSync(f.fullPath, "utf8");
  }

  // (a) Inventory invariant
  const safetyMd = filesContent["references/skills-and-safety.md"];
  if (!safetyMd) {
    fail("Missing references/skills-and-safety.md");
  } else {
    const safetyLower = safetyMd.toLowerCase();
    const referencedTools = extractReferencedTools(filesContent);
    for (const item of referencedTools) {
      if (!safetyLower.includes(item)) {
        fail(`Inventory invariant: '${item}' is referenced in skill files but missing from references/skills-and-safety.md`);
      }
    }

    const sections = extractSections(safetyMd);
    const otherTextLower = Object.entries(filesContent)
      .filter(([rel]) => rel !== "references/skills-and-safety.md")
      .map(([, txt]) => txt.toLowerCase())
      .join("\n");

    const inventorySectionKeys = Object.keys(sections).filter(
      (k) => k.startsWith("2.") || k.startsWith("3.") || k.startsWith("4.")
    );

    for (const secKey of inventorySectionKeys) {
      const tables = parseMarkdownTableRows(sections[secKey]);
      for (const { headers, rows } of tables) {
        const lowerHeaders = headers.map((h) => h.toLowerCase());
        const jobIdx = lowerHeaders.findIndex((h) => h.includes("job"));
        const phaseIdx = lowerHeaders.findIndex((h) => h.includes("phase"));
        const condIdx = lowerHeaders.findIndex((h) => h.includes("condition"));

        if (jobIdx === -1 || phaseIdx === -1) {
          fail(`Inventory table in section '${secKey}' must include both Job and Phase columns`);
          continue;
        }

        for (const row of rows) {
          const itemLabel = row[0] || "";
          const jobVal = row[jobIdx] || "";
          const phaseVal = row[phaseIdx] || "";
          const condVal = condIdx !== -1 ? row[condIdx] || "" : "";

          if (!jobVal) {
            fail(`Inventory entry '${itemLabel}' in '${secKey}' is missing a Job`);
          }
          if (!phaseVal) {
            fail(`Inventory entry '${itemLabel}' in '${secKey}' is missing a Phase`);
          }

          const hasCondition =
            /optional|conditional/i.test(condVal) ||
            /conditional/i.test(headers.join(" "));

          const tokens = [...itemLabel.matchAll(/`([^`]+)`/g)].map((m) => m[1].toLowerCase());
          const plainName = itemLabel.replace(/[*`()]/g, "").trim().toLowerCase();
          const isReferencedElsewhere =
            tokens.some((t) => {
              const bare = t.split(/\s+/)[0];
              return otherTextLower.includes(t) || otherTextLower.includes(bare);
            }) || otherTextLower.includes(plainName);

          if (!isReferencedElsewhere && !hasCondition) {
            fail(`Inventory entry '${itemLabel}' in '${secKey}' is neither referenced in other files nor marked Optional/Conditional with its condition`);
          }
          if (hasCondition && condIdx !== -1 && !condVal) {
            fail(`Inventory entry '${itemLabel}' in '${secKey}' has an empty Condition cell`);
          }
        }
      }
    }
  }

  // (b) Skill-count numbers identical across SKILL.md, AGENTS.template.md, and skills-and-safety.md
  for (const rel of ["SKILL.md", "templates/AGENTS.template.md", "references/skills-and-safety.md"]) {
    const txt = (filesContent[rel] || "").replace(/\s+/g, " ").toLowerCase();
    if (!txt.includes(SKILL_COUNT_PHRASE)) {
      fail(`${rel} is missing the required skill-count rule: "${SKILL_COUNT_PHRASE}"`);
    }
    if (!txt.includes(SKILL_EXCLUSION_PHRASE)) {
      fail(`${rel} is missing the built-in slash commands and MCP servers exclusion rule`);
    }
  }
  for (const [rel, txt] of Object.entries(filesContent)) {
    if (/8\s*[–-]\s*10/.test(txt)) {
      fail(`${rel} still contains conflicting skill-count range (8-10)`);
    }
  }

  // (c) SKILL.md frontmatter, name match, description <= 1024 chars, < 500 lines
  const skillMd = filesContent["SKILL.md"] || "";
  const skillLines = skillMd.split(/\r?\n/);
  if (skillLines.length >= 500) {
    fail(`SKILL.md must be under 500 lines (found ${skillLines.length})`);
  }
  const fmMatch = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!fmMatch) {
    fail("SKILL.md is missing valid YAML frontmatter");
  } else {
    const fm = fmMatch[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    if (!nameMatch) {
      fail("SKILL.md frontmatter is missing 'name'");
    } else if (nameMatch[1].trim().replace(/^['"]|['"]$/g, "") !== SKILL_FOLDER_NAME) {
      fail(`SKILL.md frontmatter name '${nameMatch[1].trim()}' does not match folder '${SKILL_FOLDER_NAME}'`);
    }
    if (!descMatch) {
      fail("SKILL.md frontmatter is missing 'description'");
    } else {
      const desc = descMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (!desc) fail("SKILL.md frontmatter 'description' is empty");
      if (desc.length > 1024) {
        fail(`SKILL.md description exceeds 1024 characters (${desc.length})`);
      }
    }
  }

  // (d) AGENTS.template.md has no frontmatter and < 150 lines
  const agentsMd = filesContent["templates/AGENTS.template.md"] || "";
  const agentsLines = agentsMd.split(/\r?\n/);
  if (/^\s*---\r?\n/.test(agentsMd)) {
    fail("templates/AGENTS.template.md must not contain YAML frontmatter");
  }
  if (agentsLines.length >= 150) {
    fail(`templates/AGENTS.template.md must be under 150 lines (found ${agentsLines.length})`);
  }

  // (e) Every relative link and file reference inside .agents/skills/scope resolves
  for (const [rel, txt] of Object.entries(filesContent)) {
    if (!rel.endsWith(".md")) continue;
    const baseDir = path.dirname(path.join(SOURCE_DIR, rel));

    // Markdown links [label](target)
    for (const m of txt.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
      const rawTarget = m[1].split("#")[0];
      if (!rawTarget || /^(https?:|mailto:|file:|#)/i.test(rawTarget)) continue;
      const resolvedFromFile = path.resolve(baseDir, rawTarget);
      const resolvedFromRoot = path.resolve(SOURCE_DIR, rawTarget);
      if (!fs.existsSync(resolvedFromFile) && !fs.existsSync(resolvedFromRoot)) {
        fail(`${rel}: unresolved markdown link '${m[1]}'`);
      }
    }

    // Explicit references/... or templates/... paths
    for (const m of txt.matchAll(/\b((?:references|templates)\/[A-Za-z0-9_.-]+\.(?:md|json|mjs))\b/g)) {
      const target = path.join(SOURCE_DIR, m[1]);
      if (!fs.existsSync(target)) {
        fail(`${rel}: unresolved relative file reference '${m[1]}'`);
      }
    }
  }

  // (f) Secret scan, .har / cookies file check, and legacy reference scan
  const skipDirs = new Set([".git", "node_modules", "blast"]);
  function scanRepoTree(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skipDirs.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanRepoTree(fullPath);
      } else if (entry.isFile()) {
        const lower = entry.name.toLowerCase();
        if (lower.endsWith(".har") || lower === "cookies.json" || lower.includes("cookies")) {
          fail(`Disallowed capture/cookies file found: ${path.relative(REPO_ROOT, fullPath)}`);
        }
      }
    }
  }
  scanRepoTree(REPO_ROOT);

  const secretPatterns = [
    /\bsk_(?:live|test)_[0-9A-Za-z]{12,}\b/,
    /\bpk_(?:live|test)_[0-9A-Za-z]{12,}\b/,
    /\bgh[pousr]_[0-9A-Za-z]{20,}\b/,
    /\bgithub_pat_[0-9A-Za-z_]{20,}\b/,
    /\bAIza[0-9A-Za-z_-]{20,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /Bearer\s+(?!YOUR_PRIVATE_TOKEN\b)[A-Za-z0-9._-]{24,}/,
  ];

  const scanFiles = [
    ...sourceFiles.map((f) => ({ label: `.agents/skills/scope/${f.relPath}`, text: filesContent[f.relPath] })),
    { label: "README.md", text: fs.readFileSync(path.join(REPO_ROOT, "README.md"), "utf8") },
  ];

  for (const { label, text } of scanFiles) {
    for (const re of secretPatterns) {
      if (re.test(text)) {
        fail(`Potential secret/key-like string matching ${re} found in ${label}`);
      }
    }
    if (/\bb\.?l\.?a\.?s\.?t\.?\b/i.test(text)) {
      fail(`Leftover legacy reference found in ${label}`);
    }
  }

  // Also verify JSON blocks in config-templates.md are valid JSON, Windows .ssh deny & quoted hooks exist, and deploy-local-folder is in deny
  const cfgMd = filesContent["references/config-templates.md"] || "";
  const jsonBlocks = [...cfgMd.matchAll(/```json\r?\n([\s\S]*?)\r?\n```/g)];
  for (const [idx, match] of jsonBlocks.entries()) {
    try {
      const obj = JSON.parse(match[1]);
      if (obj.permissions) {
        const deny = obj.permissions.deny || [];
        const ask = obj.permissions.ask || [];
        if (!deny.includes("mcp(cloud-run/deploy-local-folder)")) {
          fail("config-templates.md: mcp(cloud-run/deploy-local-folder) must be in permissions.deny");
        }
        if (ask.includes("mcp(cloud-run/deploy-local-folder)")) {
          fail("config-templates.md: mcp(cloud-run/deploy-local-folder) must not be in permissions.ask");
        }
        if (!deny.includes("write_file(/Users/*/.ssh)") || !deny.includes("write_file(C:\\Users\\*\\.ssh)")) {
          fail("config-templates.md: permissions.deny must include both Unix and Windows .ssh paths");
        }
      }
      if (obj["typecheck-at-stop"]) {
        const cmdStr = obj["typecheck-at-stop"]?.Stop?.[0]?.hooks?.[0]?.command || "";
        if (!cmdStr.includes('"')) {
          fail("config-templates.md: hook command must be quoted");
        }
        if (/\.sh\b/i.test(cmdStr)) {
          fail("config-templates.md: hook command must avoid bare .sh scripts");
        }
      }
    } catch (e) {
      fail(`config-templates.md JSON block #${idx + 1} failed to parse: ${e.message}`);
    }
  }

  // Verify Deploy Rule core wording across deployment-related files
  const deployFiles = [
    "SKILL.md",
    "templates/AGENTS.template.md",
    "references/stack-matrix.md",
    "references/skills-and-safety.md",
    "references/config-templates.md",
  ];
  for (const rel of deployFiles) {
    const norm = (filesContent[rel] || "").replace(/\s+/g, " ");
    if (!norm.includes("Deploy only committed code, through Git (the platform's Git integration or CI) or the platform's own CLI with the user's approval.") &&
        !norm.includes("deploy only committed code, through Git (the platform's Git integration or CI) or the platform's own CLI with the user's approval.")) {
      fail(`${rel}: missing canonical Deploy Rule wording`);
    }
  }

  // Verify skill names do not carry a leading slash (slash-command trap) in SKILL.md, stack-matrix.md, or AGENTS.template.md
  const nonSlashSkills = [
    "frontend-design",
    "design-taste-frontend",
    "impeccable",
    "web-design-guidelines",
    "vercel-react-best-practices",
    "supabase",
    "stripe-best-practices",
    "systematic-debugging",
    "verification-before-completion",
    "test-driven-development",
    "requesting-code-review",
    "subagent-driven-development",
  ];
  for (const rel of ["SKILL.md", "references/stack-matrix.md", "templates/AGENTS.template.md"]) {
    const txt = filesContent[rel] || "";
    for (const sk of nonSlashSkills) {
      const slashRe = new RegExp(`(^|[^A-Za-z0-9_./-])/${sk}\\b`, "i");
      if (slashRe.test(txt)) {
        fail(`${rel}: skill '${sk}' must not be written with a leading '/'`);
      }
    }
  }

  // Verify Tables 2b, 2c, and 2d in skills-and-safety.md include a Source / Install Command column
  if (safetyMd) {
    for (const subHeading of ["### 2b.", "### 2c.", "### 2d."]) {
      const idx = safetyMd.indexOf(subHeading);
      if (idx === -1) {
        fail(`references/skills-and-safety.md: missing subsection '${subHeading}'`);
        continue;
      }
      const nextIdx = safetyMd.indexOf("\n### ", idx + subHeading.length);
      const slice = nextIdx === -1 ? safetyMd.slice(idx) : safetyMd.slice(idx, nextIdx);
      const subTables = parseMarkdownTableRows(slice);
      if (subTables.length === 0) {
        fail(`references/skills-and-safety.md: missing table in '${subHeading}'`);
        continue;
      }
      const { headers, rows } = subTables[0];
      const srcIdx = headers.findIndex((h) => /source\s*\/\s*install\s*command/i.test(h));
      if (srcIdx === -1) {
        fail(`references/skills-and-safety.md: table in '${subHeading}' must include a 'Source / Install Command' column`);
      } else {
        for (const row of rows) {
          if (!(row[srcIdx] || "").trim()) {
            fail(`references/skills-and-safety.md: row '${row[0]}' in '${subHeading}' has empty Source / Install Command`);
          }
        }
      }
    }
  }

  // Verify rolling skill-first phase planning and phase-boundary checkpoints
  for (const requiredMarker of [
    "Subphase 1A",
    "Subphase 1B",
    "Phase 1A Checkpoint",
    "Phase 2 Checkpoint",
    "Phase 3 Checkpoint",
    "Phase 4 Checkpoint",
    "Skill-First Phase 2 Plan",
    "Skill-First Phase 3 Plan",
    "Skill-First Phase 4 Plan",
    "Skill-First Phase 5 Plan",
    "Skill-Skip Red Flags",
  ]) {
    if (!skillMd.includes(requiredMarker)) {
      fail(`SKILL.md: missing '${requiredMarker}' rule`);
    }
  }
  if (!agentsMd.includes("Phase-Boundary Checkpoints")) {
    fail("templates/AGENTS.template.md: missing 'Phase-Boundary Checkpoints' rule");
  }

  if (errors.length > 0) {
    console.error(`CHECK FAILED (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
    for (const err of errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `CHECK PASSED: 3 copies identical (${sourceFiles.length} files each), inventory invariant, skill counts, SKILL.md (${skillLines.length} lines), AGENTS.template.md (${agentsLines.length} lines), relative links, and secret/artifact scans clean.`
  );
}

const cmd = process.argv[2];
if (cmd === "sync") {
  syncCopies();
} else if (cmd === "check") {
  checkAll();
} else {
  console.error("Usage: node scripts/skill-tools.mjs <sync|check>");
  process.exit(2);
}
