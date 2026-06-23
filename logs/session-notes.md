# Session Notes — Personal Travel Planning

---

## 2026-05-11 — Populate personalization spine

**Work:** Added content to both profile files (personalization spine Phase 0).

**What happened:**
- Saved Universal Traveler Profile v1 (256 lines) verbatim to `profile/universal-traveler-profile.md`.
- Saved Travel Principles v3 (355 lines) verbatim to `profile/travel-principles.md`.
- Committed both files. Saved traveler profile memory for future sessions.

**Next steps:**
- Phase 0 gate is now clear — both spine files are populated.
- Ready to run `/destination-dossier` for a specific trip, or `/trip-init` to scaffold a new trip directory.
- Commit the remaining untracked files in the working tree (large batch of agents, commands, ai-resources) if desired.

**Open questions:** None.

---

## 2026-05-11 — Populate personalization spine (Phase 0 gate)

### Summary
Populated both personalization spine files from operator-pasted content. Universal Traveler Profile v1 and Travel Principles v3 are now live in the profile directory. Phase 0 gate is cleared — all dossier and trip-planning workflows that gate on these files are now unblocked. Log infrastructure (session-notes, decisions, innovation-registry) was also initialized.

### Files Created
- `projects/personal/profile/universal-traveler-profile.md` — Universal Traveler Profile v1 (256 lines), operator-authored
- `projects/personal/profile/travel-principles.md` — Travel Principles v3 (355 lines), operator-authored
- `projects/personal/logs/session-notes.md` — session log (this file)
- `projects/personal/logs/decisions.md` — decision log
- `projects/personal/logs/innovation-registry.md` — innovation registry (empty table)

### Files Modified
- `memory/user_traveler_profile.md` — new memory entry capturing traveler profile spine summary
- `memory/MEMORY.md` — added pointer to traveler profile memory

### Decisions Made
- Profile content saved verbatim from operator input; Claude Code does not generate or modify profile content.
- Update protocol enforced: both spine files update only via Phase 3 retro workflow after a real trip, never ad-hoc.

### Next Steps
- Run `/trip-init` to scaffold a trip directory (slug: `{destination}-{YYYY-MM}`), then `/destination-dossier` to generate the first dossier.
- Or: run `/destination-dossier` directly if a trip context file already exists.
- Push the two commits from this session (`git push`).
- Optionally commit the large batch of untracked infrastructure files (agents, commands, ai-resources) — separate commit, not travel-planning related.

### Open Questions
None.

---

## 2026-05-11 — repo-dd audit of projects/personal
Class: design

**Mandate:** Run /repo-dd factual audit scoped to projects/personal — done when: audit report committed and triage findings presented to operator
- Out of scope: (none stated)
- Files in scope: ai-resources/audits/ (audit report); any approved fix targets within projects/personal
- Stop if: (none stated)

### Summary
Ran /repo-dd factual audit scoped to projects/personal. Audit produced 10 findings (0 AUTO-FIX, 6 OPERATOR, 4 INFO). Operator dismissed FINDING-6 (settings.json missing top-level model key) and FINDING-7 (settings.json untracked in git) at triage. Wrote an implementation report covering the remaining 4 OPERATOR findings; implementation deferred to next session.

### Files Created
- `ai-resources/audits/repo-due-diligence-2026-05-11-project-personal.md` — factual audit report (37KB)
- `ai-resources/audits/working/dd-extract.md` — structured triage extract
- `ai-resources/audits/repo-dd-implementation-2026-05-11-project-personal.md` — implementation report for next session (4 fixes: FINDING-4, FINDING-2, FINDING-3, FINDING-8)
- `projects/personal/logs/session-plan.md` — session plan (intent, class=design, model=opus, gated posture)

### Files Modified
- `projects/personal/logs/session-notes.md` — appended this entry

### Decisions Made
- Session classified as design; model escalated to opus for triage judgment.
- Operator dismissed FINDING-6 and FINDING-7 — both relate to settings.json conventions; operator chose to not act.
- Implementation report recommends DEFER for FINDING-4 (touches ai-resources outside this scope), KEEP for FINDING-2 / FINDING-3 (declared CLAUDE.md duplications with explicit rationale), FREEZE + NOTE for FINDING-8 (historical pipeline artifact).

### Next Steps
- Open the implementation report in next session, mark APPLY or DEFER per fix, then execute the approved ones.
- Push this session's commits (`git push`) — manual operator step.
- Run `/wrap-session` to close the session.

### Open Questions
None.

---

## 2026-05-11 — 5-pass funnel redesign + red-team

### Summary
Redesigned the dossier research workflow from a parallel 8-prompt dump into a sequential 5-pass operator-gated funnel with long-list → short-list narrowing at each pass. Also created a red-team capture log for ongoing weakness tracking. All 10 implementation files were written; the redesign is Albania-ready (first stress test May 15). Several deferred red-team items remain open for the post-Albania retro.

### Files Created
- `projects/personal/red-team.md` — red-team capture log (17 entries across phases; Redesign Log at bottom tracks addressed vs deferred)
- `projects/personal/.claude/commands/destination-check.md` — new Pass 1 command; runs viability screening before /trip-init; Spine Gate applies; writes verdict to destination-checks/

### Files Modified
- `projects/personal/.claude/commands/trip-init.md` — new --trip-type and --skip-viability flags; Step 2.5 viability artifact lookup; new frontmatter fields (trip_type, approved_locations, route_stops, viability_verdict/notes/checked_at)
- `projects/personal/.claude/commands/destination-dossier.md` — updated to 5-pass language; --resume flag removed (now auto-detected via pass-N-state.md)
- `projects/personal/.claude/agents/dossier-orchestrator.md` — Phase C extended (new optional fields); Phase C.5 added (auto-resume detection); Phase D updated for 5-pass execution
- `projects/personal/references/dossier-workflow.md` — full rewrite; 15 steps; KEEP paste-back contracts; pass-state file format; Halt 3 ceiling updated to 30°C
- `projects/personal/references/subagent-prompts.md` — full rewrite; reorganized by pass; Prompt 2a/2b (single-base/multi-stop branch); {approved_locations} placeholder in Passes 3–5; guardrail now includes native-language source instruction
- `projects/personal/references/dossier-template.md` — Section 2 and Section 6 multi-stop variants added; mobile formatting rule #5 updated for stop-prefixed place lines
- `projects/personal/logs/dossier-runs.md` — entry format updated: Trip type, Viability verdict, per-pass long-list/short-list/rejected counts + gate timestamps
- `projects/personal/CLAUDE.md` — Workflow References updated to 3-command flow; Trip Directory Convention updated with destination-checks/ and pass-N-state.md
- `../../.claude/settings.json` — permission allowlist expanded via /fewer-permission-prompts

### Decisions Made
- Execute the 5-pass redesign now rather than post-Albania retro. Albania is the first stress test; bugs will surface during the trip and feed the retro. Rationale: system is ready enough; waiting would delay the architecture improvement with no upside.
- Red-team.md is a capture-only log — entries are never directly executed. Only the plan file drives implementation.
- Weather ceiling relaxed to 30°C (operator confirmed during Albania context discussion; was 27°C in Hard Constraints).
- Deferred five red-team entries to post-first-trip retro: ingestion quality validation (B4), per-stop weather ceiling (B5), trap/keep-list deduplication (B3), mixed-mode PROFILE_EXTRACT (A2), timing prompt as one-time /trip-init step (S2).

### Next Steps
- Push this session's commits (`git push`) — manual operator step.
- Run `/destination-check Albania 2026-05-15 2026-06-01` to generate Pass 1 viability verdict (first real use of the new command).
- Run `/trip-init Albania 2026-05-15 2026-06-01 --trip-type multi-stop` to scaffold the Albania trip.
- Run `/destination-dossier` to execute the 5-pass funnel — stress test for the new architecture.
- Post-Albania retro: tune long-list sizes, filtering strictness; address deferred red-team entries.

### Open Questions
None.

---

## 2026-05-11 — Repo setup + restructure to travel-os

**Work:** GitHub tracking + directory restructure.

**What happened:**
- Initialized separate git repo at `projects/personal/` and pushed initial commit to `https://github.com/patriklindeberg75-boop/traveling`.
- Moved entire project root into `projects/personal/travel-os/` (including `.git/`) so GitHub tracks only `travel-os/`.
- Symlinks in `.claude/` use absolute paths — survived the move without modification.

**TODO [RESOLVED 2026-06-03]:** Verify symlinks still resolve correctly after opening Claude Code from the new root (`projects/personal/travel-os/`). If any are broken, recreate them pointing to the correct `ai-resources/` absolute paths. — Verified in the 2026-06-03 repo-dd audit: all 93 symlinks resolve and are readable; both SessionStart hooks resolve and are executable.

**Open questions:** None.

---

## 2026-05-11 — red-team fixes B3, S2, B5
Class: execution

**Mandate:** Implement red-team fixes B3 (de-duplication contract between trap-list and keep-lists), S2 (move Prompt 7 timing to /trip-init as one-time step, remove re-run from /destination-dossier), and B5 (per-stop weather ceiling for multi-stop trips) — done when: all three fixes are in the workflow/command files and committed
- Out of scope: (none stated)
- Files in scope: projects/personal/references/dossier-workflow.md, projects/personal/.claude/commands/trip-init.md, projects/personal/.claude/commands/destination-dossier.md, projects/personal/references/subagent-prompts.md, projects/personal/.claude/agents/dossier-orchestrator.md
- Stop if: (none stated)

### Summary
Implemented red-team fixes B3, S2, and B5 in a single commit. Also updated CLAUDE.md Hard Constraints to reflect the previously-deferred 27°C → 30°C weather ceiling correction.

### Files Modified
- `projects/personal/.claude/commands/trip-init.md` — added timing fields to trip-context.md template; added Step 3.5 (generate Prompt T1, wait for paste-back, write timing fields)
- `projects/personal/references/subagent-prompts.md` — added § Trip Init — Timing (Prompt T1) with multi-stop extension; replaced Prompt 5c in Pass 5 with a forwarding note; updated routing table
- `projects/personal/references/dossier-workflow.md` — Step 1 reads timing/stop_weather fields; Halt 3 updated for per-stop weather (B5); Steps 9/10/10.5 remove 5c; Step 10.5 adds de-dup check (B3); mapping table updated
- `projects/personal/.claude/agents/dossier-orchestrator.md` — Phase C reads timing fields; Phase D notes updated for 5c omission and B3 de-dup step
- `projects/personal/red-team.md` — B3, S2, B5 moved from STILL OPEN to ADDRESSED; A2 and B4 remain deferred
- `projects/personal/CLAUDE.md` — Hard Constraints weather ceiling updated to 30°C with per-stop note

### Decisions Made
- Trip-init now interactive at Step 3.5 (timing paste-back) — acceptable given it already had a viability lookup interaction.
- `stop_weather` list uses region names (not stop names) because exact route stops aren't known at /trip-init time.
- B3 de-dup rule: trap wins. Operator surfaced only if >3 conflicts (avoids noise for typical 1–2 conflict cases).

### Next Steps
- Push this session's commits (`git push`) — manual operator step.
- Run `/wrap-session` to close the session.
- Remaining red-team deferred items: B4 (ingestion quality check), A2 (per-stop PROFILE_EXTRACT) — post-first-trip retro.

