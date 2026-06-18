# Destination Dossier — Run Log

Append-only log of `/destination-dossier` runs. The `dossier-orchestrator` agent appends one entry per run at Step 9 of the workflow.

Per Decision 7 (operator-confirmed in `pipeline/decisions.md`), this file is where grounding evidence lives — what preferences were applied, what principles enforced, what was filtered out per section. The dossier output itself stays clean of grounding meta-content.

## Entry format

Each entry is a `## ` section. The format is:

```
## {YYYY-MM-DD HH:MM} — {slug}

- **Dossier written:** projects/personal/trips/{slug}/destination-dossier.md (or -v{n}.md)
- **Trip type:** single-base | multi-stop
- **Viability verdict:** {pass | conditional | fail | skipped}
- **Profile version read:** {filename or git SHA, or `unversioned` at Phase 1}
- **Principles version read:** {same}
- **PROFILE_EXTRACT** (preferences applied):
  - {bullet 1}
  - {bullet 2}
  - {...3–5 bullets}
- **PRINCIPLES_EXTRACT** (principles enforced):
  - {bullet 1}
  - {bullet 2}
- **Pass status:**
  - Pass 2 (locations): {long-list count} generated → {short-list count} approved ({rejected count} rejected) — gate received {HH:MM}
  - Pass 3 (activities): {long-list count} generated → {short-list count} approved ({rejected count} rejected) — gate received {HH:MM}
  - Pass 4 (food): {long-list count} generated → {short-list count} approved ({rejected count} rejected) — gate received {HH:MM}
  - Pass 5a (traps): {long-list count} generated → {short-list count} approved ({rejected count} rejected) — gate received {HH:MM}
  - Pass 5b (mobility): {APPROVE | APPROVE WITH NOTES | REJECT} — gate received {HH:MM}
  - Pass 5c (timing): {APPROVE | APPROVE WITH NOTES | REJECT} — gate received {HH:MM}
  - Pass 5d (music): {APPROVE | APPROVE WITH NOTES | REJECT} — gate received {HH:MM}
- **Section status** (final dossier):
  - 1. Cool neighborhoods — {received|partial|missing}
  - 2. Accommodation area — {received|partial|missing}
  - 3. Hidden-gem activities — {received|partial|missing}
  - 4. Food / restaurants — {received|partial|missing}
  - 5. Tourist-trap warnings — {received|partial|missing}
  - 6. Mobility — {received|partial|missing}
  - 7. Optimal timing — {received|partial|missing}
  - 8. Music vibe — {received|partial|missing}
- **Filtering notes** (items removed by anti-tourist or personalization filters after approval):
  - Pass {n}: {one-line on what was filtered and why}
  - {...}
- **Halt / flag notes:**
  - {weather flag if fired; otherwise omit}
  - {conditional viability notes if applicable}
  - {other notable conditions}

---
```

Entries are listed in chronological order (most recent at bottom). Do not edit or delete prior entries — this log is append-only and feeds the Phase 3 retro and Phase 5 friction analysis.

## Runs

(No runs yet. The first /destination-dossier invocation will append the first entry below.)


## 2026-06-18 18:00 — bulgaria-2026-06

- **Dossier written:** trips/bulgaria-2026-06/destination-dossier.md
- **Structured data written:** trips/bulgaria-2026-06/dossier-data.json
- **Trip type:** multi-stop (3 stops: Sofia 2n, Bansko 3n, Rila/Panichishte 2n)
- **Viability verdict:** conditional (work-constraint + anti-overtourism tension at
  the Rila weekend; operator acknowledged; weather ceiling waived)
- **Profile version read:** v1 (universal-traveler-profile.md)
- **Principles version read:** v3 (travel-principles.md)
- **PROFILE_EXTRACT** (preferences applied):
  - Anti-tourist backpacker; mass-tourism spots filtered within destination (§1, §5)
  - Nature/outdoor STRONG: full-day hikes (ceiling respected); scenic transport /
    journey-as-experience anchor (narrow-gauge)
  - 25h/week remote work Mon–Thu front-loaded; reliable WiFi (Sofia/Bansko) (§3)
  - Social hostels 25–35; ~€50/day budget baseline; €12 meal hard cap; splurge
    on experience not comfort (§4, §9)
  - UV/sun sensitive; morning hike timing enforced; single-day 30°C ceiling
    applied per-stop (§8)
