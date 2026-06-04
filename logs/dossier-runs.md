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
