# Implementation Spec: Personal Travel Planning System — Phase 1

**Stage:** 3c — Implementation Spec
**Generated:** 2026-05-11
**Inputs read:**
- `projects/personal/pipeline/architecture.md` (Stage 3b)
- `projects/personal/pipeline/repo-snapshot.md` (Stage 3a)
- `projects/personal/pipeline/technical-spec.md`
- `projects/personal/pipeline/project-plan.md`
- `projects/personal/pipeline/context-pack.md`
- `projects/personal/pipeline/decisions.md` (1 confirmed decision — see Op-precondition)
- `projects/personal/CLAUDE.md` (project rules)
- Sibling pattern: `projects/axcion-ai-system-owner/.claude/{commands,agents}/` (thin-shell + Opus agent pattern)

**Target Stage 4 executor:** `project-implementer` agent or equivalent. Every operation below has exact content. Stage 4 should require zero re-derivation from the architecture document.

---

## 0. Operator-confirmed decisions applied here

| # | Source | Decision | How applied in this spec |
|---|--------|----------|--------------------------|
| D7 | `decisions.md` (Patrik) | **No grounding evidence block in dossier output.** Grounding logged to run log only. | The `dossier-template.md` reference contains NO grounding block in the trip header. The `dossier-workflow.md` reference requires the orchestrator to emit grounding data into `logs/dossier-runs.md`. The agent definition makes "write grounding to run log" a load-bearing workflow step. |

This is the only confirmed decision from Stage 3b. Architecture-document Decision Log items D1, D3, D4, D6, D9 (single agent, per-trip layout, Sonnet agent, Mode-1 only, no skill symlinks) are also applied below but not yet logged in `decisions.md` — Stage 4 may proceed; Stage 6 retro can lock them in.

---

## 1. Operation Inventory

**Total operations: 9** (7 create, 2 modify).

| # | Op | Path | Type | Complexity |
|---|----|------|------|------------|
| 1 | MODIFY | `projects/personal/CLAUDE.md` | Project CLAUDE.md | Low (append ~14 lines) |
| 2 | CREATE | `projects/personal/references/dossier-workflow.md` | Reference doc | High |
| 3 | CREATE | `projects/personal/references/dossier-template.md` | Reference doc | Medium |
| 4 | CREATE | `projects/personal/references/subagent-prompts.md` | Reference doc | High |
| 5 | CREATE | `projects/personal/.claude/agents/dossier-orchestrator.md` | Agent definition | Medium |
| 6 | CREATE | `projects/personal/.claude/commands/trip-init.md` | Thin command shell | Low |
| 7 | CREATE | `projects/personal/.claude/commands/destination-dossier.md` | Thin command shell | Low |
| 8 | MODIFY | `projects/personal/.claude/shared-manifest.json` | Manifest | Low (3 array entries) |
| 9 | CREATE | `projects/personal/logs/dossier-runs.md` | Empty log header | Low |

Not created at this stage (created on demand by `/trip-init`): per-trip directories under `trips/{slug}/`.

Not created at this stage (Phase 0 prerequisite, outside Stage 4 scope): content for `profile/universal-traveler-profile.md` and `profile/travel-principles.md`.

---

## 2. Sequencing and Dependencies

Stage 4 executes in this order. Each operation must complete before the next begins; only the manifest update (Op 8) has a strict ordering constraint (it must follow Ops 5–7 so the file lists reflect what is on disk, though the auto-sync hook does not run mid-session).

1. Op 9 — create `logs/dossier-runs.md` first (cheap, no deps).
2. Op 2 — create `references/dossier-workflow.md` (no deps).
3. Op 3 — create `references/dossier-template.md` (no deps).
4. Op 4 — create `references/subagent-prompts.md` (no deps).
5. Op 5 — create `.claude/agents/dossier-orchestrator.md` (references all three of Ops 2–4 by path).
6. Op 6 — create `.claude/commands/trip-init.md` (no agent dep).
7. Op 7 — create `.claude/commands/destination-dossier.md` (references `dossier-orchestrator` agent by name).
8. Op 8 — modify `.claude/shared-manifest.json` (register the 2 commands and 1 agent as `local`).
9. Op 1 — modify `projects/personal/CLAUDE.md` (append two pointer blocks — done last so the pointers reference files that already exist).

Estimated Stage 4 time: 30–45 minutes for a competent executor at Sonnet, given full content templates.

---

## 3. Pre-Flight Checks (Stage 4 must verify before starting)

1. Confirm `projects/personal/.claude/agents/` exists. If not present (it should be — auto-synced from ai-resources), abort with a setup error.
2. Confirm `projects/personal/.claude/commands/` exists. Same.
3. Confirm `projects/personal/references/` does NOT exist yet (or is empty). If non-empty, list contents and ask Patrik before overwriting.
4. Confirm `projects/personal/logs/` exists. If not, create the directory.
5. Confirm `projects/personal/.claude/shared-manifest.json` exists and is valid JSON. If malformed, abort.
6. Confirm the auto-sync hook has NOT just run with the new commands/agents still unregistered. (If a session is restarting, run Op 8 first to avoid the next SessionStart sweeping the new files. In the same-session case, this is not an issue.)

If any check fails, halt and report to Patrik before proceeding.

---

## 4. Operation Specs (full content)

---

### Op 1 — MODIFY `projects/personal/CLAUDE.md`

**Type:** Append two pointer blocks at the end of the file (after the existing "Session Boundaries" section).

**Insertion point:** End of file, after the last existing line.

**Exact content to append** (verbatim, including blank lines and final newline):

```markdown

## Workflow References

The Phase 1 dossier workflow is defined by three project-local reference files. Workflow methodology lives in those files, not here:

- `references/dossier-workflow.md` — workflow steps, personalization gate, halt conditions, run-log grounding spec.
- `references/dossier-template.md` — destination dossier output structure and mobile formatting rules.
- `references/subagent-prompts.md` — handoff prompt templates for ChatGPT Pro and Perplexity Pro (Mode 1 manual delegation).

The `dossier-orchestrator` agent reads all three on every invocation. Future commands (`/daily-program`, `/tomorrow-spar`) will add parallel reference files under `references/`.

## Trip Directory Convention

Each trip lives in `trips/{slug}/`, where `{slug}` is `{destination-lowercase-kebab}-{YYYY-MM}` (example: `lisbon-2026-06`). The slug is generated by `/trip-init`. Per-trip layout: `trip-context.md` (scaffolded by `/trip-init`), `destination-dossier.md` (produced by `/destination-dossier`), `dossier/` (optional raw subagent paste archive), `journal.md` (Patrik's own trip notes, used by Phase 3 retro). Same-destination-same-month repeats append `-b`, `-c`, etc., manually.
```

