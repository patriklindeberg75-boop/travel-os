# Repo Snapshot — personal

**Generated:** 2026-05-11 11:08 UTC
**Commit:** 33e6396
**Purpose:** Stage 3a inventory for the `personal` project (Personal Travel Planning System). Greenfield project — scaffold exists but no project-specific commands, workflows, or content files yet.

---

## CLAUDE.md Summary

### Workspace CLAUDE.md (`/CLAUDE.md`)
- **Lines:** 161, ~2,400 tokens
- **@imports:** None (references external docs via prose paths, not @import syntax)
- **Key behavioral rules:**
  - `ai-resources/` is the shared resource library; projects reference it, do not own it
  - Full autonomy posture — 10 explicit pause gates, all else proceeds automatically
  - Decision-Point Posture: pick and proceed, do not ask operator to choose
  - Commit directly without pre/post checks; no push without operator approval
  - Model tier: Sonnet for execution, Opus for judgment; declared per-project in CLAUDE.md
  - QC Independence Rule applies (context isolation, post-edit QC, triage auto-loop)
  - Session guardrails: `[HEAVY]`, `[SCOPE]`, `[AMBIGUOUS]`, `[COST]` flags — advisory, not blocking
  - File Write Discipline: input files are read-only; Write only against session output scope
  - CLAUDE.md scoping: no skill/workflow methodology in CLAUDE.md; use pointers only

### projects/personal/CLAUDE.md
- **Lines:** 79, ~1,200 tokens
- **@imports:** None
- **Key behavioral rules:**
  - Personalization Spine Gate: every user-facing output MUST read both `profile/universal-traveler-profile.md` and `profile/travel-principles.md` first; halt if either is empty/missing
  - Phase Gating: Phase 0 is hard prerequisite; phase transitions require Patrik's explicit approval
  - Output Standards: mobile-readable iPhone, paste-ready for Notes, map-ready where applicable
  - Hard Constraints: solo/1+ week only, 27°C ceiling, routine respected, no custom dashboard, anti-tourist filter active
  - Subagent Delegation Default: MVP uses manual handoff prompts (Mode 1); do not promote to API until manual version is proven
  - Model Selection: Sonnet 1M default; analytical commands declare `model: claude-opus-4-7` in frontmatter
  - Input File Handling: read-only references; operators may paste content for verbatim save
  - Commit Rules: commit directly; no push; remind to push and run `/wrap-session`
  - Compaction: preserve pipeline stage identifier, subagent output paths, pending operator gates
  - Session Boundaries: prefer `/clear` when switching between unrelated tasks

---

## Project Scaffold State

### What exists
| Path | Contents | State |
|------|----------|-------|
| `projects/personal/CLAUDE.md` | Full project rules (79 lines) | Populated |
| `projects/personal/.claude/settings.json` | Permissions + SessionStart hooks | Populated |
| `projects/personal/.claude/shared-manifest.json` | Declares no local-owned commands/agents | Populated |
| `projects/personal/.claude/commands/` | 73 commands (synced from ai-resources) | Synced via hook |
| `projects/personal/.claude/agents/` | 23 agents (synced from ai-resources) | Synced via hook |
| `projects/personal/pipeline/context-pack.md` | Full project context (143 lines) | Populated |
| `projects/personal/pipeline/project-plan.md` | Phased roadmap Phases 0–5 (157 lines) | Populated |
| `projects/personal/pipeline/technical-spec.md` | Architecture sketch (137 lines) | Populated |
| `projects/personal/pipeline/pipeline-state.md` | Stage tracking table | 3a in_progress |
| `projects/personal/pipeline/decisions.md` | Decision log (empty) | Empty |
| `projects/personal/pipeline/sources.md` | Input provenance | Populated |
| `projects/personal/profile/universal-traveler-profile.md` | Placeholder with instructions | **EMPTY PLACEHOLDER** |
| `projects/personal/profile/travel-principles.md` | Placeholder with instructions | **EMPTY PLACEHOLDER** |
| `projects/personal/logs/` | Directory | Empty |
| `projects/personal/outputs/` | Directory | Empty |
| `projects/personal/trips/` | Directory | Empty |

