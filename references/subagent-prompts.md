# Subagent Handoff Prompts — Destination Dossier

Library of prompt templates organized by research pass. The `dossier-orchestrator` agent reads this file at each pass, substitutes placeholders, and presents the prompts to Patrik for manual execution in the target tool.

**Mode 1 only at Phase 1.** Patrik runs each prompt in the named target tool (ChatGPT Pro or Perplexity Pro), pastes the result back, and the orchestrator ingests.

## Placeholders (substituted by the orchestrator)

- `{destination}` — city / country.
- `{dates}` — `YYYY-MM-DD to YYYY-MM-DD`.
- `{theme}` — trip theme (e.g., "anti-tourist remote-work").
- `{work_load}` — hours/week of remote work during trip.
- `{budget_floor}` — daily baseline in euros.
- `{budget_splurge_lo}`, `{budget_splurge_hi}` — splurge range in euros.
- `{trip_duration_nights}` — total nights.
- `{profile_extract}` — 3–5 bullet preferences from the universal traveler profile, most relevant to this trip.
- `{principles_extract}` — bulleted principles that apply to this trip's sections.
- `{approved_locations}` — comma-separated list of approved locations from Pass 2 (used in Passes 3, 4, 5a).

## Anti-tourist guardrail (boilerplate, embedded in every list prompt)

Every list prompt below ends with this guardrail block. Substitute `{section_name}` per prompt.

```
Hard filters on your recommendations:
- Exclude any place that is a top-5 TripAdvisor result for {destination} unless
  you can name a specific counter-signal (e.g., locals still go, or a niche reason
  it survived its popularity).
- Exclude any place whose primary visitor base is tour groups, cruise-ship
  day-trippers, or guided-tour buses.
- Prefer places named in: Reddit local subs, local food/culture blogs, residents'
  recommendations, small independent guides, and native-language sources
  (translated if needed). For destinations with thin English-language coverage,
  explicitly search in the local language (e.g., Albanian, Georgian, Kyrgyz) and
  translate findings.
- Avoid: Lonely Planet top-10s, Time Out lists, "best of {destination}" listicles,
  TripAdvisor top results without a counter-signal.
- For every place you include, name the specific signal that made you keep it.
- If you cannot find {N} items with real evidence, return fewer and say so.
  Do not pad the list.

Output the {section_name} as a numbered list. For each item:
  name — neighborhood/area, {destination} — one-line why (grounded in the profile
  preferences above) — specific signal (e.g., "Reddit r/albania, locals praised
  the atmosphere").
```

## Per-place data fields (boilerplate, embedded in Pass 3 and Pass 4 prompts)

Prompts 3 and 4 ask for these structured fields per item, on top of the one-line
why and signal, so the dossier can render the per-place card and the HTML
companion can render a fact line. Substitute this block where a prompt references
`{per_place_fields}`:

```
For EACH item, also give me these fields on labelled lines (write
"unknown" for any you genuinely cannot establish — do not guess):
- Best time: best time of day / day of week to go (note any heat-smart window)
- Cost: a real price anchor in LOCAL currency (coffee / a meal / a beer / entry)
- Duration: how long to budget for a visit
- Hours: opening hours and days closed
- Find it: nearest landmark or street; for hidden spots, how to actually find it
- Location: street address or rough coordinates if you have them, for a map pin

Do not fabricate hours, prices, or coordinates. "unknown" is an acceptable and
useful answer; a made-up number is not.
```

---

## Pass 1 — Destination Viability

Pass 1 is handled by the `/destination-check` command and its own prompt template. See `projects/personal/.claude/commands/destination-check.md`. No prompt in this library for Pass 1.

---

## Trip Init — Timing

### Prompt T1 — Timing assessment (one-time at /trip-init)

**Target tool:** Perplexity Pro (current events, real-time signals).

**When to run:** At `/trip-init` time — once per trip, before `/destination-dossier`. Results are stored in `trip-context.md` frontmatter fields `forecast_max_celsius`, `timing_verdict`, `timing_notes`, and `stop_weather`. `/destination-dossier` reads these fields; it does not re-run this prompt.

