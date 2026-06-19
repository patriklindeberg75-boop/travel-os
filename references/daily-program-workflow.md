# Daily-Program Workflow

Methodology for `/daily-program` — the next-day planner. The command shell in
`.claude/commands/daily-program.md` reads this file and executes the steps inline
in the main session. This file is the contract; the command follows it exactly.

The day plan is a **routed selection from an already-built dossier** — never new
research. It reads `trips/{slug}/dossier-data.json`, drops what's already done,
shows the remaining long list so Patrik picks, then builds one sensibly-routed day
that respects walking limits + rest + routine, runs an independent QC pass, and
emits a Notion-paste-ready mini-dossier (see `daily-program-template.md`).

---

## Inputs

**Auto-resolved (no operator input):**
- `slug` — from `--trip {slug}`, else most recent `trips/{slug}/` by mtime.
- `trip-context.md` frontmatter — `route_stops`, `dates_start`/`dates_end`,
  `work_load_hours_per_week`, `budget_floor_eur_per_day`,
  `budget_splurge_low_eur`/`budget_splurge_high_eur`, `stop_weather`,
  `forecast_max_celsius`, `trip_type`.
- `dossier-data.json` — the place pool. Top level: `meta`, `trip[]` (stops),
  `legs[]`. Each stop in `trip[]` has `name`, `nights`, `when`, `heat`, `base`
  (start area), `do[]`, `eat[]`, `foodToTry[]`, `hoods`, `stayPick`, `mobility`,
  `timing`.
- `day-plans/done.md` — the done/skipped ledger (if present).

**Operator-supplied (the Step 5 pause):** must / maybe / done / skip lists, day
type (full | half | slow | evening | nature), energy (low | medium | high), an
optional **fresh weather read** for tomorrow (overrides the static forecast — see
§ Weather-reactive planning), and any free-text constraints (last day, leaving
14:00, work-focused, craving).

---

## Halt conditions

**Halt A — Personalization Spine Gate.** If either `profile/universal-traveler-profile.md`
or `profile/travel-principles.md` is empty, missing, or only a placeholder header,
HALT and emit:

```
Personalization Spine Gate failed.

Empty or missing:
- {path that failed}
- {second path if also failed}

Phase 0 prerequisite is not met. Populate both profile files before running
/daily-program. See CLAUDE.md § Personalization Spine Gate.
```

Do not generate a generic plan. Do not proceed.

**Halt B — No dossier data.** If `trips/{slug}/dossier-data.json` does not exist,
HALT and emit:

```
No dossier-data.json for {slug}. The day planner needs a built dossier.

Run /destination-dossier --trip {slug} first, or paste a place pool to plan from.
```

**Halt C — City unresolvable.** If the current stop cannot be matched from
`route_stops` + today's date (see § City resolution), ask once which stop to plan
for. Do not guess silently.

If the day type is not given at the Step 5 pause, default to **full day** and say so.

---

## City resolution

1. Read `route_stops` from `trip-context.md`. Each entry has `stop`, `nights`,
   `dates` (`"YYYY-MM-DD to YYYY-MM-DD"`).
2. Find the stop whose date range contains **tomorrow** (today + 1). The plan is for
   the next day.
3. If tomorrow falls on a transit/depart day (`nights: 0` or a `transit_in` leg),
   note it — bias the plan toward loose ends + departure logistics (see § Multi-stop
   awareness), and plan the destination stop of that leg if relevant.
4. Match the resolved stop to an entry in `dossier-data.json` `trip[]` by `name`
   (fuzzy — `route_stops` may read "Rila Mountains (Panichishte base)" while
   `trip[].name` reads "Rila / Panichishte"). The matched stop object holds the pool.
5. If no match, Halt C.

---

## Done-ledger spec

File: `trips/{slug}/day-plans/done.md`. Append-only. One dated line per run:

```
2026-06-22: Zlatnite Mostove; Women's Market; banitsa
2026-06-23: SkaraBar 1; Oborishte cafes
```

- **Updated in Step 6**, immediately after the Step 5 pick, from the operator's
  `done:` (and `skip:`) statement — it records what actually happened, not what was
  planned.