### What does NOT exist yet (to be created by Stage 4)
- Project-specific slash commands (e.g., `/destination-dossier`, `/daily-program`, `/trip-retro`)
- Project-specific agents (e.g., research delegation agents, synthesis agents)
- `trips/` content (per-trip subdirectories with dossiers, logs, day plans)
- Any workflow templates specific to travel planning
- No `skills/` symlink (skills accessed from `ai-resources/` via `additionalDirectories`)

### settings.json summary
- **defaultMode:** `bypassPermissions`
- **Allow:** all standard tools (`Bash(*)`, `Read`, `Edit`, `Write`, `MultiEdit`, `Agent`, `Skill`, `TodoWrite`, `Glob`, `Grep`, `WebFetch`, `WebSearch`, `NotebookEdit`, `ToolSearch`, `.claude/**` edits, `Bash(rm *)`)
- **Deny:** `git push*`, `rm -rf *`, `sudo *`, archive/deprecated/old file reads
- **additionalDirectories:** `/Users/patrik.lindeberg/Claude Code/Axcion AI Repo` (gives access to workspace root and ai-resources)
- **SessionStart hooks:** `auto-sync-shared.sh` (syncs commands/agents from ai-resources), `check-permission-sanity.sh`

---

## Personalization Spine Status

**Phase 0 prerequisite: NOT MET.**

Both profile files exist as placeholders only:
- `profile/universal-traveler-profile.md` — empty placeholder
- `profile/travel-principles.md` — empty placeholder

The CLAUDE.md Personalization Spine Gate halts all user-facing output generation until these are populated. Architecture design (Stage 3b) can proceed, but implementation (Stage 4) is blocked until Phase 0 is complete.

---

## Available ai-resources Library

All ai-resources content is accessible to the `personal` project via `additionalDirectories` pointing to the workspace root. The project's auto-sync hook copies all commands and agents from `ai-resources/.claude/` on SessionStart.

### Skill Inventory (70 skills in ai-resources/skills/)

