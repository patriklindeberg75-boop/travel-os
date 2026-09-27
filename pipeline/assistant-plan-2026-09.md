# Travel assistant reconciliation — September 2026

Recorded: 2026-09-27. Source: Patrik's investigation and grilling conversation.
Status: direction and operating preferences approved; implementation sequence
below is a proposed plan, not evidence of completed setup or integration.

## Purpose and practical outcomes

Make this repository a useful personal travel assistant and a canonical home for
travel knowledge. Apple Notes holds the changing itinerary. The assistant helps
Patrik decide, research, and prepare suggestions he can use there.

1. Capture links and scattered notes conversationally, then retrieve their useful
   ideas later without manual filing.
2. Investigate travel questions and routes with sources, current checks where
   needed, and concise practical answers that reduce Patrik's research burden.
3. Propose flexible plans for the next two or three days using current trip
   context, weather, opening days, holidays, transport, and work needs.

Planning and decisions are documented. None of these operational outcomes has
yet been demonstrated in this reconciliation.

## Agreed boundaries

- Pause dossier development. Preserve existing research and the Balkans artifacts.
- Retain one folder per trip and a reusable cross-trip library.
- Keep Apple Notes as the working itinerary. Start with notes Patrik shares;
  investigate MCP access or Google Docs only if useful. No switch is committed.
- Defer calendar integration; no current calendar commitments were supplied.
- Keep the existing traveler preferences provisionally, with trip-specific
  overrides. Give ordinary opinions and recommendations while Patrik decides.
- Save explicit decisions and submitted ideas. Ask before promoting incidental
  remarks into lasting preferences.
- On receiving a Reel, save its ideas, insights, and source, then wait for further
  instructions before additional travel research. Label inaccessible or partial
  content honestly rather than inventing an extraction.
- Support YouTube links, Instagram Reels and collections, scattered notes,
  recommendations from other people, and insights from supplied reading material.
  Collection import is a requested capability, not an established integration.
- Keep ideas that conflict with present preferences, with relevant caveats.
- Stay within existing subscriptions and avoid routine technical maintenance.
- The laptop will not always be online. Dictated requests with written replies
  are an accepted initial fallback while laptop-independent live voice is tested.
- No requirement was adopted about proactively challenging a shortlist; Patrik
  explicitly omitted that interview question.

## Upcoming trip context

Latest stated timing: arrival in Italy around October 12, 2026; roughly one week
in Italy, then perhaps three weeks in Morocco. These are approximate intentions,
not confirmed bookings. This later statement replaces the original rough
"in one week" timing for planning purposes.

No arrival city, fixed route, booked transport, accommodation, exact end date,
or trip-specific work schedule has been supplied. Do not manufacture these.
One Italy–Morocco trip folder is a reasonable initial implementation choice.

## What exists and what needs reconciliation

- Profile and principles are populated. They contain reusable personalization.
- The implemented travel commands are destination-check, trip-init, and
  destination-dossier, with a dossier-orchestrator and manual research handoffs.
- A Balkans trip folder contains substantial research, a static-site build,
  and generated pages. Its journal is a placeholder, not usage feedback.
- In-trip assistance and learning remain in the old roadmap rather than
  demonstrated assistant workflows.
- session-guide.md contradicts itself about profile completion;
  pipeline/pipeline-state.md says no GitHub repository despite configured remotes.
- CLAUDE.md and the older architecture center dossier phases and manual handoffs.
  The principles prohibit route recommendations and restrict preference updates
  to post-trip retros. Reconcile these against the newly approved behavior.
- No new assistant runtime, library, or Italy–Morocco trip folder was found during
  the investigation. Existing unrelated untracked files must be preserved.

## Proposed implementation sequence

### 1. Establish usable repository instructions and memory

Reconcile CLAUDE.md, add Codex-facing AGENTS.md, and replace stale current-state
guidance with pointers to this direction, preserving history. Keep the assistant
usable through ordinary conversation rather than requiring slash commands.

