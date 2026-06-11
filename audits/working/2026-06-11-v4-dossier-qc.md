# QC Review — Balkans dossier v4 (Tier A floor + Tier B)

**Rubric:** full
**Artifact:** Balkans dossier v4 round — taxonomy v2, card pages, price tiers, hero coords, map & pins view (commits 553bbde, a1d9d4c)
**Scope:** Implement § 11 of the operator's UX fix report — taxonomy v2 + fold rule (11.1), café split + work metadata (11.2), price tiers anchored to €50/day (11.3), General-info category + avoid counterpart chips (11.4), per-card pages with scroll-restore + legacy-anchor survival (11.6), QA pass with localStorage marks preserved (11.7); operator decisions: floor-first deployable, hero coords only (OSM, no guessing), Leaflet only at ≥5 pins/stop, photos deferred (slots only), venue copy unchanged.

## Verification performed
- Read renderer (index.html 2811–3622), v4 CSS (380–439), build.mjs, sw.js, CHANGES.md.
- Audited test files (/tmp/balkans-v4-smoke/test-v4.mjs 63 + test-v4b.mjs 15) for genuine coverage of the high-risk claims.
- Verified data shape in dossier-data.json (coords, also/instead/workMeta/pt).
- Confirmed site/ bundle mirrors index.html (renderer present at same offsets) and sw.js (cache balkans-v4-2).

## Findings

### 1. Request Match — Clear
- Taxonomy v2 present (CATS map, ACT_ORDER/FOOD_ORDER, Work cafés, nested General-info). Fold rule implemented in `foldGroups` with <2-item merge, 3+ generic label, lone-group header drop. Empty sub-types never render (`.filter(g=>g.items.length)`).
- Café split + dual-listing confirmed: work cafés own category; Csiga/Kino Lumbardhi/Fellas carry `also` + appear in both lists under one `data-id`; shared state via `applyPlaceAll(id)` querying both `.card` and `.pagecard`. Work metadata table present, unknown fields render `TODO — not yet checked` (no guessing).
- Price tiers anchored to €50/day, defined once in About (TIP.pt), derived only from copy signals, 15-item TODO-PRICE list in CHANGES.md.
- Card pages with route #/{stop}/{slug}, pure index rows, prose/facts/coords/note/next-prev on page, back-link to stop. Legacy `#budapest`/`#transport` anchors resolve (parseHash strips `#/?`, maps transport→transit). Avoid anchors `#/{stop}/avoid-{slug}` resolve.
- Leaflet deliberately absent — verified by code read and test B15 (`!html.includes('L.map(')` etc.). Map & pins view ships as offline pin-list with raw coords.

### 2. Scope Creep — Clear
- No new files beyond the agreed worklist (coords-missing.md is build-generated). build.mjs derivation stayed limited to id/map_link/when + cat/also/pt validation; no hook/fact rewriting path exists. Venue copy untouched.

### 3. Risky Assumptions — Clear (none material)
- Hero coords assumed OSM-accurate; CHANGES.md documents Grill 'Loki' / Qebaptore Bekimi / Milenko's deliberately left unpinned to avoid misleading pins — the no-guess discipline is honored, not assumed away.

### 4. Things That Could Break — Clear (no blockers)
- Migration regex `/:\d+$/` operates ONLY on the `sections` LS key and deletes only numeric-suffixed keys. Semantic keys (`budapest:acts`, `prizren:util`) never match. `places`/`notes`/`booked`/`verified`/`theme`/`route` live under separate LS keys and are never touched. Test 3.6/4.1/4.3 seed pre-v4 marks + legacy numeric keys and confirm marks survive while numeric keys drop. No-wipe guarantee holds.
- Router two-segment + `#/{stop}/map` case handled before `findPlace`; unknown slug → overview fallback. Scroll save reads `curRoute` before re-render and only for stop routes, so returning from a card or map page preserves the stop's saved scrollY (test 7.2). Note field re-renders with `esc(notes[p.id])`; debounced persist reads from closure-captured node so a type-then-back within 250ms still persists. esc() applied on the one user-controlled re-render surface (note).

### 5. Simpler Alternative — Clear
- Architecture stayed appropriately minimal (static single-file, no framework, no Leaflet below threshold). No substantial simplification warranted.

### 6. Sibling Redundancy — Clear
- CHANGES.md v4 sections are additive to v3, no restatement.

## Notes (out-of-scope observations)
- [Out-of-scope] Card-page next/prev uses `coll = allCards(s).filter(x => x.cat === p.cat)` (primary cat only). A dual-listed card reached via the Work-cafés section navigates within its *primary* category (e.g. Csiga `cat:rest` cycles among restaurants, not work cafés). Links are valid and non-broken; this is a minor navigation-set inconsistency, not a defect, and matches the migration-table framing (Csiga = Food/Restaurants, also Work cafés). No action required for this pass.
- [Out-of-scope] Index-row name (`.rnm`) and card-page name render `p.nm` un-escaped. `nm` is author-controlled data, not user input, and this matches v3 behavior; the only user-controlled surface (the note) IS escaped. No injection risk in this trust model.

## Verdict: GO

All four CHECK areas pass: (1) renderer correctness — router map-case, scroll ordering, migration regex scoping, reflow/filters on .cards/.subgrp, mode presets vs nested details, dual-listed state sync, note esc/debounce all verified; (2) no fabrication — 15 coords = 10 pins + 5 centers (exact count confirmed in data), tiers traceable to copy, work metadata copy-derived with explicit TODOs, hooks not rewritten; (3) contract conformance — Leaflet absent, marks preserved (card-id derivation unchanged in build.mjs, migration touches only section view-prefs); (4) mobile CSS — 48px row tap targets, 40px pins, one-line rows via flex + min-width:0 + ellipsis + nowrap, areachip hidden <430px, no horizontal-scroll risk. Test suite genuinely exercises the high-risk paths (seeded migration, scroll restore, note persist, no-Leaflet assertion). site/ bundle mirrors. Two Notes are minor and non-blocking.