- **PRINCIPLES_EXTRACT** (principles enforced):
  - §4.1/4.3: anti-overtourism filter + iconic-experience exception. Seven Lakes
    accepted with crowd-awareness and early-start mitigation; Malyovitsa carried
    as documented fallback. Gondola-area Bansko venues explicitly excluded.
  - §5.2: journey-as-experience. Narrow-gauge railway designated trip anchor (🔥).
  - §3.2: splurge on experience, not comfort. Valyavitsa trout tagged as
    experience-category at the budget ceiling. No resort-priced items in any section.
  - §6.2: Mon–Thu work front-loaded. Sofia (Mon–Tue) and Bansko (Wed–Fri) used as
    work-compatible stops; Rila weekend is work-off by design.
  - §5.4: menu not schedule enforced throughout; option-clusters (Vitosha morning,
    Bansko second-hike day) presented as on-the-ground choices.
- **Pass status:**
  - Pass 2 (locations): 12 generated → 5 approved (7 rejected) — gate received 2026-06-16
  - Pass 3 (activities): 19 generated + 13 addendum → 25 effective keeps (9 rejected
    + 2 cross-flagged to P5) — gate received 2026-06-17
  - Pass 4 (food): 15 generated (10 + batch 2 of 5) → 13 approved after Ednorog
    drop (1 rejected + 1 editorial drop = 2) — gate received 2026-06-18
  - Pass 5a (traps): SKIPPED — operator decision. Section 5 omitted from dossier.
  - Pass 5b (mobility): APPROVE — gate received 2026-06-18
  - Pass 5c (timing): not run — sourced from trip-context.md timing_verdict / timing_notes
  - Pass 5d (logistics): APPROVE — gate received 2026-06-18
- **Section status** (final dossier):
  - 1. Cool neighborhoods — received (3 stops)
  - 2. Accommodation area — received (3 stops)
  - 3. Hidden-gem activities — received (3 stops; transit leg integrated as dedicated block)
  - 4. Food / restaurants — received (3 stops; food-to-try + venue cards per stop)
  - 5. Tourist-trap warnings — SKIPPED (operator decision; 5a not run)
  - 6. Mobility — received (inter-stop legs + per-stop mobility)
  - 7. Optimal timing — received (from trip-context.md timing_verdict + timing_notes)
  - 8. Practical logistics — received (connectivity, offline maps, entry/admin, currency)
  - 9. Critical checklist — received (4 items)
  - 10. Tasks and reminders — received (6 items)
  - 11. Destination resources — received (per stop)