**Expected output shape:** Weather summary + crowding signals + event signal + one-line verdict. For multi-stop trips: also per-region max temperatures.

(This prompt deliberately does not include the anti-tourist guardrail — it is about timing, not place curation.)

**Prompt body:**

```
I am planning a solo trip to {destination} from {dates}.

Task: Assess whether {dates} is a good window for {destination}. Cover:

1. Weather: expected high/low temperatures and rainfall for the date window.
   Flag if forecast max exceeds 30°C. State the expected max temperature in °C.

2. Crowding signal: will {destination} be unusually crowded during these
   dates? Check specifically:
   - Cruise-ship arrivals in the destination or nearby ports
   - School holidays in major feeder markets (Germany, Italy, UK, US)
   - Orthodox Easter or other religious-tourism peaks if applicable
   - Any major festivals, national holidays, or events that draw large
     crowds to this destination
   Name the signal and the expected impact (e.g., "Italian school holidays
   July 8–Aug 31 — coastal areas 30–40% more crowded").

3. Local event signal: actually check for specific festivals, public holidays,
   strikes, or market-closure days in {destination} during the EXACT window
   {dates} that would meaningfully change the experience (positive or negative).
   Name the event, its dates, and its impact (e.g., "markets shut on the public
   holiday June 24"). If you find nothing for these exact dates, say so plainly
   — do not give a vague "check closer to the date" non-answer.

4. Daylight: give approximate sunrise and sunset times for {destination} during
   {dates} (relevant for sunrise climbs and sunset viewpoints).

5. One-line verdict: GOOD / ACCEPTABLE / SUBOPTIMAL for these dates, given
   weather, crowds, and event signal.

Cite sources for weather and current-events claims.
```

**Multi-stop extension (add when `trip_type` is `multi-stop`):**

```
6. Per-region weather: for a multi-stop trip through {destination}, give the
   expected max temperature by region (e.g., coastal south, central highlands,
   northern mountains). Flag any region exceeding 30°C. Format:
     {Region name}: {N}°C max
```

**Paste-back parsing (for /trip-init Step 3.5):**

After the operator pastes back the Perplexity output, extract:
- `forecast_max_celsius` — overall expected max temperature as an integer, or `unknown`
- `timing_verdict` — the GOOD / ACCEPTABLE / SUBOPTIMAL verdict
- `timing_notes` — 2–3 line summary of crowding signals, the actual festival/
  holiday/closure findings for the exact window, and approximate sunrise/sunset times
- `stop_weather` — for multi-stop trips: list of `{location: "Region name", forecast_max_celsius: N}` from the per-region section; empty list for single-base trips

---

## Pass 2 — Locations

### Prompt 2a — Neighborhoods long list (single-base trips)

**Target tool:** ChatGPT Pro (prior-knowledge-rich, good at neighborhood characterization).

**Expected output shape:** Numbered list of 10–15 neighborhoods. Each: name — one-line vibe (12–18 words) — work-fit verdict (WiFi / daytime cafe density / quiet-vs-buzz).

**Prompt body:**

```
I'm planning a solo trip to {destination} from {dates}, theme "{theme}".
I will be working remotely about {work_load} hours/week. Budget ~€{budget_floor}/day
baseline, willing to splurge €{budget_splurge_lo}–{budget_splurge_hi}.

My traveler profile (read carefully — drives your recommendations):

{profile_extract}

My travel principles (non-negotiable filters):

{principles_extract}

Task: Give me 10–15 neighborhoods in {destination} I should consider as my
base or main hangout zones. For each:
- Name
- One-line vibe (12–18 words: what it feels like, what crowd it attracts)
- Work-fit verdict: WiFi reliability for remote work, daytime cafe density
  (can I find a cafe with reliable WiFi to work 3–4 hours?), quiet-vs-buzz

I will narrow this list to a short list after seeing all options.

{anti_tourist_guardrail with section_name = "neighborhoods list"}
```

