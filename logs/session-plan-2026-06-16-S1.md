# Session Plan — 2026-06-16 S1

## Intent
Apply the five approved Phase-1 research-layer changes (A–E) from `outputs/research-layer-implementation-plan.md` to the two dossier reference files. All are prompt/synthesis-text edits that extend existing blocks; zero new `dossier-data.json` schema fields and no `build.mjs` change.

## Model
Recommended: Sonnet 1M (execution-tier — spec-driven text editing against a precise file-level plan). Currently on Opus 4.8 → `/model sonnet` advised but not blocking; the spec is unambiguous.

## Source Material
- `outputs/research-layer-implementation-plan.md` — the approved triage + file-level change spec (Changes A–E).
- `references/subagent-prompts.md` — target file for Changes A, B, C-part1, D, E.
- `references/dossier-workflow.md` — target file for Change C-part2 (Step 11 `intro` bullet).

## Findings / Items to Address
All six cited blocks were verified present in the live files before planning:
- Change A — "Anti-tourist guardrail" block (lines 24–46); signal line at L38.
- Change B — Prompt 3 "Hidden-gem activity long list" task block (L271 lead).
- Change C-part1 — Prompt 2a (L166–189) + Prompt 2b (L209–239) task bodies.
- Change C-part2 — `dossier-workflow.md` Step 11 "Destination intro + temp (§1)" bullet (L357).
- Change D — "Per-place data fields" block, `Best time` field (L58).
- Change E — "Per-place data fields" block, `Unverified` field (L71–74).

Zero-schema-change invariant: `intro`, `bestTime`, `rs`/`rsNote` already exist in `dossier-template.md`; no edit implies a new field.

## Execution Sequence
1. **Change A** — extend the guardrail signal line (L38) to require the enabling condition + add the inspiration-never-decides line. (Highest leverage: shared boilerplate propagates to all list passes.)
2. **Change B** — reframe Prompt 3 lead to the experience question + add search-phrasing guidance; keep count/slot-mix/fields unchanged.
3. **Change C-part1** — add the 2–4-point destination-thesis task line to Prompt 2a and 2b.
4. **Change D** — extend `Best time` field to request the crowd-mitigation window. (Note: propagates to Pass 4 food prompt too — expected, acceptable.)
5. **Change E** — extend `Unverified` field to flag permission/booking/permit + non-obvious/seasonal access.
6. **Change C-part2** — amend `dossier-workflow.md` Step 11 `intro` bullet so each stop's `intro` opens with the 2–4 theme thesis. Read-through of the bullet to keep wording consistent with no-schema-change intent.
7. Confirm zero-schema-change invariant; commit (not push).

## Scope Alternatives
- **As-planned (recommended):** all five changes — they're a coherent set, all low-risk text edits, already triaged and approved.
- **Tier-1 only (A, B, D, E):** defer Change C (touches synthesis logic in dossier-workflow.md) if time-constrained. Not needed — C is small and verified.
- **Soften Change A:** the plan flags an over-pruning watch — "drop the place" could thin long lists. Keep as written this pass; the plan marks it as a dry-run tuning axis, not a pre-emptive softening.

## Autonomy Posture
Full autonomy. No structural-change classes touched (no hooks, permission changes, CLAUDE.md edits, new commands/skills/symlinks, no automation). Prompt-text edits to project-local reference files only.

## Risk
Structural risk: none. Functional risk: low — edits change subagent *input* prompts; produced data flows into already-validated fields. The only flagged watch is Change A over-pruning (mitigated by leaving softening as a dry-run tuning lever). Reversible via git. No `/risk-check` required.
