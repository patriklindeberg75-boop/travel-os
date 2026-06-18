# Red-Team Log — Personal Travel Planning System

A running capture of weaknesses, failure points, and gaps observed across the system. Each entry maps to a process phase so findings translate directly into improvements.

**Entry format:**
- **Observation** — what happened or could happen
- **Failure mode** — what goes wrong as a result
- **Severity** — low / medium / high
- **Fix hint** — direction a fix might take

Add entries as you use the system. Review before major workflow changes.

---

## Phase 1 — Profile (Traveler Profile + Travel Principles)

<!-- Weaknesses in how the profile is built, maintained, or applied -->

---

## Phase 2 — Planning (Trip Init + Context Capture)

<!-- Weaknesses in how trip context is captured and structured -->

### No trip-specific clarifying step between trip-init and prompt generation
- **Observation:** Workflow jumps from `/trip-init` (structured frontmatter only) directly to prompt generation. There is no step that captures trip-specific preferences not covered by the standing profile.
- **Failure mode:** Trip-specific intent (e.g., "push social comfort zone", "test scooter independence", "rougher accommodation tolerated") is never captured, so research prompts cannot reflect it.
- **Severity:** medium
- **Fix hint:** Add an interactive clarifying step after `/trip-init` (or as part of `/destination-dossier`) that asks 3–5 trip-specific questions and writes the answers into `trip-context.md` as a `trip_specific_intent` block. Substitute that block into the prompt templates alongside `profile_extract`.

### `trip-context.md` schema doesn't capture multi-stop trip structure
- **Observation:** Required frontmatter fields (`destination`, `dates_start`, `dates_end`, `theme`, `work_load_hours_per_week`) assume single-destination, single-base trips.
- **Failure mode:** Multi-region tours (e.g., Albania south-to-north) have no field for route, stops, or sequencing. The system treats the whole country as one destination.
- **Severity:** high
- **Fix hint:** Extend `trip-context.md` schema with optional `trip_type: single-base | multi-stop` and `route_stops: []` fields. Branch prompt logic on trip type.

---

## Phase 3 — Research (Prompt Generation + Subagent Handoff)

<!-- Weaknesses in the research prompts, tool assignments, or handoff mechanics -->

### Pass 4 (Food) conflates "what to eat" with "where to eat" in one prompt
- **Observation:** The Pass 4 food prompt asks for the venue list (restaurants/cafes) and the "FOOD TO TRY" dishes list in a single call. The dishes are returned as a side-section of a venue search, so the venue search isn't actually targeting the specific dishes the traveler wants.
- **Failure mode:** Venue results are generic ("good local restaurants") rather than "where to eat the specific dishes worth trying." The natural order is inverted — you have to know the cuisine before you can sensibly pick where to eat it.
- **Severity:** medium
- **Fix hint:** Split Pass 4 into two sub-steps. Pass 4a = dishes/drinks discovery only ("what Bulgarian food exists, by region + season"), operator marks priorities; Pass 4b = venue search that takes the prioritized dishes as its targeting list ("where to eat X, Y, Z"). Surfaced live during the bulgaria-2026-06 dossier run (2026-06-17); handled inline that session by reordering, but the workflow reference (`references/subagent-prompts.md` Pass 4 + `references/dossier-workflow.md`) still defines the single-prompt version and should be updated.

### No research hierarchy — all eight prompts are parallel and independent
- **Observation:** All eight section prompts (neighborhoods, accommodation, activities, food, traps, mobility, timing, music) are presented simultaneously. None depends on another's output.
- **Failure mode:** For multi-stop trips, food/activity/mobility recommendations cannot be grounded in chosen route stops because those stops are never selected before research begins. For single-base trips it works; for country tours it does not.
- **Severity:** high
- **Fix hint:** Introduce a two-pass research model for multi-stop trips: Pass 1 = route + stops + per-stop neighborhood, Pass 2 = activities/food/mobility per stop. Or: add a "route shortlist" prompt as Section 0, paste back, then generate Sections 1–8 grounded in chosen route.

