# Architecture: Personal Travel Planning System (`personal`)

**Stage:** 3b — Architecture Design
**Generated:** 2026-05-11
**Inputs read:**
- `projects/personal/CLAUDE.md`
- `projects/personal/pipeline/context-pack.md`
- `projects/personal/pipeline/project-plan.md`
- `projects/personal/pipeline/technical-spec.md`
- `projects/personal/pipeline/repo-snapshot.md`
- `projects/personal/pipeline/decisions.md` (empty at start of this stage)
- Reference pattern: `projects/axcion-ai-system-owner/` (sibling pattern)
- Reference skill: `ai-resources/skills/architecture-designer/SKILL.md`

---

## 1. Architecture Summary

The `personal` project is a Claude Code "mother orchestrator" that turns Patrik's ad-hoc travel research methodology into a versioned, personalization-grounded system. Phase 1 (MVP) ships **one user-facing command and three project-local references**, supported by a small set of project-owned templates and per-trip directories. The command (`/destination-dossier`) reads both personalization-spine files plus a trip-context input, generates handoff prompts for ChatGPT Pro and Perplexity Pro (Mode 1 — manual delegation), accepts pasted-back subagent outputs, synthesizes them through the profile + principles, and emits an iPhone-paste-ready dossier with eight required sections.

The high-level approach: **thin command shell + a single Sonnet orchestrator agent that runs the workflow, with all behavior driven by three project-local references (workflow definition, dossier template, subagent prompt library) so future phases can add commands without re-implementing the personalization gate or output template.** Subagent delegation is documented (not API-automated) at MVP. No new shared resources land in `ai-resources/`.

**Total component count: 11 new components, 2 modifications to existing project files.**

| Category | Count |
|---|---|
| Project-root files (modify) | 1 (`CLAUDE.md` — minor: add grounding-pointer paragraph) |
| Project-local references (new) | 3 (workflow definition, dossier template, subagent prompt library) |
| Project-local commands (new) | 2 (`/destination-dossier`, `/trip-init`) |
| Project-local agents (new) | 1 (`dossier-orchestrator` — Sonnet) |
| Project-local infrastructure (modify) | 1 (`shared-manifest.json` — register the two local commands and one local agent) |
| Per-trip directory pattern (convention only) | 1 (`trips/{slug}/` layout — documented, not pre-created) |
| Phase-1 output template (convention) | 1 (`outputs/destination-dossier-template.md` — separate from references; this is the rendered example) |
| Workflow log convention (new) | 1 (`logs/dossier-runs.md` append-only run log) |

Phase 2–5 components are stubbed in §8 but not designed in detail — Phase 1 is the hard MVP cap.

---

## 2. Component List

### 2.1 Project-root files (1 modification)

#### CLAUDE.md (modify — add one short pointer block)

| Field | Value |
|---|---|
| **Path** | `projects/personal/CLAUDE.md` |
| **Type** | Project-level CLAUDE.md (always-loaded) |
| **Change** | Add a short "Workflow References" pointer paragraph naming the three project-local reference files (workflow definition, dossier template, subagent prompt library) and a "Trip Directory Convention" pointer (one paragraph). No methodology embedded — pointers only, per CLAUDE.md Scoping rule. |
| **Rationale** | Future sessions need to know references exist without re-discovering them. Pointers preserve the lean CLAUDE.md while making the workflow structure addressable from cold start. |
| **Estimated complexity** | Low — two short paragraphs, ~12 lines added. |
| **Skill dependencies** | None. |

### 2.2 References (3 new)

#### references/dossier-workflow.md

| Field | Value |
|---|---|
| **Path** | `projects/personal/references/dossier-workflow.md` |
| **Type** | Project reference doc (read by `dossier-orchestrator` agent every invocation) |
| **Purpose** | Define the destination-dossier workflow as a sequence of internal steps (read inputs → personalization-spine check → plan delegation → generate subagent prompts → ingest pasted-back results → synthesize → format → log). Names which dossier section each subagent owns. Defines the personalization-grounding evidence block the agent must produce before output. Defines failure / halt conditions (empty profile, missing trip context, weather-ceiling violation). |
| **Rationale** | The workflow logic is the substance of the system. Putting it in a reference (not embedded in the command or agent) means Phase 2 commands (`/daily-program`, `/tomorrow-spar`) can read this file and inherit the same personalization-gate + delegation + synthesis pattern without duplication. It is also the most likely file to be tuned after the first real-trip test. |
| **Estimated complexity** | High — defines the workflow contract for Phase 1 and is the seed for Phases 2–4. Per-section subagent routing must be observable, not vague. Personalization-grounding evidence block must be a concrete template, not "show your work in spirit." |
| **Skill dependencies** | None. Conceptually adjacent to `ai-resources/skills/workflow-creator` but instantiates a workflow rather than building one. |

#### references/dossier-template.md

