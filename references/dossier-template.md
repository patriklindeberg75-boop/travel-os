# Destination Dossier — Output Template

This document specifies the structure of the destination dossier output. The `dossier-orchestrator` agent reads this at the format step. Tune section list and place-line format here — not in the agent.

Per Decision 7 (operator-confirmed in `pipeline/decisions.md`), the dossier output contains NO grounding evidence block. Grounding data is logged to `logs/dossier-runs.md`. The output stays clean.

## Trip header block (appears once at top)

```
# {Destination} — {Dates} — {Theme}

Work-load: {hours}h/week
Budget posture: ~€{floor}/day baseline; willing to splurge €{splurge_lo}–{splurge_hi}
Weather check: {forecast_max_celsius}°C max — {PASS | FLAGGED >30°C}

**How to use this dossier:** it's a *menu, not a schedule.* Every section is a
long list of vetted options to pick from on the spot — by mood, weather, and
energy that day. Nothing here is a fixed plan, and nothing on the trip is
locked: night counts are a starting point, and any stop can grow or shrink if a
place is worth more time. The dossier's only job is to keep good options within
reach — hidden gems first, plus the popular places that genuinely hold up, minus
the obligatory-icon tourist traps — never to tell you what to do.
```

If `forecast_max_celsius` is unknown, render the weather line as `Weather check: forecast unknown — verify before booking`.

**The "How to use" block is mandatory and verbatim** — it renders once at the
top of every dossier (single-base and multi-stop alike). It encodes a hard
operator principle: the dossier is a flexible option-menu, never a predetermined
itinerary. This governs the whole output — see the rule below.

## Menu, not a schedule (governing principle)

The dossier surfaces **breadth of vetted options**, never a sequenced day-by-day
plan. The operator decides on the spot. Apply throughout:

- **Never render a fixed itinerary** (no "Day 1 / Day 2…" running order, no
  hour-by-hour schedule). Sections are pick-from lists, not timelines.
- **When folding in external input** that arrives as a schedule (e.g. a friend's
  day-by-day plan), mine it for *places* and add them to the shortlists — do not
  reproduce the schedule.
- **Prefer more vetted options over a curated single path.** Tiers (🔥/👍/🆗)
  and the ⭐ anchor express *strength*, not a sequence to follow.
- **Treat night counts and routes as starting points**, not commitments.

The one place a time-of-day hint belongs is the per-place `Best time` card field
(heat-smart windows) — that guides *when an option is good*, not *what to do when*.

## Priority tiers, per-place card, and the "one thing" anchor

These rules govern Sections 3 (activities) and 4 (food) — the per-place
recommendation lists — and any other section that lists individual places.

**Priority tiers (sort AND label).** Every recommended place carries exactly
one tier. Tiers SORT the list (highest first) and are glanceable on a phone via
a leading icon:

- 🔥 **HIGH** — highly recommend; would re-route the day for this.
- 👍 **REC** — recommend; strong pick if it fits the day.
- 🆗 **OK** — worth it only with spare time.

Within a section (and within each daytime/dinner subhead), render all 🔥 first,
then 👍, then 🆗. Within a tier, float the single strongest pick to the top.

**The "one thing" anchor.** At the very top of each stop's block (multi-stop) or
at the very top of the dossier body (single-base), surface ONE anchor — the
single highest-value thing at that stop:

```
⭐ If you do one thing here: {place / experience} — {one-line why}.
```

The anchor place still appears in its section below, tagged 🔥. Exactly one
anchor per stop — never two. The sole exception: if a stop has NO surviving
Section 3 or 4 places (a thin or missing paste-back), omit the anchor line for
that stop and note `⭐ anchor omitted — no activities/food surfaced for this stop`
rather than inventing one. Never fabricate an anchor to satisfy the rule.

**Per-place card (fixed micro-template).** Every place in Sections 3 and 4 uses
this exact shape — a one-line hook, then short labelled fields. No
free-paragraph descriptions; the card is what reads in two seconds standing in
the street and what makes the output machine-checkable.

