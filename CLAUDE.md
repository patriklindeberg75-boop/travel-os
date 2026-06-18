# Personal Travel Planning System

Claude Code–based travel planning system for Patrik's solo-travel + remote-work lifestyle. Mother orchestrator delegating to subagents (ChatGPT, Perplexity, Gemini) across four layers: trip selection, pre-trip research, in-trip operation, and post-trip learning loop.

## Personalization Spine Gate

**Every workflow that produces user-facing output MUST read both files before generating:**

- `profile/universal-traveler-profile.md`
- `profile/travel-principles.md`

If either file is empty or missing, halt and ask Patrik to provide it. Do not generate generic output as a fallback.

## Phase Gating

- Phase 0 (personalization spine) is a hard prerequisite — do not start Phase 1 build work until both profile files are populated.
- Phase transitions require Patrik's explicit approval. Each phase ends with a written retro.
- Profile and principles are updated only via the Phase 3 retro workflow, never ad-hoc.

## Output Standards

All user-facing outputs (dossiers, day plans, itineraries, shortlists) must be:
- Mobile-readable on iPhone (short lines, no horizontal-scrolling tables)
- Paste-ready for iPhone Notes (clearly delimited sections)
- Map-ready where applicable (place name + neighborhood + city for Google Maps search)

Internal documentation (architecture, prompts, workflow notes) may use desktop formatting.

## Hard Constraints

