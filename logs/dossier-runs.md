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
