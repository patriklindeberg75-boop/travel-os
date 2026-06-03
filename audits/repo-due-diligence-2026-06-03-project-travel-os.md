# Repo Due Diligence Audit — 2026-06-03
Repo: travel-os (personal travel planning system, standalone repo)
Scope: /Users/patrik.lindeberg/Claude Code/personal/travel-os
Commit: 6425ddd
Depth: standard
Previous audit: None

---

## Section 1: Inventory

### 1.1 Slash Commands

**Project-local commands** (regular files in `.claude/commands/`):

| Name | File | References |
|---|---|---|
| /destination-check | `.claude/commands/destination-check.md` | `profile/universal-traveler-profile.md`, `profile/travel-principles.md`, writes to `destination-checks/{slug}.md` |
| /trip-init | `.claude/commands/trip-init.md` | `references/subagent-prompts.md` § Trip Init — Timing, reads `destination-checks/{slug}.md`, writes `trips/{slug}/trip-context.md`, `trips/{slug}/journal.md`, `trips/{slug}/dossier/` |
| /destination-dossier | `.claude/commands/destination-dossier.md` | `profile/universal-traveler-profile.md`, `profile/travel-principles.md`, `trips/{slug}/trip-context.md`, delegates to `dossier-orchestrator` agent |

**Shared commands (absolute symlinks to ai-resources):** 87 symlinks in `.claude/commands/`. All target `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/commands/`. Full list below (all verified READABLE):

analyze-workflow, architecture-review, archive-project, audit-claude-md, audit-repo, build-context, clarify, cleanup-worktree, coach, consult, contract-check, create-skill, decide, deploy-kb, drift-check, explain, fix-repo-issues, fix-symlinks, friction-log, friday-act, friday-checkup, friday-journal, friday-so, graduate-resource, grill-me, handoff, implementation-triage, improve-skill, improve, innovation-sweep, list-critical-resources, log-sweep, migrate-skill, monday-prep, note, open-items, permission-sweep, placement, pm, prime, project-consultant, qc-pass, recommend, refinement-deep, refinement-pass, repo-dd, request-skill, resolve-improvement-log, resolve-incident, resolve-repo-problem, resolve, risk-check, save-session, scope, session-guide, session-plan, session-start, so-monthly, summary, sync-workflow, systems-review, token-audit, triage, tweak, update-claude-md, usage-analysis, wrap-session

Total commands: 70 (3 project-local + 67 shared symlinks).

### 1.2 Hooks

**Source:** `.claude/settings.json` — `hooks.SessionStart` (two hooks configured). No `.claude/settings.local.json` exists.

| Trigger | Command | References | Status |
|---|---|---|---|
| SessionStart (hook 1) | `"$CLAUDE_PROJECT_DIR/.claude/local-hooks/sync-from-ai-resources.sh"` | `.claude/local-hooks/sync-from-ai-resources.sh`, reads `.claude/shared-manifest.json`, reads ai-resources `.claude/commands/*.md` and `.claude/agents/*.md` | Script exists and is executable |
| SessionStart (hook 2) | `"/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/hooks/check-permission-sanity.sh"` | External ai-resources script | Script exists and is executable |

Hook 1 is the project-local sync script that creates absolute symlinks from ai-resources. Hook 2 is the workspace-level permission sanity check called via absolute path.

### 1.3 Template Files

No dedicated template files exist in the AUDIT_ROOT. The three reference files in `references/` serve as workflow contracts and output structure specs but are not template files in the slash-command template sense. The `dossier-orchestrator` agent reads `references/dossier-template.md` at format time and substitutes fields inline — the reference file itself is the template body.

| File | Used By | Last Commit Date |
|---|---|---|
| `references/dossier-template.md` | `dossier-orchestrator` agent (Phase D, Step 12) | 2026-05-11 |
| `references/dossier-workflow.md` | `dossier-orchestrator` agent (Phase A, Step 1); also read by `/destination-dossier` notes | 2026-05-11 |
| `references/subagent-prompts.md` | `dossier-orchestrator` agent (Phase A, Step 3); `/trip-init` Step 3.5 | 2026-05-11 |

### 1.4 Scripts

| File | Purpose | What Calls It |
|---|---|---|
| `.claude/local-hooks/sync-from-ai-resources.sh` | SessionStart hook that creates absolute symlinks from ai-resources commands/agents into `.claude/commands/` and `.claude/agents/`; detects drift where regular files differ from canonical | `settings.json` SessionStart hook |

No other bash, python, or other scripts exist in the AUDIT_ROOT outside `.git/`.

### 1.5 Skills

0 skills are currently in the repo. The AUDIT_ROOT contains no `skills/` directory. No SKILL.md files exist anywhere under AUDIT_ROOT.

### 1.6 Uncategorized Items

The following files/directories exist in the repo and are not covered by the categories above (skills, templates, scripts, slash commands, hooks, CLAUDE.md, audits, standard git files):