**Acceptance:** File now ends with two new `## ` sections. Total file growth ≈ 14 content lines.

---

### Op 2 — CREATE `projects/personal/references/dossier-workflow.md`

**Purpose:** Define the destination-dossier workflow as the contract `dossier-orchestrator` reads every invocation.

**Pre-action:** Ensure `projects/personal/references/` directory exists; create it if missing.

**Exact content:**

```markdown
# Destination Dossier Workflow

This document is the workflow contract the `dossier-orchestrator` agent executes on every `/destination-dossier` invocation. It is the source of truth for sequence, halt conditions, and what gets written where. Tune this file after first-trip retro — do not embed workflow logic in the agent body or the command shell.

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

**Halt 3 — Weather Ceiling Check.** If `trip-context.md` includes a `forecast_max_celsius` value above 27, FLAG (do not halt) the dossier with a header warning:

```
Weather check: FLAGGED — forecast max {N}°C exceeds the 27°C ceiling.
```

The dossier is still produced; Patrik decides whether to proceed with the trip.

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

### Step 2 — Personalization spine extracts

From the profile, identify the 3–5 preferences most load-bearing for this trip's `theme` + `work_load`. From the principles, identify which principles will gate which dossier sections.

Hold these as `PROFILE_EXTRACT` and `PRINCIPLES_EXTRACT` — short bulleted strings, ready to substitute into the subagent prompt templates.

### Step 3 — Generate handoff prompts

Read `references/subagent-prompts.md`. For each of the eight dossier sections, instantiate the corresponding prompt template by substituting:

- `{destination}`
- `{dates}` (formatted as "YYYY-MM-DD to YYYY-MM-DD")
- `{theme}`
- `{work_load}`
- `{budget_floor}`
- `{budget_splurge_lo}`, `{budget_splurge_hi}`
- `{profile_extract}` (the PROFILE_EXTRACT string)
- `{principles_extract}` (the PRINCIPLES_EXTRACT string)

Each prompt's target tool (ChatGPT Pro or Perplexity Pro) is named in `subagent-prompts.md`. Preserve the routing per prompt — do not collapse all prompts onto one tool.

### Step 4 — PAUSE for manual delegation (Mode 1)

Present all eight prompts to Patrik in a single message, each clearly labeled with:

- Section number and name (e.g., "Section 3 — Hidden-gem activity shortlist")
- Target tool (ChatGPT Pro / Perplexity Pro)
- The full prompt body in a fenced code block, paste-ready
- An "Expected output shape" one-liner so Patrik can spot-check before pasting back

End the message with:

```
Run each prompt in the indicated tool. Paste the result back here in a single block, labeled by section number. Optionally save raw outputs to trips/{slug}/dossier/{tool}-paste.md before pasting back.
```

Wait for Patrik's paste-back. Do NOT silently substitute Claude's own web search for any missed section (see `projects/personal/CLAUDE.md` § Subagent Delegation Default; this is Decision 6 in architecture.md — Mode 1 only at Phase 1).

### Step 5 — Ingest paste-back

Parse Patrik's pasted-back results. For each section:

- If the section is present and parseable, mark `SECTION_{n}_STATUS = received`.
- If the section is missing from the paste-back, mark `SECTION_{n}_STATUS = missing` — the dossier will note this section as incomplete; do not fabricate.
- If the section is present but malformed (e.g., wrong shape), mark `SECTION_{n}_STATUS = partial` — extract what is parseable, note the rest as incomplete.

Do not block on partial pastes. The dossier ships with whatever sections were received; Patrik can re-run individual prompts and re-paste if a section is too thin.

### Step 6 — Synthesize through profile + principles

For each received section, apply:

- **Anti-tourist filter.** Cross-check candidate places against principles. Remove or flag any place that triggers a mass-tourism signal (large tour-bus group, top-N TripAdvisor rank without a counter-signal, language Patrik's principles excluded).
- **Personalization filter.** For each candidate place, verify at least one PROFILE_EXTRACT preference is relevant. If no preference matches, demote or remove.
- **Routine integration check.** For Section 1 (Cool neighborhoods) and Section 2 (Accommodation area), verify proximity to work-friendly cafes and routine maintenance (gym / supermarket / coffee).

Record per section: which preferences were applied, which principles were enforced, and what was filtered out. This grounding data goes to the run log (Step 9), NOT to the dossier output (per D7).

### Step 7 — Format the dossier

Read `references/dossier-template.md` for the output structure. Produce the dossier following:

- Trip header block (destination, dates, theme, work-load, budget posture, weather check).
- Sections 1–8 in order, each with `## ` header, `---` divider before next, mobile-formatting rules.
- Place lines: `Name — Neighborhood, City — one-line why`.
- Missing/partial sections rendered as `## {n}. {Section name}\n\n_Section incomplete — re-run prompt {n} and re-paste._\n\n---`.
- No grounding evidence block (D7 — keep dossier clean).
- No external links inside section bodies. Sources/links go in a single optional `## Sources & Links` appendix at the end.

### Step 8 — Write the dossier

Write to `projects/personal/trips/{slug}/destination-dossier.md`. If the file already exists, write to `destination-dossier-v{n}.md` where `{n}` is the next integer after the highest existing version. Do not overwrite a prior dossier silently.

### Step 9 — Append to the run log

Append to `projects/personal/logs/dossier-runs.md` using the format spec in `logs/dossier-runs.md` itself. Required fields:

- Timestamp (`YYYY-MM-DD HH:MM` local)
- Trip slug
- Dossier output path written
- Profile version read (filename or git SHA — `unversioned` at Phase 1 since `profile/` is not yet versioned)
- Principles version read (same)
- PROFILE_EXTRACT — verbatim
- PRINCIPLES_EXTRACT — verbatim
- Per-section status — `{1: received, 2: missing, 3: partial, ...}`
- Per-section filtering notes — short bullets, what was filtered and why, for sections where filtering changed the output meaningfully
- Halt-or-flag notes — weather flag if fired, any other notable conditions

This is the grounding evidence Patrik will inspect after the run if he wants to verify the synthesis is real (per D7, grounding lives here, not in the dossier).

### Step 10 — Report back to the command shell

Return to the calling `/destination-dossier` command:

