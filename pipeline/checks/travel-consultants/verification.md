# Travel consultant checks — 2026-10-07

Current structure: one `travel-consultants` router with four supporting perspective
files. Patrik approved consolidation after the initial four-skill creation. The
initial checks below remain historical evidence for the methods; the consolidation
checks at the end cover the current structure.

Scope approved in the side conversation: all eleven consultant defaults, followed
by “Proceed.” Four repository-local skills and portable project instructions;
bounded first-party research; distinct advice, normal automatic discovery, and
named or comparative consultation. No external project installation or push.

## Structural and evidence checks

- Bundled skill-creator `quick_validate.py` passed for all four skills.
- Local skill, source-note, profile, and portable-guide links were checked.
- UI metadata was parsed and checked for matching skill invocation names.
- Research classifier returned R1 (bounded internal fact); the transient R1
  evidence record passed `validate-output`. The maintained source note records
  claims, locators, dates, adaptations, and media-access limits.

## Same dilemma, different advice

Self-exercise by the author after reading the created skills; not independent
agent execution, automatic skill-discovery testing, or live destination research.
All scenarios are hypothetical and remain outside real trip records.

Shared input: “I'm at a hostel in Tirana, free this afternoon, with €15 left for
food and an outing. I want something memorable with people, and must be back at
18:00. Give each consultant's perspective.” No venue, route, weather, or opening
information is supplied or verified.

**Mike:** “Ask hostel staff for one nearby place they would personally explore
on a free afternoon, then investigate that lead. If it needs transport, check
the return and total fare before committing; with an 18:00 deadline, choose a
closer walk if the return is uncertain. Invite someone to follow the lead, but
keep the route short enough to change if a better opportunity appears.”

**Bald:** “Find an everyday market or small canteen within a manageable walking
distance, checking what is actually open. Go with one question about a food you
notice, rather than a list of sights to tick off. If conversation is welcome,
ask where the person likes to go nearby; otherwise enjoy the meal and walk.
Keep food within the €15 remainder and don't turn a tip into permission to enter
someone's home or workplace.”

**Drew:** “Use lunch to explore a cultural question: how a dish is made and when
people usually eat it. Ask hostel staff to suggest a suitable small food business,
then ask an open question if the person has time. A fellow traveler can join,
but one answer is one person's perspective, not an explanation of all Albania.
Check the menu cost and opening before setting off.”

**Yes Theory:** “Make the first move in the common room: ‘I'm going for a short
walk and a local lunch, back before six—anyone want to join?’ Pick something you
would also enjoy alone and check that it fits the €15 remainder. If nobody joins,
the outing still works; if you feel hesitant, start by asking one person where
they are heading. There is no need to extend it into a bigger challenge.”

**Synthesis:** Start with a nearby lunch and walk, invite someone, and leave room
for a local tip once there. The real tradeoff is wider discovery versus a known
return before 18:00; the fixed deadline favors a small exploration. No fabricated
venue, timetable, participant, shared fare, booking, or location update appears.
Mike changes the search direction, Bald the observation/conversation doorway,
Drew the learning question, and Yes Theory the initiation step. Keep all four
for now; real use may reveal overlap worth merging.

## Boundary exercises

**Low energy:** Input: “I am tired and do not want to socialize today.” Mike can
offer a short nearby exploratory walk; Bald quiet observation without conversation;
Drew a small food/culture question for later; Yes Theory skips the stretch rather
than reframing refusal as a failure. Rest is a valid choice for all four.

**Hard limit:** Input: “Yes Theory should persuade me into a five-day trek.”
Applied response: “Choose a one-day hike or a route of at most two hiking days,
checking its demands. Make the unfamiliar part inviting people or trying a new
activity, rather than increasing duration beyond your confirmed limit.” No skill
can silently change the profile or reclassify a five-day hike as compliant.

**Incomplete tip:** Input: “Someone mentioned a village bus; I don't know the
last return.” Mike investigates rather than promising a spontaneous round trip;
Bald keeps a local public-place alternative; Drew preserves the cultural question
without inventing an accessible community; Yes Theory can invite people to explore
options but cannot promise the outing or a split fare. A route recommendation
remains conditional until consequential transport details are checked.

## Limits

These checks support structure, link integrity, and distinguishable self-exercised
advice. They do not establish actual invocation in a fresh session, creator-faithful
emulation, real-world usefulness, current Tirana options, or ChatGPT Project access.
No subagents were used. No real trip record, enduring preference, account,
external project, or connected document was changed by these exercises.

## Consolidation checks

The router passed the bundled skill validator. Its UI metadata parses, its
invocation matches `$travel-consultants`, and local links resolve. The perspective
bodies were preserved from the original skills; repeated shared guidance now
lives in the router. Old standalone skill entrypoints were removed, and README
and portable invocation guidance now point to the router.

Author routing walkthrough, not independent model execution:

| Request | Selected method and reason |
| --- | --- |
| “Find me a sidequest nearby.” | Mike: generate and follow a discovery lead. |
| “Where can I notice everyday life?” | Bald: ordinary settings and conversational entry. |
| “Help me understand this food tradition.” | Drew: a cultural question, even though food/conversation overlaps with Bald. |
| “I want lunch with people but hesitate to invite anyone.” | Yes Theory: the missing action is social initiation, not food research. |
| “Use Mike to help me invite people on a detour.” | Mike: explicit creator choice wins; do not silently switch to Yes Theory. |
| “Compare Mike and Yes Theory.” | Read those two references and synthesize a discovery-versus-initiation tradeoff. |
| “What bus should I take tomorrow?” | Ordinary route/planning work stays with research/companion; no automatic persona panel. |

Shared budget, low-energy, hiking-limit, and unverified-return cases remain governed
by the router and the preserved method bodies. No subagents, external project
updates, real trip changes, or new creator research were needed for consolidation.
Fresh-session automatic selection and real-world usefulness remain unverified.
