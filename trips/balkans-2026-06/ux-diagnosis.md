# UX Diagnosis — Balkans Dossier HTML (`index.html`)

**Date:** 2026-06-10
**Artifact under review:** `trips/balkans-2026-06/index.html` (self-contained, inline `TRIP`/`LEGS` data, client-side render)
**Lens:** in-trip usability on **mobile Safari, iPhone 16 Pro**, opened directly as an HTML file
**Mode:** diagnose only — no fixes this session. Fixes happen in a later session.
**Constraints (locked with operator):** internet available on-trip; priority jobs **A** ("2 free hours here — what's good *near me now*?"), **D** ("where to eat tonight that fits my routine"), **E** ("track what I've done / want to do").

---

## Verdict

**It does its job as a pre-trip briefing. It does NOT yet do its job as an on-the-ground companion.**

As a *reference document* it is genuinely strong — the "menu, not a schedule" framing, the heat-awareness (per-stop `heatLabel`, `shade`/`swim` relief tags), the three-tier star ranking, and the AVOID trap cards are well-judged and worth preserving. For reading on the sofa before the trip, it works.

But measured against the three in-trip jobs the operator actually named, it is currently a **read-only prototype**:

- **Job A ("near me now") — fails.** There is no location signal on the cards you want to visit (no neighborhood, no coordinates, no map), and no proximity/"near me" capability. You cannot answer "what's good around here" from this file.
- **Job D ("eat tonight") — partially fails.** You can read the Eat list, but you can't tap a place to navigate to it, and there are no opening hours / "open now", so you can't tell what's actually available tonight.
- **Job E ("track done / want") — fails entirely.** There is no saved state of any kind (no `localStorage`, no toggles, no favorites). Nothing you tap is remembered.

