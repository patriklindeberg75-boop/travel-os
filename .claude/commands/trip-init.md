---
description: Scaffold a per-trip directory under projects/personal/trips/. Creates trip-context.md (with YAML frontmatter for destination, dates, theme, work-load, budget), an empty journal.md, and a dossier/ subdirectory placeholder. Slug format is {destination-kebab}-{YYYY-MM}.
model: sonnet
---

Scaffold a per-trip directory. Mechanical — creates a directory and one templated file. Run this before `/destination-dossier`.

Input: `$ARGUMENTS` — free-text arguments. Expected forms:

- `/trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"`
- `/trip-init Albania 2026-05-15 2026-06-01 "anti-tourist remote-work" --trip-type multi-stop`
- `/trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work" --work-load 30 --budget-floor 60`

Positional order: `{destination} {dates_start} {dates_end} {theme}`. Optional flags: `--work-load {hours}`, `--budget-floor {eur}`, `--budget-splurge-lo {eur}`, `--budget-splurge-hi {eur}`, `--forecast-max {celsius}`, `--trip-type single-base|multi-stop` (default: `single-base`), `--skip-viability` (skips the destination-check lookup gate).

---

### Step 1 — Parse arguments

Parse `$ARGUMENTS` into:

- `DESTINATION` — first token (string, may include hyphens; no spaces unless quoted).
- `DATES_START` — second token (YYYY-MM-DD).
- `DATES_END` — third token (YYYY-MM-DD).
- `THEME` — remaining positional tokens before any `--` flag, joined with spaces, with surrounding quotes stripped.
- Optional flags: `WORK_LOAD` (default 25), `BUDGET_FLOOR` (default 50), `BUDGET_SPLURGE_LO` (default 100), `BUDGET_SPLURGE_HI` (default 150), `FORECAST_MAX` (default `unknown`), `TRIP_TYPE` (default `single-base`), `SKIP_VIABILITY` (boolean flag, default false).

If `$ARGUMENTS` is empty or missing destination/dates/theme, abort with:

```
/trip-init requires: {destination} {dates_start} {dates_end} {theme}
Example: /trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"
```

Validate dates are `YYYY-MM-DD` and `DATES_END >= DATES_START`. If not, abort with a one-line error.

### Step 2 — Generate slug

`SLUG` = `{destination lowercased, spaces and special chars replaced with hyphens}-{YYYY-MM from DATES_START}`.

Examples:
- `Lisbon`, `2026-06-15` → `lisbon-2026-06`
- `San Sebastián`, `2026-09-10` → `san-sebastian-2026-09` (strip diacritics)

If `projects/personal/trips/{SLUG}/` already exists, append `-b` (or `-c`, `-d`, ...) until the path is free. Report the chosen slug.

### Step 2.5 — Viability check lookup

If `SKIP_VIABILITY` is true, set `VIABILITY_VERDICT = skipped`, `VIABILITY_NOTES = ""`, `VIABILITY_CHECKED_AT = ""` and continue to Step 3.

Otherwise, look for a matching destination-check artifact at:
`projects/personal/destination-checks/{destination-kebab}-{YYYY-MM from DATES_START}.md`

Where `{destination-kebab}` is the destination lowercased with spaces and special chars replaced by hyphens (same as slug generation).

- If the file exists: read its `viability_verdict`, `viability_notes`, and `viability_checked_at` fields. Set `VIABILITY_VERDICT`, `VIABILITY_NOTES`, `VIABILITY_CHECKED_AT` from those values.
- If the file does not exist, abort with:

```
Viability check not found for {DESTINATION} ({DATES_START}).

Expected: projects/personal/destination-checks/{destination-kebab}-{YYYY-MM}.md

Run /destination-check {DESTINATION} {DATES_START} {DATES_END} first, or pass
--skip-viability to scaffold without a viability verdict.
```

### Step 3 — Create the directory and scaffolding files

Create the directory `projects/personal/trips/{SLUG}/`.

Inside, create:

**1. `trip-context.md`** with this content:

