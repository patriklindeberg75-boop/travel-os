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

---

# v4 — Taxonomy v2 · card pages · price tiers (Tier A floor)

Built 2026-06-11 against `balkans-dossier-ux-fix-report-v3-to-v4.md` § 11.
Architecture unchanged: single self-contained `index.html` (data block spliced by
`build.mjs`), hash routing, `localStorage` only, no framework, no backend.

## Shipped (Tier A — trip-critical floor)

- **Taxonomy v2 (11.1/11.2/11.4)** — every stop reorganized into Activities
  (Sights & culture / Nature & day trips / Walks & neighbourhoods / Evening &
  nightlife), Food (Restaurants / Street & quick eats / Cafés & sweets),
  Work cafés, and General information (Avoid · Getting around · Timing ·
  Money & basics · Where to stay, as nested sections). Sub-types with <2 items
  fold into a sibling (merged label; 3+ merges = generic label; a lone group
  drops the header). Empty sub-types/categories never render.
- **Dual-listed cafés (11.2)** — work-cafés that are also experience cafés
  (Kino Lumbardhi, Fellas, Csiga) appear in both lists under the same `data-id`
  (one card, one page, shared state). Work-café pages carry a Wi-Fi / outlets /
  laptops / noise / long-stay table; unknown fields render as `TODO — not yet
  checked` (no guessing).
- **A page for every card (11.6)** — routes `#/{stop}/{card-slug}` (avoid
  entries: `#/{stop}/avoid-{slug}`). List rows are now a pure one-line index:
  state icon · name · heat/friend dots · stars · €-tier · area chip · maps pin
  (the pin stays on the row so "take me there" remains one tap). Card pages
  hold the full prose, facts, category chips, price tier, photo slot, map
  button + raw-coordinates slot, want/done/skip, a **free-text note field**
  (persisted), and next/previous-in-category links. Browser back (or the
  back-link) returns to the stop list **at the exact scroll position left**.
- **Price tiers (11.3)** — €/€€/€€€ anchored to the €50/day budget, defined in
  About this dossier; shown on rows and pages. Derived only from price signals
  already in the copy (figures, "ultra-budget/pocket change/dirt-cheap" → €,
  qualitative mid signals → €€, "pricier/premium/overpriced" → €€€); cards with
  no signal carry no tier and are listed under TODO-PRICE below.
- **Avoid counterpart chips (11.4)** — where an avoid entry names a listed
  alternative, the listed card links its avoid counterpart (⚠ chip) and the
  avoid page links back ("Use instead: …"). 8 pairs wired.
- **State migration (11.7.3)** — card ids are unchanged, so want/done/skip,
  verify ticks, booked, theme, notes and default route survive as-is. Only
  section open/closed memory moved to semantic keys; orphaned numeric keys are
  deleted on first load. **No marks are wiped.**
- **Modes remapped** to the new sections (heat → cool-filtered Activities;
  arrival → General info + Food first, sights suppressed; travel-day → info >
  getting-around + banner; evening → Food + Activities).
- Export now includes your per-card notes. Search results link straight to
  card pages. Service worker cache bumped to `balkans-v4-1`.

## QA round (11.7)

- 63-assertion jsdom suite: route navigation (incl. legacy `#budapest` /
  `#transport` anchors and unknown-slug fallback), taxonomy + fold rule,
  dual-listing, tier badges, state migration (seeded pre-v4 marks survive),
  card-page toggles mirroring rows, note persistence, scroll restore,
  all 5 modes on the new sections, filter matrix + emptied-group hiding,
  search, checklist, reflow (wants lift / done sink). All green.
- `node build.mjs` re-run after the rewrite — hand edits preserved
  (data-block-only splice), validation extended to `cat`/`also`/`pt`.

## Deferred to Tier B / author input

- **Per-stop map (11.5)** — next: vendored Leaflet, category-colored pins,
  pin-list fallback offline or where a stop has <5 pinned places.
- **Coordinates** — none researched yet; `coords-missing.md` (generated by
  build.mjs) is the worklist. Hero set (stop centers + ★★★ picks) first.
- **Photos (10.5)** — renderer shows `s.photo` (stop hero) and `p.photo`
  (card page) when the data provides them; nothing sourced. TODO-PHOTO slots =
  5 stop heroes + ★★★ card thumbnails.
- **Day-trip stat rows (U-10)** and easy-first-evening tags (U-4) — source
  lacks the per-place effort/heat data; not stubbed.
- **Author bug list (11.7)** — none supplied yet; jumps the queue when it is.

## TODO-PRICE (15 — no price signal in source copy; author to fill `pt`)

Budapest: Csiga Café · Belgrade: Stara Hercegovina, Radecki, Splav Koliba,
Iva New Balkan Cuisine, Gušti Mora, Meze Restoran Dvorište · Prizren: Kino
Lumbardhi, Qebaptore Bekimi, Shepherd stalls (Prevallë), Restaurant Marashi,
Hani i Vjetër, Restaurant Koha (Prevallë) · Ohrid: Trpejca village tavernas,
Domakjinska Kukja (Velestovo)

