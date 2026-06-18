Travel Principles

**Version:** v3
**Created:** 2026-05-10
**Owner:** Patrik
**Role in system:** Personalization spine #2 — read alongside the Universal Traveler Profile by every workflow in the Claude Code travel planning system before generating user-facing output.

---

## How to use this document

This document captures *decision rules* — how Patrik decides — across all solo trips of 1+ week duration. Paired with the Universal Traveler Profile, which captures *what Patrik prefers*. Together they form the personalization spine the planning system reads before any output.

The Profile filters destinations and activities against tastes. Principles filter and shape choices when tastes alone don't decide — which destination among viable ones, when to splurge, what to bail on, how to allocate work days, what counts as "special" enough to override caps.

**Application discipline:**

- Each principle has a **statement, rationale, and application rule**. The application rule is the only part the planning system uses operationally; the rationale exists so Claude Code can evaluate edge cases.
- **Tensions between principles are documented explicitly** in §8.
- **Anti-principles** in §9 document things that look like principles but Patrik has rejected.
- This document is updated **only via the Phase 3 retro workflow**, never ad-hoc.

**Scope discipline (added in v2):** This document only contains principles Claude Code can actually apply in workflows. Personal-philosophy statements that aren't system-actionable were cut. See §10 (Deliberate omissions) and the QC log at §11 for what was removed and why.

---

## 1. Independence & control

The trip's structure — destination, dates, route, daily flow — is Patrik's choice. Foundational; everything else operates within it.

### 1.1 — Patrik chooses the trip's structure

**Statement:** The trip is Patrik's. The planning system surfaces options; it never auto-selects.

**Rationale:** Travel agency is the point. Outsourcing the choice undermines the experience.

**Application rule:** When multiple destinations, routes, or extensions pass all filters, the system presents candidates with comparative analysis and lets Patrik pick. It does not rank, recommend, or auto-select. This applies at trip-selection (Phase 4) and at any in-trip decision point with multiple viable options.

---

### 1.2 — Don't depend on others' logistics

**Statement:** Don't rely on others' accommodation or transport for the trip's structure.

**Rationale:** Dependence on others' logistics forces playing by their rules — schedule, pace, priorities. It ruins flow.

**Application rule:** When a draft trip plan involves staying with someone or relying on someone else's transport for more than a brief overlap (1–2 days), flag it as a structural risk. Hostel bookings, public transport, and rentals Patrik controls are the default.

---

### 1.3 — Bail out of social situations that aren't working

**Statement:** When a social situation is clearly not working — forced, low-chemistry, time-sink — leave it.

**Rationale:** Trip time is finite. Social activity is high-priority but only when it produces value. The principle is "don't stay in social situations that are clearly not working" — not "filter speculative quality in advance."

**Application rule:** This is a *bail-out rule*, not a filter rule. When recommending social activities or group experiences, the system does not pre-filter on speculative quality. When debriefing or in-trip sparring, the system normalizes bailing: if a situation isn't working after a first window (a drink, an hour, the first day of a multi-day group thing), leaving is the right move. The system explicitly tells Patrik this when relevant — it doesn't expect him to remember it under social pressure.

---

## 2. Friend visits

Friend visits operate under a separate, stricter set of rules than trip-mate travel. Solo-system context: friend visits are the only case where Patrik's solo trip overlaps another person's life for more than a passing day.

### 2.1 — Friends are Plan B, the trip is Plan A

**Statement:** A trip's structure is determined by Patrik's own goals. Visiting a friend is added on, never the spine.

**Rationale:** Friend visits inherit the friend's home routine, pace, and obligations. As guest, Patrik can't dictate what the friend does in their own city. Building a trip *around* a friend visit cedes control of the entire trip; building a trip with a friend visit *as a stop* preserves agency.

**Application rule:** When a friend visit is on the table, the system structures the trip with the friend stop as one node among others. If a destination is *only* viable because the friend lives there, treat that as a Plan B trip and weight accordingly — i.e., the system flags it as friend-driven, not trip-driven, and surfaces alternative destinations Patrik could pick instead.

---

### 2.2 — Maximum 4–5 days at a friend's place

**Statement:** Friend visits cap at 4–5 days, even with strong friends.