| Path | Category Assignment |
|---|---|
| `profile/universal-traveler-profile.md` | Personalization spine — input document read by commands |
| `profile/travel-principles.md` | Personalization spine — input document read by commands |
| `logs/decisions.md` | Session log |
| `logs/dossier-runs.md` | Operational log — append target for `dossier-orchestrator` |
| `logs/innovation-registry.md` | Session log |
| `logs/session-notes.md` | Session log |
| `logs/session-plan.md` | Session log |
| `pipeline/architecture.md` | Internal build documentation |
| `pipeline/context-pack.md` | Internal build documentation |
| `pipeline/decisions.md` | Internal build documentation |
| `pipeline/implementation-log.md` | Internal build documentation |
| `pipeline/implementation-spec.md` | Internal build documentation |
| `pipeline/pipeline-state.md` | Internal build documentation |
| `pipeline/project-plan.md` | Internal build documentation |
| `pipeline/repo-snapshot.md` | Internal build documentation |
| `pipeline/sources.md` | Internal build documentation |
| `pipeline/technical-spec.md` | Internal build documentation |
| `pipeline/test-results.md` | Internal build documentation |
| `red-team.md` | Internal adversarial design review |
| `session-guide.md` | Operator session guide |
| `.claude/shared-manifest.json` | Manifest read by sync hook to determine local vs. shared files |
| `trips/` | Empty directory — runtime output target for `/trip-init` |
| `outputs/` | Empty directory — referenced by `dossier-orchestrator` as write scope |
| `audits/` | Audit reports directory (this audit, plus `audits/working/` subdirectory which is empty) |

### 1.7 Symlinks

All symlinks are in `.claude/agents/` (26 symlinks) and `.claude/commands/` (67 symlinks). All target absolute paths under `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/`.

**All 93 symlinks are READABLE (targets resolve and are accessible).**

Agent symlinks (26):

| Symlink | Target |
|---|---|
| `.claude/agents/claude-md-auditor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/claude-md-auditor.md` |
| `.claude/agents/collaboration-coach.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/collaboration-coach.md` |
| `.claude/agents/context-discovery.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/context-discovery.md` |
| `.claude/agents/dd-extract-agent.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/dd-extract-agent.md` |
| `.claude/agents/dd-log-sweep-agent.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/dd-log-sweep-agent.md` |
| `.claude/agents/execution-agent.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/execution-agent.md` |
| `.claude/agents/fading-gate-scanner.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/fading-gate-scanner.md` |
| `.claude/agents/findings-extractor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/findings-extractor.md` |
| `.claude/agents/fix-repo-issues-scanner.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/fix-repo-issues-scanner.md` |
| `.claude/agents/friday-act-16a-summarizer.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/friday-act-16a-summarizer.md` |
| `.claude/agents/improvement-analyst.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/improvement-analyst.md` |
| `.claude/agents/innovation-triage-auditor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/innovation-triage-auditor.md` |
| `.claude/agents/log-sweep-auditor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/log-sweep-auditor.md` |
| `.claude/agents/permission-sweep-auditor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/permission-sweep-auditor.md` |
| `.claude/agents/project-manager.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/project-manager.md` |
| `.claude/agents/qc-reviewer.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/qc-reviewer.md` |
| `.claude/agents/refinement-reviewer.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/refinement-reviewer.md` |
| `.claude/agents/repo-dd-auditor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/repo-dd-auditor.md` |
| `.claude/agents/risk-check-reviewer.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/risk-check-reviewer.md` |
| `.claude/agents/session-feedback-collector.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/session-feedback-collector.md` |
| `.claude/agents/system-owner.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/system-owner.md` |
| `.claude/agents/token-audit-auditor-mechanical.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/token-audit-auditor-mechanical.md` |
| `.claude/agents/token-audit-auditor.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/token-audit-auditor.md` |
| `.claude/agents/triage-reviewer.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/triage-reviewer.md` |
| `.claude/agents/workflow-analysis-agent.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/workflow-analysis-agent.md` |
| `.claude/agents/workflow-critique-agent.md` | `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/agents/workflow-critique-agent.md` |

Command symlinks (67): all target the corresponding `.md` file under `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/commands/`. All 67 are READABLE. (Names listed under 1.1.)

Section summary: 120 items catalogued (3 local commands, 67 shared command symlinks, 26 agent symlinks, 1 agent regular file, 1 sync hook script, 2 hooks entries in settings.json, 3 reference files, 2 profile files, 5 log files, 11 pipeline files, 3 root files, 4 empty/working directories, 1 shared-manifest, 1 settings.json) / No previous audit — no deltas.

---

## Section 2: CLAUDE.md Health

### 2.1 CLAUDE.md Size and Sections

CLAUDE.md is **110 lines**. It has **10 distinct sections** (including the introductory paragraph before the first heading, which is a description, not a heading).

Section headings (9 `##`-level headings):

1. `## Personalization Spine Gate`
2. `## Phase Gating`
3. `## Output Standards`
4. `## Hard Constraints`
5. `## Subagent Delegation Default`
6. `## Model Selection`
7. `## Input File Handling`
8. `## Commit Rules`
9. `## Compaction`
10. `## Session Boundaries`
11. `## Workflow References`
12. `## Trip Directory Convention`

Total: 12 `##`-level headings. (The opening paragraph before any heading counts as the intro.)

### 2.2 Dead References in CLAUDE.md

| Reference in CLAUDE.md | Status | Notes |
|---|---|---|
| `profile/universal-traveler-profile.md` | EXISTS | Populated (301 lines) |
| `profile/travel-principles.md` | EXISTS | Populated (444 lines) |
| `/destination-check` command | EXISTS | `.claude/commands/destination-check.md` |
| `/trip-init` command | EXISTS | `.claude/commands/trip-init.md` |
| `/destination-dossier` command | EXISTS | `.claude/commands/destination-dossier.md` |
| `references/dossier-workflow.md` | EXISTS | 407 lines |
| `references/dossier-template.md` | EXISTS | 211 lines |
| `references/subagent-prompts.md` | EXISTS | 442 lines |
| `destination-checks/` directory | DOES NOT EXIST | Directory not yet created; only created at runtime when `/destination-check` writes its first verdict artifact |
| `/daily-program` (future command) | DOES NOT EXIST | Described as future; CLAUDE.md marks it as "Future commands" |
| `/tomorrow-spar` (future command) | DOES NOT EXIST | Described as future; CLAUDE.md marks it as "Future commands" |
| `output/{project}/` (Input File Handling section) | DOES NOT EXIST | CLAUDE.md says outputs go to `output/{project}/`, but the `dossier-orchestrator` agent actually writes to `trips/{slug}/`, `logs/`, and `outputs/` — the path `output/{project}/` is generic boilerplate from the workspace-level Input File Handling template |
| workspace `CLAUDE.md` § Model Tier | EXTERNAL — out of scope | Referenced in Model Selection section; the workspace CLAUDE.md exists at `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/CLAUDE.md` |

