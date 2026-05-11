# Destination Dossier Workflow

This document is the workflow contract the `dossier-orchestrator` agent executes on every `/destination-dossier` invocation. It is the source of truth for sequence, halt conditions, and what gets written where. Tune this file after the first-trip retro — do not embed workflow logic in the agent body or the command shell.

## Inputs (read at start of every run)

In order:

1. `projects/personal/profile/universal-traveler-profile.md` — must be non-empty (see Halt 1).
2. `projects/personal/profile/travel-principles.md` — must be non-empty (see Halt 1).
3. `projects/personal/trips/{slug}/trip-context.md` — must exist and have populated frontmatter (see Halt 2).
4. `projects/personal/references/dossier-template.md` — output structure spec.
5. `projects/personal/references/subagent-prompts.md` — handoff prompt library.

The `{slug}` is passed in by the calling command (`/destination-dossier --trip {slug}`) or resolved by the command to the most recently created `trips/*/` directory.

## Halt conditions (agent must surface and stop)

**Halt 1 — Personalization Spine Gate.** If either profile file is empty, missing, or contains only the placeholder header (no populated content sections), HALT and emit:

```
Personalization Spine Gate failed.

Empty or missing:
- {path that failed}
- {second path if also failed}

Phase 0 prerequisite is not met. Populate both profile files before running /destination-dossier. See projects/personal/CLAUDE.md § Personalization Spine Gate.
```

Do not generate any dossier output. Do not proceed past this check.

**Halt 2 — Trip Context Missing.** If `trips/{slug}/trip-context.md` does not exist or its YAML frontmatter is missing required fields (`destination`, `dates_start`, `dates_end`, `theme`, `work_load_hours_per_week`), HALT and emit:

```
Trip context invalid: {path}

Missing required fields: {list}

Run /trip-init to scaffold this trip, or edit trip-context.md to populate the required frontmatter.
```

**Halt 3 — Weather Ceiling Check.** FLAG (do not halt) if any location exceeds 30°C. The dossier is still produced; Patrik decides whether to proceed.

**Single-base trips:** If `forecast_max_celsius` is above 30, emit:

```
Weather check: FLAGGED — forecast max {N}°C exceeds the 30°C ceiling.
```

**Multi-stop trips:** If `stop_weather` is non-empty, check each entry. For every entry with `forecast_max_celsius` > 30, emit one flag line per location:

```
Weather check: FLAGGED — {location} forecast max {N}°C exceeds the 30°C ceiling.
```

If `stop_weather` is empty on a multi-stop trip, fall back to the trip-wide `forecast_max_celsius` check.

(Ceiling is 30°C, not 27°C — the operator relaxed this from the profile default.)

## Paste-back format contracts

All operator paste-backs use one of two formats. The orchestrator must accept both.

**List narrowing (Passes 2, 3, 4, and tourist traps in Pass 5):**

```
KEEP:
3. Saranda
7. Berat
11. Theth
```

or the compact form:

```
3, 7, 11
```

Numbers reference the long list as presented. The orchestrator does fuzzy name-matching as a fallback if the operator pastes names without numbers. If a name is ambiguous, ask for clarification — do not guess.

**Verdict passes (mobility, timing, music in Pass 5):**

```
APPROVE
APPROVE WITH NOTES: {notes}
REJECT: {reason}
```

If the operator pastes back raw subagent output without a verdict header, extract the key verdict and confirm before proceeding.

## Resume logic

On every invocation, before starting any pass, scan:
`projects/personal/trips/{slug}/dossier/pass-*-state.md`

If state files exist:
- Identify the highest-N pass whose state has `status: complete`.
- Resume from pass N+1.
- Report to Patrik: "Resuming from Pass {N+1}. Passes {1..N} already complete."

If no state files exist, start from Pass 2.

## Workflow Sequence

### Step 1 — Read inputs

Read all five files listed in "Inputs" above. Extract from `trip-context.md`:

- `destination` (string)
- `dates_start`, `dates_end` (YYYY-MM-DD)
- `theme` (string, e.g., "anti-tourist remote-work")
- `work_load_hours_per_week` (integer, default 25)
- `budget_floor_eur_per_day` (integer, default 50)
- `budget_splurge_low_eur`, `budget_splurge_high_eur` (integers, defaults 100 and 150)
- `forecast_max_celsius` (integer or `unknown`)
- `timing_verdict` (string: `GOOD`, `ACCEPTABLE`, `SUBOPTIMAL`, or `unknown`)
- `timing_notes` (string, may be empty — crowding signals and event signals)
- `stop_weather` (list, may be empty — per-region max temps for multi-stop trips; populated at `/trip-init` time)
- `trip_type` (string: `single-base` or `multi-stop`; default `single-base` if absent)
- `viability_verdict` (string: `pass`, `conditional`, `fail`, or `skipped`)
- `viability_notes` (string, may be empty)
- `approved_locations` (list, may be empty — populated during Pass 2)
- `route_stops` (list, may be empty — multi-stop only, populated during Pass 2)

