---
name: trip-manager
description: Start, retrieve and reconcile Travel OS trip briefs, dates, reported bookings, open decisions and route changes from shared notes. Use when travel arrangements change or the user asks for the current trip context. Reusable inspiration belongs to travel-library.
---

# Trip manager

Keep one current brief per trip and preserve the history of decisions it replaces.
Apple Notes remains the working itinerary; this skill maintains only the context
Patrik supplies to Travel OS.

## Resolve the trip

Resolve the repository three directories above this skill's folder, not from the
shell's current directory. Read [AGENTS.md](../../../AGENTS.md),
[the trip index](../../../trips/README.md), and "Start or update a trip" in
[assistant workflows](../../../references/assistant-workflows.md).
If these records are unavailable, report the missing repository rather than
creating a competing trip store.

Match the named trip through the index and existing briefs. Read its
`trip-context.md` and `decisions.md` before editing. Ask which trip only when the
request and records leave multiple plausible matches. A newer file modification
time is not evidence of the user's current trip or location.

For a genuinely new trip, follow the workflow guide's folder naming and brief
shape. Unknown month, route or bookings do not block a minimal trip record.
Update the index to point to it. Repeating "start this trip" should reuse the
same record, unless the user identifies a separate journey.

## Reconcile shared context

Use the supplied statement's meaning and date. Keep these distinctions visible
in ordinary Markdown, without introducing a new schema:

- A possibility or assistant proposal remains tentative.
- A confirmed intention is a decision, but not necessarily a booking.
- A reported booking is attributable to the user; do not claim independent verification.
- Unknown location, dates or commitments remain unknown.

Update the current brief and add a dated supersession note to the decision log
when a confirmed choice changes. Reconcile affected route, accommodation, open
decisions and any summary in the trip index. Preserve unrelated choices. Remove
or label outdated proposals so they cannot be read as the current plan. Log the
same correction once when repeated or resumed after a partial write.

A pasted older note does not override newer context without resolving the conflict.
When an ambiguous statement would change a commitment, keep that part tentative
and ask the consequential question while saving any independent clear update.
A reported cancellation updates the record only; it does not cancel externally.
Do not infer an arrival from a proposed travel day or silently promote incidental
remarks into standing preferences. Record explicit trip overrides in this trip.

Use [travel-library](../travel-library/SKILL.md) for reusable ideas or advice.
Link selected library entries instead of copying them into the brief. Hypothetical
workflow tests stay outside live trip records unless the user adopts their content.

## Retrieve and finish

For "what is my current plan?", return a concise brief with its last shared date,
confirmed versus tentative arrangements, and material open decisions. Read-only
retrieval does not require a write. Mention stale or conflicting context when it
changes the answer; do not invent a live Notes/calendar connection.

After edits, read the brief, decision log and index together. Check for conflicting
current facts and broken relative links before reporting a save. Commit only
attributable changes under the repository rules. Explain what changed, what it
replaced and what remains uncertain. Never claim a local save is available on a
phone or cloud session unless that access was actually verified.

Researching alternatives and proposing new day plans use the shared research and
planning workflows. This skill records their outcomes; it does not book services,
manage work hours or make the user's travel decisions.
