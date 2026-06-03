# Session Guide — Personal Travel Planning System

**Generated:** 2026-05-11
**Scope:** Full remainder

## Where You Are

- **Current phase:** Phase 0 — Foundation (blocker active)
- **Last completed:** All six pipeline stages done. System is built and verified. `/trip-init` and `/destination-dossier` commands are live. `dossier-orchestrator` agent is wired. All reference files are in place.
- **Up next:** Populate both profile files (Phase 0 prerequisite). The system cannot produce any user-facing output until this is done.

---

## What's Next

### Phase 0 — Populate the personalization spine (do this first)

**Objective:** Give the system the two input documents it reads before every dossier run. Without them, `/destination-dossier` halts immediately.

**Both files are now fully populated** (profile v1 and travel-principles v3 — Phase 0 spine complete; this step is done).

**What you'll do:**

1. Open `projects/personal/profile/universal-traveler-profile.md` and paste in your Universal Traveler Profile content. This document describes who you are as a traveler — preferences, constraints, routines, non-negotiables.
2. Open `projects/personal/profile/travel-principles.md` and paste in your Travel Principles content. This document captures your decision rules — what you always do, always avoid, and how you weigh tradeoffs on a trip.
3. Save both files. They do not need to be perfect — they just need to be populated. You can refine them after the first trip via the Phase 3 retro.

**You'll know it's done when:** Both files have real content below the header line (no blank file, no placeholder comment only).

**Note on format:** No strict schema is required at Phase 0. Write in whatever structure feels natural — bullet lists, short paragraphs, both. The orchestrator agent reads them as prose and extracts the 3–5 most load-bearing preferences per trip.

---

### Phase 1 — Run your first destination dossier

**Objective:** Produce a full pre-trip destination dossier for a real upcoming trip, verify the output quality against your own judgment, and confirm the system is useful before any further build work.

**Before you start:**

- Both profile files must be populated (Phase 0 above — this is a hard gate).
- Have a real upcoming trip in mind: destination, rough dates, and a one-phrase theme (e.g., `anti-tourist remote-work`).
- Have ChatGPT Pro and Perplexity Pro open and ready. You will run eight prompts manually across the two tools.

**What you'll do:**

**Step 1 — Scaffold the trip.**

Run this command in Claude Code (from the `projects/personal/` directory):

```
/trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"
```

Replace the destination, dates, and theme with your actual trip details. Use `--work-load {hours}` if your weekly work hours differ from the default 25. Use `--forecast-max {celsius}` if you already know the forecast (otherwise leave it — unknown is fine).

This creates `trips/{slug}/trip-context.md`, `trips/{slug}/journal.md`, and a `trips/{slug}/dossier/` placeholder directory. The slug is auto-generated from destination + month (e.g., `lisbon-2026-06`).

You can open `trips/{slug}/trip-context.md` and add free-text notes in the `## Notes` section — anything that should color the dossier but doesn't fit the structured frontmatter (e.g., "I've been here before and want to go deeper, not broader").

**Step 2 — Run the dossier command.**

```
/destination-dossier --trip lisbon-2026-06
```

(Replace the slug with whatever `/trip-init` reported.)

The command runs a fast spine pre-check first. If either profile file is empty, it halts immediately with a clear message — go back to Phase 0.

If the spine check passes, it spawns the `dossier-orchestrator` agent, which reads your profile, your principles, and the trip context, then generates eight handoff prompts.

**Step 3 — The manual delegation loop.**

The agent pauses and presents eight prompts in a single message. Each prompt is labeled with:

- Section number and name (e.g., "Section 3 — Hidden-gem activity shortlist")
- Target tool: either **ChatGPT Pro** or **Perplexity Pro**
- The full prompt body in a fenced code block, ready to copy-paste
- An "expected output shape" one-liner so you can spot-check before pasting back

What you do next:

1. Copy each prompt to the indicated tool and run it.
2. Optionally save raw outputs to `trips/{slug}/dossier/{tool}-paste.md` before pasting back — useful for reference if you want to re-run a section later.
3. Paste all results back into the Claude Code session in a single block, labeled by section number (e.g., "Section 1: [paste]", "Section 2: [paste]", ...).

You do not need all eight sections to come back clean. If a section is missing or thin, the dossier marks it as incomplete and you can re-run just that prompt later. The system never fabricates a missing section.

**Which tool does which:** The routing is set in `references/subagent-prompts.md`. As a rough guide: ChatGPT Pro handles synthesis and nuanced neighborhood/food recommendations; Perplexity Pro handles factual retrieval (current hours, real-time local signals, tourist-trap verification). The exact routing is per-section and may be tuned after your first trip.

**Step 4 — Synthesis and output.**

Once you paste results back, the agent:

- Applies your anti-tourist filter (flags or removes mass-tourism spots)
- Applies your personalization filter (verifies each place against your profile preferences)
- Checks neighborhood + accommodation sections against your routine (cafe density, gym proximity, supermarket access)
- Formats the dossier per the mobile template

The dossier is written to `trips/{slug}/destination-dossier.md`. A grounding log entry (what was filtered and why) is appended to `logs/dossier-runs.md` separately — it does not appear in the dossier itself, keeping the output clean for iPhone.

**Step 5 — Review the dossier.**