```
---
destination: {DESTINATION}
dates_start: {DATES_START}
dates_end: {DATES_END}
theme: {THEME}
work_load_hours_per_week: {WORK_LOAD}
budget_floor_eur_per_day: {BUDGET_FLOOR}
budget_splurge_low_eur: {BUDGET_SPLURGE_LO}
budget_splurge_high_eur: {BUDGET_SPLURGE_HI}
forecast_max_celsius: {FORECAST_MAX}
timing_verdict: unknown
timing_notes: ""
stop_weather: []
trip_type: {TRIP_TYPE}
approved_locations: []
route_stops: []
viability_verdict: {VIABILITY_VERDICT}
viability_notes: "{VIABILITY_NOTES}"
viability_checked_at: "{VIABILITY_CHECKED_AT}"
created: {TODAY in YYYY-MM-DD}
slug: {SLUG}
---

# Trip Context — {DESTINATION} ({DATES_START} to {DATES_END})

## Notes

(Add free-text notes about this trip here — anything that should color the dossier
and day plans. Examples: travel companions if any, specific things you want to do
or avoid, work-load specifics for this trip.)
```

**2. `journal.md`** with this content:

```
# Trip Journal — {DESTINATION} ({DATES_START} to {DATES_END})

Daily notes during the trip. Free-form. Used by the Phase 3 retro to update profile
and principles.

## Day 1 — {DATES_START}

(Start writing here once the trip begins.)
```

**3. Empty `dossier/` subdirectory** (placeholder for raw subagent paste archives
if Patrik wants to save them).

### Step 3.5 — Timing prompt (one-time)

Generate the timing prompt by reading `references/subagent-prompts.md` § Trip Init — Timing (Prompt T1). Substitute `{destination}` and `{dates}`. If `TRIP_TYPE` is `multi-stop`, append the multi-stop extension.

Present to Patrik:

```
Timing prompt (run once — results stored in trip-context.md)
Target tool: Perplexity Pro
Expected output: weather + crowding signals + event signal + one-line verdict.
Multi-stop: also per-region max temperatures.

{prompt body}

Paste the full output back here. Then confirm:
  - Overall verdict: GOOD / ACCEPTABLE / SUBOPTIMAL
  - Overall max temperature in °C (integer, or "unknown")
  For multi-stop: per-region temps in format "Region: N°C"
```

Wait for paste-back. Parse the four fields per the paste-back parsing spec in Prompt T1. Update `trip-context.md` via Edit with the parsed values.

If Patrik skips this step (types "skip" or similar), leave the timing fields at their defaults (`unknown`, `""`, `[]`) and continue. The fields can be updated manually in `trip-context.md` before running `/destination-dossier`.

### Step 4 — Report

Return to Patrik:

```
Trip scaffolded.

Slug: {SLUG}
Path: projects/personal/trips/{SLUG}/
Trip type: {TRIP_TYPE}
Viability: {VIABILITY_VERDICT}{" — " + VIABILITY_NOTES if VIABILITY_NOTES else ""}

Files created:
- trip-context.md   (edit to add free-text notes)
- journal.md        (write daily notes during the trip)
- dossier/          (optional: save raw subagent pastes here when running /destination-dossier)

Next: run /destination-dossier --trip {SLUG} when the profile and principles are
populated. The dossier workflow runs in 5 passes with operator gates — expect
5 pause-and-paste cycles before the final dossier ships.
(Phase 0 prerequisite — see projects/personal/CLAUDE.md § Personalization Spine Gate.)
```

---

### Notes for the executor

- This command writes files but does not read profile/principles (they are not needed for scaffolding). The Personalization Spine Gate fires on `/destination-dossier` and `/destination-check`, not here.
- The scaffolding template is intentionally minimal. Patrik fills in free-text notes in `trip-context.md` before running the dossier command.
- No agent delegation. This is a thin command — viability lookup + directory create + one templated write + reporting.
- The viability-check lookup (Step 2.5) reads a file written by `/destination-check`. That file's path uses the same kebab-slug convention as the trip slug. If the destination was checked for a different month than the trip start month, pass `--skip-viability` and note the mismatch manually in `trip-context.md`.
- `approved_locations` and `route_stops` are scaffolded as empty lists `[]`. They are populated by the orchestrator after Pass 2 of `/destination-dossier`. Do not pre-fill them manually.
