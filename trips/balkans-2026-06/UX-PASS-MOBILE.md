# UX-PASS-MOBILE.md — Balkans Dossier v4 · iPhone 16 Pro pass · 2026-06-12

Scope: iOS Safari 18 + installed (standalone) PWA on iPhone 16 Pro — 402×874 CSS px, Dynamic Island, home indicator, one-handed thumb use. Excludes everything already logged in UX-PASS.md (F1–F12). Every finding below is verified against the source; rendering claims that need a physical device are flagged inline or under Unverified.

## Findings

| ID | Location | Sev | Evidence (what happens vs. should) | Proposed fix |
|----|----------|-----|-------------------------------------|--------------|
| M1 | `.notefield` font-size:14px (line 424) | **Major** | iOS Safari **zooms the viewport when focusing any input with font-size < 16px**. Tapping the note field on every card page zooms the page in; the user must pinch back out after each note. This hits the exact mid-trip moment ("closed Mon, confirmed 18/6") the field exists for. (Dead `.search-wrap input` at 15px has the same latent issue.) | `font-size:16px` on `.notefield`. No visual redesign — 14→16px on a textarea is imperceptible. |
| M2 | Storage layer — no `navigator.storage.persist()`, no install nudge | **Major** | If the dossier is used in a **Safari tab** rather than installed to the home screen, iOS ITP **evicts all localStorage after 7 days of site inactivity** — every want/done/skip mark, note, and verify tick wiped silently. Installed home-screen apps are exempt. Nothing in the app requests persistence or tells the user the installed app is the safe mode. | (a) Call `navigator.storage?.persist?.()` once at boot (best-effort, no-op where unsupported). (b) One sentence in About: marks live on this phone — add to Home Screen to protect them, use Export as backup. Chrome only; no schema change. |
| M3 | Card-page back ergonomics — `.backlink` top-left only | **Major** (standalone) | On an 874px-tall screen the top-left corner is the worst one-handed thumb zone. In a Safari tab, edge-swipe back covers hash history; in **installed standalone mode swipe-back support for same-document hash navigation is inconsistent across iOS versions** (cannot be verified in this environment) — the top-left link may be the only way back from every card page, hundreds of times per trip. | Add a second back affordance at the **bottom** of the card page (duplicate `.backlink` below `.pgnav`, full-width, ≥48px). Worth it for thumb reach even where swipe works. |
| M4 | `apple-mobile-web-app-status-bar-style: default` (line 12) + dark theme | Minor — verify on device | The meta is fixed at `default` (dark status-bar text). In **installed standalone + dark theme**, the dossier paints `#16140f` behind the status bar (viewport-fit=cover, topnav padding) — clock/battery rendered as near-black on near-black. Code-verified mismatch; exact iOS 18 rendering behavior (some versions auto-derive) needs a device check. Supersedes the looser note in UX-PASS.md Unverified. | Test on device first. If confirmed: `black-translucent` plus a guaranteed-dark strip is wrong for light theme, so the honest fix is picking the value matching the user's dominant theme, or leaving `default` and forcing the topnav top-padding area light-on-dark-aware. Decide after device check — flagged, not fixed blind. |
| M5 | Live containers pad right edge with `safe-area-inset-left` — `.view` (228), `.tnrow` (235), `.tn-menu` (246), `.subbar` (252) | Minor | All four live layout containers use `max(…, env(safe-area-inset-left))` for **both** sides ( `.view` via padding shorthand). Portrait: harmless (both insets 0). **Landscape with the island on the right**: right inset ≈ 59px, left ≈ 0 — right padding collapses to the 14–18px floor and content sits under the camera housing / curved corner. The only correct left/right pairs in the file are in dead v1 selectors (`.wrap`, `nav.stops`). | Use `env(safe-area-inset-right)` for right padding in the four live containers. |
| M6 | `:hover` rules on `.tn-tab`, `.toolbar button` (+ dead `nav.stops a`) | Minor | iOS applies `:hover` on first tap and it **sticks** — toolbar buttons and nav tabs keep their hover background after tapping until the next touch elsewhere. Reads as a stuck/active state on controls that toggle (`Filters`). | Wrap hover rules in `@media (hover:hover)`. |
| M7 | No `touch-action: manipulation` anywhere (0 hits) | Minor | Double-tap-to-zoom is armed on every control. Rapid toggling — Save→Done on a card, tier chips, checklist ticks — risks an accidental viewport zoom instead of the second tap registering. | `touch-action:manipulation` on `.act,.chip,.cl-item,.verify,.tn-tab,.card.row,.toolbar button,.bookbtn,.copybtn`. |
| M8 | `.card.row` / card-page controls — no `user-select` guard | Minor | Long-press during a scroll-hold on a row name triggers iOS text-selection + callout over the list (only `summary` and `.coords` are handled today). | `-webkit-user-select:none` on `.card.row` and `.act`; keep `.coords` selectable (offline-maps paste path, U-12). |
| M9 | `.view.active{animation:rise .32s}` (line 230) not gated | Minor | The reduced-motion media query covers `.stop` only (line 79); users with Reduce Motion on still get the rise animation on **every route change**. | Add `.view.active` to the reduce block. |
| M10 | `.rpin` (40×40, negative margins) flush against row-navigation surface | Minor | The Maps pin sits in the right-edge thumb zone, 0px from the row's navigate area. A mis-tap doesn't open the wrong page — it **exits the app into Google Maps**, which mid-trip offline is a dead end. (Size itself was waived in F10; this is adjacency + consequence.) | `min-width:44px;min-height:44px` on `.rpin` plus ~4px visual separation from `.rnm` hit area. |
| M11 | `history.scrollRestoration` never set (0 hits) | Minor | Safari attempts its own scroll restore on same-document hash pops **before** `hashchange` fires; `go()` then re-scrolls. With F3 fixed (instant scroll) this manifests as a one-frame double jump on back-swipe/back-tap. | `history.scrollRestoration='manual'` at boot. One line; makes `go()` the single scroll authority. |