### Step 2 — Personalization spine extracts

From the profile, identify the 3–5 preferences most load-bearing for this trip's `theme` + `work_load`. From the principles, identify which principles will gate which dossier sections.

Hold these as `PROFILE_EXTRACT` and `PRINCIPLES_EXTRACT` — short bulleted strings, ready to substitute into the subagent prompt templates.

### Step 2.5 — Viability verdict note

If `viability_verdict` is `fail`, HALT and emit:

```
Viability check for {destination} returned FAIL.

Notes: {viability_notes}

The destination did not pass viability screening. Re-run /destination-check
or pass --skip-viability to /trip-init to override.
```

If `viability_verdict` is `conditional`, note the conditions in the run log (Step 14) and continue. Do not halt.

If `viability_verdict` is `skipped` or `pass`, continue without comment.

### Step 3 — Pass 2: Location long list

Read `references/subagent-prompts.md` § Pass 2 for the location prompt template. Branch on `trip_type`:

**single-base:** Instantiate the "Neighborhoods long list" prompt template (Prompt 2a). Substitutes `{destination}`, `{dates}`, `{theme}`, `{work_load}`, `{budget_floor}`, `{profile_extract}`, `{principles_extract}`.

**multi-stop:** Instantiate the "Route and stops" prompt template (Prompt 2b). Substitutes the same placeholders plus `{trip_duration_nights}`. This prompt asks for an ordered route (10–15 candidate stop combinations) with rough nights-per-stop and vibes per stop.

Target tool: ChatGPT Pro.

### Step 4 — PAUSE: Pass 2 operator gate

Present the Pass 2 prompt to Patrik labeled with:

- `Pass 2 — Locations (single-base: neighborhoods | multi-stop: route + stops)`
- Target tool: ChatGPT Pro
- The full prompt body in a fenced code block, paste-ready
- Expected output shape: "Numbered list of 10–15 candidates. Each: name — one-line vibe — work-fit verdict."

End the message with:

```
Run this prompt in ChatGPT Pro. Paste the full output back here.
Then narrow the list using the KEEP format:
  KEEP:
  3. {name}
  7. {name}
Or: 3, 7, 11
```

Wait for Patrik's paste-back (the raw long list) AND the KEEP selection. Both may come in one message or two — accept either.

### Step 4.5 — Ingest Pass 2 short list

Parse the KEEP selection against the long list. Extract the approved short list.

Write `trips/{slug}/dossier/pass-2-state.md`:

```yaml
---
pass_number: 2
status: complete
generated_at: {timestamp}
gate_received_at: {timestamp}
---

## Long list

{full long list as presented}

## Short list (operator-approved)

{approved items only, numbered from original long list}
```

**For multi-stop:** If approved items are stops with nights, parse `{name}: {N} nights` form. If the operator just selected names without nights, prompt: "How many nights at each?" before proceeding. Once nights are confirmed, structure as `route_stops` list.

Update `trip-context.md` frontmatter:
- **single-base:** write `approved_locations: [{name1}, {name2}, ...]`
- **multi-stop:** write `approved_locations: [{name1}, {name2}, ...]` and `route_stops: [{name: name1, nights: N}, ...]`

### Step 5 — Pass 3: Activities long list

Read `references/subagent-prompts.md` § Pass 3 for the activities prompt template (Prompt 3). Substitute `{destination}`, `{dates}`, `{theme}`, `{work_load}`, `{budget_floor}`, `{profile_extract}`, `{principles_extract}`, and `{approved_locations}` (comma-joined names from the Pass 2 short list).

The prompt asks for 15–20 candidate activities scoped to the approved locations. Target tool: Perplexity Pro.

### Step 6 — PAUSE: Pass 3 operator gate

Present the Pass 3 prompt labeled:

- `Pass 3 — Activities`
- Target tool: Perplexity Pro
- Expected output shape: "Numbered list of 15–20 activities. Each: name — location, stop — one-line why — source signal."

End with the KEEP format instructions (same as Step 4).