| Field | Value |
|---|---|
| **Path** | `projects/personal/references/dossier-template.md` |
| **Type** | Project reference doc (read by `dossier-orchestrator` agent at the format step) |
| **Purpose** | Define the exact section structure of the destination dossier output: eight required sections, header style, place-line format (Name — Neighborhood, City — one-line why), mobile-readable formatting rules (short lines, no tables, no horizontal scroll), paste-boundary markers between sections so Patrik can copy section-by-section into iPhone Notes. Defines what each section MUST contain vs. what is optional. Specifies the trip-header block (destination, dates, theme, work-load, budget posture, weather check, personalization-grounding evidence). |
| **Rationale** | Mobile-readability and paste-readiness are structural constraints — they cannot live "in the agent's head." Externalizing the template lets Patrik tune the format after the first trip without touching the agent or the workflow. Also lets future commands (day plans, daily program) inherit the same place-line format for Google Maps search consistency. |
| **Estimated complexity** | Medium — exact section list and place-line format are load-bearing. Section dividers must be unambiguous (Patrik scrolls to find sections on iPhone). |
| **Skill dependencies** | None. |

#### references/subagent-prompts.md

| Field | Value |
|---|---|
| **Path** | `projects/personal/references/subagent-prompts.md` |
| **Type** | Project reference doc (read by `dossier-orchestrator` agent at the delegation-prompt-generation step) |
| **Purpose** | Library of subagent handoff prompt templates — one per dossier section, with `{destination}`, `{dates}`, `{theme}`, `{work_load}`, `{budget_floor}`, `{budget_splurge}`, `{profile_extract}`, `{principles_extract}` placeholders. Each template names the target subagent (ChatGPT Pro / Perplexity Pro), the expected output shape (numbered list, structured fields), and the anti-tourist + personalization guardrails embedded in the prompt itself. |
| **Rationale** | The starting routing heuristic in `technical-spec.md` is a hint, not a spec. This reference operationalizes routing as concrete prompts. Putting prompts in a single reference (not scattered in agent body) makes them tunable after first-trip retro and reusable across Phase 2 commands. |
| **Estimated complexity** | High — eight prompts (one per dossier section), each must embed the anti-tourist filter, the personalization placeholders, and an output-shape spec the agent can parse back. Tourist-trap filtering quality lives here. |
| **Skill dependencies** | Conceptually adjacent to `ai-resources/skills/prompt-creator` and `ai-resources/skills/research-prompt-creator`. Stage 3c may invoke `prompt-creator` to draft the actual prompt bodies. |

### 2.3 Agents (1 new)

#### .claude/agents/dossier-orchestrator.md

| Field | Value |
|---|---|
| **Path** | `projects/personal/.claude/agents/dossier-orchestrator.md` |
| **Type** | Project-local subagent |
| **Model** | `claude-sonnet-4-6[1m]` (Sonnet) — see Decision 4 for rationale. |
| **Purpose** | Execute the destination-dossier workflow per `references/dossier-workflow.md`: read profile + principles + trip context, generate the eight subagent handoff prompts from `references/subagent-prompts.md`, halt and surface them to Patrik for manual execution, ingest pasted-back results, synthesize through profile + principles, format via `references/dossier-template.md`, write the dossier to `trips/{slug}/destination-dossier.md`, append a run record to `logs/dossier-runs.md`. |
| **Rationale** | Workflow needs fresh context per invocation. An agent (not inline command logic) gives the workflow a clean scope, lets the command shell remain thin, and matches the system-owner pattern. One agent is enough at MVP — splitting into delegation-planner + synthesizer is premature until the workflow runs against a real trip. |
| **Tool scope** | `Read` (broad), `Write` (scoped to `projects/personal/trips/`, `projects/personal/logs/`, `projects/personal/outputs/`), `Edit` (same scope), no `Bash`, no `WebFetch` / `WebSearch` (subagents handle external retrieval — see Decision 6). |
| **Skill dependencies** | None at MVP. Stage 3c may decide to load `ai-resources/skills/prompt-creator` if prompt generation needs structured templating; default is to inline-template from `references/subagent-prompts.md`. |
| **Estimated complexity** | Medium — orchestration is straightforward; the load-bearing pieces are the personalization-spine gate (must halt on empty placeholder), the pause-for-manual-delegation handoff (must clearly tell Patrik which prompt goes to which tool), and the paste-back ingestion (must handle messy/partial pastes without silently fabricating). |

### 2.4 Commands (2 new)

#### .claude/commands/trip-init.md

