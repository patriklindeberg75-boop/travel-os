Travel Principles

**Version:** v6
**Last updated:** 2026-09-27 — preference-refresh round completed and approved.
**Review status:** September decisions below govern. Historical QC and changelog entries describe earlier versions, not active requirements.
**Created:** 2026-05-10
**Owner:** Patrik
**Role in system:** Personalization spine #2 — read alongside the Universal Traveler Profile by every workflow in the Claude Code travel planning system before generating user-facing output.

---

## How to use this document

This document captures *decision rules* — how Patrik decides — across trips of any duration, with or without companions. Paired with the Universal Traveler Profile, which captures *what Patrik prefers*. Together they form the personalization spine the planning system reads before any output.

The Profile filters destinations and activities against tastes. Principles filter and shape choices when tastes alone don't decide — which destination among viable ones, when to splurge, what to bail on, how to weigh experience against cost and practical constraints.

**Application discipline:**

- Apply the current guidance below. Retained rationales explain preferences; they do not add hidden requirements.
- Practical tradeoffs are summarized in §8.
- **Anti-principles** in §9 document things that look like principles but Patrik has rejected.
- Updates require Patrik's confirmation through a preference interview or post-trip retro; incidental remarks do not silently change standing principles.

**Scope discipline (added in v2):** This document only contains principles Claude Code can actually apply in workflows. Personal-philosophy statements that aren't system-actionable were cut. See §10 (Deliberate omissions) and the QC log at §11 for what was removed and why.

---

## 1. Independence & control

The trip's structure — destination, dates, route, daily flow — is Patrik's choice. Foundational; everything else operates within it.

### 1.1 — Patrik chooses the trip's structure

**Statement:** The trip is Patrik's. The planning system surfaces options; it never auto-selects.

**Rationale:** Travel agency is the point. Outsourcing the choice undermines the experience.

**Application rule:** When multiple destinations, routes, or extensions pass all filters, the system presents candidates with comparative analysis and lets Patrik pick. It may rank options and give a clear recommendation, but does not treat that recommendation as a confirmed decision or auto-select. This applies at trip-selection (Phase 4) and at any in-trip decision point with multiple viable options.

---

### 1.2 — Don't depend on others' logistics

**Statement:** Don't rely on others' accommodation or transport for the trip's structure.

**Rationale:** Dependence on others' logistics forces playing by their rules — schedule, pace, priorities. It ruins flow.

**Application rule:** Explain practical dependencies when they affect a route or accommodation choice. Do not infer a problem from the length of a friend visit or impose a duration limit.

---

### 1.3 — Bail out of social situations that aren't working

**Statement:** When a social situation is clearly not working — forced, low-chemistry, time-sink — leave it.

**Rationale:** Trip time is finite. Social activity is high-priority but only when it produces value. The principle is "don't stay in social situations that are clearly not working" — not "filter speculative quality in advance."

**Application rule:** This is a *bail-out rule*, not a filter rule. When recommending social activities or group experiences, the system does not pre-filter on speculative quality. When debriefing or in-trip sparring, the system normalizes bailing: if a situation isn't working after a first window (a drink, an hour, the first day of a multi-day group thing), leaving is the right move. The system explicitly tells Patrik this when relevant — it doesn't expect him to remember it under social pressure.

---

## 2. Friend visits

Friend visits and companion choices belong to Patrik. Do not enforce a 4–5 day
cap, require a compatibility interview, or insist that friends are only Plan B.
Explain practical consequences when relevant, without judging personal choices.

---

## 3. Experience quality & uniqueness

Travel exists to produce experiences and memories that wouldn't be possible at home. This category governs what Patrik spends time and money on.

### 3.1 — Spend on what travel uniquely enables

**Statement:** Time and money go to experiences that are *location-bound* — possible only because of where Patrik is.

**Rationale:** Generic restaurants, generic shopping, generic comforts are *transferable consumption* — could happen anywhere. Spending trip time and budget on them is leak.

**Application rule:** When recommending activities or accommodations, the system tags each as *location-bound* (the geography, culture, people, or moment is the experience) or *transferable* (could happen in any country). Prefer distinctive local experiences, but do not prohibit ordinary comforts. Default-include location-bound experience even if it costs more, with costs presented for individual consideration under §3.2.

