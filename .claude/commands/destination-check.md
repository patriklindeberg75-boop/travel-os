---
description: Check whether a destination is viable for a trip before scaffolding with /trip-init. Reads profile + principles, generates a Perplexity Pro viability-assessment prompt, pauses for Patrik's paste-back, and writes a verdict artifact to destination-checks/. Pass 1 of the 5-pass research funnel.
model: sonnet
---

Screen a destination for viability before committing to a trip. Runs before `/trip-init`. Produces a PASS / CONDITIONAL / FAIL verdict based on hard constraints (weather ceiling, safety, season fit, language access) and profile fit (vibe match, work-feasibility).

Input: `$ARGUMENTS` — free-text. Expected form:

- `/destination-check Albania 2026-05-15 2026-06-01`
- `/destination-check Kyrgyzstan 2026-07-01 2026-07-21`

Positional order: `{destination} {dates_start} {dates_end}`.

---

### Step 1 — Parse arguments

Parse `$ARGUMENTS` into:

- `DESTINATION` — first token.
- `DATES_START` — second token (YYYY-MM-DD).
- `DATES_END` — third token (YYYY-MM-DD).

If any are missing or dates are not YYYY-MM-DD, abort with:

```
/destination-check requires: {destination} {dates_start} {dates_end}
Example: /destination-check Albania 2026-05-15 2026-06-01
```

Compute:
- `DESTINATION_KEBAB` — DESTINATION lowercased, spaces and special chars replaced with hyphens.
- `YYYY_MM` — year and month from DATES_START.
- `CHECK_PATH` = `destination-checks/{DESTINATION_KEBAB}-{YYYY_MM}.md`

### Step 2 — Personalization Spine Gate

Read the first 10 lines of each of:
- `profile/universal-traveler-profile.md`
- `profile/travel-principles.md`

If either file is empty, contains only an unpopulated placeholder header, or does not exist, abort with:

```
Personalization Spine Gate — Phase 0 prerequisite not met.

Empty or missing:
- {path that failed}
- {second path if also failed}

Populate both profile files before running /destination-check. See
CLAUDE.md § Personalization Spine Gate.
```

If both files are populated, read them fully. Extract:
- `PROFILE_EXTRACT` — 3–5 bullet preferences most relevant to destination-level viability assessment (social atmosphere preference, work-integration needs, anti-tourist stance, pace/routine).
- `PRINCIPLES_EXTRACT` — all hard constraints relevant to viability (weather ceiling, solo-only, 1+ week minimum, routine requirements, any hard exclusions by category).

### Step 3 — Generate the viability prompt

Present this prompt to Patrik labeled for Perplexity Pro:

---

**Viability Check — Section 0**
**Target tool:** Perplexity Pro
**Expected output:** PASS / CONDITIONAL (with specific notes) / FAIL (with reason). 3–8 lines total.

```
I am planning a solo trip to {DESTINATION} from {DATES_START} to {DATES_END}.

My traveler profile (read carefully — shapes the vibe-match assessment):

{PROFILE_EXTRACT}

My hard constraints (non-negotiable — any failure is a FAIL verdict):

{PRINCIPLES_EXTRACT}

Task: Assess whether {DESTINATION} from {DATES_START} to {DATES_END} is viable
for this trip. Evaluate each of the following dimensions:

1. Weather: expected high/low temperatures and rainfall for the date window.
   Hard ceiling: flag if forecast max exceeds 30°C. State the expected max.

2. Safety: current travel advisory level (check official sources: FCDO, US State
   Department, or equivalent). Flag any active conflict, civil unrest, or
   "do not travel" advisory. Be specific — name the advisory source and level.

3. Season fit: is this a good time of year for {DESTINATION}? Flag if this is
   peak tourist season (high prices, high crowds), shoulder season, or off-season.
   Name any major events in the date window that affect crowds or access.

4. Crowding signal: will the destination be unusually crowded during these dates
   (cruise ships, national holidays, major festivals)? Name the specific signal.

5. Vibe match: based on the profile above, does {DESTINATION} in this window suit
   this traveler? Consider: anti-tourist infrastructure (local neighborhoods that
   still function normally), remote-work feasibility (reliable WiFi in cafes),
   solo-backpacker social scene (hostels with community feel, expat/traveler mix).

6. Work-feasibility: can a remote worker reliably get 4-5 hours of focused work
   per day in {DESTINATION} (cafes with WiFi, co-working spaces, reasonable
   internet reliability)?

Output a verdict in this exact format:

VERDICT: PASS | CONDITIONAL | FAIL

WEATHER: {one-line: max °C expected, pass/flag}
SAFETY: {one-line: advisory level + source}
SEASON: {one-line: peak/shoulder/off-season + crowd note}
VIBE MATCH: {one-line: yes / partial / no + specific reason}
WORK FEASIBILITY: {one-line: yes / partial / no + specific reason}

NOTES: {Any conditions that make this CONDITIONAL or FAIL. If PASS, write "None."}

Cite sources for safety and weather claims.
```