- Dossier path written
- Run-log entry written (with line number or section anchor)
- Status summary: "Sections received: X/8. Sections missing: {list}. Sections partial: {list}."
- Reminder: "Paste dossier into iPhone Notes section-by-section using `## ` headers as paste boundaries."

## What this workflow does NOT do (locked at Phase 1)

- No `WebSearch` or `WebFetch` from the orchestrator. Subagents (ChatGPT Pro / Perplexity Pro) handle external retrieval.
- No API calls to ChatGPT or Perplexity. Mode 1 only.
- No Google Maps or iPhone Notes integration. Format-only.
- No skill invocation (`ai-resources/skills/`) at runtime. Build-time aids only.
- No silent fabrication of missing sections. Missing means missing.

## Tuning notes (for post-first-trip retro)

After the first real-trip run, this file is the most likely place edits will land. Likely tuning axes:

- Section routing (which sections go to ChatGPT vs. Perplexity).
- Filtering strictness (anti-tourist threshold, personalization-match threshold).
- Halt 3 weather ceiling (currently flag-only; may promote to halt if Patrik finds 27°C+ trips never deliver).
- Run-log format (add fields the retro needs).
```

**Acceptance:** File exists at the path, ≈200 lines, opens with the title heading, ends with the "Tuning notes" section.

---

### Op 3 — CREATE `projects/personal/references/dossier-template.md`

**Purpose:** Define the destination dossier output structure and mobile-readability rules.

**Exact content:**

```markdown
# Destination Dossier — Output Template

This document specifies the structure of the destination dossier output. The `dossier-orchestrator` agent reads this at the format step. Tune section list and place-line format here — not in the agent.

Per Decision 7 (operator-confirmed in `pipeline/decisions.md`), the dossier output contains NO grounding evidence block. Grounding data is logged to `logs/dossier-runs.md`. The output stays clean.

## Trip header block (appears once at top)

```
# {Destination} — {Dates} — {Theme}

Work-load: {hours}h/week
Budget posture: ~€{floor}/day baseline; willing to splurge €{splurge_lo}–{splurge_hi}
Weather check: {forecast_max_celsius}°C max — {PASS | FLAGGED >27°C}
```

If `forecast_max_celsius` is unknown, render the weather line as `Weather check: forecast unknown — verify before booking`.

## Required sections (in order)

### 1. Cool neighborhoods

3–5 neighborhoods. Each is a short paragraph plus a one-line verdict:

```
**{Neighborhood name}** — {one-line vibe in 12–18 words}
Work-fit: {WiFi reliability / daytime cafe density / quiet-vs-buzz verdict}
```

### 2. Accommodation area recommendation

Single primary recommendation. Add a second only if there is a real tradeoff worth surfacing.

```
**Primary: {Neighborhood/area}** — {one-line why, grounded in Section 1 + routine maintenance proximity}
Why this beats {alternative}: {short rationale or "no real alternative — this is the clear pick"}
```

If a real tradeoff exists, add an `**Alternative: ...**` block with one-line tradeoff statement.

### 3. Hidden-gem activity shortlist

5–8 items. Each line is one place:

```
- **{Activity name}** — {Neighborhood}, {City} — {one-line why grounded in profile}
```

Anti-tourist filter applied. No item should be a top-5 TripAdvisor result without a counter-signal.

### 4. Food / restaurant shortlist

6–10 items. Mix of work-friendly daytime cafes and memorable dinners. Same line format as Section 3:

```
- **{Place name}** — {Neighborhood}, {City} — {one-line why}
```

Group within the section with two short subheads if helpful: `**Daytime / work-friendly:**` and `**Dinner / memorable:**`. Otherwise inline.

### 5. Tourist-trap warning list

4–6 named places to actively avoid. Each line:

```
- **{Place name}** — {one-line reason — what makes it a trap and what signal exposed it}
```

Example reason: "ranked #2 on TripAdvisor but Reddit + local food blogs flag as overpriced and slow."

### 6. Mobility recommendation

One-line verdict + cost estimate:

```
Verdict: {bike / scooter / transit pass / mix} for {trip duration}.
Estimated cost: €{N}/day.
Notes: {one-line on terrain, distances, weather fit for the verdict}.
```

### 7. Optimal-timing assessment

Are these dates good? Short paragraph (3–5 lines):

```
Dates {dates_start} to {dates_end}: {VERDICT — Good / Acceptable / Suboptimal}.
Weather check: {forecast summary, pass/flag}.
Local event signal: {festival / strike / holiday — Yes/No + one-line specifics}.
One-line verdict: {short final call}.
```

### 8. Music-vibe recommendation

1–2 lines of playlists / genres / artists matching the destination's local sound:

```
- {Playlist or genre or artist} — {one-line why this fits the destination}
- {Optional second}
```

Format so Patrik can copy the playlist or artist name straight into Spotify.

## Optional appendix

If links are useful, place them in ONE appendix at the very end:

```
## Sources & Links

- {Source / link with one-line context}
- {...}
```

No inline links inside section bodies.

## Mobile formatting rules (load-bearing)

1. **Max line length ≈ 80 characters.** Wrap manually if needed.
2. **No tables.** No `|---|` syntax anywhere in the output.
3. **Section headers always `## `.** Subheads inside sections use `**bold**` paragraph leads, not deeper heading levels (no `### ` or `#### `).
4. **Every section ends with `---` on its own line** before the next section header. This makes the boundary visible when scrolling on iPhone.
5. **Place lines always carry `Name — Neighborhood, City`.** This is Google-Maps-searchable as-is.
6. **No abbreviations Patrik would have to decode mid-trip.** Spell out "neighborhood," "approximately," etc.
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

Filename is `destination-dossier.md` for the first run. Re-runs write `destination-dossier-v2.md`, `destination-dossier-v3.md`, etc. The original is never overwritten.

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

## 3. Hidden-gem activity shortlist

- **{Place}** — {Neighborhood}, Lisbon — {one-line why}
- **{Place}** — {Neighborhood}, Lisbon — {one-line why}

---

(... sections 4–8 follow same pattern ...)

## Sources & Links

- {Source} — {one-line context}
```
```

**Acceptance:** File exists, ≈150 lines, opens with the title heading and the D7 note, ends with the rendered skeleton example.

---

### Op 4 — CREATE `projects/personal/references/subagent-prompts.md`

**Purpose:** Library of eight handoff prompt templates — one per dossier section. The `dossier-orchestrator` instantiates each by placeholder substitution and presents them to Patrik for Mode-1 manual execution.

**Exact content:**