```
{tier-icon} **{Place name}** — {Neighborhood}, {City}
{One-line hook: why this / why it fits you.}
- Best time: {when to go — time of day, day of week, heat-smart window}
- Cost: {price anchor in local currency — coffee / meal / beer / entry}
- Duration: {how long to budget}
- Hours: {opening hours and days closed}
- Find it: {nearest landmark or street; for hidden spots, how to find it}
```

For any item that is a hike or mountain day, add one more line:

```
- Hike data: {distance} · {elevation gain} · water on route: {yes/no} · mobile signal: {yes/no} · last transport back: {time}
```

If a field is genuinely unknown from the paste-back, write
`unknown — confirm on the ground` rather than omitting the line or fabricating a
value. Never invent hours, prices, or coordinates.

## Structured data companion (for the HTML travel-companion app)

In addition to the markdown dossier, the orchestrator writes a machine-readable
twin at `trips/{slug}/dossier-data.json`. The markdown is for iPhone Notes; the
JSON is loaded directly by Patrik's standalone HTML renderer (a local file that
may use browser localStorage for "tried it / want it" toggles, keyed on `id`).

**This schema matches the HTML renderer's data model exactly** so the file drops
straight in (the renderer reads a `trip` array of stops + a `legs` array).
Patrik owns and maintains the HTML shell; the workflow produces only this data
file. The JSON is a render of the SAME synthesized data — never a fabricated
value, and never a place the markdown dossier does not also contain. It MAY
carry additive structured fields the current HTML does not yet render
(`lat`/`lng`, hours, connectivity, sunrise/sunset, images) — these ride along
for future rendering and cost nothing.

**V1 required place fields (not optional).** Every `do` / `eat` / `avoid` place
object MUST carry these four, so the place is locatable and tappable in the
renderer (the in-trip "where is it / take me there" loop):

- **`neighborhood`** and **`city`** — *authored* by the workflow (human knowledge:
  which district, which city). Required, non-empty, on every place.
- **`id`** and **`map_link`** — *derived deterministically by `build.mjs`* from the
  authored fields, NOT hand-authored in the JSON. `id` = `{stop-kebab}-{place-kebab}`
  (the kebab rule below); `map_link` = the Google-Maps search rule below. The build
  overwrites any stale value and self-checks that every place has `neighborhood` +
  `city` before deriving — it aborts the build if one is missing. This keeps the
  JSON DRY (no 114 hand-typed URLs) while guaranteeing the generated data block the
  renderer reads ships all four. `lat`/`lng` stay genuinely optional (often unknown);
  when present they take precedence in `map_link`.

### Controlled vocabulary (canonical — do not improvise)

**Tier `t` (sorts the cards, maps to the markdown icon):**
`3` = 🔥 HIGH · `2` = 👍 REC · `1` = 🆗 OK.

**Tags (fixed set — every place tagged from this list only, so each renders an
icon):** `work`, `eat`, `sleep`, `swim`, `shade`, `hike`, `social`, `market`,
`culture`, `view`. (`swim` and `shade` are the heat-relief tags.)

**`facts` chip icons (fixed ids the renderer ships):** `i-wallet` (cost),
`i-clock` (best time / hours), `i-pin` (find-it / neighborhood), `i-bus`
(transport access), `i-mountain` (on a hike), `i-eat` (also serves food),
`i-tree` (shade), `i-coffee` (work cafe). Compose each place's `facts` from its
gathered fields using these ids; never emit a fact with an icon id outside this
set. (Tag icons are resolved by the renderer from the tag name; `facts` icons
are explicit ids you supply.)

**v5 controlled vocabularies (canonical — do not improvise). All are authored by
the workflow, never keyword-inferred from prose.**

- **`time` (per place — array, 0+ of):** `morning`, `daytime`, `evening`. The
  filterable time-of-day blocks (§7). A place may belong to more than one. Author
  from practical judgment about when the place is actually good — NOT by scanning
  the hook for keywords. Leave the array empty if you genuinely cannot say; an
  empty `time` means the place will not match a selected time filter (correct — a
  place must never silently match a time it was not assigned).