### Anti-tourist source guardrail is Western-centric
- **Observation:** The guardrail prefers Reddit local subs, English-language travel blogs, and "small independent guides." It does not mention country-language sources, local YouTubers, or regional/Balkan-specific platforms.
- **Failure mode:** For destinations with thin English/Reddit coverage (Balkans, parts of Asia, Africa, Latin America), the recommended sources produce shallow or repetitive results. Hidden gems stay hidden.
- **Severity:** medium
- **Fix hint:** Make the source guardrail destination-aware. At prompt-generation time, inject region-specific source hints (e.g., for Albania: "include Albanian-language sources via translation; check Balkan-specific travel forums; check YouTube travel channels filmed in country").

### No language-handling guidance for non-English destinations
- **Observation:** Prompts do not instruct Perplexity to search in the destination's native language or to translate local sources back.
- **Failure mode:** Native-language sources (often the most local-grounded) are excluded by default. Results skew toward English-language expat blogs.
- **Severity:** medium (low if scoped correctly — only lands on the 4 Perplexity prompts; ChatGPT prompts don't retrieve in real time)
- **Fix hint:** Add a "search in {destination_language} and translate findings" instruction to Perplexity prompts (3, 4, 5, 7) when the destination's primary language is not English.

### Severity escalation: Western-centric guardrail inverts in low-coverage destinations
- **Observation:** For destinations like Albania (r/albania ~50k subscribers, mostly diaspora/politics), Perplexity following "prefer Reddit" pushes toward English expat blogs and Lonely Planet-adjacent listicles — the same sources the guardrail tries to exclude.
- **Failure mode:** Anti-tourist guardrail produces tourist-trap results in thin-coverage destinations. The mechanism inverts.
- **Severity:** high (in non-Western contexts)
- **Fix hint:** See the destination-aware source guardrail entry above. The severity of that entry should be promoted from medium → high for non-Western destinations specifically.

### Prompt 2 explicitly disables Prompt 1's output
- **Observation:** subagent-prompts.md lines 93–95 instruct the model to "reason from {destination} general knowledge" instead of using the neighborhood list from Prompt 1. Self-inflicted parallelism block.
- **Failure mode:** Even where Prompt 2 *could* benefit from Prompt 1's output, it is told not to. Bakes parallelism in by default.
- **Severity:** medium
- **Fix hint:** Remove the "reason from general knowledge" clause. Make Prompt 2 dependent on Prompt 1's pasted-back neighborhoods. One-line fix.

### Prompt 6 (mobility) gives a single trip-wide verdict
- **Observation:** Prompt 6 asks for ONE mobility recommendation for the whole trip. Menu options (bike / scooter / transit pass / mix / walking) assume single-base city.
- **Failure mode:** Multi-region tours have different mobility per stop (bus between cities, scooter on coast, hiking in mountains). Trip-wide single verdict is unusable.
- **Severity:** high (for multi-stop trips)
- **Fix hint:** Per-stop mobility recommendation in two-pass model. Also: extend the menu to include intercity bus + furgon (informal minibus) — currently no slot for the dominant Balkan country-tour mode.

### Single PROFILE_EXTRACT can't capture mixed-mode trips
- **Observation:** Workflow Step 2 produces one PROFILE_EXTRACT per dossier. Multi-region trips pull different profile facets per region (beach socializing vs mountain solitude).
- **Failure mode:** Profile is flattened to whichever facets the orchestrator picks; one region gets well-matched recommendations and the other doesn't.
- **Severity:** medium
- **Fix hint:** Per-stop PROFILE_EXTRACT in two-pass model, weighted by what that stop is for.

### Prompt 7 (timing) misses crowding signals
- **Observation:** Prompt 7 catches festivals, strikes, and weather, but does not ask about cruise-ship peaks, school holidays (German/Italian), Orthodox Easter surges, or other crowd-driving signals.
- **Failure mode:** An anti-tourist traveler arrives during peak crowding because the timing prompt didn't ask. The most important timing signal for the profile is invisible.
- **Severity:** medium
- **Fix hint:** Add a "crowding signal" task to Prompt 7: cruise-ship arrivals, school-holiday calendars in main feeder markets, religious-tourism peaks.

### No de-duplication contract between trap-list and keep-lists
- **Observation:** Prompts 3 (activities), 4 (food), and 5 (traps) operate independently. The same place could appear as "kept with counter-signal" in Prompt 4 and "avoid" in Prompt 5. Synthesis step (workflow Step 6) has no conflict-resolution rule for this case.
- **Failure mode:** Dossier contains contradictory recommendations for the same place.
- **Severity:** medium
- **Fix hint:** At ingestion (Step 5) or synthesis (Step 6), cross-check Prompt 5 outputs against Prompts 3/4 outputs. On conflict, log it in the run log and apply a deterministic rule (e.g., trap wins, or surface conflict to operator).

### Ingestion validates shape but not quality
- **Observation:** Step 5 marks sections as `received / missing / partial` based on parseability only. A section returning 5 Lonely Planet top-10 places with fabricated "Reddit thread X" signals parses as `received` and ships in the dossier.
- **Failure mode:** Anti-tourist guardrail is enforced in the prompt instructions but not at ingestion. Models that ignore the guardrail are not caught.
- **Severity:** high
- **Fix hint:** Add a quality check at Step 5: sample 2–3 source-signal claims per section, spot-verify (or flag for operator spot-check). Log results in the run log. Sections that fail spot-check get marked `quality-flagged`, not `received`.

### Weather ceiling applied trip-wide, not per-stop
- **Observation:** Hard Constraint "27°C ceiling" (CLAUDE.md) is checked once per trip via `forecast_max_celsius` in trip-context.md. For multi-region trips (e.g., Albania: Theth ~18°C, Saranda ~28°C), this flags everything or nothing.
- **Failure mode:** Either a 17-night tour gets flagged because one coastal day exceeds the ceiling, or all stops pass because the mountain average pulls down the mean. Neither is useful.
- **Severity:** medium
- **Fix hint:** Per-stop weather check in multi-stop schema. Flag per-stop, not per-trip.

### Prompts have no "say I don't know" permission
- **Observation:** Prompt 1 asks for 3–5 neighborhoods; Prompt 3 asks for 5–8 activities. No instruction permitting the model to return fewer if real evidence is thin.
- **Failure mode:** For small destinations (Himara, Theth), models hit the floor by fabricating items. Output looks valid; ingestion doesn't catch it (see Step 5 quality gap).
- **Severity:** medium
- **Fix hint:** Add a one-line instruction to each prompt: "If you can find fewer than the requested count with real evidence, return fewer and say so. Do not pad."

### Prompt 8 (music) missing guardrail by silent omission
- **Observation:** Prompt 7 explicitly documents why it skips the anti-tourist guardrail ("about timing, not place curation"). Prompt 8 (music) just doesn't have one — intent unclear.
- **Failure mode:** Future tuner can't tell whether the omission is deliberate or an oversight. Risks bad-faith edits in either direction.
- **Severity:** low
- **Fix hint:** Add a one-line comment in Prompt 8 explaining why the guardrail is omitted (or add a music-appropriate variant).

### Paste-back has no enforced section boundary format
- **Observation:** Step 4 tells Patrik to label paste-back "by section number." No required header format. Step 5 parser is expected to identify sections without a contract.
- **Failure mode:** "Section 3:" vs "## Section 3" vs "3." — parser behavior undefined. Risk of silent mis-attribution between sections, or whole-section loss.
- **Severity:** medium
- **Fix hint:** Specify a required format in the Step 4 paste-back instructions (e.g., "Use `## Section N — Name` as the boundary header"). Step 5 parser rejects anything else with a clear error.

### Prompts 1, 2, 6 are candidates for consolidation
- **Observation:** Prompts 1 (neighborhoods), 2 (accommodation area), and 6 (mobility) all target ChatGPT Pro, all rely on prior knowledge, all share overlap (work-fit, proximity, routine). Three prompts share one evidence base with weak handoff.
- **Failure mode:** Paste-back surface area is larger than needed; cross-prompt overlaps produce redundant recommendations; Prompt 2 explicitly disables Prompt 1's output (see separate entry).
- **Severity:** low (simplification opportunity, not a defect)
- **Fix hint:** Consolidate into one prompt covering "where to base + neighborhood character + how to move." Drops paste-back surface by two prompts. Design with the two-pass model in mind so the fix lands once.

### Prompt 7 (timing) belongs in `/trip-init`, not every dossier run
- **Observation:** Timing doesn't change between dossier v1 and v2 of the same trip. Currently it runs on every `/destination-dossier` invocation.
- **Failure mode:** Wasted prompt + paste-back surface on every regeneration. Also: `Halt 3` in workflow reads `forecast_max_celsius` from frontmatter — timing data should live there to begin with.
- **Severity:** low (simplification opportunity)
- **Fix hint:** Move Prompt 7 to `/trip-init` as a one-time scaffold step. Store `forecast_max_celsius` and `event_signal` in trip-context.md frontmatter. `/destination-dossier` reads them, doesn't re-run.

### Multi-stop paste-back ergonomics don't scale
- **Observation:** Two-pass model for a 4-stop Albania trip implies ~24 prompts. Single-message paste-back (workflow Step 4) doesn't scale beyond ~8.
- **Failure mode:** Operator overwhelmed by prompt volume; partial pastes become the norm; state persistence breaks if work spans sessions.
- **Severity:** high (operational, surfaces only after two-pass fix lands)
- **Fix hint:** Either (a) per-stop dossier files generated independently, each with its own ~6-prompt batch, or (b) batched paste-back over multiple sessions with state persistence in `trips/{slug}/dossier/pass-N-status.md`.

---

## Phase 4 — Dossier (Synthesis + Output)

<!-- Weaknesses in how research is synthesized, filtered through the profile, and formatted -->

### No dossier-readiness QC pass — the dossier ships as "done" without an independent readiness check
- **Observation:** The dossier workflow ends at synthesis (`dossier-orchestrator` writes `destination-dossier.md` and the run log), then stops. There is no gate that independently checks the first draft is *actually* "ready." A generic `/qc-pass` skill exists, but it is not dossier-aware — it does not check against the dossier-specific readiness criteria (all 8 template sections present and non-empty; personalization spine genuinely applied vs. generic output; mobile-readable / paste-ready / map-ready output standards met; every place has name + neighborhood + city for Maps; unverified-hours/location flags surfaced not buried; route/constraint decisions consistent across sections; no dropped-but-still-referenced items like a parked stop).
- **Failure mode:** A dossier with silent gaps ships looking finished. Observed on the bulgaria-2026-06 run (2026-06-18): synthesis completed with `build.mjs` unrun (id/map_link fields empty), 3 places carrying needs-verification flags, and an outstanding Panichishte booking — all real readiness gaps that no gate is responsible for catching. Without a readiness QC, the operator discovers these on the trip, not before.
- **Severity:** medium
- **Fix hint:** Add a dossier-readiness QC step as the final gate of `/destination-dossier` (after synthesis, before "done"). Run it via subagent for independence (mirrors the workspace QC-independence rule). It should score the draft against an explicit dossier-readiness checklist (the criteria above) and return READY / NOT-READY with specific gaps, rather than a generic artifact QC. Surfaced and logged 2026-06-18 at operator request when the bulgaria dossier first draft completed.

---

## Phase 5 — Execution (Using the Dossier During the Trip)

<!-- Weaknesses in how the dossier holds up in real conditions -->

---

## Phase 6 — Retro (Post-Trip Learning Loop)

<!-- Weaknesses in how learnings are captured and fed back into the profile -->

---

## Cross-Cutting

<!-- Issues that span multiple phases or the system as a whole -->

---

## Redesign Log — 5-Pass Funnel (2026-05-11)

The following Phase 2 and Phase 3 entries above were addressed by the 5-pass funnel redesign. Full implementation plan: `~/.claude/plans/other-observations-i-m-cuddly-nova.md`.

**ADDRESSED:**
- trip-context.md schema doesn't capture multi-stop structure → `trip_type`, `approved_locations`, `route_stops` fields added; `/trip-init` scaffolds them.
- No research hierarchy (all 8 prompts parallel) → 5 sequential operator-gated passes; each list pass uses long-list → short-list narrowing.
- Anti-tourist guardrail Western-centric → guardrail updated to include native-language sources and explicit instruction to search in local language for thin-coverage destinations.
- Prompt 2 disables Prompt 1's output → Pass 2 locations feed directly into Passes 3/4/5 via `{approved_locations}` placeholder.
- Prompt 6 mobility single trip-wide verdict → Prompt 5b has single-base and multi-stop variants (inter-stop transport + per-stop local mobility).
- Prompt 7 timing misses crowding signals → Prompt 5c includes cruise-ship peaks, school holidays, religious-tourism surges.
- No "say I don't know" permission in prompts → All list prompts now include "return fewer if real evidence is thin."
- Prompt 8 missing guardrail by silent omission → Explicit comment added explaining omission is intentional.
- Paste-back has no enforced section boundary format → Concrete paste-back contracts (KEEP format) defined in `dossier-workflow.md`.
- Prompts 1+2+6 consolidation → Merged into Pass 2 (locations) and Pass 5b (mobility); old Prompt 2's self-disabled cross-grounding is gone.
- Multi-stop paste-back ergonomics don't scale → 5 sequential passes each with individual operator gate replaces single 8-prompt dump.
- No trip-specific clarifying step → Pass 1 (`/destination-check`) screens destinations before scaffolding; partially addressed.
- No early viability check → `/destination-check` command added as pre-`/trip-init` entry point.

**ADDRESSED (2026-05-11 session — red-team fixes B3, S2, B5):**
- Weather ceiling applied trip-wide not per-stop (B5) → `stop_weather` list added to trip-context.md schema; Halt 3 now flags per-stop for multi-stop trips; Prompt T1 collects per-region max temps at `/trip-init`.
- No de-duplication contract between trap-list and keep-lists (B3) → de-duplication step added to dossier-workflow.md Step 10.5: after ingesting 5a, fuzzy-match against Pass 3/4 short lists; trap wins; conflicts logged. Operator surfaced if >3 conflicts.
- Prompt 7 timing belongs in `/trip-init` not every dossier run (S2) → timing prompt moved to Prompt T1 in subagent-prompts.md § Trip Init; `/trip-init` Step 3.5 generates, presents, and ingests it; results stored in `trip-context.md` frontmatter (`timing_verdict`, `timing_notes`, `forecast_max_celsius`); 5c removed from Pass 5 in dossier-workflow.md.

**ADDRESSED (2026-06-18 session — S2):**
- Pass 4 (Food) conflates "what to eat" with "where to eat" in one prompt → Split into Pass 4a (dishes/drinks discovery, ChatGPT Pro) and Pass 4b (venue long list grounded in 4a priority dishes, Perplexity Pro). Updated `references/subagent-prompts.md` (new Prompts 4a/4b) and `references/dossier-workflow.md` (Steps 7/7.5/8/8.5 restructured; resume logic extended for 4a/4b; foodToTry in Step 11 now sourced from Pass 4a; de-dup in Step 10.5 updated to pass-4b-state.md).
- No dossier-readiness QC pass → Added Step 13.5 to `references/dossier-workflow.md`: in-context 7-criterion readiness check (all 8 sections present; personalization applied; mobile/map-ready standards; unverified flags surfaced; build.mjs run; route decisions consistent; no buried critical bookings). Returns READY/NOT-READY with specific gaps; NOT-READY requires operator acknowledgment before declaring done. Subagent-based independent version is the long-term form; deferred to a future phase.

**STILL OPEN (deferred to post-first-trip retro):**
- Ingestion validates shape but not quality (fabricated source signals) — red-team B4
- Single PROFILE_EXTRACT can't capture mixed-mode trip facets — red-team A2
