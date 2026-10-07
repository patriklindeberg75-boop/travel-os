# Travel OS

Travel OS is Patrik's personal travel assistant and collection of travel ideas,
research, and reusable advice. Apple Notes remains the working itinerary.
The assistant operates through conversation using the records in this repository.

## Start here

- [Session guide](session-guide.md) for everyday requests.
- [Travel library](library/README.md) for ideas and reusable advice.
- [Trips](trips/README.md) for current and historical trip records.
- [Italy and Morocco](trips/italy-morocco-2026-10/trip-context.md) for the upcoming trip.

## Preferences and instructions

The October 7, 2026 goals and same-day sparring defaults extend the completed
September preference interview. [Travel goals](profile/travel-goals.md) explain
what makes a successful day, local discovery, and sidequests.
[Traveler profile](profile/universal-traveler-profile.md) and
[travel principles](profile/travel-principles.md) govern personalized recommendations.
[AGENTS.md](AGENTS.md) supplies the shared instructions for Codex and Claude Code.
[Assistant workflows](references/assistant-workflows.md) define capture, retrieval,
research, trip updates, and flexible planning.

## ChatGPT Project preparation

[Project instructions](references/chatgpt-project-instructions.md) are ready to copy.
[Setup notes](references/chatgpt-project-setup.md) identify the files to load and
the remaining plan-source and retrieval checks. No external project has been
created or connected by this preparation.

## Implementation status

The local instructions, library and trip records are established. Four core
repository-local skills are implemented:

- [travel-library](.agents/skills/travel-library/SKILL.md) saves and retrieves ideas and advice.
- [trip-manager](.agents/skills/trip-manager/SKILL.md) reconciles trip briefs and decisions.
- [travel-research](.agents/skills/travel-research/SKILL.md) investigates advice, routes and feasibility.
- [travel-companion](.agents/skills/travel-companion/SKILL.md) weighs choices and proposes flexible plans.

One [travel-consultants router](.agents/skills/travel-consultants/SKILL.md) selects
among four supporting perspectives: Mike Okay for sidequests, Bald and Bankrupt
for everyday local life, Drew Binsky for cultural understanding, and Yes Theory
for initiating shared adventures. The [consultant guide](references/travel-consultants.md)
includes portable project instructions;
[source notes](references/travel-consultant-sources.md) and
[bounded checks](pipeline/checks/travel-consultants/verification.md) state the evidence
and remaining real-use limits. Consult one or compare requested perspectives.

Travel-reflection is deferred.
Live research, YouTube summaries and hypothetical planning have bounded evidence.
Instagram and phone/cloud testing are deferred at Patrik's request.
Notes, calendar, and Instagram collection integrations are not connected.

The [reconciliation plan](pipeline/assistant-plan-2026-09.md) records approved decisions
and remaining work. [Current progress](pipeline/pipeline-state.md) distinguishes
local checks from unverified integrations. Earlier pipeline documents and Balkans
dossier material remain historical records, not current assistant requirements.