| Field | Value |
|---|---|
| **Path** | `projects/personal/.claude/commands/trip-init.md` |
| **Type** | Slash command (thin shell) |
| **Model** | `claude-sonnet-4-6[1m]` (Sonnet) — mechanical scaffolding. |
| **Purpose** | Given a destination + dates + theme + work-load, scaffold the per-trip directory: `trips/{slug}/` with `trip-context.md` (the inputs structured as YAML frontmatter + free-text notes), an empty `dossier/` subdirectory placeholder, an empty `journal.md` placeholder. Slug format: `{destination-lowercase-kebab}-{YYYY-MM}` (e.g., `lisbon-2026-06`). |
| **Inputs** | Destination (string), dates (start–end), theme (string or "open"), work-load (hours/week during trip, default 25), optional budget overrides. Captured as command arguments or interactive prompts. |
| **Outputs** | `projects/personal/trips/{slug}/trip-context.md` + scaffolding files. Reports the path back to Patrik. |
| **Rationale** | Splitting trip-scaffolding from dossier-generation lets Patrik start capturing a trip in iPhone-quick mode (just commit the slug + dates), then run the dossier later when he's at desktop. Also gives the dossier command a stable trip-context.md to read instead of re-asking for inputs every run. Cheap to build, removes friction. |
| **Estimated complexity** | Low — directory creation + one templated markdown file. |
| **Skill dependencies** | None. |

#### .claude/commands/destination-dossier.md

| Field | Value |
|---|---|
| **Path** | `projects/personal/.claude/commands/destination-dossier.md` |
| **Type** | Slash command (thin shell) |
| **Model** | `claude-opus-4-7[1m]` (Opus) — synthesis is judgment-heavy per `ai-resources/docs/agent-tier-table.md`. |
| **Purpose** | Invoke `dossier-orchestrator` agent against a named trip slug (or the most recently created trip if none specified). Returns the dossier path on completion and reminds Patrik to paste the rendered dossier into iPhone Notes. |
| **Inputs** | Optional `--trip <slug>` argument. If omitted, picks the most recent directory under `trips/`. |
| **Outputs** | `projects/personal/trips/{slug}/destination-dossier.md` (the dossier). Run record appended to `projects/personal/logs/dossier-runs.md`. |
| **Rationale** | Thin command shell pattern — keeps the command file short and lets the agent definition be the single source of truth for workflow logic. Mirrors the `axcion-ai-system-owner` pattern where commands are thin shells delegating to a single Opus agent. |
| **Estimated complexity** | Low — argument parsing + agent invocation + path reporting. Workflow complexity lives in the agent and references. |
| **Skill dependencies** | None directly. The orchestrator agent may load skills if Stage 3c decides. |

### 2.5 Infrastructure (1 modification)

#### .claude/shared-manifest.json (modify)

| Field | Value |
|---|---|
| **Path** | `projects/personal/.claude/shared-manifest.json` |
| **Change** | Add `"trip-init"` and `"destination-dossier"` to `commands.local`; add `"dossier-orchestrator"` to `agents.local`. This prevents the auto-sync hook from overwriting project-owned files on SessionStart. |
| **Rationale** | Without manifest registration, the SessionStart auto-sync hook will treat the new files as drift and may remove them. This is the standard pattern from `axcion-ai-system-owner`. |
| **Risk** | Low — manifest format is well-defined and the auto-sync hook reads `local` arrays as the source of truth. |

### 2.6 Conventions (not files yet — established by Phase 1)

#### Per-trip directory layout (`trips/{slug}/`)

```
trips/
└── {destination-slug}-{YYYY-MM}/
    ├── trip-context.md        ← scaffolded by /trip-init
    ├── destination-dossier.md ← produced by /destination-dossier
    ├── dossier/               ← (reserved) section-source pastes if Patrik wants to keep raw subagent outputs
    │   ├── chatgpt-paste.md
    │   └── perplexity-paste.md
    └── journal.md             ← Patrik's own notes; used by Phase 3 retro
```

`trips/{slug}/journal.md` is created empty by `/trip-init` so Patrik has a single known path for trip notes from day one.

#### Log files (`logs/`)

| File | Created by | Purpose |
|---|---|---|
| `logs/dossier-runs.md` | `dossier-orchestrator` agent | Append-only record of each dossier run: trip slug, timestamp, profile version read, principles version read, subagent prompts generated, sections completed vs. sections still-empty. Feeds Phase 3 retro. |

#### Outputs directory

`outputs/` remains the workspace for cross-trip artifacts (e.g., a multi-trip pattern summary in a future phase). At MVP it is empty. The dossier output goes to `trips/{slug}/destination-dossier.md`, not `outputs/`, because outputs are trip-scoped, not cross-trip.

---

## 3. Modification List

| Component | Type | Change summary | Risk |
|---|---|---|---|
| `projects/personal/CLAUDE.md` | Project CLAUDE.md | Add "Workflow References" pointer block (3 reference paths) + "Trip Directory Convention" pointer (one paragraph). | Low — additive, ~12 lines, no semantic conflict with existing rules. Personalization Spine Gate stays the load-bearing rule. |
| `projects/personal/.claude/shared-manifest.json` | Manifest | Add 2 commands and 1 agent to `local` arrays. | Low — well-understood pattern from sibling project. |

