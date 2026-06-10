# Workflow Additions — derived from the Balkans HTML UX diagnosis

**Date:** 2026-06-10
**Companion to:** [`ux-diagnosis.md`](ux-diagnosis.md)
**Purpose:** the subset of UX findings that are **systemic, not Balkans-specific** — what should change in the dossier *workflow/template/data spec* so every future dossier inherits the fix instead of it staying a one-off.
**Status:** proposal only. This document does NOT edit the reference files; it specifies the deltas for a later fix session.

---

## The core finding: the spec is ahead of the data and the renderer

The single most important systemic insight from the diagnosis:

> `references/dossier-template.md` **already specifies** almost everything the UX needs — per-place `id` ("for localStorage 'tried it / want it' toggles"), `lat`/`lng`/`map_link`, `neighborhood`/`city`, `hours`, `connectivity`, `offline_map_area`. The gap is that **the generated data doesn't emit these fields**, and **the renderer doesn't consume them.**

So the work splits across three layers, and it matters which layer each fix belongs to:

| Layer | Who owns it | State today |
|---|---|---|
| **Spec** — `references/dossier-template.md`, `dossier-workflow.md` | the workflow | mostly already specifies the needed fields, but as *optional / "carry along for future"* |
| **Data** — `trips/{slug}/dossier-data.json` (emitted by Step 12.5) | the workflow | does NOT emit `id`/`neighborhood`/`lat`/`lng`/`map_link`/`hours` even though the spec lists them |
| **Renderer** — `index.html` | **Patrik** (explicitly, per `dossier-workflow.md:395`) | consumes none of the above; no localStorage, no map links, no filters |

**Boundary reminder:** the workflow is locked to *not* generate or modify the HTML (`dossier-workflow.md:395`, "the workflow produces only this data file — it does NOT generate or modify the HTML shell (Patrik owns that)"). So the renderer-layer fixes (map links, localStorage toggles, filters, safe-area CSS) are **Patrik's HTML work, not workflow changes.** The workflow's only job is to **guarantee the data carries what those features will need.** This doc therefore proposes changes to the **spec and data layers only**, plus a data-readiness contract for the renderer.

---

## Part A — Reference-file deltas (spec + data layers)

### A1. Promote map-readiness fields from "optional" to **required** (`dossier-template.md`)

**Where:** § Structured data companion (lines ~103–117) and § Field mapping (lines ~195–216).
**Today:** the schema lists `lat`/`lng`/`map_link`/`neighborhood`/`city` but frames them as additive fields that "MAY carry … ride along for future rendering and cost nothing" (line ~115).
**Change:** make `neighborhood`, `city`, and `map_link` **required** on every `do`/`eat`/`avoid` place object. `lat`/`lng` stay optional (often genuinely unknown) but `map_link` must always be present — built as a Google Maps search string when only free text is known (the spec already hints this at line ~206–207; make it mandatory).
**Why:** F1 + F2 in the diagnosis. A place with no location data cannot be navigated to or located, which breaks the two highest-value in-trip jobs. The renderer can only make a name tappable if the data ships a link.

### A2. Define the `map_link` construction rule explicitly (`dossier-template.md` + `dossier-workflow.md`)

**Where:** `dossier-template.md` § Field mapping; `dossier-workflow.md` Step 12.5 (lines ~387–395).
**Today:** Step 12.5 says to carry `lat`/`lng`/`map_link` "alongside for future rendering" but gives no construction rule.
**Change:** add a canonical rule:
> `map_link` = `https://www.google.com/maps/search/?api=1&query=` + URL-encoded(`{nm} {neighborhood} {city}`) when no coordinates are known; when `lat`/`lng` are known, use `…&query={lat}%2C{lng}`. Never fabricate coordinates (existing rule at `dossier-workflow.md:394` already forbids this — keep it).
**Why:** makes F1's fix deterministic and consistent across dossiers; avoids each trip inventing its own link format.

### A3. Require a stable per-place `id` on every place object (`dossier-template.md` + `dossier-workflow.md`)