---

### 3.2 — Assess special spending individually

Use the Profile's approximate €40/day average for accommodation, food, ordinary
activities, and local transport. Show major transfers and exceptional excursions
separately so their extra cost is visible. The former automatic €100–150 allowance
and ban on comfort spending are retired. Explain value and tradeoffs; Patrik decides.

### 3.3 — A trip theme is optional

A theme can help when Patrik supplies one, but must never be required before
research, trip setup, or planning. Current interests and opportunities suffice.

---

### 3.4 — Bias toward harder and more novel options

**Statement:** When evaluating multiple viable activities, default toward the more challenging or novel option.

**Rationale:** Comfort-zone push is what produces the experiences travel exists for. The biased default doesn't replace Patrik's judgment — it changes which option the system surfaces first.

**Application rule:** When generating activity recommendations or day-plan options, the system orders alternatives by novelty/challenge first, comfort options second. Patrik's depletion is self-reported (the system can't detect it) — when Patrik signals he's depleted, the system inverts the order until told otherwise.

---

## 4. Anti-overtourism & authenticity

**September 2026 confirmed exception:** Avoiding popular places is a preference,
not an absolute exclusion. Keep a popular town eligible when its exceptional
hostel community and nearby adventures justify the crowds. This exception takes
precedence over the destination exclusions in §4.1–4.2 and the non-touristic-base
condition in §4.3; it does not remove crowd mitigation for
individual activities. Prefer smaller places and opportunities for local contact.

Travel value is destroyed by mass tourism — crowds, queues, generic infrastructure, the experience of being one of thousands.

### 4.1 — Filter destinations and neighborhoods against overtourism

**Statement:** Default toward the local and off-beat. Heavily-touristed destinations and neighborhoods are filtered out unless §4.3 applies.

**Rationale:** Mass tourism degrades every dimension that matters — authenticity, social density (locals vs. tour groups), pace, value-for-money. The point of travel is to see how people actually live.

**Application rule:** Trip-selection workflows score destinations on tourist density and filter out heavily-touristed ones. Dossier workflows score *neighborhoods within destinations* on tourist density and route accommodation/activity recommendations toward less-touristed neighborhoods. The "tourist trap warning list" output (Project Plan, Phase 1) is the operational expression of this principle.

---

### 4.2 — Avoid mainstream backpacker hubs

**Statement:** Backpacker-heavy is not enough — the *type* of backpacker scene matters. Default-decline mainstream backpacker hubs.

**Rationale:** Mainstream backpacker scenes have the same homogenization problem as mass tourism — same crowd, same activities, same Instagram script. The Profile's preference for backpacker-heavy spots assumes *interesting* backpackers, not the Bali-Canggu / Koh-Phangan-in-season / Pai-in-high-season template.

**Application rule:** Destination-level filter at trip selection. Within destinations, the system trusts hostel choice (Profile §4) to handle social composition.

---

### 4.3 — Iconic-experience exception

**Statement:** A heavily-touristed *activity* (not destination) is acceptable if (a) it's genuinely location-unique, (b) the trip's base is non-touristic, and (c) it's timed to avoid peak crowds.

**Rationale:** Some location-bound unique experiences are tourist-heavy by definition (the Inca Trail, Angkor Wat, a major ruin or natural wonder). Skipping them on principle costs experience-quality.

**Application rule:** When evaluating an iconic site, the system tests: is this the kind of unique experience that justifies the crowd cost? If yes, plan with crowd-mitigation (sunrise visits, off-season, side entrances, less-trafficked routes within the site). If it's iconic-but-generic (the main square at noon, a Michelin-listed restaurant in a tourist district), default-decline.

---

## 5. Travel rhythm & movement

How Patrik moves between places, and how movement integrates with experience.

### 5.1 — Keep the pace flexible

Treat 2–6 days per place as a loose guide. Longer stays are welcome when people
and activities are good; do not impose a stay cap or force a move. Explain travel
time and opportunity costs when relevant.

---

### 5.2 — Journey as part of the experience

