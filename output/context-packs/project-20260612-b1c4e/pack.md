---
slug: project-20260612-b1c4e
consumer: session-input
task_type: project
created: 2026-06-12T00:00:00Z
sufficient_to_plan: true
sufficient_to_implement: false
files_in_scope:
  - trips/balkans-2026-06/index.html
  - trips/balkans-2026-06/site/index.html
  - trips/balkans-2026-06/sw.js
  - trips/balkans-2026-06/site/sw.js
  - trips/balkans-2026-06/CHANGES.md
  - trips/balkans-2026-06/UX-PASS-MOBILE.md
allowed_inputs:
  - trips/balkans-2026-06/UX-PASS.md
  - trips/balkans-2026-06/build.mjs
  - trips/balkans-2026-06/dossier-data.json
  - CLAUDE.md
required_outputs:
  - trips/balkans-2026-06/UX-PASS-MOBILE.md
  - trips/balkans-2026-06/index.html
  - trips/balkans-2026-06/site/index.html
  - trips/balkans-2026-06/sw.js
  - trips/balkans-2026-06/site/sw.js
  - trips/balkans-2026-06/CHANGES.md
cited_paths:
  - trips/balkans-2026-06/index.html
  - trips/balkans-2026-06/site/index.html
  - trips/balkans-2026-06/sw.js
  - trips/balkans-2026-06/site/sw.js
  - trips/balkans-2026-06/CHANGES.md
  - trips/balkans-2026-06/UX-PASS-MOBILE.md
  - trips/balkans-2026-06/UX-PASS.md
  - trips/balkans-2026-06/build.mjs
  - trips/balkans-2026-06/dossier-data.json
  - CLAUDE.md
missing_context:
  - kind: dependency
    description: UX-PASS-MOBILE.md does not exist anywhere in the repo; the M1–M11 findings the round implements live only in that not-yet-provided spec.
  - kind: unknown-scope
    description: M4 is parked "behind a device check" but no file states what the device check is or who runs it before M4 can proceed.
---

## Task brief

Implement the UX-PASS-MOBILE.md fix round for the Balkans dossier: apply 10 findings (M1–M3, M5–M11) to [trips/balkans-2026-06/index.html](trips/balkans-2026-06/index.html) in the document's stated fix order (M1→M2→M3→M11→M5→M6→M7→M8→M9→M10), with M4 parked behind a device check. Fixes are chrome/CSS/one-liner only. Mirror the edited build into [site/index.html](trips/balkans-2026-06/site/index.html), bump the service-worker cache in [sw.js](trips/balkans-2026-06/sw.js) and [site/sw.js](trips/balkans-2026-06/site/sw.js), record the per-finding implementation in [CHANGES.md](trips/balkans-2026-06/CHANGES.md), and save the round spec UX-PASS-MOBILE.md into the trip dir.

## Authoritative sources