- `done:` items are permanently excluded from future long lists.
- `skip:` items are excluded from **this** run's pool but remain recallable on later
  runs (skip ≠ done). Track skips on the same line prefixed `skip:` so the
  distinction survives, e.g. `2026-06-22: ... | skip: Gellért Hill`.
- Exclusion is **fuzzy name-match** against `nm` in `do[]`/`eat[]` and `name` in
  `foodToTry[]`. On an ambiguous match, ask rather than drop the wrong item.
- Create the file with a one-line header on first write; never overwrite prior lines.

---

## Spine auto-apply logic

Compute each dimension's default from `trip-context.md` + the resolved stop, apply
it silently, and report the result in the plan's Section G. Patrik can override any
dimension in free text at the Step 5 pause.

| Dimension | Default rule |
|---|---|
| Heat timing | ON when the day's forecast ≥ 28°C → outdoor in cool hours, shade/indoor midday, flag > 30°C. Else OFF. **Forecast source:** an operator-supplied fresh read (Step 5) wins; else the stop's `stop_weather[].forecast_max_celsius`; else `forecast_max_celsius`. |
| Anti-tourist filter | ON always — push off-beat; flag/skip only Eiffel-Tower-tier traps (crowd ruins it AND only tourists value it). |
| Routine | ON always — protect exercise + meals + sleep; insert a rest pocket; no over-packing. |
| Social default | ON always — pencil one evening social option (hostel-friendly). |
| Work rhythm | ON when `work_load_hours_per_week` ≥ 20 AND tomorrow is Mon–Thu → protect a work block, front-load. Else OFF. |
| Splurge posture | From `budget_floor`/`budget_splurge_*` — cheap-first framing; flag any pick above the daily floor against the trip's splurge stance. |

(Section G names what was applied and what was dialed down, e.g.
`— Work rhythm OFF (light week / weekend)`.)

---

## Per-place data map

Real `dossier-data.json` place fields (in `do[]` and `eat[]`):

- name → `nm`
- description → `hook` (one-liner)
- tips → `tips[]` — **already authored; use directly**, pick the most useful one
- priority tier → `t` (integer: **3 = 🔥 top, 2 = 👍, 1 = 🆗**)
- category tags → `tags[]` (e.g. hike, eat, market, view, shade, social)
- timing → `best_time`, `time[]` (morning/daytime/evening), `hours`
- effort → `duration` (quick / 2-3h / half-day / full-day)
- money → `cost`
- where → `neighborhood`, `city`, `find_it`
- optional → `hike{}` (`distance`, `elevation_gain`, `water_on_route`,
  `mobile_signal`, `last_transport_back`)

Food: `eat[]` venues use the same shape; `foodToTry[]` is dishes only
(`name` / `what` / `how`) — fold these in as "eat this here" notes, not as routed
stops.

**No `lat`/`lng`** (null in the data) and **no `map_link`**. Cluster by
`neighborhood`; build Maps links inline (see `daily-program-template.md`
§ Gmaps link format).

---

## Selection & routing logic (Step 7)

1. **Assemble the pool.** Take the resolved stop's `do[]` + `eat[]`, minus done
   ledger items, minus this-run `skip:` items.
2. **Cluster by `neighborhood` + day-logic.** No coordinates exist — group by the
   `neighborhood` string and natural timing (`time[]`/`best_time`): baths/markets
   read morning, hills/nature read a half-/full-day block, riverside/bars read
   evening. Name clusters A / B / C. (Use `lat`/`lng` only if ever populated.)
3. **Select the cluster + anchors.** Score clusters on: proximity to `base` (start
   area), opening-hours/`best_time` fit, the chosen day type + energy, the active
   heat dial, anti-tourist character, and how much of the cluster is already done.
   Surface the chosen cluster **and one runner-up** with the trade-off (Patrik
   picks — per travel-principles § 1.1).
4. **Classify each place for the route:**
   - **Anchors** — the reasons the day exists (1–3). Operator `must:` items first,
     then `t: 3` places.
   - **Nearby additions** — close enough to fold in without a detour.
   - **Optional stops** — only if energy/timing allow.
   - **Rejected (this route)** — good places that are wrong for *this* day
     (backtracking, too far, wrong timing/area), each with a one-line reason.