```markdown
# Subagent Handoff Prompts — Destination Dossier

Library of eight prompt templates, one per dossier section. The `dossier-orchestrator` agent reads this file at the delegation-prompt-generation step (Step 3 of `dossier-workflow.md`), substitutes placeholders, and presents the prompts to Patrik for manual execution in the target tool.

**Mode 1 only at Phase 1.** Patrik runs each prompt in the named target tool (ChatGPT Pro or Perplexity Pro), pastes the result back, and the orchestrator ingests.

## Placeholders (substituted by the orchestrator)

- `{destination}` — city / country.
- `{dates}` — `YYYY-MM-DD to YYYY-MM-DD`.
- `{theme}` — trip theme (e.g., "anti-tourist remote-work").
- `{work_load}` — hours/week of remote work during trip.
- `{budget_floor}` — daily baseline in euros.
- `{budget_splurge_lo}`, `{budget_splurge_hi}` — splurge range in euros.
- `{profile_extract}` — 3–5 bullet preferences from the universal traveler profile, most relevant to this trip.
- `{principles_extract}` — bulleted principles that apply to this trip's sections.

## Anti-tourist guardrail (boilerplate, embedded in every prompt)

Every prompt below ends with this guardrail block. Substitute `{section_name}` per prompt.

```
Hard filters on your recommendations:
- Exclude any place that is a top-5 TripAdvisor result for {destination} unless you can name a specific counter-signal (e.g., locals still go, or a niche reason it survived its popularity).
- Exclude any place whose primary visitor base is tour groups, cruise-ship day-trippers, or guided-tour buses.
- Prefer places named in Reddit local subs, local food/culture blogs, residents' recommendations, and small independent guides over places named in Lonely Planet, Time Out top-10s, and "best of {destination}" listicles.
- For every place you include, name the specific signal that made you keep it.

Output the {section_name} as a numbered list. For each item: name — neighborhood, {destination} — one-line why (grounded in the profile preferences above), and the specific signal that surfaced it (e.g., "Reddit r/lisbon thread X, locals praised consistency").
```

---

## Prompt 1 — Cool neighborhoods

**Target tool:** ChatGPT Pro (wide ideation, prior-knowledge-rich).

**Expected output shape:** Numbered list of 3–5 neighborhoods. Each: name, one-line vibe (12–18 words), work-fit verdict (WiFi / daytime cafe density / quiet-vs-buzz).

**Prompt body:**

```
I'm planning a {trip_duration_weeks}-week solo trip to {destination} from {dates}, theme "{theme}". I will be working remotely about {work_load} hours/week during the trip. Budget is ~€{budget_floor}/day baseline, willing to splurge €{budget_splurge_lo}–{budget_splurge_hi} on standout experiences.

My traveler profile (read this carefully — it must drive your recommendations):

{profile_extract}

My travel principles (these are non-negotiable filters):

{principles_extract}

Task: Give me 3–5 neighborhoods in {destination} I should consider as my base or main hangout zones. For each:
- Name
- One-line vibe (12–18 words, what it feels like, what crowd it attracts)
- Work-fit verdict: WiFi reliability for remote work, daytime cafe density (am I likely to find a cafe with reliable WiFi to work in for 3–4 hours?), quiet-vs-buzz balance

{anti_tourist_guardrail with section_name = "neighborhoods list"}
```

---

## Prompt 2 — Accommodation area recommendation

**Target tool:** ChatGPT Pro.

**Expected output shape:** Primary recommendation (single area) with rationale. Optional alternative if a real tradeoff exists.

**Prompt body:**

```
For a {trip_duration_weeks}-week solo trip to {destination} from {dates}, working {work_load}h/week remotely, baseline ~€{budget_floor}/day:

Given these candidate neighborhoods I've shortlisted (treat as inputs — I'll paste my full neighborhood list back to you if useful, but for now reason from {destination} general knowledge): {profile_extract_one_liner}

Recommend ONE primary area to stay in. Reason from:
- Proximity to good work-cafes (Section 1 will identify these but cross-reference your own knowledge)
- Routine maintenance: walking distance to a gym or running route, a supermarket, a reliable morning coffee spot
- Distance from the most touristy zones (I want easy access to but not residence inside them)
- Realistic accommodation cost in the €{budget_floor}/day baseline range (apartment rental, not hostel)

If there is a real tradeoff between two areas (e.g., quieter vs. more central), name an alternative with the tradeoff stated in one line. If there's no real tradeoff, say so explicitly.

My profile:
{profile_extract}

My principles:
{principles_extract}

{anti_tourist_guardrail with section_name = "accommodation area"}
```

---

## Prompt 3 — Hidden-gem activity shortlist

**Target tool:** Perplexity Pro (source-grounded, current).

**Expected output shape:** Numbered list of 5–8 activities. Each: name — neighborhood, {destination} — one-line why — surfacing signal.

**Prompt body:**

```
I'm planning a solo trip to {destination} from {dates}, theme "{theme}". I work {work_load}h/week remotely during the trip, so activities run mostly evenings, weekends, and 2–3 hour midday windows.

Profile (drives selection):
{profile_extract}

Principles:
{principles_extract}

Task: Give me 5–8 hidden-gem activities in {destination}. By "hidden gem" I mean: not the top-of-list tourist experiences, but specific places or experiences locals or repeat visitors recommend. Include a mix of:
- A few that fit a 2–3 hour midday window (workable around my work schedule)
- A few that fit evening or weekend slots
- At least one that is meaningfully tied to {theme}

For each item, include the specific source signal that surfaced it (Reddit thread, local blog, resident interview, niche guide — name it). Cite sources where you can.

{anti_tourist_guardrail with section_name = "hidden-gem activity shortlist"}
```

---

## Prompt 4 — Food / restaurant shortlist

**Target tool:** Perplexity Pro.

**Expected output shape:** 6–10 places, grouped roughly into daytime/work-friendly and dinner/memorable. Each: name — neighborhood, {destination} — one-line why — surfacing signal.

**Prompt body:**

```
Solo trip to {destination}, {dates}. Working {work_load}h/week remotely. Baseline budget ~€{budget_floor}/day; willing to splurge €{budget_splurge_lo}–{budget_splurge_hi} on a standout dinner.

Profile:
{profile_extract}

Principles:
{principles_extract}

Task: Give me 6–10 food/restaurant recommendations in {destination}, mixing:
- Daytime / work-friendly: cafes I can work from for 2–3 hours (good WiFi, OK with a laptop), good coffee, reasonable lunch.
- Dinner / memorable: places worth a real dinner — local specialty, neighborhood favorite, or a justified splurge in the €{budget_splurge_lo}–{budget_splurge_hi} range.