---

### Prompt 2b — Candidate places long list (multi-stop trips)

**Target tool:** ChatGPT Pro.

**Expected output shape:** Numbered list of 10–15 INDIVIDUAL candidate places
(cities / towns / regions) — NOT pre-built routes. Each: name — one-line vibe —
who goes there — work-fit verdict — a suggested rough nights range — rough
location/region (so they can be sequenced later).

**Why this shape:** Patrik chooses which places to visit himself, in discussion,
and then decides the order and nights. The subagent must NOT commit him to a
single itinerary — it surfaces options to choose from, it does not decide the
trip.

**Prompt body:**

```
I'm planning a solo multi-stop trip to {destination} from {dates}
({trip_duration_nights} nights total), theme "{theme}". I will be working
remotely about {work_load} hours/week. Budget ~€{budget_floor}/day baseline.

My traveler profile (drives your recommendations):

{profile_extract}

My travel principles (non-negotiable filters):

{principles_extract}

Task: Give me a long list of 10–15 INDIVIDUAL candidate places (cities, towns,
or regions) worth considering as stops on a {trip_duration_nights}-night trip
through {destination}. I want to see both the coast and the mountains if the
destination allows it.

Do NOT build me a finished route or itinerary. Do NOT order them into a single
trip. I will choose which places to visit myself and decide the order and nights
afterwards. Just give me the menu of options to choose from. For each place:
- Name
- One-line vibe (what the place is like, who goes there)
- Work-fit verdict: are there work-friendly cafes and reliable WiFi?
- Suggested rough nights range if I were to include it (e.g., "2–3 nights")
- Rough location / region, and which other candidates it is near (so I can
  sequence them sensibly later)

Places that are mass-tourism hubs without a counter-signal will be deprioritized.

{anti_tourist_guardrail with section_name = "candidate places list"}
```

---

## Pass 3 — Activities

### Prompt 3 — Hidden-gem activity long list

**Target tool:** Perplexity Pro (source-grounded, current, good for niche signal retrieval).

**Expected output shape:** Numbered list of 15–20 activities. Each: name —
location, {destination} — one-line why — surfacing signal — then the labelled
per-place fields (best time, cost, duration, hours, find it, location), plus the
hike-data line for any hike/mountain day.

**Prompt body:**

```
I'm planning a solo trip to {destination} from {dates}, theme "{theme}". I work
{work_load}h/week remotely, so activities run mostly evenings, weekends, and
2–3 hour midday windows.

I will be spending time in these specific areas:
{approved_locations}

Profile (drives selection):
{profile_extract}

Principles:
{principles_extract}

Task: Give me 15–20 hidden-gem activities in {destination}, scoped to the
areas listed above. By "hidden gem" I mean: not the top tourist experiences,
but specific places or experiences locals or repeat visitors recommend. Include:
- A few that fit a 2–3 hour midday window (around my work schedule)
- A few that fit evening or weekend slots
- At least one meaningfully tied to {theme}
- Activities spread across the approved areas (not all in one spot)

For each item, include the specific source signal that surfaced it (Reddit
thread, local blog, resident interview, niche guide — name it). Cite sources
where you can.

{per_place_fields}

For any item that is a hike or mountain day, ALSO give me a hike-safety line:
- Hike data: distance, elevation gain, whether there is water on the route,
  whether there is mobile signal, and the last return-transport time (bus /
  minibus / shared taxi). Treat the last-return time as a hard safety field —
  if you cannot find it, say so explicitly.

If you cannot find 15–20 items with real evidence for these specific areas,
return fewer and say so.

{anti_tourist_guardrail with section_name = "hidden-gem activity list"}
```

---

## Pass 4 — Food

### Prompt 4 — Food and restaurant long list

**Target tool:** Perplexity Pro.

**Expected output shape:** Numbered list of 15–20 places, tagged as daytime/work-friendly or dinner/memorable. Each: name — location, {destination} — type — one-line why — surfacing signal — then the labelled per-place fields (best time, cost, duration, hours, find it, location).