- **Filtering notes:**
  - Pass 4 editorial drop: Restaurant Ednorog (#5, Koprivshtitsa) dropped per operator
    directive — Koprivshtitsa parked for a future central-Bulgaria trip; not in route.
  - No ski-resort-priced items survived Bansko anti-resort filter — all 5 Bansko
    venues were pre-screened away from gondola strip by Pass 4 triage.
  - Seven Lakes: iconic-experience exception (§4.3) applied — crowd-acknowledged,
    early-start mitigation documented, Malyovitsa fallback carried.
  - No items removed by de-dup check (Pass 5a skipped; de-dup not run).
  - Malyovitsa (#19) maintained as contingency note under Seven Lakes, not a
    standalone activity card — per operator Decision 2 at Pass 3 gate.
- **Operator directives folded in post-gate:**
  - Currency correction: Bulgaria EUR since 2026-01-01; BGN figures in 5b/5d
    paste-backs treated as legacy; EUR used throughout dossier.
  - Dedo Tase hours resolved via 5d: daily 12:30–23:00 (rs: verified).
  - Valyavitsa hours resolved via 5d: daily 10:00–midnight, 03:00 Saturdays
    (rs: verified).
  - Sofia culture cluster (Banya Bashi Mosque + Ancient Serdica complex) folded in
    from operator addition at Pass 3 gate.
  - Pass 5a skipped per operator; Section 5 omitted.
- **Halt / flag notes:**
  - Weather check FLAGGED (not halted): forecast_max_celsius: 32 overall — operator
    waived ceiling. Per-stop check: Sofia 27°C (PASS), Rila high country 16°C (PASS).
    The 32°C figure is legacy trip-wide; per-stop values confirm both active stops
    are within the 30°C ceiling.
  - Conditional viability: work constraint pushes Rila to weekend (Jun 27–28);
    Seven Lakes weekend crowds accepted by operator at Pass 2 gate.
  - Sofia Live Festival Jun 27–28 noted in timing section; affects Panichishte
    accommodation availability (book in advance flagged in critical checklist).

---

## 2026-06-04 — balkans-2026-06

- **Dossier written:** trips/balkans-2026-06/destination-dossier.md
- **Trip type:** multi-stop (5 stops: Budapest, Belgrade, Prizren, Ohrid, Sofia)
- **Run mode:** stop-by-stop full depth (operator choice). Adapted from the
  standard multi-stop flow: route was operator-fixed (no Pass-2 route discovery),
  so each stop ran as its own mini single-base funnel. Orchestrated in main
  session (not the dossier-orchestrator agent) because the agent's contract does
  not support stop-by-stop fixed-route runs.
- **Viability verdict:** conditional (Belgrade + Prizren heat-flagged >30°C)
- **Profile version read:** v1 (universal-traveler-profile.md)
- **Principles version read:** v3 (travel-principles.md)
- **PROFILE_EXTRACT (applied):** anti-tourist backpacker; social hostels (25–35);
  nature/full-day-hikes + off-beat local transport; light work (~12h/wk, off-laptop);
  heat/UV-sensitive, wants cool escapes.
- **PRINCIPLES_EXTRACT (enforced):** filter mass-tourism neighborhoods; ultra-budget
  + NO splurge (operator override, §3.2 splurge eliminated); scenic transport; loose
  day-plans; 30°C single-day activity ceiling.

- **Per-pass status (short list / long list):**
  - Budapest: P2 5/12, P3 8/17, P4 6/16, P5a 6/11 + 5b + 5d-dropped
  - Belgrade: P2 4/8, P3 8/17, P4 8/16, P5a 6/12 + 5b-AI
  - Prizren: P2 7/11, P3 7/14, P4 8/14, P5a 6/7 + 5b-AI
  - Ohrid: P2 8/13, P3 8/13, P4 8/12, P5a 5 (operator-skipped, AI-built) + 5b-AI
  - Sofia: consolidated single light prompt (thin transit stop); base+evening+morning+traps

- **Filtering notes:**
  - No-splurge directive removed Kéhli (Budapest) from food; all splurge-tier picks dropped trip-wide.
  - Strenuous exposed peaks cut twice for heat/UV profile: Ljuboten (Prizren), Magaro (Ohrid) — kept as ambitious alternatives only, gentle hikes (Prevallë–Lakes, Gorno Konjsko) made signatures.
  - De-dup (B3): zero trap-vs-keep conflicts at any stop; trap lists reinforced keeps (Lehel vs Retro Lángos; Radecki vs Šaran; Bekimi vs Beska/Hyska).

- **Halt/flag notes:**
  - Weather FLAGGED (not halted): Belgrade ~31°C, Prizren ~30°C. Cool escapes routed per stop.
  - NM city fork resolved to Ohrid (operator); Sofia accepted as thin late-arrival stop.

- **Provenance flags (for retro):** Music section (5d) dropped trip-wide per operator.
  Mobility (5b) AI-filled for Belgrade/Prizren/Ohrid/Sofia (operator ran Budapest 5b).
  Ohrid 5a traps AI-built (operator skipped prompt). All flagged in per-stop state files.
