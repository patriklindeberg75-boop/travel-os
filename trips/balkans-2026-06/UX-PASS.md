# UX-PASS.md — Balkans Dossier v4 · 2026-06-12

Method: full source read + jsdom runtime harness (journeys 1–4, 6, 8 executed; 5 and 7 verified by code/arithmetic — no real browser in this environment). Lens: one-handed, bright sun, 34°C, tired, possibly offline.

## Journeys that PASS (verified, no fix needed)

- **J1 cold open — tonight's dinner:** returning user lands on last-visited stop (`balkans:route`); Food header (1 tap) → card row (2 taps). First-run adds one tap via Overview. PASS.
- **J2 card → back → scroll:** `scrollMem` saves on stop-exit, restores on return; verified restore to exact px. Mechanism PASS (quality issue: F3).
- **J4 marks + reload + folding:** want/done/skip persist in `balkans:places`; list rows mirror card-page state; done/skip sink to group bottom, wants lift; done clears skip and vice versa. PASS.
- **J5 offline:** single self-contained `index.html` (no runtime fetches, zero photos in data), icons precached, cache-first SW, nav fallback to cached index. All hash routes + card pages + map pin-list work from cache. PASS (latent issue: F8).
- **J6 travel-day:** transit is 1 tap from Overview, 2 from anywhere (☰ → Getting between stops); In/Out legs also surfaced on every stop summary (0 extra taps on arrival). Arrival deep-info (Getting around / Money) is 2 taps inside the stop — acceptable given the author's 2026-06-11 removal of mode presets; not re-litigated.
- **J8 code health:** no script errors at boot or during journeys; legacy `#/transport` redirects; no broken `instead` refs; no slug collisions (incl. reserved `map`); no orphaned localStorage keys (numeric section-key migration works; live keys: places, verified, booked, notes, sections, theme, route); missing coordinates degrade to name-search links by design (`coords-missing.md` worklist exists, 10/114 pinned).

## Findings

