# Workflow Additions — derived from the Balkans HTML UX diagnosis

**Date:** 2026-06-10
**Companion to:** [`ux-diagnosis.md`](ux-diagnosis.md)
**Purpose:** the subset of UX findings that are **systemic, not Balkans-specific** — what should change in the dossier *workflow/template/data spec* so every future dossier inherits the fix.
**Status:** proposal only. Does NOT edit the reference files; specifies deltas for a later fix session.
**Scoping (operator decision, 2026-06-10):** split into a focused **V1** (hard requirements) and a **V2** roadmap (postponed). The diagnosis is the full finding catalog; this doc is the *implementation scope*, and v1 is deliberately small.

---

## The v1 principle

The full diagnosis lists 13 findings. Building all of them turns a useful lightweight dossier into a mini travel app *before the basic workflow has proven itself on a real trip* — which contradicts the project's minimalist posture ("menu, not a schedule"; manual-handoff MVP default; no custom dashboard). So v1 does NOT try to solve every in-trip job. It solves the core one:

> **Every recommended place must be understandable, locatable, and actionable from its card.**
> Card = **Name → why it's included → where it is → tap to Maps.**

That is enough for a strong v1. Everything else is V2.

---

## The core finding (unchanged): the spec is ahead of the data and the renderer

`references/dossier-template.md` **already specifies** almost everything the UX needs — per-place `id` ("for localStorage toggles"), `lat`/`lng`/`map_link`, `neighborhood`/`city`, `hours` — but as *optional / "carry along for future"* fields. The generated data doesn't emit them and the renderer doesn't consume them. So most v1 work is **closing the gap to the existing spec**, not inventing new spec.

Three layers, and it matters which owns each fix:

| Layer | Who owns it | State today |
|---|---|---|
| **Spec** — `references/dossier-template.md`, `dossier-workflow.md` | the workflow | mostly already specifies the fields, but as optional |
| **Data** — `trips/{slug}/dossier-data.json` (emitted by Step 12.5) | the workflow | does NOT emit `id`/`neighborhood`/`city`/`map_link` even though the spec lists them |
| **Renderer** — `index.html` | **Patrik** (`dossier-workflow.md:395`) | consumes none of the above |

**Boundary reminder:** the workflow is locked to *not* generate or modify the HTML (`dossier-workflow.md:395` — "the workflow produces only this data file"). Renderer-layer fixes (tappable cards, localStorage, filters, safe-area CSS) are **Patrik's HTML work, not workflow changes.** The workflow's only job is to **guarantee the data carries what those features need.**

---

## V1 — the actionable dossier (hard requirements)

### V1 data contract

The v1 per-place data contract for `do`/`eat`/`avoid` objects:

| Field | v1 status | Reason |
|---|---|---|
| `id` | **Required** | Enables future saved state; cheap now, painful to retrofit |
| `nm` | **Required** | Place name (already emitted) |
| `t` | **Required** | Tier / ranking (already emitted) |
| `tags` | **Required** | Basic classification (already emitted) |
| `hook` | **Required** | Why it's included (already emitted) |
| `city` | **Required** | Prevents ambiguous map searches |
| `neighborhood` | **Required if knowable** | Gives "near me" context without geolocation |
| `map_link` | **Required** | Makes the place actionable (tap → Maps) |
| `hours_note` | Optional (free text) | Lightweight; structured hours is too fragile for v1 |
| `lat` / `lng` | Optional | Nice, not necessary in v1 |
| `connectivity`, `offline_map_area` | Optional | Useful only for specific places |

The three *new* hard requirements are **`map_link`, `city`, `neighborhood`** (and enforcing **`id`** on places, which the spec already defines but the data omits). The rest are already emitted.

### V1.1 — Require `map_link`, `city`, `neighborhood` (`dossier-template.md`)

**Where:** § Structured data companion (lines ~103–117), § Field mapping (lines ~195–216).
**Today:** the schema lists `map_link`/`neighborhood`/`city` as additive fields that "MAY carry … ride along for future rendering" (line ~115).
**Change:** make `city`, `map_link` **required**, and `neighborhood` **required-if-knowable**, on every `do`/`eat`/`avoid` place object. `lat`/`lng` stay optional. `map_link` must always be present — a Maps search string when only free text is known.
**Why:** diagnosis F1 + F2 — the two highest-value in-trip jobs (A "near me now", D "eat tonight") need a locatable, tappable card.

### V1.2 — Define the `map_link` construction rule (`dossier-template.md` + `dossier-workflow.md`)

**Where:** `dossier-template.md` § Field mapping; `dossier-workflow.md` Step 12.5 (lines ~387–395).
**Today:** Step 12.5 carries `map_link` "for future rendering" with no construction rule.
**Change:** add a canonical rule:
> `map_link` = `https://www.google.com/maps/search/?api=1&query=` + URL-encoded(`{nm} {neighborhood} {city}`) when no coordinates are known; when `lat`/`lng` are known, use `…&query={lat}%2C{lng}`. Never fabricate coordinates (`dossier-workflow.md:394` already forbids this — keep it).
**Why:** makes F1's fix deterministic and consistent across dossiers; no per-trip improvisation.

