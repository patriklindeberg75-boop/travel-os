# Destination Dossier — Output Template

This document specifies the structure of the destination dossier output. The `dossier-orchestrator` agent reads this at the format step. Tune section list and place-line format here — not in the agent.

Per Decision 7 (operator-confirmed in `pipeline/decisions.md`), the dossier output contains NO grounding evidence block. Grounding data is logged to `logs/dossier-runs.md`. The output stays clean.

## Trip header block (appears once at top)

```
# {Destination} — {Dates} — {Theme}

Work-load: {hours}h/week
Budget posture: ~€{floor}/day baseline; willing to splurge €{splurge_lo}–{splurge_hi}
Weather check: {forecast_max_celsius}°C max — {PASS | FLAGGED >30°C}
```

If `forecast_max_celsius` is unknown, render the weather line as `Weather check: forecast unknown — verify before booking`.

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
JSON feeds Patrik's standalone HTML renderer (a local file that may use browser
localStorage for "tried it / want it" toggles, keyed on each record's `id`).

The JSON is a render of the SAME synthesized data — never a fabricated value,
and never a place or claim the markdown dossier does not also contain. The JSON
MAY carry structured fields that have no direct markdown-card line (coordinates,
map link, connectivity, sunrise/sunset, image slots): these come from the
gathered data, not invention, and exist so the renderer can build map pins and
fact lines. Shape:

```json
{
  "trip": {
    "slug": "...", "destination": "...", "dates": "...",
    "trip_type": "single-base|multi-stop",
    "admin": { "visa_notes": "", "schengen_note": "", "insurance_reminder": "" }
  },
  "stops": [
    {
      "stop": "Budapest",
      "nights": 2,
      "anchor": { "place": "...", "why": "..." },
      "connectivity": { "eu_roaming": true, "esim_note": "", "esim_cost_eur": null },
      "offline_map_area": "...",
      "borders": "",
      "sunrise": "", "sunset": "",
      "places": [
        {
          "id": "budapest-lumen-cafe",
          "section": "activities|food",
          "tier": "HIGH|REC|OK",
          "name": "...", "neighborhood": "...", "city": "...",
          "hook": "...",
          "best_time": "...", "cost": "...", "duration": "...",
          "hours": "...", "find_it": "...",
          "lat": null, "lng": null, "map_link": "",
          "image_query": "Lumen Café Budapest courtyard", "image_url": "",
          "hike": null
        }
      ]
    }
  ]
}
```

`id` is `{stop-kebab}-{place-kebab}`, stable across re-runs so localStorage
toggles persist. For single-base trips, `stops` holds one entry whose `stop` is
the destination.

The subagent's per-place `Location` field (street address / rough coordinates
from Prompts 3 and 4) feeds `lat` / `lng` / `map_link` here — it is NOT rendered
as a markdown card line; the card's human-facing locator is `Find it`. If only a
free-text location is known, populate `map_link` with a maps search string and
leave `lat`/`lng` null.

**Image slot (pending Patrik's image-source approach).** Each place carries
`image_query` (a search string the renderer can resolve to a thumbnail) and an
empty `image_url` slot to fill later. The orchestrator does NOT fabricate or
assert specific image URLs — it writes only the query string. This is a
placeholder contract; swap it when the real image source is decided.

## Required sections (in order)

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

Anti-tourist filter applied. No item should be a top-5 TripAdvisor result
without a counter-signal. For hikes/mountain days, append the `Hike data:` line.

### 4. Food / restaurant shortlist

6–10 items, same per-place card format as Section 3, sorted by tier within each
subhead. Group with two short subheads: `**Daytime / work-friendly:**` and
`**Dinner / memorable:**`.

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
