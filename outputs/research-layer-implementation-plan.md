---
title: "Phase-1 Research Workflow — Idea Triage & Implementation Plan"
purpose: "Triage the consolidated travel-improvement ideas for the pre-trip research layer, then specify the concrete reference-file changes a build session should make. Plan only — no reference files were edited producing this document."
created: 2026-06-16
maintainer: Patrik
source: outputs/idea-consolidation-pass.md
scope: "Phase-1 research layer only (pre-trip dossier workflow). In-trip (Phase 2) and post-trip (Phase 3) ideas are parked, not planned."
status: "Changes A–E implemented 2026-06-16 (commit 48d98b7). Change F (Maps/photo reality-check) added and implemented 2026-06-16 S1 — see Part 2. Dry-run validation pending the next real trip."
---

# Phase-1 Research Workflow — Idea Triage & Implementation Plan

## Context

The consolidation in [`outputs/idea-consolidation-pass.md`](idea-consolidation-pass.md) organized ~42 scattered
travel-improvement ideas into a deduped keep/cut map. This document is the next step: an
**independent, repo-aware triage** of which ideas are worth implementing **in the pre-trip
research layer specifically**, plus a **file-level change spec** a build session can execute
without re-reading the consolidation.

**Scope decisions that bound this plan:**
- **Phase 1 only.** Only changes to the *built* dossier workflow count. The in-trip
  (`/daily-program`, Phase 2) and post-trip (retro, Phase 3) layers are out of scope — even
  though ~70% of the source material is in-trip. Ideas belonging there are **parked**, not
  dropped (see Part 3).
- **Plan, not build.** This document is the deliverable. The actual reference-file edits are a
  separate build session.
- **Independent re-triage.** The consolidation's keep/cut was treated as input, not gospel.

**Why the change set is small.** The dossier workflow is already sophisticated: an
anti-tourist guardrail that already mandates local-language search and "name the specific
signal that kept it"; a `rs`/`rsNote` research-status field with a `research-todo.md`
worklist; per-place `time` blocks; a free-text `bestTime` field; the 🔥/👍/🆗 tier system; and
a per-stop `intro` field. The leverage is in **extending existing mechanisms**, not adding new
ones. The consolidation's own governing warning — *"the main risk is the system becomes too
theoretical"* — drives a deliberately small, prompt-level change set with **zero new schema
fields**.

---

## Part 1 — Triage

Each of the 14 research-plausible ideas, judged for the **research layer** against the hard
constraints (Mode-1 manual handoff; "menu, not a schedule"; mobile ≤80-char cards;
zero-schema-change; anti-overbuild).

| # | Idea | Verdict | Rationale |
|---|------|---------|-----------|
| 2 | Hidden-condition rule (name the one thing that must be true for a place to be worth it) | **IMPLEMENT** | Highest leverage, nearly free — the guardrail's "name the signal that kept it" is one step away. Prunes vague candidates at the source; *reduces* theory rather than adding it. |
| 3 | Design experiences, not attractions | **IMPLEMENT (light)** | Framing edit to the Pass 3 task line, not a new mechanism. |
| 5 | Search experiences, not cities (query phrasing) | **IMPLEMENT (light)** | Pure prompt phrasing; merges with #3 into one edit. |
| 4 | Destination thesis (2–4 themes per stop) | **IMPLEMENT (light)** | Folds into the existing `intro` field + a Pass 2 prompt line. No schema change. |
| 7 | Inspiration-source-never-decides | **IMPLEMENT (rule only)** | One compact guardrail line. **Skip the full per-platform role matrix** (Instagram/TikTok/Maps/Reddit/YouTube/Rome2Rio/weather) — overbuild for a Mode-1 prompt, and the named tools go stale. |
| 13 | Crowd arbitrage — *pre-trip half only* | **IMPLEMENT (partial)** | Capturing the crowd-mitigation *timing* per place maps onto the existing `bestTime` field. In-trip execution (arrive before 08:00 on the day) is parked. |
| 14 | Reject fragile / validate before going — *gap only* | **IMPLEMENT (partial)** | Last-transport-back and the `Unverified`→`needs` mechanism already exist. The only genuine gap: access route + permission-needed are not explicitly prompted. |
| 6 | Local-language search | **SKIP — already built** | The guardrail already mandates local-language search with named examples. Redundant. |
| 1 | Plan scenes, not destinations (8-factor unit) | **SKIP — overbuild** | The canonical "too theoretical" trap; its useful atoms (season/light/access) already exist via `bestTime`/`time`/hike-data. Keep only its hidden-condition core (#2). |
| 10 | Experience-recipe format (recipe + best-when + sequence + budget + risk + upgrade) | **SKIP — collides with "menu, not schedule"** | "Sequence" is itinerary-shaped; the useful atoms already exist as `bestTime`/`cost`/`rsNote`. A recipe object bloats the schema and the mobile output. |
| 11 | Three versions per place (low-budget / memorable / social) | **SKIP — breaks mobile-readability** | Triples per-place content against the two-second-card rule. Tier + `bf` budget-friendly flag + splurge posture already encode most of it. |
| 8 | Maps as reality-check / detective | **PARK → Phase 2** | The orchestrator can't use Maps (Mode-1, no WebFetch, no Maps integration). This is operator behavior on the ground. |
| 9 | Reverse-engineer the photo | **PARK → Phase 2** | No image pipeline exists; photo-forensics is operator behavior when evaluating a candidate. |
| 12 | Experience pattern library | **PARK → Phase 3** | The consolidation itself flags it underdeveloped (no build/store mechanism); a cross-trip reusable library is a learning-loop artifact. |

**Net set: 7 ideas → 5 lettered changes (A–E), all prompt/synthesis level, zero new JSON fields.**

---

## Part 2 — File-level change spec

Every change reuses an existing prompt block or field. Only **two files** are edited.

> **Line numbers are approximate and drift** — anchor on the named block, not the line number,
> and verify before editing (see Verification).

### Change A — Hidden-condition rule (#2) + inspiration-never-decides (#7)
**File:** `references/subagent-prompts.md` → the **"Anti-tourist guardrail"** boilerplate block (≈lines 24–46).

1. Extend the existing line *"For every place you include, name the specific signal that made
   you keep it"* to also require the enabling condition:
   > "…AND name the one condition that must be true for it to be worth it (right season, market
   > day, clear morning, last bus exists). If you cannot name that condition, drop the place —
   > it is too vague to keep."