- **`purpose` (per place — array, 1+ of):** `explore`, `eat`, `work`, `social`,
  `recovery`. The coarse "what is this for" axis (§10 Purpose filter). If absent,
  `build.mjs` derives a default from `cat` (sights/nature/walks → explore;
  rest/street/cafes → eat; work → work; night → social; nature also → recovery).
  Author `purpose` to override the default when the cat-derived value is wrong.
- **`dur` (per place — single value):** `quick` (under ~1h), `2-3h`, `half-day`,
  `full-day`. Typical visit length (§9/§10 Duration filter). Omit if unknown.
- **`rs` (per place — research status, single value):** `needs`, `researched`,
  `verified`. See § Research status below — this is workflow-assigned by ACTUAL
  research completeness, never a blanket value.
- **resource `type` (per resource):** `food`, `article`, `transport`,
  `neighborhood`, `source`, `reference` (§6).

### Shape

The shape below is the **renderer-visible** object (post-`build.mjs`). In the
authored `dossier-data.json` the workflow writes `neighborhood` + `city` (and any
known `lat`/`lng`); `id` and `map_link` shown here are **build-derived** — do not
hand-author them. See § Field mapping for the derivation rules.

```json
{
  "meta": {
    "slug": "...", "destination": "...", "dates": "...",
    "trip_type": "single-base|multi-stop",
    "admin": { "visa_notes": "", "schengen_note": "", "insurance_reminder": "" }
  },
  "trip": [
    {
      "id": "budapest",
      "name": "Budapest",
      "when": "2 nights · Jun 16–18",
      "nights": 2,
      "heat": false,
      "heatLabel": "~27°C · comfortable",
      "climate": "~27°C, comfortable",
      "budget": "~€50 / day",
      "start": "{the ⭐ anchor — one line: do this one thing here}",
      "inLeg": "Arrive ~23:00, Jun 16",
      "outLeg": "Bus to Belgrade, Jun 18 (7–8h)",
      "connectivity": { "eu_roaming": true, "esim_note": "", "esim_cost_eur": null },
      "offline_map_area": "", "borders": "", "sunrise": "", "sunset": "",
      "doLabel": "Do & cool off",
      "do": [
        {
          "id": "budapest-lumen-cafe",
          "nm": "Lumen Café",
          "t": 2,
          "tags": ["work", "social", "eat"],
          "hook": "{one-line why-this / why-you hook}",
          "facts": [["i-clock", "best midday"], ["i-wallet", "~€2 coffee"]],
          "hours": "", "cost": "", "duration": "", "best_time": "", "find_it": "",
          "neighborhood": "Józsefváros", "city": "Budapest",
          "lat": null, "lng": null,
          "map_link": "https://www.google.com/maps/search/?api=1&query=Lumen%20Caf%C3%A9%20J%C3%B3zsefv%C3%A1ros%20Budapest",
          "image_query": "Lumen Café Budapest courtyard", "image_url": "",
          "hike": null
        }
      ],
      "doNote": "",
      "stayPick": "{accommodation recommendation, one paragraph}",
      "hoods": [
        { "nm": "Józsefváros (VIII)", "base": 1, "d": "{one-line vibe + work-fit}" }
      ],
      "eat": [ "{same place-object shape as `do`}" ],
      "avoid": [
        { "nm": "Szimpla Kert", "neighborhood": "Jewish Quarter (District VII)", "city": "Budapest", "where": "District VII", "hook": "{why it's a trap}" }
      ],
      "mobility": { "verdict": "", "cost": "", "note": "" },
      "timing": { "verdict": "", "note": "" }
    }
  ],
  "legs": [
    { "ic": "i-bus", "ttl": "Budapest → Belgrade", "spec": "direct bus · ~7–8h · ~€15–25", "ds": "Several daily; book ahead in summer.", "warn": "", "hard": 0 }
  ]
}
```

### Field mapping (where each gathered thing lands)

