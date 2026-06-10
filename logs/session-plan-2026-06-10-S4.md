# Session Plan — 2026-06-10

## Intent
Apply V1 UX fixes (A1–A3) — add stable per-place id/city/neighborhood/map_link to every place in the Balkans dossier-data.json, regenerate index.html via build.mjs, and promote those four fields to required in the spec.

## Model
sonnet (doing-tier: spec-following + bounded per-place neighborhood inference) — active is opus-4-8 → /model sonnet (advisory; the 114-place neighborhood pass is light judgment, not architectural — sonnet is sufficient, but no blocker to staying on opus).

## Source Material
- `/Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/dossier-data.json` — single source of truth (1536 lines, 114 places across 5 stops)
- `/Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/build.mjs` — regenerates index.html TRIP/LEGS block from the JSON
- `/Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/index.html` — renderer shell (Patrik-owned; only the generated data block is touched, by build.mjs)
- `/Users/patrik.lindeberg/Claude Code/personal/travel-os/trips/balkans-2026-06/ux-workflow-additions.md` — A1–A3 spec deltas (the source brief for this session)
- `/Users/patrik.lindeberg/Claude Code/personal/travel-os/references/dossier-template.md` — spec layer (A1 required fields, A2 map_link rule, A3 id rule)
- `/Users/patrik.lindeberg/Claude Code/personal/travel-os/references/dossier-workflow.md` — Step 12.5 data-emission spec (A2/A3 enforcement)

## Findings / Items to Address
1. **A1** (`ux-workflow-additions.md` §Part A) — `neighborhood`, `city`, `map_link` are framed as optional "ride-along" fields in `dossier-template.md`; promote to required on every do/eat/avoid place. `lat`/`lng` stay optional.
2. **A2** (`ux-workflow-additions.md` §Part A) — no canonical `map_link` construction rule exists. Define it: Google Maps search URL from `{nm} {neighborhood} {city}` (or `{lat},{lng}` when coords known). Never fabricate coords.
3. **A3** (`ux-workflow-additions.md` §Part A) — Balkans data emits per-place `id` for stops only, not places; the localStorage want/done feature (job E) is keyed on it. Make per-place `id` (`{stop-kebab}-{place-kebab}`) a hard requirement with a generation self-check.
4. **Implementation fork (decided):** `id` and `map_link` are *deterministic* (kebab rule; A2 formula). Authoring 114 of each by hand is a large error/bloat surface. Decision: author the irreducible knowledge fields (`neighborhood`, `city`) in the JSON; derive `id` + `map_link` in `build.mjs` so the generated TRIP block (what the renderer reads) carries all four. This is the most faithful reading of A2 ("map_link is constructed") and keeps single-source DRY. Spec edits will document the derived-vs-authored split.
5. **`avoid` places included** — trap entries still need city/neighborhood/map_link so the user can identify and locate-to-avoid them.

## Execution Sequence
1. **Author neighborhood + city in the JSON.** For each of the 114 places, add `city` (trivial per stop: Budapest/Belgrade/Prizren/Ohrid/Sofia) and `neighborhood` (per-place, inferred from hook/facts + Balkans geography; city-center fallback where unknown). Done via a Python merge script keyed on a name→neighborhood map so the JSON edit stays mechanical. *Verify:* every place has non-empty `city` + `neighborhood`; JSON still parses.
2. **Extend build.mjs to derive id + map_link.** Add a deterministic transform: `id = {stop.id}-{kebab(nm)}`; `map_link = https://www.google.com/maps/search/?api=1&query=<urlenc(nm neighborhood city)>` (or `query=lat,lng` when present). Inject into each place object in the generated TRIP block. *Verify:* build.mjs runs without error; a self-check fails loudly if any place lacks id/city/neighborhood.
3. **Run `node build.mjs`.** *Verify:* index.html data block now carries id/city/neighborhood/map_link on sampled places (Budapest do[0], Belgrade eat[0], Sofia avoid[0]); stop count unchanged (5 stops).
4. **Spec edits.** `dossier-template.md`: A1 promote the three fields to required + note id/map_link are build-derived. `dossier-workflow.md` Step 12.5: A2 map_link rule + A3 id requirement and self-check. *Verify:* spec text no longer frames the fields as optional; map_link formula present.
5. **QC pass** on the data + spec changes before declaring complete (`/qc-pass`). *Verify:* GO verdict or findings resolved.

## Scope Alternatives
- **Min:** data layer only (fields in JSON + build.mjs + rebuild); defer spec edits. Rejected — A1–A3 are explicitly spec promotions; leaving them optional means the next dossier regresses.
- **Recommended (this plan):** data + build derivation + spec A1–A3 + QC. Full V1 hard-requirements set.
- **Max:** also add A4 (structured hours/open-now) and A5/A6 notes. Rejected — A4 is explicitly V2-deferred per the 2026-06-10 decision; out of scope.

## Autonomy Posture
Full autonomy — additive, clearly scoped, exit condition observable. The implementation fork (item 4) is decided and documented; no operator gate needed.

**Stop points:**
- If neighborhood inference for a cluster of places is genuinely unknowable from available context, flag `[AMBIGUOUS]` rather than fabricating a specific district — fall back to city-center and note it.

## Risk
`build.mjs` is automation over shared data (the generated index.html block), but it is an existing, idempotent build step and the edit only adds derived fields — no reordering of shared-state operations. Spec edits to `references/*` are bounded, additive (optional→required). No new commands/skills/hooks/permissions/symlinks. No structural change classes apparent — run `/risk-check` if scope changes (e.g., if the build step starts mutating the HTML shell beyond the data block).