2. Add one line:
   > "Inspiration sources (Instagram/TikTok/viral photos) may generate candidates but never
   > justify keeping one — back every keep with a candid or local source (Reddit, local blog,
   > resident rec)."

**Why this is the highest-leverage edit:** the guardrail is shared boilerplate embedded in
every list prompt (Passes 2a, 2b, 3, 4, 5a), so this single edit propagates the
hidden-condition discipline across all curation passes at once.

### Change B — Experience framing (#3 + #5)
**File:** `references/subagent-prompts.md` → the **Prompt 3 task block** (≈lines 271–283).

- Reframe the lead from "Give me 15–20 hidden-gem activities…" to the experience question, and
  add search-phrasing guidance. Proposed shape:
  > "For each approved area, give me the best lived experiences this place supports under my
  > constraints (solo, working {work_load}h/week, anti-tourist) — not a list of attractions.
  > Search phrasings like 'most memorable experiences in {area}', 'what locals do in {area}',
  > 'spots/villages locals prefer' surface better candidates than 'things to do in {destination}'."
- **Keep unchanged:** the 15–20 count, the slot mix, and the per-place fields.

### Change C — Destination thesis (#4) — *two touch points*
1. **File:** `references/subagent-prompts.md` → **Prompt 2a/2b**. Add one task line:
   > "Also give me a 2–4 point 'thesis' for {destination} as a whole — the handful of things
   > this place is really about (e.g. thermal baths + imperial capital + river life + local
   > neighborhoods) — so I can judge which neighborhoods/stops deliver which."
2. **File:** `references/dossier-workflow.md` → **Step 11, the "Destination intro + temp (§1)"
   bullet** (≈line 357). Amend so the orchestrator opens each stop's `intro` with the 2–4
   theme thesis before the "what it's good for / how to approach it" content. **Reuses the
   existing `intro` field — no schema change.**

### Change D — Crowd-mitigation timing, pre-trip half (#13)
**File:** `references/subagent-prompts.md` → the **"Per-place data fields"** boilerplate, the
`Best time` field (≈line 60).

- Extend `Best time` to also request the crowd-mitigation window:
  > "Best time: best time of day / day of week, INCLUDING any crowd-mitigation window (arrive
  > before X, overnight vs day-trip, shoulder hour) — timing that lets a good-but-known place
  > still feel uncrowded."
- Lands in the existing `bestTime` field — no schema change. (In-trip *execution* of the
  window is parked.)
- **Propagation note:** the "Per-place data fields" block is shared by **Pass 3 AND Pass 4**
  (per `subagent-prompts.md` ≈line 48), so this edit also lands in the food prompt — Pass 4
  venue cards will start carrying a crowd-window line too. That is acceptable (food spots have
  crowd windows); the build session should expect it and not treat it as scope leakage.

### Change E — Access route + permission (#14 gap)
**File:** `references/subagent-prompts.md` → the **"Per-place data fields"** boilerplate, the
`Unverified` field (≈lines 71–74).

- Extend `Unverified` (rather than adding a new field, since both feed the same
  `needs`/`rsNote` surface):
  > "…also flag if the place needs a permission/booking/permit to enter, or if the access
  > route is non-obvious or seasonal (road closed, trail conditions, gated). These keep the
  > place at 'needs research' until confirmed."
- Routes cleanly into the existing `rs: needs` + `rsNote` mechanism and the `research-todo.md`
  worklist `build.mjs` already generates. No new field, no `build.mjs` change.

