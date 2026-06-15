# Diagnostics: Rolling-Itinerary & Research Notes → System Improvement Map

**Date:** 2026-06-15
**Author:** Claude Code (analysis session)
**Source notes:** `Travel-Research-Rolling-Itinerary-Context.md` (operator-supplied, pasted in chat 2026-06-15 — not copied into the repo per Input File Handling)
**Status:** DIAGNOSTICS ONLY — no system files changed. This is the input to a later improvement session (e.g. `/fix-project-issues`, a Phase 2 design pass, or a Phase 3 retro amendment).
**Scope:** Maps every idea in the source notes to the real travel-os system (commands, reference files, agents, profile/principles, JSON schema) and states, per idea: what it is → where it lands → today vs. proposed → effort/risk → dependencies → open questions.

---

## 1. Executive summary

The source notes are, in one sentence: **a near-complete design specification for the in-trip operational layer the system has planned but never built (Phase 2), plus a set of concrete enrichments to the dossier the system already runs (Phase 1).**

Three findings up front:

1. **~70% of the notes describe Phase 2 (in-trip operation), which does not exist yet.** The
   rolling five-day horizon, the Locked/Soft/Optional classification, the live option bank, day
   construction (anchor→route→timing→logistics→backup), the adaptive decision triggers, the local
   intelligence loop, and the operating cadence are all new infrastructure. The project plan already
   names two of the entry points (`/daily-program`, `/tomorrow-spar`) and `CLAUDE.md` reserves
   `references/` files for them — so the notes are not a detour, they are the missing design content
   for a layer the roadmap was already holding open.

2. **~25% of the notes are enrichments to the built Phase 1 dossier that can land now**, without
   waiting for Phase 2. The richer "option record" fields, the option-function tag axis, the
   evidence/signals/unknowns distinction, and a candidate-scoring rubric all slot into existing files
   (`references/subagent-prompts.md`, `references/dossier-template.md`, the JSON schema, `build.mjs`).
   Several are partial matches — the system already does a weaker version.

3. **The notes contain one architectural decision that must be made before most of Phase 2 can be
   designed: how the dossier's hard "menu, not a schedule" rule relates to a rolling itinerary that
   does, by design, fully plan today and tomorrow.** These are reconcilable — they govern two
   different artifacts at two different times — but the boundary has to be written down explicitly or
   an implementer will read them as contradictory. See § 4.

The notes also independently re-derive the system's own two-layer instinct: "research is the upstream
intelligence layer; the rolling itinerary is the downstream decision layer." That maps exactly onto
Phase 1 (dossier = intelligence) feeding Phase 2 (board + day plan = decision). This is the spine to
build along.

---

## 2. How the notes map to the system at a glance

| Source-note section | System layer | Built today? | Finding(s) |
|---|---|---|---|
| Purpose; two-layer model (intelligence vs decision) | Architecture | Implicit only | C1 |
| Travel Style & Optimization Goal (maximize/minimize) | Profile + Principles | Mostly covered | C2 |
| Core Planning Doctrine (5-day horizon; Locked/Soft/Optional; last responsible moment) | Phase 2 | **No** | B1 |
| Research Workflow (6-step funnel) | Phase 1 dossier (5-pass) | Mostly — partial overlap | A5, C1 |
| What Research Should Produce — option record fields | Phase 1 — prompts + card + JSON | Partial (weaker set) | A1 |
| What Research Should Produce — function tags | Phase 1 — tag vocabulary | Different axis exists | A2 |
| Candidate Evaluation (8-axis 1–5 scale) | Phase 1 — synthesis + tiers | Weaker (3-tier) | A3 |
| Evidence / Signals / Unknowns | Phase 1 — research-status `rs` | Partial (`needs/researched/verified`) | A4 |
| Building a Day (anchor→route→timing→logistics→backup; day types) | Phase 2 `/daily-program` | **No** | B3 |
| Adaptive Decision Rules (triggers) | Phase 2 decision engine | **No** | B5 |
| Local Intelligence Loop | Phase 2 input path | **No** | B6 |
| Operating Cadence (evening / 3-day / weekly) | Phase 2 `/tomorrow-spar` + cadence | **No** | B4, B7 |
| Live option bank (persistent, promotable, deferral reasons) | Phase 2 artifact | **No** (dossier is static) | B2 |
| Expected Claude Code Behavior | Cross-cutting principles | Mostly covered | C2, C3 |

---

## 3. System baseline (what exists today, for grounding)

So the "today vs. proposed" lines below are verifiable, here is the relevant current state:

