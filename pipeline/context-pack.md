# Context Pack: Personal Travel Planning System (Claude Code Build)

## Objective

Design and document a Claude Code–based travel planning system that supports Patrik's solo-travel + remote-work lifestyle. The system must function as a **mother orchestrator** capable of delegating tasks to subagents (other AI tools — ChatGPT, Perplexity, Gemini, web tools) and acts as Patrik's personal travel agent across four functional layers: trip selection, pre-trip research, in-trip operation, and post-trip learning.

The executing AI (Claude Code) builds the system. Quality is judged by personalization fidelity, in-trip usefulness, and tourist-trap filtering — not by speed of build or zero-effort operation.

## Background

Patrik travels solo for extended periods (1+ week trips) while maintaining 25h/week remote work. He has previously developed a 6-phase travel research methodology in Notion using ChatGPT Pro, Perplexity, DeepSeek, and Claude in an ad-hoc way. That methodology has produced good outputs but is too manual, too fragmented across tools, and not yet a real system. He now wants to replace it with a unified, Claude Code–orchestrated system that compounds in value over time.

The motivation is concrete: travel as anti-routine medicine, deeper learning, more spontaneous human connection, and challenging himself out of his comfort zone — not relaxation. He wants more memorable experiences and fewer hours spent on research, while preserving the ability to "go with the flow" during trips.

## Scope

### In scope

- **Trip selection layer:** Help generate themed trip ideas, evaluate destination fit, optimize timing (best months to go), filter destinations against principles (e.g., 27°C ceiling, anti-tourist).
- **Pre-trip research layer:** Neighborhoods, accommodation logistics, food and restaurants, activities, transport, due diligence (open hours, ticket availability), cool-neighborhood identification, hidden-gem discovery, tourist-trap early-warning.
- **In-trip operational layer:** Day-before planning support, "what should I do tomorrow" sparring, daily program optimization around work routine, real-time recommendations, mobility suggestions (bike/scooter/bus), backup activity reserves, music recommendations matching local vibe.
- **Learning loop:** Post-trip journaling, feedback capture, profile/principles refinement, system iteration based on what worked.
- **Mother-orchestrator architecture:** Claude Code as primary system, delegation to subagents (ChatGPT, Perplexity, Gemini), integration with iPhone Notes and Google Maps as Patrik's existing capture stack.
- **Personalization spine:** System must consume the Universal Traveler Profile and Travel Principles documents (produced separately) as core inputs.
- **Solo trips, 1+ week duration, any geography.**

### Out of scope (explicit)

- Group trips and family trips (system is solo-only).
- Short trips under 1 week.
- Building a custom mobile app or dashboard from scratch — the system should integrate with existing apps (iPhone Notes, Google Maps) rather than replace them.
- Booking automation, expense tracking, photo organization, post-trip blog writing, trip-mate matching, flight search, visa/insurance handling, language learning — none of these were called out as needs and should not be added.

## Deliverable

A **Claude Code project** ("mother system") that:

1. Lives as a working Claude Code repo with documented commands/workflows for each functional layer.
2. Delegates tasks to subagents (ChatGPT via API or manual handoff prompts, Perplexity via API or manual, Gemini if added, web search) per a documented routing logic that Claude Code itself defines.
3. Reads the Universal Traveler Profile and Travel Principles as ground-truth personalization inputs.
4. Produces structured outputs (research reports, day plans, itineraries, hidden-gem lists, food shortlists) in a format Patrik can paste into iPhone Notes and Google Maps.
5. Supports a feedback/learning workflow that updates the profile and principles after each trip.
6. Ships in MVP form first; phased expansion is described in the Project Plan.

The executing AI's job is to build this. Architecture details (which subagents handle which tasks, how delegation is implemented, how the learning loop is mechanized) are delegated to Claude Code's judgment within the constraints documented here.

## Audience

Patrik is the sole user. Outputs from the system should be readable on mobile (iPhone) since most consumption happens during travel. Internal documentation (architecture, prompts, workflows) is for Patrik's reference and for future Claude Code sessions to operate the system.

## Facts (Confirmed)

These are ground truth from Patrik's stated requirements and constraints.

- **Travel pattern:** Solo trips, 1+ week duration, any country.
- **Work constraint:** 25h/week remote, requires reliable WiFi at least 4 days/week.
- **Budget baseline:** ~€50/day all-in, with willingness to splurge €100–150 on unique experiences.
- **Weather ceiling:** Avoid destinations over 27°C.
- **Friends-visit rule:** Stay max 4–5 days at a friend's place; treat friends as Plan B, never Plan A.
- **Routine maintenance:** Sleep, exercise, healthy eating must be preserved while traveling.
- **Capture stack:** iPhone Notes (idea capture), Google Maps (place pinning) — both are confirmed and the system integrates with these, not replaces them.
- **AI tool stack available:** Claude Code (5x subscription), ChatGPT Pro, Perplexity Pro. Gemini can be added if Claude Code judges it useful.
- **Existing assets Patrik will provide as inputs to the build:** Universal Traveler Profile (to be produced in a dedicated session — see Artifact 4), Travel Principles document (to be produced in a dedicated session — see Artifact 5).
- **Existing assets the executing AI may extract good ideas from:** Patrik's Notion-based methodology and prior trip notes — these will be shared if requested by Claude Code during the build.
- **Failure modes that must be avoided:** Generic recommendations, useless in-trip operation, tourist traps slipping through.
- **Acceptable tradeoffs:** Upfront effort to set up; meaningful per-trip input from Patrik; slower learning loop in early versions.

## Assumptions (To Validate)