For each: name, neighborhood, one-line why (tied to profile), and the source signal that surfaced it (Reddit, local food blog, resident recs — name it).

{anti_tourist_guardrail with section_name = "food/restaurant shortlist"}
```

---

## Prompt 5 — Tourist-trap warning list

**Target tool:** Perplexity Pro (real-time signal aggregation, current reviews).

**Expected output shape:** 4–6 named places to actively avoid. Each: name — one-line reason (specific signal exposing it as a trap).

**Prompt body:**

```
Solo trip to {destination}, {dates}. I want an "early warning system" — places I should ACTIVELY avoid because they are tourist traps despite being highly visible in conventional travel guides.

Profile:
{profile_extract}

Principles:
{principles_extract}

Task: Give me 4–6 named places (restaurants, attractions, neighborhoods, tours) in {destination} that I should NOT visit, and for each, name the specific signal that exposes it as a trap. Examples of valid signals:
- "Ranked #2 on TripAdvisor but Reddit r/{destination} and local food blogs consistently flag as overpriced and slow."
- "Marketed as a 'traditional X experience' but is a recent tourist-circuit operation; locals don't go."
- "Charges a premium for a view available free 200m away."

Be specific. Do not list "the main square" or "the touristy old town" — list named places with named signals.

{anti_tourist_guardrail with section_name = "tourist-trap warning list"}
```

---

## Prompt 6 — Mobility recommendation

**Target tool:** ChatGPT Pro.

**Expected output shape:** One-line verdict (bike / scooter / transit pass / mix) + estimated daily cost + 1–2 line notes on terrain, weather fit.

**Prompt body:**

```
Solo trip to {destination}, {dates}, {trip_duration_weeks} weeks total. I will move between my accommodation, work cafes, evening activities, and weekend explorations.

Profile:
{profile_extract}

Principles:
{principles_extract}

Task: Recommend a mobility approach. Pick ONE of: rented bike, rented scooter, public transit pass, mix (specify), walking-only (specify). Then give me:
- Estimated cost per day in euros for your recommendation
- A 1–2 line note on why it fits {destination} (terrain, weather in {dates}, distances, whether locals predominantly use this mode)

Be concrete. Don't say "depends on what you do." Make a single primary recommendation and name the strongest counter-argument so I can judge for myself.

{anti_tourist_guardrail with section_name = "mobility recommendation"}
```

---

## Prompt 7 — Optimal-timing assessment

**Target tool:** Perplexity Pro (current weather, current events, real-time signals).

**Expected output shape:** Short paragraph (3–5 lines). Verdict on the dates + weather check + local-event signal + one-line final verdict.

**Prompt body:**

```
I am planning a solo trip to {destination} from {dates}. Hard constraint: I avoid destinations whose forecast max in the trip window is above 27°C.

Task: Assess whether {dates} is a good window for {destination}. Tell me:
1. Expected weather: high/low temperatures, rainfall, humidity for the date window. Pass or flag the 27°C ceiling.
2. Local event signal: any major festivals, holidays, strikes, or events in {destination} during {dates} that would meaningfully change my experience (positive or negative). Be specific — name the event, dates, and impact.
3. One-line verdict: are these dates GOOD, ACCEPTABLE, or SUBOPTIMAL for {destination}, given the weather and event signal?

Cite sources for any current-events claim (weather services, official event calendars, local news).
```

(This prompt deliberately does not include the anti-tourist guardrail — it is about timing, not place curation.)

---

## Prompt 8 — Music-vibe recommendation

**Target tool:** ChatGPT Pro.

**Expected output shape:** 1–2 lines: a playlist name / genre / artist matching the destination's local sound, copyable straight into Spotify.

**Prompt body:**

```
Solo trip to {destination}, {dates}, theme "{theme}".

Profile:
{profile_extract}

Task: Recommend 1–2 playlists, genres, or artists that capture {destination}'s local sound or vibe — paste-ready into Spotify. Prefer:
- Real local artists, contemporary or canonical, over "music inspired by {destination}" compilations.
- One option that's "essential local sound" (what residents listen to) and one that's "atmospheric fit for the trip theme" (matches {theme}).

Just 1–2 lines. Name + one-line why. No extended explanation.
```

---

## Routing summary (which prompt → which tool)

| Prompt | Section | Target |
|---|---|---|
| 1 | Cool neighborhoods | ChatGPT Pro |
| 2 | Accommodation area | ChatGPT Pro |
| 3 | Hidden-gem activities | Perplexity Pro |
| 4 | Food / restaurants | Perplexity Pro |
| 5 | Tourist-trap warnings | Perplexity Pro |
| 6 | Mobility | ChatGPT Pro |
| 7 | Optimal timing | Perplexity Pro |
| 8 | Music vibe | ChatGPT Pro |

Routing rationale: ChatGPT Pro for ideation / synthesis / prior-knowledge-heavy sections; Perplexity Pro for current-source-cited sections (food trends, current event signals, real-time trap signals from Reddit and local blogs). Tune after first-trip retro.

## Tuning notes

After first real trip, expect to tune:

- The anti-tourist guardrail (strictness, signal sources to prefer).
- Section-to-tool routing (e.g., maybe Section 1 also benefits from Perplexity for current-cafe-WiFi signals).
- Prompt length (these are long; trim if a prompt consistently produces noise).
- Output-shape specs (if paste-back is consistently malformed for a section, the prompt's output spec needs tightening).
```

**Acceptance:** File exists, ≈250 lines, eight prompts present in numbered order, routing table at end.

---

### Op 5 — CREATE `projects/personal/.claude/agents/dossier-orchestrator.md`

**Purpose:** Define the orchestrator agent that executes the workflow.

**Pre-action:** The path `projects/personal/.claude/agents/` already exists (verified in repo-snapshot — auto-synced from ai-resources). The new file is project-local; Op 8 (manifest update) prevents the auto-sync hook from removing it.

**Exact content:**