- **Four-layer roadmap** (`pipeline/project-plan.md`): Phase 0 spine (done) → Phase 1 pre-trip
  research / dossier (built, in active use on `trips/balkans-2026-06/`) → Phase 2 in-trip operational
  (planned, unbuilt) → Phase 3 learning loop (unbuilt) → Phase 4 trip selection (unbuilt).
- **The dossier pipeline** (`/destination-check` → `/trip-init` → `/destination-dossier`) runs a
  5-pass operator-gated funnel via the `dossier-orchestrator` agent against three reference files:
  `references/dossier-workflow.md`, `dossier-template.md`, `subagent-prompts.md`.
- **The dossier is explicitly static and explicitly a menu.** `dossier-template.md` § "Menu, not a
  schedule" is a hard governing rule: never render Day 1 / Day 2, never an hour-by-hour plan; the only
  time hint allowed is the per-place `Best time` field. The dossier is versioned and re-run, not
  edited live.
- **Per-place card fields today** (`dossier-template.md` + `subagent-prompts.md` `{per_place_fields}`):
  hook, Best time, Cost, Duration, Hours, Find it, Location, Tags, Tips, Unverified, plus a Hike-data
  line for hikes. JSON twin (`dossier-data.json`) carries these plus `time`/`purpose`/`dur`/`rs`/`pt`.
- **Tier system today:** 3 tiers — 🔥 HIGH / 👍 REC / 🆗 OK (`t` = 3/2/1 in JSON) — plus one ⭐
  "if you do one thing here" anchor **per stop** (not per day).
- **Tag vocabulary today (fixed):** `work, eat, sleep, swim, shade, hike, social, market, culture,
  view`. This is a "what facets does this place have" axis.
- **Research-status today (`rs`):** `needs` / `researched` / `verified`, workflow-assigned by actual
  completeness; `build.mjs` writes every `needs` place to `research-todo.md`.
- **Profile + principles** already encode much of the notes' "travel style": anti-overtourism,
  location-bound-experience bias, spontaneity-required (§5.4 *refuses* hour-by-hour week-ahead plans),
  routine protection, energy caps, scenic-journey preference, bail-out rule, base-town stay-extension
  trigger. **Critical governance constraint:** profile and principles update **only via the Phase 3
  retro workflow**, never ad-hoc (`CLAUDE.md` § Phase Gating). Any "add to profile/principles" finding
  must route through that gate, not a direct edit.

---

## 4. The decision that gates Phase 2: "menu, not a schedule" vs. a rolling itinerary

This is the single most important thing in this document. Resolve it first; several Phase 2 findings
depend on the answer.

**The apparent conflict.** `dossier-template.md` forbids a sequenced day-by-day plan in the strongest
terms ("Never render a fixed itinerary… no Day 1 / Day 2 running order"). The notes' Core Planning
Doctrine *does* fully plan today and mostly-plan tomorrow — that is a schedule.

**Why it is not actually a conflict.** They govern **two different artifacts at two different
moments**:

- The **dossier** is a *pre-trip* artifact. Before the trip, committing to a day-by-day plan is
  exactly the rigidity principle §5.4 bans. Menu-not-schedule is correct there and should stay
  untouched.
- The **rolling board** is an *in-trip* artifact. The notes' own doctrine — "preserve optionality
  until the last responsible moment," days 4–5 are "credible options only," beyond day 5 is "direction
  only" — is *the same anti-rigidity principle*, just applied while moving. Principle §5.4 even names
  "the day-before sparring workflow" as "the spontaneity engine." The rolling board IS §5.4's
  intended Phase 2 mechanism, not a violation of it.

**The required action (documentation, not code):** write the scope boundary down explicitly before
building Phase 2, so the two rules don't read as contradictory:

- Dossier = static pre-trip *menu* of vetted options. Rule: never a schedule.
- Rolling board = live in-trip *decision surface* that commits only the nearest 1–2 days and keeps the
  rest optional. Rule: never commit beyond the last responsible moment.
- The dossier's "menu, not a schedule" rule is scoped to the dossier; the board gets its own
  governing rule ("optionality until the last responsible moment"). Neither overrides the other.

This boundary is finding **C1/C3** below. Flagging it here because it is the keystone.

---

## 5. Findings

Each finding: **ID — title** · the idea · where it lands · today vs. proposed · effort · risk ·
dependencies · open questions.

### Cluster A — Enrich the built dossier (Phase 1). Landable now, no Phase 2 dependency.

---

**A1 — Deepen the per-place "option record"**