### Change F — Maps/photo reality-check (#8 + #9, pre-trip half)
**Added 2026-06-16 S1**, after a post-implementation review flagged that the original
triage parked ideas #8 (Maps as reality-check) and #9 (reverse-engineer the photo)
*wholesale* to Phase 2, even though — by the same pre-trip/in-trip split applied to crowd
arbitrage (#13) — both have a pre-trip half that belongs in the research layer.

**File:** `references/subagent-prompts.md` → the **"Anti-tourist guardrail"** boilerplate block,
inserted after the inspiration-source bullet (Change A's territory).

Two bullets added:
1. **Reality-check before keeping** — a kept place must show normal-case signals (a real
   review count, recent/bad-weather photos not just the hero shot, local-language reviews, a
   nearby café/shop/bus showing it is reachable and alive), not just one polished photo. A
   place backed only by a single striking image is a *candidate, not a keep*: mark it
   low-confidence and name what could not be verified — routing into the existing
   `rs:needs` / `rsNote` "needs research" status — **rather than dropping it.**
2. **Deconstruct the photo** — for a place sold by one striking image, name what made the
   photo work (season, fog, drone height, no crowds, editing); if the experience depends on
   an unconfirmable condition for the trip dates, flag it low-confidence.

**Mode-1 reconciliation (the load-bearing scope decision):** this is *candidate-discipline
reasoning the research subagent applies from its own sources* — NOT live Google Maps
integration, which the orchestrator does not have (the reason #8/#9 were parked). The
hands-on "Maps detective on the ground" half stays parked for Phase 2. **Soft-flag, not
drop** (unlike Change A's hard prune) — deliberately, to avoid compounding Change A's logged
over-pruning watch-item.

**Zero schema change:** routes into the existing `rs`/`rsNote` surface; no new
`dossier-data.json` field, no `build.mjs` change. **Propagation:** lands in the shared
guardrail, so it reaches all five list passes (2a, 2b, 3, 4, 5a).

### Files touched
- `references/subagent-prompts.md` — Changes A, B, C-part, D, E, **F** (six edits to existing blocks).
- `references/dossier-workflow.md` — Change C-part (Step 11 `intro` bullet, ≈line 357).
- **Not touched:** `dossier-template.md` schema, `build.mjs`, the command shell, the agent body.

---

## Part 3 — Risks, parked register, sequencing

### Risks / conflicts
- **#10 (sequence) and #11 (three versions)** collide with "menu, not a schedule" and the
  mobile ≤80-char card rule → correctly cut.
- **#8, #9** collide with Mode-1 / no-WebFetch / no-Maps integration → correctly parked.
- **Operator burden:** Changes A/D/E add requirements to *subagent* output, not to Patrik's
  paste-back actions, so they don't lengthen the manual loop. The real risk is *prompt length*
  (these prompts are already long) — mitigated by extending existing lines rather than adding
  new blocks.
- **Schema bloat: zero by design.** Every kept idea was mapped onto an existing field
  (`bestTime`, `rsNote`, `intro`) precisely to avoid `dossier-data.json` growth and the build's
  controlled-vocabulary validation surface.
- **Over-pruning watch:** the extended guardrail (Change A) could push subagents to return
  too-few items. Flag as a dry-run tuning axis; if long lists come back thin, soften the "drop
  the place" instruction to "flag it as low-confidence."

### Parked register (so the ideas aren't lost)
- **#8 Maps reality-check, #9 photo reverse-engineering, #13 in-trip crowd execution** →
  Phase 2 in-trip layer (`outputs/daily-program-workflow-spec.md`). These are operator behaviors
  on the ground, blocked by Mode-1 in the research layer.
- **#12 experience pattern library** → Phase 3 post-trip learning loop. Its latent storage home
  is `dossier-data.json`'s place-record model, but no build/maintain mechanism exists yet.

### Sequencing for the build session
- **Tier 1 — pure text edits, no build run:** Changes A, B, D, E (all in `subagent-prompts.md`).
  They change subagent *input*; the data they produce flows into already-validated fields
  (`bestTime`, `rsNote`). No `build.mjs` run needed.
- **Tier 2 — touches synthesis logic:** Change C (Pass 2 line + Step 11 `intro` instruction in
  `dossier-workflow.md`). Warrants a read-through of Step 11 to keep the `intro` bullet wording
  consistent with the no-schema-change intent.
- **No `build.mjs` run or schema migration is required** to validate these edits. The real
  validation is a **dry-run on the next real trip**. Per project convention these are candidate
  tunings best landed during/after a first-trip retro; if applied pre-trip, mark them as
  untested tunings in the dossier run log.

---

## Verification (for the build session)

- **Spot-check each cited block** in `subagent-prompts.md` and `dossier-workflow.md` against
  the live file before editing — line numbers drift, so anchor on the block names ("Anti-tourist
  guardrail", "Per-place data fields", `Best time`, `Unverified`, Prompt 3 task block, Step 11
  "Destination intro + temp (§1)").
- **Confirm the zero-schema-change invariant:** no change should imply a `dossier-data.json`
  field or a `build.mjs` edit. `intro`, `bestTime`, and `rs`/`rsNote` already exist in
  `dossier-template.md`.
- **Confirm constraint compliance:** every "menu, not schedule" / Mode-1 / no-dashboard /
  mobile-readability constraint is respected by the kept set.
- This is a planning artifact, not code — no tests to run. The real test is the next-trip
  dry-run flagged above.
