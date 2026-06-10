# Balkans Dossier — v3 Rewrite · CHANGES

Rewrite of the single-page dossier into a routed, offline-capable, mode-driven v3.
Built 2026-06-10 against the report `balkans-dossier-ux-fix-report-v2.md`.
Architecture stayed static + self-contained: one `index.html` with inline data
(`const TRIP=[…]` spliced by `build.mjs`), `localStorage` only, no backend/framework.

**Deploy:** upload the whole `site/` bundle (or this folder) to Cloudflare —
`index.html` + `sw.js` + `manifest.webmanifest` + `icons/`. The service worker only
works over http(s) (the Cloudflare URL), not from a `file://` copy.

---

## Shipped

### Skeleton (Tier 1)
- **Per-stop hash routing** — `#/overview`, `#/budapest…#/sofia`, `#/transit`,
  `#/checklist`. Legacy `#budapest` / `#transport` anchors redirect. Default route =
  last stop visited (opens there on a bare load). Browser back/forward via hashchange.
- **Top nav bar** on every route — title → overview, five stop tabs (BUD/BEG/PRZ/OHR/SOF,
  active highlighted), overflow menu (Transport / Checklist / Overview).
- **Service worker** (`sw.js`, cache-first, versioned `balkans-v3-1`) precaches the HTML +
  manifest + icons; offline indicator in the footer ("saved for offline" / "offline").
  Installable to the home screen.
- **De-announced** — the menu-not-schedule banner, "How to read this", legend and
  footer disclaimer moved into a single collapsed **About this dossier** on the overview.

### Decision + relevance core (Tier 2)
- **Want / Done / Skip** per card. Done & skip **fold to a one-line row** (tap to peek);
  wants **lift to the top** of their section, done/skip **sink to the bottom**.
- **Modes** (view-configs over the same content): Explore (default) · It's brutal out
  (heat — opens do/around, hides the rest, restricts do-cards to heat-relief) · Arrival
  (money/stay/around/eat first) · Evening (eat first) · Travel day (logistics only +
  a banner to the transit legs). Mode presets never pollute saved section memory.
- **Self-labeling badge tooltips** — tap any star/tag/AVOID badge for its meaning.
- **Area chips** on cards, derived from the existing `neighborhood` field.
- **Time-of-day filter** (Morning / Evening). `when` is derived **conservatively** in
  `build.mjs` from existing copy only (8 morning / 23 evening / 57 any); `any` is never
  hidden.

### Content structures + P2 (Tier 3)
- **Travel-day leg cards** — each leg's spec parsed into chips, with a "confirm" verify
  badge on uncertain legs (the hard Ohrid→Sofia haul, etc.). No invented figures.
- **Money & basics** section per stop — currency code/symbol + a one-line norm, plus a
  tap-to-copy of the base area (to show a taxi). Currency is the country fact only.
- **Pre-trip checklist** view — Verify tab (facts that drift: hours/prices/bus times) and
  Actions tab (book/buy/confirm/download), derived by keyword scan of existing copy.
  Items tick off and persist; verify badges on legs share the same state.
- **Top-3 strip** per stop (from existing top-pick tags), taps jump+flash the card.
- **Client-side search** on the overview (debounced, no library) across all stops.
- **Export my picks** — copies + downloads a plain-text trip log (wants ☆, done ✓), grouped by stop.
- **Light/dark theme toggle** (auto → light → dark), persisted; overrides the OS setting.
- **Booked** toggle on a stay — collapses the neighbourhood alternatives to the base.

### Verification
- `node build.mjs` re-runs preserve every hand edit (only the data block is spliced).
- jsdom smoke tests: 20 (routing) + 18 (decision/modes) + 25 (Tier 3) = **63 assertions, all green.**

---

## Skipped (out of scope this pass) — author input needed

These were deliberately excluded per the operator's "skip content-dependent items" call;
the structures exist where the data supported them, but the following need author content
and were **not** fabricated:

- **Photos / hero images (§10.5)** — none added. Needs the author's own or licensed images.
- **Coordinates (`lat`/`lng`) (P0-4 coord variant, U-12)** — not researched. Map links stay
  **place-name** Google Maps searches (already working). Raw-coords-on-card not added.
- **Currency fee / ATM specifics, exchange detail (P1-4)** — omitted (not in source). Only the
  country currency + a general cash-vs-card norm shipped.
- **Bus station names / coordinates, exact ticket-office rules (P1-3)** — not in source; leg
  cards use the existing prose + spec only, no invented stations/figures.
- **"Easy-first-evening" tags (U-4) and day-trip stat rows (U-10)** — would need per-place
  effort/exertion/heat data the source lacks; not stubbed.
- **JSON backup/restore + full "trip log" with timestamps (U-13)** — export ships as plain-text
  copy + download; structured JSON import/restore not built.

## Notes / known limitations
- Mode + filter state is in-memory (resets on reload by design); want/done/skip, booked,
  verify ticks, section memory, default route and theme **do** persist in `localStorage`.
- Heat mode's cool-only filter applies to the **Do** section; eat/stay are shown via the
  section presets, not re-filtered.
- The `site/` folder mirrors the built `index.html` + `sw.js` and is the upload bundle.
