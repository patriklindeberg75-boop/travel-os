# Project Plan: Personal Travel Planning System

## Purpose

Phased roadmap for building Patrik's Claude Code–based travel planning system. MVP-first, then compounding functionality across versions. This plan is the build sequence — not a fixed timeline.

## Guiding principles for sequencing

1. **Personalization spine first.** No system functionality is worth building until the Universal Traveler Profile and Travel Principles documents exist. They are the input layer for everything else.
2. **One layer at a time.** Trip selection, pre-trip research, in-trip operation, and learning loop are four functional layers. Don't build all four at once. Build the highest-value layer first, then add.
3. **Manual orchestration before automation.** First version of subagent delegation can be documented prompts Patrik runs manually in ChatGPT/Perplexity. API automation is a later optimization.
4. **Use real trips as forcing functions.** Each phase should ship before a real trip and be tested against that trip. No phase ships without a planned use case.
5. **Patrik approves phase transitions.** Each phase ends with a review and a decision: continue to next phase, iterate within phase, or pivot.

---

## Phase 0 — Foundation (prerequisite)

**Goal:** Lock the personalization spine before any building begins.

**Deliverables:**

- Universal Traveler Profile (Artifact 4) — produced in dedicated session
- Travel Principles document (Artifact 5) — produced in dedicated session

**Exit criteria:**

- Both documents exist, are reviewed, and Patrik considers them stable enough to use as build inputs.
- Documents are stored in a known location accessible to Claude Code.

**Why this matters:** If the personalization spine is shallow, the whole system is shallow. This is the highest-leverage work in the project. Do not skip or rush it.

---

## Phase 1 — MVP: Pre-Trip Research Layer

**Goal:** Produce the highest-value pre-trip research outputs Patrik currently spends too much time on, with zero in-trip functionality yet.

**Why this layer first:** Patrik's existing Notion methodology is most mature here, so the gap between current state and good MVP is smallest. It also delivers immediate value before any trip starts. The in-trip layer is higher-impact but riskier — better tested in Phase 2 once the build pattern is proven.

**Deliverables:**

- Claude Code project skeleton with documented commands for pre-trip research workflows.
- A "destination dossier" workflow that, given a destination + theme + dates + work-load, produces:
    - Cool-neighborhood recommendations (with cafe/work-friendly criteria)
    - Hidden-gem activity shortlist
    - Food/restaurant shortlist
    - Tourist-trap warning list ("avoid these")
    - Mobility recommendation (bike/scooter/transit)
    - Accommodation area recommendation (proximity-optimized)
    - Optimal-timing assessment for the dates
    - Music-vibe recommendation
- Subagent routing logic for which tool produces which part (manual delegation prompts acceptable at MVP).
- Output format optimized for paste-into-iPhone-Notes and paste-into-Google-Maps.

**Acceptance test:** Run the workflow against one upcoming trip. Patrik judges output against Quality Criteria from the Context Pack. If three or more quality criteria pass meaningfully, MVP is shipped.

**Exit criteria:** Patrik uses the dossier on a real trip and reports back which parts worked and which didn't.

---

## Phase 2 — In-Trip Operational Layer

**Goal:** Add daily-program sparring and real-time decision support during a trip.

**Deliverables:**

- A "daily program" workflow that, given the destination dossier + Patrik's current work-load + previous days' notes, produces a day-before plan respecting his routine (work / midday activity / work / dinner-night).
- A "what should I do tomorrow" sparring mode — interactive, not one-shot.
- A "real-time DD" workflow — given a candidate place, check open hours / ticket availability / current relevance.
- A "backup activity reserve" — list of fallback options for slow days, pulled from the dossier.
- Mobile-readability tested on iPhone.

**Acceptance test:** Patrik uses the in-trip layer for at least 3 days of a real trip. System produces day plans he actually follows (in part) and tomorrow-sparring he uses for real decisions.

**Exit criteria:** In-trip layer survives one full real trip and produces feedback notes for Phase 3.

---

## Phase 3 — Learning Loop