- **Anchor → `start`.** The per-stop ⭐ anchor (Step 11) is the stop's `start`
  string. If a stop has no surviving do/eat places, `start` is `""` (per the
  anchor carve-out).
- **Tiers.** Section 3/4 cards become `do` / `eat` entries; the markdown tier
  icon maps to integer `t` (🔥→3, 👍→2, 🆗→1). Sort each array by `t` desc, top
  pick first.
- **Per-place fields → `facts` + additive keys.** `best_time`, `cost`,
  `hours`, `find_it`, `duration` are carried as named keys AND composed into the
  `facts` chip array (the only thing this HTML renders today) using the fixed
  icon ids. The subagent's `Location` field feeds `neighborhood`/`city` (required —
  see V1 required fields above) and optional `lat`/`lng`; it is not a card line.
- **`map_link` (derived, required).** Built by `build.mjs`, never hand-authored.
  Construction rule:
  - When `lat`/`lng` are known →
    `https://www.google.com/maps/search/?api=1&query={lat}%2C{lng}`.
  - Otherwise (the common case — only free text) →
    `https://www.google.com/maps/search/?api=1&query=` + URL-encoded
    `"{nm} {neighborhood} {city}"`.
  - Never fabricate coordinates to populate it — fall back to the text query.
- **Traps → `avoid`** (omit the `avoid` array entirely for stops ≤ 2 nights).
- **Mobility (5b) → `mobility`** per stop; **inter-stop legs (5b) → `legs`**
  (one object per leg; `hard: 1` flags the punishing leg; booked flights use
  `ic: "i-route"`).
- **Logistics (5d) → per-stop `connectivity` / `offline_map_area` / `borders`
  and `meta.admin`.** **Timing (T1) → `timing` + `sunrise`/`sunset`.**
- **`id` (derived, required).** `{stop-kebab}` for stops and
  `{stop-kebab}-{place-kebab}` for places — stable across re-runs so localStorage
  "tried it / want it" toggles (job E) persist. The **kebab rule**: lowercase,
  strip diacritics (NFD-normalize then drop combining marks), replace each run of
  non-alphanumerics with a single hyphen, trim leading/trailing hyphens. Derived by
  `build.mjs` per place, never hand-authored; the build aborts if any place is
  missing the authored `neighborhood`/`city` it needs.