**Statement:** Default to scenic routes — buses, trains, boats — over the fastest option, when reasonable.

**Rationale:** Transit between places is travel-time too. A scenic train, a multi-day boat trip, a coastal bus route is experience; an airport-to-airport hop is not.

**Application rule:** When recommending transport, the system surfaces the scenic option first if it exists, with the fast option as alternative. Override: when the time cost of the scenic option is irrational (e.g., 18h bus to save 1h flight time on a short trip), default to fast and explain the tradeoff.

---

### 5.3 — Choose transport for the experience and access

Prioritize scenic public transport. Consider scooters or rental cars when they
substantially improve access to villages and nature. Explain time and cost
tradeoffs rather than enforcing the old two-hour/200-km driving cap.

---

### 5.4 — Spontaneity is required

**Statement:** Every trip must contain unplanned space. The system never produces hour-by-hour week-ahead itineraries.

**Rationale:** Pre-booked rigid itineraries kill the part of travel that produces real memory — chance encounters, unexpected detours, the morning where something better than the plan emerges.

**Application rule:** Pre-trip outputs (destination dossiers, theme, accommodation bookings) commit to direction. Day-plans are loose by design — the day-before sparring workflow (Project Plan, Phase 2) is the spontaneity engine. The system never generates an hour-by-hour week-ahead plan; if asked to, it pushes back and proposes the day-before sparring pattern instead.

---

## 6. Personal routine

### 6.1 — Personal routine belongs to Patrik

Do not prescribe exercise quotas, meal schedules, sleep routines, or recovery
rules. When relevant to a proposed activity, explain practical consequences and
respond to Patrik's stated energy and preferences.

---

### 6.2 — Leave work management to Patrik

**Confirmed 2026-09-27:** Work hours are outside the travel assistant's remit.
The former 25h/week and Mon–Thu scheduling rule is retired. Do not ask for work
hours, reserve work blocks, or move work between days. Respect a specific time
commitment only when Patrik explicitly supplies it for the current request.

---

## 7. Energy management

Partying is optional. Do not impose drinking-frequency caps or require a named
special event to permit a night out. Discuss practical next-day consequences
when relevant, without policing personal choices.

---

## 8. Tradeoffs

- Balance local encounters with social hostel life; neither needs a fixed quota.
- Popular places remain eligible when exceptional hostel community and nearby adventures justify crowds; apply practical crowd mitigation where useful.
- Preserve spontaneity and loose two-to-three-day proposals. A recommendation is not a commitment.
- Group adventures are optional. Hiking still has the explicitly confirmed two-day maximum.
- Scenic journeys are valuable, but show their time and cost against faster alternatives.
- Do not reconstruct retired personal-routine, friend-visit, or theme requirements through tradeoff rules.

---

## 9. Anti-principles

Things that look like principles but Patrik has rejected. Documented to prevent reintroduction.

### AP-1 — "Cap travel days at 4–5 hours"

Appeared in older P4 (Travel Rhythm) notes. The Profile §2 explicitly contradicts: "Full travel days are fine. Don't artificially cap travel time at 4–5h." The Profile is newer and load-bearing. The 4–5h cap is rejected. The remaining travel-rhythm rules (§5.1–5.3) survive on their own merits.

### AP-2 — Enforce a fixed packing style

Neither minimal packing nor a heavy-backpack setup is a standing requirement.
Ask about actual baggage only when it changes transport, accommodation, or activity advice.

---

## 10. Matters left to Patrik or the current request

No standing rules govern companion compatibility, friend-visit length, personal
routines, packing style, jet-lag tolerance, or a required trip theme. Work management
is outside the assistant's remit. No exact temperature cutoff applies; sun
sensitivity remains manageable context. Ask only when an unanswered detail
materially changes the current request.

---

## 11. QC log

Historical QC pass applied at v2. Entries below do not validate or reinstate rules retired in v6.

**Framework:**

1. **Operationalizable** — Can Claude Code apply this in a workflow?
2. **Non-redundant** — Adds something the Profile doesn't already cover?
3. **System-domain fit** — Does Claude Code make decisions in this domain?
4. **Specific** — Application rule is concrete enough to produce different outputs than its absence?