- **trips/balkans-2026-06/index.html** *(tier 7)* — The single self-contained dossier (inline data + CSS + renderer JS); primary edit target for all M-findings. Per [build.mjs](trips/balkans-2026-06/build.mjs) lines 5–7, it stays single-file with no external fetch.
- **trips/balkans-2026-06/site/index.html** *(tier 7)* — The upload-bundle mirror of index.html; [CHANGES.md:84](trips/balkans-2026-06/CHANGES.md#L84) states "The `site/` folder mirrors the built `index.html` + `sw.js` and is the upload bundle" — must be re-synced after every edit round.
- **trips/balkans-2026-06/sw.js** *(tier 7)* — Service worker; [sw.js:2-3](trips/balkans-2026-06/sw.js#L2) instructs "Bump CACHE on every deploy"; current value is `balkans-v4-4` (line 3), so this round bumps to the next version.
- **trips/balkans-2026-06/site/sw.js** *(tier 7)* — The site/-bundle copy of the service worker; bumped in lockstep with the root sw.js per the prior round ([CHANGES.md:401](trips/balkans-2026-06/CHANGES.md#L401): "SW → `balkans-v4-4`. `site/` bundle re-synced").
- **trips/balkans-2026-06/CHANGES.md** *(tier 7)* — The dossier changelog; the prior round added a "v4.2 — UX-PASS fix round" per-finding section ([CHANGES.md:399-401](trips/balkans-2026-06/CHANGES.md#L399)). This round appends an analogous per-M-finding section.
- **trips/balkans-2026-06/UX-PASS-MOBILE.md** *(tier 8)* — The round spec that defines M1–M11, the fix order, and the M4 device-check park. NOT PRESENT on disk — must be saved to the trip dir as the round spec (see Missing context).

## Background sources

- **trips/balkans-2026-06/UX-PASS.md** *(tier 8)* — The prior round's spec (F1–F12), now fully RESOLVED at v4.2 ([UX-PASS.md:38-49](trips/balkans-2026-06/UX-PASS.md#L38)). It is the structural template the new round mirrors: a findings table, a "Fix order (pending go)" line, and a "Status" block updated after implementation.
- **trips/balkans-2026-06/build.mjs** *(tier 7)* — Regenerates the inline `const TRIP=[…]` data block in index.html from dossier-data.json ([build.mjs:1-7](trips/balkans-2026-06/build.mjs#L1)). Relevant guardrail: chrome/CSS/one-liner fixes touch markup/CSS/JS outside the DOSSIER DATA markers, so build.mjs need not re-run unless data changes — confirm none of M1–M11 touch the data block.
- **trips/balkans-2026-06/dossier-data.json** *(tier 7)* — The single source of truth for the inline data block ([build.mjs:3](trips/balkans-2026-06/build.mjs#L3)). Background only; chrome-only fixes should not edit it.
- **CLAUDE.md** *(tier 1)* — Project governance. § Output Standards (lines 20–27) requires mobile-readable iPhone output; the UX-PASS-MOBILE round serves exactly this. § Commit Rules (lines 60–66): commit directly after approved work, do NOT push (batched to `/wrap-session`). § Trip Directory Convention (lines 99–110) defines `trips/{slug}/` layout.

## Conflicts surfaced

*(none)*

## Missing context

- **dependency** — UX-PASS-MOBILE.md is referenced by the task as the source of M1–M11 and as a file to "save to the trip dir," but a repo-wide Glob found no file of that name (only the prior `trips/balkans-2026-06/UX-PASS.md`). The engine cannot enumerate or verify the M-findings, the fix order, or the M4 device-check definition because the spec content does not exist on disk. The operator must provide it before implementation.
- **unknown-scope** — The task says M4 is "parked behind a device check," but no file on disk defines what the device check is, who runs it, or its pass/fail criteria. [UX-PASS.md:31-36](trips/balkans-2026-06/UX-PASS.md#L31) shows the prior round had an "Unverified (needs a real device/browser)" section for similar items; M4's gate is likely analogous but is unstated in available sources.

## Handoff prompt

**Task:** Implement the UX-PASS-MOBILE.md fix round for the Balkans dossier — apply M1–M3, M5–M11 to trips/balkans-2026-06/index.html in fix order (M1→M2→M3→M11→M5→M6→M7→M8→M9→M10), chrome/CSS/one-liner only, M4 parked behind a device check; sync site/, bump sw.js + site/sw.js cache, record in CHANGES.md, save UX-PASS-MOBILE.md to the trip dir.

**Mandate fields ready for /session-start:**
- `files_in_scope: trips/balkans-2026-06/index.html, trips/balkans-2026-06/site/index.html, trips/balkans-2026-06/sw.js, trips/balkans-2026-06/site/sw.js, trips/balkans-2026-06/CHANGES.md, trips/balkans-2026-06/UX-PASS-MOBILE.md`
- `allowed_inputs: trips/balkans-2026-06/UX-PASS.md, trips/balkans-2026-06/build.mjs, trips/balkans-2026-06/dossier-data.json, CLAUDE.md`
- `required_outputs: trips/balkans-2026-06/UX-PASS-MOBILE.md, trips/balkans-2026-06/index.html, trips/balkans-2026-06/site/index.html, trips/balkans-2026-06/sw.js, trips/balkans-2026-06/site/sw.js, trips/balkans-2026-06/CHANGES.md`

**Pack readiness:**
- Sufficient to plan: true
- Sufficient to implement: false

**Before any edit:** resolve the items in "Missing context" above. The engine could not fill them.
- dependency (UX-PASS-MOBILE.md): obtain the round spec from the operator and save it to `trips/balkans-2026-06/UX-PASS-MOBILE.md` first — the M1–M11 finding text and fix details are not derivable from the repo.
- unknown-scope (M4 device check): ask the operator what gates M4 (what device check, run by whom, pass criteria) before deferring it, so the park is documented rather than silently dropped.

The mandate fields above will pre-populate `/session-start` Step 2's confirmation. The operator can still correct via `b:` / `a:` / `r:` / `f:` syntax.
