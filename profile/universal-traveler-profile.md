Universal Traveler Profile

**Version:** v1
**Created:** 2026-05-10
**Owner:** Patrik
**Role in system:** Personalization spine #1 — read by every workflow in the Claude Code travel planning system before generating user-facing output. Paired with the Travel Principles document (forthcoming).
**Storage location:** Claude Code project repo, root path. Suggested filename: `universal-traveler-profile.md`. Update only via Phase 3 retro workflow.

---

## How to use this document

This profile captures travel preferences that are **stable across all 1+ week solo trips, regardless of destination, season, or theme**. It is *not* a trip plan and contains no trip-specific framing.

Every preference is labeled with a **strength**:

- **STRONG** — Always apply. Filter destinations, activities, and recommendations against this. Violation is a deal-breaker.
- **SOFT** — Apply unless context overrides. Default behavior, flexible.
- **CONTEXTUAL** — Apply only when a specific trigger condition is met. The trigger is documented inline.

A few preferences are explicitly marked **"no stable preference."** This is *deliberate signal*, not an oversight: it means workflows should not assume a default and should treat that dimension as a per-trip decision.

This profile is updated only via the Phase 3 retro workflow after a real trip — never ad-hoc.

---

## 1. Identity & travel philosophy

**Who I am as a traveler (STRONG, all):**

- Solo traveler.
- Backpacker by style, not tourist.
- Adventurous: I seek physical, sensory, and social challenge.
- Community-focused: travel is more valuable with people.

**What travel is for (STRONG, all):**

- Learning, exploring, experiencing, meeting people.
- Authentic local experiences.
- Backpacker lifestyle over tourist attractions.
- Adventure and human connection above comfort.

**What travel is NOT (STRONG, all):**

- Not relaxation or chilling.
- Not luxury or resort-style comfort.
- Not tourist-trap consumption.

**Lifestyle trajectory (STRONG, current state + direction):**

- Currently Finland-based with frequent travel.
- Trajectory is toward continuous nomadic lifestyle.
- The profile reflects current state. As actual lifestyle shifts, update via retro.

---

## 2. Trip shape

**Solo trips, 1+ week duration.** Hard floor (CP-locked). No upper limit.

**Trip duration default: no stable typical length.** Mix of short and long trips. Workflows must always treat duration as a trip-specific input.

**Seasonality: no avoided or preferred months.** Travel year-round.

**Stay duration per location:**

- **STRONG:** 2–6 days per location is the default rhythm.
- **SOFT:** Avoid >6 days unless special reason.
- **CONTEXTUAL override:** Extend to 7–10 days in **base-town mode** — when the location functions as a hub for multiple radiating activities or workdays. Common triggers:

Trigger is judgment-based, not rule-based. Workflows should *surface* the option when conditions suggest it but never auto-apply.
    - Nomad-hub during a heavy work week
    - Trekking base for multiple full-day hike radials
    - Dive base, climbing base, or similar activity hub
    - Particularly good hostel/community worth staying in

**Travel-day tolerance:**

- **STRONG:** Full travel days are fine. Don't artificially cap travel time at 4–5h.
- **STRONG:** Scenic when reasonable, fast when distance demands. Journey-as-experience is preferred (see §6) but not at the cost of irrational time loss.

**Route shape: no stable preference.** Linear, loop, hub-and-spoke — all per-trip.

---

## 3. Work integration

- **STRONG (CP-locked):** 25h/week remote work.
- **STRONG (CP-locked):** Reliable WiFi at least 4 days per week.
- **STRONG:** Flexible schedule — work blocks adapt around activities.
- **CONTEXTUAL pair:** Alternate between digital nomad hubs (during heavier work weeks) and raw backpacker towns (during lighter work weeks). The strategy itself is STRONG; which mode applies is contextual.

**Hostel kitchen access:** not required.

---

## 4. Accommodation & social

These are inseparable: hostels-with-social-atmosphere is fundamentally a *social* preference expressed through accommodation choice.

**Accommodation:**

- **STRONG:** Hostels with strong social atmosphere. Purpose: meeting other travelers, digital nomads, backpackers, entrepreneurs.
- **SOFT:** Low-budget default.
- **CONTEXTUAL:** Award-winning or unique hostels are an exception worth taking — trigger: hostel offers exceptional social/community experience AND is reasonably priced (not luxury).

**Social composition:**

- **STRONG:** Target community is travelers, digital nomads, and backpackers aged 25–35 (fixed range — does not auto-age).
- **STRONG:** Backpacker-heavy spots over mass tourism.