**Image slot (pending Patrik's image-source approach).** Each place carries
`image_query` (a search string) and an empty `image_url`. The orchestrator does
NOT fabricate image URLs — only the query string. The current HTML ignores both;
this is a placeholder contract, swap it when the real image source is decided.

### v5 additive fields (companion schema)

These fields extend the companion so the renderer can show destination intros,
structured tasks, a critical checklist, resources, food-to-try, base/distance,
research status, time blocks, and richer rows. All are **optional and additive**
— `build.mjs` validates them only when present, defaults the rest, and never
aborts on absence. Author them where you have real knowledge; leave them out
rather than fabricate.

**Trip-level `meta` object (top level, sibling of `trip` and `legs`):**

```json
{
  "meta": {
    "tasks": [
      { "title": "Book the Budapest → Belgrade bus", "due": "A few days ahead",
        "how": "Flixbus/Gea Tours run this direct (~7–8h). Reserve a seat.",
        "link": "https://www.flixbus.com", "stop": "belgrade" }
    ],
    "critical": [
      { "title": "Travel insurance covering all five countries",
        "how": "Confirm it covers the non-EU stops, not just the EU.",
        "due": "Before departure" }
    ]
  }
}
```

- **`meta.tasks` (§2 — practical pre-trip/in-trip actions).** Explicitly authored
  structured tasks (book transport, activate data, confirm an uncertain
  departure, reserve an activity that genuinely needs advance booking). Each:
  `title` (required), optional `due`, `how` (one-line "how to do this best"),
  `link`, and `stop` (a stop id this task associates with; omit for trip-wide).
  `build.mjs` derives `id`. **Do NOT keyword-derive tasks from place prose** —
  the old "every place whose text says book/price/hours becomes a task" behavior
  is removed. Stop-scoped tasks may also live on the stop object as `tasks` (see
  below); both feed the same Tasks view.
- **`meta.critical` (§3 — high-consequence checklist only).** Visa/entry,
  passport/border, travel insurance, mobile data/roaming, essential transport
  reservations, material health/payment/documentation requirements. Each: `title`
  (required), optional `how`, `link`, `due`. `build.mjs` derives `id`. **Keep it
  high-consequence** — do NOT fill it with routine reminders, restaurant
  verification, minor price checks, or ordinary opening-hour checks (those are
  `tasks`, or just per-place `Best time`/notes).

**Stop-level additive fields (on each `trip[]` object):**

```json
{
  "intro": "What the place is like, why it's on the route, what it's good for, and how to approach it. Short.",
  "temp": "~27°C",
  "base": { "label": "Palace Quarter (District VIII)", "kind": "area", "lat": 47.4895, "lng": 19.068 },
  "tasks": [ { "title": "Buy a 72-hour transit card", "due": "On arrival", "how": "..." } ],
  "resources": [ { "title": "Seat61 — trains & buses", "type": "transport", "link": "https://www.seat61.com", "why": "Clear overland-route reference." } ],
  "foodToTry": [ { "name": "Lángos", "what": "Deep-fried dough with sour cream, garlic, cheese.", "how": "From a market stall as a cheap snack." } ]
}
```

- **`intro` (§1).** A concise destination introduction: what it's like, why it's
  included, what it's especially good for, and the recommended way to approach it.
  Keep it short and useful. No photography in this version.
- **`temp` (§1).** The temperature or range as a PLAIN string (`"~27°C"`,
  `"30°C+"`, `"27–31°C"`) — no commentary words like "comfortable" or
  "heat-flagged". Omit if no real forecast is known (the renderer then shows no
  temp pill). The `heat` boolean stays (it drives the Heat-safe filter and
  heat-relief tagging); heat advice still lives in `timing`/notes/`bestTime`
  where it is operationally useful.
- **`base` (§4 — optional authored default).** `label` (required), `kind`
  (`address` or `area`), optional `lat`/`lng` (both or neither). A user-entered
  base (localStorage) overrides this at runtime. With coordinates the renderer
  shows estimated "from your base" travel measures (treated as estimates, never
  precise routes); without coordinates it offers a Google Maps directions action
  instead of false precision. Omit `base` entirely to exercise the "no base set —
  add it later" prompt.
- **`tasks` (§2).** Stop-scoped tasks, same shape as `meta.tasks` (no `stop`
  field needed — the stop is implied).
- **`resources` (§6).** Per-destination deeper-reading material — food guides,
  good articles, transport/neighborhood guides, research sources, saved
  references. Each: `title`, `type` (controlled vocab above), `link`, `why`
  (one-line usefulness). Keep resources on the relevant destination, not in one
  trip-wide appendix. Author only links you are confident exist; never fabricate
  a URL.
- **`foodToTry` (§8 — dishes, NOT venues).** Local dishes, drinks, ingredients,
  specialties. Each: `name`, `what` (what it is), optional `how` (how/where
  locals typically eat it). This is the "food to try" half of the food split;
  the venue list stays in `eat` ("places to eat").

**Per-place additive fields (on `do`/`eat` objects):** `time`, `purpose`, `dur`,
`bestTime` (free-text time nuance — sunrise, avoiding midday heat, market days),
`rs`, `rsNote` (what remains to research, for `needs` items — feeds the "Research
in Claude Code" prompt), `tips` (array of practical "how to enjoy this" advice
that materially improves the visit — not generic filler), and `pt` (price tier,
now allowed on activities too, e.g. an entry fee). `build.mjs` derives `bf`
(budget-friendly) from `pt`/free signals.

### Research status (`rs`) — workflow-assigned, by actual completeness

This is **not** primarily a manual user status. The dossier-generation workflow
assigns it from real research completeness, and it must **never** blanket-mark
every generated place as `researched` or `verified`.

- **`needs`** — important facts or suitability checks are still missing. Always
  pair with `rsNote` describing what remains (the renderer turns this into a
  focused "Research in Claude Code" prompt).
- **`researched`** — sufficient research exists to justify inclusion.
- **`verified`** — important time-sensitive facts have been checked for THIS
  trip's dates. `build.mjs` NEVER auto-assigns `verified`; only an explicit
  author/verification pass sets it.

If `rs` is absent, `build.mjs` defaults it by completeness: a place with both a
hook AND at least one fact → `researched`; anything thinner → `needs`. Override
to `needs` (with an `rsNote`) for any place whose facts are time-sensitive and
unverified for the trip (timetables, seasonal sessions, renovation status).
`build.mjs` writes every `needs` place to `research-todo.md`.

### Route fields are optional (§11 — unresolved product decision)

`when`, `nights`, `inLeg`, `outLeg`, and the `legs` array are **optional**. The
renderer must tolerate their absence (a stop with no `when`/`inLeg`/`outLeg`
simply omits those lines). Do not introduce logic that assumes dates or a fixed
stop order are permanent. Whether the dossier becomes fully destination-based or
keeps a provisional route is an open decision recorded in
`trips/{slug}/CHANGES.md` (or the route-decision note) — preserve existing route
information, keep it visually subordinate on destination pages, and do not decide
it on the user's behalf.

## Required sections (in order)

### 0. Destination introduction (§1)

At the top of each stop's block (multi-stop) or the dossier body (single-base),
a short `intro`: what the place is like, why it's included, what it's good for,
and the recommended way to approach it. Renders above the ⭐ anchor. The plain
`temp` indicator sits in the header — temperature or range only, no commentary.

### 1. Cool neighborhoods

3–5 neighborhoods. Each is a short paragraph plus a one-line verdict:

```
**{Neighborhood name}** — {one-line vibe in 12–18 words}
Work-fit: {WiFi reliability / daytime cafe density / quiet-vs-buzz verdict}
```

### 2. Accommodation area recommendation

**Single-base trips:** Single primary recommendation. Add a second only if there is a real tradeoff worth surfacing.

```
**Primary: {Neighborhood/area}** — {one-line why, grounded in Section 1 + routine maintenance proximity}
Why this beats {alternative}: {short rationale or "no real alternative — this is the clear pick"}
```

If a real tradeoff exists, add an `**Alternative: ...**` block with one-line tradeoff statement.

**Multi-stop trips:** One-line recommendation per approved stop. Format:

```
**{Stop name}** — {area within stop} — {one-line rationale (proximity to work cafes, routine, local feel)}
**{Stop name}** — {area within stop} — {one-line rationale}
```

Do not write "Primary:" / "Alternative:" for multi-stop — each stop has its own recommendation.

### 3. Hidden-gem activity shortlist

5–8 items. Each item is a per-place card (see § Priority tiers, per-place card,
and the "one thing" anchor). Cards are sorted by tier (🔥 → 👍 → 🆗), top pick
floated within each tier. The stop's ⭐ anchor sits above this section (or above
the whole dossier for single-base).