### Open Questions
None.

## 2026-06-10 — Belgrade friend recs + "menu, not a schedule" principle baked into dossier system

### Summary
Folded a friend's Belgrade recommendations into the balkans-2026-06 dossier as a long list of vetted options (not a fixed plan), tagged "friend rec", with the two tourist-trap conflicts kept and cross-referenced. Then baked the operator's flexibility principle — "the dossier is a menu, not a schedule; nothing is locked" — into the dossier system itself (template + workflow) so every future dossier is flexible-by-default. Saved two standing principles to memory.

### Files Created
- `logs/scratchpads/2026-06-10-15-30-scratchpad.md` — continuity scratchpad
- Memory: `dossier-menu-not-schedule.md`, `friend-rec-screen-trust-lean.md`, `MEMORY.md` (in ~/.claude project memory dir)

### Files Modified
- `trips/balkans-2026-06/destination-dossier.md` — Belgrade §1 (areas), §3 (sights/experiences), §4 (food + dishes) friend recs added & tagged; Tri šešira + Šaran trap cross-refs both ways; top-level "How to use / menu not schedule" framing. [committed 42cd019]
- `references/dossier-template.md` — mandatory verbatim "How to use this dossier" header block + new "Menu, not a schedule" governing-principle section. [committed 02c6fc3; further refined post-commit by operator/linter — left intact, uncommitted]
- `references/dossier-workflow.md` — Step 12 emits the block and forbids day-by-day/hour-by-hour itineraries; schedule-shaped input mined for places, not reproduced. [committed 02c6fc3]

### Decisions Made
- Friend recs handled "screen but trust-lean": add all, tag distinctly, never drop; filter only attaches context/warnings; conflicts flagged. (operator-chosen)
- Itinerary handling: "shortlists only, no fixed day-plan" — operator wants a menu, flexible night counts, decide on the spot. (operator-directed; promoted to a system-wide principle)
- 3 ambiguous friend spellings interpreted and marked inline pending confirm: Aviation Museum, Karađorđeva šnicla, šopska salad.

### Risky actions
None.

### Next Steps
- Confirm/correct the 3 interpreted Belgrade spellings (Aviation Museum, Karađorđeva šnicla, šopska salad).
- ⚠ Fix the travel-os git remote — URL `https://github.com/patriklindeberg75-boop/traveling/` returns "Repository not found"; pushes fail and commits are accumulating locally.
- Operator/linter made further edits to `references/dossier-template.md` (structured-data companion section) that remain uncommitted — commit when ready.

### Open Questions
None.

## 2026-06-10 — Dossier workflow system upgrade (place-gate, cards/tiers, logistics, HTML JSON alignment)

### Summary
Five system-level changes to the destination-dossier workflow (no Balkans rebuild — operator declined), then aligned the structured JSON output to the operator's HTML travel-companion app. Place-selection became an explicit operator-gated discussion (candidate places, not pre-baked routes; new route/nights Step 4.4); tourist-trap pass skipped for ≤2-night stops; per-place card micro-template + sorting priority tiers (🔥/👍/🆗) + one "if you do one thing here" anchor per stop; a machine-readable dossier-data.json companion with a new gathered-field set; and the music section/pass removed (5d → Practical logistics). A second pass (/recommend) realigned dossier-data.json to the HTML's exact TRIP/LEGS model + controlled tag/icon vocabulary. QC ran via /pm (project-manager + qc-reviewer → GO) with three verified fixes applied.

### Files Created
- `~/.claude/.../memory/dossier-html-hosting.md` — next-session parking note (outside repo)
- `logs/scratchpads/2026-06-10-10-24-scratchpad.md` — continuity scratchpad

### Files Modified
- `references/dossier-workflow.md` — Pass 2 discussion gate + Step 4.4, trap-skip, 5d logistics, music removal, Step 11 tier/anchor, Step 12.5 JSON companion
- `references/dossier-template.md` — card micro-template, tiers, anchor, Section 8 = Practical logistics, structured-data companion realigned to HTML TRIP/LEGS model, weather 27°C→30°C fix
- `references/subagent-prompts.md` — per-place fields + hike data, Prompt 2b candidate-places, T1 festivals/sunrise-sunset, Prompt 5d logistics, controlled tag vocabulary
- `.claude/agents/dossier-orchestrator.md` — Step 4/4.4/11/12.5 behaviors
- `.claude/commands/destination-dossier.md` — interaction-count note
- `~/.claude/.../memory/MEMORY.md` — index line (outside repo)

### Decisions Made
- Aligned `dossier-data.json` to the HTML renderer's data model (operator /recommend judgment) rather than a generic schema + adapter — single-consumer file, so match the HTML's TRIP/LEGS shape + controlled vocabulary.
- Workflow produces the data file only; it does NOT own or generate the HTML shell (Patrik maintains it).
- Image handling: carry `image_query` + empty `image_url` slot, unrendered, pending the operator's image-source approach.
- QC fixes (via /pm): weather flag string 27°C→30°C; Location field routes to JSON lat/lng (not a card line); anchor "never zero" carve-out for empty Sections 3/4.

### Risky actions
None destructive. One near-miss: an intermediate commit swept 3 hook-staged `logs/` files (decisions, session-notes, scratchpad) — verified benign (session artifacts, not secrets), left as committed.

### Next Steps
- Next session: decide **inline-data vs fetch-JSON** for hosting the HTML dossier locally / on Cloudflare (see memory `dossier-html-hosting.md`). Quick wins: rename to `index.html`, deploy as a Pages folder not a loose file.
- Push: use the `patriklindeberg75-boop` GitHub account, not axcioncapital ("Repository not found" = wrong account).
- Consider syncing the modified shared command/agent (`destination-dossier.md`, `dossier-orchestrator.md`) back to ai-resources if they apply elsewhere.

### Open Questions
None.

## 2026-06-10 — Session S1

Make the Balkans dossier an uploadable website — clean UTF-8 index.html from Patrik's pasted prototype, reconcile stale Belgrade friend recs into the inline data, confirm self-contained (no fetch), provide Cloudflare Pages deploy steps.

## 2026-06-10 — Session S2