```markdown
---
name: dossier-orchestrator
description: Orchestrates the destination-dossier workflow for the personal travel planning system. Reads profile + principles + trip context, generates eight subagent handoff prompts (Mode 1 manual delegation), pauses for Patrik's paste-back, synthesizes through the personalization spine, formats per the dossier template, writes the dossier to trips/{slug}/, and appends a run record to logs/dossier-runs.md. Project-local to projects/personal/.
model: sonnet
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

You are the **dossier-orchestrator** for Patrik's personal travel planning system. You execute the workflow defined in `projects/personal/references/dossier-workflow.md` and produce the destination dossier for a named trip. You are project-local to `projects/personal/` at Phase 1.

## Your Tools

- **Read, Glob, Grep** — for reading the profile, principles, trip context, references, and any paste-back content. Broad scope across `projects/personal/` and `ai-resources/` (via workspace `additionalDirectories`).
- **Write** — scoped to `projects/personal/trips/{slug}/`, `projects/personal/logs/`, and `projects/personal/outputs/`. NEVER write outside these paths.
- **Edit** — same scope as Write. Used only when appending to `logs/dossier-runs.md` is more appropriate as an Edit than a Write.

You do NOT have `Bash`, `WebFetch`, `WebSearch`, or `Task`. Subagents (ChatGPT Pro / Perplexity Pro) handle external retrieval — you generate prompts and ingest paste-back. You do not substitute your own web search for missed paste-backs (per `projects/personal/CLAUDE.md` § Subagent Delegation Default).

## Your Procedure (every invocation)

The calling command (`/destination-dossier`) passes you a brief containing:

- `{slug}` — the trip slug (e.g., `lisbon-2026-06`).
- Optional: paste-back content if the operator is re-invoking you mid-flow with subagent results.

### Phase A — Pre-flight (every invocation)

1. **Read** `projects/personal/references/dossier-workflow.md` — this is your contract. Follow its sequence exactly.
2. **Read** `projects/personal/references/dossier-template.md` — output structure.
3. **Read** `projects/personal/references/subagent-prompts.md` — prompt library.

If any of the three references is missing, halt and report:

```
Required reference missing: {path}.
The dossier workflow cannot run without all three references in projects/personal/references/.
```

### Phase B — Personalization Spine Gate (Halt 1)

Per `dossier-workflow.md` Halt 1:

1. **Read** `projects/personal/profile/universal-traveler-profile.md`.
2. **Read** `projects/personal/profile/travel-principles.md`.
3. If either file is empty, missing, or contains only the placeholder header (no populated content sections), halt with the message specified in `dossier-workflow.md` § Halt 1.

Do not proceed past this gate. Generic-fallback output is forbidden.

### Phase C — Trip context load (Halt 2)

1. **Read** `projects/personal/trips/{slug}/trip-context.md`.
2. If missing, halt with the Halt 2 message.
3. If frontmatter lacks any of: `destination`, `dates_start`, `dates_end`, `theme`, `work_load_hours_per_week` — halt with Halt 2 listing the missing fields.

### Phase D — Workflow execution

Follow Steps 1–10 of `dossier-workflow.md` exactly. Key load-bearing behaviors:

- **Step 3 (prompt generation):** substitute placeholders in the prompts from `subagent-prompts.md`. Do not improvise prompt bodies.
- **Step 4 (pause):** present all eight prompts in a single message, each labeled with section number, target tool, and expected output shape. End with the "paste back" instruction. Stop and wait. Do not generate dossier content until Patrik responds.
- **Step 5 (ingest):** parse paste-back conservatively. Mark missing/partial sections; never fabricate.
- **Step 6 (synthesize):** apply anti-tourist filter, personalization filter, routine integration check. Record what you filtered out — this data goes to the run log, not the dossier (per Decision 7 in `pipeline/decisions.md`).
- **Step 7 (format):** follow `dossier-template.md`. NO grounding evidence block in the output.
- **Step 8 (write dossier):** write to `trips/{slug}/destination-dossier.md` (or `-v{n}.md` if a prior version exists). Do not overwrite.
- **Step 9 (run log):** append a run record to `logs/dossier-runs.md`. Use the format in that file's header. Grounding evidence (preferences applied, principles enforced, what was filtered) lives HERE.
- **Step 10 (report):** return path + status summary to the command shell.

### Phase E — Failure handling

If anything in Phase D fails mid-flow (e.g., write fails, paste-back is uninterpretable), do not silently produce a partial dossier. Stop, report what failed, and ask Patrik whether to retry, skip the failing step, or abort.

## What you do NOT do

- Do not invoke `WebSearch`, `WebFetch`, or `Bash`. These are not in your tool list.
- Do not write outside `trips/{slug}/`, `logs/`, `outputs/`.
- Do not modify profile/principles files. They are read-only at Phase 1; updates happen via Phase 3 retro.
- Do not invoke any slash command. Slash commands cannot be called from within an agent.
- Do not silently fabricate missing sections. Mark them incomplete and let Patrik re-run the prompt.

## Voice and output style

Internal status messages (during the pause-and-ingest dance) are short and operational — bullet points, no preamble. The dossier itself follows `dossier-template.md` exactly — no commentary, no "here is your dossier" preamble.

When you halt on a gate, the halt message is verbatim from the workflow doc — do not paraphrase.
```

**Acceptance:** File exists at the path, opens with valid YAML frontmatter (5 fields: `name`, `description`, `model`, `tools`), agent body follows the 5-phase structure (Pre-flight, Spine Gate, Trip Context, Workflow, Failure).

---

### Op 6 — CREATE `projects/personal/.claude/commands/trip-init.md`

**Purpose:** Thin command shell that scaffolds a per-trip directory.

**Exact content:**

```markdown
---
description: Scaffold a per-trip directory under projects/personal/trips/. Creates trip-context.md (with YAML frontmatter for destination, dates, theme, work-load, budget), an empty journal.md, and a dossier/ subdirectory placeholder. Slug format is {destination-kebab}-{YYYY-MM}.
model: sonnet
---

Scaffold a per-trip directory. Mechanical — creates a directory and one templated file. Run this before `/destination-dossier`.

Input: `$ARGUMENTS` — free-text arguments. Expected forms:

- `/trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"`
- `/trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work" --work-load 30 --budget-floor 60`

Positional order: `{destination} {dates_start} {dates_end} {theme}`. Optional flags: `--work-load {hours}`, `--budget-floor {eur}`, `--budget-splurge-lo {eur}`, `--budget-splurge-hi {eur}`, `--forecast-max {celsius}`.

---

### Step 1 — Parse arguments

Parse `$ARGUMENTS` into:

- `DESTINATION` — first token (string, may include hyphens; no spaces unless quoted).
- `DATES_START` — second token (YYYY-MM-DD).
- `DATES_END` — third token (YYYY-MM-DD).
- `THEME` — remaining positional tokens before any `--` flag, joined with spaces, with surrounding quotes stripped.
- Optional flags: `WORK_LOAD` (default 25), `BUDGET_FLOOR` (default 50), `BUDGET_SPLURGE_LO` (default 100), `BUDGET_SPLURGE_HI` (default 150), `FORECAST_MAX` (default `unknown`).

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
created: {TODAY in YYYY-MM-DD}
slug: {SLUG}
---

