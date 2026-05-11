# Technical Solution Brief: Mother Orchestrator Architecture

## Purpose

Sketch the architecture of the travel planning system Claude Code is being asked to build. This brief sets starting principles and constraints, but defers detailed technical decisions to Claude Code's judgment during the build.

## Architectural premise

**Claude Code is the mother system.** It is the user-facing entry point, the orchestrator, and the system of record for workflows and outputs. Other AI tools (ChatGPT, Perplexity, Gemini) are subagents Claude Code delegates to.

This premise is Patrik's working hypothesis. Claude Code may challenge it during the build if a different architecture (e.g., hybrid with a CustomGPT layer, or a Notion-centric architecture) would deliver Quality Criteria better. If Claude Code wants to deviate, it should flag the proposed deviation and reasoning before building.

## Layered architecture

```
┌──────────────────────────────────────────────────────────┐
│  PATRIK (iPhone primary, desktop for build/admin)       │
│  Capture: iPhone Notes, Google Maps                     │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│  CLAUDE CODE — MOTHER ORCHESTRATOR                       │
│  • Workflow command layer                                │
│  • Personalization input layer (Profile + Principles)    │
│  • Subagent routing layer                                │
│  • Output formatting layer (mobile-readable)             │
│  • Learning-loop layer (retro + profile/principles ver.)│
└──────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ ChatGPT Pro   │ │ Perplexity    │ │ Gemini (opt.) │
│ Subagent      │ │ Subagent      │ │ Subagent      │
└───────────────┘ └───────────────┘ └───────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│  EXTERNAL SOURCES (via subagents or direct)              │
│  Web search, AllTrails, Michelin, ResidentAdvisor,      │
│  GetYourGuide, GuruWalk, YouTube/TikTok references      │
└──────────────────────────────────────────────────────────┘
```

## Subagent routing — starting heuristic

Claude Code defines the final routing logic. As a starting heuristic:

| Task type | Suggested subagent | Why |
| --- | --- | --- |
| Wide-net ideation, brainstorming, "give me 30 ideas" | ChatGPT Pro | Patrik's prior methodology validated this |
| Source-cited validation, "is this still true," current events | Perplexity Pro | Real-time grounded sources |
| Synthesis, structured output, personalization application | Claude Code itself | Best at long-context structured reasoning |
| Cross-check / second opinion | Gemini (if added) | Diversity of model judgment |

This is a starting heuristic only. Claude Code may refine routing based on actual quality observed during builds.

## Subagent delegation — implementation modes

Claude Code chooses among three implementation modes per workflow, biasing toward the simplest that works:

1. **Manual handoff prompts.** Claude Code generates a prompt; Patrik pastes it into ChatGPT/Perplexity manually; Patrik pastes the result back. Acceptable for MVP.
2. **API delegation.** Claude Code calls subagent APIs directly. Better ergonomics; more setup cost.
3. **Hybrid.** Some workflows manual, others automated, based on frequency-of-use and friction.

Default to mode 1 for MVP. Promote to mode 2 only when frequency-of-use justifies the setup cost.

## Personalization input layer

Two documents are the ground-truth personalization spine:

1. **Universal Traveler Profile** — stable preferences, valid across all trips. Refined over time via the learning loop.
2. **Travel Principles** — operating rules and decision heuristics. Refined over time via the learning loop.

Both documents live in the Claude Code project repo. Every workflow that produces a user-facing output reads from both before generating. No workflow bypasses these.

## Output format requirements

Every user-facing output must be:

- **Readable on iPhone.** Plain text or markdown with short lines. No tables that require horizontal scrolling.
- **Paste-ready.** Sections clearly delimited so Patrik can copy individual sections into iPhone Notes.
- **Map-ready where applicable.** Place lists include enough info (name + neighborhood + city) to search in Google Maps. If technically feasible, output Google Maps share-links.
- **Categorized.** Outputs follow a consistent template Patrik gets used to, so finding the relevant section is fast during travel.

## Workflow structure — recommended pattern

Each workflow follows this internal structure:

1. **Read inputs.** Profile + Principles + trip context (destination, theme, dates, work-load, budget).
2. **Plan delegation.** Decide which parts of the output are best handled by which subagent.
3. **Execute delegation.** Manual or API per the chosen mode.
4. **Synthesize.** Apply Profile + Principles to filter, prioritize, and personalize the raw subagent outputs.
5. **Format for output.** Mobile-readable, paste-ready, categorized.
6. **Log.** Record what was done, what subagents produced, what Patrik used vs. ignored. This log feeds the learning loop.

## Storage and state

- **Profile and Principles:** versioned files in the repo. Updated only via Phase 3 retro workflow.
- **Trip outputs (dossiers, day plans):** stored per-trip in a trips/ directory. Useful for retros and for cross-trip pattern detection.
- **Trip journal:** Patrik's own notes. Stored in a known location (e.g., synced markdown file). Read by retro workflow.
- **Workflow logs:** Claude Code records subagent calls, outputs, and Patrik's usage patterns. Feeds learning loop.

## Decisions explicitly delegated to Claude Code

These are not decided in this brief. Claude Code makes the call during the build:

- Specific repo structure and file naming.
- Specific subagent prompts (these are part of the build deliverable).
- Specific routing logic per workflow (starting heuristic above is a hint, not a spec).
- Whether to use API automation or manual delegation per workflow.
- Whether to build direct integrations with iPhone Notes, Google Maps, AllTrails, Michelin, ResidentAdvisor, etc., or rely on output formatting for manual paste.
- Whether to add Gemini as a subagent (Patrik is willing to pay if it adds value).
- How to mechanize the learning loop (semi-auto preferred; manual fallback acceptable for MVP).
- How to handle YouTube/TikTok reverse-engineering as input — at build time only, or as a runtime input channel.

## Hard constraints (do not override)

- **Solo trips only.** No group-trip features.
- **1+ week trips only.** No short-trip features.
- **27°C ceiling.** Destinations exceeding this in trip dates must be flagged or excluded.
- **Routine respected.** Day plans must accommodate work + sleep + exercise + healthy eating.
- **Mobile-first outputs.** Internal docs can be desktop-formatted; user outputs cannot.
- **Anti-tourist filter.** Mass-tourism spots flagged. Hidden gems prioritized.
- **No custom dashboard.** iPhone Notes + Google Maps are the front-end.

## When to challenge this brief

Claude Code should flag a challenge to Patrik if:

- A core architectural choice (mother orchestrator, subagent delegation pattern) appears to actively prevent meeting Quality Criteria.
- A different stack (e.g., a CustomGPT-heavy or Notion-heavy alternative) would clearly produce better outputs.
- A constraint above creates an impossible tradeoff in a specific workflow.

In all such cases: flag, propose alternative, wait for Patrik's call. Do not silently deviate.