**Prompt body:**

```
Solo trip to {destination}, {dates}. Working {work_load}h/week remotely.
Baseline ~€{budget_floor}/day; willing to splurge €{budget_splurge_lo}–
{budget_splurge_hi} on a standout dinner.

I will be spending time in:
{approved_locations}

Profile:
{profile_extract}

Principles:
{principles_extract}

Task: Give me 15–20 food and restaurant recommendations in {destination},
scoped to the areas above, mixing:
- Daytime / work-friendly: cafes I can work from for 2–3 hours (good WiFi,
  ok with a laptop), good coffee, reasonable lunch.
- Dinner / memorable: places worth a real dinner — local specialty,
  neighborhood favorite, or a justified splurge in the
  €{budget_splurge_lo}–{budget_splurge_hi} range.

Tag each as "daytime" or "dinner". For each: name, neighborhood, one-line
why (tied to profile), and the source signal that surfaced it (Reddit, local
food blog, resident rec — name it).

{per_place_fields}

If you cannot find 15–20 items with real evidence for these areas,
return fewer and say so.

{anti_tourist_guardrail with section_name = "food/restaurant list"}
```

---

## Pass 5 — Practicalities

### Prompt 5a — Tourist-trap warning long list

**Target tool:** Perplexity Pro (real-time signal aggregation, current reviews).

**Expected output shape:** Numbered list of 10–15 named places to actively avoid. Each: name — one-line reason (specific signal exposing it as a trap).

**Prompt body:**

```
Solo trip to {destination}, {dates}. I want an early-warning system —
places I should ACTIVELY avoid despite being highly visible in conventional
travel guides.

I will be in:
{approved_locations}

Profile:
{profile_extract}

Principles:
{principles_extract}

Task: Give me 10–15 named places (restaurants, attractions, neighborhoods,
tours) in {destination} I should NOT visit, and for each, name the specific
signal that exposes it as a trap. Examples of valid signals:
- "Ranked #2 on TripAdvisor but Reddit r/{destination} and local food blogs
  consistently flag as overpriced and slow."
- "Marketed as a 'traditional X experience' but is a recent tourist-circuit
  operation; locals don't go."
- "Charges a premium for a view available free 200m away."

Be specific — list named places with named signals, not generic warnings
like "the main square." Scoped to the approved areas above.

If you cannot find 10–15 real trap signals for these areas,
return fewer and say so.

{anti_tourist_guardrail with section_name = "tourist-trap warning list"}
```

---

### Prompt 5b — Mobility verdict

**Target tool:** ChatGPT Pro.

**Expected output shape:**

- **Single-base:** One-line verdict (mode + estimated €/day cost) + 1–2 line note on terrain / weather fit.
- **Multi-stop:** Two-block verdict: (1) inter-stop transport per leg, (2) local mobility per stop.

**Prompt body (single-base):**

```
Solo trip to {destination}, {dates}, {trip_duration_nights} nights.
I move between accommodation, work cafes, evening activities, weekend
explorations.

Profile:
{profile_extract}

Task: Recommend ONE mobility approach. Options: rented bike, rented scooter,
public transit pass, mix (specify), walking-only (specify), or bus/metro.
Give me:
- Estimated cost per day in euros for your recommendation
- A 1–2 line note on why it fits {destination} (terrain, weather in {dates},
  distances, whether locals predominantly use this mode)

Make a single primary recommendation and name the strongest counter-argument.
Do not say "depends" — commit to a recommendation.
```

**Prompt body (multi-stop):**

```
Solo multi-stop trip to {destination}, {dates}, {trip_duration_nights} nights.
Approved route:
{approved_locations}

Profile:
{profile_extract}

Task: Recommend mobility in two parts:

1. INTER-STOP TRANSPORT: How to travel between each stop on the route above.
   For each leg (e.g., Saranda → Berat), name the best option: bus, furgon
   (informal minibus), shared taxi, rented car, train. Include:
   - Estimated travel time and cost per leg
   - Reliability note (e.g., "buses run twice daily", "furgons leave when
     full — allow 1–2 hours flex")

2. LOCAL MOBILITY per stop: How to get around within each stop.
   For each stop, one line: walking / scooter rental / transit / other.
   Include estimated daily cost if renting.

Be specific per leg and per stop. Do not generalize.
```