The single highest-leverage gap is that **nothing is tappable** — place names are plain text (`card()`, [index.html:1788](index.html#L1788)), so every "go there" action requires manually retyping the name into Google Maps. That one gap alone undercuts A and D. The second is the **total absence of persistent state**, which removes E.

Encouraging note for the fix session: the **data spec is already ahead of the artifact**. `references/dossier-template.md` § Structured data companion already defines per-place `id` (explicitly "for localStorage 'tried it / want it' toggles"), `lat`/`lng`/`map_link`, `neighborhood`/`city`, and `hours`. The Balkans data and the renderer simply haven't caught up to the spec. So most fixes are "close the gap to the existing spec," not "invent something new."

---

## Findings (triaged)

Severity key: **MUST-FIX** = blocks a named in-trip job · **SHOULD-FIX** = significant friction · **NICE-TO-HAVE** = polish.

### MUST-FIX

**F1 — Nothing is tappable to a map.** `card()` ([index.html:1788](index.html#L1788)) renders the place name as plain text inside `<span class="nm">`. To navigate anywhere you must read the name, switch apps, and retype it into Google Maps.
- *Why it hurts in-trip:* directly blocks **A** and **D** — the core "I want to go there now" action is a manual, multi-step chore on a phone.
- *Fix direction:* make each place name a tap-through to a Google Maps query link (`https://www.google.com/maps/search/?api=1&query={name}+{neighborhood}+{city}`), upgrading to a `lat`/`lng` deep link once coordinates are captured.

**F2 — No location signal on `do`/`eat` cards; "near me" is impossible.** Place cards carry only `nm / t / tags / hook / facts` — no neighborhood, no coordinates. (The template *spec* defines `neighborhood`/`city`/`lat`/`lng`, but the Balkans data omits them and the renderer ignores them.) There is no grouping-by-area and no proximity sort.
- *Why it hurts in-trip:* **A** ("what's good near me right now") cannot be answered at all — the file has no notion of where you are or where anything is.
- *Fix direction:* surface each place's neighborhood on the card; allow grouping/filtering by neighborhood; longer-term a "near me" sort using captured coords + device geolocation.

**F3 — No saved state; job E is entirely absent.** No `localStorage`, no "been there / want to go" toggle, no favorites, no notes. The template spec explicitly anticipates `localStorage` toggles keyed on a per-place `id` — but the Balkans data has no per-place `id` (only the 5 stops have `id`) and the renderer has no toggle UI.
- *Why it hurts in-trip:* **E** ("track what I've done / want to do") is impossible; the dossier can't accumulate your decisions across two weeks.
- *Fix direction:* add a stable per-place `id` to the data + a tap toggle (want / done) persisted to `localStorage`, plus a "my picks" filter view.

**F4 — No opening hours / "open now" signal.** `facts` occasionally holds free-text timing ("best midday") but there is no structured `hours` field and no computed open/closed state.
- *Why it hurts in-trip:* **D** ("eat tonight") and **A** ("worth walking to now") both need to know if a place is even open; right now you'd arrive to find out.
- *Fix direction:* capture structured `hours` per place (the spec already lists the field); render a computed "open now / closed" badge against the device clock.

### SHOULD-FIX

**F5 — No filtering of the long lists.** The "menu" is deliberately long (≈100+ places across 5 stops), but you can't filter a stop by tag (heat-relief / eat / work-café), by star tier, or by open-now. Scanning a long list on a phone to find one specific thing is slow.
- *Why it hurts in-trip:* slows every job; **A** especially ("I just want the heat-relief options near here, now").
- *Fix direction:* a client-side tag-chip + tier filter row (per stop or global); reuse the existing `TAG` map.

**F6 — Sticky nav and scroll-margins ignore iPhone safe areas; headings can clip.** `nav.stops` is `position:sticky; top:0` ([index.html:54](index.html#L54)); `.stop` uses `scroll-margin-top:58px` ([index.html:66](index.html#L66)). There is no `env(safe-area-inset-top)` handling, and the nav pill links are ~32px tall (`padding:6px 11px`, [index.html:57](index.html#L57)) — below Apple's 44pt minimum tap target.
- *Why it hurts in-trip:* on iPhone 16 Pro the sticky bar sits under the Dynamic Island / Safari chrome, so tapping a stop can land its heading partly hidden; the small nav pills are a fiddly tap on a moving row.
- *Fix direction:* add `env(safe-area-inset-*)` padding to the sticky nav; reconcile `scroll-margin-top` with the real sticky height; enlarge nav tap targets toward 44pt.

**F7 — No safe-area insets anywhere on the layout.** `.wrap` uses fixed `padding:0 18px` ([index.html:36](index.html#L36)); `body` has no `env(safe-area-inset-*)`.
- *Why it hurts in-trip:* in landscape or near the home indicator, content can run under the rounded corners / indicator on iPhone 16 Pro.
- *Fix direction:* apply `env(safe-area-inset-left/right/bottom)` to `.wrap` and the sticky nav.

**F8 — Everything starts collapsed except "Do," and open/closed state isn't remembered.** Each stop renders `stay`/`eat`/`avoid`/`mobility`/`timing` collapsed ([index.html:1831-1849](index.html#L1831)); `Expand all`/`Collapse all` are session-only.
- *Why it hurts in-trip:* to find tonight's dinner (**D**) you re-tap into every stop's Eat section every time you open the file.
- *Fix direction:* remember per-section open/closed in `localStorage`; optionally support deep-linking straight to a section.

**F9 — No time-of-day lens.** Jobs A and D are time-anchored ("now", "tonight"), but the dossier has no notion of the current time.
- *Why it hurts in-trip:* you do the mental filtering ("it's 13:00 and 33°C → I want shade/swim"; "it's 19:00 → dinner") that the file could do for you.
- *Fix direction:* lightweight client-clock surfacing — float heat-relief up at midday, dinner picks up in the evening; purely additive, never a fixed schedule (respects "menu, not a schedule").

**F10 — No text search.** Across ≈100+ places there's no way to jump to one a friend named.
- *Why it hurts in-trip:* "where was that bakery X mentioned?" means manual scrolling.
- *Fix direction:* a single client-side search box filtering cards by name/hook.

### NICE-TO-HAVE

**F11 — AVOID cards show a location (`where`) but the places you actually want don't.** `avoidCard()` ([index.html:1795](index.html#L1795)) renders `where` (neighborhood); `card()` renders no location. The thing you're meant to skip is better located than the thing you're meant to find.
- *Why it hurts in-trip:* mild inconsistency that compounds F2.
- *Fix direction:* render neighborhood on `do`/`eat` cards too (folds into F2).

**F12 — No web-app / "Add to Home Screen" polish.** No `apple-mobile-web-app-*` meta tags, `theme-color`, or manifest. Opening the file and adding it to the Home Screen yields a plain bookmark, not an app-like launch.
- *Why it hurts in-trip:* purely cosmetic given internet is available, but a Home-Screen icon is the natural way to reach this daily on a trip.
- *Fix direction:* add web-app meta tags + `theme-color`; optionally a minimal manifest so it launches chromeless.

**F13 — First scroll is consumed by chrome before the first stop.** Masthead + menu-note banner + legend + toolbar push the first stop down the initial viewport. (The legend is correctly collapsed by default — `<details class="legend">` with no `open`, [index.html:199](index.html#L199) — so this is minor.)
- *Why it hurts in-trip:* slightly slows the "open and get to content" moment.
- *Fix direction:* tighten masthead spacing on small viewports; consider a more compact menu-note on first paint.

---

## What works — preserve in the fix session

These are deliberate, good design choices the fix session should **not** regress:

- **"Menu, not a schedule" framing** (masthead banner, [index.html:194](index.html#L194)) — the governing principle; any new feature (time-of-day lens, filters) must stay additive and never impose a fixed itinerary.
- **Heat-awareness** — per-stop `heatLabel`, the `flag`/`cool` styling, and the `shade`/`swim` heat-relief tags are exactly right for a summer Balkans trip.
- **Three-tier star ranking** + the "Start here" anchor per stop — fast triage of a long list.
- **AVOID trap cards** — the red anti-tourist cards are distinctive and on-brand.
- **Dark mode** (`prefers-color-scheme`, [index.html:21](index.html#L21)) and **reduced-motion** handling — already considerate.
- **Self-contained single file** — opens offline, no fetch, no CORS; keep this property when adding features (map links are external taps, not page fetches, so they don't break it).

---

## Cross-cutting observation (feeds the workflow-additions doc)

Most MUST-FIX gaps are **already specified** in `references/dossier-template.md` but unrealized in the generated data and the renderer. The fix is largely *closing the gap to the existing spec* — make the workflow actually emit the fields (`id`, `neighborhood`, `lat`/`lng`/`map_link`, `hours`) it already promises, and have the renderer consume them. The systemic side of this is captured separately in [`ux-workflow-additions.md`](ux-workflow-additions.md) so future dossiers inherit the fix rather than it staying a Balkans one-off.
