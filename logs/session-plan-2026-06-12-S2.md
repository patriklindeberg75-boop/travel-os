# Session Plan — 2026-06-12

## Intent
Implement the UX-PASS-MOBILE.md fix round for the Balkans dossier — apply M1–M3, M5–M11 (10 findings) to trips/balkans-2026-06/index.html (+ site/ sync, sw.js cache bump, CHANGES.md) in the document's fix order, chrome/CSS/one-liner fixes only; M4 parked behind a device check; save UX-PASS-MOBILE.md to the trip dir as the round spec.

## Model
sonnet (doing — spec-following edits) — active model is claude-fable-5[1m], operator-selected this session; advisory only, no switch forced.

## Source Material
- /Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/index.html (renderer + CSS — the edit target)
- /Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/sw.js (cache bump)
- /Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/CHANGES.md (round record)
- /Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/UX-PASS.md (prior round contract — style precedent)
- UX-PASS-MOBILE.md spec — operator-pasted in chat this session; to be saved clean UTF-8 to the trip dir
- Context pack: output/context-packs/project-20260612-b1c4e/pack.md
- jsdom harness at /tmp/balkans-v4-smoke/ (test-v4.mjs 61, test-v4b.mjs 15, test-v4c.mjs 36 — verify it survived since S1; rebuild if /tmp was cleared)

## Findings / Items to Address
1. M1 (Major) — `.notefield` font-size 14px → iOS zooms viewport on focus; fix: 16px. (UX-PASS-MOBILE.md M1)
2. M2 (Major) — no `navigator.storage.persist()`; Safari-tab use risks 7-day ITP eviction of all marks/notes; fix: best-effort persist() at boot + one About sentence on home-screen install + Export backup. Only non-CSS addition (~6 lines). (M2)
3. M3 (Major) — back link top-left only; worst one-handed thumb zone, standalone swipe-back unreliable; fix: second full-width ≥48px backlink below `.pgnav` on card pages. (M3)
4. M11 — `history.scrollRestoration` never set; Safari double scroll-jump on back; fix: `='manual'` at boot. (M11)
5. M5 — `.view`/`.tnrow`/`.tn-menu`/`.subbar` pad right edge with `safe-area-inset-left`; landscape island-right puts content under camera; fix: use `-right` for right padding. (M5)
6. M6 — `:hover` rules stick on iOS tap (`.tn-tab`, `.toolbar button`); fix: wrap in `@media (hover:hover)`. (M6)
7. M7 — no `touch-action:manipulation`; double-tap zoom armed on every control; fix: apply to `.act,.chip,.cl-item,.verify,.tn-tab,.card.row,.toolbar button,.bookbtn,.copybtn`. (M7)
8. M8 — long-press text-selection/callout on card rows; fix: `-webkit-user-select:none` on `.card.row` and `.act`; keep `.coords` selectable. (M8)
9. M9 — `.view.active` rise animation not in reduced-motion block; fix: add it. (M9)
10. M10 — `.rpin` Maps pin flush against row-navigate area; mis-tap exits app to Google Maps; fix: 44×44 min + ~4px separation from `.rnm`. (M10)
11. M4 — status-bar style vs dark theme: PARKED behind real-device check. Out of scope this round.

## Execution Sequence
1. Save UX-PASS-MOBILE.md to trips/balkans-2026-06/ as clean UTF-8 (operator paste had mojibake; restore proper em-dashes/arrows). Verify: file reads clean, structure intact.
2. Apply fixes in spec order M1→M2→M3→M11→M5→M6→M7→M8→M9→M10 to index.html (M2 also touches About copy; all others CSS/JS one-liners). Verify each: targeted grep/read of the edited selector.
3. Bump sw.js cache balkans-v4-4 → v4-5. Verify: grep.
4. Verify/rebuild jsdom harness at /tmp/balkans-v4-smoke/; run existing 112 assertions + add M-series checks (M1 font-size, M2 persist call, M3 second backlink, M11 scrollRestoration, M6 hover-gate, M7 touch-action, M8 user-select, M9 reduce-motion, M5 inset-right, M10 rpin sizing). Verify: all green.
5. Update CHANGES.md with a "Mobile UX-PASS fix round" section. Verify: section present, lists all 10.
6. Re-sync site/index.html + site/sw.js. Verify: diff-identical to sources.
7. Update UX-PASS-MOBILE.md Status footer to RESOLVED (M4 noted as parked).
8. /qc-pass on the round; commit per project commit rules; no push (remote broken — backup-only anyway).

## Scope Alternatives
Single scope — no alternatives. The spec fixes a fixed 10-item list in a fixed order; M4 is explicitly parked.

## Autonomy Posture
Full autonomy

**Stop points:**
- Only the mandate's stop-if: a fix turning out to require a localStorage schema change, content edit, or new dependency (beyond M2's sanctioned ~6 lines) — stop and flag.

## Risk
No structural change classes apparent — run /risk-check if scope changes. (Edits are to operator-owned trip artifacts, not commands/hooks/CLAUDE.md.)