**Rationale:** Beyond 4–5 days the dynamic flattens — there's only so much catching up, and after that the visit becomes routine without the autonomy of solo travel. International friend visits in particular get boring after the first day or two of catch-up.

**Application rule:** Hard cap on the friend-stop duration in any itinerary. The system flags any plan extending beyond 5 days at a friend's place as structurally bad and proposes a structure where the friend stop is shorter and Patrik moves to solo accommodation for the remainder.

---

### 2.3 — Comfort and stimulation filter

**Statement:** Only visit friends Patrik feels genuinely comfortable *and* stimulated with for the full visit duration.

**Rationale:** The 4–5 day cap is a maximum, not a target. Some friends can't sustain even 2 days of company without strain. The visit is only worth doing if the friend clears both bars.

**Application rule:** When a friend visit is proposed, the system asks Patrik to confirm explicitly: is this someone he's comfortable with for 4–5 days, *and* someone whose company is stimulating for that duration? Both must be yes. If either is no, the system proposes shortening to 1–2 days or dropping the visit.

---

## 3. Experience quality & uniqueness

Travel exists to produce experiences and memories that wouldn't be possible at home. This category governs what Patrik spends time and money on.

### 3.1 — Spend on what travel uniquely enables

**Statement:** Time and money go to experiences that are *location-bound* — possible only because of where Patrik is.

**Rationale:** Generic restaurants, generic shopping, generic comforts are *transferable consumption* — could happen anywhere. Spending trip time and budget on them is leak.

**Application rule:** When recommending activities or accommodations, the system tags each as *location-bound* (the geography, culture, people, or moment is the experience) or *transferable* (could happen in any country). Default-decline transferable consumption. Default-include location-bound experience even if it costs more, within the §3.2 splurge limits.

---

### 3.2 — Splurge only on experience, never on comfort

**Statement:** Within the splurge tolerance (€100–150, Profile §9), spending is justified for unique experience and never for comfort.

**Rationale:** Comfort splurges (nice hotel rooms, business-class transit, luxury meals) are transferable consumption at premium prices — the worst case under §3.1. Experience splurges (a dive certification, a multi-day boat trip, a guided trek) buy memory that's location-bound. The €100–150 ceiling exists for the latter, not the former.

**Application rule:** When the system surfaces a splurge candidate, it tags it as *experience* or *comfort*. Experience splurges enter the per-trip splurge list. Comfort splurges are dropped regardless of whether they fit the budget tier.

---

### 3.3 — Every trip has a theme

**Statement:** Every trip has a specific theme, goal, or agenda — even a loose one.

**Rationale:** A theme directs decisions before they need to be made. Without one, default-tourism fills the vacuum. Themes can be loose ("see how the Balkans live") or specific ("volcano-and-jungle Costa Rica") — what matters is that one exists.

**Application rule:** Trip selection workflows must produce a theme before the destination dossier is generated. The theme is an input to every downstream workflow. The system rejects trip plans without a stated theme and asks Patrik to articulate one before proceeding.

---

### 3.4 — Bias toward harder and more novel options

**Statement:** When evaluating multiple viable activities, default toward the more challenging or novel option.

**Rationale:** Comfort-zone push is what produces the experiences travel exists for. The biased default doesn't replace Patrik's judgment — it changes which option the system surfaces first.

**Application rule:** When generating activity recommendations or day-plan options, the system orders alternatives by novelty/challenge first, comfort options second. Patrik's depletion is self-reported (the system can't detect it) — when Patrik signals he's depleted, the system inverts the order until told otherwise.

---

## 4. Anti-overtourism & authenticity