No changes to `ai-resources/` are required.

---

## 4. Integration Map

### 4.1 Invocation chain (Phase 1)

```
Patrik runs:
  /trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"
    → trip-init command
    → Writes: trips/lisbon-2026-06/trip-context.md + journal.md

Patrik runs:
  /destination-dossier --trip lisbon-2026-06
    → destination-dossier command (thin shell)
    → Spawns: dossier-orchestrator agent (Opus invocation path; agent itself is Sonnet — see Decision 4)
        → Reads: profile/universal-traveler-profile.md
        → Reads: profile/travel-principles.md
        → HALT if either is empty (Personalization Spine Gate enforcement)
        → Reads: trips/lisbon-2026-06/trip-context.md
        → Reads: references/dossier-workflow.md (workflow contract)
        → Reads: references/subagent-prompts.md (prompt library)
        → Generates: 8 handoff prompts (one per dossier section)
        → PAUSES and presents prompts to Patrik with target-tool labels
          (ChatGPT Pro / Perplexity Pro per per-section routing)
        → Patrik runs prompts manually in target tools, pastes results back
        → Optional: Patrik saves raw pastes to trips/lisbon-2026-06/dossier/{chatgpt,perplexity}-paste.md
        → Agent ingests pasted results
        → Reads: references/dossier-template.md (output spec)
        → Synthesizes: applies profile + principles as filter / prioritization / personalization
        → Produces: personalization-grounding evidence block (which preferences applied, which principles enforced)
        → Writes: trips/lisbon-2026-06/destination-dossier.md
        → Appends: logs/dossier-runs.md (run record)
        → Reports path back to command shell → reports to Patrik
```

### 4.2 Data flow

| Artifact | Producer | Consumer(s) |
|---|---|---|
| `profile/universal-traveler-profile.md` | Phase 0 (Patrik / dedicated session) | `dossier-orchestrator` (read every run); Phase 2 daily-program agent; Phase 3 retro agent (read + propose updates) |
| `profile/travel-principles.md` | Phase 0 (Patrik / dedicated session) | Same as above |
| `trips/{slug}/trip-context.md` | `/trip-init` | `dossier-orchestrator`; Phase 2 daily-program agent; Phase 3 retro agent |
| `trips/{slug}/destination-dossier.md` | `dossier-orchestrator` | Patrik (iPhone Notes paste); Phase 2 daily-program agent (input); Phase 3 retro (evaluated against journal) |
| `trips/{slug}/journal.md` | Patrik during trip | Phase 3 retro agent |
| `logs/dossier-runs.md` | `dossier-orchestrator` (append) | Phase 3 retro agent; Phase 5 friction analysis |

### 4.3 Shared references

Every workflow that produces user-facing output reads the same three project-local references (`dossier-workflow.md`, `dossier-template.md`, `subagent-prompts.md`) plus the two personalization-spine files. This is the design's reuse spine: Phase 2 commands (`/daily-program`, `/tomorrow-spar`) will add their own workflow + template references alongside but inherit the personalization gate and the place-line format from the Phase 1 references.

### 4.4 What does NOT integrate (at MVP)

- **No API calls to ChatGPT or Perplexity.** Delegation is Mode 1 (manual handoff prompts) per `CLAUDE.md` § Subagent Delegation Default. The agent generates prompts; Patrik runs them.
- **No `WebSearch` or `WebFetch` from the orchestrator agent.** Web retrieval is the subagents' job. The orchestrator is a synthesizer, not a researcher. (See Decision 6.)
- **No Google Maps or iPhone Notes integration.** Mobile-readability and paste-readiness are achieved via output formatting alone, per `technical-spec.md` § Output format requirements.
- **No `ai-resources/skills/` symlinks at MVP.** The `additionalDirectories` permission grant covers cross-project reads. No skill triggers cleanly on dossier generation at MVP; if one emerges in a Phase 2 retro, add the symlink then.

---

## 5. Output Format Spec (Dossier Template)

The destination dossier has a fixed eight-section structure. Section dividers are explicit so Patrik can scroll-find on iPhone. Each section is independently paste-ready.

### Trip header block (appears once at top)

```
# {Destination} — {Dates} — {Theme}

Work-load: {hours}h/week
Budget posture: ~€{floor}/day baseline; willing to splurge €{splurge_lo}–{splurge_hi}
Weather check: {forecast} — {PASS / FLAGGED if >27°C}

Personalization grounding (this dossier was filtered through):
- Profile version: v{n} (dated {YYYY-MM-DD})
- Principles version: v{n} (dated {YYYY-MM-DD})
- Preferences applied: {short bulleted list of the 3-5 most load-bearing preferences for this trip}
- Principles enforced: {short bulleted list of which principles shaped which sections}
```

### Required sections (in order)