### V1.3 — Enforce a stable per-place `id` (`dossier-template.md` + `dossier-workflow.md`)

**Where:** `dossier-template.md` § Field mapping (line ~214 — the `{stop-kebab}-{place-kebab}` rule already exists); `dossier-workflow.md` Step 12.5.
**Today:** spec defines the place `id` rule, but the Balkans data emitted **no** per-place `id`s (only the 5 stops have `id`). Step 12.5 doesn't enforce it.
**Change:** make per-place `id` a **hard requirement** in Step 12.5's output checklist — every place carries `id: "{stop-kebab}-{place-kebab}"`. Add a generation self-check that fails if any place lacks one.
**Why:** cheap now, future-proofs V2's saved-state (job E) which keys on this `id`. Building it in v1 avoids painful rework even though the toggle UI itself is V2.

### V1.4 — Add an optional free-text `hours_note` (`dossier-template.md` + `subagent-prompts.md`)

**Where:** `dossier-template.md` § Field mapping; `references/subagent-prompts.md` (Pass 3/4 prompts).
**Today:** no hours signal at all.
**Change:** allow an **optional free-text** `hours_note` (e.g. `"Best before 20:00; verify hours"` or `"Often evenings only — check before going"`). Do NOT build a structured per-day hours schema or "open now" logic in v1.
**Why:** diagnosis F4 names the open-now gap, and it's real — but structured hours is fragile (hours change, sources disagree, seasonal variation, parsing edge cases). A human-readable caveat captures 80% of the value at near-zero cost. Structured hours + computed "open now" is **V2**, gated on reliable source capture.

### V1.5 — Preserve what already works (`dossier-template.md`)

**Where:** § Field mapping / Controlled vocabulary.
**Change:** none functional — record as **load-bearing, do-not-drop**: `heat`/`heatLabel` per stop, the `shade`/`swim` heat-relief tags, the fixed `tags` set, and `t` tiers. The fixed tag set is also the canonical filter axis for V2, so future tag additions must stay controlled.
**Why:** these are the strongest existing in-trip features (diagnosis "what works"); protect them through any schema cleanup, and keep the data filter-ready for V2 at no cost.

### V1 renderer work (Patrik's HTML — not workflow)

Once V1.1–V1.3 ship in the data, the v1 renderer changes are small and high-value:
1. **Make each place name tap → `map_link`** (F1).
2. **Show `neighborhood` on `do`/`eat` cards** (F2, F11 — today only AVOID cards show a location).
3. Optionally surface `hours_note` as a card line where present (F4-lite).

Everything else stays as-is. This is the whole v1 product loop: name → why → where → tap.

---

## V2 — the interactive travel companion (roadmap, postponed)

Build only after v1 has proven useful on a real trip. Each item names the data field it will need, so v1 data is forward-compatible.

| V2 feature (mostly renderer / Patrik's HTML) | Diagnosis ref | Data field needed (when built) |
|---|---|---|
| "Want / done" saved-state toggles (localStorage) | F3 | per-place `id` — **already shipped in V1.3** |
| Structured opening hours + "open now" badge | F4 | parseable `hours` schema (new; gated on reliable source capture) |
| Tag / tier filtering of the long lists | F5 | `tags` + `t` — already present |
| Time-of-day surfacing (heat-relief midday, dinner evening) | F9 | `tags` + hours — needs the V2 hours schema |
| Text search across places | F10 | `nm` + `hook` — already present |
| Safe-area insets, sticky-nav + tap-target hygiene | F6, F7 | none (pure CSS) |
| Per-section open/closed persistence | F8 | none (localStorage) |
| Web-app meta / "Add to Home Screen" polish | F12 | none (HTML meta) |
| Masthead spacing on small viewports | F13 | none (CSS) |

Note: V2 is almost entirely **renderer work Patrik owns**; the only V2 *workflow/data* item is the structured `hours` schema (F4), and that one is explicitly gated on whether the research passes can capture hours reliably enough to be worth parsing.

---

## Suggested sequencing

1. **V1 data (workflow):** apply V1.1–V1.4 so the next `dossier-data.json` (and a regenerated Balkans one) carries `id`, `city`, `neighborhood`, `map_link`, and an optional `hours_note`. This is the true prerequisite.
2. **V1 renderer (Patrik's HTML):** tappable place names + neighborhood shown on cards. Ship and use on a real trip.
3. **V2 — only after v1 is validated:** saved-state toggles first (highest value, data already there from V1.3), then filters/search/mobile hygiene, then the fragile stuff (structured hours/open-now, time-of-day) last.

The discipline: **v1 makes places actionable; it does not make a travel app.** Don't build V2 features until the basic loop has earned them on the ground.