---

### Prompt 5c — Timing verdict

**Moved to `/trip-init`.** Timing is a one-time assessment that does not change between dossier runs. See § Trip Init — Timing (Prompt T1) above. Results are stored in `trip-context.md` frontmatter and read by `/destination-dossier`; they are not re-run as part of Pass 5.

---

### Prompt 5d — Practical logistics (connectivity, offline maps, entry/admin)

**Target tool:** Perplexity Pro (current, source-cited — roaming/eSIM and entry
rules change and must be verified).

**Expected output shape:** Short labelled blocks — connectivity (per country),
offline-map prep (per stop), entry & admin (visa / Schengen / insurance), and
border-crossing warnings. Cite sources for entry rules and roaming claims.

(This prompt omits the anti-tourist guardrail — it is logistics, not place
curation.)

**Prompt body:**

```
Solo trip: {destination}, {dates}. Route / areas:
{approved_locations}

I carry an EU mobile plan and travel light with one phone, often between cities
with patchy signal and on an ultra-budget. Give me the practical logistics I can
act on without a second device or a data connection:

1. CONNECTIVITY (per country on this route): is a standard EU roaming plan
   covered, or is this a non-EU country where my plan may silently stop working?
   For any non-EU country, name the cheapest reliable eSIM option and its rough
   cost. Be explicit about exactly which stops lose EU coverage.

2. OFFLINE MAPS (per stop): which map area should I download (and in which app)
   before I lose signal, so navigation works offline.

3. ENTRY & ADMIN: current visa / entry rules for any non-EU stop on this route,
   the Schengen day-count situation if relevant, and a one-line travel-insurance
   reminder. State the rules as of now and cite a source.

4. BORDER CROSSINGS: any crossing-specific warnings on this exact route (e.g.,
   entry-stamp issues, recognition disputes, crossings to avoid).

Keep it tight and factual. Cite sources for entry rules and roaming coverage.
```

---

## Routing summary

| Prompt | When | Section | Target |
|---|---|---|---|
| T1 | /trip-init (one-time) | Timing / weather ceiling | Perplexity Pro |
| 2a (or 2b) | Pass 2 | Cool neighborhoods / Candidate places | ChatGPT Pro |
| 3 | Pass 3 | Hidden-gem activities (+ per-place fields, hike data) | Perplexity Pro |
| 4 | Pass 4 | Food / restaurants (+ per-place fields) | Perplexity Pro |
| 5a | Pass 5 | Tourist-trap warnings (skipped for ≤2-night stops) | Perplexity Pro |
| 5b | Pass 5 | Mobility | ChatGPT Pro |
| 5d | Pass 5 | Practical logistics (connectivity / maps / entry) | Perplexity Pro |

Routing rationale: ChatGPT Pro for ideation / synthesis / prior-knowledge-heavy sections; Perplexity Pro for current-source-cited sections (food trends, current event signals, real-time trap signals from Reddit and local blogs, timing/weather, and logistics/entry-rule verification). Pass 1 viability also uses Perplexity Pro (see `/destination-check`).

## Tuning notes

After first real trip, expect to tune:

- The anti-tourist guardrail (strictness, source language preferences for specific regions).
- Long-list sizes (10–15 / 15–20 — adjust per destination coverage density).
- Section-to-tool routing (e.g., maybe Pass 2 also benefits from Perplexity for current-cafe-WiFi signals).
- Prompt length (these are long; trim if a prompt consistently produces noise).
- Output-shape specs (if paste-back is consistently malformed for a section, the prompt's output spec needs tightening).
- Mobility prompt 5b: add more intercity transport modes if Balkans/Central Asia trips continue (marshrutka, shared taxi, night bus).