1. **Cool neighborhoods** — 3–5 neighborhoods with cafe/work-friendly criteria (WiFi reliability, daytime work density, evening vibe). Format: `Neighborhood — one-line vibe — work-fit verdict`.
2. **Accommodation area recommendation** — Single recommendation (or 2 if there's a real tradeoff) with rationale grounded in proximity to neighborhoods #1 and routine maintenance (gym / supermarket / coffee).
3. **Hidden-gem activity shortlist** — 5–8 activities, each as `Activity name — Neighborhood, City — one-line why (grounded in profile)`. Anti-tourist filter explicitly applied in selection.
4. **Food / restaurant shortlist** — 6–10 places, same format as #3. Includes mix of work-friendly daytime + memorable dinner. Excludes mass-tourism spots.
5. **Tourist-trap warning list** — 4–6 named places to actively avoid, each with a one-line reason ("ranked #2 on TripAdvisor but Reddit + local sources flag as overpriced and slow"). This is the "early warning system" Patrik wanted.
6. **Mobility recommendation** — One-line verdict (bike / scooter / transit pass / mix) + cost-of-day estimate.
7. **Optimal-timing assessment** — Are these dates good? Weather check passes/fails. Local-event signal (festival / strike / holiday risk). One-line verdict.
8. **Music-vibe recommendation** — 1–2 playlists / genres / artists that match the destination's vibe, paste-ready into Spotify.

### Mobile formatting rules (enforced by `dossier-template.md`)

- Maximum line length: ~80 characters. No tables.
- Each section starts with `## ` header.
- Each section ends with a `---` divider before the next section.
- Place lines always include `Name — Neighborhood, City` (Google Maps search-ready).
- No abbreviations Patrik would have to decode mid-trip.
- No external links inside section bodies (links live in a single `## Sources & Links` appendix at the end if used at all).

### Personalization grounding (enforced by `dossier-workflow.md`)

The agent must produce the trip-header "Personalization grounding" block **before** writing any section. If the agent cannot name specific preferences applied and specific principles enforced, the dossier is flagged as **generic** in the header and Patrik is told the run failed the grounding check. This is the structural enforcement of the Context Pack's grounding requirement.

---

## 6. Conflict Analysis

### 6.1 Trigger overlaps

Checked all 70 skills in `ai-resources/skills/`. Closest descriptions to the new commands:

| Existing | New | Overlap? |
|---|---|---|
| `workflow-creator` (designs multi-tool workflows from scratch) | `/destination-dossier` (executes a specific workflow) | No — `workflow-creator` is design-time; `/destination-dossier` is run-time. No description overlap. |
| `research-plan-creator` / `research-prompt-creator` (build structured research plans + execution prompts) | `references/subagent-prompts.md` (handoff prompt library) | Conceptual overlap, no namespace overlap. Stage 3c may invoke `research-prompt-creator` to author the prompt bodies; runtime invocation only uses the project-local reference. |
| `prompt-creator` (creates standalone reusable prompts) | `references/subagent-prompts.md` (handoff prompt library) | Same as above — design-time aid, no runtime collision. |
| `implementation-spec-writer` / `project-implementer` | None at MVP runtime. | Used by Stage 3c / Stage 4 of the build pipeline, not by `/destination-dossier`. No collision. |

**Verdict:** No runtime trigger overlap. The new commands (`/trip-init`, `/destination-dossier`) and the new agent (`dossier-orchestrator`) are project-local and only invoked explicitly by Patrik.

### 6.2 Naming collisions

Checked all 55 commands and 27 agents in `ai-resources/.claude/`. No `/destination-dossier`, `/trip-init`, or `dossier-orchestrator` exists. New names fit the kebab-case pattern. No collision.

### 6.3 CLAUDE.md bloat

`projects/personal/CLAUDE.md` is currently 79 lines (~1,200 tokens). Phase 1 adds ~12 lines (two pointer paragraphs). Resulting size ~91 lines, ~1,400 tokens. Well within the lean threshold. No bloat risk.

### 6.4 Permission conflicts

`settings.json` defaultMode is `bypassPermissions` with broad Allow for `Bash`, `Read`, `Write`, `Edit`, `MultiEdit`, `Agent`, `Skill`. The new agent's `Write` scope (restricted to `trips/`, `logs/`, `outputs/`) is enforced at the agent definition level (frontmatter tool list), not at settings.json — no permission grant changes required. The auto-sync hook will leave the two new commands and one new agent alone because they're registered in `shared-manifest.json` as `local`. No conflict.

### 6.5 Context window pressure

The three references are sized for routine subagent operation:

- `references/dossier-workflow.md` — target ~200 lines / ~3K tokens.
- `references/dossier-template.md` — target ~150 lines / ~2K tokens (includes the example dossier skeleton).
- `references/subagent-prompts.md` — target ~250 lines / ~4K tokens (eight prompts with placeholders + per-prompt anti-tourist guardrail block).

Plus profile (target ~300 lines / ~5K tokens once Phase 0 is complete), principles (target ~150 lines / ~2K tokens), and trip-context (~30 lines). Total per-run agent context load: ~16K tokens before subagent paste-back. Comfortable for Sonnet 1M / Opus. No pressure.

### 6.6 Agent budget

One new agent (Sonnet). One Opus command invocation (`/destination-dossier`). No latency or cost concern at MVP. Phase 2 may add a second agent (`daily-program-orchestrator`); Phase 3 may add a third (`retro-synthesizer`). Total agent budget at end of Phase 3: 3 agents. Well within practical scale.

### 6.7 Personalization Spine Gate enforceability

The CLAUDE.md gate is a behavioral rule. Structural enforcement happens at the agent level: `dossier-orchestrator` MUST check both profile files for non-empty content before generating any output, and MUST halt with a specific error message if either is empty. The agent definition (Stage 3c) names this as the first workflow step. No conflict — this is exactly how the gate becomes operational.

### 6.8 Unresolved risks

- **Risk:** Subagent paste-back is messy in practice. Patrik may paste ChatGPT output that doesn't match the expected shape, or paste partial results. Mitigation in Phase 1: agent treats paste-back as best-effort, flags any section it couldn't reconstruct as "incomplete" in the dossier, and never fabricates content for missing sections. To revisit after first real-trip use.
- **Risk:** Personalization grounding evidence is performative, not real — the agent could list preferences without actually filtering by them. Mitigation: Phase 3 retro evaluates dossier against journal and flags sections that don't match preferences. No structural fix at Phase 1.
- **Risk:** The trip slug convention (`{destination}-{YYYY-MM}`) collides when Patrik visits the same destination twice in the same month. Acceptable — slug becomes `{destination}-{YYYY-MM}-b` manually. Trivial.

---

## 7. Design Decision Log

| # | Decision | Alternatives Considered | Rationale | Trade-offs |
|---|----------|------------------------|-----------|------------|
| 1 | **Single orchestrator agent (`dossier-orchestrator`) instead of multi-agent (planner + synthesizer + formatter).** | (a) Split into 3 agents — delegation-planner, synthesizer, formatter. (b) No agent — inline command logic. | One agent matches the system-owner pattern, keeps the wiring simple, and avoids fresh-context handoffs between steps when the entire workflow is one Patrik-facing run. Premature multi-agent splitting would optimize a workflow that hasn't run on a real trip yet. | If synthesis quality is poor, can't structurally enforce "fresh context for synthesis." Acceptable risk; revisit if Phase 3 retro flags synthesis blindspots. |
| 2 | **Three references (workflow / template / prompts) instead of one or six.** | (a) One reference with everything. (b) Six references (one per dossier section). | Three is the minimum that splits along axes of independent tuning: workflow logic, output format, and prompt library each change for different reasons after a trip. One file would couple them; six would fragment them. | Three files to maintain. Acceptable. |
| 3 | **Per-trip directory under `trips/{slug}/` with a fixed sub-structure.** | (a) Flat — all trip files in `trips/` with slug prefixes. (b) `outputs/{slug}/` instead of `trips/{slug}/`. | Trip-scoped subdirectory makes the per-trip lifecycle obvious (init → dossier → journal → retro) and lets Phase 2 add `day-plans/` and Phase 3 add `retro.md` without restructuring. `outputs/` is for cross-trip artifacts (per system-owner convention); trips are first-class entities. | Slug collision risk on same-destination-same-month repeat trips. Trivially mitigated. |
| 4 | **`dossier-orchestrator` agent declared as Sonnet, but the `/destination-dossier` command itself is Opus.** | (a) Both Opus. (b) Both Sonnet. | The command frontmatter (Opus) covers the slash-command's own deciding work — choosing which trip if no slug given, interpreting Patrik's ad-hoc args. The agent runs the workflow mechanically (read files, generate prompts, ingest paste-back, format). The synthesis step is the only judgment-heavy work and per `ai-resources/docs/agent-tier-table.md` Sonnet 1M is acceptable for synthesis with structured inputs. If first-trip output is shallow, escalate the agent to Opus in retro. | Synthesis quality risk at Sonnet. Cheap to retest with Opus by changing one frontmatter line. |
| 5 | **`/trip-init` as a separate command rather than folding init into `/destination-dossier`.** | (a) `/destination-dossier` does init if trip doesn't exist. (b) No `/trip-init`; Patrik creates `trip-context.md` manually. | Splitting lets Patrik capture a trip on iPhone-quick mode (just create the slug + dates so the system knows about it) and run the dossier later. Folding init into the dossier command forces every dossier run to also re-collect trip context. Manual scaffolding is brittle — Patrik will skip the directory structure and the system will degrade silently. | Two commands instead of one. Cheap. |
| 6 | **Subagent delegation is manual (Mode 1) with no `WebSearch` / `WebFetch` fallback in the orchestrator.** | (a) Orchestrator uses `WebSearch` as fallback when Patrik doesn't run the manual prompts. (b) Hybrid: some sections done by orchestrator's WebSearch, others by manual subagent paste. | Mode 1 is the locked default per CLAUDE.md. Allowing the orchestrator to silently substitute its own web search for a missed paste-back would mask the manual workflow's friction (which Phase 5 needs to see in the friction log) and would produce lower-quality results than ChatGPT Pro / Perplexity Pro. Per `ai-resources/docs/cross-model-rules.md`, Claude does not substitute its own work for the tool assigned to a task. | If Patrik wants to skip manual delegation occasionally, he can't. Acceptable — the constraint is the point. |
| 7 | **Personalization-grounding evidence block is mandatory and at the TOP of the dossier (not buried in an appendix).** | (a) Append evidence block at the bottom. (b) Evidence block in a separate file (`trips/{slug}/grounding.md`). | The grounding block at the top is the structural enforcement of the Context Pack's Grounding Requirement. Patrik sees on iPhone — before any place names — which preferences were applied and which principles enforced. If he disagrees, the trust signal fails immediately and he can re-run. Burying it loses the trust function. | First section of every dossier is meta, not place names. Patrik may want to scroll past. Acceptable — paste boundary makes it skippable. |
| 8 | **`logs/dossier-runs.md` append-only run log, separate from per-trip dossier file.** | (a) Per-trip run log inside `trips/{slug}/`. (b) No run log at MVP; rely on git history. | A cross-trip run log lets Phase 3 retro and Phase 5 friction analysis see patterns across trips (e.g., "ChatGPT consistently undersold neighborhood #3"). Per-trip logging fragments the signal. Git history isn't queryable without a tool. | One more file the agent writes to. Trivial. |
| 9 | **No `ai-resources/skills/` symlink at Phase 1.** | (a) Symlink `prompt-creator` and/or `workflow-creator`. (b) Symlink a curated subset. | At MVP, no skill triggers on Patrik's runtime question shapes ("plan my Lisbon dossier"). The build-time use of `prompt-creator` and `research-prompt-creator` happens at Stage 3c via `additionalDirectories` cross-project read — no symlink needed. If a Phase 2 retro surfaces a clean skill trigger, add then. | None for Phase 1. |
| 10 | **Pointers in CLAUDE.md (12 lines), not methodology.** | (a) Embed workflow methodology in CLAUDE.md. (b) No CLAUDE.md change. | Workspace CLAUDE.md Scoping rule explicitly forbids embedding workflow methodology in CLAUDE.md. Pointers preserve discoverability without bloat. No change at all would leave references undiscoverable to a cold-start session. | None. |

### Open decisions (none blocking Stage 3c)

There are no open decisions blocking implementation spec writing. All non-obvious choices are committed above with rationale. Items flagged for revisit after the first real-trip retro:

- **Decision 4** (agent at Sonnet vs. Opus) — revisit if synthesis is shallow.
- **Decision 6** (no WebSearch fallback) — revisit if manual delegation friction is the dominant failure mode.
- **Decision 1** (single agent vs. multi-agent) — revisit if synthesis quality requires fresh-context handoff.

---

## 8. Phase 2–5 Stubs (Forward Compatibility)

These are NOT designed in this stage. This section notes how the Phase 1 architecture accommodates them without rework.

### Phase 2 — In-Trip Operational Layer

Adds: `/daily-program`, `/tomorrow-spar`, `/dd-check`, `/backup-options` commands. Each spawns its own thin orchestrator agent following the same pattern as `dossier-orchestrator`.

- Reads: same `profile/`, `trips/{slug}/trip-context.md`, `trips/{slug}/destination-dossier.md` (already exists from Phase 1), Patrik's running `journal.md`.
- Writes: `trips/{slug}/day-plans/{YYYY-MM-DD}.md`.
- Inherits: personalization-spine gate, place-line format, mobile formatting rules from Phase 1 references.
- Adds: `references/daily-program-workflow.md`, `references/daily-program-template.md`, `references/in-trip-prompts.md`.

The Phase 1 reference split (workflow / template / prompts) is exactly what Phase 2 needs to clone. No restructuring required.

### Phase 3 — Learning Loop

Adds: `/trip-retro` command + `retro-synthesizer` agent (Opus — judgment-heavy).

- Reads: `trips/{slug}/trip-context.md`, `trips/{slug}/destination-dossier.md`, `trips/{slug}/day-plans/*`, `trips/{slug}/journal.md`, `logs/dossier-runs.md`, current `profile/` files.
- Writes: `trips/{slug}/retro.md` + proposed `profile/universal-traveler-profile.md.v{n+1}.proposed` and `profile/travel-principles.md.v{n+1}.proposed` (Patrik approves before promotion to v{n+1}).
- Versioning: profile files become `profile/v{n}/universal-traveler-profile.md` after first retro. Symlinks `profile/universal-traveler-profile.md → profile/v{current}/universal-traveler-profile.md` keep Phase 1 paths stable. **Decision: not implemented at Phase 1 to avoid premature versioning structure; Phase 3 adds it.**

The personalization-spine gate doesn't change — agents still read the symlinked canonical paths.

### Phase 4 — Trip Selection Layer

Adds: `/trip-ideation` command + `trip-ideator` agent.

- Reads: `profile/`, prior retros under `trips/*/retro.md`, Patrik's time-window + work-load + budget inputs.
- Writes: `outputs/trip-ideation/{YYYY-MM-DD}.md` (cross-trip artifact — lives in `outputs/`, not `trips/`).
- Inherits: same prompt-library pattern from Phase 1; theme-fit scoring uses profile + principles.

### Phase 5 — Automation and Integration Polish

Promotes selected workflows from Mode 1 to Mode 2 (API delegation). Implementation: replace the "halt and present prompts" step in an agent with a `Bash`-mediated API call. The reference (`references/{workflow}-prompts.md`) becomes the body of the API payload. Workflow logic in `references/{workflow}-workflow.md` doesn't change.

Phase 5 also evaluates direct Google Maps list creation (likely not feasible — requires OAuth flow Claude Code can't perform headlessly; revisit) and Spotify playlist creation (more tractable via API).

**Forward-compatibility verdict:** The Phase 1 split (thin command → orchestrator agent → three references) is the unit pattern. Phases 2–5 add more instances of this pattern without modifying it.

---

## 9. Build Sequence (input to Stage 3c)

This is informational — Stage 3c writes the line-level implementation spec.

1. **Modify `CLAUDE.md`** — add Workflow References + Trip Directory Convention pointer blocks.
2. **Create `references/dossier-workflow.md`** — workflow contract with personalization gate.
3. **Create `references/dossier-template.md`** — output structure + mobile formatting rules.
4. **Create `references/subagent-prompts.md`** — eight prompt templates with placeholders.
5. **Create `.claude/agents/dossier-orchestrator.md`** — agent definition + tool scope.
6. **Create `.claude/commands/trip-init.md`** — directory scaffolding command.
7. **Create `.claude/commands/destination-dossier.md`** — thin command shell.
8. **Modify `.claude/shared-manifest.json`** — register the 2 new commands and 1 new agent as `local`.
9. **No skill symlinks. No `outputs/` content. No `trips/` content.** Per-trip directories are created on demand by `/trip-init`.

Phase 0 (profile + principles population) is a hard prerequisite that runs **before** any of the above is exercised. The build itself (Stage 4) does not require profile content — but the first run of `/destination-dossier` does.

---

## 10. Quality Criteria Mapping

Every Phase 1 quality criterion from the Context Pack maps to a structural enforcement point in this architecture:

| Quality criterion | Structural enforcement |
|---|---|
| **Personalization fidelity** | Personalization Spine Gate + mandatory grounding evidence block at top of dossier. Halts on empty profile. |
| **In-trip usefulness** | Out of Phase 1 scope (Phase 2 deliverable). Phase 1 unblocks it by producing the dossier Phase 2 reads. |
| **Tourist-trap filtering** | Dossier Section 5 (Tourist-trap warning list) is required, not optional. Each prompt in `subagent-prompts.md` embeds anti-tourist guardrails. |
| **Routine integration** | Trip-context captures work-load. Daily/dinner section of food shortlist is grounded by routine. Phase 2 carries the heavy lifting; Phase 1 surfaces the constraint at trip-header. |
| **Flexibility preserved** | Dossier is a shortlist, not an itinerary. Sections are independent and prioritized, not sequenced into a fixed week-by-week plan. |

---

## 11. Decisions Awaiting Operator Confirmation (for `decisions.md`)

The architecture document's Decision Log above is self-contained per the skill spec. The orchestrator's instruction is to add decisions to `pipeline/decisions.md` **only with explicit user confirmation**. The following decisions from §7 are the candidates Patrik should be asked to confirm before they land in `decisions.md`:

- D1: Single orchestrator agent (vs. multi-agent split).
- D3: Per-trip directory layout under `trips/{slug}/`.
- D4: Agent at Sonnet (vs. Opus); command at Opus.
- D6: Subagent delegation Mode 1 only at Phase 1 — no `WebSearch` fallback.
- D7: Personalization-grounding evidence block at top of dossier.
- D9: No `ai-resources/skills/` symlink at Phase 1.

D2, D5, D8, D10 are mechanically dictated by the design constraints (file split for tunability, init/run separation, run log, CLAUDE.md scoping rule) and do not need separate decision-log entries.

---

**End of architecture document.**