**Where:** `dossier-template.md` § Field mapping (line ~214, the `id` rule already exists: `{stop-kebab}-{place-kebab}`, "stable across re-runs so localStorage toggles persist"); `dossier-workflow.md` Step 12.5.
**Today:** the spec defines the place `id` rule, but the Balkans data did **not** emit per-place `id`s (only the 5 stops have `id`). Step 12.5 doesn't enforce it.
**Change:** make per-place `id` a **hard requirement** in Step 12.5's output checklist — every `do`/`eat`/`avoid` entry must carry `id: "{stop-kebab}-{place-kebab}"`. Add a generation self-check that fails if any place lacks an `id`.
**Why:** F3. The localStorage "want / done" tracking (job E) is keyed on this `id`. Without it, no stable tracking is possible and toggles won't survive a re-render or a data refresh.

### A4. Make `hours` a first-class captured field, with an open-now-ready format (`dossier-template.md` + `subagent-prompts.md`)

**Where:** `dossier-template.md` § Controlled vocabulary / Field mapping; `references/subagent-prompts.md` (Pass 3 activities + Pass 4 food prompts).
**Today:** `hours` is listed as an additive key but is free-text and rarely gathered; the Balkans data has no structured hours.
**Change:** (a) update the Pass 3/Pass 4 subagent prompts to explicitly request opening hours per place; (b) define a machine-parseable `hours` convention in the template (e.g. a simple per-day `{day: "HH:MM-HH:MM"}` map or a clearly-labelled free-text fallback) so the renderer can compute "open now."
**Why:** F4. "Eat tonight" (D) and "worth walking to now" (A) both need open/closed state; the data must carry hours in a parseable shape for the renderer to compute it.

### A5. Add a tag/filter-readiness note (`dossier-template.md`)

**Where:** § Controlled vocabulary (the fixed `TAG` set, lines ~124–126).
**Today:** every place is already tagged from a fixed set — good; this is already filter-ready.
**Change:** no schema change needed; add a one-line note that the fixed tag set is the **canonical filter axis** for the renderer, so future tag additions must stay controlled (improvising tags would break client-side filtering).
**Why:** F5. Confirms the data is already filterable and protects that property; the filter UI itself is renderer work (Part B).

### A6. Confirm/strengthen the heat-relief + neighborhood data that already works (`dossier-template.md`)

**Where:** § Field mapping.
**Today:** `heat`/`heatLabel` per stop and `shade`/`swim` heat-relief tags are emitted and work well (diagnosis "what works").
**Change:** none functional — just record these as **load-bearing, do-not-drop** fields so a future schema cleanup doesn't remove them.
**Why:** preserves the strongest existing in-trip feature.

---

## Part B — Data-readiness contract for the renderer (Patrik's HTML)

These are **renderer-layer** fixes (F1, F3, F5, F6–F8, F9, F10, F12) that live in `index.html`, which the workflow does not touch. They are listed here only so the **data layer ships what they need**. The contract: when Patrik builds each renderer feature, the data must already carry the matching field.

| Renderer feature (Patrik's HTML) | Data field the workflow must guarantee |
|---|---|
| Tappable place → Google Maps (F1) | `map_link` (required per A2) |
| Show neighborhood on card / group by area (F2) | `neighborhood`, `city` (required per A1) |
| "Want / done" toggle in localStorage (F3) | stable per-place `id` (required per A3) |
| "Open now" badge (F4) | parseable `hours` (per A4) |
| Tag / tier filter (F5) | `tags` (fixed set) + `t` — already present |
| Time-of-day surfacing (F9) | `tags` (heat-relief) + `hours` — covered by A4 |
| Text search (F10) | `nm` + `hook` — already present |

**Pure-renderer items with no data dependency** (Patrik's HTML only — listed for completeness, not workflow work): safe-area insets and sticky-nav/tap-target fixes (F6, F7), per-section open/closed persistence (F8), web-app meta / Home-Screen polish (F12), masthead spacing (F13).

---

## Suggested sequencing for the fix session

1. **Spec + data first (workflow):** apply A1–A4 so the *next* `dossier-data.json` (and a regenerated Balkans one) carries `id`, `neighborhood`/`city`, `map_link`, and `hours`. This unblocks every renderer feature.
2. **Renderer second (Patrik's HTML):** map links (F1) and localStorage toggles (F3) are the highest-value and now have their data. Then filters (F5), then mobile-Safari hygiene (F6–F8).
3. **Polish last:** time-of-day lens (F9), search (F10), web-app meta (F12).

This ordering means the data work (A1–A4) is the true prerequisite — the renderer features are cheap once the fields exist, and expensive/blocked while they don't.