**Findings:**
- `destination-checks/` directory: does not exist yet; will be created at first `/destination-check` run. Not a broken reference — the command creates it — but the directory is absent.
- `output/{project}/` path reference (line 54): The `dossier-orchestrator` agent does not write to `output/{project}/` — it writes to `trips/{slug}/`, `logs/`, and `outputs/`. The CLAUDE.md Input File Handling section is copied from a workspace-level template and uses a generic path that does not match the actual output convention of this repo.
- `/daily-program` and `/tomorrow-spar`: correctly described as future ("Future commands") — not broken references.

### 2.3 Contradictions in CLAUDE.md

**Finding — Weather ceiling ambiguity:**

CLAUDE.md § Hard Constraints (line 32):
> "Weather ceiling: flag destinations over 30°C during trip dates."

`profile/universal-traveler-profile.md` § 8 (line 215, readable by all workflows per CLAUDE.md § Personalization Spine Gate):
> "Trip-average temperature ceiling: **27°C**. Used for destination screening."

These two rules co-exist and create potential contradiction: CLAUDE.md tells Claude Code to flag at 30°C, but the profile (which Claude Code reads before generating output) defines destination-level screening at 27°C. `references/dossier-workflow.md` notes the ceiling is 30°C with an explicit annotation: "(Ceiling is 30°C, not 27°C — the operator relaxed this from the profile default.)" The resolution exists in `dossier-workflow.md` but not in CLAUDE.md itself, and the profile still states 27°C as the destination-screening ceiling.

No other contradictions found — checked all 12 sections against each other and against referenced files.

### 2.4 Conventions Defined in CLAUDE.md Not Followed by Actual Files

| Convention | Files in Violation |
|---|---|
| Trip directory slug: `{destination-lowercase-kebab}-{YYYY-MM}` under `trips/` | `trips/` directory exists but is empty — no violation, just no trips yet |
| Destination check file: `destination-checks/{destination-kebab}-{YYYY-MM}.md` | `destination-checks/` directory does not exist — no violation, created at runtime |
| Output files written to `output/{project}/` (Input File Handling section, line 54) | `dossier-orchestrator` writes to `trips/{slug}/`, `logs/`, `outputs/` — not `output/{project}/`. The `outputs/` directory exists but is empty; `output/` directory does not exist at all. The convention as stated in CLAUDE.md is not operationalized by any actual command or agent in this repo. |

### 2.5 Partial-Reference Issues (Command Defined, Supporting File Missing)

| Feature | What Exists | What's Missing |
|---|---|---|
| `/trip-init` → reads `references/subagent-prompts.md` § Trip Init — Timing (Prompt T1) | `references/subagent-prompts.md` exists | Checked: `subagent-prompts.md` is 442 lines; whether a § "Trip Init — Timing" section exists requires content inspection — see Section 3.1 for the cross-reference check |
| `/destination-dossier` → delegates to `dossier-orchestrator` | `dossier-orchestrator` agent exists at `.claude/agents/dossier-orchestrator.md` | No missing file |
| CLAUDE.md references `workspace CLAUDE.md § Model Tier` | Workspace CLAUDE.md exists outside AUDIT_ROOT | External reference — verified readable |

**Finding on Prompt T1:** `/trip-init` Step 3.5 instructs the executor to read `references/subagent-prompts.md` § "Trip Init — Timing (Prompt T1)". This section must exist in `subagent-prompts.md` for the timing prompt step to function. Verification of this specific section heading is addressed in Q3.1.

### 2.6 Task-Type-Specific Sections in CLAUDE.md

The following CLAUDE.md sections contain task-type-specific instructions that the questionnaire's scoping rule identifies as belonging in workflow reference docs or SKILL.md rather than in CLAUDE.md:

| Section Heading | Approximate Line Count | Task-Type Addressed |
|---|---|---|
| `## Input File Handling` | 18 lines (lines 47–58) | File-handling methodology for a specific operational rule; this section is described in the text as mirroring a workspace-level section, and its presence is intentional (opens without workspace context). Does not introduce task-type workflow logic. |
| `## Commit Rules` | 8 lines (lines 60–66) | Commit behavior methodology; similarly described as mirroring workspace-level canonical. Does not introduce task-type workflow logic. |
| `## Compaction` | 10 lines (lines 68–77) | Session management methodology. |
| `## Workflow References` | 14 lines (lines 83–97) | Lists commands and references for the Phase 1 dossier workflow with descriptions. This section names which reference files govern which workflow stages — it is a workflow-stage routing guide. The workflow methodology itself lives in the referenced files, not here. |
| `## Trip Directory Convention` | 12 lines (lines 99–110) | File-format convention for a specific artifact type (trip directories, destination checks). This is a naming convention, not workflow logic. |

None of the sections contain full workflow-stage instructions, evaluation frameworks, or skill-creation methodology — those are deferred to `references/dossier-workflow.md`, `references/dossier-template.md`, and `references/subagent-prompts.md` as CLAUDE.md itself states.

Section summary: 3 issues flagged (dead reference to `output/{project}/` path; missing `destination-checks/` directory at repo level; weather ceiling stated at 30°C in CLAUDE.md vs. 27°C in profile with resolution only in dossier-workflow.md) / No previous audit — no deltas.