---

End the message with:

```
Run this prompt in Perplexity Pro. Paste the full output back here.
```

Stop and wait for Patrik's paste-back.

### Step 4 — Ingest paste-back

Parse Patrik's paste-back. Extract:
- `VERDICT_LINE` — the VERDICT: line (PASS, CONDITIONAL, or FAIL).
- `NOTES_BLOCK` — everything after NOTES:.

Map to:
- `VIABILITY_VERDICT` = `pass` | `conditional` | `fail`
- `VIABILITY_NOTES` = the NOTES_BLOCK content (empty string if "None.")
- `VIABILITY_CHECKED_AT` = today's date (YYYY-MM-DD)

If the paste-back is missing or uninterpretable, ask Patrik to re-paste or confirm the verdict manually.

### Step 5 — Write the verdict artifact

Write `{CHECK_PATH}` with this content:

```
---
destination: {DESTINATION}
dates_start: {DATES_START}
dates_end: {DATES_END}
viability_verdict: {VIABILITY_VERDICT}
viability_notes: "{VIABILITY_NOTES}"
viability_checked_at: {VIABILITY_CHECKED_AT}
profile_version: unversioned
principles_version: unversioned
---

# Viability Check — {DESTINATION} ({DATES_START} to {DATES_END})

## Verdict: {VIABILITY_VERDICT | uppercase}

{VIABILITY_NOTES if non-empty, else "No conditions."}

## Raw Perplexity Output

{Full paste-back content}
```

If `{CHECK_PATH}` already exists, write to `{DESTINATION_KEBAB}-{YYYY_MM}-b.md` (or `-c`, `-d`, ...) and note the collision.

### Step 6 — Report

Return to Patrik:

```
Viability check complete.

Destination: {DESTINATION} ({DATES_START} to {DATES_END})
Verdict: {VIABILITY_VERDICT | uppercase}{" — " + VIABILITY_NOTES if VIABILITY_NOTES else ""}

Artifact written: {CHECK_PATH}

{if PASS or CONDITIONAL}
Next: run /trip-init {DESTINATION} {DATES_START} {DATES_END} "{theme}" [--trip-type multi-stop]
The viability verdict will be copied into trip-context.md automatically.

{if FAIL}
Destination does not meet viability criteria. Consider an alternative destination
or adjust dates. Re-run /destination-check when ready.
```

---

### Notes for the executor

- This is a thin command — Spine Gate + one Perplexity Pro prompt + verdict artifact write. No agent delegation.
- The verdict artifact at `destination-checks/{DESTINATION_KEBAB}-{YYYY_MM}.md` is what `/trip-init` reads in Step 2.5. The path convention must match exactly.
- The Personalization Spine Gate is mandatory here — the vibe-match dimension of the viability prompt substitutes PROFILE_EXTRACT, and generic output without the profile is not acceptable.
- Do NOT generate the viability verdict yourself. The viability prompt must be run in Perplexity Pro. Mode 1 only at Phase 1.