- **Idea (notes § What Research Should Produce):** every researched option should carry crowd
  conditions + how to reduce exposure; access from the likely base incl. realistic travel time and
  last return; whether it works as a full day / half day / route stop; nearby experiences that combine
  into a coherent route; solo-suitability + social-interaction potential; main failure risks +
  uncertainty + a suitable backup; source confidence + facts to verify locally.
- **Where it lands:** `references/subagent-prompts.md` `{per_place_fields}` block (the ask);
  `references/dossier-template.md` § per-place card (the render); `dossier-data.json` schema + v5
  additive fields; `build.mjs` validation.
- **Today vs. proposed:** Today's card has Best time / Cost / Duration / Hours / Find it / Tags /
  Tips / Unverified, plus Hike-data for hikes. **Missing vs. the notes:** crowd-level + mitigation
  (partially implied by anti-tourist filter, never a field), access-from-base + **last return**
  (exists *only* for hikes today — the notes want it on any out-of-base option as a safety field),
  full/half/route-stop role (related to `dur` but not the same axis), combinable-nearby links,
  explicit solo/social suitability, failure-risk + backup, source-confidence (partially covered by the
  surfacing "signal" the prompts already require).
- **Effort:** Medium. Adding fields to the prompt is cheap; deciding which survive into the *mobile*
  card without bloating it is the real work (the card must still read in two seconds on a phone).
  Likely answer: a few new card lines (crowd, last-return-where-relevant, backup), the rest ride in
  the JSON twin only.
- **Risk:** Low–medium. Risk is card bloat vs. the mobile-readability rules. Mitigate by splitting
  "renders on the card" from "rides in JSON for the in-trip layer."
- **Dependencies:** The combinable-nearby and full/half/route-stop fields are most valuable once the
  Phase 2 day-builder (B3) exists — but they cost nothing to start collecting now.
- **Open questions:** Which of the new fields render on the mobile card vs. JSON-only? Is per-place
  "backup" a dossier concept at all, or strictly a day-plan (B3) concept?

---

**A2 — Add an option-function / day-type tag axis**

- **Idea (notes § function tags):** tag each option by *function* — high-wow nature/landscape/village/
  historic; local-or-social; city/neighborhood; bad-weather option; transit-compatible stop;
  recovery/work/admin; time-sensitive event/market/festival/seasonal.
- **Where it lands:** controlled-vocabulary tag set in `dossier-template.md` § Controlled vocabulary
  and the JSON `tags`; consumed later by the adaptive triggers (B5) and day-builder (B3).
- **Today vs. proposed:** Today's tags (`work/eat/sleep/swim/shade/hike/social/market/culture/view`)
  are a *facet* axis ("what's here"), not a *function* axis ("what role does this play in a day").
  Three notes-tags have no equivalent and are high-value: **bad-weather option**, **recovery/admin
  option**, **transit-compatible stop**. These are exactly what the weather/energy adaptive triggers
  need to fire against ("weather poor → surface bad-weather options").
- **Effort:** Low to add the vocabulary; medium to backfill the existing Balkans dossier.
- **Risk:** Low. Decision needed: extend the single tag list, or add a *second* field (`role` /
  `function`) so facet-tags and function-tags don't collide. Recommend a separate field — they answer
  different questions and mixing them muddies both filters.
- **Dependencies:** None to define; high payoff once B5 exists.
- **Open questions:** One combined tag list or a separate `function` field? (Recommend separate.)

---

**A3 — Candidate evaluation rubric (8-axis 1–5) vs. the 3-tier system**

- **Idea (notes § Candidate Evaluation):** score each serious candidate 1–5 on wow/memory,
  authenticity, weather/seasonal fit, logistics, cost fit, crowd risk (high = low crowds), social
  potential, route logic. Scoring supports judgment, doesn't replace it.
- **Where it lands:** `references/dossier-workflow.md` Step 11 (synthesis through profile + principles,
  where tiers are currently assigned); `logs/dossier-runs.md` run-log grounding; **not** the dossier
  output surface.
- **Today vs. proposed:** Today the workflow assigns one of three tiers (🔥/👍/🆗) by "profile-fit
  strength and signal quality" — a holistic call with no explicit axes. The notes propose making the
  axes explicit. **Recommended interpretation:** the 8-axis score is an *internal* scoring instrument
  that *derives* the tier and gets logged to the run-log as grounding — it does **not** put eight
  numbers on the mobile card (that violates menu-readability and the D7 "no grounding in the output"
  rule). This makes tier assignment auditable and feeds the route-logic axis straight into Phase 2.