- Solo trips only. 1+ week duration only.
- Weather ceiling: flag destinations over 30°C during trip dates. For multi-stop trips, flagging is per-stop (not trip-wide). (This 30°C trip-dates ceiling is the operator-relaxed value; the traveler profile's 27°C in § 8 is the stricter destination-screening default. The 30°C value here governs trip-dates flagging and takes precedence.)
- Routine respected: day plans must accommodate work + sleep + exercise + healthy eating.
- No custom dashboard — iPhone Notes + Google Maps are the front-end.
- Anti-tourist filter active on all outputs: prioritize hidden gems, and flag only the overcrowded obligatory-icon traps — the "Eiffel Tower tier": go-only-for-the-photo, overpriced, crowd-degraded. Popular or even iconic places are fine when the experience genuinely holds up (locals value it too, or it's worth it with the right timing). "Famous" or "high on TripAdvisor" alone is not grounds to exclude — the test is whether the crowd ruins it and whether anyone but tourists values it.
- Activity cost threshold: low-cost paid activities are recommendable, not just free ones. An activity costing roughly €10–15 (or the local-currency equivalent) is fair to recommend on its merits — do not over-filter to free-only. This is a recommendation guideline within normal daily budget, not a per-trip splurge authorization; the trip's splurge posture (see `trips/{slug}/trip-context.md`) still governs higher-cost items.

## Subagent Delegation Default

MVP default is manual handoff prompts (Mode 1). Do not promote to API automation (Mode 2) until the manual version has been proven useful on a real trip.

## Model Selection

Model is selected per session via `/model` — there is no project default. Do not declare a `"model"` field in any `.claude/settings.json` or `.claude/settings.local.json`, and do not state a default model in this CLAUDE.md. See workspace `CLAUDE.md` § Model Tier for the prohibition rationale. Per-command/per-agent tiering via `model:` frontmatter is still permitted.

Recommended posture: Sonnet 1M for workflow execution, output formatting, and scaffolding (execution-tier). Opus for trip research synthesis, post-trip retro, and profile update proposals — analytical commands declare `model: claude-opus-4-7` in frontmatter where deep synthesis is required.

## Input File Handling

Input files — context packs, reference documents, source data, prior artifacts the operator drops into the working directory — are read-only references. Use them by path, do not copy or rewrite them.

- **Default to `Read`.** When the operator points you at an input file (whether it lives in the project folder, an `inputs/` sibling, or an absolute path elsewhere on the filesystem), use the `Read` tool against that path. Never invoke `Write`, `Edit`, `MultiEdit`, or shell file-creation commands (`cp`, `cat >`, `tee`, redirection, `install`, etc.) against a file whose content originated outside the current session.
- **Do not materialize chat content.** If an input's content enters the conversation (pasted, quoted, or summarized), that does not make the chat copy canonical. The file on disk remains the source of truth.
- **Do not co-locate inputs with outputs for "provenance."** If provenance matters, record the absolute path of the input in the artifact's frontmatter or a `sources.md` file — do not duplicate the bytes.
- **Outputs are different.** Artifacts your command is *designed to produce* (dossiers, plans, specs, drafts, reports) are written normally via `Write` into this repo's output locations — `trips/{slug}/` for per-trip artifacts, `destination-checks/` for viability verdicts, and `outputs/` for everything else. This rule governs inputs only.
- **Operator-pasted content — save verbatim.** When the operator pastes file content and asks you to save it, use `Write` to save exactly as provided. No reformatting, no truncation, no restructuring. If no target path is given, ask before writing. Flag before writing if: target path exists and would be overwritten; content appears incomplete; content conflicts with an approved artifact. Confirm the write by stating target path and line count — do not describe the content.
- **Exception: legitimate copying.** Copy an input only when (a) the operator explicitly asks for an archival snapshot or reproducibility freeze, or (b) a downstream tool requires the file at a specific path and no symlink or path argument will satisfy it. In both cases, record the absolute source path in the copy's frontmatter or in a sibling `SOURCE.md`, and state in your turn-summary that you copied rather than referenced.

This rule mirrors the canonical `Input File Handling` section in the workspace-level `CLAUDE.md`. It is repeated here because projects are sometimes opened without the parent workspace context loaded.

## Commit Rules

**Commit directly. Do not ask for permission.** After completing approved work, stage the relevant files and commit in a single step using a heredoc commit message. Do not run `git status`, `git diff`, or `git status --short` as pre-commit checks or post-commit verification — the filesystem is the source of truth for what you just changed.

After committing, do NOT push. Pushes are batched until session end and gated by a single operator confirmation at `/wrap-session` (or an explicit signal like "we're done" / "ship it"). Remind the operator to run `/wrap-session` if the work is complete. Never commit files that may contain secrets (`.env`, credentials, tokens).

This rule mirrors the canonical `Commit behavior` section in the workspace-level `CLAUDE.md`. It is repeated here because projects are sometimes opened without the parent workspace context loaded.

## Compaction

When `/compact` fires, preserve:
- The current pipeline/stage identifier and active working directory (which section, which stage, which command is mid-run).
- Paths to any subagent-output files the main session has not yet read.
- Any pending operator gate the session is holding at.

Auto-compact drops these by priority; name them explicitly so they survive. Before `/compact`, prefer writing a short session-state scratchpad (current step, decisions, partial findings, artifact paths) and `/clear` + restart from the scratchpad over lossy auto-summarization.

**Post-compact resumption — trust the summary.** When resuming after compaction, treat the summary's "commits made" / "files modified" / "decisions" lists as authoritative. Do NOT re-derive them via `git log`, `git show`, or repeated Reads of `session-notes.md`/`decisions.md`. Verify only when the next action requires a specific detail the summary didn't capture (e.g., line numbers for an Edit). Cost test: if your verification doesn't change the next tool call, skip it.

## Session Boundaries

When switching between unrelated tasks in the same terminal, prefer `/clear` over continuing in dirty context. Stale context from a prior task compounds and contaminates the next one.

## Workflow References

The Phase 1 dossier workflow runs in three stages (commands) and is defined by three reference files. Workflow methodology lives in those files, not here:

**Commands (in order):**
1. `/destination-check {destination} {dates}` — Pass 1 viability screening. Runs before `/trip-init`. Reads profile + principles; generates a Perplexity Pro assessment prompt; writes a verdict artifact to `destination-checks/`.
2. `/trip-init {destination} {dates} {theme}` — scaffolds the trip directory. Reads viability verdict from `destination-checks/` and copies it into `trip-context.md`.
3. `/destination-dossier` — runs the 5-pass research funnel (Passes 2–5) with operator gates, synthesizes into the 8-section dossier.

**Reference files (read by `dossier-orchestrator` on every invocation):**
- `references/dossier-workflow.md` — workflow steps, personalization gate, halt conditions, paste-back format contracts, resume logic, run-log grounding spec.
- `references/dossier-template.md` — destination dossier output structure, mobile formatting rules, multi-stop section variants.
- `references/subagent-prompts.md` — handoff prompt templates for ChatGPT Pro and Perplexity Pro, organized by pass (Mode 1 manual delegation).

Future commands (`/daily-program`, `/tomorrow-spar`) will add parallel reference files under `references/`.

## Trip Directory Convention

Pre-trip: `destination-checks/{destination-kebab}-{YYYY-MM}.md` — viability verdict written by `/destination-check`.

Per-trip: `trips/{slug}/`, where `{slug}` is `{destination-lowercase-kebab}-{YYYY-MM}` (example: `albania-2026-05`). The slug is generated by `/trip-init`. Per-trip layout:
- `trip-context.md` — scaffolded by `/trip-init`; includes viability verdict, trip_type, and (after Pass 2) approved_locations / route_stops.
- `destination-dossier.md` — produced by `/destination-dossier`.
- `dossier/pass-N-state.md` — per-pass long-list / short-list state written by the orchestrator; used for auto-resume.
- `dossier/` — optional raw subagent paste archive.
- `journal.md` — Patrik's own trip notes, used by Phase 3 retro.

Same-destination-same-month repeats append `-b`, `-c`, etc., manually.
