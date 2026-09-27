# Food discovery playbook

Use this playbook to find worthwhile local food, evaluate places to eat and explain
local ordering practices. Start with dishes and experiences, then find places with
specific evidence for them. Popularity, obscurity and star ratings alone do not
establish quality or value.

Maintained in Travel OS. Refined after a practitioner-method QC pass on 2026-09-27.
Based on the
[researched proposal](../pipeline/proposals/food-discovery/proposal.md).
This is operational guidance, not a validated predictor of meal quality. A first
[Marrakech desktop research trial](../library/ideas/marrakech-food.md) ran on 2026-09-27.
Meal quality, phone/cloud use and Maps integration remain unverified. See the
[QC findings and changes](../pipeline/proposals/food-discovery/qc.md).

Use it through [travel-research](../.agents/skills/travel-research/SKILL.md) and the
installed research-workflow-v2. The shared research method governs evidence and
release; [assistant workflows](assistant-workflows.md) govern saved records.
A request to save a food link alone belongs to travel-library and does not trigger
restaurant research. A recommendation remains a suggestion, not a booking.

## Principles

- Find people who know the food, then follow specific dishes and preparations.
  A writer's fame or a review count is weaker than relevant firsthand detail.
- Match the recommendation to Patrik's taste, budget and current situation.
  Expertise and personal fit are separate judgments.
- Combine advance research with optional discovery on foot. Leave room for an
  unexpected stall, bakery or conversation to change the choice.
- Recommend a dish at a place, under stated conditions. One praised dish does not
  establish that the whole menu is good or consistently available.
- Scale verification to the commitment. A nearby inexpensive snack needs less
  investigation than a long detour or an expensive dinner.
- Describe evidence and uncertainty honestly. The assistant cannot taste food;
  firsthand meal observations belong to their actual author or to Patrik.

## Workflow

### 1. Resolve the actual food request

Distinguish "teach me about local food", "find places for this trip" and "where
should I eat now?" A general food question does not require a restaurant shortlist.
For a meal decision, establish the area, local day/time, dietary requirements,
meal spend and acceptable travel effort when these change the answer. Do not infer
current location from the proposed Italy–Morocco itinerary.