### Summary
Turned the Balkans dossier into an uploadable website. Patrik pasted his existing HTML prototype (data inline as TRIP/LEGS literals, but predating last session's Belgrade friend recs and corrupted with UTF-8 mojibake from the paste). Saved a clean self-contained `index.html`, reconciled the stale Belgrade section by folding in all 22 friend recs (14 sights + 8 food) with a new lilac "friend rec" badge, and surfaced the menu-not-schedule framing. Then set up single-source data (Approach A, Balkans-only): `dossier-data.json` is the source of truth and `build.mjs` regenerates the inline data block in `index.html` — verified idempotent and self-contained.

### Files Created
- `trips/balkans-2026-06/index.html` — self-contained, uploadable travel-companion website (clean UTF-8, friend recs folded in, generated data block)
- `trips/balkans-2026-06/dossier-data.json` — single source of truth (trip[] + legs[]), extracted from the live literals
- `trips/balkans-2026-06/build.mjs` — generator: JSON → inline TRIP/LEGS block in index.html (idempotent)
- `logs/scratchpads/2026-06-10-10-50-scratchpad.md` — continuity scratchpad

### Files Modified
- `logs/session-notes.md` — this entry
- `logs/decisions.md` — two decision entries (inline-data + friend recs; single-source setup)

### Decisions Made
- Ship as self-contained `index.html` with inline data (INLINE-DATA, not fetch-JSON) — operator chose his prototype as the shell + "Balkans one-off first". (logged to decisions.md)
- Set up single-source data (dossier-data.json + build.mjs), Balkans-only; dossier *workflow* left unchanged (deferred). (logged to decisions.md)
- Added a "friend rec" badge to the renderer to honor the "never drop friend recs, tag distinctly" principle.

### Risky actions
None. (Fixed mojibake by reconstructing correct UTF-8 rather than saving the corrupted paste verbatim — flagged to operator; data extracted by evaluating live literals to avoid transcription error.)

### Next Steps
- Fix the travel-os git remote (`patriklindeberg75-boop`, not axcioncapital) so the unpushed commits can ship.
- Optionally build a markdown-from-JSON generator to fully close the single-source loop (markdown currently not regenerated from the JSON).
- Confirm the 3 interpreted Belgrade spellings (Aviation Museum, Karađorđeva šnicla, šopska salad).
- Deferred: make the dossier workflow emit JSON+HTML for every trip.

### Open Questions
None.

## 2026-06-10 — Session S3

### Summary
Ran a diagnose-only UX pass on the Balkans dossier HTML (`trips/balkans-2026-06/index.html`), evaluated for actual in-trip use on mobile Safari / iPhone 16 Pro (internet available), weighted to jobs A (near me now), D (eat tonight), E (track done/want). Verdict: strong pre-trip briefing but a read-only prototype for in-trip use — nothing is tappable to a map, no location signal, no saved state. Produced two docs (diagnosis + workflow-additions), QC'd the diagnosis (GO). On operator pushback, rescoped the workflow-additions doc into a focused V1 (make places actionable) vs a deferred V2 roadmap. Diagnose-only — no fixes to the HTML or reference files.

### Files Created
- `trips/balkans-2026-06/ux-diagnosis.md` — verdict + 13 severity-triaged findings (MUST-FIX: F1 no map links, F2 no location signal, F3 no saved state, F4 no open-now), each tied to job A/D/E or mobile context with a one-line fix direction.
- `trips/balkans-2026-06/ux-workflow-additions.md` — V1 hard requirements (map_link, city, neighborhood, stable per-place id) vs V2 roadmap (saved-state, filters, search, structured hours/open-now, time-of-day, app polish, mobile hygiene). Core finding: the template spec is already ahead of the data + renderer.
- `logs/scratchpads/2026-06-10-11-18-scratchpad.md` — continuity scratchpad.
- memory: `dossier-v1-actionable-not-app.md` (+ MEMORY.md index line).

### Files Modified
- `trips/balkans-2026-06/ux-workflow-additions.md` — rewritten into V1/V2 structure after operator second opinion.
- `trips/balkans-2026-06/ux-diagnosis.md` — F4 fix-direction reconciled to the v1/v2 split.
- `logs/session-notes.md`, `logs/decisions.md` — this entry + one decision.

### Decisions Made
- v1 = make places **actionable** (locatable + tappable), NOT an interactive travel app; defer saved-state/filters/structured-hours to V2 until the basic loop is validated on a real trip. (operator second opinion; logged to decisions.md)
- Structured opening hours too fragile for v1 → optional free-text `hours_note`; computed "open now" deferred to V2.
- Renderer fixes (map links, localStorage, filters, safe-area CSS) stay Patrik's HTML — the workflow's job is to guarantee the DATA carries what those features need.

### Risky actions
None.

### Next Steps
- Run the **fix session** on the Balkans dossier: do V1 data work first (workflow emits id/city/neighborhood/map_link) — it unblocks the cheap renderer features. Then renderer (tappable cards + neighborhood shown).
- Carryover from S1/S2: fix the travel-os git remote (`patriklindeberg75-boop`, not axcioncapital) so the unpushed-commit backlog can ship; confirm the 3 interpreted Belgrade food spellings.

### Open Questions
None.

## 2026-06-10 — Session S4
**Mandate:** Apply V1 UX fixes (A1–A3) — add stable per-place id/city/neighborhood/map_link to every place in the Balkans dossier-data.json, regenerate index.html via build.mjs, and promote those four fields to required in the spec — done when: every place carries the four fields, index.html data block is rebuilt cleanly, and the spec marks the fields required with the map_link rule documented
- Out of scope: V2 features (saved-state, filters, search, structured hours/open-now, time-of-day, app polish); renderer/HTML shell logic (Patrik owns index.html)
- Files in scope: trips/balkans-2026-06/dossier-data.json, trips/balkans-2026-06/index.html (build-regenerated), references/dossier-template.md, references/dossier-workflow.md (inferred)
- Stop if: (none stated)

V1 UX fixes on the Balkans dossier per ux-workflow-additions.md (V1 scope): make every recommended place actionable — emit stable per-place id, city, neighborhood, and map_link in the data + spec layers.

### Summary
Shipped V1 "make the Balkans dossier actionable" — both the data layer and (operator-expanded mid-session) the renderer. Data: authored `neighborhood` + `city` on all 114 do/eat/avoid places; extended `build.mjs` to derive `id` (`{stop-id}-{kebab(nm)}`) and `map_link` (Google Maps search from nm+neighborhood+city, never fabricated coords) into the generated TRIP block, with a self-check that aborts the build if any place lacks nm/neighborhood/city. Spec: promoted the four fields from optional→required (A1) and documented the map_link + id rules and the authored-vs-derived split (A2/A3) in `references/dossier-template.md` + `dossier-workflow.md`. Renderer: place names + a new location line (neighborhood · city) are now tappable to Google Maps on each card. Two independent QC passes → both GO. Two commits landed.

### Files Created
- `logs/session-plan-2026-06-10-S4.md` — session plan for the V1 work.
- `logs/scratchpads/2026-06-10-16-30-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/balkans-2026-06/dossier-data.json` — added `neighborhood` + `city` to all 114 places.
- `trips/balkans-2026-06/build.mjs` — derive `id` + `map_link`; abort-on-missing self-check.
- `trips/balkans-2026-06/index.html` — data block rebuilt (commit 1); renderer JS/CSS for tappable name + location line (commit 2).
- `references/dossier-template.md`, `references/dossier-workflow.md` — A1/A2/A3 spec promotions.

### Decisions Made
- Authored-vs-derived field split: author `neighborhood`+`city` in the JSON; derive `id`+`map_link` in `build.mjs` (deterministic → DRY, removes a 114-row hand-typed error surface). Generated TRIP block still ships all four. (logged to decisions.md)
- Operator expanded scope mid-session to include the renderer (`index.html` shell JS/CSS), which the original mandate placed out of scope as Patrik-owned. Authorized at the "what's next?" gate.

### Risky actions
None. (Renderer edit touched Patrik-owned `index.html`, but only the JS/CSS outside the build.mjs data markers, with operator authorization and an independent QC GO.)

### Next Steps
- Fix the travel-os git remote (points at `patriklindeberg75-boop/traveling` → "Repository not found"); 9+ commits cannot push until corrected. Top blocker.
- Confirm 3 interpreted Belgrade food spellings (Aviation Museum, Karađorđeva šnicla, šopska salad).
- Optional V2: localStorage want/done toggles (data `id` is now ready), filters, search, structured hours / "open now".
- Eyeball `trips/balkans-2026-06/index.html` on iPhone — tap a few place names to confirm they open Google Maps.

### Open Questions
None.

## 2026-06-10 — Session S5
V2 renderer upgrades on the Balkans dossier index.html: want/done toggles (#1), tag/tier filters (#2), safe-area + tap-target hygiene (#4), section collapse memory (#5), Add-to-Home-Screen polish (#6), masthead spacing fix (#7).

### Summary
Implemented the six operator-selected V2 interactive features (the postponed roadmap in `ux-workflow-additions.md`) entirely in the renderer layer of `trips/balkans-2026-06/index.html`, then built a real app icon + web manifest to finish #6 properly. All edits sit outside the `build.mjs`-managed data block, so future data rebuilds preserve them — verified by re-running `node build.mjs`. Cross-checked the work against the 13-finding `ux-diagnosis.md`: 10 of 13 UX findings are now fixed; the 3 still open (F4 hours/open-now, F9 time-of-day, F10 text search) are the deliberately-deferred cluster, with F4 the only meaningful remaining in-trip gap (Job D "eat tonight").

### Files Created
- `trips/balkans-2026-06/icons/apple-touch-icon.png` (180×180) — iOS home-screen icon (route glyph, cream-on-accent).
- `trips/balkans-2026-06/icons/icon-192.png`, `icon-512.png` — Android/PWA maskable icons.
- `trips/balkans-2026-06/manifest.webmanifest` — web app manifest (name, standalone, theme/bg, icon set).
- `logs/scratchpads/2026-06-10-16-58-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/balkans-2026-06/index.html` — V2 interactive layer (CSS + render JS + head meta + 2 SVG symbols + toolbar/filterbar HTML); then icon/manifest head links.

### Decisions Made
- Want/done + section state persisted via guarded `localStorage` (try/catch for file:// / private-mode safety), namespaced `balkans:`; not persisting filter state (resets on reload by design).
- Authored-vs-derived split honored: filters/toggles consume the V1-derived per-place `id`; avoidCard left untouched (no toggles/filters on warning cards).
- App icon built from the existing `i-route` glyph in the dossier's own line-icon style (cream on accent green) rather than a new mark — keeps the icon set coherent. Rendered via headless Chrome from a 512 master, downscaled with `sips`.
- Icon shipped as companion files (`icons/` + manifest) rather than embedded — iOS ignores inline/data-URI app icons. Tradeoff: the dossier folder must be uploaded whole, not index.html alone.

### Risky actions
None. (Renderer-only edits to the operator-owned `index.html`, operator-authorized; independent QC GO; jsdom 26/26 + build-preservation verified before commit. Temp jsdom install was in /tmp, not the repo.)

### Next Steps
- **Top blocker:** fix the travel-os git remote (`patriklindeberg75-boop/traveling` → "Repository not found"); ~12 commits cannot push until corrected.
- Decide F4 (opening hours / "open now"): build the `hours_note` renderer slot + research hours to populate, or leave for now.
- Confirm the 3 interpreted Belgrade food spellings (Aviation Museum, Karađorđeva šnicla, šopska salad) — bad spellings → bad map links.
- Eyeball `index.html` on iPhone: tap place names → Maps; Add-to-Home-Screen → confirm the route icon shows. Upload the whole `trips/balkans-2026-06/` folder (index.html + icons/ + manifest), not index.html alone.

### Open Questions
None.

##  — Session 
Balkans dossier v3 rewrite — D0 (deploy fix) through D13, full scope per approved plan.

**Mandate:** Balkans dossier v3 full rewrite (hash routing, service worker, mode engine, skip+fold, filters, travel-day/cash/verify cards, P2 set) — done when: CHANGES.md written and Cloudflare deploy confirmed working.
- Out of scope: photos, coordinate research, fabricated facts
- Files in scope: trips/balkans-2026-06/index.html, build.mjs, dossier-data.json, manifest.webmanifest, sw.js (new), CHANGES.md (new)
- Stop if: routing rewrite destabilises the page — stop and flag

### Summary
Full v3 rewrite of the Balkans dossier (`trips/balkans-2026-06/index.html`) from a single scrolling page into a routed, offline-capable, mode-driven app, per the larger UX report `balkans-dossier-ux-fix-report-v2.md`. Built and committed in 3 verified tiers (D0–D13): Tier 1 skeleton (per-stop hash routing, top nav, service worker, de-announce), Tier 2 decision/relevance core (want/done/skip + fold + sort, mode engine, tooltips, area chips, time-of-day), Tier 3 content + P2 (travel-day leg cards, cash cards, verify+checklist, top-3 strip, search, export, theme toggle, booked). Independent `/qc-pass` returned GO. Reconciliation up front found ~6 report items already shipped in S4/S5; D0 deploy-fix was dropped from the critical path once the operator confirmed deploy is manual file upload, not git.

### Files Created
- `trips/balkans-2026-06/sw.js` — service worker (cache-first, versioned `balkans-v3-1`, offline precache).
- `trips/balkans-2026-06/CHANGES.md` — v3 changelog (shipped / skipped / known limits).
- `logs/scratchpads/2026-06-10-19-30-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/balkans-2026-06/index.html` — the v3 rewrite (routed shell, modes, decision states, filters, leg/cash/checklist cards, P2 set; data block untouched).
- `trips/balkans-2026-06/build.mjs` — added conservative `when` (time-of-day) derivation.
- `trips/balkans-2026-06/dossier-data.json` — added `currency` per stop (5 derivable country facts).
- `trips/balkans-2026-06/site/index.html` + `site/sw.js` — upload bundle synced to root (verified in sync).

### Decisions Made
- Full v3 rewrite now (operator), built in 3 tier checkpoints per the plan's routing risk-gate.
- Deploy is manual file upload to Cloudflare → git push is backup-only; D0 dropped from critical path.
- Diverged travel-os remote left untouched (force-pushed "Add files via upload"; reconcile not worth the risk; backup-only).
- "Skip content-dependent" = build derivable structures, omit author-only facts (no photos/coords/fabricated prices).
- Modes implemented as section-preset + heat cool-filter view-configs (not full §9 relevance recommender).

### Risky actions
Switched `gh` active account to patriklindeberg75-boop to probe the remote, then switched back to axcioncapital. No force-push, no destructive git op. Renderer-only edits to the operator-owned index.html (data block preserved; build.mjs re-run verified non-destructive each tier). Independent QC GO before wrap.

### Next Steps
- Upload `trips/balkans-2026-06/site/` to Cloudflare and eyeball v3 on the iPhone (routing, a mode, Add-to-Home-Screen, airplane-mode offline test).
- Confirm the 3 interpreted Belgrade food spellings (Aviation Museum, Karađorđeva šnicla, šopska salad).
- Optional: resolve the diverged travel-os git remote if offsite backup is wanted.

### Open Questions
None.

## 2026-06-11 — Session S1
Balkans dossier v3 → v4 round per balkans-dossier-ux-fix-report-v3-to-v4.md § 11 — Tier A floor (taxonomy v2, card pages, price tiers, state migration, QA) then Tier B (hero coords + vendored-Leaflet per-stop map).

**Mandate:** Balkans dossier v4 round per report § 11 — Tier A trip-critical floor (taxonomy migration, per-card pages, price tiers, localStorage key migration, QA pass, CHANGES.md, site/ sync) shipped as a deployable checkpoint, then Tier B (hero-set coordinate research + vendored Leaflet per-stop map with pin-list fallback) — done when: Tier A committed and deployable, Tier B map shipped or explicitly deferred with coords-missing worklist, CHANGES.md migration table written, site/ synced.
- Out of scope: photos (TODO-PHOTO slots only); long-tail coordinate research; work-café metadata research; content rewriting; backend/sync/recommender (report § 6)
- Files in scope: trips/balkans-2026-06/index.html, build.mjs, dossier-data.json, sw.js, CHANGES.md, site/, coords-missing.md (new)
- Stop if: taxonomy/state migration destabilises the working v3 page or risks wiping existing phone marks — stop and flag

### Summary
Full v4 round of the Balkans dossier per the operator's v3→v4 UX report § 11, shipped in three commits: (1) Tier A floor — five-category taxonomy per stop (Activities/Food/Work cafés/General information with nested sub-sections), a route per card with one-line index rows and full-prose pages (note field, next/prev, back-with-exact-scroll), €/€€/€€€ price tiers derived from existing copy, avoid-counterpart chips, and a localStorage migration that preserves all phone marks; (2) Tier B — 10 hero venue pins + 5 stop centers verified via OSM Nominatim and a per-stop "Map & pins" view (grouped pin list with raw coords; Leaflet deliberately deferred — every stop is below the agreed 5-pin threshold); (3) v4.1 author round — operator's in-use feedback applied (mode bar removed, sub-type merging removed, Start boxes/climate chip/top-3 strip/search bar removed, row titles wrap, Belgrade meta note cut). Independent QC: GO. 74 jsdom assertions green.

### Files Created
- `trips/balkans-2026-06/coords-missing.md` — map-coverage worklist generated by build.mjs (104 cards remain unpinned).
- `audits/working/2026-06-11-v4-dossier-qc.md` — independent qc-reviewer report (GO).
- `logs/scratchpads/2026-06-11-13-30-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/balkans-2026-06/dossier-data.json` — taxonomy fields (cat/also/pt/workMeta/instead), 10 lat/lng + 5 stop centers, Belgrade meta doNote removed.
- `trips/balkans-2026-06/index.html` — v4 renderer rewrite (taxonomy pages, card routes, map view) + v4.1 author-round declutter; data block untouched by hand.
- `trips/balkans-2026-06/build.mjs` — cat/pt validation + coords-missing.md generation.
- `trips/balkans-2026-06/sw.js` — cache v4-1 → v4-3 across the three ships.
- `trips/balkans-2026-06/CHANGES.md` — v4 + Tier B + v4.1 sections incl. 75-card migration table and TODO-PRICE list.
- `trips/balkans-2026-06/site/` — upload bundle synced each ship.

### Decisions Made
- Scope locked via /clarify → /scope: floor-first tiering, hero-coords-only, Leaflet conditional on ≥5 pins, photos deferred (operator).
- Leaflet NOT vendored this round — pin-list is the honest map view below threshold (operator's "don't ship impressive-but-empty" rule applied to the actual pin counts).
- Grill Loki / Bekimi / Milenko's left unpinned — OSM had no match (or a contradicting branch); no guessed coordinates.
- v4.1 author round overrides the report: fold rule dropped, mode bar removed (operator).
- Richer card descriptions deferred — source corpus has only one-line hooks; needs an explicit research pass.

### Risky actions
None. (Renderer/data edits to operator-owned dossier files; build.mjs re-run verified non-destructive each ship; state migration tested against seeded pre-v4 marks; no push, no deletions, no external publishing.)

### Next Steps
- Ask the operator for the **truncated feedback item** (message ended at "- make").
- Operator: upload `trips/balkans-2026-06/site/` to Cloudflare and eyeball v4.1 on iPhone.
- Optional next round: scoped card-description research pass (top picks first, ~15 places); TODO-PRICE (15) and coords long tail (104) await input.
- Carryover: confirm the 3 interpreted Belgrade food spellings; fix the travel-os git remote if offsite backup is wanted.

### Open Questions
- What was the operator's truncated "- make …" feedback item?

## 2026-06-12 — Session S1
**Mandate:** Implement the UX-PASS.md v4 fix round for the Balkans dossier — apply all 12 findings (F1–F12) to trips/balkans-2026-06/index.html in the document's fix order, chrome/behavior only — done when: all 12 fixes applied, affected jsdom journeys re-verified green, sw.js cache bumped, site/ synced, CHANGES.md updated, UX-PASS.md saved to the trip dir as the round spec.
- Out of scope: photos; card-description research; the truncated "- make" feedback item; Belgrade spelling confirmations; localStorage schema / content / taxonomy / dependency changes
- Files in scope: trips/balkans-2026-06/index.html, sw.js, CHANGES.md, site/, UX-PASS.md
- Stop if: a fix would require a localStorage schema change, content/taxonomy edit, or new dependency — stop and flag

Implement the UX-PASS.md v4 fix round for the Balkans dossier — 12 findings (F1 Blocker filter empty-state, F2–F4 Major nav/scroll/offline-indicator, F5–F12 Minor) per the document's fix order, chrome/behavior only (no localStorage schema, content, taxonomy, or dependency changes).

### Summary
Implemented the operator's full v4.2 UX-PASS fix round on the Balkans dossier — all 12 findings (F1 Blocker, F2–F4 Major, F5–F12 Minor) from the dropped `UX-PASS.md`, applied in the document's fix order, chrome/behaviour only. F1 added an active-filter count badge + "Nothing matches — Clear" empty-state (the cross-stop filter leak is now visible, not silently emptying a stop); F2–F4 fixed nav-tab clipping, smooth-scroll jank, and the buried offline indicator; F5–F12 covered tooltip toggle, router stop-fallback + hash correction, map-row state, sw navigate-only fallback, footer padding, tap targets, note-flush-on-nav, and dead-CSS removal. Verified by 112 jsdom assertions (61 + 15 + 36-test new suite); independent QC returned GO. Committed `81ad59c`; SW → `balkans-v4-4`; `site/` bundle re-synced.

### Files Created
- `trips/balkans-2026-06/UX-PASS.md` — the operator's UX-pass spec, saved clean UTF-8 as the round contract; Status footer updated to RESOLVED.
- `logs/scratchpads/2026-06-12-10-37-scratchpad.md` — continuity scratchpad.
- `/tmp/balkans-v4-smoke/test-v4c.mjs` — new 36-assertion v4.2 jsdom suite (ephemeral, not in repo).

### Files Modified
- `trips/balkans-2026-06/index.html` — F1–F7, F9–F12 (renderer + CSS); data block untouched.
- `trips/balkans-2026-06/sw.js` — F8 navigate-only fallback + cache bump v4-3 → v4-4.
- `trips/balkans-2026-06/CHANGES.md` — new "v4.2 — UX-PASS fix round" section.
- `trips/balkans-2026-06/site/index.html`, `site/sw.js` — upload bundle re-synced.
- `/tmp/balkans-v4-smoke/test-v4.mjs` — 10.6 updated to the new F6 contract (ephemeral).

### Decisions Made
- Treated `UX-PASS.md` as the binding contract; implemented exactly its 12 named "Proposed fix" entries, nothing beyond.
- F11 scope calls: included `.view details.mode-hidden` in the mode-system deletion (named family, zero refs); deliberately KEPT `.card.flash` (dead but not in the F11 list) and `.loc`'s 30px height (F10 said "leave the rest").
- F6: bad card slug falls back to its valid stop (not Overview) and `replaceState` cleans the stale hash — chosen over leaving the address bar stale.

### Risky actions
None. (Renderer/CSS/sw edits to operator-owned dossier files; jsdom-verified non-destructive; no schema/data changes; no deletions of live code; no push; no external publishing.)

### Next Steps
- Operator: upload `trips/balkans-2026-06/site/` to Cloudflare and eyeball v4.2 on iPhone (F2/F3/F4 need real-device visual confirmation — jsdom can't render layout).
- Optional next build round: scoped card-description research pass (top ~15 places); recover the truncated "- make …" feedback item before the next UX round.
- Carryover: confirm 3 Belgrade food spellings; fix the travel-os git remote if offsite backup is wanted; TODO-PRICE (15) + coords long tail (104) await input.

### Open Questions
- What was the operator's truncated "- make …" feedback item (carried from S1 prior)?

## 2026-06-12 — Session S2
**Mandate:** Implement the UX-PASS-MOBILE.md fix round for the Balkans dossier — apply M1–M3, M5–M11 (10 findings) in the document's fix order, chrome/CSS/one-liner fixes only — done when: all 10 fixes applied in order, affected jsdom checks green, sw.js cache bumped, site/ synced, CHANGES.md updated, UX-PASS-MOBILE.md saved to the trip dir with Status RESOLVED
- Out of scope: M4 (parked behind device check); localStorage schema changes; content/taxonomy edits; new dependencies; photos; F-series rework
- Files in scope: trips/balkans-2026-06/index.html, sw.js, CHANGES.md, site/, UX-PASS-MOBILE.md
- Stop if: a fix would require a localStorage schema change, content edit, or new dependency (M2's ~6 sanctioned non-CSS lines excepted) — stop and flag
- Allowed inputs: trips/balkans-2026-06/UX-PASS.md, trips/balkans-2026-06/build.mjs, trips/balkans-2026-06/dossier-data.json, CLAUDE.md
- Required outputs: trips/balkans-2026-06/index.html, trips/balkans-2026-06/site/index.html, trips/balkans-2026-06/sw.js, trips/balkans-2026-06/site/sw.js, trips/balkans-2026-06/CHANGES.md, trips/balkans-2026-06/UX-PASS-MOBILE.md
- Context pack: output/context-packs/project-20260612-b1c4e/pack.md
Implement the UX-PASS-MOBILE.md fix round for the Balkans dossier — apply M1–M3, M5–M11 (10 findings) to trips/balkans-2026-06/index.html in the document's fix order (M1→M2→M3→M11→M5→M6→M7→M8→M9→M10), chrome/CSS/one-liner fixes only; M4 parked behind a device check.

### Summary
Implemented the operator's full mobile UX pass on the Balkans dossier — 10 of the 11 findings in `UX-PASS-MOBILE.md` (M1–M3 Major, M5–M11 Minor), applied in the document's fix order, chrome/CSS only; M4 (status-bar style) parked behind a real-device check per the spec. Majors: note field no longer triggers iOS focus-zoom (M1); localStorage marks protected against Safari's 7-day ITP eviction via `storage.persist()` + an About install/backup sentence (M2); card pages gained a second full-width back link in the bottom thumb zone, on both normal and AVOID variants (M3). Minors covered scroll-restoration, landscape island clearance, sticky hover, double-tap zoom, long-press selection, Reduce Motion, and Maps-pin separation. Verified by 153 jsdom assertions (112 regression + 41 new M-series suite); independent QC returned GO. Committed `992868d`; SW → `balkans-v4-5`; `site/` re-synced.

### Files Created
- `trips/balkans-2026-06/UX-PASS-MOBILE.md` — the operator's iPhone 16 Pro UX-pass spec, saved clean UTF-8 (mojibake restored); Status updated to M-series RESOLVED / M4 PARKED.
- `logs/scratchpads/2026-06-12-13-30-scratchpad.md` — continuity scratchpad.
- `logs/session-plan-2026-06-12-S2.md` — session plan.
- `output/context-packs/project-20260612-b1c4e/pack.md` — context-engine pack (auto-generated at session start).
- `/tmp/balkans-v4-smoke/test-v4d.mjs` — new 41-assertion M-series jsdom suite (ephemeral, not in repo).

### Files Modified
- `trips/balkans-2026-06/index.html` — M1–M3, M5–M11 (CSS + ~5 lines JS/HTML); data block untouched.
- `trips/balkans-2026-06/sw.js` — cache bump v4-4 → v4-5.
- `trips/balkans-2026-06/CHANGES.md` — new "# v4.3 — Mobile UX-PASS fix round" section.
- `trips/balkans-2026-06/site/index.html`, `site/sw.js` — upload bundle re-synced (byte-identical).
- `/tmp/balkans-v4-smoke/test-v4c.mjs` — F8b cache-version check updated to v4-5 (ephemeral).

### Decisions Made
- Treated `UX-PASS-MOBILE.md` as the binding contract; implemented exactly its 10 in-scope "Proposed fix" entries, nothing beyond. M4 left parked as the spec directs.
- M3 applied to BOTH card-page variants (normal + AVOID) — both are card pages per the finding's rationale; the map page (no `.pgnav`) left out per the spec's named placement.
- Footer's right-edge `safe-area-inset-left` quirk (same bug class as M5) deliberately NOT fixed — not in M5's named container list; logged as a future-round candidate (QC concurred).
- jsdom lacks `history.scrollRestoration`, so the M11 behavioural check is guarded (`in`-check), with a source check covering presence — mirrors the code's own feature guard.

### Risky actions
None. (Renderer/CSS/sw edits to operator-owned dossier files; jsdom-verified non-destructive; no schema/data changes; no push; no external publishing.)

### Next Steps
- Operator: upload `trips/balkans-2026-06/site/` to Cloudflare and eyeball v4.3 on iPhone — M1/M3/M5/M10 are feel-on-device fixes; settle the parked M4 status-bar question in the same look (dark theme + standalone: is the clock readable?).
- Optional follow-up round: M4 (after device check) + the footer safe-area-right quirk; card-description research pass (top ~15 places).
- Carryover: truncated "- make …" feedback item; 3 Belgrade food spellings; fix travel-os git remote (3 unpushed commits now); TODO-PRICE (15) + coords long tail (104).

### Open Questions
- M4: does iOS 18 render the status bar unreadably in installed standalone + dark theme? (Device check required before any fix.)
- What was the operator's truncated "- make …" feedback item (carried from 06-11)?

## 2026-06-15 — Budapest dossier: sights expansion + cost rule + date-free flexible itinerary

### Summary
Budapest-focused work on the Balkans dossier (`trips/balkans-2026-06/`), three commits, push pending. Added 8 new see/do cards to Budapest (do: 8 → 16) — 7 free + BKK-travelcard-only must-sees plus Veli Bej Baths — selected against the personalization spine and a live weather check (Jun 18 ~31°C breaks the 30°C daily ceiling, so the set leans shade/cool-air/hills). Added an activity cost-threshold rule to the project CLAUDE.md (~€10–15 activities are recommendable, not free-only). Then removed all exact dates from the user-facing dossier per operator request, converting the five stops to flexible night ranges.

### Files Created
- `logs/scratchpads/2026-06-15-14-30-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/balkans-2026-06/dossier-data.json` — 8 new Budapest `do` cards (v4.4); all 5 stops' `when`/leg/transit-checklist dates removed and converted to night ranges (v4.5).
- `trips/balkans-2026-06/index.html` — rebuilt from data (build.mjs) twice.
- `trips/balkans-2026-06/sw.js` + `site/sw.js` — cache bump v4-5 → v4-6 → v4-7.
- `trips/balkans-2026-06/site/index.html` — deploy bundle re-synced.
- `trips/balkans-2026-06/coords-missing.md` — regenerated (now 112 cards; 8 new Budapest entries, 4 ★).
- `trips/balkans-2026-06/CHANGES.md` — new v4.4 and v4.5 sections.
- `CLAUDE.md` — added activity cost-threshold rule under Hard Constraints.

### Decisions Made
- Selected/shortlisted Budapest sights and made the must-see call when the operator explicitly asked for a recommendation (profile §1.1 normally has the system surface, operator pick; the direct ask overrides).
- No coordinates authored for the 8 new cards — build.mjs never fabricates coords; name-based Maps links + coords worklist instead.
- Did NOT change the route/Belgrade-bus date (operator's 3-day stay was only "might"); subsequently moot once all dates were removed in v4.5.
- Left `trip-context.md` frontmatter dates (Jun 16–29) intact — internal scaffolding that may feed weather/heat tooling; only the user-facing dossier was de-dated.

### Risky actions
None. (Content/data edits to operator-owned dossier files + one CLAUDE.md rule addition; build self-check passed each run; no push; no external publishing. jsdom smoke suite was unavailable (/tmp cleared) but changes were data/content-only with no renderer/CSS edits.)

### Next Steps
- Operator to confirm push at the wrap push gate (3 travel-os commits queued; ai-resources also has 1 pre-existing unpushed commit).
- Optional: scrub `trip-context.md` frontmatter dates too for full internal/external consistency.
- Before travel: verify schedule-dependent picks (Veli Bej session times; Cogwheel / Children's Railway timetables) — offer a Perplexity prompt.
- Optional: author coordinates for the new hero picks (Citadella, Margitsziget, Kerepesi, Erzsébet-kilátó) to put them on the in-app map.

### Open Questions
- Does the operator want `trip-context.md` dates removed as well, or kept as the trip's scoping record?

## 2026-06-15 — Session S1

**Mandate:** Complete dossier v5 Stage 3 for trips/balkans-2026-06 (filter bar rebuild + `any`-defect fix + smoke tests + CHANGES.md v5 + §11 route recommendation + deploy sync + SW bump) — done when: Stage 3 committed, build green, smoke tests pass, site/ synced, SW cache bumped.
- Out of scope: deciding the §11 route for the operator (recommend only); pushing (gated to /wrap-session)
- Files in scope: trips/balkans-2026-06/index.html, build.mjs, dossier-data.json, test/smoke.mjs, CHANGES.md, sw.js, site/sw.js, site/index.html
- Stop if: operator confirms imminent departure and asks to freeze the live app
- Context pack: output/context-packs/project-20260615-7b3e2/pack.md

Complete dossier v5 Stage 3: rebuild the §10 filter bar (Time/Purpose/Duration/State groups), fix the `any`-match defect, extend smoke tests, write CHANGES.md v5 entry + §11 route recommendation, sync deploy bundle, bump SW cache, commit.

### Summary
Completed dossier v5 Stage 3 for `trips/balkans-2026-06`, finishing the full v5 upgrade (Stages 1–3 now all delivered). Rebuilt the §10 filter bar into four groups (Time / Purpose / Duration / Show) with OR-within / AND-between semantics, and fixed the central time-filter defect: the old engine filtered on the derived single-value `data-when` with `cw==='any'||…` so a selected time block never excluded anything. The engine now filters on the authored `data-time[]` and enforces that a card lacking a group's attribute does not match a selection in that group. Extended the jsdom smoke suite 52 → 72 assertions, wrote the CHANGES.md v5 entry + a §11 route recommendation, synced the deploy bundle, and bumped the SW cache. Committed as `f61729c`.

### Files Created
- `logs/scratchpads/2026-06-15-15-30-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/balkans-2026-06/index.html` — filter engine rebuilt; `any`-defect fixed; legacy Rank-tier + Type-tag chips dropped; dead `.chip.tier` CSS removed; data block rebuilt.
- `trips/balkans-2026-06/site/index.html` — deploy bundle re-synced.
- `trips/balkans-2026-06/sw.js` + `trips/balkans-2026-06/site/sw.js` — SW cache `balkans-v4-7` → `balkans-v5-0`.
- `trips/balkans-2026-06/test/smoke.mjs` — extended 52 → 72 assertions (20 new filter-matrix tests).
- `trips/balkans-2026-06/CHANGES.md` — v5 entry (Stages 1–3 recap) + §11 route recommendation.

### Decisions Made
- Filter semantics: OR within a group, AND between groups; a card lacking a group's attribute does NOT match a selection in that group (this is the defect fix). Filters on authored `data-time[]`, never derived `data-when`.
- Q1 (operator gate default): dropped legacy Rank-tier + Type-tag filters; Heat-safe surfaced as a constraint instead.
- Q2 (operator gate default): §11 route recommendation written into the CHANGES.md v5 entry.
- Near base computes a live straight-line distance (≤2.0 km) at filter time, so it reflects a runtime-added base; cards without computable distance never match.
- §11 route: wrote a recommendation (keep provisional route subordinate; do NOT go fully destination-based) — did NOT decide it; that remains the operator's call.

### Risky actions
None. Content/code edits to operator-owned dossier files within one trip; build self-check green each run; jsdom smoke 72/72; no push; no external publishing.

### Next Steps
- Push the 4 pending travel-os commits once GitHub is reachable (network was down at /prime; push gated to this wrap).
- Operator decision owed: §11 route — keep-provisional (recommended) vs fully destination-based.
- Optional: scrub `trip-context.md` frontmatter dates (Jun 16–29) for internal/external consistency.
- Pre-travel: Perplexity prompt to verify Veli Bej session times + Cogwheel / Children's Railway timetables.
- Optional: author coordinates for the new Budapest hero picks (Citadella, Margitsziget, Kerepesi, Erzsébet-kilátó).

### Open Questions
- §11 route direction (keep-provisional vs destination-based) — recommendation given, operator's call.

## 2026-06-16 — Phase-1 research-layer idea triage + implementation plan

### Summary
Took the operator's consolidated travel-improvement ideas (`outputs/idea-consolidation-pass.md`, ~42 ideas already deduped) and produced a build-ready implementation plan for the Phase-1 pre-trip research workflow. Ran `/clarify` to lock scope (Phase-1 only; plan document, not build; independent re-triage), then triaged all 14 research-plausible ideas and specified the file-level changes. Plan only — no reference files edited this session. QC'd twice (plan-mode plan file, then the written deliverable); the deliverable QC caught a count error (said "6 ideas" where the table had 7 IMPLEMENT verdicts) which was fixed. Net plan: 7 ideas → 5 prompt/synthesis edits (Changes A–E) across `references/subagent-prompts.md` + `references/dossier-workflow.md`, zero new dossier-data.json schema fields.

### Files Created
- `outputs/research-layer-implementation-plan.md` — the deliverable: triage table + file-level change spec (A–E) + risk/parked register + build sequencing.
- `outputs/idea-consolidation-pass.md` — the operator-pasted source consolidation, saved verbatim (paste mojibake normalized) so the plan's provenance reference resolves.
- `logs/scratchpads/2026-06-16-21-58-scratchpad.md` — continuity scratchpad.

### Files Modified
- None (reference files deliberately untouched — plan-only session).

### Decisions Made
- Scope (operator, via /clarify + AskUserQuestion): Phase-1 research layer only; in-trip/post-trip ideas parked. Deliverable is a plan document, not a build. Triage done independently against the repo, free to override the consolidation's keep/cut.
- Triage outcome (analytical): 7 IMPLEMENT (#2 hidden-condition, #3+#5 experience framing, #4 destination thesis, #7 inspiration-never-decides rule-only, #13 crowd-mitigation timing pre-trip half, #14 access/permission gap); 3 SKIP (#1 scenes overbuild, #10 recipe + #11 three-versions collide with menu-not-schedule/mobile, #6 local-language already built); 4 PARK (#8 Maps, #9 photo, #13 in-trip half → Phase 2; #12 pattern library → Phase 3).
- QC fix: net-set count corrected 6 → 7 ideas in the deliverable (commit amended).

### Risky actions
None. Two new files written into outputs/ and committed (not pushed); no reference-file edits, no schema/build changes, no external publishing.

### Next Steps
- Build session: apply Changes A–E from `outputs/research-layer-implementation-plan.md` (Tier 1 = A,B,D,E text edits to subagent-prompts.md; Tier 2 = C in dossier-workflow.md). Verify cited blocks against live files first.
- Carryover (still open from 2026-06-15): §11 route decision; pre-travel Perplexity timetable check (Veli Bej / Cogwheel / Children's Railway); optional trip-context date scrub; optional coordinates for new Budapest hero picks.

### Open Questions
- None blocking.

## 2026-06-16 — Session S1

**Mandate:** Apply the 5 prompt/synthesis edits (Changes A–E) from outputs/research-layer-implementation-plan.md to the two dossier reference files, extending existing prompt blocks with zero new schema fields — done when: all five changes applied at their verified blocks, zero-schema-change invariant confirmed, committed.
- Out of scope: dossier-data.json schema or build.mjs changes; in-trip/post-trip ideas; build/dry-run; the four Albania-trip carryover items
- Files in scope: references/subagent-prompts.md, references/dossier-workflow.md
- Stop if: (none stated)

Auto mode: Apply Changes A–E from outputs/research-layer-implementation-plan.md to references/subagent-prompts.md (A, B, C-part1, D, E) and references/dossier-workflow.md (C-part2). Five prompt/synthesis edits, zero schema changes.

### Summary
Applied the five approved Phase-1 research-layer changes (A–E) from `outputs/research-layer-implementation-plan.md` to the two dossier reference files. Ran in auto mode off /prime menu item #1 (carryover from the prior plan session). All edits extend existing prompt/synthesis blocks — zero new `dossier-data.json` schema fields, no `build.mjs` change. Verified all six cited blocks against the live files before editing and confirmed the zero-schema-change invariant. Committed as `48d98b7` (not pushed).

### Files Created
- `logs/session-plan-2026-06-16-S1.md` — session plan for the auto-mode change application.
- `logs/scratchpads/2026-06-16-22-30-scratchpad.md` — continuity scratchpad.

### Files Modified
- `references/subagent-prompts.md` — Changes A (anti-tourist guardrail: hidden-condition rule + inspiration-never-decides), B (Prompt 3 experience framing + search phrasing), C-part1 (Prompt 2a/2b destination-thesis line), D (Best time crowd-mitigation window), E (Unverified permission/access flag).
- `references/dossier-workflow.md` — Change C-part2 (Step 11 intro bullet opens each stop's `intro` with the 2–4 point thesis).

### Decisions Made
- No new analytical decisions — this session executed the already-approved, already-QC'd plan from 2026-06-16. One judgment call: skipped the context-engine pre-step in auto mode because the implementation plan is itself a precise file-level spec.

### Risky actions
None. Two reference files edited (text-only, reversible via git), committed not pushed. No schema/build changes, no external publishing, no structural change classes touched.

### Next Steps
- Research-layer plan is now fully implemented — no build session remains. Next real-trip dossier run is the dry-run validation.
- Watch-item: Change A's "drop the place" instruction could thin long lists; if so, soften to "flag as low-confidence" (see scratchpad).
- Still-open Albania/Balkans carryover (untouched this session): §11 route decision; pre-travel Perplexity timetable check (Veli Bej / Cogwheel / Children's Railway); optional trip-context date scrub; optional Budapest hero-pick coordinates.
- Unbuilt: `/daily-program` in-trip workflow spec (Phase 2) at `outputs/daily-program-workflow-spec.md`.

### Open Questions
- None blocking.

## 2026-06-16 — Session S2 — Change F (Maps/photo reality-check) added to research layer

### Summary
Added Change F to the Phase-1 dossier research layer: the pre-trip half of previously-parked ideas #8 (Maps reality-check) and #9 (reverse-engineer the photo). Ran the full `/clarify` → `/decide` → implement chain in one session. Two bullets added to the shared anti-tourist guardrail in `references/subagent-prompts.md` (reaches all five list passes); Change F spec appended to the implementation plan and its stale "awaiting build" status flipped to implemented. Committed as `0025a31` (not pushed). Distinct second session today — `/prime` ran but never reached task-selection, so the S1 marker was not incremented; this note is filed under a manual S2 header.

### Files Created
- `logs/scratchpads/2026-06-16-22-28-scratchpad.md` — continuity scratchpad.

### Files Modified
- `references/subagent-prompts.md` — Change F: two bullets in the anti-tourist guardrail boilerplate (reality-check before keeping; deconstruct the inspiration photo), inserted after the inspiration-source bullet.
- `outputs/research-layer-implementation-plan.md` — Change F spec appended to Part 2; `Files touched` updated to six edits; frontmatter status flipped to implemented.

### Decisions Made
- **Mode-1 reconciliation (load-bearing):** Change F is candidate-discipline reasoning the research subagent applies from its own sources — NOT live Maps integration. The hands-on "Maps detective on the ground" half stays parked for Phase 2. Caught by the `/decide` QC subagent, which flagged the first framing as contradicting the plan's own no-Maps parking rationale (plan:60-61).
- **Soft-flag, not drop:** a failed reality-check routes to `rs:needs`/`rsNote` low-confidence rather than dropping the place — deliberately, to avoid compounding Change A's logged over-pruning watch-item.
- **Placement:** shared guardrail (not the per-place-fields block) so it propagates to all five list passes; verified embedding at subagent-prompts.md:202,257,316,371,415.
- Five `/clarify` questions settled autonomously via `/decide` (Decided 5 · paused 0).

### Risky actions
None. Two reference/plan files edited (text-only, reversible via git), committed not pushed. No schema/build change, no structural change class touched, no external publishing.

### Next Steps
- Dry-run validation of Changes A–F on the next real-trip dossier run is the only remaining research-layer work. Watch: Change F is soft-flag, so it should not thin long lists (unlike Change A's hard-drop).
- Still-open Albania/Balkans carryover (untouched): §11 route decision; pre-travel Perplexity timetable check (Veli Bej / Cogwheel / Children's Railway); optional trip-context date scrub; optional Budapest hero-pick coordinates.
- Unbuilt: `/daily-program` in-trip workflow spec (Phase 2) at `outputs/daily-program-workflow-spec.md`; and the review → profile/principles feedback wiring (Phase 3, not yet designed) — the biggest system-wide gap.

### Open Questions
- None blocking.

## 2026-06-17 — Bulgaria dossier: workflow tested end-to-end from zero (through Pass 4a)

### Summary
Drove the full Phase-1 dossier workflow from scratch on a new trip — Bulgaria western loop (Sofia → Bansko via the Septemvri–Dobrinishte scenic narrow-gauge train → Rila/Panichishte, 2026-06-22 to 2026-06-29, solo, 7 nights). Ran `/destination-check` (CONDITIONAL), `/trip-init` (scaffolded `bulgaria-2026-06`, timing SUBOPTIMAL/crowding-driven), and `/destination-dossier` through Pass 2 (locations), Pass 3 (activities + a targeted top-up addendum), and Pass 4a (dishes). Paused mid-Pass-4 before running the 4b venue prompt. Route was locked to the "Variant" (Plovdiv/Kapana dropped to keep the full train ride + a proper Bansko stop). Operator relaxed the weather ceiling and anti-tourist filter for this trip and self-manages work timing.

### Files Created
- `destination-checks/bulgaria-2026-06.md` — viability verdict (CONDITIONAL).
- `trips/bulgaria-2026-06/trip-context.md` — trip scaffold; route + nights locked, timing fields parsed, approved_locations / route_stops populated, operator constraints (Bansko backpacker+budget) recorded.
- `trips/bulgaria-2026-06/journal.md` — empty trip journal.
- `trips/bulgaria-2026-06/dossier/pass-2-state.md` — locations long-list + locked route.
- `trips/bulgaria-2026-06/dossier/pass-3-state.md` — activities short-list + merged addendum (option-clusters flagged as on-the-ground choices).
- `trips/bulgaria-2026-06/dossier/pass-4a-dishes.md` — "what to eat" dishes reference (21 dishes, 16 in target set, mapped per stop).
- `logs/scratchpads/2026-06-17-scratchpad.md` — continuity scratchpad.

### Files Modified
- `red-team.md` — logged a Phase-3 finding: Pass 4 should split dishes-discovery (4a) before venue-search (4b); workflow reference files still define the single-prompt version and should be updated in a build session.

### Decisions Made
- Route: chose the Variant (Sofia → Bansko via scenic train → Rila → Sofia), dropping Plovdiv/Kapana, to make the narrow-gauge train a real point-to-point leg rather than an awkward out-and-back. Operator-directed.
- Relaxed two profile defaults for this trip: weather ceiling waived; anti-tourist filter relaxed (Seven Lakes weekend accepted). Operator-directed.
- Work-timing constraint dropped from the planning logic (operator self-manages the 25h/week).
- Reordered Pass 4 into dishes-first (4a) then venues (4b) — operator's call; also logged as a workflow fix in red-team.md.
- Activity option-clusters (Sofia hike-vs-springs; Bansko 2nd-hike choices) deliberately left undecided in the dossier as on-the-ground choices (spontaneity principle §5.4).

### Outcome
COMPLETION: DELIVERED
EXECUTION: OPTIMAL
What was asked but not done: none — workflow intentionally paused mid-Pass-4 (4a done, 4b drafted) with a clean auto-resume state and one open operator question (tripe-soup venue); a designed gate, not abandonment.
Better path: none
Confidence: low (no formal mandate)

### Session Value Audit — 80/20 Review
TYPE: B — Dogfooding/usage test that exercised the Phase-1 dossier pipeline end-to-end on a real new trip, surfacing a design gap from real use.
VALUE: exec=H decision=M risk=N compound=H optime=H
SCORE: 9/10 — Clean end-to-end usage test that produced all claimed artifacts, locked a coherent route, and converted live friction (Pass 4 dishes-vs-venues ordering) into a logged, actionable workflow fix; not 10 only because the workflow reference files aren't yet patched (correctly deferred).
GATE: N/A (feature/usage work, not a structural-change gate)
OPPORTUNITY: Correct session — dogfooding the dossier workflow before promotion is exactly the right use; the Pass-4 ordering defect would not have surfaced any other way.
DECISION: Repeat — running the workflow on real trips is the intended validation path and keeps surfacing genuine design signal.
LESSON: Real-trip dogfooding surfaces prompt-ordering defects (dishes-before-venues) that paper review of the design did not catch.
RULE: No rule candidate.

### Risky actions
None. All writes were new trip artifacts + a red-team log entry; three commits made, none pushed. No structural change class touched, no external publishing.

### Session Assessment
Feedback collection (wrap Step 6.5) did not complete — the session-feedback-collector subagent died on an API socket error before returning a summary or writing any logs. Advisory step; no friction/improvement entries captured this session. The one concrete workflow signal (Pass 4 dishes-before-venues ordering) was already logged independently to red-team.md.

### Next Steps
- Resume the dossier: re-invoke `/destination-dossier --trip bulgaria-2026-06` (auto-resumes at Pass 4b from the pass-state files).
- First answer the open question below (tripe-soup venue), then run the Pass 4b venue prompt (already drafted) in Perplexity Pro and paste back → orchestrator writes `pass-4-state.md`.
- Then Pass 5 (practicalities: accommodation/sleep + inter-stop transport + local mobility), then synthesis into `trips/bulgaria-2026-06/destination-dossier.md`.

### Open Questions
- Pass 4b: target a Sofia tripe-soup (shkembe chorba / offal) venue, or skip it? Operator hasn't answered.

## 2026-06-18 — Bulgaria dossier completed (Passes 4b–5 + synthesis)

### Summary
Resumed the Bulgaria dossier from `/prime` and drove it to completion. Processed the operator's new trip notes (Sofia sights, food items, Plovdiv, Koprivshtitsa), ran Pass 4b (food venues — 14 keeps), Pass 5 (mobility + practical logistics; 5a tourist-trap pass skipped), and synthesized the full 8-section `destination-dossier.md`. Koprivshtitsa was added as a journey-break then parked after the rail research proved a same-day stopover impossible. Also logged a new workflow gap: there is no dossier-readiness QC gate.

### Files Created
- `trips/bulgaria-2026-06/destination-dossier.md` — full 8-section dossier (EUR throughout; Koprivshtitsa/Ednorog dropped).
- `trips/bulgaria-2026-06/dossier-data.json` — structured data companion (id/map_link fields pending a `build.mjs` run).
- `trips/bulgaria-2026-06/dossier/pass-4-state.md` — food venue triage (14 keep, 1 cut).
- `trips/bulgaria-2026-06/dossier/pass-5-state.md` — practicalities state (5a skipped).
- `logs/scratchpads/2026-06-18-11-48-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/bulgaria-2026-06/trip-context.md` — Koprivshtitsa added then removed; "Parked for a future trip" rationale note added.
- `trips/bulgaria-2026-06/dossier/pass-3-state.md` — Sofia culture cluster (Banya Bashi Mosque + Serdica) added; Koprivshtitsa marked DROPPED.
- `trips/bulgaria-2026-06/dossier/pass-4a-dishes.md` — byurek fold-in note.
- `red-team.md` — Phase 4 finding: missing dossier-readiness QC gate.
- `logs/dossier-runs.md` — run record appended by the orchestrator.

### Decisions Made
- **Koprivshtitsa + Plovdiv parked** for a future central-Bulgaria trip — rail geography (Sub-Balkan vs southern mainline) made a journey-break impossible; an overnight would have cost a Bansko hiking day. Operator-directed.
- **Sofia culture cluster** (Banya Bashi Mosque + Ancient Serdica complex) added to the Sofia stop.
- **Tripe soup (shkembe chorba) included** in the food search (operator eats offal) → Sofia venue Shkembedzhiinitsa.
- **Pass 5a (tourist-trap pass) skipped** by operator — anti-resort guardrail already baked into the Bansko food keeps + always-on anti-tourist filter.
- **Currency:** dossier uses EUR throughout (Bulgaria adopted the euro 2026-01-01); cash-heavy reality preserved.
- **Logged dossier-readiness QC gap** to red-team.md (Phase 4) at operator request.

### Risky actions
None. All writes were new/updated trip artifacts + a red-team log entry; five commits made, none pushed. No structural change class touched; no external publishing.

### Next Steps
- Verify the 3 places carried in the dossier as needs-verification: Baba Vuna hours, Bunderitsa Chalet hours, The Red Flat location.
- Book Panichishte accommodation (flagged critical — mountain base sells out).
- Optional: run the generic `/qc-pass` on the dossier as an interim readiness check (offered; operator hasn't decided).
- Build session: develop the dossier-readiness QC gate (red-team Phase 4) and split Pass 4 into 4a/4b in the workflow reference files (red-team Phase 3).

### Open Questions
None — tripe-soup and Koprivshtitsa both resolved this session.

## 2026-06-18 — Session S1
**Mandate:** Verify the three needs-verification places in the Bulgaria dossier (Baba Vuna hours, Bunderitsa Chalet hours, The Red Flat location) against current web sources and update the dossier — done when: each place is confirmed, corrected, or explicitly marked unverifiable in the dossier.
- Out of scope: Panichishte booking; full QC pass; workflow build session (other carryover items)
- Files in scope: trips/bulgaria-2026-06/destination-dossier.md (inferred)
- Stop if: (none stated)
- Verify 3 needs-verification places in the Bulgaria dossier: Baba Vuna hours, Bunderitsa Chalet hours, The Red Flat location.

### Summary
Two pieces of work after `/prime`. (1) Verified the three needs-verification places in the Bulgaria dossier via web sources (auto-mode menu item #1): Baba Vuna hours + address, Bunderitsa Chalet, The Red Flat. (2) Recalibrated the anti-tourist filter from a binary "exclude famous/mass-tourism" rule to a trap-tier filter ("some touristy is OK; only the Eiffel-Tower tier is flagged"), across all four operational layers plus travel-principles §4 under an operator-authorized ad-hoc exception.

### Files Created
- `logs/session-plan-2026-06-18-S1.md` — session plan for the dossier-verify task.
- `logs/scratchpads/2026-06-18-12-14-scratchpad.md` — continuity scratchpad.

### Files Modified
- `trips/bulgaria-2026-06/destination-dossier.md` — 3 places verified/corrected + closing checklist updated.
- `CLAUDE.md` — Hard Constraints anti-tourist line recalibrated to trap-tier.
- `references/subagent-prompts.md` — guardrail boilerplate + deprioritize line + "hidden gem" definition recalibrated.
- `references/dossier-template.md` — Section-3 filter note + "how to use" framing.
- `references/dossier-workflow.md` — synthesis-step anti-tourist filter.
- `profile/travel-principles.md` — §4 (header, §4.1, §4.3) recalibrated to v4 + changelog (operator-authorized ad-hoc exception to retro-only rule).

### Decisions Made
- **Baba Vuna**: hours verified daily 11:00–22:00; address corrected from "Tsar Simeon 16" to ul. Glazne ~67–69 (two web sources).
- **The Red Flat**: verified as a fixed daytime apartment museum (24 Ivan Denkoglu St, daily 10:30–18:00, ~€9) — contradicts the dossier's "anti-tourist art space, evening, relocates" framing; left in place with an in-line ⚠ flag for operator decision rather than silently swapped.
- **Anti-tourist filter recalibration** (operator-directed): binary → trap-tier; keep/cut test is "crowd-ruins-it / only-tourists-value-it," not fame.
- **Ad-hoc principle update authorized** (operator): updated travel-principles §4 now (v4) instead of deferring to the Phase 3 retro, to keep principle and workflow consistent. Profile §5 left untouched (already aligned).

### Risky actions
Edited a Phase-0 spine file (`profile/travel-principles.md`) outside the normal retro-only update path — done under explicit operator authorization and recorded as a v4 changelog exception, so the governance trail is intact. Otherwise none.

### Next Steps
- Decide whether The Red Flat keeps its evening slot in the Bulgaria dossier or gets dropped (now verified as a daytime ticketed museum).
- Book Panichishte accommodation (flagged critical — sells out).
- Optional: run `/qc-pass` on the dossier as an interim readiness check.
- Build session: dossier-readiness QC gate (red-team Phase 4) + split Pass 4 into 4a/4b in the workflow reference files (red-team Phase 3).

### Open Questions
None — all three verifications resolved; the Red Flat slot is an operator decision, not a blocker.

## 2026-06-18 — Session S2
Build the dossier-readiness QC gate (red-team Phase 4) and split Pass 4 into 4a/4b in the workflow reference files.
**Mandate:** Build the dossier-readiness QC gate (red-team Phase 4) and restructure Pass 4 into 4a/4b in the workflow reference files — done when: dossier-workflow.md reflects the 4a/4b split and includes a dossier-readiness QC gate; committed.
- Out of scope: (none stated)
- Files in scope: references/dossier-workflow.md (inferred); references/subagent-prompts.md if pass-4 prompts need splitting
- Stop if: (none stated)

### Summary
Session S2 had two phases. Phase 1 (pre-compaction): split Pass 4 into 4a/4b in both reference files (`subagent-prompts.md` and `dossier-workflow.md`) and added Step 13.5 dossier-readiness QC gate (8 criteria) to the workflow. Phase 2 (post-compaction, resumed): ran /qc-pass on the Bulgaria dossier — it returned NOT-READY with 8 findings — then fixed all 8 findings across both the markdown and JSON. The Bulgaria dossier now passes all 8 readiness criteria (with two section depth exceptions explicitly documented and justified from pass-state evidence).

### Files Created
- `logs/session-plan-2026-06-18-S2.md` — session plan for S2 (created pre-compaction)
- `logs/scratchpads/2026-06-18-wrap-S2-scratchpad.md` — continuity scratchpad (wrap)

### Files Modified
- `references/subagent-prompts.md` — Pass 4 → Prompt 4a (dishes, ChatGPT Pro) + Prompt 4b (venues, Perplexity Pro); routing table updated
- `references/dossier-workflow.md` — Steps 7/7.5/8/8.5 for 4a/4b; Step 13.5 QC gate (8 criteria); state file refs, Step 11 source, Step 12 table, resume logic all updated
- `red-team.md` — ADDRESSED block for Phase 3 (Pass 4 conflation) and Phase 4 (no QC gate)
- `logs/session-notes.md` — S2 header + mandate appended (session-start); wrap summary (this write)
- `trips/bulgaria-2026-06/destination-dossier.md` — all 8 NOT-READY QC findings resolved: 5 emoji promotions (Women's Market, SkaraBar 1, Banderishki Lakes, Banski Han, Rila Monastery → 🔥), Vihren Peak ⚠ added, Rila Section 4 expanded (3 new items → 4 total; 2 HIGH), Bansko S4 depth note, depth notes for constrained sections
- `trips/bulgaria-2026-06/dossier-data.json` — Red Flat corrected (hook/hours/cost/find_it/time/rs), Baba Vuna corrected (find_it/hours/rs), Panichishte moved tasks→critical, 5 tier promotions (t:2→3), Lakes Chalet added to Rila eat array, meta.renderer note

### Decisions Made
- **Pass 4 split**: dishes discovery (4a) must precede venue search (4b) — inverted order was a workflow design flaw; now fixed with `{priority_dishes}` placeholder flowing 4a→4b
- **Section depth thresholds**: ≥8 items / ≥3 HIGH for 3+ night stops; ≥4 items / ≥2 HIGH for ≤2 night stops
- **Rila Section 4 depth**: 4 items (Valyavitsa + Lakes Chalet + village shop + guesthouse breakfast) meets the floor; pass-4a explicitly anticipated minimal Panichishte food infrastructure
- **Bansko Section 4 depth**: 6/8 item floor — explicitly documented; pass-4 research found no additional qualifying budget-tier venues; 3 HIGH threshold met
- **build.mjs N/A**: This trip has no HTML renderer; build.mjs is balkans-specific; criterion documented as N/A in JSON meta
- **Baba Vuna address**: ul. Glazne ~67–69 confirmed (web 2026-06-18); original "Tsar Simeon 16" was incorrect; JSON corrected
- **Red Flat**: Verified as daytime ticketed museum (24 Ivan Denkoglu, €9, 10:30–18:00); original "anti-tourist art/social space, evening, donation" framing was wrong; JSON corrected; keep/drop operator decision still pending
- **Panichishte accommodation**: Reclassified from task to critical (confirmed sell-out risk: peak Lakes weekend + Sofia Live Festival overlap)

### Risky actions
None.

### Next Steps
1. Operator action: **Red Flat — keep or drop?** If keeping, it stays as 🆗 daytime culture option. If dropping, remove from both markdown Section 3 and JSON `do` array.
2. Operator action: **Book Panichishte accommodation for Jun 27–28** (in meta.critical; real sell-out risk).
3. Bulgaria trip departs Jun 22 — no further dossier work required unless operator directs a revision.

### Open Questions
- Red Flat: keep in dossier (🆗 daytime museum) or drop entirely?

## 2026-06-19 — Built /daily-program next-day planner command

### Summary
Designed and built the `/daily-program` command — the in-trip next-day planner that
turns an already-built destination dossier into one routed, Notion-paste-ready day
plan. Ran the build through plan mode with an independent `/qc-pass` that caught three
blockers (a non-existent `qc-reviewer` agent assumed for reuse; a schema mismatch —
no `map_link`/coords in `dossier-data.json`; a false verification claim), all fixed
before approval. After the first commit, added two operator-requested features:
a "do tonight" prep/booking block and a weather-reactive flip. Verified the mechanics
against the real Bulgaria dossier data at each stage.

### Files Created
- `.claude/commands/daily-program.md` — opus command, runs inline (9 steps); shows the
  long-list, takes an interactive pick, builds a walking/rest-guarded routed day, delegates QC.
- `references/daily-program-workflow.md` — methodology contract: halts, done-ledger spec,
  spine auto-apply, selection/routing logic, do-tonight sourcing, weather-reactive planning, QC checklist.
- `references/daily-program-template.md` — Notion-first output contract + inline Google Maps link format.
- `.claude/agents/day-plan-qc.md` — minimal independent QC reviewer (read-only; Read/Glob/Grep).
- `logs/scratchpads/2026-06-19-15-58-scratchpad.md` — continuity scratchpad.

### Files Modified
- `CLAUDE.md` — registered `/daily-program` + its two reference files under Workflow References;
  added `day-plans/{date}-{city}.md` + `day-plans/done.md` to the Trip Directory Convention.

### Decisions Made
- Output target: Notion-first with an inline gmaps link per place (overrides the dossier's
  no-inline-links rule for this artifact only).
- Done-tracking: persistent append-only ledger at `trips/{slug}/day-plans/done.md`.
- Spine: auto-apply defaults + note which were applied (no per-run toggle menu).
- Flow: show long-list → operator picks must/optional → build plan.
- Architecture: no orchestrator agent — run inline in the main session (operator-in-the-loop);
  independent QC via a new minimal `day-plan-qc` agent (travel-os has no reusable `qc-reviewer`).
- Feature scope: added #1 (do-tonight prep/booking) and #4 (weather-reactive flip);
  deferred #2 (work-block placement) and #3 (daylight/time-budget math) per the MVP rule.
- QC auto-fixes (from /qc-pass on the plan): build links inline; cluster by neighborhood
  (no coords); derive priority from integer `t`; corrected the false verification step.

### Risky actions
The new command + agent are `/risk-check` change-class artifacts; they received an
independent `/qc-pass` at the PLAN stage but the final built files were verified only
by in-session data checks, not an independent QC subagent. Low blast radius (project-local,
additive, no shared-state mutation). Noted for the QC-PENDING consideration below.

### Next Steps
- Push gate at end of this wrap (operator confirms). NOTE: this repo pushes to the personal
  `patriklindeberg75-boop` account — switch gh account before pushing.
- Optional: run `/refinement-pass` over the final command + references (operator hadn't decided).
- Real-trip validation: run `/daily-program` on a live Bulgaria day (trip starts Jun 22) to
  exercise the interactive pick, live `day-plan-qc`, and Notion paste. Running it before Jun 22
  hits the intended "city unresolvable" halt.

### Open Questions
- Run `/refinement-pass` now, or after the first real-trip use?

## 2026-06-22 — Bulgaria trip replanned (Thursday departure, Sapareva Banya, moderate hike)

### Summary
In-trip iteration of the Bulgaria plan (bulgaria-2026-06) off the existing dossier — no new
research. Restructured the back half of the trip (Rila base Panichishte → Sapareva Banya, monastery
dropped, Sunday-evening Sofia return), shifted the Bansko departure to Thursday to bank a Sofia work
day, and swapped the Pirin hike to the moderate Banderishki Lakes while keeping both lake hikes.
Verified bus/chairlift/taxi logistics via web search and cut the Rila day from ~€60 to ~€25. Plan of
record updated in trip-context.md across three commits.

### Files Created
- logs/scratchpads/2026-06-22-21-24-scratchpad.md — full session-state continuity scratchpad

### Files Modified
- trips/bulgaria-2026-06/trip-context.md — route_stops frontmatter + Locked Route prose + two Route Revision sections (3 commits)

### Decisions Made
- Narrow-gauge train: take the 12:40 departure (arrive Bansko ~17:00) over the 08:55
- Rila base: Panichishte → Sapareva Banya; Rila Monastery dropped; return via the Dupnitsa hop (Union Ivkoni)
- Seven Rila Lakes access: no chairlift — hike up/down, share-taxi/hitch the road (budget; ~€25 day vs ~€60)
- Sofia→Bansko departure moved to Thursday Jun 25 (Sofia 3n / Bansko 2n); Wed Jun 24 = full Sofia work day
- Pirin hike = Banderishki Lakes (moderate) over Sinanitsa/Muratovo; both lake hikes kept (Banderishki Fri + Seven Rila Lakes Sun)

### Risky actions
None.

### Next Steps
- Book Sapareva Banya (Jun 27) + Sofia return bed (Jun 28); mountain-rescue insurance; Mapy.cz "Bulgaria – South-West" offline; withdraw euro cash in Sofia.
- Optionally update destination-dossier.md return-leg section (still describes the old Panichishte relay) to match the revised route.
- Use /daily-program to generate fully-routed per-day plans during the trip.

### Open Questions
- Sync destination-dossier.md to the revised route, or leave it as the original research record? (trip-context.md is authoritative.)

## 2026-06-22 — Sofia day plan (Tue Jun 23) via /daily-program

### Summary
Ran /daily-program to plan Sofia for Tuesday Jun 23 — the first day plan of the live
Bulgaria trip (bulgaria-2026-06). Routed selection from the existing dossier, no new
research. Operator constraint: afternoon→evening only, 1pm start; staying at Hostel Mostel.
Built a compact central walking day around the operator's explicit picks, ran an independent
QC pass, applied the two fixes it returned.

### Files Created
- trips/bulgaria-2026-06/day-plans/2026-06-23-sofia.md — the routed day plan
- trips/bulgaria-2026-06/day-plans/ — directory created (first day plan of the trip)
- logs/scratchpads/2026-06-22-22-40-scratchpad.md — continuity scratchpad

### Files Modified
- None (besides the wrap logs)

### Decisions Made
- Added operator-requested off-pool places as labelled [extra — not from your list]:
  Alexander Nevsky Cathedral, Ivan Vazov National Theatre + City Garden, Old Palace/National
  Gallery — flagged as unresearched, verify hours on the day.
- Justified Alexander Nevsky against the anti-tourist filter (operator asked why it wasn't on
  the dossier list): holds up under the v4 trap-test (free, working cathedral, locals value it).
- Sequenced Museum of Socialist Art first — Tuesday is its only viable window all trip, hard
  ~17:30 close + metro detour. Made Old Palace interior optional to avoid over-packing.
- Morning-only t:3 items (Vitosha hike, Women's Market, morning banitsa) moved to "Skip for
  another day" with reasons — not silently dropped.
- QC (day-plan-qc) REVISE → fixed: Supa Star hours (was "closes 14:00", dossier says Mon–Fri
  11:30–20:00); Supa Star + KANAAL Maps links missing neighborhood segment.

### Risky actions
None.

### Next Steps
- After the day, operator reports what was actually done → update day-plans/done.md (not yet
  created) so completed activities auto-exclude on the next run.
- Run /daily-program for the next Sofia/trip day.
- Carryover (still open): bookings — Sapareva Banya (Jun 27), Sofia return bed (Jun 28),
  mountain-rescue insurance, Mapy.cz offline map, euro cash; optional destination-dossier.md
  return-leg sync to the revised route.

### Open Questions
None.

## 2026-06-23 — Bulgaria route replan (Revision 3): drop Rila, add Plovdiv, extend Bansko

### Summary
Mid-trip conversational replanning of the live Bulgaria trip (bulgaria-2026-06; operator
currently in Sofia). Cut the expensive Rila/Sapareva Banya overnight, added Plovdiv back as a
1-night stop, and gave the freed night to Bansko (now 3 nights, two Pirin hikes). New route:
**Sofia → Plovdiv (1n) → Bansko (3n) → Sofia fly-out** — a clean forward loop. No new research;
committed to trip-context.md. One follow-on question (Bansko 3n vs 2n+Sofia-Sunday) deferred.

### Files Created
- logs/scratchpads/2026-06-23-19-30-scratchpad.md — continuity scratchpad

### Files Modified
- trips/bulgaria-2026-06/trip-context.md — frontmatter route_stops + approved_locations
  rewritten; new prose "Route Revision 3 (2026-06-23, in-trip)" section added

### Decisions Made
- Dropped the Rila leg entirely (Sapareva Banya bed still too expensive; Seven Rila Lakes not
  feasible without a trailhead overnight). Seven Lakes + Rila Monastery parked for a future
  central-Bulgaria trip.
- Added Plovdiv back (1 night, Thu Jun 25) — reachable without backtracking via
  Plovdiv→Septemvri→narrow-gauge→Bansko. Work-from-Plovdiv day + evening Old Town/Kapana.
- Bansko → 3 nights (Fri–Sun, Jun 26–28); freed Rila night becomes a 2nd Pirin hike day
  (Banderishki + Sinanitsa). Swaps crowded weekend Rila lakes for quieter Pirin alpine.
- No Sofia return night — fly out via a Monday-morning Bansko→Sofia transfer.

### Risky actions
None.

### Next Steps
- DEFERRED decision: Bansko 3 nights (current) vs 2 nights + a Sofia-return Sunday night (do a
  shorter hike then bus to Sofia same day) for a safer Monday flight buffer. If the operator
  picks the 2n variant, update trip-context.md (Route Revision 4). trip-context currently
  reflects the 3-night version.
- Bookings still open: Plovdiv bed (Thu Jun 25), Bansko hostel (Jun 26–28). Dropped: Sapareva
  Banya booking + Rila chairlift/mountain-rescue items.
- Optional: research-pass Plovdiv before building a Plovdiv day plan (it was parked, so it's NOT
  in the vetted dossier). Then /daily-program for the next day.

### Open Questions
- Bansko 3n vs 2n+Sofia-Sunday (see Next Steps) — operator chose to settle later.