**Goal:** Close the loop. After each trip, capture what worked and update the personalization spine.

**Deliverables:**

- A "post-trip retro" workflow — given Patrik's trip journal/notes, produces:
    - Proposed updates to the Universal Traveler Profile (preferences confirmed, refined, or contradicted)
    - Proposed updates to the Travel Principles (new principles learned, existing ones validated or contradicted)
    - System improvement suggestions (which workflow steps were useless, which were missing)
- Patrik-approval gate before profile/principles are updated.
- Versioning of profile and principles so changes are traceable.

**Acceptance test:** After one trip, the retro produces non-trivial proposed updates that Patrik finds worth approving.

**Exit criteria:** First trip retro completed; profile and principles are versioned; second trip is planned using updated spine.

---

## Phase 4 — Trip Selection Layer

**Goal:** Help Patrik decide *where* to go next, not just plan a chosen destination.

**Why this layer last:** Patrik already has good instincts for picking destinations. The selection layer is the lowest-priority gap. It also benefits most from a mature profile/principles, so deferring to Phase 4 lets it be built on the most refined personalization.

**Deliverables:**

- A "trip ideation" workflow — given a time window, work-load forecast, budget, and a theme idea (or open theme), produces 3–5 candidate destinations with rationale.
- Optimal-timing analysis across candidates.
- Theme-fit scoring against profile and principles.
- Decision-support format (not auto-pick).

**Acceptance test:** Patrik plans a future trip starting from this layer instead of starting from a destination already in mind.

**Exit criteria:** One trip is selected via this workflow.

---

## Phase 5 — Automation and integration polish

**Goal:** Reduce friction in the operating loop. Convert manual subagent delegation to API where it adds value.

**Deliverables (selected by Claude Code based on usage data):**

- API integration for ChatGPT/Perplexity/Gemini where automation reduces friction meaningfully.
- Direct Google Maps list creation if technically feasible and worth the effort.
- Direct iPhone Notes integration if feasible.
- Resource-source integrations (AllTrails, Michelin Guide, ResidentAdvisor, GetYourGuide, GuruWalk) where they add value.
- Performance and ergonomics improvements based on Phases 1–4 friction logs.

**Exit criteria:** System operates with measurably less friction than Phase 3. Patrik confirms ergonomics improvements are real.

---

## Cross-phase principles

- **No new phase begins until current phase has shipped to a real trip and produced feedback.**
- **No automation is added before its manual version is proven useful.**
- **Profile and principles are updated only via the Phase 3 retro workflow, not ad-hoc mid-trip.**
- **Each phase ends with a written retro: what worked, what to change, what's next.**

## What's deliberately not in this plan

- A fixed timeline. There is no MVP deadline. Phases ship when they're ready.
- A scope that grows beyond the Context Pack. New ideas (e.g., trip-mate matching, expense tracking) are deferred to a separate "future ideas" backlog and not added to phases without re-scoping.
- A commitment to specific tools beyond the locked stack (Claude Code + ChatGPT Pro + Perplexity Pro + optional Gemini). New paid tools require justification.

## Risk register

| Risk | Mitigation |
| --- | --- |
| Personalization spine (Phase 0) is rushed and shallow | Treat Phase 0 as blocking. Don't start Phase 1 until both documents are reviewed. |
| MVP scope creep — Phase 1 tries to do too much | Hard cap on Phase 1 deliverables. Anything not on the list is Phase 2+. |
| Subagent delegation never gets automated, system stays manual forever | That's acceptable. Manual is fine if it produces quality output. Automation is optimization. |
| Learning loop doesn't actually close — profile/principles never update | Phase 3 acceptance test is the forcing function. If first retro produces no updates, the retro workflow is broken and must be redesigned. |
| Patrik builds the system, then doesn't use it on real trips | Phase exit criteria require real-trip use. No real-trip use = no exit. |
| Quality criteria slip — system produces generic outputs that pass acceptance anyway | Patrik must actively judge against Context Pack quality criteria, not a softer bar. |