Travel value is destroyed by *tourist traps* — overcrowded, overpriced, obligatory-icon places where the crowd itself is the experience and only tourists are there. Popular places that genuinely hold up (locals value them too, or they're worth it with the right timing) are **not** the enemy. The thing to avoid is the "Eiffel Tower tier": the go-only-for-the-photo, tick-the-box mega-icon. "Famous" alone is never the disqualifier — the test is *"does the crowd ruin it, and does anyone but tourists value it."*

### 4.1 — Default to the local and off-beat; route around traps, not fame

**Statement:** Default toward the local and off-beat, and prefer less-touristed bases and neighborhoods. But "heavily-touristed" is **not** an automatic filter — a popular destination or area stays in when it genuinely holds up (§5: Lisbon, Bali, Chiang Mai, Cusco are on the table). Filter the tourist-trap tier, not everything famous.

**Rationale:** Mass tourism degrades the dimensions that matter — authenticity, social density (locals vs. tour groups), pace, value-for-money — but only when it tips into the trap tier. Plenty of popular places stay genuine. The point of travel is to see how people actually live, which a worthwhile-popular place can still deliver.

**Application rule:** Trip-selection workflows score destinations on tourist density as one input (not a hard gate) and lean toward less-touristed options. Dossier workflows score *neighborhoods within destinations* on tourist density and route accommodation/activity recommendations toward less-touristed neighborhoods. Individual attractions are kept or cut on the trap test (crowd-ruins-it / only-tourists-value-it), not on fame. The "tourist trap warning list" output (Project Plan, Phase 1) is the operational expression of this principle.

---

### 4.2 — Avoid mainstream backpacker hubs

**Statement:** Backpacker-heavy is not enough — the *type* of backpacker scene matters. Default-decline mainstream backpacker hubs.

**Rationale:** Mainstream backpacker scenes have the same homogenization problem as mass tourism — same crowd, same activities, same Instagram script. The Profile's preference for backpacker-heavy spots assumes *interesting* backpackers, not the Bali-Canggu / Koh-Phangan-in-season / Pai-in-high-season template.

**Application rule:** Destination-level filter at trip selection. Within destinations, the system trusts hostel choice (Profile §4) to handle social composition.

---

### 4.3 — Popular-and-worthwhile is fine; decline the obligatory mega-icon

**Statement:** A popular or even iconic place is acceptable when the experience genuinely holds up — locals or repeat visitors still value it, OR it's worth it despite the crowds with the right timing. Decline the "Eiffel Tower tier": the overcrowded, overpriced, go-only-for-the-photo mega-icon you visit only to tick a box.

**Rationale:** Some genuinely-unique experiences are tourist-heavy by definition (the Inca Trail, Angkor Wat, a major ruin or natural wonder) and skipping them on principle costs experience-quality. But fame cuts both ways: an obligatory icon where the crowd is the whole scene and nobody but tourists is there delivers nothing. The deciding question is not "is it famous" but "does the crowd ruin it, and does anyone but tourists value it."

**Application rule:** When evaluating a popular or iconic site, the system applies the trap test: does it hold up despite the crowds (locals present, real quality), or is it crowd-degraded and tourist-only? If it holds up, keep it and plan crowd-mitigation (sunrise visits, off-season, side entrances, less-trafficked routes within the site). If it's the obligatory-icon tier (the Eiffel Tower, the main square at noon, a Michelin-listed restaurant in a tourist district that trades on location not food), default-decline — or flag-not-recommend if it's unavoidable.

---

## 5. Travel rhythm & movement

How Patrik moves between places, and how movement integrates with experience.

### 5.1 — Don't churn through places

**Statement:** Match the Profile's 2–6 day stay pattern. Avoid moving too far or too frequently.

**Rationale:** Churn destroys depth. Two days in five places produces ten airport queues and zero memory. The unique-experience principle (§3.1) requires enough time in each place to actually have the experience.

**Application rule:** Itinerary workflows enforce the Profile's 2–6 day default and flag any plan that moves faster. (This restates a Profile rule; included here because it's principle-shaped and the Profile rule alone doesn't capture the *rationale*.)

---

### 5.2 — Journey as part of the experience

**Statement:** Default to scenic routes — buses, trains, boats — over the fastest option, when reasonable.

**Rationale:** Transit between places is travel-time too. A scenic train, a multi-day boat trip, a coastal bus route is experience; an airport-to-airport hop is not.

**Application rule:** When recommending transport, the system surfaces the scenic option first if it exists, with the fast option as alternative. Override: when the time cost of the scenic option is irrational (e.g., 18h bus to save 1h flight time on a short trip), default to fast and explain the tradeoff.

---

### 5.3 — Road-trip pace cap

**Statement:** On road trips: avoid highways, cap daily driving at ~2 hours or 200 km.

**Rationale:** A road trip's value is the route, not the destination. Highway driving and long days defeat the point — they convert a road trip into pure transit.

**Application rule:** When generating road-trip itineraries, the system constrains daily driving to ~2h/200km and biases toward scenic secondary roads over highways. Scope: *daily driving* cap within the road-trip mode, not an absolute travel-time cap. A long transfer day between regions is a separate move and operates outside this rule.

---

### 5.4 — Spontaneity is required

**Statement:** Every trip must contain unplanned space. The system never produces hour-by-hour week-ahead itineraries.

**Rationale:** Pre-booked rigid itineraries kill the part of travel that produces real memory — chance encounters, unexpected detours, the morning where something better than the plan emerges.

**Application rule:** Pre-trip outputs (destination dossiers, theme, accommodation bookings) commit to direction. Day-plans are loose by design — the day-before sparring workflow (Project Plan, Phase 2) is the spontaneity engine. The system never generates an hour-by-hour week-ahead plan; if asked to, it pushes back and proposes the day-before sparring pattern instead.

---

## 6. Routine maintenance

Travel doesn't suspend Patrik's baseline routine. Sleep, exercise, and eating quality are protected.

### 6.1 — Maintain physiological baseline

**Statement:** Sleep, exercise, and eating quality are protected during travel. Travel is anti-routine for *experience*, not anti-routine for *body*.

**Rationale:** Without the baseline, energy and judgment degrade fast on a trip. The push principle, the social density, the long days only work if the body is intact.

**Application rule:** Day-plan workflows treat sleep, exercise, and meal slots as default scaffolding. The system flags days that compress these slots beyond recovery — no exercise window for >3 consecutive days, late dinners pushing sleep below baseline, repeated skipped breakfasts. See §8 Tension 1 for spontaneity-vs-routine resolution.

---

### 6.2 — Front-load work to Mon–Thu

**Statement:** The 25h/week work load (Profile §3) is front-loaded to Monday–Thursday by default. Friday–Sunday is open.

**Rationale:** Hostels, group activities, and social density pulse on weekends. Mon–Thu work and Fri–Sun open maximizes overlap with social windows.

**Application rule:** Day-plan workflows default to scheduling work blocks on Mon–Thu, leaving Fri–Sun open. Two override conditions, applied *within* the work block:

- **Weather override** — if the weather forecast makes a specific Mon–Thu day clearly the best activity day of the week (and a normally-open day worse), swap.
- **Travel-day override** — travel days take priority over their weekday slot. A long bus that lands on Tuesday means Tuesday is a travel day; the work it would have absorbed shifts to Friday.

The override applies *within* the structure — it doesn't dissolve Mon–Thu into a free-for-all. Default holds unless one of the two triggers fires.

---

## 7. Energy management

Sustaining energy across a multi-week trip requires explicit limits on energy-draining activities.

### 7.1 — No multi-night drinking unless special

**Statement:** Don't drink heavily on consecutive nights unless the night is *special*. Default cap aligns with Profile §5: 1–2 drinking nights per week.

**Rationale:** Multi-night drinking drains the next day. The cost isn't the night — it's the lost productive day after, the missed sunrise hike, the degraded work block on Tuesday. Trip experience density depends on next-day energy.

**Application rule:** When the system spots multi-night drinking in a draft itinerary, flag it. Override: a *named* special event — a festival, a defined cultural night, a once-in-the-trip pub crawl — clears the cap. "It's been a fun crowd at the hostel" doesn't qualify. The override is rare and pre-named, not in-the-moment rationalization. The system requires the trigger to be named in the itinerary or day-plan when the cap is exceeded.

---

## 8. Tensions and resolution rules

Where principles point in different directions, these resolutions govern.

### Tension 1 — Spontaneity (§5.4) vs. Routine maintenance (§6.1)

**Conflict:** Spontaneity requires unplanned space; routine requires daily structure.

**Resolution:** Routine is the *default daily envelope*; spontaneity operates within it on most days, outside it on rare days. Routine is protected as a *weekly average*, not a daily one. A spontaneous late night or 12-hour travel day is fine if the surrounding days re-establish baseline.

**Application:** Day-plan workflow uses routine slots as default scaffolding. When in-trip sparring evaluates a spontaneous opportunity, it checks recovery space in the surrounding 48h. If yes, take it. If no, decline.

---

### Tension 2 — Push (§3.4) vs. Routine maintenance (§6.1)

**Conflict:** Push principle rewards discomfort; routine principle protects baseline comfort.

**Resolution:** They operate in different domains. Routine governs *physiological baseline* (sleep, exercise, eating). Push governs *experience quality* (social novelty, physical challenge, cultural immersion). They don't compete for the same hours — a hard hike with strangers is push *and* routine-compatible if recovery space exists.

**Application:** When the system flags a challenging opportunity, it does not invoke routine maintenance as a counter unless the opportunity *specifically* threatens sleep, exercise, or eating in a way recovery can't repair.

---

### Tension 3 — Anti-overtourism (§4.1) vs. Iconic experiences (§3.1)

**Conflict:** Anti-overtourism filters tourist-heavy locations; some location-bound unique experiences are tourist-heavy by definition.

**Resolution:** Codified directly as §4.3 (iconic-experience exception). Anti-overtourism applies to destinations and neighborhoods. Iconic-experience inclusion applies to specific activities within destinations, with crowd-mitigation requirements.

**Application:** See §4.3 application rule.

---

### Tension 4 — Solo trip shape vs. Social in-trip mode

**Conflict:** Profile §1 says solo traveler; Profile §4 says default-prefer joining groups.

**Resolution:** Solo is the *trip-shape* default; social is the *in-trip-mode* default. The trip is solo (no pre-arranged companion); inside the trip, social is the default mode (hostels, group activities, ad-hoc groups). The bail-out rule (§1.3) is a quality filter on social opportunities, not a bias toward isolation.

**Application:** Trip-shape decisions default solo. Daily activity decisions inside the trip default social. Bail when social is clearly not working.

---

### Tension 5 — Independence (§1.2) vs. Multi-day group adventures (Profile §4)

**Conflict:** Independence bans dependence on others' logistics; the Profile endorses 4–5 day group adventures with strangers (boat trips, group hikes).

**Resolution:** Independence governs *who chose the structure*. A pre-arranged group adventure that Patrik opted into knowing the structure is independence-compatible — the choice was his. The principle bans being *dragged* into others' plans, not opting into structured group experiences.

**Application:** Evaluate group/multi-day adventures by the opt-in test. Friends-as-Plan-B fails (their itinerary, you're guest). Hostel-organized boat trip passes (their itinerary, but Patrik bought the ticket knowing it).

---

### Tension 6 — Theme (§3.3) vs. Spontaneity (§5.4)

**Conflict:** Theme prescribes intentional trip design; spontaneity requires unplanned space.

**Resolution:** Theme is the *frame*; spontaneity is the *fill*. Theme picks destination, season, rough activity mix. Spontaneity governs day-to-day execution.

**Application:** Pre-trip outputs commit to theme and direction. Day-plans hold loose. Day-before sparring is the spontaneity engine.

---

### Tension 7 — Friends as Plan B (§2.1) vs. Friend filter (§2.3)

**Conflict:** Plan B framing treats friend visits as add-ons; the filter implies careful selection.

**Resolution:** They operate at different gates. The filter governs *whether* to include a friend visit at all. Plan B framing governs *how* the visit fits into the trip structure. A friend who passes the filter still gets Plan B treatment within the trip.

**Application:** Filter first (would 4–5 days with this friend be fun?). If yes, structure the trip with the friend stop as an addition, not the spine.

---

### Tension 8 — Energy cap (§7.1) vs. "Special" nightlife (Profile §5)

**Conflict:** Energy principle caps multi-night drinking; Profile lists special nightlife (festivals, live music, bonfires) as a soft activity.

**Resolution:** "Special" must be *infrequent and named*. A festival weekend, a defined cultural event, a once-in-the-trip pub crawl clears the bar. "It's been a fun crowd at the hostel" doesn't.

**Application:** When the system spots multi-night drinking in a draft itinerary, flag it. Allow the override only if a named special trigger is present and recorded in the itinerary or day-plan.

---

## 9. Anti-principles

Things that look like principles but Patrik has rejected. Documented to prevent reintroduction.

### AP-1 — "Cap travel days at 4–5 hours"

Appeared in older P4 (Travel Rhythm) notes. The Profile §2 explicitly contradicts: "Full travel days are fine. Don't artificially cap travel time at 4–5h." The Profile is newer and load-bearing. The 4–5h cap is rejected. The remaining travel-rhythm rules (§5.1–5.3) survive on their own merits.

### AP-2 — "Pack minimally, only the small green backpack"

Raw-notes packing constraint that surfaces periodically. Profile §7 locks the actual stable preference: backpack-heavy, main pack + daypack, one bag per category. Minimal packing is rejected as a default.

**System-relevance:** Packing recommendations are in scope for the system (warm layers for cool destinations, scooter-appropriate clothing, dive gear vs. rent-on-arrival, etc.). When generating packing recommendations, the system defaults to the Profile §7 backpack-heavy pattern and does *not* drift toward minimalism just because Patrik mentioned it once. The "small green backpack" framing should not appear in recommendations.

---

## 10. Deliberate omissions

Decision-rule areas where Patrik considered but did not commit to a stable rule, *or* areas that are personal-philosophy rather than system-actionable.

**Personal-philosophy omissions** (cut in v2 as not system-relevant):

- **Companion selection rules** — System is solo-only. Companion compatibility, group dynamic, conflict-prone people, calibrating expectations to companion mindset — none of this is acted on by Claude Code.
- **General "comfort-zone push" beyond activity ordering** — The depletion override is self-knowledge, not system-actionable. Push is preserved in operational form as §3.4 (ordering bias toward novel/challenging options); the broader life-philosophy framing is omitted.
- **Solo-as-default principle** — Already a system constraint (Context Pack). Restating as principle adds nothing operational.

**Genuinely-no-stable-rule omissions:**

- **How to decide between two viable destinations** — no auto-tiebreaker. Captured in §1.1 (system surfaces, Patrik picks).
- **When to extend a stay mid-trip** — no stable rule. Per-place judgment.
- **When to leave a place that isn't working** — no stable rule. Per-place judgment.
- **How to decide whether to join a group activity** — captured at activity-time via §1.3 (bail-out) rather than entry-filter.
- **How to push past discomfort vs. respect it** — no stable rule beyond the depletion-signaling pattern in §3.4.
- **Daily rhythm pattern (cafe-work-restaurant-walk-read)** — classified as preference, not principle.

---

## 11. QC log

QC pass on whether each principle is actually useful for Claude Code, applied at v2.

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
- **v4** — 2026-06-18. Recalibrated §4 (header, §4.1, §4.3) from a binary anti-tourism filter to a trap-tier filter: popular-and-worthwhile places are fine, only the "Eiffel Tower tier" obligatory mega-icon is declined. The keep/cut test became "does the crowd ruin it / does anyone but tourists value it" rather than fame or tourist density. **Operator-authorized ad-hoc exception to the retro-only rule below** (the workflow reference files had been recalibrated the same day and §4 needed to stay consistent with them; not deferred to the next retro).
- Updates happen **only via the Phase 3 retro workflow** after a real trip — **except** an explicit operator-authorized exception (see v4).

### Changelog

| Version | Date | Changes |
| --- | --- | --- |
| v1 | 2026-05-10 | Initial document. 18 principles, 9 categories. |
| v2 | 2026-05-10 | QC pass. Cut companion-selection category, depletion override, redundant solo-default. Tightened application rules in §1.2, §4.1, §5.4. Added §11 QC log. 14 principles, 7 categories. |
| v3 | 2026-05-10 | AP-2 reframed as system-behavior rule for packing recommendations rather than a marginal historical note. 14 principles, 7 categories. |
| v4 | 2026-06-18 | §4 recalibrated from binary anti-tourism to trap-tier filter (popular-and-worthwhile OK; decline only the "Eiffel Tower tier"). Keep/cut test is now "crowd-ruins-it / only-tourists-value-it," not fame. Operator-authorized ad-hoc exception to the retro-only rule. 14 principles, 7 categories. |

---

**End of document.**