Open `trips/{slug}/destination-dossier.md`. The structure is:

- Trip header (destination, dates, theme, work-load, budget, weather check)
- Section 1: Cool neighborhoods (3–5 neighborhoods with work-fit verdict)
- Section 2: Accommodation area recommendation (primary pick + rationale)
- Section 3: Hidden-gem activity shortlist (5–8 items)
- Section 4: Food / restaurant shortlist (6–10 items, daytime and dinner)
- Section 5: Tourist-trap warning list (4–6 places to avoid)
- Section 6: Mobility recommendation (bike / scooter / transit + cost estimate)
- Section 7: Optimal-timing assessment (dates verdict + local event signal)
- Section 8: Music-vibe recommendation (Spotify-ready playlist/artist names)

Each section ends with `---` for clean boundaries when scrolling on iPhone.

**Step 6 — Get it onto iPhone Notes and Google Maps.**

iPhone Notes:

- Paste the dossier section by section. The `## ` headers are the paste boundaries — each section is independently paste-ready.
- Keep each section as a separate note, or paste the whole dossier into one note with the `## ` headers as visual anchors. Either works.

Google Maps:

- Every place line in the dossier is formatted as `Name — Neighborhood, City`. This is directly Google Maps-searchable as-is.
- Search each place in Google Maps and save it to a list named after the trip slug (e.g., "Lisbon 2026-06"). The list is then available offline on your phone.

**You'll know it worked when:** You open the dossier on your iPhone before the trip and find at least three sections with specific, non-generic recommendations you would not have researched yourself in the same time.

The Phase 1 acceptance test is informal: run the dossier against one real trip, use it on the trip, and judge whether it delivered value. No formal criteria — you know your quality bar.

---

### Phase 2 — In-trip operational layer (future)

**Objective:** Add daily-program sparring and real-time decision support during a trip.

This phase is not started. It begins after Phase 1 has been tested on a real trip and you have approved the transition.

Deliverables will include: `/daily-program` (day-before planning), `/tomorrow-spar` (interactive sparring), a real-time place lookup, and a backup activity reserve pulled from the dossier.

---

### Phase 3 — Learning loop (future)

**Objective:** Close the loop. After each trip, capture what worked and update the personalization spine.

This phase is not started. It begins after Phase 2 has survived one full real trip.

**What to do after your first trip (interim, before Phase 3 is built):**

A Phase 3 retro workflow does not exist yet. Until it does, do this manually after returning:

1. Open your `trips/{slug}/journal.md` and write up what you noticed — what the dossier got right, what it missed, what you wish it had flagged.
2. Open `profile/universal-traveler-profile.md` and note any preferences that the trip confirmed, refined, or contradicted.
3. Open `profile/travel-principles.md` and note any principles that were tested.

Do not update the profile files ad-hoc mid-trip — the CLAUDE.md rule is that profile and principles update only via the Phase 3 retro workflow. But recording notes in the journal during the trip is exactly right — that is the raw material Phase 3 will use.

Once Phase 3 is built, the retro workflow reads your journal and proposes structured updates to both files, which you approve before anything is written.

---

### Phases 4–5 — Trip selection and automation (future)

**Phase 4 — Trip Selection Layer:** Helps you decide where to go next, not just plan a chosen destination. 3–5 candidate destinations with rationale, optimal-timing analysis, theme-fit scoring. Begins after Phase 3.

**Phase 5 — Automation and integration polish:** Converts manual subagent delegation to API where it reduces friction. Direct Google Maps list creation, iPhone Notes integration, resource-source integrations (AllTrails, Michelin, ResidentAdvisor, etc.). Begins after Phases 1–4 are proven on real trips.

---

## Key file locations

| File | Purpose |
| --- | --- |
| `profile/universal-traveler-profile.md` | Personalization spine — populate this first |
| `profile/travel-principles.md` | Decision-rules spine — populate this first |
| `trips/{slug}/trip-context.md` | Per-trip inputs scaffolded by `/trip-init` |
| `trips/{slug}/destination-dossier.md` | Dossier output written by `/destination-dossier` |
| `trips/{slug}/journal.md` | Your free-form trip notes (used by Phase 3 retro) |
| `trips/{slug}/dossier/` | Optional: save raw ChatGPT/Perplexity pastes here |
| `logs/dossier-runs.md` | Grounding log — what the orchestrator filtered and why |
| `references/dossier-workflow.md` | Workflow contract the orchestrator executes |
| `references/dossier-template.md` | Output structure and mobile formatting rules |
| `references/subagent-prompts.md` | Handoff prompt templates (ChatGPT Pro / Perplexity Pro) |

---

## Baseline Audit (one-time, do before first real use)

Run these two commands from the workspace root to establish a baseline audit and infrastructure inventory for this project:

```
/repo-dd
/analyze-workflow
```

This records the starting state of the system so future audits can diff against it. Do this once, after populating the profile files and before running the first dossier.

---

## After This Scope

The system build is complete. All remaining work is operational — not build work. Phase 0 unblocks everything: populate the two profile files and the full system is ready to use. Phase 1 delivers the first real value: a destination dossier you can take on a trip. Phases 2–5 extend the system after each phase is validated on real trips, in sequence. No phase begins without Patrik's approval after the prior phase's exit criteria are met.
