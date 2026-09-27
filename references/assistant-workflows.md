# Use Travel OS through conversation

Follow [the shared instructions](../AGENTS.md). Read only the records relevant to
the request. These are repository instructions, not an installed agent service.

## Capture a travel idea or useful advice

1. Read [the library index](../library/README.md). Search existing records by source,
   place, and topic before creating a file. Reuse the same record for the same idea.
2. Save destination or experience ideas under `library/ideas/`. Save reusable advice
   under `library/tips/`. Use a short descriptive filename. One coherent topic per file
   is enough; do not require one file for every sentence or mentioned place.
3. Include a title, capture/update date, source URL or supplied-note attribution,
   applicable places or conditions, the idea or lesson, and why it interested Patrik
   when he said so. Mark unknown locations or motivations as unknown.
4. Describe evidence accurately. Distinguish suggested, researched, and personally
   tried content. Separate an author's advice from Patrik's own experience. A label
   applies to the stated claims, not every detail in a source or record.
5. Add a relative link and short description to the library index. Link a selected
   idea from a trip brief rather than copying the library entry there.
6. Read back the saved entry and index link. Report the saved path and any extraction
   limits. If saving or indexing failed, report the partial result and repair it.

A link alone can be saved as pending extraction. Do not invent its contents.
Saving a source does not authorize a destination research project. Capture the
available insights and wait for further instructions about feasibility research.

For supplied books or transcripts, retain attributable insights and source locators.
Keep supplied originals unchanged. Separate claims from personal interpretation.
Use an applicable reading or insight-mining skill when substantive extraction needs it.

## Handle video sources

Use the installed `media-transcriber` skill for supported YouTube and Instagram
acquisition. Read its current instructions and check its required runtime. Its local
helpers are not bundled into this repo and are not proven available in the cloud.

For approved YouTube idea extraction, use the existing media-transcriber dependency
to analyze public captions temporarily outside Git. Missing license metadata alone
must not block an attributed summary. Save concise insights with source and timestamp
links, and state caption coverage and limitations. Do not claim complete coverage or
audio verification unless established. Temporary analysis does not authorize delivery
or archival of a full transcript; full-text retention rules still apply.

When full-text retention is permitted, keep transcripts and evidence at the acquisition workflow's permitted
location. Link them from the idea record. If a source pack is local-only, say so;
a local filesystem reference is not a portable cloud integration. Source URLs and
saved insights must remain useful without that pack.

Instagram Saved collection import is unverified. Save a supplied collection link
as pending unless its contents were actually accessed. Do not substitute an account
scan for a saved collection. The documented local recognizer covers English speech,
not on-screen text. Follow the skill's session authorization rules for cookies.
Keep cookies, transient media, and authenticated diagnostics out of Git.

## Retrieve collected knowledge

Read the library index, then search the idea and tip records for the requested
place or topic. Read matching records before summarizing them. Explain relevance
and limitations, linking each useful entry. Say when nothing matches. Retrieval
alone does not turn an unverified suggestion into current operational advice.

If an index link is missing or stale, search the files and repair the index as part
of the request. Never delete or replace edited content merely to make an index fit.

## Start or update a trip

Use `trips/README.md` to find an existing trip before creating another. If a request
clearly names that trip, reuse its folder. Ask only if multiple trips plausibly match.

For a new trip, create `trips/{destination-kebab}-{YYYY-MM}/trip-context.md` when the
month is known. Use `{destination-kebab}-undated` otherwise. Reuse the folder when
later details arrive. Add a suffix only for a genuinely separate trip with the same
name and month. Missing dates, a theme, and a viability assessment do not block setup.

The trip brief contains these sections:

- Last shared date and source of context.
- Approximate trip outline and explicitly confirmed commitments or bookings.
- Open decisions and missing facts.
- Links to selected library ideas and trip-specific research when they exist.
- Latest proposal, clearly labeled as a proposal, when one was requested.

Keep `decisions.md` beside the brief for confirmed choices and corrections. A
confirmed statement of an intention does not make its dates exact or its travel booked.
When Patrik changes accommodation or a route, update the current brief and add a
concise dated supersession note. Do not leave both versions listed as current.
If the statement is ambiguous, keep it tentative and ask the consequential question.
Do not overwrite a newer shared note with an older snapshot without resolving it.

Apple Notes remains the working itinerary. Record what Patrik shares and when.
Never infer his current location from the proposed itinerary. Do not request a work
schedule. Reuse standing preferences by reference and record only explicit trip overrides.

After updating, read the brief, decision log, and trip index together. Report a
save only after the intended change is present. If a multi-file update stops midway,
reconcile the existing files before retrying so a correction is not logged twice.

## Research a practical question

For food discovery, restaurant evaluation or local ordering tips, apply the
[food discovery playbook](food-discovery.md). Capture-only requests still use the
library workflow above.

Read relevant trip context and preferences. Ask for the location, date, or time
constraint only if it changes the answer. Use the available browsing/research tools
directly. There is no required external prompt handoff or dossier funnel.

Prefer transport operators, venues, and other primary sources for changeable
facts. For a route, establish departure points, connections, last departures,
booking needs, total estimated cost, and a practical fallback where possible.
Record source links, the date checked, the travel date the information applies to,
and whether each consequential detail is confirmed, estimated, conflicting, or unknown.
Do not present a timetable listing as proof that a seat is available.

Save reusable findings with applicability limits in the library. Save trip-specific
route or activity findings under the trip's `research/` directory and link them
from the brief. Create that directory when the first result exists. Reuse an
existing finding when updating it, with a new checked date and clear changed claims.

Answer the question concisely. If sources are unavailable or conflict, give the
supported portion and the exact uncertainty. Research does not authorize booking.

## Propose the next two or three days

Use the latest shared trip context, explicit commitments, preferences, and relevant
library ideas. Check current weather, opening days, public holidays, transport, and
booking conditions when those facts affect the proposal. Recheck old route research
for the actual travel date. Explain material uncertainty instead of filling gaps.

Group nearby activities and consider scenic travel and social opportunities. Keep
room for changes. Provide a recommendation, its reason, and a practical alternative
when useful. Show ordinary daily costs against the approximate €40 average and list
major transfers and exceptional excursions separately. Do not schedule work hours.

Give a short Apple Notes-ready proposal. If saved in the trip brief, label it as
proposed. Move choices into confirmed decisions only when Patrik confirms them.
