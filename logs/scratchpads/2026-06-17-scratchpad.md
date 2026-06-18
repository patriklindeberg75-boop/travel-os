# Continuity Scratchpad — 2026-06-17 (Bulgaria dossier, mid Pass-4)

## What this session did
Tested the Phase-1 dossier workflow end-to-end from zero on a NEW trip:
**Bulgaria western loop, 2026-06-22 to 2026-06-29, solo, 7 nights.**
Route locked: **Sofia 2n → Bansko 3n (arrive via Septemvri–Dobrinishte scenic
narrow-gauge train) → Rila/Panichishte 2n → depart Sofia Jun 29.**

Ran the three workflow commands in order:
- `/destination-check` → CONDITIONAL verdict (weather ceiling waived by operator;
  the Jun 27-28 weekend collides Seven Lakes crowds + Sofia Live Festival).
- `/trip-init` → scaffolded `trips/bulgaria-2026-06/`; timing prompt parsed
  (SUBOPTIMAL, crowding-driven, max 32°C Plovdiv informational).
- `/destination-dossier` → ran the 5-pass funnel via the dossier-orchestrator.

## Dossier progress (where the funnel stands)
- **Pass 2 (Locations): DONE.** `dossier/pass-2-state.md`. Variant route chosen
  (Plovdiv/Kapana dropped to keep the full train ride + Bansko). Operator relaxed
  the anti-tourist filter (Seven Lakes weekend OK) and self-manages work timing.
- **Pass 3 (Activities): DONE.** `dossier/pass-3-state.md`. Primary list + a
  targeted top-up addendum merged (Sofia city-culture + Vitosha; Bansko 2nd hike
  + old town). Option-clusters (Sofia morning hike vs springs; Bansko 2nd hike
  Vihren/Banderishki/Demyanitsa) left as ON-THE-GROUND choices per operator.
- **Pass 4 (Food): IN PROGRESS, reordered.** Split into 4a (dishes) + 4b (venues).
  - 4a DONE: `dossier/pass-4a-dishes.md` written (21 dishes, 16 in target set,
    mapped per stop).
  - 4b NOT RUN: the venue prompt is drafted and was presented in chat, targeting
    the per-stop dishes, ~€5/meal target, €10-12 hard cap, no splurge, Bansko
    anti-resort-pricing. **Awaiting operator paste-back of the 4b Perplexity run.**

## Resume With
1. **Answer the open question:** target a Sofia tripe-soup (shkembe chorba / offal)
   venue in the 4b search, or skip it? (operator hasn't answered)
2. **Run Pass 4b:** operator pastes the 4b venue prompt into Perplexity Pro and
   pastes results back; orchestrator triages → writes `pass-4-state.md`.
3. **Then Pass 5** (practicalities: accommodation/sleep + inter-stop transport +
   local mobility) — carries forward #8 Avalon Co-Living (Bansko base) and #14
   Panichishte arrival logistics flagged during Pass 3.
4. **Then synthesis** → the orchestrator writes the 8-section dossier to
   `trips/bulgaria-2026-06/destination-dossier.md` + logs the run.

## Orchestrator agent thread
The dossier-orchestrator was driven via a chain of SendMessage agent calls.
The last live agentId was `af122736915d16bad` (post 4b-prompt). A fresh session
can simply re-invoke `/destination-dossier --trip bulgaria-2026-06` — it
auto-resumes from the `dossier/pass-*-state.md` files (Pass 2 + 3 done, 4a done),
so it will pick up at Pass 4b.

## Also done this session
- Logged a red-team finding (committed): Pass 4 should split dishes-discovery
  before venue-search; the workflow reference files still define the single-prompt
  version and should be updated in a build session. `red-team.md` Phase 3.

## Commits this session (not yet pushed)
- destination-check Bulgaria CONDITIONAL
- trip-init scaffold bulgaria-2026-06
- red-team Pass-4 ordering finding
- (plus this wrap commit)
Repo pushes to the PERSONAL github (`patriklindeberg75-boop`), not Axcion.

## Open questions
- Tripe-soup venue: include in 4b or not (see Resume With #1).