## Verified non-issues on this device class (no action)

- **402px portrait layout:** no horizontal scroll sources; `.areachip` hidden ≤430px by design, rows show name+stars+price+pin cleanly.
- **Dynamic Island / sticky header:** `viewport-fit=cover` + `.topnav{padding-top:env(safe-area-inset-top)}` + matching `--bg` paint correctly behind the island in standalone portrait; rubber-band overscroll shows the same bg.
- **Bottom inset:** `.view` bottom padding `calc(env(safe-area-inset-bottom)+64px)` clears the home indicator.
- **No `vh` units, no web fonts, no FOUT/CLS sources at 402px** (zero photos in data).
- **Keyboard:** note field is the last element of the card; Safari's native scroll-into-view suffices, nothing fixed-position fights the keyboard (until F4's fixed pill — keep it `bottom: max(12px, env(safe-area-inset-bottom))`, it dodges the keyboard fine as a transient toast).
- **Export on iOS:** blob `download` + clipboard both inside the click gesture — supported in iOS 18 Safari and standalone; the Files-sheet behavior is acceptable.
- **Both `apple-mobile-web-app-capable` and `mobile-web-app-capable` metas present;** manifest + apple-touch-icon correct for install.

## Unverified (device required)

- M4 actual status-bar rendering per iOS 18 standalone + theme combinations.
- Standalone edge-swipe-back behavior for hash history on iOS 18 (M3's fix is justified by thumb reach regardless of the answer).
- ProMotion/scroll feel of the `rise` animation and the F3 fix — code-correct, not felt here.

## Fix order (pending go)

M1 → M2 → M3 → M11 → M5 → M6 → M7 → M8 → M9 → M10; M4 parked behind a device check.
All fixes are chrome/CSS/one-liners: no storage schema changes, no content edits, no dependencies, single-file preserved. M2's `persist()` call and About sentence are the only non-CSS additions (~6 lines).

## Status

M1–M3, M5–M11: **RESOLVED** (2026-06-12 mobile fix round — see `CHANGES.md` § v4.3; 153 jsdom assertions green, SW → `balkans-v4-5`).
M4: **PARKED** — awaiting the real-device status-bar check before any fix is chosen.