**Social behavior:**

- **STRONG:** High priority on meeting people and making friends.
- **STRONG:** Comfortable doing things alone when needed.
- **STRONG:** No language preference — comfortable in English-heavy and minimal-English destinations alike.
- **SOFT:** Default-prefer joining groups when possible.
- **SOFT:** Open to 4–5 day group adventures with strangers (chemistry-dependent).
- **SOFT:** Bar hopping, group tours, hostel events as social modes.

**Friends from home:**

- **STRONG:** Rarely travel with friends from home; prefer ad-hoc groups via hostels and tours. Reinforces and refines the CP-locked rule (friends as Plan B, max 4–5 days at a friend's place).

**Social vs. solo balance: no stable ratio.** Workflows should not enforce a percentage split. Default lean is social, but per-trip / per-mood judgment.

---

## 5. Activities & experiences

**Pattern:** Activity *categories* are STRONG (they shape destination filtering). *Specific activities* within them are SOFT (loved when available, never required).

### Strong categories (always factor into destination assessment)

- **Nature and outdoor adventure.** Hiking, waterfalls, caves, scenic terrain.
- **Hiking specifically:** ceiling is full-day hikes — multi-day treks are not viable as defaults (capability ceiling, not preference).
- **Quiet, clear-water beaches with few people.** Crowded beaches do not satisfy this preference.
- **Off-beat exploration by local mobility.** The principle is *off-beat exploration*; the favored vehicle depends on geography:
    - **Scooter** in scooter-friendly geographies (Southeast Asia, Mediterranean, Greek islands, etc.) — capability is strong (very experienced rider).
    - **Locally appropriate substitutes** elsewhere: long-distance bus, marshrutka, rental car, train, bike.
- **Observing how local people live.** Authentic daily life over staged cultural performance.
- **Scenic transport / journey-as-experience.** Scenic buses, trains, boats; multi-day boat trips combining transport + accommodation + social.

### Soft activities (loved when available, never required)

- Waterfalls, caves, natural wonders.
- Canyoning, waterfall rappelling.
- Volcano experiences (geography-gated).
- Scenic boat rides, island hopping, kayaking.
- Snorkeling, outdoor rock climbing, ATV / adrenaline activities.
- Wildlife experiences when available.
- Hot springs after hiking (recovery purpose).
- Guided motorbike tours to hidden spots.
- Ancient temples and historical sites (when not too niche).
- Guided history/culture tours.
- Local festivals and events.
- Idyllic towns and villages, architecture appreciation.
- Cooking classes.
- 1–2 night homestays in small villages.
- Pub crawls and hostel bar crawls.
- "Special" nightlife: festivals, live music, bonfires.
- Live music scenes.

### Contextual

- **Diving certification.** Trigger: budget allows AND opportunity is good (reputable dive school + reasonable cost).

### Anti-preferences (STRONG)

- **Mass-tourism *spots*** — specific attractions, beaches, or neighborhoods within a destination. Operates at the *within-destination* level: prefer backpacker zones, non-tourist neighborhoods, off-beat sub-areas.
    - A destination is **not** filtered out solely on tourism volume if compensating factors apply (strong hostel/social scene, accessible off-beat zones).
    - Lisbon, Bali, Chiang Mai, Cusco, etc. are touristy *and* legitimately on the table.
- Generic, average nightlife and clubs.
- Luxury or resort-style accommodations.
- Destinations with poor weather for the travel period.

### Activity rhythm rules (STRONG)

- **Party frequency: 1–2x per week maximum** anywhere — hard rule.
- **Sunrise/sunset hike timing** to avoid midday sun (see §8).

---

## 6. Food

- **STRONG:** Local food markets, authentic eateries, street food (Bourdain-style).
- **STRONG framing:** Food is enjoyed but not the #1 priority. Workflows should not over-weight food curation at the expense of other dimensions.
- **No stable healthy-eating definition.** Per-trip / per-day judgment.
    - *Note: the Context Pack lists "healthy eating" as routine maintenance, but no stable rule operationalizes it for me. Captured honestly here rather than fabricated.*

---

## 7. Mobility, capability & body

**Movement capability:**

- **STRONG:** Very experienced scooter rider. Off-beat exploration is a top mode; scooter is the favored vehicle in scooter-friendly geographies, with locally appropriate substitutes elsewhere (see §5).
- **STRONG:** Moderate fitness level. Comfortable with physical adventures, ATV, scooter.
- **STRONG ceiling:** Full-day hikes maximum. Multi-day treks not viable.

**Packing style:**

- **STRONG:** Backpack-heavy — main pack + daypack, one bag per category. Not minimalist / not carry-on-only.

**Travel onboarding:**

- **STRONG:** Jet lag barely affects me. Day 1 is a real activity day — workflows should not pad the first day.

---

## 8. Climate & body

Two-tier temperature rule (resolved from Asia 25 profile + Context Pack):

- **STRONG (CP-aligned):** Trip-average temperature ceiling: **27°C**. Used for destination screening — will I go there at all in those dates?
- **STRONG:** Single-day activity ceiling: **30°C**. Used for daily activity feasibility — if a day exceeds this, shift to indoor / shaded / early-morning activity.
- **STRONG positive target:** Comfort range is **20–27°C**. Workflows should aim for this, not just avoid the ceiling.
- **STRONG:** Open to any climate within the ceiling — cool/cold destinations are fully on the table, not just warm ones.

UV and sun sensitivity:

- **STRONG:** Significant UV / sun sensitivity. Cannot tolerate prolonged direct sun.
- **STRONG follow-on:** Outdoor activities should be timed to avoid midday sun (sunrise/sunset hiking, shade availability is a destination factor).

Rain:

- **SOFT:** Some rain tolerance, but prefer good weather overall.

---

## 9. Budget

- **STRONG (CP-locked):** ~€50/day baseline, all-in (accommodation + food + activities).
- **STRONG (CP-locked):** Splurge tolerance €100–150 for unique experiences.
- **SOFT:** Balance splurge days with cheaper days (discipline pattern, not a rigid rule).
- **SOFT:** Low-budget accommodation as default.
- **Per-trip artifact:** Each trip should have its own *splurge list*. The universal profile does not enumerate splurge categories — they're trip-specific (e.g., diving certification in tropical trips, multi-day hut treks in alpine trips, etc.).

---

## 10. Safety

- **STRONG:** Moderate risk tolerance. Normal traveler precautions apply.
- **STRONG:** Avoid destinations with active conflict zones.
- No further safety-related defaults.

---

## 11. Planning dimensions

Eight dimensions every trip-planning workflow should consider. **The list is stable; the ranking is per-trip** (the universal profile does not enforce an order — each trip's theme drives weighting).

1. Hostel / backpacker community strength.
2. Natural beauty and outdoor activities.
3. Opportunities to meet people.
4. Authentic local experiences.
5. WiFi reliability for work.
6. Weather conditions for travel dates.
7. Budget compatibility (~€50/day baseline).
8. Balance of adventure / culture / social.

---

## 12. Deliberate omissions

The following common traveler-profile sections are **deliberately absent** from this v1 profile because no stable preference exists. Workflows must not fabricate defaults here — these are per-trip decisions:

- **Urban vs. rural lean** — no stable preference.
- **Coastal vs. inland** — no stable preference.
- **Climate type** beyond the ceiling rule — open to any (no tropical / temperate / cool default).
- **Trip duration default** — varies; treat as a trip-specific input.
- **Seasonality** — no avoided or preferred months.
- **Route shape** — linear / loop / hub-and-spoke per-trip.
- **Payment style** (cash vs. card) — case-by-case.
- **Healthy eating definition** — per-trip judgment (see §6).
- **Reading habits while traveling** — no stable pattern.
- **Journaling habits while traveling** — no stable pattern.
- **Solo downtime / quiet-time needs** — no stable level.
- **Social vs. solo within-trip ratio** — default-social, no enforced split.

These absences are themselves information. Future retros may surface stable preferences in some of these; if so, promote into the profile via versioning.

---

## 13. Versioning & update protocol

- **v1** — Created 2026-05-10 from Asia 25 traveler profile + structured extraction (Passes 1–9 of the Universal Traveler Profile session methodology).
- Updates happen **only via the Phase 3 retro workflow** after a real trip. No ad-hoc mid-trip changes.
- Each update increments the version, dates the change, and logs what changed and why.

### Changelog

**v1 — 2026-05-10**

- Initial profile.
- Extracted from Asia 25 traveler profile, supplemented by gap-detection pass (Pass 6).
- Stress-tested against three hypothetical trips (Patagonia / Iberia / Georgia).
- Three patches applied from stress-test:
    1. Scooter framing made geography-aware (§5, §7).
    2. Stay-extension trigger broadened beyond nomad-hub mode to all base-town modes (§2).
    3. Anti-mass-tourism rule reframed to operate within-destination, not as a binary destination filter (§5).