- **Effort:** Medium. It is a synthesis-step rule change plus a run-log format addition.
- **Risk:** Medium — false precision. The notes themselves warn "scoring should support judgment, not
  replace it." Guard against the rubric becoming a spreadsheet that overrides taste. Keep it as
  decision-support that produces the tier, logged not surfaced.
- **Dependencies:** Pairs with A2 (the route-logic and crowd axes lean on function tags / crowd
  field).
- **Open questions:** Do all 8 axes apply pre-trip, or are some (route logic, weather fit for *this
  exact day*) genuinely in-trip axes that belong to B5 instead? Is a single composite score wanted, or
  axis-by-axis only?

---

**A4 — Evidence / Signals / Unknowns distinction**

- **Idea (notes § Candidate Evaluation):** separate verified Evidence (schedules, access rules,
  closures) from Signals (repeated positive local indications) from Unknowns (needs local
  confirmation — informal bus, trail condition, current crowd, whether an event is actually running).
- **Where it lands:** `dossier-template.md` § Research status (`rs`) + `rsNote`; the prompts'
  "Unverified" field; `research-todo.md` generation in `build.mjs`.
- **Today vs. proposed:** The system already has a *three-state* research model (`needs` /
  `researched` / `verified`) and already asks subagents to flag "Unverified" time-sensitive facts.
  This is a **partial match** — the notes' trichotomy is richer (Signals as a distinct middle state =
  "credible but not verified," which maps onto `researched`; Unknowns map onto `needs` + `rsNote`).
  The gap is mostly **vocabulary alignment and making the distinction explicit in the prompt**, not
  net-new machinery.
- **Effort:** Low. Mostly a prompt + template wording pass to name the three states the notes' way and
  ensure `rsNote` captures *which* unknowns need local confirmation.
- **Risk:** Low.
- **Dependencies:** Strong synergy with A5 and B-layer (the in-trip layer is what *resolves* Unknowns
  on the ground).
- **Open questions:** Keep the existing `needs/researched/verified` names (and just map the concepts),
  or rename to evidence/signal/unknown? (Recommend keep the field, document the mapping — renaming
  churns `build.mjs` and the renderer for no functional gain.)

---

**A5 — Research depth follows decision proximity**

- **Idea (notes § Research Workflow):** research depth should scale with how soon the decision is.
  Tomorrow needs operational verification; days 3–5 need enough to stay credible; later possibilities
  need only enough to preserve the opportunity and signal when deeper work is due.
- **Where it lands:** Primarily Phase 2 (the rolling board is what has a "tomorrow" vs. "day 5"). But
  it has a Phase-1 hook: the dossier should *mark* time-sensitive facts as `needs` with a concrete
  `rsNote` so the in-trip layer knows exactly what to deepen as an option approaches the front of the
  horizon.
- **Today vs. proposed:** The dossier currently researches everything to one (best-effort) depth in
  one shot. It already supports graduated status via `rs` + `research-todo.md`, but there is no notion
  of "depth tracks proximity" because there is no horizon yet. So this is **mostly a Phase 2 finding**
  with a small Phase 1 reinforcement (be disciplined about marking unverified time-sensitive facts
  `needs`, which the workflow already instructs but is worth hardening).
- **Effort:** Low in Phase 1 (discipline reinforcement); inherent to B1/B3 in Phase 2.
- **Risk:** Low.
- **Dependencies:** B1 (horizon), B3 (day verification), A4 (status model).
- **Open questions:** None blocking — folds into B1/B3 design.

---

### Cluster B — Build the in-trip operational layer (Phase 2). The large new work.