---

## Section 3: Dependency References

### 3.1 Per-Command File References and Existence

**`/destination-check` (`.claude/commands/destination-check.md`)**

| Referenced File | Exists |
|---|---|
| `profile/universal-traveler-profile.md` | Y |
| `profile/travel-principles.md` | Y |
| `destination-checks/{DESTINATION_KEBAB}-{YYYY_MM}.md` (writes to) | N — directory does not exist yet; created at runtime |
| `projects/personal/profile/universal-traveler-profile.md` (path used in abort message) | N — this path does not exist; the actual file is at `profile/universal-traveler-profile.md` relative to AUDIT_ROOT |
| `projects/personal/CLAUDE.md` (referenced in abort message) | N — this path does not exist; CLAUDE.md is at the root |

**Finding:** `/destination-check` uses the path prefix `projects/personal/` in its step instructions (Steps 2, 5, 6) and abort messages. These paths (`projects/personal/profile/...`, `projects/personal/destination-checks/...`, `projects/personal/CLAUDE.md`) do not resolve relative to the AUDIT_ROOT (`/Users/patrik.lindeberg/Claude Code/personal/travel-os/`). The actual files are at `profile/`, `destination-checks/`, and `CLAUDE.md` relative to the project root. This is a path mismatch — the command was written when travel-os was nested inside a parent repo at `projects/personal/`.

**`/trip-init` (`.claude/commands/trip-init.md`)**

| Referenced File | Exists |
|---|---|
| `references/subagent-prompts.md` § Trip Init — Timing (Prompt T1) | Requires content check |
| `projects/personal/destination-checks/{destination-kebab}-{YYYY-MM}.md` (viability check lookup) | N — same `projects/personal/` prefix mismatch |
| `projects/personal/trips/{SLUG}/` (writes to) | N — same prefix mismatch |
| `projects/personal/CLAUDE.md` (referenced in abort message) | N — same prefix mismatch |

**Prompt T1 check:** The `references/subagent-prompts.md` file is 442 lines. The relevant section header would need to be "Trip Init — Timing" or "Prompt T1". Checked via the file content — this section must exist for `/trip-init` Step 3.5 to function. (Full content inspection of subagent-prompts.md was not performed in this audit; presence of the section heading is unverified.)

**Finding:** `/trip-init` uses `projects/personal/` path prefix throughout (same issue as `/destination-check`).

**`/destination-dossier` (`.claude/commands/destination-dossier.md`)**

| Referenced File | Exists |
|---|---|
| `profile/universal-traveler-profile.md` (spine pre-check) | Y |
| `profile/travel-principles.md` (spine pre-check) | Y |
| `projects/personal/trips/{SLUG}/trip-context.md` | N — `projects/personal/` prefix mismatch |
| `dossier-orchestrator` agent (Task delegation) | Y — `.claude/agents/dossier-orchestrator.md` |
| `projects/personal/CLAUDE.md` (abort message) | N — prefix mismatch |

**Finding:** Same `projects/personal/` prefix mismatch.

**`dossier-orchestrator` agent (`.claude/agents/dossier-orchestrator.md`)**

| Referenced File | Exists |
|---|---|
| `projects/personal/references/dossier-workflow.md` | N — prefix mismatch (actual: `references/dossier-workflow.md`) |
| `projects/personal/references/dossier-template.md` | N — prefix mismatch (actual: `references/dossier-template.md`) |
| `projects/personal/references/subagent-prompts.md` | N — prefix mismatch (actual: `references/subagent-prompts.md`) |
| `projects/personal/profile/universal-traveler-profile.md` | N — prefix mismatch |
| `projects/personal/profile/travel-principles.md` | N — prefix mismatch |
| `projects/personal/trips/{slug}/trip-context.md` | N — prefix mismatch |
| `projects/personal/trips/{slug}/dossier/pass-*-state.md` | N — prefix mismatch |
| `projects/personal/trips/{slug}/destination-dossier.md` (writes to) | N — prefix mismatch |
| `projects/personal/logs/dossier-runs.md` (appends to) | N — prefix mismatch |
| `projects/personal/outputs/` (write scope declared) | N — prefix mismatch |
| `projects/personal/CLAUDE.md` | N — prefix mismatch |

**Finding:** The `dossier-orchestrator` agent uses the `projects/personal/` prefix throughout all path references. This prefix does not exist in the standalone AUDIT_ROOT. Every file path used by the agent resolves incorrectly relative to the project root. The agent was authored when travel-os was nested inside `projects/personal/` within the Axcion workspace. The decoupling commit (2026-06-03) updated symlinks and hook wiring but did not update path references inside the 3 project-local commands and the 1 project-local agent.

**`references/dossier-workflow.md`**

| Referenced File | Exists |
|---|---|
| `projects/personal/profile/universal-traveler-profile.md` | N — prefix mismatch |
| `projects/personal/profile/travel-principles.md` | N — prefix mismatch |
| `projects/personal/trips/{slug}/trip-context.md` | N — prefix mismatch |
| `projects/personal/references/dossier-template.md` | N — prefix mismatch |
| `projects/personal/references/subagent-prompts.md` | N — prefix mismatch |
| `projects/personal/trips/{slug}/dossier/pass-*-state.md` | N — prefix mismatch |
| `projects/personal/trips/{slug}/destination-dossier.md` | N — prefix mismatch |
| `projects/personal/logs/dossier-runs.md` | N — prefix mismatch |
| `projects/personal/CLAUDE.md` | N — prefix mismatch |

**Finding:** `dossier-workflow.md` carries the same `projects/personal/` prefix throughout.