- **Claude Code as mother system is the right architecture** — this is Patrik's hypothesis, not a hard constraint. Claude Code itself may recommend alternative or hybrid architectures during the build (e.g., a CustomGPT layer for certain tasks, or a Notion + Claude Code hybrid). Validate before locking architecture.
- **Subagent delegation is technically feasible at MVP scope** — delegation may initially be implemented as documented manual handoff prompts (Patrik runs them in ChatGPT/Perplexity manually) rather than full API automation. Validate during MVP scoping.
- **iPhone Notes and Google Maps integration can be achieved via output formatting alone** — i.e., the system produces text/links Patrik pastes manually, rather than direct API integration. Validate; if direct integration is feasible and adds value, Claude Code may propose it.
- **The Universal Traveler Profile and Travel Principles documents will be sufficient as the personalization spine** — if Claude Code finds gaps during the build, it should flag them rather than fill them.

⚠️ Do not treat assumptions as facts. If output relies on an assumption, flag it explicitly.

## Unknowns

- **Detailed subagent routing logic** — which tool handles which tasks. Claude Code defines this during the build. *Impact: not blocking. Defer to executing AI.*
- **Mechanism for the learning loop** — Patrik wants semi-auto (AI reads journal, proposes profile/principles updates, he approves), but the implementation is open. *Impact: not blocking for MVP. The MVP can ship with a manual-update fallback; semi-auto can be added in a later phase.*
- **Specific resource integrations** — AllTrails, Michelin Guide, ResidentAdvisor, GetYourGuide, GuruWalk are noted as Patrik's preferred sources for specific categories. Whether Claude Code integrates these via API, web scraping, manual prompts to subagents, or just documents them as recommended sources in outputs — open. *Impact: not blocking. Defer to executing AI.*
- **YouTube/TikTok reverse-engineering as research input** — Patrik mentioned this as a research method during the build. Whether Claude Code uses these as inspiration sources during build, or builds them in as runtime input channels (e.g., "paste a TikTok link, extract places"), is open. *Impact: not blocking. Defer to executing AI.*

## Inputs Available

The executing AI (Claude Code) will have access to:

1. **This Context Pack** — defines project intent, scope, constraints, quality criteria.
2. **The Project Plan** (Artifact 2) — phased roadmap from MVP to mature system.
3. **The Technical Solution Brief** (Artifact 3) — architecture sketch and starting principles.
4. **The Universal Traveler Profile** (Artifact 4, produced in a dedicated session) — personalization spine #1.
5. **The Travel Principles document** (Artifact 5, produced in a dedicated session) — personalization spine #2.
6. **On-request from Patrik:** prior trip notes, Notion methodology, Asia 25 traveler profile, YouTube/TikTok creator references.

The executing AI should not invent personalization details. If profile/principles content is insufficient for a build decision, flag the gap and request from Patrik.

## Constraints

- **MVP-first principle:** Build the smallest version that delivers value, then add functionality across versions. Do not over-engineer the first build.
- **Mobile-first outputs:** All outputs Patrik consumes during a trip must be readable on iPhone. Internal documentation can be desktop-formatted.
- **Existing-app integration:** Use iPhone Notes and Google Maps as the operational front-end. Do not build a custom dashboard.
- **Tool budget:** Use Claude Code, ChatGPT Pro, Perplexity Pro freely. Adding Gemini is acceptable if it adds value. Do not require any other paid tools without justification.
- **Personalization-first bias over low-effort:** When tradeoffs arise between depth of personalization and zero-effort operation, choose personalization. Patrik accepts upfront effort and per-trip input.
- **Flexibility preservation:** The system must support day-before planning and "go with the flow" — it must not force rigid week-ahead itineraries.
- **Routine integration:** The system must explicitly account for Patrik's work + sleep + exercise + eating routine when proposing daily programs.
- **No deadline:** Build at the pace that produces quality output. Phased delivery is preferred over a rushed full build.

## Quality Criteria

The system succeeds if, after Patrik's first trip using it:

1. **Personalization fidelity** — Recommendations clearly reflect Patrik's traveler profile and principles. Generic suggestions ("visit the main square," "try the local food") are absent or rare. Outputs sound like they were written *for him*, not for any traveler.
2. **In-trip usefulness** — Daily decisions ("what should I do tomorrow?") are meaningfully assisted. The system changes what Patrik actually does day-to-day, not just provides abstract advice. Day-before planning sparring works in practice.
3. **Tourist-trap filtering** — Mass-tourism spots are flagged and avoided. The "early warning system" Patrik wanted is operational. Hidden gems surface through the research outputs.
4. **Routine integration** — The system respects Patrik's work-sleep-exercise-eating routine when proposing day plans. It does not treat travel as a vacation from these.
5. **Flexibility preserved** — The system supports last-minute planning and improvisation. Does not over-prescribe rigid itineraries.

The system is allowed to be:

- **Effortful upfront** (acceptable tradeoff)
- **Slow-learning in early versions** (learning loop can mature in later phases)
- **Manually orchestrated at MVP** (subagent delegation can start as documented prompts before automating)

The system is **not** acceptable if it:

- Produces generic, non-personalized recommendations
- Fails to be useful during the trip itself
- Lets tourist traps slip through the filter

## Grounding Requirement

Before generating any user-facing output (research reports, day plans, itineraries), Claude Code should produce internal evidence that the output is grounded in:

1. The Universal Traveler Profile (which preferences were applied)
2. The Travel Principles (which principles were enforced)
3. The specific trip context (theme, timing, budget, work load for the period)

Outputs that cannot be grounded in these three sources should be flagged as generic, not delivered as personalized.

## Epistemic Discipline

Treat Facts as ground truth. Flag any output that relies on Assumptions. Do not fill Unknowns with fabricated information — acknowledge the gap and ask Patrik instead.