Wait for paste-back + KEEP selection.

### Step 6.5 — Ingest Pass 3 short list

Parse KEEP selection. Write `trips/{slug}/dossier/pass-3-state.md` (same format as pass-2-state.md).

No trip-context.md update needed — activities are kept in the state file only.

### Step 7 — Pass 4: Food long list

Read `references/subagent-prompts.md` § Pass 4 for the food prompt template (Prompt 4). Substitute same placeholders including `{approved_locations}`.

Asks for 15–20 candidate food spots (mix of daytime/work-friendly and memorable-dinner), scoped to approved locations. Target tool: Perplexity Pro.

### Step 8 — PAUSE: Pass 4 operator gate

Present the Pass 4 prompt labeled:

- `Pass 4 — Food`
- Target tool: Perplexity Pro
- Expected output shape: "Numbered list of 15–20 places. Each: name — location, stop — type (daytime/dinner) — one-line why — source signal."

End with KEEP format instructions.

Wait for paste-back + KEEP selection.

### Step 8.5 — Ingest Pass 4 short list

Parse KEEP selection. Write `trips/{slug}/dossier/pass-4-state.md`.

### Step 9 — Pass 5: Practicalities

Generate three sub-prompts using templates from `references/subagent-prompts.md` § Pass 5:

**5a — Tourist traps (long list → short list):** Prompt 5a asks for 10–15 named places to avoid, each with a specific trap signal. Target tool: Perplexity Pro.

**5b — Mobility verdict:** Prompt 5b asks for a single mobility recommendation for the approved route. For multi-stop: covers inter-stop transport AND local mobility per stop. For single-base: one verdict. Target tool: ChatGPT Pro.

**5c — Timing (not run here):** Timing was collected at `/trip-init` time via Prompt T1 and stored in `trip-context.md` frontmatter. Section 7 (optimal timing) is synthesized from `timing_verdict` and `timing_notes`. No prompt generated at this step.

**5d — Music verdict:** Prompt 5d asks for 1–2 playlists / genres / artists matching the destination's local sound. Target tool: ChatGPT Pro.

### Step 10 — PAUSE: Pass 5 operator gate

Present all three Pass 5 prompts in one message (5a, 5b, 5d — timing was collected at `/trip-init`). Label each with its section letter, target tool, and expected output shape. For 5a only, include the KEEP format instruction. For 5b and 5d, include the APPROVE/REJECT format.

End with:

```
Run all three prompts in the indicated tools. Paste all results back in a single
block, each labeled by section (5a, 5b, 5d).
For 5a: include your KEEP selection after the long list.
For 5b, 5d: include APPROVE / APPROVE WITH NOTES / REJECT after the output.
```

Wait for Patrik's paste-back.

### Step 10.5 — Ingest Pass 5 results

Parse each sub-section:

- **5a (traps):** Extract long list; parse KEEP selection for short list.
- **5b (mobility):** Parse APPROVE/APPROVE WITH NOTES/REJECT verdict.
- **5d (music):** Parse verdict.

**De-duplication check (B3):** After parsing the 5a short list, read `pass-3-state.md` and `pass-4-state.md` short lists. For each item in the 5a short list, fuzzy-match against all items in the Pass 3 and Pass 4 approved short lists. On any name overlap:
- Remove the conflicting item from the Pass 3 or Pass 4 short list (trap wins).
- Record each conflict in the run log (Step 14) as: `De-dup: {place name} removed from Pass {N} keep-list — appears in trap list.`
- Do not silently remove. If more than 3 conflicts arise in a single pass, surface them to Patrik before proceeding.

Write `trips/{slug}/dossier/pass-5-state.md` with all three sub-sections plus de-dup log. Format:

```yaml
---
pass_number: 5
status: complete
generated_at: {timestamp}
gate_received_at: {timestamp}
---

## 5a — Tourist traps long list
{full list}

## 5a — Tourist traps short list (operator-approved)
{approved items}

## 5b — Mobility verdict
{APPROVE/REJECT + raw output}

## 5d — Music verdict
{APPROVE/REJECT + raw output}

## De-duplication log
{list of conflicts resolved, or "None"}
```

### Step 11 — Synthesize through profile + principles

For each pass's approved short list and each verdict, apply:

- **Anti-tourist filter.** Cross-check candidate places against principles. Remove or flag any place that triggers a mass-tourism signal.
- **Personalization filter.** For each candidate place, verify at least one PROFILE_EXTRACT preference is relevant. If no preference matches, demote or remove.
- **Routine integration check.** For locations (Section 1) and accommodation (Section 2), verify proximity to work-friendly cafes and routine maintenance (gym / supermarket / morning coffee).

