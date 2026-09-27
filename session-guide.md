# Use your travel assistant

Open this repository in your agent and speak or type normally. You do not need
slash commands, a trip theme, exact dates, or a dossier to begin.

The repository-local [travel-library](.agents/skills/travel-library/SKILL.md) and
[trip-manager](.agents/skills/trip-manager/SKILL.md) skills handle saved knowledge
and trip records. You can also explicitly request `$travel-library` or `$trip-manager`.

## Save something worth remembering

Send a note or link and say "Save this idea" or "Keep this travel tip".
The assistant saves the source and available insights in the [library](library/README.md).
If a video cannot be accessed, it saves the link with extraction marked pending.
It does not invent content or start further travel research without a request.

## Find what you have collected

Ask "What have I collected about Morocco?" or "Show my shared adventure ideas".
The assistant reads the matching records and links them in its answer.
An empty result means there is no matching saved knowledge, not that a place lacks options.

## Share trip changes

Paste the relevant Apple Note or dictate an update. Specify the trip when it is
ambiguous. "I might move tomorrow" stays tentative. "I booked a hostel" is a
confirmed statement whose missing details remain unknown.

The assistant updates the [trip brief](trips/README.md) and records confirmed changes
in its decision log. Apple Notes remains your working itinerary. There is no
automatic Notes or calendar connection.

## Ask for research or a short plan

Ask a concrete question, such as "How can I reach this village tomorrow?" Supply
an origin and date when needed. The assistant uses available research tools and
records sources, checked dates, and consequential uncertainty.

For planning, share your location and relevant commitments, then ask for the next
two or three days. The result stays a proposal until you choose it. Work-hour
management is outside the assistant's remit.

## Continue setup

The [reconciliation plan](pipeline/assistant-plan-2026-09.md) owns remaining work.
The preference interview, local record foundation and first two skill implementations
are complete. Travel-research and travel-companion remain unbuilt. Instagram and
phone/cloud tests are deferred. Do not assume local saves are available from your phone.