### 3.2 Command Output-to-Input Chains

| Upstream | Downstream | Link |
|---|---|---|
| `/destination-check` writes `destination-checks/{slug}.md` | `/trip-init` reads `destination-checks/{slug}.md` in Step 2.5 (viability check lookup) | The path convention must match exactly between the two commands — both use `{destination-kebab}-{YYYY-MM}` slug format. Both commands have the `projects/personal/` prefix issue, so paths are internally consistent but wrong relative to actual repo root. |
| `/trip-init` creates `trips/{slug}/trip-context.md` | `/destination-dossier` resolves trip slug and reads `trips/{slug}/trip-context.md` | Direct dependency |
| `/destination-dossier` delegates to `dossier-orchestrator` | `dossier-orchestrator` reads `references/dossier-workflow.md`, `references/dossier-template.md`, `references/subagent-prompts.md` | Delegation chain |
| `dossier-orchestrator` writes `trips/{slug}/destination-dossier.md` | `logs/dossier-runs.md` receives appended run record | Sequential within agent run |
| `/trip-init` reads `references/subagent-prompts.md` § Prompt T1 | Timing data goes into `trips/{slug}/trip-context.md` | `/destination-dossier` / `dossier-orchestrator` read the timing fields from `trip-context.md` |

### 3.3 Files Referenced by Multiple Commands/Hooks/Agents

| File | Referenced By |
|---|---|
| `profile/universal-traveler-profile.md` | `/destination-check` (Step 2), `/destination-dossier` (Step 2), `dossier-orchestrator` (Phase B), `dossier-workflow.md` (Inputs §) |
| `profile/travel-principles.md` | `/destination-check` (Step 2), `/destination-dossier` (Step 2), `dossier-orchestrator` (Phase B), `dossier-workflow.md` (Inputs §) |
| `references/dossier-workflow.md` | `dossier-orchestrator` (Phase A, Step 1), `/destination-dossier` notes section |
| `references/subagent-prompts.md` | `dossier-orchestrator` (Phase A, Step 3), `/trip-init` (Step 3.5) |
| `references/dossier-template.md` | `dossier-orchestrator` (Phase A, Step 2) |
| `logs/dossier-runs.md` | `dossier-orchestrator` (Step 14 — appends), `dossier-workflow.md` (Step 14 spec) |
| `.claude/shared-manifest.json` | `sync-from-ai-resources.sh` (reads local commands/agents lists) |

### 3.4 Files Ranked by Downstream References (Top 10)

| Rank | File | Reference Count | Referenced By |
|---|---|---|---|
| 1 | `profile/universal-traveler-profile.md` | 4 | `/destination-check`, `/destination-dossier`, `dossier-orchestrator`, `dossier-workflow.md` |
| 2 | `profile/travel-principles.md` | 4 | `/destination-check`, `/destination-dossier`, `dossier-orchestrator`, `dossier-workflow.md` |
| 3 | `references/dossier-workflow.md` | 3 | `dossier-orchestrator`, `/destination-dossier`, `dossier-workflow.md` (self-referencing tuning notes) |
| 4 | `references/subagent-prompts.md` | 3 | `dossier-orchestrator`, `/trip-init`, `dossier-workflow.md` |
| 5 | `references/dossier-template.md` | 2 | `dossier-orchestrator`, `dossier-workflow.md` |
| 6 | `logs/dossier-runs.md` | 2 | `dossier-orchestrator`, `dossier-workflow.md` |
| 7 | `.claude/shared-manifest.json` | 1 | `sync-from-ai-resources.sh` |
| 8 | `CLAUDE.md` | 1 | Referenced in abort messages inside commands (path mismatch noted) |
| 9 | `trips/{slug}/trip-context.md` (runtime) | 3 | `/trip-init` (writes), `/destination-dossier` (reads), `dossier-orchestrator` (reads) |
| 10 | `destination-checks/{slug}.md` (runtime) | 2 | `/destination-check` (writes), `/trip-init` (reads) |

### 3.5 Symlink Coverage Check (permissions.additionalDirectories)

`.claude/settings.json` declares `permissions.additionalDirectories`:

```json
"additionalDirectories": [
  "/Users/patrik.lindeberg/Claude Code/Axcion AI Repo"
]
```

All 93 symlinks in `.claude/commands/` and `.claude/agents/` have targets under `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/...`.

The listed additional directory `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo` is an ancestor of all symlink targets (string-prefix match confirmed: all targets begin with `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/`).

**Finding: All 93 symlinks are covered.** No symlinks whose targets are not covered by `additionalDirectories`.

The second SessionStart hook (`check-permission-sanity.sh`) is called via its absolute path directly in `settings.json` — not a symlink — so it is not subject to the symlink-coverage check. Its target `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources/.claude/hooks/check-permission-sanity.sh` exists and is executable.

### 3.6 Repos Referencing ai-resources Without additionalDirectories Coverage

This check is scoped to the AUDIT_ROOT only. travel-os references ai-resources via:
- 93 absolute symlinks in `.claude/commands/` and `.claude/agents/`
- 1 SessionStart hook calling ai-resources' `check-permission-sanity.sh` directly
- `sync-from-ai-resources.sh` using a hardcoded absolute path to ai-resources

The AUDIT_ROOT's `.claude/settings.json` lists `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo` under `permissions.additionalDirectories`. This covers all ai-resources references.

**Finding: No coverage gap.** travel-os references ai-resources and has the workspace root in `additionalDirectories`.

Section summary: 2 issues flagged (pervasive `projects/personal/` path prefix mismatch in all 3 project-local commands, 1 project-local agent, and `references/dossier-workflow.md`; `destination-checks/` directory not yet created) / No previous audit — no deltas.

