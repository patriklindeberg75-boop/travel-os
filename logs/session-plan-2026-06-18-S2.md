# Session Plan — 2026-06-18 S2

## Intent

Build the dossier-readiness QC gate (red-team Phase 4) and restructure Pass 4 into two sub-passes (4a/4b) in the dossier workflow reference files, based on two logged red-team findings.

## Model

claude-sonnet-4-6 — match (doing tier)

## Source Material

- [red-team.md](../red-team.md) — Phase 3 finding: Pass 4 conflates dishes and venues; Phase 4 finding: no readiness QC gate
- [references/dossier-workflow.md](../references/dossier-workflow.md) — main workflow contract (Steps 7, 8, 8.5 govern Pass 4; no QC step exists between Step 13 and Step 14)
- [references/subagent-prompts.md](../references/subagent-prompts.md) — Prompt 4 is a single food prompt asking for both dishes and venues

## Findings / Items to Address

**Finding 1 — Pass 4 conflates dishes and venues (red-team Phase 3)**
- Current Prompt 4 asks for 15–20 venues AND a "FOOD TO TRY" dishes section in one prompt.
- The natural order is inverted: you should know which dishes to hunt before searching for where to eat them.
- Fix: Split into Prompt 4a (dishes/drinks discovery — what to eat) and Prompt 4b (venue search grounded in 4a approved dishes — where to eat it).
- Affects: `references/subagent-prompts.md` (replace Prompt 4) + `references/dossier-workflow.md` (replace Steps 7, 8, 8.5 with 4a/4b steps + state files).
- Also affects: Step 11 synthesis (`foodToTry` source changes from "Pass 4 paste-back" to "Pass 4a approved list"), Step 10.5 de-dup (references pass-4-state.md → pass-4b-state.md), data mapping table in Step 12.

**Finding 2 — No dossier-readiness QC gate (red-team Phase 4)**
- The dossier workflow ends at synthesis with no independent readiness check.
- A generic `/qc-pass` skill exists but is not dossier-aware.
- Fix: Add Step 13.5 — a dossier-readiness QC checklist run in-context by the orchestrator after writing the dossier (Step 13) and before the run log (Step 14). Criteria from the red-team: all 8 sections present, personalization applied, mobile/map-ready standards met, unverified flags surfaced, build.mjs run if applicable, route decisions consistent, no buried critical bookings.
- Verdict: READY → proceed; NOT-READY → surface gaps to operator before declaring done.

## Execution Sequence

**Stage 1 — Split Pass 4 in subagent-prompts.md**
1. Replace `## Pass 4 — Food` / `### Prompt 4` with two sub-prompts: Prompt 4a (dishes discovery, ChatGPT Pro) and Prompt 4b (venue list grounded in 4a, Perplexity Pro).
2. Update the routing summary table to show 4a and 4b as separate rows.

**Stage 2 — Split Pass 4 in dossier-workflow.md**
3. Update paste-back format contracts to note that 4a uses PRIORITY format (dishes), 4b uses KEEP format (venues).
4. Replace Steps 7, 8, 8.5 with: Step 7 (Pass 4a prompt presentation), Step 7.5 (Pass 4a ingest → pass-4a-state.md), Step 8 (Pass 4b prompt presentation), Step 8.5 (Pass 4b ingest → pass-4b-state.md).
5. Update Step 10.5 de-dup reference: `pass-4-state.md` → `pass-4b-state.md`.
6. Update Step 11 synthesis: `foodToTry` sources from "Pass 4a approved list", not "Pass 4 paste-back".
7. Update Step 12 data mapping table: `Pass 4 short list` → `Pass 4b short list`.
8. Update resume logic to handle 4a/4b sub-passes.

**Stage 3 — Add dossier-readiness QC gate in dossier-workflow.md**
9. Insert Step 13.5 between Step 13 (write the dossier) and Step 14 (run log). Include 7-point readiness checklist and READY/NOT-READY verdict protocol.

## Scope Alternatives

- Could write a dedicated `qc-agent` or separate skill for dossier readiness. Deferred — the red-team fix hint suggests future subagent QC; Phase 1 uses in-context check first.
- Could renumber the state files to purely numeric (4, 4.1, 5 etc.). Keeping 4a/4b as it matches the pass naming convention used in session notes and scratchpads.

## Autonomy Posture

Full autonomy — editorial changes to workflow reference files; no structural changes (no hooks, CLAUDE.md edits, commands, or always-loaded content).

## Risk

Low — reference files are read by `dossier-orchestrator` at runtime; no running instances affected. Changes are additive (new steps, new prompts) rather than deletions.