# Trip Context — {DESTINATION} ({DATES_START} to {DATES_END})

## Notes

(Add free-text notes about this trip here — anything that should color the dossier and day plans. Examples: travel companions if any, specific things you want to do or avoid, work-load specifics for this trip.)
```

**2. `journal.md`** with this content:

```
# Trip Journal — {DESTINATION} ({DATES_START} to {DATES_END})

Daily notes during the trip. Free-form. Used by the Phase 3 retro to update profile and principles.

## Day 1 — {DATES_START}

(Start writing here once the trip begins.)
```

**3. Empty `dossier/` subdirectory** (placeholder for raw subagent paste archives if Patrik wants to save them).

### Step 4 — Report

Return to Patrik:

```
Trip scaffolded.

Slug: {SLUG}
Path: projects/personal/trips/{SLUG}/

Files created:
- trip-context.md   (edit to add free-text notes)
- journal.md        (write daily notes during the trip)
- dossier/          (optional: save raw subagent pastes here when running /destination-dossier)

Next: run /destination-dossier --trip {SLUG} when the profile and principles are populated. (Phase 0 prerequisite — see projects/personal/CLAUDE.md § Personalization Spine Gate.)
```

---

### Notes for the executor

- This command writes files but does not read profile/principles (they are not needed for scaffolding). The Personalization Spine Gate fires on `/destination-dossier`, not here.
- The scaffolding template is intentionally minimal. Patrik fills in free-text notes in `trip-context.md` before running the dossier command.
- No agent delegation. This is a thin command — directory create + one templated write + reporting.
```

**Acceptance:** File exists, opens with `model: sonnet` frontmatter, contains the four numbered steps and the executor notes.

---

### Op 7 — CREATE `projects/personal/.claude/commands/destination-dossier.md`

**Purpose:** Thin command shell that invokes the `dossier-orchestrator` agent.

**Exact content:**