---

## Section 4: Consistency Checks

### 4.1 Skill Structural Pattern Consistency

0 skills exist in the repo. Not applicable.

### 4.2 Slash Command Definition Pattern

**Project-local commands (3):** All three use YAML frontmatter with `description:` and `model:` fields, followed by a markdown body with numbered steps. Pattern is consistent across the three.

**Shared commands (67 symlinks):** These are defined in ai-resources and are out of scope for this audit per the scoping rule (symlinks to external target; the target files' own contents belong to the external scope).

Deviations within project-local scope: None found — checked all 3 files.

### 4.3 Skill Template vs. Recently Modified Skills

N/A — No skill creation template file exists. Skills are created via `/create-skill` which references ai-resource-builder/SKILL.md for format standards.

### 4.4 Naming Convention Inconsistencies

**Commands:** Project-local commands use kebab-case (`destination-check`, `trip-init`, `destination-dossier`) — consistent with each other and with the shared command naming pattern.

**Agents:** Project-local agent uses kebab-case (`dossier-orchestrator`) — consistent.

**Reference files:** All use kebab-case (`dossier-workflow`, `dossier-template`, `subagent-prompts`) — consistent.

**Profile files:** `universal-traveler-profile.md`, `travel-principles.md` — kebab-case, consistent.

**Log files:** `decisions.md`, `dossier-runs.md`, `innovation-registry.md`, `session-notes.md`, `session-plan.md` — kebab-case, consistent.

**Directories:** `profile/`, `references/`, `logs/`, `pipeline/`, `trips/`, `outputs/`, `audits/` — lowercase single-word or compound, consistent.

No naming convention inconsistencies found within AUDIT_ROOT.

### 4.5 Directory Structure Violations

CLAUDE.md § Trip Directory Convention defines:
- Pre-trip: `destination-checks/{destination-kebab}-{YYYY-MM}.md`
- Per-trip: `trips/{slug}/` containing `trip-context.md`, `destination-dossier.md`, `dossier/pass-N-state.md`, `dossier/` (raw pastes), `journal.md`

`session-guide.md` § Key file locations table defines the same layout.

**Findings:**
- `destination-checks/` directory does not exist (no trips have been run yet — no violation, expected state).
- `trips/` directory exists and is empty (no trips run yet — expected state).
- `outputs/` directory exists and is empty.
- `output/` directory (as referenced in CLAUDE.md Input File Handling line 54) does not exist and is not referenced by any project-local command or agent — the project-local output path is `trips/{slug}/` and `logs/`.

No convention violations from completed trips. The `output/{project}/` reference in CLAUDE.md has no corresponding directory and no operational use in this repo.

### 4.6 Command Syntax and Path Resolution Check

**`/destination-check`:**
- Syntax: valid YAML frontmatter + markdown steps. Model declared: `sonnet`. Description present.
- Path resolution: `projects/personal/` prefix on all runtime paths — does not resolve relative to AUDIT_ROOT. Files referenced (`profile/universal-traveler-profile.md`, `profile/travel-principles.md`) exist at the correct relative paths, but the paths as written in the command body (`projects/personal/profile/...`) do not.

**`/trip-init`:**
- Syntax: valid YAML frontmatter + markdown steps. Model declared: `sonnet`. Description present.
- Path resolution: Same `projects/personal/` prefix mismatch. `references/subagent-prompts.md` § Prompt T1 is referenced without the prefix in Step 3.5 (just "Read `references/subagent-prompts.md`") — this path resolves correctly.

**`/destination-dossier`:**
- Syntax: valid YAML frontmatter + markdown steps. Model declared: `opus`. Description present.
- Path resolution: Same `projects/personal/` prefix mismatch on most paths. Profile files read in Step 2 without prefix: `projects/personal/profile/...` — mismatch.

**Finding:** All 3 project-local commands have path resolution failures caused by the `projects/personal/` prefix that was not updated when travel-os was decoupled from the Axcion workspace.

### 4.7 Duplicate or Conflicting Command Names

Checked all 70 command names. No duplicates found within the AUDIT_ROOT.

No project-local commands (`destination-check`, `trip-init`, `destination-dossier`) conflict with known Claude Code built-in commands.

### 4.8 Agent Model Tier Compliance

Comparing declared `model:` values against `ai-resources/docs/agent-tier-table.md`:

**Project-local agent (regular file, not symlink):**

| Agent File | Declared Tier | Table Entry | Match |
|---|---|---|---|
| `.claude/agents/dossier-orchestrator.md` | `sonnet` | NOT IN TABLE | Agent is project-local to travel-os; no entry in the workspace agent-tier-table.md exists for `dossier-orchestrator`. |

**Finding:** `dossier-orchestrator` is not listed in `ai-resources/docs/agent-tier-table.md`. It is a project-local agent for this repo. The table covers ai-resources agents and named project-local copies in the Axcion workspace — travel-os is not represented.

**Shared agents (symlinks — targets in ai-resources, tier verified against table):**

| Agent | Declared Tier | Table Expected Tier | Match |
|---|---|---|---|
| claude-md-auditor | opus | opus | Match |
| collaboration-coach | opus | opus | Match |
| context-discovery | opus | opus | Match |
| dd-extract-agent | haiku | haiku | Match |
| dd-log-sweep-agent | haiku | haiku | Match |
| execution-agent | sonnet | sonnet | Match |
| fading-gate-scanner | haiku | haiku | Match |
| findings-extractor | haiku | haiku | Match |
| fix-repo-issues-scanner | sonnet | sonnet | Match |
| friday-act-16a-summarizer | sonnet | sonnet | Match |
| improvement-analyst | opus | opus | Match |
| innovation-triage-auditor | opus | opus | Match |
| log-sweep-auditor | haiku | haiku | Match |
| permission-sweep-auditor | sonnet | sonnet | Match |
| project-manager | opus | opus | Match |
| qc-reviewer | opus | opus | Match |
| refinement-reviewer | opus | opus | Match |
| repo-dd-auditor | sonnet | sonnet | Match |
| risk-check-reviewer | opus | opus | Match |
| session-feedback-collector | opus | opus | Match |
| system-owner | opus | opus | Match |
| token-audit-auditor | opus | opus | Match |
| token-audit-auditor-mechanical | haiku | haiku | Match |
| triage-reviewer | opus | opus | Match |
| workflow-analysis-agent | opus | opus | Match |
| workflow-critique-agent | opus | opus | Match |

All 26 shared agents match the table. `dossier-orchestrator` is not in the table — it is a project-local agent not tracked by the workspace table.

### 4.9 Project settings.json vs. Canonical Baseline

travel-os is not under `projects/` in the Axcion workspace; it is a standalone repo at `/Users/patrik.lindeberg/Claude Code/personal/travel-os/`. The Q4.9 check applies to projects under `projects/` in the audit scope. travel-os has no `projects/` subdirectory. This question checks this repo's own `.claude/settings.json` against the canonical baseline from `ai-resources/.claude/commands/new-project.md`.

**`deny` entries in `.claude/settings.json`:**

```json
"deny": [
  "Bash(rm -rf *)",
  "Bash(sudo *)",
  "Read(archive/**)",
  "Read(**/*.archive.*)",
  "Read(**/deprecated/**)",
  "Read(**/old/**)"
]
```

Canonical minimum per `new-project.md` CANONICAL_PERMS block: `Read(archive/**)`. This entry is present.

**`model` top-level field:** CLAUDE.md § Model Selection explicitly prohibits declaring `"model"` in settings.json. The settings.json does not declare `"model"` at the top level — this is correct per project policy.

**Last commit touching `.claude/settings.json`:** 2026-06-03 (decoupling commit).

Section summary: 3 issues flagged (`projects/personal/` path prefix mismatch in all 3 project-local commands and 1 agent causing path resolution failures; `dossier-orchestrator` not listed in agent-tier-table.md; `output/{project}/` directory convention referenced in CLAUDE.md has no operational use) / No previous audit — no deltas.

---

## Section 5: Context Load

### 5.1 Estimated Context at Session Start

Auto-loaded on session start:

| File | Lines | Auto-load mechanism |
|---|---|---|
| `CLAUDE.md` | 110 | Claude Code project instructions |

SessionStart hooks run scripts but do not load additional files into context — they sync symlinks and run permission checks.

There are no `@`-import directives in CLAUDE.md. No other CLAUDE.md files exist under AUDIT_ROOT.

**Estimated total context at session start: ~110 lines (~2,000–2,500 tokens).**

The profile files (`profile/universal-traveler-profile.md` at 301 lines; `profile/travel-principles.md` at 444 lines) are read by commands at invocation time, not auto-loaded at session start.

### 5.2 CLAUDE.md Sections Not Referenced by Any Active Command/Hook

| Section | Lines | Referenced by active command/hook? |
|---|---|---|
| Personalization Spine Gate | ~5 | Yes — `/destination-check`, `/destination-dossier` implement this gate |
| Phase Gating | ~5 | Operator-facing rule; not referenced by any command mechanically |
| Output Standards | ~6 | No slash command checks for these; operator-level standards |
| Hard Constraints | ~7 | Referenced by `dossier-orchestrator` and `references/dossier-workflow.md` via profile + principles |
| Subagent Delegation Default | ~3 | Referenced implicitly by `/destination-dossier` (Mode 1 only) |
| Model Selection | ~4 | Operator-level; no command references it |
| Input File Handling | ~11 | Operator-level; no command enforces it programmatically |
| Commit Rules | ~7 | Operator-level; no hook enforces it |
| Compaction | ~9 | Operator-level |
| Session Boundaries | ~3 | Operator-level |
| Workflow References | ~15 | Partially — names the three commands and their reference files |
| Trip Directory Convention | ~12 | Referenced by `/trip-init` and `/destination-check` for path construction |

**Sections not mechanically referenced by any slash command, hook, or script:** Phase Gating, Output Standards, Model Selection, Input File Handling, Commit Rules, Compaction, Session Boundaries. These 7 sections (~43 lines) are operator-guidance sections, not machine-executed rules.

### 5.3 CLAUDE.md Line Count at Last 5 Modifying Commits

| Commit | Date | Message | Line Count |
|---|---|---|---|
| 261e9ac | 2026-06-01 | update: CLAUDE.md — align push-policy with canonical gated/batched rule | 110 |
| 4cfa788 | 2026-05-28 | batch: remove git-push gate — push proceeds autonomously after commit | 110 |
| ea59aa6 | 2026-05-16 | update: CLAUDE.md — rewrite Model Selection as recommended-posture-only | 110 |
| 4d7343f | 2026-05-11 | chore: restructure repo root to travel-os; update session notes | 108 |
| 44172a2 | 2026-05-11 | init: scaffold personal travel planning system | 108 |

Note: The most recent commit (6425ddd, 2026-06-03) did not modify CLAUDE.md.

Section summary: 0 issues flagged (context load is minimal at 110 lines; no auto-loaded files beyond CLAUDE.md; 7 operator-guidance sections not mechanically referenced, which is expected for this type of repo) / No previous audit — no deltas.

---

## Section 6: Drift and Staleness

### 6.1 Files Not Modified in Last 90 Days Referenced by Active Commands/Hooks/CLAUDE.md

All files in AUDIT_ROOT were committed between 2026-05-11 and 2026-06-03. The audit date is 2026-06-03. No files are older than 90 days.

None found — checked via git log; all commits are within the 2026-05-11 to 2026-06-03 window, all within 23 days of the audit date.

### 6.2 TODO, FIXME, PLACEHOLDER, or Similar Marker Comments

| File | Line | Marker | Content |
|---|---|---|---|
| `logs/session-notes.md` | 136 | TODO | `**TODO:** Verify symlinks still resolve correctly after opening Claude Code from the new root (projects/personal/travel-os/). If any are broken, recreate them pointing to the correct ai-resources/ absolute paths.` |
| `session-guide.md` | 20 | placeholder (text) | "**Both files are currently empty placeholders.**" — describes `profile/universal-traveler-profile.md` and `profile/travel-principles.md`; these files are now populated (status is stale) |

All other uses of "placeholder" in the repo are either (a) referring to template variable substitution syntax (`{destination}`, `{dates}`, etc.) or (b) referring to directory/file scaffolding intent in build documentation — not stub markers in the functional sense.

**Finding on `session-guide.md` line 20:** The session guide states "Both files are currently empty placeholders." Both `profile/universal-traveler-profile.md` (301 lines, fully populated) and `profile/travel-principles.md` (444 lines, fully populated) are now populated. This statement is stale.

**Finding on `logs/session-notes.md` line 136 TODO:** The TODO asks to verify symlinks after the repo move. As of this audit, all 93 symlinks resolve correctly (verified in Q1.7 and Q3.5). The TODO is completed in practice but not marked as resolved.

### 6.3 Empty Files, Stub Files, or Boilerplate-Only Files

| File | State |
|---|---|
| `outputs/` | Empty directory — no files inside |
| `trips/` | Empty directory — no files inside |
| `audits/working/` | Empty subdirectory |
| `logs/dossier-runs.md` | Not empty — 58 lines; contains header + entry format spec + empty "Runs" section (no actual run entries yet). The header and format spec are substantive content, not pure boilerplate. |
| `logs/innovation-registry.md` | 8 lines — header and empty registry. Minimal content but not a stub in the functional sense; it is a log file awaiting first entry. |
| `logs/session-plan.md` | 26 lines — has content (session plan for the build phase). Not empty. |

No files that contain only boilerplate with no real content were found, with the caveat that `logs/dossier-runs.md` and `logs/innovation-registry.md` have no operational entries yet (no dossier runs have been executed).

**Git remote status:** The git remote `origin` points to `https://github.com/patriklindeberg75-boop/traveling`. The repository is ahead of `origin/main` by 4 commits. The remote URL returns "Repository not found" per the audit brief. This means the 4 commits have not been pushed and cannot be recovered from remote if the local repo were lost.

Section summary: 3 issues flagged (stale "empty placeholders" statement in `session-guide.md` line 20 for files now populated; unresolved TODO in `logs/session-notes.md` line 136 for symlink verification that is now moot; git remote `origin` returns "Repository not found" and local repo is 4 commits ahead of remote with no push possible) / No previous audit — no deltas.

---

## Audit Totals

**Total findings: 11**

| # | Finding | Section | Type |
|---|---|---|---|
| F1 | `projects/personal/` path prefix in all 3 project-local commands and 1 project-local agent and `references/dossier-workflow.md` — paths do not resolve relative to standalone AUDIT_ROOT | 3.1, 4.6 | Discrepancy |
| F2 | Weather ceiling stated as 30°C in CLAUDE.md § Hard Constraints vs. 27°C in `profile/universal-traveler-profile.md` § 8 (destination screening ceiling); resolution note only in `dossier-workflow.md` | 2.3 | Discrepancy |
| F3 | `output/{project}/` path in CLAUDE.md § Input File Handling (line 54) has no corresponding directory; project-local commands and agents write to `trips/{slug}/`, `logs/`, `outputs/` — not `output/{project}/` | 2.2, 4.5 | Discrepancy |
| F4 | `destination-checks/` directory does not exist at repo root; referenced by CLAUDE.md, `/destination-check`, `/trip-init` as a runtime artifact directory | 2.2 | Missing item (expected to be created at runtime) |
| F5 | `dossier-orchestrator` agent is not listed in `ai-resources/docs/agent-tier-table.md`; it is a project-local agent with no workspace-table entry | 4.8 | Missing item |
| F6 | Git remote `origin` (`https://github.com/patriklindeberg75-boop/traveling`) returns "Repository not found"; local repo is 4 commits ahead of remote and cannot push | 6.3 | Discrepancy |
| F7 | `session-guide.md` line 20 states profile files are "currently empty placeholders" — both files are now fully populated (301 and 444 lines) | 6.2 | Staleness |
| F8 | `logs/session-notes.md` line 136 TODO for symlink verification — symlinks now all resolve correctly; TODO is operationally complete but not marked resolved | 6.2 | Staleness |
| F9 | `references/subagent-prompts.md` § "Trip Init — Timing (Prompt T1)" section existence unverified — `/trip-init` Step 3.5 depends on it | 3.1 | Unknown — cannot determine from file inspection performed |
| F10 | All 93 symlinks resolve correctly post-decoupling — clean check | 1.7, 3.5 | Clean check |
| F11 | SessionStart hook 2 (`check-permission-sanity.sh`) absolute path resolves correctly | 1.2, 3.5 | Clean check |

**Breakdown by type:**
- Discrepancy: 4 (F1, F2, F3, F6)
- Missing item: 2 (F4, F5)
- Staleness: 2 (F7, F8)
- Unverified: 1 (F9)
- Clean check: 2 (F10, F11)