Record per pass: which preferences were applied, which principles enforced, what was filtered out. This grounding data goes to the run log (Step 14), NOT to the dossier output (per D7).

### Step 12 — Format the dossier

Read `references/dossier-template.md` for the output structure. Produce the dossier following:

- Trip header block (destination, dates, theme, work-load, budget posture, weather check).
- Viability note if `viability_verdict` is `conditional` — one line: "Viability: CONDITIONAL — {viability_notes}".
- Sections 1–8 in order, each with `## ` header, `---` divider before next, mobile-formatting rules.
- Place lines: `Name — Neighborhood, City — one-line why`.
- For multi-stop trips: apply per-section multi-stop variants per `dossier-template.md` § Multi-Stop Variants.
- Missing/partial sections rendered as `## {n}. {Section name}\n\n_Section incomplete — re-run prompt and re-paste._\n\n---`.
- No grounding evidence block (D7 — keep dossier clean).
- No external links inside section bodies. Sources/links go in a single optional `## Sources & Links` appendix at the end.

**Mapping from passes to sections:**

| Source | Dossier sections |
|---|---|
| Pass 2 short list | Section 1 (neighborhoods) and Section 2 (accommodation) |
| Pass 3 short list (after de-dup) | Section 3 (hidden-gem activities) |
| Pass 4 short list (after de-dup) | Section 4 (food / restaurants) |
| Pass 5a short list | Section 5 (tourist-trap warnings) |
| Pass 5b verdict | Section 6 (mobility) |
| `timing_verdict` + `timing_notes` from trip-context.md | Section 7 (optimal timing) |
| Pass 5d verdict | Section 8 (music vibe) |

### Step 13 — Write the dossier

Write to `projects/personal/trips/{slug}/destination-dossier.md`. If the file already exists, write to `destination-dossier-v{n}.md` where `{n}` is the next integer after the highest existing version. Do not overwrite a prior dossier silently.

### Step 14 — Append to the run log

Append to `projects/personal/logs/dossier-runs.md` using the format spec in that file's header. Required fields:

- Timestamp (`YYYY-MM-DD HH:MM` local)
- Trip slug
- Trip type (`single-base` or `multi-stop`)
- Dossier output path written
- Profile version read (`unversioned` at Phase 1)
- Principles version read (same)
- Viability verdict from trip-context.md
- PROFILE_EXTRACT — verbatim
- PRINCIPLES_EXTRACT — verbatim
- Per-pass status — for each pass: long-list count, short-list count, rejected count
- Per-pass filtering notes — what was filtered from the short list by the synthesis step
- Halt-or-flag notes — weather flag if fired, conditional viability notes if applicable

This is the grounding evidence Patrik will inspect after the run if he wants to verify the synthesis is real (per D7, grounding lives here, not in the dossier).

### Step 15 — Report back to the command shell

Return to the calling `/destination-dossier` command:

- Dossier path written
- Run-log entry written
- Pass status summary: "Pass 2: {N} approved / {M} total. Pass 3: ... Pass 4: ... Pass 5a: ..."
- Reminder: "Paste dossier into iPhone Notes section-by-section using `## ` headers as paste boundaries."

## What this workflow does NOT do (locked at Phase 1)

- No `WebSearch` or `WebFetch` from the orchestrator. Subagents (ChatGPT Pro / Perplexity Pro) handle external retrieval.
- No API calls to ChatGPT or Perplexity. Mode 1 only.
- No Google Maps or iPhone Notes integration. Format-only.
- No skill invocation (`ai-resources/skills/`) at runtime. Build-time aids only.
- No silent fabrication of missing sections or missing short-list items. Missing means missing.
- No writing outside `trips/{slug}/`, `logs/`, or `destination-checks/`.

## Tuning notes (for post-first-trip retro)

After the first real-trip run, this file is the most likely place edits will land. Likely tuning axes:

- Section routing (which passes go to ChatGPT vs. Perplexity).
- Long-list size per pass (10–15 for Pass 2, 15–20 for Passes 3/4 — adjust if consistently too thin or too noisy).
- Filtering strictness (anti-tourist threshold, personalization-match threshold).
- Resume granularity (currently per-pass; could go per-sub-step if operators frequently exit mid-pass).
- Weather ceiling (currently 30°C; may tighten to 27°C if flagged destinations never deliver).
- Run-log format (add fields the retro needs).
