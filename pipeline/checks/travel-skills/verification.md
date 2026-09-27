# First two travel skills

Verified September 27, 2026. Scope was implementing travel-library and trip-manager.
Travel-research and travel-companion remain unbuilt. Reflection, Instagram and
phone/cloud testing remain deferred.

Both skills live in `.agents/skills/`, the documented repository discovery location
in [OpenAI's skill guidance](https://learn.chatgpt.com/docs/build-skills).
They use the existing shared workflow guide and Markdown records. No backend,
connector, transcription engine, global skill install or new service was added.
Default implicit invocation remains enabled; there is no explicit-only policy.

## Checks performed

- The skill-creator `quick_validate.py` passed for both installed skill folders.
- Parent checked UI metadata, relative references and both actual skill files.
- A separate evaluator context executed eleven sequential requests in a disposable
  copy. It received the skill paths and inputs, not the parent's expected results.
- Parent read the actual replies, library entries, trip briefs, decision logs and
  indexes. The evaluator used byte-identical skill files.
- Parent checked that live library, trip and profile files had no changes.

| Input | Observed result |
| --- | --- |
| Save Alex's Tafraoute village/lunch suggestion and supplied motivation | One attributed suggestion; unknown details preserved. |
| Submit the same suggestion again | Existing entry reused. |
| Retrieve collected Morocco knowledge | Research, video inspiration and unresearched recommendation distinguished. |
| Save a Reel URL with no content and no acquisition access | Pending entry; no invented publisher, destination or transcript. |
| Maybe stay at Example Hostel A, explicitly unbooked | Tentative possibility. |
| Report booking Example Guesthouse B instead | Current brief, decision log and trip index reconciled. |
| Repeat that booking correction | One supersession entry, no duplicate. |
| Supply older October 5 arrival notes as history | October 12 remained current; older note dated separately. |
| Start Portugal with no dates | One minimal undated trip, no fabricated commitments. |
| Repeat the start request | Existing trip reused. |
| Retrieve current Italy/Morocco brief | Reported booking distinct from intentions; remaining unknowns preserved. |

[Evidence snapshots](evidence.json) retain the actual replies and final synthetic
records. Links embedded inside snapshot strings refer to the disposable copy,
not to live trip files. These examples are test data, not Patrik's travel history.

## Limits and design decisions

This was one bounded run with explicit skill selection. It does not establish
automatic selector behavior, reliability across fresh user sessions, interrupted
writes, ambiguous trip matching, live media acquisition or cloud access.
The copied fixture omitted the historical Balkans brief and comparison research.
The evaluator disclosed those gaps rather than inventing their contents.

Laziness Protocol kept the shared workflow as the single maintained record guide.
Prove It Works required inspecting written records before accepting the evaluator's
summary. No material behavior defect appeared in these cases. No production code
was needed. Cleanup checked references, stale capability claims, placeholders and
the scoped diff directly. No PR or push follows from this local implementation.