## Migration table (card → old location → new home → price tier)

| Card | Old location | New home | Price tier (derivation) |
|---|---|---|---|
| Ervin Szabó Library | Budapest / Do | Activities / Sights & culture | — |
| Római-part | Budapest / Do | Activities / Nature & day trips | — |
| Lumen Café | Budapest / Do | Work cafés | — |
| Kelet Kávézó | Budapest / Do | Work cafés | — |
| Tilos a Tilos | Budapest / Do | Activities / Evening & nightlife | — |
| Lake Feneketlen | Budapest / Do | Activities / Walks & neighbourhoods | — |
| Fellini Culture Pub | Budapest / Do | Activities / Evening & nightlife | — |
| Óbuda Fő tér | Budapest / Do | Activities / Walks & neighbourhoods | — |
| Csiga Café | Budapest / Eat | Food / Restaurants (also: Work cafés) | TODO-PRICE |
| Rákóczi téri Vásárcsarnok | Budapest / Eat | Food / Street & quick eats | € — “ultra-budget street food” |
| Lehel Piac lángos | Budapest / Eat | Food / Street & quick eats | € — lángos; avoid-card contrast (€15–20 is the scam price) |
| Pozsonyi Kisvendéglő | Budapest / Eat | Food / Restaurants | €€ — sit-down stews at “true neighbourhood prices” |
| Római-part hekk stalls | Budapest / Eat | Food / Street & quick eats | € — “ultra-budget fried hake” |
| Ada Ciganlija — Makiš side | Belgrade / Do | Activities / Nature & day trips | — |
| Ada Međica | Belgrade / Do | Activities / Nature & day trips | — |
| Pržionica | Belgrade / Do | Work cafés | — |
| Silosi | Belgrade / Do | Activities / Evening & nightlife | — |
| Gavez Club | Belgrade / Do | Food / Restaurants | € — “dirt-cheap” |
| Košutnjak forest trails | Belgrade / Do | Activities / Nature & day trips | — |
| Zaokret | Belgrade / Do | Activities / Evening & nightlife | — |
| Splavs on Savski kej | Belgrade / Do | Activities / Evening & nightlife | — |
| Kalemegdan / Belgrade Fortress, for sunset | Belgrade / Do | Activities / Sights & culture | — |
| Church of Saint Sava (Hram Svetog Save) | Belgrade / Do | Activities / Sights & culture | — |
| Nikola Tesla Museum | Belgrade / Do | Activities / Sights & culture | — |
| Ružica Church & St. Petka Chapel | Belgrade / Do | Activities / Sights & culture | — |
| Museum of Yugoslavia (House of Flowers / Tito's tomb) | Belgrade / Do | Activities / Sights & culture | — |
| Jevremovac Botanical Garden | Belgrade / Do | Activities / Walks & neighbourhoods | — |
| Topčider Park (+ Residence of Prince Miloš) | Belgrade / Do | Activities / Walks & neighbourhoods | — |
| Gardoš / Millennium Tower | Belgrade / Do | Activities / Sights & culture | — |
| Avala Tower (Avalski toranj) | Belgrade / Do | Activities / Nature & day trips | — |
| Aviation Museum (Muzej vazduhoplovstva) | Belgrade / Do | Activities / Sights & culture | — |
| Eternal Derby — Partizan vs Crvena zvezda | Belgrade / Do | Activities / Evening & nightlife | — |
| Skadarlija | Belgrade / Do | Activities / Walks & neighbourhoods | — |
| Knez Mihailova Street | Belgrade / Do | Activities / Walks & neighbourhoods | — |
| Belgrade Waterfront (Beograd na vodi) | Belgrade / Do | Activities / Walks & neighbourhoods | — |
| Grill 'Loki' | Belgrade / Eat | Food / Street & quick eats | € — “big cheap pljeskavica” |
| Efi cafe | Belgrade / Eat | Work cafés | — |
| Bajloni Pijaca | Belgrade / Eat | Food / Street & quick eats | € — “ultra-cheap” |
| Pekara Petrović | Belgrade / Eat | Food / Street & quick eats | € — “cheap burek” |
| Stara Hercegovina | Belgrade / Eat | Food / Restaurants | TODO-PRICE |
| Radecki | Belgrade / Eat | Food / Restaurants | TODO-PRICE |
| Splav Koliba | Belgrade / Eat | Food / Restaurants | TODO-PRICE |
| Čedić | Belgrade / Eat | Food / Restaurants | € — “massive cheap Serbian portions” |
| Iva New Balkan Cuisine | Belgrade / Eat | Food / Restaurants | TODO-PRICE |
| Zeleni Venac Market | Belgrade / Eat | Food / Street & quick eats | € — market to-go, stated alternative to ultra-cheap Bajloni |
| Gušti Mora | Belgrade / Eat | Food / Restaurants | TODO-PRICE |
| Meze Restoran Dvorište | Belgrade / Eat | Food / Restaurants | TODO-PRICE |
| Mama Shelter rooftop | Belgrade / Eat | Food / Restaurants | €€€ — “pricier — go for the view” |
| 20/44 | Belgrade / Eat | Activities / Evening & nightlife | — |
| Tri šešira | Belgrade / Eat | Food / Restaurants | €€€ — avoid-card counterpart: “overpriced … paying a premium” |
| Šaran | Belgrade / Eat | Food / Restaurants | €€€ — “pricey/upscale-tourist” (own card + avoid counterpart) |
| Prevallë — Livadica glacial-lake hike | Prizren / Do | Activities / Nature & day trips | — |
| Sunrise fortress climb (Kalaja) | Prizren / Do | Activities / Sights & culture | — |
| Early-morning çajtore | Prizren / Do | Food / Cafés & sweets | € — “~€0.30 tea” |
| Kino Lumbardhi | Prizren / Do | Work cafés (also: Food / Cafés & sweets) | TODO-PRICE |
| Gazi Mehmet Pasha Hammam | Prizren / Do | Activities / Sights & culture | — |
| Lumbardhi gorge walk | Prizren / Do | Activities / Walks & neighbourhoods | — |
| BarAca | Prizren / Do | Activities / Evening & nightlife | — |
| Qebaptore Bekimi | Prizren / Eat | Food / Street & quick eats | TODO-PRICE |
| Fellas Coffee & Kitchen | Prizren / Eat | Work cafés (also: Food / Cafés & sweets) | € — “~€3 meal” |
| Traditional pekara, Ura | Prizren / Eat | Food / Street & quick eats | € — “ultra-budget local breakfast” |
| Tetova Sweet Shop | Prizren / Eat | Food / Cafés & sweets | € — “for pocket change” |
| Shepherd stalls, Prevallë | Prizren / Eat | Food / Street & quick eats | TODO-PRICE |
| Restaurant Marashi | Prizren / Eat | Food / Restaurants | TODO-PRICE |
| Hani i Vjetër | Prizren / Eat | Food / Restaurants | TODO-PRICE |
| Restaurant Koha, Prevallë | Prizren / Eat | Food / Restaurants | TODO-PRICE |
| Elshani — Gorno Konjsko hike | Ohrid / Do | Activities / Nature & day trips | — |
| Milenko's viewpoint, above Kaneo | Ohrid / Do | Activities / Evening & nightlife | — |
| St. Naum military beach & springs | Ohrid / Do | Activities / Nature & day trips | — |
| Trpejca — Zaumska coastal hike | Ohrid / Do | Activities / Nature & day trips | — |
| Beach Labino | Ohrid / Do | Activities / Nature & day trips | — |
| Elshani village walk | Ohrid / Do | Activities / Nature & day trips | — |
| Peribleptos church & its local guide | Ohrid / Do | Activities / Sights & culture | — |
| Mesokastro backstreets & Turkish bazaar | Ohrid / Do | Activities / Walks & neighbourhoods | — |
| Gostilnica Vkusno | Ohrid / Eat | Food / Restaurants | € — “cheap grilled meats and cold beer” |
| Burekdžilnica Martina | Ohrid / Eat | Food / Street & quick eats | € — burek — pocket-change item class |
| Turkish Bazaar gjomleze vendors | Ohrid / Eat | Food / Street & quick eats | € — “€2–3” |
| Zelen Pazar (green market) | Ohrid / Eat | Food / Street & quick eats | € — “cheap local feast” market shopping |
| Restaurant Antico | Ohrid / Eat | Food / Restaurants | €€ — “honest prices without the waterfront markup” — sit-down fish/stew |
| Restaurant Panorama | Ohrid / Eat | Food / Restaurants | €€ — “fairly priced fish and beef stew” — sit-down |
| Trpejca village tavernas | Ohrid / Eat | Food / Restaurants | TODO-PRICE |
| Domakjinska Kukja, Velestovo | Ohrid / Eat | Food / Restaurants | TODO-PRICE |
| Ashurbanipal | Sofia / Do | Food / Restaurants | € — “cheap, off-beat hidden gem” |
| Zhenski Pazar (Women's Market) | Sofia / Do | Food / Street & quick eats | € — “cheap street food” |
| Bar Lorca | Sofia / Do | Activities / Evening & nightlife | — |
| Crystal Garden | Sofia / Do | Activities / Evening & nightlife | — |
| Vkusnoto Kebapche | Sofia / Do | Food / Street & quick eats | € — “rock-bottom prices” |
| HleBar | Sofia / Do | Food / Cafés & sweets | € — banitsa — pocket-change item class |

