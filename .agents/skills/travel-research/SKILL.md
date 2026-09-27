---
name: travel-research
description: Research travel questions, backpacking advice, routes and activity feasibility with attributable evidence and current checks. Use when the user asks to investigate travel facts or practical options. Saved-knowledge retrieval belongs to travel-library; choosing a plan belongs to travel-companion.
---

# Travel research

Answer the travel question the user actually asked with enough checked evidence
for its intended use. Reading backpacking tips is not a request to rank bases or
construct an itinerary.

## Frame the question

Resolve this repository three directories above the skill folder. Read
[AGENTS.md](../../../AGENTS.md) and "Research a practical question" in
[assistant workflows](../../../references/assistant-workflows.md).
For personalized or trip-specific questions, read the applicable profile, named
trip brief and decisions through [the trip index](../../../trips/README.md).
Use [travel-library](../travel-library/SKILL.md) for relevant retained knowledge.
Do not treat old notes, captions or a previously successful route as current proof.

Distinguish advice reading, destination investigation and operational feasibility.
Use the scope the user supplied. For a route, resolve the origin, destination,
travel date and any explicit arrival deadline when they materially affect the
answer. Resolve "tomorrow" from the user's relevant local date; ask if unknown.
Never infer current location from a proposed itinerary. Make independent progress
while a consequential missing detail is pending, and label assumptions as such.

For fresh investigation, use the installed research-workflow-v2 skill from the
current catalog and its applicable route. Keep original results in Travel OS and
follow its evidence and release requirements without copying its implementation.
If that skill or a required tool is unavailable, disclose the limit. Use the shared
travel workflow for a bounded answer where possible; do not claim the unavailable
research process or validation ran. No manual model handoff is required for an
ordinary travel request unless the applicable research method requires review.

## Gather evidence for the intended decision

Prefer operators, venues, local service providers and official authorities for
changeable facts. Distinguish provider marketing, guest accounts and independent
reporting. Source quality and applicability matter more than how many pages agree;
several sites repeating one timetable are not independent verification.

For advice reading, extract useful practices, where they apply and contrary
experiences. Preserve attribution and distinguish anecdote from general advice.
Do not expand into destination selection unless requested.

For transport, cover the departure point, each leg, transfer and waiting time,
last useful departure, booking needs, fare basis and practical fallback. Include
access to the first departure and the final destination. Separate published
schedule from seat availability, per-person price from vehicle price, and journey
time from connection margin. Calculate the total from supported components and
show missing components rather than a fabricated precise total.

Check travel-date applicability, weather, closures, holidays and cancellation
conditions when they change feasibility. Prefer a current operator notice over an
older aggregator listing, and preserve unresolved conflicts. A seasonal average
is not a forecast. A guesthouse's guide service does not prove group availability.
A short hike's duration does not establish the user's fitness or current trail access.

Label consequential details as confirmed by the cited source, estimated,
conflicting or unknown. Say what was checked, when, and for which date. With no
current access, give a conditional answer and the smallest next check. Never
approve a tight connection based on an unverified last departure. Stop when further
available investigation will not materially improve the answer; explain remaining
gaps without turning missing search results into proof that a service does not exist.

## Deliver and retain

Lead with the practical answer, then the useful evidence, costs and fallback.
Link the source supporting each changeable claim and preserve its checked date.
Do not bury the recommendation in a research-process report.

Save trip-specific findings under the named trip's `research/` directory. Reuse
an existing record for the same question and make corrections visible. Use
[trip-manager](../trip-manager/SKILL.md) to link it from the brief without changing
commitments. Save reusable tips through travel-library with source and scope
limits. Read back saved records and commit attributable changes under AGENTS.md.
Do not create a trip folder merely to store general advice.

Use [travel-companion](../travel-companion/SKILL.md) when the request also asks
for a choice or plan. Supply the evidence and uncertainties; research itself does
not select a destination, book, contact an operator or change standing preferences.