| ID | Route / location | Sev | Evidence (what happens vs. should) | Proposed fix |
|----|------------------|-----|-------------------------------------|--------------|
| F1 | All stop views — filter system (`F` state, `#filterbar`, `applyFilters`) | **Blocker** | Reproduced: set "Saved" on Belgrade → switch to Budapest → **0 of 38 rows visible**, all sections `display:none`. Filter state persists across stops and while the panel is collapsed; the Filters toggle shows no active state when closed; there is **no empty-state message or Clear affordance** in the gutted view. Mid-trip this reads as "the dossier lost my content." | (a) Active-filter count badge on the Filters button whenever `F` ≠ default, independent of panel visibility. (b) When every card section empties, render an inline "Nothing matches the current filters — **Clear**" card with a working clear button. No change to filter semantics. |
| F2 | Top nav `.tn-tabs` (CSS ~line 237) | **Major** | `justify-content:flex-end` + `overflow-x:auto`: start-side overflow is unreachable in LTR (scrollLeft can't go negative). Row needs ~400px (title 60 + 5×48 tabs + gaps + ☰ 42 + padding); at 360px **~40px clipped**, at 390px (standard iPhone) ~12px — the BUD tab is partially/fully unreachable and unscrollable. Verified by arithmetic; jsdom can't layout. | Drop `flex:1`/`flex-end` pattern: `.tn-tabs{margin-left:auto;min-width:0;justify-content:flex-start}` — right-aligned when it fits, scrollable from the start when it doesn't. |
| F3 | `html{scroll-behavior:smooth}` (line 45) + `window.scrollTo` in `go()` | **Major** | Every route change animates scroll-to-top, and back-from-card **animates from top down to the restored position** — the most frequent gesture in the app becomes a janky scroll cinematic. The rule is a v1 leftover (in-page anchor nav is gone). | Delete the rule (or `scrollTo({top,behavior:'instant'})`). Instant jumps everywhere. |
| F4 | Offline indicator `#offInd` inside `footer#foot` | **Major** | "offline — using saved copy" (the mid-trip trust signal) and "✓ saved for offline" render at the **bottom of the document** — never visible without scrolling past ~38 cards. Verified placement in markup. | Make `.off-ind` `position:fixed` bottom-center (+ safe-area inset), pill style unchanged. |
| F5 | Badge tooltips (`has-tip` handler, ~line 3463) | Minor | Reproduced: tap badge → tip shows; **tap same badge again → tip stays** (second tap is a no-op); only tapping elsewhere dismisses. | Second tap on the same element removes its tip. |
| F6 | Router `go()` invalid-route handling | Minor | Reproduced: `#/budapest/nonexistent` renders Overview but **hash stays stale**; a bad card slug also dumps to Overview instead of its (valid) stop. | If `seg[0]` is a valid stop, fall back to that stop; `history.replaceState` the corrected hash. |
| F7 | Map & pins page rows (`mapRowItem`) | Minor | Rows carry `data-id` but `applyPlace` only runs on `.pagecard` → want/done/skip state invisible on the map list (inconsistent with stop lists). | Run `applyPlace` over `#view-card .card[data-id]` after map render. |
| F8 | `sw.js` fetch fallback | Minor (latent) | `catch(() => caches.match('./index.html'))` returns **HTML for any failed GET**, including future images/non-navigation requests. No live harm today (zero external runtime assets) but a trap for the photo pass. | Fallback only when `req.mode === 'navigate'`. |
| F9 | `footer#foot` | Minor | No horizontal padding; text flush to screen edge at 360px (verified: `footer{}` rule has top spacing only, element sits outside `.view`). | `padding:16px max(18px,env(safe-area-inset-left)) 24px`. |
| F10 | Tap targets | Minor | Sub-44px controls: `.verify` 30px, filter `.chip` 34px, toolbar buttons 38px (others ≥40). | Bump `.verify`/`.chip` min-height to 40px; leave the rest (author chrome density respected). |
| F11 | Dead CSS | Minor | Removed features still styled: `.search-*`, `.modebar/.modechip/.mode-banner`, `.top3`, `.menu-note`, `nav.stops` block, `.card.peek` (no JS toggles peek). ~3–4 KB, misleads future edits. Zero JS references verified. | Delete blocks. No visual change. |
| F12 | Card-page note field debounce | Minor | 250 ms debounce: type → hit back within 250 ms → last input dropped (view innerHTML replaced before timer fires). | Flush pending note save on `hashchange` before re-render. |

## Unverified (not asserted — needs a real device/browser)

- Lighthouse mobile score (cannot run here; no change proposed adds dependencies or render-blocking work, so ≥90 should hold — re-verify after fixes).
- Visual confirmation of F2 clipping and F3 animation on actual iOS/Android (mechanisms code-verified; pixels not rendered).
- Dark/light theme contrast at 360px in sunlight — token values look sane; not measurable here.
- iOS standalone status-bar behavior with manual theme override (theme-color meta is media-query-bound, manual `.theme-dark` won't update it; cosmetic, unconfirmed impact).

## Fix order (pending go)

F1 → F2 → F3 → F4 → F5 → F6 → F7 → F8 → F9 → F10 → F12 → F11.
Constraints honored: no localStorage schema changes (no migration needed — F1–F12 touch chrome/behavior only), no content or taxonomy edits, no new dependencies, single-file stays single-file. After each Blocker/Major fix: re-run affected journey in the harness, record pass/fail below.

## Status

All 12 issues: **RESOLVED** in the v4.2 fix round (2026-06-12). See `CHANGES.md` §
"v4.2 — UX-PASS fix round" for the per-finding implementation. Verified by 112 jsdom
assertions (incl. a 36-test v4.2 suite). One deliberate scope note: `.card.flash`
(also dead but not in the F11 list above) was left in place; `.loc`'s 30px height was
left per F10's "leave the rest". SW → `balkans-v4-4`; `site/` re-synced.