Start with simple Markdown: a library for destination/experience ideas and
reusable travel advice, source references, a small index, and one folder per
trip. Separate tentative ideas, confirmed decisions, and checked research.
Avoid a second editable copy of the Apple Notes itinerary. Store the latest
shared context with its date so the assistant knows what may be stale.

Check: save a supplied idea, retrieve it from a fresh conversation, and distinguish
it from a booking or approved itinerary. Verify that old dossier instructions no
longer govern ordinary assistant requests.

### 2. Prove phone access and durable saving while the laptop is offline

Test Codex Cloud with this repository as a candidate execution environment.
Verify research access, reading the current branch, and how approved new knowledge
becomes available to a later task. A cloud-task diff alone is not canonical memory.
Do not require Patrik to manage Git for every saved idea.

Test dictated input and written results on the actual phone. Separately test live
voice retrieval, fresh research, and saving; preserve the accepted fallback if
the complete voice route is unavailable. Do not build a custom service merely
to assume this gap away. External account setup and publication are not implied
by this plan.

Check: with the laptop offline, capture an idea and retrieve it in a subsequent
phone interaction. Report any manual save/review step before adopting the route.

### 3. Add research and short-horizon planning

Give the assistant a repository-native research workflow for destinations,
transport, and activity feasibility, using available research tools. Replace the
old mandatory manual cross-model paste loop for these ordinary requests.

Research should produce a concise answer plus sources and checked dates for
changeable claims. Route answers should explain practical legs, timing and
cost uncertainty, and relevant alternatives. Recheck consequential schedules,
weather, opening days, holidays, and booking conditions when planning dates
approach; saved inspiration is not current operational evidence.

Plan two or three days from the latest shared notes and stated location. Account
for work, travel time, weather, geography, closures, and flexible alternatives.
Return a short Apple Notes-friendly proposal. Ask for missing facts only when
they materially affect the answer.

Check: research one real Italy or Morocco route and propose a short plan using
Patrik's supplied context; revise it after a changed location or weather forecast.

### 4. Add media intake and reusable learning

Reuse the installed media-transcriber skill and its existing Axcíon Research
helpers; do not copy or create a competing acquisition backend. Verify actual
runtime availability and portability before promising cloud transcription.

Retain source identity and acquisition limits. Keep full reading transcripts and
evidence distinct from the compact travel ideas extracted from them. For reading
material, retain attributable insights and source references rather than treating
every recommendation as universal advice.

Test individual YouTube and Reel links first, then investigate a supplied
Instagram Saved collection. The documented adapter does not establish collection
import. It currently recognizes English speech and does not capture on-screen
text. Authentication scope and inaccessible items need explicit handling.

Check: extract useful ideas from real supplied sources, recover their provenance,
and keep partial acquisition visibly partial. Save links even when extraction
must wait. Basic library capture need not wait for bulk import.

## Integration evidence and remaining limits

Official documentation inspected September 27, 2026:

- [Codex Cloud](https://learn.chatgpt.com/docs/cloud): repository-linked cloud
  tasks, configured environments, and reviewable results.
- [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment):
  repository checkout, setup dependencies, and configurable agent internet access.
- [Voice](https://learn.chatgpt.com/docs/features/voice): task-connected voice on
  desktop and via iOS Remote with a desktop host. This does not establish a
  laptop-independent live mobile voice integration with this repo.

Media acquisition instructions were inspected through the installed
media-transcriber skill and Research playbooks. No source acquisition, cloud
runtime, authenticated collection import, phone workflow, or Notes integration
has been tested in this session.

## Next action

Begin with repository reconciliation and basic library/trip memory, then prove
cloud capture and retrieval early. Resolve infrastructure limits through tests;
ask Patrik only when a discovered limit requires a meaningful scope, cost, or
experience decision. Use Italy–Morocco as the first practical trial.