```
🔥 **{Activity name}** — {Neighborhood}, {City}
{One-line hook.}
- Best time: {…}
- Cost: {…}
- Duration: {…}
- Hours: {…}
- Find it: {…}
```

Anti-tourist filter applied: popular or iconic items are fine when the experience
genuinely holds up; only the overcrowded obligatory-icon traps (the Eiffel-Tower
tier — go-only-for-the-photo, overpriced, crowd-degraded) are filtered or flagged.
"Famous" or "top-5 TripAdvisor" alone is not grounds to drop an item. For
hikes/mountain days, append the `Hike data:` line.

### 4. Food (two distinct parts — §8)

Food is split into two concepts that must not be mixed:

**4a. Food to try** (`foodToTry`) — local *dishes*, drinks, ingredients, and
specialties (not venues). Each: name — what it is — and, where useful, how or
where locals typically eat it. Short list per destination.

```
- **{Dish}** — {what it is}. {How/where locals eat it.}
```

**4b. Places to eat** (`eat`) — the *venue* list: restaurants, cafés, market
stalls, bakeries. 6–10 items, same per-place card format as Section 3, sorted by
tier within each subhead. Group with two short subheads:
`**Daytime / work-friendly:**` and `**Dinner / memorable:**`. Keep price,
location, suitability, and map access.

