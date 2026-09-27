# Research and companion skill checks

Verified September 27, 2026. Travel-research and travel-companion are implemented
as repository-local skills alongside travel-library and trip-manager. Reflection,
Instagram and phone/cloud work remain deferred.

Research preserves the requested question, sources, travel-date applicability and
uncertainty. It reuses the installed research-workflow-v2 for fresh investigation.
Companion uses the existing profile, trip context and evidence to recommend choices
and flexible plans. It routes confirmed updates through trip-manager.

## Evidence

Both skills passed skill-creator's `quick_validate.py`. The parent checked UI
metadata, all relative skill links and the installed file contents. A separate
evaluator continued in an isolated temporary copy with seven supplied requests and
fictional source material. It had no permission for network access, external writes,
commits or nested agents. Its skill files were byte-identical to the installed files.
No model-diversity claim is made.

| Case | Observed result inspected by parent |
| --- | --- |
| Reach accommodation for an 18:00 call | Used the newer cancellation notice, included the last leg and rejected reliance on an earliest theoretical 18:10 arrival. |
| Calculate route cost | EUR20 known fares, with missing access costs and seat availability explicit. |
| Read and save backpacker advice | Attributed tips retained; conflicting social-hostel anecdotes preserved; no destination ranking. |
| Plan two days with rain and a desired hike | Cancelled hike excluded on the affected day; following day conditional; EUR85 total and EUR42.50 average disclosed. |
| Discuss staying with people the user likes | Recommended staying without manufacturing a booking or work schedule. |
| Save an extra-night decision | Intention recorded as unbooked; withdrawn move/call remained historical; exact additional night stayed unspecified. |
| React to one quiet hostel evening | No standing preference change. |
| Guarantee the following day's hike | Refused to guarantee it from an offer and the previous day's notice. |

Seven user inputs cover these eight checks; cost was part of the route request.
The parent read the actual replies, research, library entry, trip brief, decision
history and indexes. Profiles were byte-unchanged in the test copy. Live library,
trip and profile records were untouched.

[Evidence snapshots](evidence.json) preserve the fictional sources, replies and
produced records. Embedded paths refer to that disposable copy, not live travel
memory. The evaluator disclosed stale status text in the copied documentation;
the live documentation now describes all four skills.

## Limits

This is one explicit-selection behavior check, not evidence of automatic selection,
live search quality, completed research-workflow execution or forecast accuracy.
The research skill's shared backend remains an external installed dependency.
No phone, cloud, Notes, booking or transcription integration was installed or tested.
No material behavior defect appeared in the supplied cases.

Laziness Protocol kept the existing workflow guide and research backend in place.
Prove It Works required checking generated records and arithmetic rather than
accepting the evaluator's summary. Cleanup checked links, metadata, placeholders,
capability statements and the scoped diff directly. No new production code was needed.