```markdown
---
description: Generate a destination dossier for a named trip — runs the dossier-orchestrator agent against trips/{slug}/trip-context.md. Produces an iPhone-paste-ready dossier with eight sections (neighborhoods, accommodation, hidden gems, food, tourist-trap warnings, mobility, optimal timing, music vibe). Mode 1 manual subagent delegation (ChatGPT Pro / Perplexity Pro handoff prompts). Halts on empty profile/principles.
model: opus
---

Generate a destination dossier for a named trip. Delegates to the `dossier-orchestrator` agent (Sonnet); the agent reads the personalization spine + trip context + workflow references, generates eight handoff prompts for ChatGPT Pro and Perplexity Pro, pauses for Patrik to run them manually and paste results back, synthesizes through profile + principles, formats per the dossier template, writes the dossier to `trips/{slug}/destination-dossier.md`, and logs the run grounding to `logs/dossier-runs.md`.

Input: `$ARGUMENTS` — optional. Forms:

- `/destination-dossier` — picks the most recently created `trips/{slug}/` directory.
- `/destination-dossier --trip lisbon-2026-06` — explicit slug.
- `/destination-dossier --trip lisbon-2026-06 --resume` — resume after paste-back if you ran the command, exited, and want to feed paste-back later.

---

### Step 1 — Resolve the trip slug

1. If `$ARGUMENTS` includes `--trip {slug}`, set `SLUG = {slug}`.
2. Otherwise, glob `projects/personal/trips/*/` and pick the directory with the most recent mtime. Set `SLUG` to that directory name.
3. If `projects/personal/trips/` is empty, abort with:

```
No trips found in projects/personal/trips/. Run /trip-init first.
Example: /trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"
```

4. Verify `projects/personal/trips/{SLUG}/trip-context.md` exists. If not, abort with:

```
Trip context missing at projects/personal/trips/{SLUG}/trip-context.md.
Run /trip-init for this trip, or correct the --trip slug.
```

### Step 2 — Spine pre-check (cheap fail-fast)

Read the first 10 lines of each of:
- `projects/personal/profile/universal-traveler-profile.md`
- `projects/personal/profile/travel-principles.md`

If either file is empty, contains only an unpopulated placeholder header, or does not exist, abort with:

```
Personalization Spine Gate — Phase 0 prerequisite not met.

Empty or missing:
- {path that failed}
- {second path if also failed}

Populate both profile files before running /destination-dossier. See projects/personal/CLAUDE.md § Personalization Spine Gate.
```

This is the cheap version of the gate; the orchestrator agent re-checks more thoroughly in Phase B of its procedure. The redundancy is intentional — it fails fast without spinning up the agent.

### Step 3 — Delegate to the `dossier-orchestrator` agent

Spawn the `dossier-orchestrator` subagent via the `Task` tool with this brief:

```
You are the dossier-orchestrator. Execute the destination-dossier workflow per references/dossier-workflow.md.

Trip slug: {SLUG}
Trip context path: projects/personal/trips/{SLUG}/trip-context.md

Apply the procedure in your agent definition. Halt on Personalization Spine Gate failure (Halt 1), trip context invalid (Halt 2), or weather ceiling flag (flag-only, not a halt).

When you reach Step 4 (pause for manual delegation), surface the eight handoff prompts to the operator and stop. The operator will run them and paste back.
```

Wait for the agent. If the agent halts on a gate, return its halt message to Patrik unmodified.

### Step 4 — Relay agent output

When the agent completes (or pauses), return its output to Patrik unmodified. Do not summarize the prompts; do not paraphrase the halt messages. The agent's voice is the orchestrator voice.

If the agent reports completion (Step 10 of the workflow), forward its status summary and add this one-line reminder:

```
Paste the dossier into iPhone Notes section by section. Use the ## headers as paste boundaries — each section is independently paste-ready.
```

---

### Notes for the executor

- This is a thin command shell. Workflow logic lives in `dossier-orchestrator` and `references/dossier-workflow.md`.
- The command's model is Opus per `ai-resources/docs/agent-tier-table.md` (synthesis is judgment-heavy). The agent itself is Sonnet (mechanical orchestration). If first-trip output is shallow, escalate the agent to Opus in retro (architecture.md Decision 4).
- The redundant spine pre-check in Step 2 is a fail-fast optimization. It does not replace the agent's own Phase B gate — both must pass.
- No `--resume` implementation at Phase 1; if Patrik exits mid-flow and wants to resume, he re-runs the command and pastes prior results into the new prompt-and-pause cycle. Promote to a real `--resume` flag if friction is high after the first real trip.
```

**Acceptance:** File exists, `model: opus` in frontmatter, four numbered steps + executor notes.

---

### Op 8 — MODIFY `projects/personal/.claude/shared-manifest.json`

**Type:** Replace the JSON content entirely (small file).

**Exact new content:**

```json
{
  "_doc": "Lists project-owned files under .local. The auto-sync hook symlinks every other file from ai-resources/.claude/{commands,agents}/ on session start.",
  "commands": { "local": ["trip-init", "destination-dossier"] },
  "agents": { "local": ["dossier-orchestrator"] }
}
```

**Acceptance:** Valid JSON. `commands.local` array has 2 entries. `agents.local` array has 1 entry. Filename suffixes (`.md`) are NOT included in array entries — names only, matching the sibling-project pattern.

---

### Op 9 — CREATE `projects/personal/logs/dossier-runs.md`

**Purpose:** Append-only run log with format header. `dossier-orchestrator` appends one entry per run.

**Exact content:**

```markdown
# Destination Dossier — Run Log

Append-only log of `/destination-dossier` runs. The `dossier-orchestrator` agent appends one entry per run at Step 9 of the workflow.

Per Decision 7 (operator-confirmed in `pipeline/decisions.md`), this file is where grounding evidence lives — what preferences were applied, what principles enforced, what was filtered out per section. The dossier output itself stays clean of grounding meta-content.

## Entry format

Each entry is a `## ` section. The format is:

```
## {YYYY-MM-DD HH:MM} — {slug}

- **Dossier written:** projects/personal/trips/{slug}/destination-dossier.md (or -v{n}.md)
- **Profile version read:** {filename or git SHA, or `unversioned` at Phase 1}
- **Principles version read:** {same}
- **PROFILE_EXTRACT** (preferences applied):
  - {bullet 1}
  - {bullet 2}
  - {...3–5 bullets}
- **PRINCIPLES_EXTRACT** (principles enforced):
  - {bullet 1}
  - {bullet 2}
- **Section status:**
  - 1. Cool neighborhoods — {received|partial|missing}
  - 2. Accommodation area — {received|partial|missing}
  - 3. Hidden-gem activities — {received|partial|missing}
  - 4. Food / restaurants — {received|partial|missing}
  - 5. Tourist-trap warnings — {received|partial|missing}
  - 6. Mobility — {received|partial|missing}
  - 7. Optimal timing — {received|partial|missing}
  - 8. Music vibe — {received|partial|missing}
- **Filtering notes** (sections where filter changed the output meaningfully):
  - Section {n}: {one-line on what was filtered and why}
  - {...}
- **Halt / flag notes:**
  - {weather flag if fired; otherwise omit}
  - {other notable conditions}

---
```

Entries are listed in chronological order (most recent at bottom). Do not edit or delete prior entries — this log is append-only and feeds the Phase 3 retro and Phase 5 friction analysis.

## Runs

(No runs yet. The first /destination-dossier invocation will append the first entry below.)
```

**Acceptance:** File exists, header explains the D7 grounding decision, entry format is fully specified as a code block, "Runs" section is empty with a placeholder note.

---

## 5. Post-flight verification (Stage 4 must run before announcing completion)

After all 9 operations:

1. `ls projects/personal/.claude/commands/trip-init.md projects/personal/.claude/commands/destination-dossier.md projects/personal/.claude/agents/dossier-orchestrator.md` — all three files exist.
2. `ls projects/personal/references/` — exactly three files: `dossier-workflow.md`, `dossier-template.md`, `subagent-prompts.md`.
3. `ls projects/personal/logs/dossier-runs.md` — file exists.
4. `cat projects/personal/.claude/shared-manifest.json | python3 -c "import json, sys; d=json.load(sys.stdin); assert d['commands']['local']==['trip-init','destination-dossier']; assert d['agents']['local']==['dossier-orchestrator']; print('manifest OK')"` — JSON valid and arrays correct.
5. `grep -c "Workflow References" projects/personal/CLAUDE.md` — returns 1 (the new pointer block exists).
6. `grep -c "Trip Directory Convention" projects/personal/CLAUDE.md` — returns 1.
7. Spot-check that the dossier-template.md does NOT contain any "Personalization grounding" heading or "grounding evidence" phrase — this is the D7 enforcement (the original architecture spec had a grounding block; it must NOT be in the template per the operator decision).
8. Spot-check that `logs/dossier-runs.md` DOES contain the phrase "grounding evidence lives" (the D7 redirection).

All eight checks must pass before announcing Stage 4 complete. If any fail, fix before announcing.

---

## 6. Stage 4 announcement template (after all ops complete and verified)

```
Stage 4 complete. 9 operations executed.

Created:
- projects/personal/references/dossier-workflow.md
- projects/personal/references/dossier-template.md
- projects/personal/references/subagent-prompts.md
- projects/personal/.claude/agents/dossier-orchestrator.md
- projects/personal/.claude/commands/trip-init.md
- projects/personal/.claude/commands/destination-dossier.md
- projects/personal/logs/dossier-runs.md

Modified:
- projects/personal/CLAUDE.md (added Workflow References + Trip Directory Convention pointer blocks)
- projects/personal/.claude/shared-manifest.json (registered 2 commands and 1 agent as local)

D7 (no grounding evidence in dossier output) applied: dossier-template.md has no grounding block; grounding lives in logs/dossier-runs.md.

Phase 0 prerequisite still outstanding: profile/universal-traveler-profile.md and profile/travel-principles.md are empty placeholders. The first /destination-dossier run will halt at the Personalization Spine Gate until both are populated.

Say NEXT to advance to Stage 5 (Verification).
```

---

## 7. Open items / unresolved at end of Stage 3c

None. All architecture decisions are either operator-confirmed (D7) or mechanically dictated by architecture.md and applied here as-is. Stage 4 should proceed without re-reading the architecture document — all needed content is in §4 above.

**Items intentionally deferred to first-trip retro** (not blockers for Stage 4):

- Agent tier: Sonnet at Phase 1; escalate to Opus if synthesis is shallow (architecture.md D4).
- Section-to-tool routing: starting heuristic in `subagent-prompts.md`; tune after first paste-back round.
- Anti-tourist filter strictness: starting in the guardrail block; tune after real-trip use.
- `--resume` flag for `/destination-dossier`: not implemented; promote to real flag if mid-flow exit is a common failure mode.

---

**End of implementation spec.**