```
👍 **{Place name}** — {Neighborhood}, {City}
{One-line hook.}
- Best time: {…}
- Cost: {…}
- Duration: {…}
- Hours: {…}
- Find it: {…}
```

### 5. Tourist-trap warning list

4–6 named places to actively avoid. Each line:

```
- **{Place name}** — {one-line reason — what makes it a trap and what signal exposed it}
```

Example reason: "ranked #2 on TripAdvisor but Reddit + local food blogs flag as overpriced and slow."

**Short-stop skip rule.** Skip this section for any stop where Patrik stays
2 nights or fewer — trap-avoidance research is not worth it for a quick stop.
For multi-stop trips, render the trap list only for stops with 3+ nights; for
each skipped stop, do not emit an empty heading. For single-base trips (always
1+ week per the hard constraints) the section always runs.

### 6. Mobility recommendation

**Single-base trips:** One-line verdict + cost estimate:

```
Verdict: {bike / scooter / transit pass / mix} for {trip duration}.
Estimated cost: €{N}/day.
Notes: {one-line on terrain, distances, weather fit for the verdict}.
```

**Multi-stop trips:** Two sub-blocks:

```
**Inter-stop transport:**
{Leg 1 (e.g., Saranda → Berat)}: {bus / furgon / shared taxi} — {duration} — €{cost} — {reliability note}
{Leg 2}: {mode} — {duration} — €{cost} — {reliability note}

**Local mobility per stop:**
{Stop name}: {walking / scooter rental / transit} — {estimated €/day if renting}
{Stop name}: {mode} — {estimated €/day if renting}
```

### 7. Optimal-timing assessment

Are these dates good? Short paragraph (3–5 lines):

```
Dates {dates_start} to {dates_end}: {VERDICT — Good / Acceptable / Suboptimal}.
Weather check: {forecast summary, pass/flag}.
Festivals / holidays / closures: {ACTUAL events checked for THIS exact window —
  name + dates + impact, or "none found for these exact dates"}.
Daylight: sunrise ~{HH:MM}, sunset ~{HH:MM} (for sunrise climbs / sunset viewpoints).
One-line verdict: {short final call}.
```

Do not use a generic "re-check closer to the date" line as a substitute for an
actual check. If the festival/holiday check could not be performed, say so
explicitly ("not checked — verify before booking"), do not imply it was clear.

### 8. Practical logistics

Connectivity, offline-map prep, and entry/admin for the trip. Single-base: one
block. Multi-stop: group by stop/country where it varies.

```
**Connectivity:** {Is your home plan covered (EU vs non-EU)? If not, the cheapest
  eSIM option and rough cost. Call out exactly which stops lose your home plan.}
**Offline maps:** {which area to download in which app before losing signal, per stop}.
**Entry & admin:** {visa/entry rules for non-EU stops; Schengen day-count note;
  travel-insurance reminder}.
**Border crossings:** {any crossing-specific warnings — e.g., do not re-enter
  Serbia from Kosovo on this route}.
```

This section is route-critical when the trip crosses in and out of EU coverage
or non-Schengen borders. Where a field does not apply, omit that line rather
than writing "n/a".

---

### 9. Critical pre-trip checklist (§3 — `meta.critical`)

High-consequence matters only — visa/entry, passport/border, travel insurance,
mobile data/roaming, essential transport reservations, material
health/payment/documentation requirements. NOT routine reminders, restaurant
verification, minor price checks, or ordinary opening-hour checks.

```
- **{Title}** — {one-line how-to-do-it-best}. {When, if relevant.}
```

In the HTML companion each item renders with a completion state and an "Add to
Todoist" action.

---