Reuse [Patrik's profile](../profile/universal-traveler-profile.md), especially
sections 6 and 9. The approximately €40 daily target covers accommodation and other
ordinary spending as well as food. It is not a meal budget. If remaining spend is
unknown, show meal costs without claiming that the whole day fits. Favor everyday
food and local encounters; do not turn dinner into hours of planning.

Classify through the installed research-workflow-v2. A narrow fact check may qualify
for R1; a saved comparative memo usually needs R2. This playbook adds food questions
to that method without replacing its evidence, preflight or release requirements.

### 2. Find knowledgeable sources and learn what to order

Find a few relevant sources before expanding the restaurant list. Prefer named
writers with repeated experience of the city or cuisine, clear visit descriptions
and useful dish-level detail. Check whether the meal was ordinary paid dining,
a hosted visit or unclear. Hosting does not erase observations, but special
access may not represent what Patrik can buy. Publication prestige alone is not
proof of a visit, independence or matching taste.

Use previously reported meals to calibrate a source when such feedback exists.
Do not invent a track record. A reliable fine-dining critic may still be a poor
match for a cheap market lunch. Treat an all-positive list as potentially curated;
lack of negative posts alone does not prove dishonesty.

Build a small food brief from local food writers, cooks, regional guides and venue
menus. Identify dishes, local spellings, ingredients, usual eating occasions and
which preparations or specialties the sources praise. Separate documented local
practice from a writer's preference. Explain unfamiliar dishes in plain language.
Record what the source thinks makes a good version, such as a stated texture,
cooking technique or preparation to order. Attribute these judgments and allow
regional variations. Photos may show a dish or price; they cannot establish taste.
Include everyday meals, bakeries, snacks and markets. Local food can also include
migrant and contemporary cooking; it need not be an old national signature dish.

For a Marrakech run, start with a verified dish vocabulary and search combinations
of dish, neighborhood and city in English, French and Arabic where useful. Verify
translations and preserve original place names. Example query shapes are
`[dish] [neighborhood] Marrakech`, `[dish] Marrakech prix menu` and the equivalent
local-language wording. Do not invent Arabic spellings or claim a dish is local
merely because a search result says so.

The food brief should answer what to order, how it is normally served, ordering
and payment conventions, and what Patrik should confirm before paying. Source
these tips locally. Do not export one country's tipping or bargaining practice
into another. If an allergy matters, dish names and popularity are insufficient
to verify ingredients or cross-contact arrangements.

### 3. Discover a small, varied candidate set

Use several kinds of lead rather than several copies of one list:

- A named local food writer, specialist guide or credible firsthand account.
- Dish-specific searches and accessible menus or food photographs.
- Maps or another directory for nearby alternatives and exact location.
- Patrik's saved sources, recommendations from people and reported discoveries.

Begin with the strongest leads near the places Patrik expects to visit. Group
options geographically and keep a convenient fallback. Expand the search only
when the available choices do not meet the request or a special meal warrants it.
There is no required candidate count or fixed review threshold. Include a
less-obvious option when there is a real lead; never fill a "hidden gem" slot with
a random low-review business. Keep famous options eligible.

When Patrik wants help asking locally, suggest a precise question such as
"Where did you last eat this dish, what did you order, and what did you pay?"
Ask food workers or knowledgeable residents about their own experience rather
than assuming every resident is a food expert. Useful follow-ups include what
makes that version good, when the dish is served and which nearby alternative
they would choose. Follow a promising recommendation to its specific reason.
Keep recommendations from staff or guides attributed and note known commercial
ties. Do not contact anyone on his behalf without authorization.

### 4. Check the evidence behind each finalist

For each place, record one compact evidence note:

| Field | Required distinction |
| --- | --- |
| Identity | Name, neighborhood, city, exact branch and verified map link when available. Resolve similarly named venues before combining evidence. |
| Food reason | Specific dish and evidence about preparation, taste or consistency. A nice view is a separate benefit. |
| Source basis | Who visited, approximate visit/publication date, dish ordered and what they observed. Identify commercial interests when disclosed; unknown stays unknown. |
| Independence | Trace repeated lists to their original source where possible. A blog embedding a Google review is not another independent diner. |
| Cost | Dated menu or attributed bill, currency, portion basis, drinks and other known charges. Distinguish a current quote from an estimate. |
| Practical fit | Relevant opening time, meal service or sell-out uncertainty, journey effort and booking need. Listed hours do not guarantee service or availability. |
| Counterevidence | Recent concrete complaints, contrary experiences, closures or changes. Separate food complaints from dislike of decor or queues. |
| Coverage | Which reviews/pages were actually accessible, their dates and selection method. An API-selected sample is not a chronological review audit. |

Check prices and operations for the intended visit. Read recent diner evidence
when available, particularly after a change of ownership, menu or service.
Do not impose a universal three- or six-month expiry on food writing. Older
accounts can establish a lead; new ownership or repeated recent
complaints can overturn it. Review what is actually available rather than claiming
a fixed number of reviews was checked.

Weight the quality and relevance of an account before counting sources. A detailed
firsthand recommendation from a knowledgeable source may justify trying a nearby,
inexpensive meal. Label a single-source basis. Seek independent corroboration when
a costly detour, conflicting accounts or a stronger claim makes it useful.
A restaurant's menu can corroborate a dish and price, but cannot independently
prove taste. Sparse coverage is uncertainty, not evidence of poor food. Keep a
promising lead available without calling it proven or demanding that others have
already discovered it.

### 5. Challenge hype and judge value

Before selecting a favorite, ask what would make it a disappointing choice for
Patrik. Search for evidence of changed quality, unclear bills, pressured ordering,
paid recommendations or a price premium unsupported by the desired experience.
Read mixed and negative accounts in context. Avoid declaring a business a scam
or tourist trap from one allegation.

Compare similar meals and portions nearby when the price is material. A higher
price may buy better ingredients, comfort or a view; explain which benefit has
evidence and whether it matters here. Count travel expense and effort too.

Do not award an "authenticity score". Neither multilingual menus, tourist diners,
polished decor nor popularity proves poor food. Likewise, rough decor, low review
counts and distant locations do not prove a gem. Do not infer customers' residence
or ethnicity from photographs. Treat unusual review patterns as uncertainty,
not an automated fake-review verdict.

### 6. Leave room to discover and decide on arrival

When Patrik wants to explore, offer a bounded food area or market visit with a
known fallback instead of insisting on a named winner. Research useful serving
times where possible. Participation is optional; do not assign him a research
chore or promise access to kitchens or homes.

Using what Patrik reports or shares, help him assess what is being prepared,
which dishes people are ordering, the visible menu and prices, and the apparent
wait. Ask what the kitchen is known for or what is good today. Staff suggestions
are leads, not independent validation. Confirm portion and price before ordering.
A queue may reflect several things; neither a queue nor an empty room at an odd
hour decides quality. Never claim to see or smell a place remotely.

If appropriate, start with a small order and choose more after tasting. Patrik
can prefer a spontaneous, lightly documented option or leave when the price or
experience does not fit. These observations do not certify hygiene or resolve
an allergy question.

### 7. Recommend briefly and stop

Give one first choice and at most two useful alternatives. Compare food fit,
value, experience and journey effort in words, not an uncalibrated numerical score.
Keep quality confidence separate from operational confidence. A well-supported
food recommendation can still have uncertain opening hours.

Use this answer shape:

> **Start with [place, neighborhood].** Order [dish] because [specific reason].
> Expect [supported price or clearly labeled estimate and inclusions].
> [Map link and checked journey information, or the precise location gap.]
> Evidence is [well supported / promising but lightly documented], based on
> [attributed sources]. The main caveat is [concrete issue].
> [One or two alternatives only if they solve a different need.]
> Local food tips: [a few relevant, sourced tips]. Checked [date].

For "eat now", investigate only enough to choose a nearby option and fallback.
For advance research, stop when the shortlist meets the brief, each finalist has
had a contrary-evidence check, and another feasible search is unlikely to change
the choice. An unresolved gap can produce a conditional recommendation; do not
hide it to satisfy the output shape. Recheck volatile facts on the intended day.

### 8. Retain useful knowledge and learn from actual meals

Follow the existing [record workflows](assistant-workflows.md).
Store reusable cuisine and ordering advice in the library. Keep a coherent city
food note rather than creating a database row for every restaurant encountered.
Put date-specific trip research under that trip and link shared knowledge.

Preserve suggested, researched and personally tried as distinct states. When
Patrik reports a meal, save the dish, paid price, date and what worked or failed.
Separate food execution, personal taste, service, value and company or atmosphere.
If known, retain which source led there so later advice can use actual feedback.
Do not infer consistency from one visit or transfer one dish's success to a whole
menu.
One poor dinner can update that venue's note without changing his standing
preferences. This uses existing capture behavior; travel-reflection remains
deferred. Do not initiate an automatic post-meal questionnaire.

Persist only material that the source permits. In particular, do not build a Git
archive of Maps API responses, reviews or photographs. User-owned observations
and independently sourced findings should remain distinguishable from live
provider content. The API-specific retention question must be settled before
connecting Maps to any automatic save path.

## Tool use

Use existing web research and accessible map pages first. State when review pages
or menus cannot be accessed. Never invent opening hours, prices, map links or a
review history to complete a shortlist.

If a Maps tool is available, inspect its actual capabilities. Use place search
and routes for identity and logistics. Distinguish generated summaries from diner
accounts, and disclose review sample size and selection method. A relevance-selected
sample cannot establish the full pattern of recent complaints.

Google Maps Grounding Lite MCP is an integration candidate, not a dependency of
this playbook. Installation, credentials, billing, host compatibility and provider
content retention require a separate implementation decision. See the dated
[tool assessment](../pipeline/proposals/food-discovery/proposal.md#tools-and-integration-choice).
Phone/cloud and Instagram testing remain deferred. Keep personal research in Travel
OS; this playbook does not authorize registration in another repository.

## Before delivering a recommendation

- Explain the dish-specific reason for the first choice and its main caveat.
- Identify the correct branch and preserve source dates and coverage limits.
- Check contrary evidence and keep copied recommendations from counting twice.
- Show the supported cost and what it includes. Do not treat the daily budget as
  a meal allowance or silently exclude drinks and travel costs.
- Keep lightly documented discoveries visible as tentative leads. Do not reject
  a strong famous option solely for being popular.
- Separate food confidence from opening, availability and dietary uncertainty.
- Keep the result short enough to act on, with a fallback when useful.

## Evidence behind the method

The [research record](../pipeline/proposals/food-discovery/record.json) preserves
source claims, their limits and the proposal's R2 validation. Practitioner advice
informed discovery steps; the confidence rules and effort limits are design
judgments to refine through actual use.

- [Mark Wiens' discovery methods](https://www.migrationology.com/faqs/) inform
  local-language, walking and personal-recommendation leads.
- [Rick Steves' food guidance](https://classroom.ricksteves.com/videos/eating-smartly-in-europe)
  informs neighborhood and specialty searches, with its European context retained.
- [Jodi Ettenberg's travel resources](https://www.legalnomads.com/travel-resources/)
  inform market-area and inexpensive-food discovery.
- [Luca and Zervas' review research](https://pubsonline.informs.org/doi/10.1287/mnsc.2015.2304)
  informs caution about favorable and unfavorable review manipulation. It does not
  identify fake reviews or establish current fraud prevalence in Morocco.