> All of Cluster B is gated on the § 4 menu-vs-board decision and on Patrik's explicit Phase 1→Phase 2
> transition approval (`CLAUDE.md` § Phase Gating: "Phase transitions require Patrik's explicit
> approval"). The Phase 2 acceptance test is real-trip use for ≥3 days. The Balkans trip
> (`trips/balkans-2026-06/`) is the obvious first proving ground — which makes this timely, not
> theoretical.

---

**B1 — Rolling five-day horizon board + Locked/Soft/Optional classification**

- **Idea (notes § Core Planning Doctrine):** a rolling-wave board — today fully planned; tomorrow
  mostly planned (anchor/route/logistics/backup confirmed); day 3 a preferred candidate; days 4–5 a
  shortlist; beyond day 5 only direction + constraints + saved opportunities. Each plan classified
  **Locked** (commitment exists / delay = material risk), **Soft planned** (preferred, conditional),
  or **Optional** (researched candidate in the bank). Governing principle: preserve optionality until
  the **last responsible moment**.
- **Where it lands:** **New core artifact** — `trips/{slug}/rolling-board.md` (and likely a JSON twin
  for the HTML companion, consistent with the dossier's markdown+JSON pattern). **New reference file**
  — `references/rolling-itinerary.md` (the workflow contract, parallel to `dossier-workflow.md`;
  `CLAUDE.md` already anticipates new `references/` files for the in-trip commands). Possibly a new
  agent (`rolling-board-orchestrator`) mirroring `dossier-orchestrator`.
- **Today vs. proposed:** Nothing like this exists. The dossier is static and versioned; there is no
  live, mutable, horizon-structured decision surface.
- **Effort:** High. This is the spine of Phase 2 — new artifact schema, new reference contract,
  new command(s), state management (what's locked, what's promoted, what's deferred).
- **Risk:** Medium–high. Main risks: (a) recreating the rigidity §5.4 bans if "fully planned today"
  drifts into "fully planned week"; the horizon design must enforce the decay. (b) Mobile usability of
  a live-edited board on an iPhone. (c) Keeping it from duplicating the dossier — the board references
  dossier/option-bank items, it does not re-author them.
- **Dependencies:** § 4 decision (keystone); B2 (the option bank is the board's feedstock); A2
  (function tags drive what's promotable under which conditions).
- **Open questions:** Markdown-only or markdown+JSON twin? Is "today fully planned" even wanted given
  §5.4's spontaneity insistence, or is the real floor "tomorrow confirmed, today loosely anchored"?
  Five-day horizon fixed, or operator-tunable per trip?

---

**B2 — Live option bank (persistent, promotable, with deferral reasons)**

- **Idea (notes § What Research Should Produce + Expected Behavior):** research should produce a
  structured *live option bank*, not a flat attraction list. Strong rejected candidates are **kept**
  with a reason for deferral; new intelligence is captured, assessed, and either promoted to the board
  or retained in the bank. "Avoid silently converting optional ideas into commitments."
- **Where it lands:** **New artifact** — `trips/{slug}/option-bank.md` (+ optional JSON). Fed from:
  the dossier short lists (Phase 1 output), the dossier's *rejected-but-strong* candidates (currently
  dropped — see below), and the local-intelligence loop (B6). Promotion path into B1.
- **Today vs. proposed:** The dossier's short lists are the closest thing, but they are (a) static,
  (b) only the *approved* items — the long-list candidates that were good-but-not-picked are **not
  preserved with a deferral reason today**; they live in the `pass-N-state.md` files as raw long lists
  but aren't carried forward as a usable bank. The notes want a first-class, in-trip-mutable bank.
- **Effort:** Medium–high. New artifact + the promotion/deferral mechanics + wiring the dossier to
  seed it.
- **Risk:** Medium. Risk of becoming a junk drawer if items never expire or get re-assessed. The notes'
  "deferral reason" requirement is the guard — enforce it.
- **Dependencies:** B1 (promotion target), B6 (a major feed), A1/A2 (bank items want the richer
  record + function tags to be promotable intelligently).
- **Open questions:** Does the bank seed automatically from dossier long lists at trip start, or only
  from approved short lists + live intel? How do options expire / get re-surfaced?

---

**B3 — Day construction: `/daily-program`**

- **Idea (notes § Building a Day):** every meaningful full day has one primary **anchor**; supporting
  stops form a natural route around it. Construction logic: **anchor → route → timing → logistics →
  backup**. Classify the day (wonder / local-social / city / transit / recovery-admin / slow
  deep-dive) to make energy demand explicit. For fixed-time experiences (sunsets, ferries, trains,
  borders, markets) plan **backward from the critical moment**. The backup is a different good day
  under different conditions, not a weak substitute.
- **Where it lands:** **New command** `/daily-program` (already named in `CLAUDE.md` § Workflow
  References as a future command) + its reference file. Consumes the rolling board (B1) and option
  bank (B2); honors profile/principles routine scaffolding (work blocks Mon–Thu, sleep/exercise/eat
  slots, sunrise/sunset timing for UV sensitivity).
- **Today vs. proposed:** Doesn't exist. Note the dossier already has the ⭐ anchor concept, **but at
  stop granularity** ("if you do one thing *here*" = at this destination). The notes' anchor is at
  **day** granularity. Same idea, finer scope — reuse the concept, new level. Project-plan Phase 2
  already lists "a day-before plan respecting his routine" and "backup activity reserve" as
  deliverables — B3 is the concrete design for both.
- **Effort:** High. This is the second pillar of Phase 2.
- **Risk:** Medium. Must respect §5.4 (loose by design, not an hour-by-hour straitjacket) and the
  routine-maintenance / energy principles. Backward-planning from fixed-time anchors is the one place
  precise timing is legitimate — scope it to that.
- **Dependencies:** B1, B2, A1 (last-return + backup fields), A2 (day-type tags).
- **Open questions:** Output as a fresh artifact per day, or a "today" section of the rolling board?
  How loose is "planned" — anchor + route + backup only, or more?

---

**B4 — Tomorrow sparring: `/tomorrow-spar` (interactive evening review)**

- **Idea (notes § Operating Cadence):** a 20–30 minute evening review — confirm tomorrow's
  anchor/route/logistics/backup; recheck weather, opening conditions, transport, booking deadlines;
  fold in the day's local intelligence; update day-3 preferred + days-4–5 shortlist; decide stay /
  move / keep-open; check budget, energy, work, fatigue.
- **Where it lands:** **New command** `/tomorrow-spar` (named in `CLAUDE.md` as future) — explicitly
  **interactive, not one-shot** (project-plan Phase 2: "a 'what should I do tomorrow' sparring mode —
  interactive"). This is principle §5.4's named "spontaneity engine" and §1.3's bail-out reinforcement
  surface.
- **Today vs. proposed:** Doesn't exist.
- **Effort:** Medium–high. The interactivity (a real back-and-forth, not a generated plan) is the
  design challenge.
- **Risk:** Medium. The notes' value is in it being a *conversation* that updates the board, not a
  document generator. Easy to build the wrong (one-shot) thing.
- **Dependencies:** B1 (it edits the board), B3 (it confirms tomorrow's day plan), B5 (its decisions
  are the triggers firing), B6 (it ingests the day's intel).
- **Open questions:** Is `/tomorrow-spar` the *driver* that calls `/daily-program`, or a sibling? (They
  may collapse into one interactive evening command.)

---

**B5 — Adaptive decision rules / trigger engine**

- **Idea (notes § Adaptive Decision Rules):** explicit triggers instead of pretending the future is
  known — good weather → nature/viewpoints; poor weather → food/history/indoor/social; unusually
  social hostel → consider extending; location underperforms → advance the route; same recommendation
  independently twice → investigate promptly; scarce onward transport/accommodation → lengthen horizon
  + book earlier; low energy → convert next day to recovery/work; rare event / narrow seasonal window →
  allow override of the provisional plan.
- **Where it lands:** A reference doc (`references/decision-rules.md` or a section of the rolling-
  itinerary contract) consulted by `/tomorrow-spar` (B4) and `/daily-program` (B3). Several triggers
  already have principle backing — energy caps (§7.1), routine protection (§6.1), base-town extension
  (Profile §2), scenic/weather overrides (§6.2 weather override) — so this is partly *operationalizing
  existing principles into live triggers*, partly new.
- **Today vs. proposed:** No live trigger mechanism exists. The principles encode the *policy*; nothing
  *fires* it during a trip.
- **Effort:** Medium. Mostly authoring + wiring into B3/B4; leans on A2 function tags to have
  something to surface ("poor weather → show `bad-weather`-tagged options").
- **Risk:** Low–medium. Risk is triggers that nag or override too eagerly. Keep them advisory
  (surface + recommend), consistent with §1.1 (system surfaces, Patrik picks) and the notes' own
  "should not accept recommendations uncritically."
- **Dependencies:** A2 (function tags), B1/B2 (something to promote/defer), B4 (the surface that runs
  them).
- **Open questions:** Which triggers are advisory-only vs. allowed to auto-restructure the board? (Lean
  advisory throughout, per §1.1.)

---

**B6 — Local intelligence loop**

- **Idea (notes § Local Intelligence Loop):** on-the-ground intel is a *formal input* — hostel staff,
  travelers, locals, drivers, guides, forums, map reviews. Use precise questions ("where would you take
  a visiting friend for one day?", "what's overrated here?", "what's worth an extra night?"). Capture →
  assess fit/timing/access/source-quality → promote to board or retain in bank. Don't accept
  recommendations uncritically.
- **Where it lands:** A capture path into B2 (option bank) — could extend the existing
  `trips/{slug}/journal.md` (currently Patrik's own notes, read by the Phase 3 retro) or a dedicated
  `intel-log.md`. Assessment + promotion handled in `/tomorrow-spar` (B4). A canned "questions to ask
  locals" list could live in the rolling-itinerary reference.
- **Today vs. proposed:** No mechanism. `journal.md` exists but is a passive Phase 3 input, not an
  active in-trip intelligence feed.
- **Effort:** Medium. New capture artifact + the assess/promote step.
- **Risk:** Low. The "don't accept uncritically" guard maps to the dossier's existing anti-tourist +
  source-signal discipline — reuse that posture.
- **Dependencies:** B2 (where intel lands), B4 (where it's assessed), A1/A2 (so captured items become
  promotable records).
- **Open questions:** Extend `journal.md` or add a dedicated intel log? (Watch the Phase 3 retro
  contract — if `journal.md` gains structure, the retro must still read it.)

---

**B7 — Operating cadence (evening / 3-day / weekly)**

- **Idea (notes § Operating Cadence):** nightly evening review (B4); every 3 days reassess location +
  route direction; weekly broader reset (budget, health, laundry, work, accommodation, pace, route
  logic, is-the-trip-still-exciting). Sustainable rhythm ≈ two strong experience days → one
  lighter/social/transit/recovery day → strong day → reassess.
- **Where it lands:** The 3-day and weekly tiers are larger-grain reviews — either modes of
  `/tomorrow-spar`, or a separate `/trip-reset` cadence command. The two-strong-then-light rhythm is a
  *pacing rule* the day-builder (B3) and triggers (B5) should respect; it also echoes principle §6.1
  (recovery space in surrounding 48h) and §7.1 (energy).
- **Today vs. proposed:** No cadence mechanism. (Note the *repo-side* Friday/Monday cadence commands
  are for system maintenance, not travel — not reusable here, but a structural precedent for
  cadence-style commands.)
- **Effort:** Medium.
- **Risk:** Low.
- **Dependencies:** B1, B4.
- **Open questions:** Separate `/trip-reset` command, or cadence tiers inside `/tomorrow-spar`? Encode
  the two-strong-then-light rhythm as a hard pacing rule or an advisory default? (Advisory — §5.4
  spontaneity + no stable social/solo ratio in Profile §12.)

---

### Cluster C — Cross-cutting / governance.

---

**C1 — Document the two-layer architecture + the dossier → bank → board → day handoff**

- **Idea (notes § Purpose):** "research is the upstream intelligence layer; the rolling itinerary is
  the downstream decision layer." Separate destination discovery from day construction and booking.
- **Where it lands:** `CLAUDE.md` § Workflow References (extend it to describe Phase 2 alongside the
  dossier) + a new architecture note (or `pipeline/architecture.md`). Define the contract: dossier
  (Phase 1, static menu) → seeds option bank (B2) → promotes to rolling board (B1) → renders a day via
  `/daily-program` (B3), with `/tomorrow-spar` (B4) as the driver.
- **Today vs. proposed:** The two-layer split is implicit in the four-layer roadmap but the *handoff
  contract between Phase 1 output and Phase 2 input is undefined* (because Phase 2 doesn't exist).
  This finding is the connective tissue for all of Cluster B.
- **Effort:** Low–medium (documentation). **Do this early** — it's the design frame B1–B7 build inside.
- **Risk:** Low.
- **Dependencies:** § 4 decision.
- **Open questions:** See § 4.

---

**C2 — Reconcile the notes' optimization goals + "expected behavior" with profile/principles**

- **Idea (notes § Travel Style, § Expected Claude Code Behavior):** maximize wow/authenticity/weather-
  fit/access/route-flow/local-interaction; minimize generic sightseeing/bookings/zigzag/overpacking/
  false-precision/looks-good-online-bad-in-reality. Behave as decision-support: rank don't accumulate,
  explain fit, surface uncertainty early, preserve rejected options, never silently commit.
- **Where it lands:** Mostly already covered by profile + principles. Genuinely-new candidates worth
  considering: **route-flow / geographic-coherence as an explicit optimization axis** (the notes'
  "a slightly weaker place may be better if it fits the route" — currently only implicit in multi-stop
  Pass 2); **local-interaction potential as a first-class scored dimension** (Profile §4 values social
  density but doesn't score per-option social potential); **"performs poorly in reality vs. looks good
  online"** as a named anti-signal (stronger than the current anti-tourist filter).
- **Today vs. proposed:** Profile/principles already encode anti-overtourism, location-bound bias,
  spontaneity, routine, energy, scenic-journey. The above three are the real gaps.
- **Effort:** Low to identify; **governance-gated to apply.** **Critical:** profile + principles update
  **only via the Phase 3 retro workflow** (`CLAUDE.md` § Phase Gating). These cannot be edited
  directly. Either route through a retro, or treat as a deliberate pre-trip spine amendment that Patrik
  explicitly approves as an exception. Flag, do not silently edit.
- **Risk:** Low (analysis); medium if the governance gate is bypassed.
- **Dependencies:** Phase 3 retro workflow (also unbuilt) — or an explicit operator exception.
- **Open questions:** Wait for the first real-trip retro to fold these in, or make a one-time pre-trip
  amendment now (before the Balkans trip) given the system is young?

---

**C3 — Write the menu-vs-board scope boundary into the rules**

- **Idea:** the resolution from § 4 — make explicit that "menu, not a schedule" governs the *dossier*,
  and "optionality until the last responsible moment" governs the *board*, and neither contradicts the
  other.
- **Where it lands:** `dossier-template.md` § Menu-not-a-schedule (add a scope note pointing to the
  board) + the new `references/rolling-itinerary.md` (state the board's own governing rule).
- **Today vs. proposed:** Today only the dossier rule exists, stated absolutely. Without this note, the
  board reads as a violation of it.
- **Effort:** Low.
- **Risk:** Low — but **high-leverage**: skipping it is how a future implementer builds a board that
  either illegally schedules or is so loose it's useless.
- **Dependencies:** § 4 decision; precedes B1.
- **Open questions:** None.

---

## 6. Recommended sequence

Ordered by dependency and value, not by note order.

**Wave 0 — Decide & frame (low effort, unblocks everything):**
1. § 4 / C3 — make the menu-vs-board scope decision and write the boundary.
2. C1 — document the two-layer architecture + the Phase 1→Phase 2 handoff contract.

**Wave 1 — Enrich the built dossier (lands now, no Phase 2 dependency, improves the upcoming Balkans
trip immediately):**
3. A2 — add the option-function tag axis (cheap, high payoff for later triggers).
4. A1 — deepen the option record (decide card vs. JSON-only per field).
5. A4 — align the evidence/signals/unknowns vocabulary onto `rs`.
6. A3 — make tier assignment explicit via the scoring rubric (internal/logged, not surfaced).
7. A5 — harden "mark time-sensitive facts `needs`" discipline.

**Wave 2 — Build the in-trip spine (Phase 2; requires explicit phase-transition approval + a real
trip to test on):**
8. B2 — option bank (seed from the dossier).
9. B1 — rolling board + Locked/Soft/Optional.
10. B3 — `/daily-program` day construction.
11. B4 — `/tomorrow-spar` interactive evening review.
12. B5 — adaptive trigger engine.
13. B6 — local intelligence loop.
14. B7 — 3-day / weekly cadence.

**Wave 3 — Governance (gated):**
15. C2 — fold new optimization axes into profile/principles via the Phase 3 retro (or an explicit
    pre-trip amendment).

---

## 7. Open decisions for Patrik (the genuine forks)

These an implementer cannot resolve alone:

1. **Menu vs. board boundary (§ 4):** confirm the two-artifact framing — dossier stays a static menu;
   a new in-trip board carries the rolling plan. (Recommended: yes.)
2. **Phase transition:** approve starting Phase 2 design now, or stay in Phase 1 and only do Wave 1
   dossier enrichments first? (`CLAUDE.md` requires explicit approval to cross phases.)
3. **Test trip:** is the upcoming Balkans trip the Phase 2 proving ground (its dossier is built and
   live), or wait for a later trip?
4. **Profile/principles amendments (C2):** wait for the first retro, or make a one-time pre-trip spine
   amendment now?
5. **Should the source notes become a canonical reference?** They are a strong candidate to become
   `references/rolling-itinerary.md` (the Phase 2 north-star), close to verbatim. Not copied here per
   Input File Handling — flag for an explicit "save this as the reference" instruction if wanted.
6. **Card-bloat policy (A1):** which new fields are allowed onto the mobile card vs. JSON-only?

---

## 8. Scope note

This document changed no system files. It read: `references/dossier-workflow.md`,
`references/dossier-template.md`, `references/subagent-prompts.md`, `profile/travel-principles.md`,
`profile/universal-traveler-profile.md`, `pipeline/project-plan.md`, and the command/agent inventory.
The source notes were read from the chat-pasted document and were **not** copied into the repo
(Input File Handling). Profile and principles were **not** edited — any changes there are gated by the
Phase 3 retro workflow (C2).