5. **Walking-load + rest guard (load-bearing).** Build the route to minimise
   walking and backtracking. Cap total on-foot distance to a reasonable day; when a
   cluster is spread out, route via transit between sub-areas rather than walking it
   all. Insert at least one explicit rest pocket (coffee / long lunch / shade in the
   midday heat window). Honour routine: a meal rhythm, an exercise-compatible slot,
   and a protected work block when the work dial is ON. **Do not over-pack** — fewer
   anchors done well beats a full but exhausting day.
6. **Extras (tightly controlled).** Add a net-new place (not from the pool) only if
   it is directly on the route, improves flow, fills a natural gap (coffee / lunch /
   sunset / evening), gives a more local-or-scenic experience, or is a better
   alternative to a pool item. Label each `[extra — not from your list]` with the
   qualifying reason. Apply the active spine dials to extras too.

---

## Priority model

- **Must-do** = operator-flagged (`must:`) + `t: 3` anchors. Placed first and never
  dropped by the route. Tagged **must-do** in the output.
- **Optional** = everything else. Tagged **optional**; lands in Section D (add-ons)
  or the route's optional stops.

---

## Spontaneity guard

Leave at least one unplanned pocket in the day and say so explicitly (Section B /
C). Never produce a rigid minute-by-minute schedule — use time-of-day **bands**, not
clock times — even if asked (travel-principles § 5.4).

---

## Multi-stop awareness

If tomorrow is the last day at a stop or a transit/depart day, bias the plan toward
loose ends (high-value `must:`/`t: 3` items not yet done) and departure logistics
(checkout, transport timing from `route_stops[].transit_in` / the stop's `outLeg`).
Keep it light — a travel day is not a full activity day.

---

## Weather-reactive planning

The dossier's forecast is static (captured at dossier-build time). If Patrik gives a
**fresh weather read** for tomorrow at the Step 5 pause (e.g. `weather: rain all
day`, `weather: 33°C and clear`), it overrides the static forecast for both the heat
dial and routing:

- **Rain / storms** → bias toward indoor, covered, and market/food picks (museums,
  markets, covered halls, long food stops, hostel-social evenings). Move or drop
  exposed hikes, viewpoints, and open-air anchors; if an outdoor anchor is a `must:`,
  shift it to the driest window and flag the risk rather than silently keeping it.
  In mountain stops, honour the dossier's "hike mornings, storms build afternoon"
  guidance.
- **Heat spike (> 30°C)** → harden heat timing: outdoor only in the early-morning
  window, midday firmly indoor/shaded/water, and flag the > 30°C breach per the
  trip's weather rule.
- **Cool / clear improvement** → it is fine to relax an otherwise-ON heat dial and
  open up midday outdoor options.

State the weather basis used in Section B (route logic) and Section G (spine note) —
"static dossier forecast" vs "your fresh read: {what Patrik said}" — so the plan is
honest about what it reacted to.

## QC checklist (passed to `day-plan-qc`)

The command writes the draft plan, then delegates to the `day-plan-qc` agent with
the plan path, the trip slug, and this checklist:

1. **Walking load reasonable** — no exhausting forced-march route; transit used for
   spread-out legs.
2. **Rest + routine respected** — at least one rest pocket; meal rhythm present;
   work block protected if the work dial is ON; no over-packing.
3. **Done items excluded** — nothing in `day-plans/done.md` reappears in the plan.
4. **Timing fit** — each place's slot respects its `hours` / `best_time`; heat dial
   honoured (outdoor in cool hours when ≥ 28°C).
5. **Anti-tourist filter honoured** — no Eiffel-Tower-tier trap slipped in unflagged.
6. **Priorities honoured** — every `must:` / `t: 3` anchor is present; nothing
   must-do was demoted to "skip".
7. **Links present + well-formed** — every place in the plan has an inline Google
   Maps link built per the template's format.
8. **Notion formatting clean** — delimited sections, inline links, short lines, no
   horizontal-scroll tables, distances shown between consecutive stops, ≥ 1
   unplanned pocket called out.
9. **Weather basis honoured** — if a fresh forecast was given, the plan reacted to
   it (rain → indoor/market bias; heat spike → hardened timing) and the route logic
   intro names the basis used; if not, it used the static forecast and says so.

`day-plan-qc` returns **GO** or **REVISE** with specific findings. On REVISE, the
command applies the fixes and notes what changed; it does not re-loop indefinitely.
