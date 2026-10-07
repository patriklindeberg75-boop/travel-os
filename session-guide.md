# Use your travel assistant

Open this repository in your agent and speak or type normally. You do not need
slash commands, a trip theme, exact dates, or a dossier to begin.

The repository-local [travel-library](.agents/skills/travel-library/SKILL.md) and
[trip-manager](.agents/skills/trip-manager/SKILL.md) skills handle saved knowledge
and trip records. You can also explicitly request `$travel-library` or `$trip-manager`.
Use [travel-research](.agents/skills/travel-research/SKILL.md) for investigations and
[travel-companion](.agents/skills/travel-companion/SKILL.md) for choices and short plans.

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

For planning, share your location and relevant commitments, then ask for today or
tomorrow, with a loose view of the following two or three days. The result stays
a proposal until you choose it. Work-hour
management is outside the assistant's remit.

## Use a ChatGPT Project

Copy the [project instructions](references/chatgpt-project-instructions.md) and
load the files named in the [setup notes](references/chatgpt-project-setup.md).
The [travel goals](profile/travel-goals.md) explain success and sidequests.
External retrieval and saving have not yet been verified in the target project.

## Continue setup

The [reconciliation plan](pipeline/assistant-plan-2026-09.md) owns remaining work.
The preference interview, local record foundation and four skill implementations
are complete. Travel-reflection remains deferred. Instagram and
phone/cloud tests are deferred. Do not assume local saves are available from your phone.