### Cuts from v1 (3 items)

| v1 item | Reason for cut |
| --- | --- |
| §2.1–2.5 Companion selection (entire category, 5 principles) | Fails system-domain fit. System is solo-only per Context Pack. Claude Code never produces output that uses companion-compatibility rules. |
| §4.4 Comfort-zone push (depletion override portion) | Fails operationalizability. Claude Code can't detect Patrik's depletion state. The operational half (bias toward harder/novel options) survives as §3.4. |
| §9.1 Solo-as-default | Fails non-redundancy. Already a system constraint locked in the Context Pack. |

Note: AP-2 (Pack minimally) was reframed in v3 rather than cut. Packing recommendations are in scope for the system — AP-2 now governs the system's packing-recommendation behavior (don't drift toward minimalism).

### Borderline-kept items (3 items, kept with explicit framing)

| Item | Concern | Resolution |
| --- | --- | --- |
| §1.3 Bail-out rule | Bail decisions happen in-the-moment, when Patrik may not be at his Claude Code session. Operationalizability is partial. | Kept and explicitly framed: the system *normalizes* bailing during in-trip sparring (Phase 2), so Patrik has the principle reinforced when he's most likely to ignore it under social pressure. |
| §3.4 Bias toward harder/novel | Risk of being so general it doesn't change outputs. | Application rule made concrete: the system *orders* alternatives by novelty/challenge first, comfort second. This produces measurably different recommendation lists. |
| §5.1 Don't churn | Restates a Profile rule. | Kept because the rationale (depth requires duration) is principle-shaped and the Profile rule alone doesn't carry that reasoning into edge cases. Tagged as "restates Profile rule" in the application note. |

### Items that passed cleanly

- §1.1, §1.2, §2.1–2.3, §3.1, §3.2, §3.3, §4.1, §4.2, §4.3, §5.2, §5.3, §5.4, §6.1, §6.2, §7.1.

### Application-rule sharpening (3 items rewritten in v2)

- **§1.2** — Added 1–2 day threshold for "brief overlap" so Claude Code has a numeric trigger.
- **§4.1** — Tied to the "tourist trap warning list" output explicitly named in the Project Plan, so the principle and the deliverable are bound.
- **§5.4** — Made the constraint explicit and bidirectional: the system *refuses* to generate hour-by-hour week-ahead plans when asked.

### Counts

- **v1:** 18 principles, 9 categories, 8 tensions, 2 anti-principles, 7 omissions.
- **v2:** 14 principles, 7 categories, 8 tensions, 2 anti-principles, 9 omissions (3 added — companion selection, depletion override, solo-default).

---

## 12. Versioning & update protocol

- **v1** — 2026-05-10. Initial document.
- **v2** — 2026-05-10. Cut 5 personal-philosophy items not relevant to Claude Code. Tightened application rules in 3 principles. Added explicit QC framework and log.
- **v3** — 2026-05-10. Reframed AP-2: packing recommendations are in scope for the system, so AP-2 now governs system behavior (don't default to minimalism in packing output) rather than being a marginal historical note.
- Updates require Patrik's confirmation through a preference interview or post-trip retro.

### Changelog

| Version | Date | Changes |
| --- | --- | --- |
| v6 | 2026-09-27 | Applied approved budget, transport, flexible pace, and personal-choice boundaries; retired conflicting routine, friend-visit, packing, and theme rules. |
| v5 | 2026-09-27 | Retired work-hour and weekday scheduling; clarified that group-adventure guidance does not override the two-day hiking maximum. |
| v4 | 2026-09-27 | Added the approved popular-town exception and its precedence over conflicting destination exclusions. Marked the refresh as partial and allowed confirmed interview updates. |
| v1 | 2026-05-10 | Initial document. 18 principles, 9 categories. |
| v2 | 2026-05-10 | QC pass. Cut companion-selection category, depletion override, redundant solo-default. Tightened application rules in §1.2, §4.1, §5.4. Added §11 QC log. 14 principles, 7 categories. |
| v3 | 2026-05-10 | AP-2 reframed as system-behavior rule for packing recommendations rather than a marginal historical note. 14 principles, 7 categories. |

---

**End of document.**