### 10. Tasks & reminders (§2 — `meta.tasks` + per-stop `tasks`)

Practical actions: book transport, buy/activate mobile data, confirm an uncertain
departure, reserve an activity when advance booking is genuinely required. Each
carries a clear action title, destination/trip association, when to complete
(where relevant), a short "how to do this best" note, and any booking/info link.

```
- **{Title}** ({stop or "Trip"}) — {how-to note}. {Due, if relevant.}
```

Explicitly authored — never keyword-derived from place prose. In the HTML
companion each task has a local completion state (still visible after being added
to Todoist) and an "Add to Todoist" action.

---

### 11. Destination resources (§6 — per-stop `resources`)

Per-destination deeper-reading material — local food guides, high-quality
articles, transport guides, neighborhood guides, research sources, useful saved
references. Keep them on the relevant destination, not in one trip-wide appendix.

```
- **{Title}** ({type}) — {one-line why it's useful}. {link}
```

## Optional appendix

If links are useful, place them in ONE appendix at the very end:

```
## Sources & Links

- {Source / link with one-line context}
- {...}
```

No inline links inside section bodies.

## Mobile formatting rules (load-bearing)

1. **Max line length approximately 80 characters.** Wrap manually if needed.
2. **No tables.** No `|---|` syntax anywhere in the output.
3. **Section headers always `## `.** Subheads inside sections use `**bold**` paragraph leads,
   not deeper heading levels (no `### ` or `#### `).
4. **Every section ends with `---` on its own line** before the next section header.
   This makes the boundary visible when scrolling on iPhone.
5. **Place identity always carries `Name — Neighborhood, City`.** This is
   Google-Maps-searchable as-is. In Sections 1–2 this is the whole line; in
   Sections 3–4 it is the card's header line. For multi-stop trips, include the
   stop name when needed to disambiguate: `Name — Neighborhood, Berat`. The
   card's labelled fields (`- Best time:`, `- Cost:`, etc.) are short bulleted
   lines, not tables — they stay within the line-length rule.
6. **No abbreviations Patrik would have to decode mid-trip.** Spell out
   "neighborhood," "approximately," etc.
7. **No external markdown links in section bodies.** Sources go in the appendix only.

## Missing-section rendering

If a section's paste-back was missing or unparseable, render as:

```
## {N}. {Section name}

_Section incomplete — re-run prompt {N} from the handoff prompts and re-paste._

---
```

Never fabricate content for a missing section.

## Versioning

Filename is `destination-dossier.md` for the first run. Re-runs write
`destination-dossier-v2.md`, `destination-dossier-v3.md`, etc. The original is
never overwritten.

## Example skeleton (rendered, ready for Patrik to scan)

```
# Lisbon — 2026-06-15 to 2026-06-29 — anti-tourist remote-work

Work-load: 25h/week
Budget posture: ~€50/day baseline; willing to splurge €100–150
Weather check: 26°C max — PASS

---

## 1. Cool neighborhoods

**{Neighborhood A}** — {vibe sentence}
Work-fit: {one-line}

**{Neighborhood B}** — {vibe sentence}
Work-fit: {one-line}

---

## 2. Accommodation area recommendation

**Primary: {Area}** — {one-line why}

---

⭐ If you do one thing here: {anchor place} — {one-line why}.

## 3. Hidden-gem activity shortlist

🔥 **{Place}** — {Neighborhood}, Lisbon
{One-line hook.}
- Best time: {…}
- Cost: {…}
- Duration: {…}
- Hours: {…}
- Find it: {…}

👍 **{Place}** — {Neighborhood}, Lisbon
{One-line hook.}
- Best time: {…}
- Cost: {…}
- Duration: {…}
- Hours: {…}
- Find it: {…}

---

(... sections 4–7 follow the same pattern; Section 5 is skipped for stops of
2 nights or fewer; Section 8 is Practical logistics ...)

## Sources & Links

- {Source} — {one-line context}
```

The orchestrator also writes the structured twin `trips/{slug}/dossier-data.json`
alongside this markdown (see § Structured data companion).