| Name | Description (first 90 chars) | Lines |
|------|------------------------------|-------|
| ai-prose-decontamination | Four-pass sequential decontamination of AI writing patterns from prose. | 316 |
| ai-resource-builder | Creates, evaluates, and improves AI resources (skills, prompts, project... | 415 |
| analysis-pass-memo-review | Reviews cluster analysis memos and surfaces editorial decisions the operator | 117 |
| answer-spec-generator | Trigger when generating Answer Specs from research questions or Research Plans. | 487 |
| answer-spec-qc | Full quality review of Answer Specs before they enter execution as the binding | 207 |
| architecture-designer | Designs Claude Code architecture for implementation projects. Takes a project plan | 241 |
| architecture-qc | Independent QC of a report architecture specification produced by... | 202 |
| chapter-prose-reviewer | Diagnoses chapter draft quality across architecture compliance, structure... | 171 |
| chapter-review | Reviews a chapter draft against the research workflow's upstream artifacts | 203 |
| citation-converter | Converts report prose containing inline claim IDs into fully cited output | 254 |
| claude-code-workflow-builder | Adapts existing workflows for Claude Code execution. | 129 |
| cluster-analysis-pass | Produce a structured analytical memo from Research Extracts or compressed... | 160 |
| cluster-memo-refiner | Refines cluster analytical memos produced by cluster-analysis-pass. | 185 |
| cluster-synthesis-drafter | Draft preliminary prose sections from pre-analyzed cluster research inputs. | 134 |
| context-pack-builder | Transforms vague assignment descriptions into precise, AI-ready context packs | 233 |
| curiosity-hub-article-writer | Rewrites GPT-drafted Curiosity Hub articles into polished, readable prose. | 218 |
| decision-to-prose-writer | Transforms structured decision documents into readable narrative prose. | 292 |
| document-integration-qc | Runs a structured QC pass on one report module at a time. | 118 |
| editorial-recommendations-generator | Generates recommended answers for editorial decisions surfaced by... | 217 |
| editorial-recommendations-qc | Independent QC of editorial decision recommendations. | 171 |
| evidence-prose-fixer | Resolves fidelity flags from the Fact Verification Checker (CustomGPT). | 187 |
| evidence-spec-verifier | Verifies completed Evidence Packs v1 against their originating Answer Specs. | 194 |
| evidence-to-report-writer | Transforms evidence-organized prose into structured report prose. | 334 |
| execution-manifest-creator | Analyze a section's Answer Specs and Research Plan to route each research task. | 131 |
| formatting-qc | QC pass on a formatted prose module. | 167 |
| fund-triage-scanner | Batch-native PE fund triage scanner. | 265 |
| gap-assessment-gate | Assesses evidence sufficiency across cluster analytical memos. | 152 |
| h3-title-pass | Adds and refines H3 subheadings across report prose for readability. | 182 |
| implementation-project-planner | Creates implementation project plans for Claude Code infrastructure projects. | 209 |
| implementation-spec-writer | Translates approved architecture designs into line-level Claude Code implementation specs. | 296 |
| intake-processor | Two-stage intake processing for the macro knowledge base. | 143 |
| journal-thinking-clarifier | Socratic dialogue skill that reads vague, fragmentary personal notes. | 110 |
| journal-wiki-creator | Creates a new heading-based wiki article from clarified personal notes. | 108 |
| journal-wiki-improver | Improve an existing journal wiki article's prose quality. | 140 |
| journal-wiki-integrator | Integrates new thinking into an existing wiki article. | 147 |
| knowledge-file-completeness-qc | Cross-checks a knowledge file against its source chapter prose. | 169 |
| knowledge-file-producer | Produce a knowledge file from a completed research section. | 137 |
| obsidian-kb-builder | Defines and scaffolds Claude Code-queryable Obsidian knowledge bases. | 150 |
| project-implementer | Executes approved implementation specs by creating files, updating configurations. | 187 |
| project-tester | Runs verification checks on completed Claude Code implementations. | 222 |
| prompt-creator | Creates standalone, reusable prompts — task-activation instructions. | 148 |
| prose-compliance-qc | Compliance gate for prose documents. | 212 |
| prose-formatter | Applies mechanical formatting to prose documents without changing any words. | 289 |
| prose-refinement-writer | Refines already-drafted prose for two specific weaknesses. | 269 |
| repo-health-analyzer | Use when the user runs /audit-repo or asks for a workspace health check. | 55 |
| report-compliance-qc | Compliance QC for individual report chapters during Stage 4 production. | 115 |
| research-extract-creator | Produce structured Research Extracts from a component-organized research... | 109 |
| research-extract-verifier | Adversarial verification of Research Extracts against raw research reports. | 185 |
| research-plan-creator | Transform Task Plans into Research Plans — structured documents of sequenced... | 466 |
| research-prompt-creator | Transform an Execution Manifest, Research Plan, and Answer Specs into a prompt. | 222 |
| research-prompt-qc | Automated quality check on Research Execution Prompts. | 176 |
| research-structure-creator | Takes multiple separately-drafted prose chapters and structures them. | 207 |
| section-directive-drafter | Transforms refined cluster analytical memos into structured section directives. | 261 |
| session-guide-generator | Generates a state-aware, scope-flexible, Notion-ready progress view. | 247 |
| session-usage-analyzer | Analyzes a Claude Code session summary for token efficiency. | 160 |
| spec-writer | Writes technical specifications from context packs and project plans. | 245 |
| specifying-output-style | Analyzes a refined draft to crystallize what the document is actually trying... | 151 |
| summary | Compresses long markdown or plain-text documents into dense summaries. | 299 |
| supplementary-evidence-merger | Merges QC-approved supplementary Perplexity research results into existing... | 130 |
| supplementary-query-brief-drafter | Drafts Perplexity query briefs for supplementary research. | 247 |
| supplementary-research-qc | QC gate for raw Perplexity supplementary research results. | 123 |
| task-plan-creator | Co-author comprehensive Task Plans for Axcion projects. | 247 |
| workflow-consultant | Decomposes unfamiliar problems into workflow-shaped solutions. | 104 |
| workflow-creator | Designs multi-tool AI workflows from scratch. | 200 |
| workflow-documenter | Transforms rough workflow ideas into polished, structured workflow docs. | 142 |
| workflow-evaluator | Evaluates workflows on architectural soundness. | 318 |
| workflow-system-analyzer | Inventories and traces a workflow's deployed infrastructure. | 276 |
| workflow-system-critic | Evaluates a workflow system analysis artifact and produces prioritized findings. | 302 |
| workspace-template-extractor | Extract a reusable project template from a working Claude Code workspace. | 137 |
| worktree-cleanup-investigator | Investigates dirty git working trees and plans safe cleanup. | 247 |

**Skills most directly relevant to this project:**
- `workflow-creator` / `workflow-consultant` — designing the travel planning workflows
- `implementation-spec-writer` / `implementation-project-planner` / `project-implementer` — build pipeline
- `research-plan-creator` / `research-prompt-creator` / `research-extract-creator` — structured research delegation patterns
- `prompt-creator` — building the subagent handoff prompts
- `session-guide-generator` — progress tracking

---

## .claude/ Infrastructure (ai-resources)

### commands/ (55 commands)

| Command | Purpose (from frontmatter/heading) |
|---------|-----------------------------------|
| analyze-workflow | Trace and inventory a deployed workflow's full infrastructure |
| architecture-review | Architecture health report via system-owner agent |
| audit-claude-md | Audit CLAUDE.md files for token cost, redundancy, staleness |
| audit-critical-resources | Audit a single nominated resource across several quality dimensions |
| audit-repo | Workspace health check / repo due diligence |
| clarify | Structured clarification of vague or ambiguous requests |
| cleanup-worktree | Safe cleanup of dirty git working trees |
| coach | Analyze operator-AI collaboration patterns and provide coaching |
| consult | System Owner architectural judgment consultation |
| create-skill | Full pipeline for creating a new skill |
| deploy-kb | Deploy an Obsidian Knowledge Base Vault |
| deploy-workflow | Deploy a workflow template to a project |
| explain | Explain a concept, command, skill, or workflow |
| friction-log | Log and track workflow friction points |
| friday-act | Session 2 of Friday cadence (operator-driven fixes) |
| friday-checkup | Weekly maintenance cadence orchestrator |
| friday-journal | Process AI journal into implementation report |
| friday-so | System Owner Friday advisory review |
| graduate-resource | Promote a resource from project to ai-resources canonical |
| implementation-triage | Structured worth-doing verdict (WORTH-DOING / MARGINAL / NOT-WORTH-IT) |
| improve-skill | Full pipeline for improving an existing skill |
| improve | Analyze session friction and propose workflow improvements |
| innovation-sweep | Detect and triage newly created commands/agents/hooks |
| log-sweep | Cross-project log archival |
| migrate-skill | Migrate a skill from one location to another |
| monday-prep | Monday infrastructure cadence |
| new-project | Project pipeline orchestrator (Stages 3a–6) |
| note | Route a note to the appropriate log |
| open-items | View open items across logs |
| permission-sweep | Diagnose and remediate permission drift across all settings layers |
| prime | Load context for the current session |
| project-consultant | Scope-aware project consultation |
| qc-pass | Independent QC review of artifacts |
| recommend | Generate a recommendation on a question or decision |
| refinement-deep | Deep refinement pass on artifacts |
| refinement-pass | Standard refinement pass on artifacts |
| repo-dd | Repository due diligence audit |
| request-skill | Create a skill brief for a needed skill |
| resolve-improvement-log | Resolve entries in improvement log |
| resolve | Resolve QC findings into artifact changes |
| risk-check | Evaluate a proposed structural change across five risk dimensions |
| route-change | Structured change routing and impact assessment |
| save-session | Save session state for resumption |
| scope | Define or adjust session scope |
| session-guide | Progress view generator |
| session-plan | Plan the current session |
| session-start | Load project context and start session |
| so-monthly | System Owner monthly review |
| summary | Summarize a document or artifact |
| sync-workflow | Sync a workflow template to a project |
| systems-review | Systems-thinking workspace analysis report |
| token-audit | Token efficiency audit across all CLAUDE.md and skill files |
| triage | Prioritize suggestions from the main conversation |
| update-claude-md | Update a CLAUDE.md file |
| usage-analysis | Analyze session token usage |
| wrap-session | End-of-session cleanup and logging |

### agents/ (27 agents in ai-resources)

| Name | Description | Model |
|------|-------------|-------|
| claude-md-auditor | Audits always-loaded CLAUDE.md files for token cost, redundancy, contradiction | opus |
| collaboration-coach | Analyzes operator-AI collaboration patterns across sessions | opus |
| critical-resource-auditor | Audits a single nominated resource across several quality dimensions | opus |
| dd-extract-agent | Extracts structured triage and deep-tier data from repo-dd audit reports | haiku |
| dd-log-sweep-agent | Discovers and analyzes log files within a repo-dd audit scope | haiku |
| execution-agent | Handles API calls to GPT-5 and Perplexity for research execution | sonnet |
| findings-extractor | Extracts HIGH/CRITICAL findings from friday-checkup sub-report files | haiku |
| improvement-analyst | Analyzes session friction patterns and proposes workflow improvements | opus |
| innovation-triage-auditor | Classifies a project's infrastructure inventory against canonical ai-resources | opus |
| log-sweep-auditor | Inventories log files within a single /log-sweep scope | haiku |
| permission-sweep-auditor | Scans every Claude Code settings file in the workspace | sonnet |
| pipeline-stage-3a | Scan the axcion-ai-resources repo and produce a structured inventory | sonnet |
| pipeline-stage-3b | Design Claude Code architecture from project plan, technical spec, and repo snapshot | opus |
| pipeline-stage-3c | Write line-level implementation spec from approved architecture and repo snapshot | opus |
| pipeline-stage-4 | Execute the approved implementation spec — create files, update configurations | sonnet |
| pipeline-stage-5 | Run verification checks on completed implementation | sonnet |
| qc-reviewer | Independent QC reviewer for artifacts produced in the main conversation | opus |
| refinement-reviewer | Independent refinement reviewer for artifacts | opus |
| repo-dd-auditor | Independent repo due diligence auditor | sonnet |
| risk-check-reviewer | Evaluates a proposed structural change across five risk dimensions | opus |
| session-guide-generator | Generates a state-aware, scope-flexible, Notion-ready progress view | sonnet |
| system-owner | Axcíon AI System Owner — architectural judgment co-owner | opus |
| token-audit-auditor-mechanical | Executes mechanical-measurement sections of the token-audit protocol | haiku |
| token-audit-auditor | Executes Section 4 (workflow token efficiency) of the token-audit protocol | opus |
| triage-reviewer | Independent triage reviewer | opus |
| workflow-analysis-agent | Inventories and traces a workflow's deployed infrastructure | opus |
| workflow-critique-agent | Evaluates a workflow system analysis and produces prioritized findings | opus |

### hooks/ (15 files)

| Hook file | Event | Purpose |
|-----------|-------|---------|
| auto-qc-nudge.sh | PostToolUse (Write/Edit) | Nudge to run /qc-pass after significant writes |
| auto-resolve-nudge.sh | Stop | Suggest /resolve after QC was nudged this session |
| auto-sync-shared.sh | SessionStart | Sync commands/agents from ai-resources to project .claude/ |
| check-heavy-tool.sh | PreToolUse (Read/Grep/Bash) | Emit [HEAVY] warning before expensive tool calls |
| check-permission-sanity.sh | SessionStart | Validate settings.json permission configuration |
| check-skill-size.sh | PreCommit (informational) | Warn on SKILL.md files exceeding 300-line guideline |
| check-stop-reminders.sh | Stop | Session-end reminder combining multiple checks |
| check-template-drift.sh | SessionStart | Detect drift from canonical templates |
| coach-reminder.sh | Stop | Remind to run /coach after 7+ sessions since last coaching |
| detect-innovation.sh | PostToolUse (Write/Edit) | Detect when commands/agents/hooks are created |
| friction-log-auto.sh | PreToolUse (Skill) | Auto-start friction log session when a skill command fires |
| friday-checkup-reminder.sh | SessionStart | On Fridays, emit reminder to run /friday-checkup |
| improve-reminder.sh | Stop | Remind to run /improve at session end if significant artifacts produced |
| log-write-activity.sh | PostToolUse (Write/Edit) | Log file write/edit activity to friction log |
| pre-commit | PreCommit (git) | Validate skill files before allowing a commit |

### settings.json (ai-resources level)
- **defaultMode:** `bypassPermissions`
- **Allow:** all standard tools + absolute path edits/writes to workspace root
- **Deny:** `rm -rf *`, `sudo *`, `git push*`, archive/deprecated/old reads
- **env:** `MAX_THINKING_TOKENS=10000`
- **Active hooks:** PreToolUse (check-heavy-tool, friction-log-auto), PostToolUse (log-write-activity, auto-qc-nudge), Stop (check-stop-reminders, coach-reminder, improve-reminder, auto-resolve-nudge), SessionStart (friday-checkup-reminder)

---

## Workflows (1 in ai-resources)

### ai-resources/workflows/research-workflow/
- **Local CLAUDE.md:** Yes (`ai-resources/workflows/research-workflow/CLAUDE.md`)
- **Local .claude/:** Not present
- **Subdirectories:** `analysis/`, `execution/`, `final/`, `logs/`, `output/`, `preparation/`, `reference/`, `report/`, `reports/`, `usage/`
- **Purpose:** Multi-phase research workflow with stage-gated structure (preparation → execution → analysis → report). Uses SETUP.md for initialization. Contains reference docs for each stage.

### Workspace workflows/
- Empty (no templates deployed to workspace root)

---

## Sibling Projects (pattern reference for Stage 3b)

10 sibling projects in `projects/`:

| Project | Key directories | Pattern notes |
|---------|-----------------|---------------|
| axcion-ai-system-owner | `pipeline/`, `output/`, `logs/`, `references/`, `vault/` | Has references/ for persona docs; vault/ for architectural reference docs; pipeline/ has full Stage 3a–5 artifacts |
| global-macro-analysis | `pipeline/`, `reports/`, `logs/`, `macro-kb/`, `skills/` | Research-heavy; has local skills/ dir (copies from ai-resources); pipeline/ has full stage artifacts including session-guide.md |
| nordic-pe-landscape-mapping-4-26 | (not scanned in detail) | PE research project |
| project-planning | (not scanned in detail) | Planning workflows |
| repo-documentation | (not scanned in detail) | Has vault/ — likely documentation project |
| buy-side-service-plan, corporate-identity, meeting-prep, obsidian-pe-kb | (minimal structure) | Varies |

**Pattern from axcion-ai-system-owner pipeline artifacts:** Full pipeline produces: `context-pack.md`, `project-plan.md`, `repo-snapshot.md`, `architecture.md`, `decisions.md`, `implementation-spec.md`, `implementation-log.md`, `test-results.md`, `session-guide.md`.

**Pattern: project-specific commands vs. shared commands.** Projects with specialized workflows (e.g., system-owner's `/consult`, `/friday-so`) create project-local commands that delegate to specialized agents. Commands are listed in `shared-manifest.json` under `"local"` to prevent auto-sync overwrite.

---

## Other Top-Level Directories (workspace root)

- **`artifacts/`** — Contains `question-scaffolds/`; purpose: stored prompt/question scaffold artifacts
- **`harness/`** — Contains `CHANGELOG.md`, `README.md`, `learning/`, `logs/`, `prep/`, `reports/`, `schemas/`, `session/`, `test-workflows/`; purpose: Claude Code session harness infrastructure
- **`knowledge-bases/`** — Contains `pe-kb-vault/` (submodule), `.gitmodules`, `.gitignore`; purpose: Obsidian knowledge base vaults (excluded from workspace root per recent commit)
- **`logs/`** — Contains `coaching-log.md`, `decisions.md`, `friction-log.md`, `innovation-registry.md`, `session-notes.md`; purpose: workspace-level session telemetry and governance logs
- **`reports/`** — Contains `repo-health-report.md`, `last-audit-commit.txt`; purpose: workspace-level audit and health report outputs

---

## File Tree (2-level, excluding .git and hidden dirs)

```
Axcion AI Repo/
├── CLAUDE.md
├── ai-resources/
│   ├── CLAUDE.md
│   ├── audits/
│   ├── docs/
│   ├── inbox/
│   ├── logs/
│   ├── plans/
│   ├── prompts/
│   ├── reports/
│   ├── scripts/
│   ├── skills/           (70 skill directories)
│   ├── style-references/
│   ├── usage/
│   └── workflows/
├── artifacts/
│   └── question-scaffolds/
├── harness/
│   ├── CHANGELOG.md
│   ├── README.md
│   ├── learning/
│   ├── logs/
│   ├── prep/
│   ├── reports/
│   ├── schemas/
│   ├── session/
│   └── test-workflows/
├── knowledge-bases/
│   └── pe-kb-vault/
├── logs/
│   ├── coaching-log.md
│   ├── decisions.md
│   ├── friction-log.md
│   ├── innovation-registry.md
│   └── session-notes.md
├── projects/
│   ├── axcion-ai-system-owner/
│   ├── buy-side-service-plan/
│   ├── corporate-identity/
│   ├── global-macro-analysis/
│   ├── meeting-prep/
│   ├── nordic-pe-landscape-mapping-4-26/
│   ├── obsidian-pe-kb/
│   ├── personal/            ← THIS PROJECT
│   ├── project-planning/
│   └── repo-documentation/
├── reports/
│   ├── last-audit-commit.txt
│   └── repo-health-report.md
└── workflows/
    (empty)
```

---

## Key Observations for Stage 3b (Architecture Design)

1. **Greenfield project with full scaffold.** Directory structure, CLAUDE.md, settings.json, and pipeline artifacts are in place. No project-specific commands, agents, or workflow files exist yet — everything needs to be created in Stage 4.

2. **Phase 0 blocker.** Both `profile/universal-traveler-profile.md` and `profile/travel-principles.md` are empty placeholders. The CLAUDE.md Personalization Spine Gate will halt execution of any user-facing workflow until these are populated. Architecture must account for this: the build sequence must put profile population before any workflow that generates output.

3. **trips/ directory exists.** The scaffold pre-creates `projects/personal/trips/` — Stage 3b should adopt a per-trip subdirectory pattern (e.g., `trips/amsterdam-2026-06/`) for storing dossiers, day plans, and logs.

4. **Manual subagent delegation at MVP.** Context Pack and CLAUDE.md both confirm Mode 1 (manual handoff prompts) as the MVP default. The system should produce prompts Patrik pastes into ChatGPT/Perplexity; API automation is a Phase 5 concern.

5. **Output format constraint is structural.** All user-facing outputs must be iPhone-readable and paste-ready. This affects how commands format their outputs — short lines, no horizontal-scrolling tables, clearly delimited sections.

6. **Four functional layers, phased.** Architecture must support all four layers (pre-trip research, in-trip operation, learning loop, trip selection) but only Phase 1 (pre-trip research) needs to be built at MVP. Stage 3b should design the full architecture but flag the MVP subset clearly.

7. **Learning loop requires versioned profile files.** Phase 3 adds profile/principles versioning. The architecture should anticipate this: profile files probably need a versioning pattern (e.g., `profile/v1/`, `profile/v2/`) or a changelog convention.

8. **ai-resources skills available for reuse.** `implementation-spec-writer`, `project-implementer`, `workflow-creator`, `prompt-creator`, and `research-prompt-creator` are directly relevant to building this project's commands and agents. Stage 3b may invoke these skills in the implementation spec.

9. **Pattern from system-owner project.** Project-specific commands that delegate to specialized agents (e.g., `/destination-dossier` → research-delegation agent) follow the pattern established in `axcion-ai-system-owner`. Those commands are listed as `"local"` in `shared-manifest.json` so the auto-sync hook does not overwrite them.

10. **No custom agents expected at MVP.** Given the manual subagent delegation model, MVP likely needs only commands (slash commands Patrik runs) plus formatted handoff prompts — not new Claude Code agents. Agents may be added in later phases for automated delegation.
