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

1. **Max line length approximately 80 characters.** Wrap manually if needed.
2. **No tables.** No `|---|` syntax anywhere in the output.
3. **Section headers always `## `.** Subheads inside sections use `**bold**` paragraph leads,
   not deeper heading levels (no `### ` or `#### `).
4. **Every section ends with `---` on its own line** before the next section header.
   This makes the boundary visible when scrolling on iPhone.
5. **Place lines always carry `Name — Neighborhood, City`.** This is
   Google-Maps-searchable as-is. For multi-stop trips, include the stop
   name when needed to disambiguate: `Name — Neighborhood, Berat`.
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

## 3. Hidden-gem activity shortlist

- **{Place}** — {Neighborhood}, Lisbon — {one-line why}
- **{Place}** — {Neighborhood}, Lisbon — {one-line why}

---

(... sections 4–8 follow same pattern ...)

## Sources & Links

- {Source} — {one-line context}
```
