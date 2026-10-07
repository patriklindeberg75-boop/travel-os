---
title: "travel-os — Idea Consolidation Pass"
purpose: "Consolidate scattered ChatGPT-scoped improvement notes into an organized, deduplicated, theme-separated body of material for travel-os. Analytical only — not an implementation plan (Claude Code owns implementation)."
created: 2026-06-16
maintainer: Patrik
sources: 11 (8 documents + 3 inline note-sections)
scope: "Operations performed — dedup, merge, seven-theme separation, weak/redundant flags, strongest-logic preservation, contradiction surfacing, overbuilt/underdeveloped identification."
note: "Saved verbatim from operator-pasted content (2026-06-16). Paste-encoding artifacts (mojibake) normalized to intended Unicode; no content changes."
---

# travel-os — Idea Consolidation Pass

This takes the scattered improvement notes and turns them into an organized body of
material: deduplicated, merged, separated into seven themes, with the strongest logic
preserved and the weak, redundant, contradictory, overbuilt, and underdeveloped parts
flagged. It is an **analytical map of the source material**, not an implementation plan —
how this gets wired into the repo is left to Claude Code.

---

## How to read this

**Seven themes** (the requested separation):
**Strategy** (why / core reframes) · **Scope** (what's in/out, how big) · **Design**
(artifact shapes, formats, taxonomies) · **Technical** (tools, sources, search mechanics,
Claude-prompt material) · **Governance** (rules, gates, cadences, commitment discipline) ·
**Execution** (on-the-ground behavior) · **Measurement** (scoring, feedback, learning).

Many ideas legitimately touch two themes. Each is placed in its **primary** home and
cross-referenced rather than duplicated — modeling the same dedup discipline applied to the
notes.

**Inline tags:**
`[STRONGEST]` keep, foreground · `[REDUNDANT]` says nothing new, collapse ·
`[WEAK]` low value or fragile as stated · `[OVERBUILT]` more machinery than the job needs ·
`[UNDERDEVELOPED]` right instinct, missing mechanism · `[CONTRADICTION]` conflicts with
another note or with a travel-os constraint.

**Source key:**
`D2` Rolling-wave planning · `D3` Traveling with purpose · `D4` Low-budget travel ·
`D5` Efficient long lists (discovery + research stack) · `D6` Deterministic "Magical" system
(`D6a` = its Practical-Tips appendix) · `D7` Experience Design Layer spec ·
`D8` Rolling 5-Day system · `P` Pro tips (inline) · `F` Finding unique stuff to do (inline) ·
`L` Local signal channels (inline). "(×N)" = stated N times *within* one source.

---

## 0. Source inventory & duplication map

Eleven sources, ~42 distinct ideas, but only a fraction are unique. The notes are heavily
self-overlapping: the same operational backbone is restated up to six times. The table below
is the dedup evidence — concept, where it appears, how many sources carry it, and the verdict.

| Concept | Sources | # | Verdict |
|---|---|---|---|
| Rolling 3–5 day planning horizon | D2(×4), D3, D5, D8 | 4 docs | **Collapse** to one canonical statement. Backbone. `[STRONGEST]` |
| One anchor per day | D2(×3), D3, D5, D6, D8 | 5 | **Collapse.** Keep. |
| Evening review / replan loop | D2(×2), D3, D8, P | 4 | **Collapse.** |
| Routes not lists | D2(×2), D3, D8 | 3 | **Collapse.** |
| Backup day / Plan A-B-C | D2, D6, D8 | 3 | **Collapse.** |
| Soft commitment / last responsible moment | D2(×2), D8, P | 3 | **Collapse.** P adds a status enum. |
| Local intelligence (better questions, right people, repeated-signal) | D2, D3, D5, D6, F, L | **6** | Most-duplicated content theme. **Collapse hard;** L is the fullest treatment. `[STRONGEST]` |
| Quick scoring filter (1–5) | D2, D6, D8 | 3 | **Merge** three divergent rubrics into one. |
| Strategic splurge rule | D4(×2), F | 3 | **Collapse.** Aligns with existing splurge posture. |
| Budget by category / weekly envelope | D4(×2), P | 3 | **Collapse.** |
| Travel slower / nights-per-place / fewer one-nighters | D4, D6, L, P | 4 | **Collapse.** |
| Crowd arbitrage / timing / overnight-in-day-trip-places | D6(×2), F, L | 4 | **Collapse;** D6 fullest. `[STRONGEST]` |
| Plan around light / "magic window" | D6, D7, F | 3 | **Collapse.** |
| Experience recipes / design-not-attractions | D3, D4, D6, D7, F | 5 | **Collapse;** D7 is the formal version. `[STRONGEST]` |
| Scenes, not destinations | D6, D6a | central | Effectively unique; sharpest reframe. **Elevate.** `[STRONGEST]` |
| Destination thesis / 2–4 themes per place | D3, D4, D6 | 3 | **Collapse.** |
| Three-layer research (classic/local/experience) | D3, D5 | 2 | **Collapse** (D5's "five categories" = same idea, finer cut). |
| Pre-arrival one-page dossier | D3, D4 | 2 | **Collapse.** Already exists in travel-os Phase 1. |
| Discovery → shortlist → route phasing | D5, D6 | 2 | **Merge;** these are two overlapping full-workflow proposals. |
| Research / source stack | D5, D6a | 2 | **Collapse.** |
| Search experiences not cities / local-language search | D5, L | 2 | **Collapse.** |
| Post-trip review / learning loop | D6(×2), D3, F | 4 | **Collapse.** D6 §9 → §13 = redundant *within one doc*. |
| Nightly field notes (3 lines) | D3, F | 2 | **Collapse** with retro (in-trip instance of it). |
| Energy / rhythm / recovery days | D2, D8(×2), P, F | 5 | **Collapse;** D8's day-types is the operable version. |
| Day-type taxonomy (Wonder/Social/City/Transit/Recovery/Deep-dive) | D8 | 1 | **Unique.** Keep. |
| Constraint mapping / risk checks | D2, P | 2 | **Collapse;** P adds health/medical/insurance. |
| Backward planning from critical moment | D2 | 1 | **Unique.** Narrow scope — keep, scoped. |
| Reduce friction before each move | D6, F, P | 3 | **Collapse.** |
| Decision rules / triggers (stay/move/skip/reroute) | D2, P | 2 | **Collapse;** codify into an actual ruleset. `[UNDERDEVELOPED]` |
| Exit criteria / no-regret minimum plan | P(×2) | 2 | **Collapse.** |
| Opportunity cost / density-not-distance | P, D6a | 2 | **Collapse.** |
| Option bank / scene-candidate longlist | D2, D6, D8 | 3 | **Collapse.** |
| Hard shortlist cap (3 A-tier, 5 B-tier) | D6a | 1 | **Unique.** Keep — it counters overbuild. |
| Separate inspiration from decision | D5, D6a, P | 3 | **Collapse.** |
| Maps as reality-check / "detective" | D5, D6a, L | 3 | **Collapse.** |
| Reject fragile / identify hidden condition | D6a(×2), L | 2 | **Collapse.** `[STRONGEST]` |
| Do-not-repeat list | F | 1 | **Unique.** |
| One bold move per place | F | 1 | **Unique** (small tactic). |
| Three versions per place (budget/memorable/social) | D7 | 1 | **Unique.** Keep. |
| Experience pattern library | D7 | 1 | **Unique.** `[UNDERDEVELOPED]` (no build/maintain mechanism). |
| Live trip dashboard | P, D6a | 2 | Keep cautiously. `[CONTRADICTION]` vs "no dashboard." |

**Headline:** roughly **70% of the volume is restatement of one in-trip operating loop**
(rolling board + anchor + evening review + soft commitment + local intelligence + quick
scoring). The genuinely additive material is smaller and concentrated in five places: the
**scene reframe** (D6), the **experience-design spec** (D7), the **day-type taxonomy** (D8),
the **discovery/research stack** (D5), and a scatter of **governance primitives** (status
enum, decision triggers, risk checks, splurge rule).

---

## 1. Strategy — the why and the core reframes

The conceptual layer. These are the ideas that change *how the system thinks*, not what it
outputs.

- **Plan scenes, not destinations.** `[STRONGEST]` (D6) The unit of planning is not "Serbia"
  but `place + season + weather + light + access + people + mood + friction`. This is the
  single strongest reframe in the whole batch and it *subsumes* the weaker "anchor" framing:
  an anchor is just a scene that hasn't had its conditions identified yet. Pair it with the
  **hidden-condition rule** (D6a): every candidate scene must name the one thing that has to
  be true (season / light / market day / overnight / specific viewpoint) for it to work — if
  you can't name it, the candidate is too vague to keep.

- **Increase the surface area for luck.** `[STRONGEST]` (D6) The goal is not to remove
  chance — that makes travel sterile — but to engineer conditions where good chance is more
  likely. This is the philosophical spine that reconciles the structure-vs-spontaneity
  tension (see §8). Everything downstream should serve odds, not control.

- **Design experiences, don't list attractions.** `[STRONGEST]` (D3, D4, D6, D7, F) Shift
  the operative question from *"what is there to do here?"* to *"what is the best lived
  experience this place naturally supports under my constraints?"* Five sources converge on
  this; it's the strategic mandate behind the Design and Technical sections.

- **Give each destination a thesis.** (D3, D4, D6) Treat a place as a temporary field study
  with 2–4 themes (e.g. Budapest = thermal-bath city + Austro-Hungarian capital + Danube
  geography + local-life-beyond-the-core). Lightweight, high-leverage; it directs research
  without rigidifying it.

- **Crowd arbitrage beats obscurity.** `[STRONGEST]` (D6, F, L) You rarely need *unknown*
  places — you need *better timing* than everyone else: arrive before 08:00, stay overnight
  where others day-trip, pick the secondary town, go shoulder-season/weekday, use local
  transport, accept imperfect weather. Strongly aligned with the anti-tourist constraint, and
  more actionable than "find hidden gems."

- **Intelligent-per-euro, not cheap.** (D4) Low budget is a *design* stance, not a
  restriction: replace packaged paid experiences with place-specific designed ones. Frames
  the whole budget theme correctly.

- **Amateur vs professional mindset.** (D2) Amateurs ask "what are the best things here?";
  professionals ask "what's the best day I can construct under *today's* constraints?" Useful
  framing line, but it's a restatement of the experience-design mandate above — keep as a
  one-liner, not its own pillar.

---

## 2. Scope — boundaries and how big the system should be

This theme is where the notes argue with themselves the most (see §8, §9). The defensible
scope position is built from the *self-limiting* notes, not the expansive ones.

- **Phase the workflow: discovery → shortlist → route → rolling execution.** (D5, D6 merged)
  Both full-workflow proposals agree on this shape. D5's four phases and D6's six phases are
  the **same pipeline at different resolution** — merge to: (1) constraints, (2) aggressive
  longlist, (3) reality-check + score, (4) route concepts, (5) rolling in-trip execution.
  Don't maintain two competing phase models.

- **Don't research logistics during discovery.** `[STRONGEST]` (D5) At longlist stage, no
  hotels/buses/restaurants — only "is this place worth wanting?" Clean scope boundary that
  prevents premature detail.

- **Cap the shortlist hard.** `[STRONGEST]` (D6a) Force 3 A-tier anchors + 5 B-tier options,
  rest archived. This is the antidote to the system's own overbuild tendency — keep it
  prominent.

- **Longlist size is contested.** `[CONTRADICTION]` D5 says 20–40 places; D6 says 50–100
  scene candidates. Partly reconciled by unit (places vs scenes), but the volume guidance
  still conflicts and both feed the same "collect aggressively" stage. **Resolution:** adopt
  D6's *scene* unit but D5's *smaller* volume — ~30–50 scene candidates — because the hard cap
  downstream makes 100 wasted effort.

- **Lightweight is a scope requirement, not a nice-to-have.** `[STRONGEST]` (D6a, ×several)
  The notes' own strongest scope signal: "the main risk is that the system becomes too
  theoretical… without a cap it becomes endless research… do not over-optimize." Treat this
  as the governing scope constraint — any proposed mechanism that can't stay lightweight is
  out of scope by default.

- **Solo + social is in scope simultaneously.** (D6a §8) The system should optimize for both
  cinematic solo moments *and* social surfaces (guesthouses, markets, buses). Worth stating
  because it prevents over-indexing on views alone.

---

## 3. Design — artifact shapes, formats, taxonomies

The structural layer: what the system's outputs and working surfaces should *look like*.
The big finding here is **template sprawl** (see §9) — five overlapping "fill-in-the-blanks"
formats exist and need to collapse to two.

- **The rolling 5-day board.** `[STRONGEST]` (D2, D3, D5, D8 — 4 sources) Canonical structure:
  Today (fully planned) → Tomorrow (mostly) → Day 3 (preferred option) → Days 4–5 (shortlist)
  → Later (loose direction + saved spots). This is the central in-trip artifact. State once.

- **The three-layer day.** `[STRONGEST]` (D2, D8) Anchor → Supporting route (geographic flow,
  not a spot-list) → Flexible backup. The "Anchor → Route → Timing → Logistics → Backup"
  formula (D2) is the cleanest expression.

- **Day-type taxonomy.** (D8) Wonder / Local-Social / City-Exploration / Transit /
  Recovery-Admin / Deep-Dive, with rotation rhythm (2 strong → 1 light → 1 strong → reassess).
  **Unique and operable** — earlier "don't make every day big" advice (D2) only gestured at
  this; D8 names the types, which makes rhythm plannable. Keep.

- **The experience-recipe format.** `[STRONGEST]` (D7, F) Named recipe + "best when" + sequence
  + budget + risk + upgrade. The most implementation-ready format in the batch.

- **Three versions per place.** (D7) Best low-budget / most memorable / best social-local
  version. Unique to D7, cheap to produce, high decision value. Keep.

- **The experience pattern library.** `[UNDERDEVELOPED]` (D7) Reusable per-place-type patterns
  (lake / mountain village / historic town / coast / market). The *idea* is strong — it lets
  the system infer good days even for places not yet researched — but the note never says how
  the library is built, stored, or maintained. Right instinct, missing mechanism. (Note: it
  has an obvious home in the existing `dossier-data.json` place-record model — the connection
  is just unmade in the notes.)

- **The option bank.** (D2, D8) A live menu of candidate experiences by type (high-wow /
  local-social / bad-weather / transit-compatible / recovery). This is the "Later" bucket of
  the board and the scene-candidate longlist, seen from the execution side — **same artifact,
  three names.** Collapse.

- **TEMPLATE COLLAPSE NEEDED.** `[OVERBUILT]` Five formats describe overlapping things: the
  pre-arrival dossier (D3, D4), the day-plan template (D8 §7), the experience recipe (D7), the
  three-version block (D7), and the trip dashboard (P, D6a). They reduce to **two canonical
  shapes**: a *pre-trip* place artifact (dossier/recipe/pattern — serves the existing Phase-1
  dossier) and an *in-trip* day artifact (board entry + three-layer day — serves the
  `/daily-program` work). Maintaining all five separately is pure overhead.

- **Anchor-first, logistics-second** (D8) is a design ordering rule for the day artifact, not
  its own thing — fold into the three-layer day.

---

## 4. Technical — tools, sources, search mechanics, Claude-prompt material

The implementable layer. This is where D5 and D7 do most of their work, and where the
Mode-1 (manual handoff) reality of travel-os matters most.

- **Search experiences, not cities.** `[STRONGEST]` (D5, L) Query "most unforgettable
  experiences in Montenegro" / "places that don't feel real" / "villages locals prefer," not
  "what to do in Montenegro." Highest-leverage single research-mechanics shift.

- **Search in the local language.** `[STRONGEST]` (L) `najljepša sela Bosna` etc. via
  translate; surfaces blogs/forums/Maps content international search never reaches. One of the
  biggest practical edges and currently nowhere in the system.

- **The repeatable source stack.** (D5, D6a) Each source has a fixed role: Instagram/TikTok =
  candidate generation only; Google Maps = reality-check; Reddit = candid/repeated-signal;
  YouTube = atmosphere + logistics; local blogs = non-obvious places; Rome2Rio/Seat61/Omio =
  access realism; weather history = season fit. **Rule: never let the inspiration source make
  the decision.** Note `[WEAK]` sub-point: the *specific* named tools are the kind of detail
  that drifts/goes stale — encode the *roles*, treat tool names as swappable.

- **Google Maps as detective / reality-check.** `[STRONGEST]` (D5, D6a, L) Low review count +
  strong photos + local-language reviews + nearby café/bus = high-probability gem. Cross-check
  Instagram's best-case against Maps' normal-case (recent + bad-weather + crowd photos) before
  committing. Concrete and high-value.

- **Reverse-engineer the photo.** (D6) For any beautiful image, identify what made it work
  (season/fog/drone/no-people/editing) before trusting it. This is the *technical instance* of
  the hidden-condition rule.

- **Validate before going.** (L) Access route, recent reviews, last transport back, open/
  accessible, permission/guide needed. "Hidden ≠ good." Merge with reject-fragile (§Strategy).

- **The experience-design prompt (D7).** `[STRONGEST]` The one piece of directly
  implementation-shaped material: a structured prompt that makes Claude classify place-type →
  match to situation → output recipes + three versions + timing + what-to-avoid + what-to-ask
  + half/one/two-day plans. Maps almost directly onto the `/daily-program` spec and the
  reference-file methodology. **Mode-1 note:** like the rest of travel-os, this runs as a
  copy-paste handoff today, not an API call — keep it phrased as a prompt template, not an
  automation.

---

## 5. Governance — rules, gates, cadences, commitment discipline

The decision-discipline layer. Several of these are the genuinely additive non-duplicated
material, but the most important ones are also `[UNDERDEVELOPED]` — described by example,
never codified.

- **Soft commitment by default; lock only at the last responsible moment.** `[STRONGEST]`
  (D2, D8, P) Decide at the last point where waiting is still safe. Lock only what creates
  real downside if delayed (capacity, price spikes, scarce transport, weather windows, borders).
  Core governance principle.

- **Status taxonomy.** (P) Candidate → Shortlisted → Route-fit → Bookable → Locked → Skipped.
  P's concrete contribution; it makes "soft commitment" trackable. Keep.

- **Decision rules / triggers.** `[UNDERDEVELOPED]` (D2, P) Stay / move / skip / reroute rules
  ("stay if social energy + good weather + unresolved experiences"; "reroute if weather
  destroys the main reason"). Strong concept, but every source gives *examples* and none gives
  a usable codified ruleset. This is a prime candidate for being turned into an actual decision
  table — the instinct is right, the mechanism is missing.

- **Exit criteria / no-regret minimum.** (P) Define "done" per stop before arriving ("done once
  I've done the main hike, the old town, one local meal, checked one nearby village") and the
  one-day minimum-viable version. Prevents both under-staying and aimless drifting. Pairs
  naturally with triggers.

- **Risk checks before committing.** (D2, P) Weather, transport reliability, health, safety,
  border/visa, medical access, activity insurance. P meaningfully extends D2's
  constraint-mapping with the **health/medical/insurance** dimension that's otherwise absent —
  keep that addition.

- **Budget governance: envelope, not daily cap.** `[STRONGEST]` (D4, P) Allocate by category
  (accommodation / food / transport / experiences / buffer) and govern by **weekly** envelope
  (€350/wk with €30–90 day swings) rather than a rigid daily number. Accommodation+transport =
  fixed backbone; food+activities = the flex. Directly compatible with the existing per-trip
  splurge posture.

- **Strategic splurge rule.** `[STRONGEST]` (D4, F) Spend above baseline only when it unlocks an
  experience otherwise inaccessible (mountain-village guesthouse, scenic train, thermal bath,
  hard-access guided hike, one excellent local meal). This is the gate on all discretionary
  spend and it already echoes the `trip-context.md` splurge posture.

- **Cadence: evening / 3-day / weekly.** (D8, D2, D3) Evening = update tomorrow + next 3–5
  days; every 3 days = stay/move/reroute decision; weekly = full reset (budget, laundry,
  health, route, work, "does this still feel exciting?"). Cleanest governance rhythm; D8
  states it best.

- **Field rules (behavioral).** (D6a) Pre-committed on-the-ground rules ("wake early once per
  scenic place," "don't leave a promising town after one night," "say yes to safe local
  invitations"). Governance of *behavior* rather than plans — keep as a short standing list,
  resist inflating it.

---

## 6. Execution — on-the-ground behavior

The do-it-while-traveling layer. Heavily duplicated; collapses to a compact tactics set.

- **The evening review ritual.** `[STRONGEST]` (D2, D3, D8, P) 20–30 min: tomorrow's anchor?
  weather still fits? what needs booking? what local lead did I hear today? stay/move/open?
  This is the heartbeat of the whole in-trip system. State once, prominently.

- **The local-intelligence loop.** `[STRONGEST]` (D2, D3, D5, D6, F, L — 6 sources) The
  most-duplicated content in the batch, collapsing to: ask the *right people* (hostel staff,
  café owners, bartenders, drivers, students, market vendors — not tourist offices); ask
  *better questions* ("where would you take a visiting friend?", "what's overrated?", "where do
  locals go Sunday?", "is there a less-known version of that?"); trust *repeated signal* (same
  answer from 5–10 people); then **route strong answers onto the board.** The capture step is
  `[UNDERDEVELOPED]` everywhere — lots on how to *gather*, almost nothing on where it *goes*.

- **Crowd-arbitrage tactics.** `[STRONGEST]` (D6) Arrive afternoon, stay overnight, walk at
  sunset, wake early, leave after breakfast — converts a day-trip-crowded place into a
  memorable one. The single highest-leverage execution move.

- **Protect one "magic window" per day.** (D6, D7, F) Don't fill the whole day; reserve
  sunrise–09:00 or late-afternoon–sunset for active memorable-moment hunting; use midday
  (harsh light, more tourists) for transport/rest/work/museums. Folds "plan around light" in.

- **Density not distance.** (D6a, P) Build routes where several strong scenes cluster within
  one base (2–3 nights without running out), not one amazing place surrounded by dead time.
  Route-construction tactic + the opportunity-cost discipline ("is this worth two travel days
  and €80, or going deeper here?").

- **Reduce friction before each move.** (D6, F, P) Know arrival point, route to accommodation,
  cash need, last transport, check-in constraints, backup transport. "Bad logistics destroy
  good destinations."

- **Energy as a planning input.** (D2, D8, P, F) The hidden risk is too many big days, not too
  few ideas. Rotate via day-types; slow mornings after travel days; one low-pressure day every
  4–6 days; fewer one-night stops; leave half a day unscheduled every 3–4 days (where
  invitations and detours actually happen).

- **Backward planning.** (D2) For fixed-timing days (sunset, train, ferry, border, ticketed
  site), plan backwards from the critical moment. `[WEAK-ish]` — strong but narrow; keep
  explicitly scoped to fixed-timing days, don't generalize it into a daily habit.

- **Food: eat local by default.** (D4) Bakeries, markets, canteens, lunch menus, picnics; 3–5
  food *priorities* per place (dishes/formats/neighborhoods, not restaurant lists).
  `[CONTRADICTION]`-adjacent — see §8; D4 over-weights food relative to the profile, so keep
  the tactic but not D4's emphasis.

- **Small unique tactics — keep as a menu, don't elevate to rules:** one bold move per place
  (F), the "Sunday test" (L), ask for the "second-place" recommendation (L), return to the same
  café/bar twice (D6). Good, cheap, but `[WEAK]` if formalized into mandatory steps. A tactics
  menu, not a checklist.

---

## 7. Measurement — scoring, feedback, learning

The feedback layer. Two clusters: a *quick pre-decision filter* and a *post-trip learning
loop*. The filter is over-specified across three sources; the learning loop is
under-mechanized.

- **One quick scoring filter (merge of three).** `[REDUNDANT — MERGE]` D2, D6, and D8 each give
  a 1–5 rubric with overlapping-but-different dimensions. Collapse to one:
  **Wow · Logistics ease · Weather/season fit · Crowd risk · Cost fit · Social potential ·
  Route logic.** Used as a fast gut-check between options, *not* a spreadsheet.

- **The "magic probability model."** `[OVERBUILT]` (D6) The same scoring idea dressed up as a
  formal 1–5 × 6-dimension model feeding A/B/C/Trap tiers. D6's *own appendix* warns against
  exactly this kind of theoretical machinery. Demote: keep the quick filter above; drop the
  model framing.

- **Post-trip review / learning loop.** `[STRONGEST]` (D6 ×2, D3, F) The compounding mechanism:
  best moment? why did it happen? *could I have predicted it?* what made it possible? what
  looked good online but disappointed? repeat / avoid? which source was actually useful? The
  "could I have predicted it?" question is the sharpest — it's what turns a trip into a
  personal travel model. Note: D6 states this twice (§9 and §13) — `[REDUNDANT]` within the
  doc, collapse. This loop is the natural home of the existing Phase-3 retro.

- **Nightly field notes (3 lines).** (D3, F) Best moment / best conversation / lesson. The
  in-trip, lightweight instance of the post-trip review — same instrument, daily cadence. Feeds
  the retro.

- **Do-not-repeat list.** (F) Track what consistently lowers trip quality (arriving after dark,
  one-nighters after long travel, dead hostels, ignoring weather). Unique, cheap, high-value —
  it's the negative-space complement to the learning loop. Keep.

- **THE MEASUREMENT GAP.** `[UNDERDEVELOPED]` Every source describes the *content* of reviews;
  none describes the *wiring* — how a finding actually updates future behavior or the
  profile/principles. Given travel-os updates the spine **only** via the Phase-3 retro, this
  missing link (review output → profile/principles update) is the single most important
  underbuilt mechanism in the entire batch.

---

## 8. Contradictions

Surfaced explicitly — these need a decision, not a merge.

1. **"Dashboard" vs the no-dashboard constraint.** `[CONTRADICTION]` (P §10, D6a §11 vs
   travel-os: "No custom dashboard. iPhone Notes + Google Maps are the front-end.") The notes
   repeatedly propose a "live trip dashboard." **Likely reconcilable** — they mean a single
   Notes *page* (current base / next stop / candidates / bookings / budget / leads / open
   decisions), not an app. But the word is loaded and recurs; resolve by explicitly defining
   "dashboard" as a Notes page, or the notes will keep implying a build that's out of bounds.

2. **D6 contradicts itself on scope.** `[CONTRADICTION]` D6's body presents an ambitious
   6-phase, 50–100-candidate, formal-scoring system; D6's *own appendix* repeatedly warns it
   must stay "lightweight," "brutally selective," and not become "a research machine." The
   document argues with itself. **Resolution:** treat the appendix as the governing voice
   (it's also the strongest scope logic in §2) and the body as raw material to be cut down.

3. **Structure vs spontaneity.** `[CONTRADICTION]`, pervasive. "No full day without an anchor"
   / "without an anchor the day is wasted" (D2, D8) vs "leave 25–35% unscheduled" / "leave half
   a day empty every 3–4 days" / "preserve optionality" (D6, F) — and travel-os principles
   themselves say "keep plans loose, no rigid hour-by-hour." The notes never pin the balance
   point. **Resolution:** the strategy-layer "increase surface area for luck" already resolves
   this — an anchor is a *reason for the day to exist*, not a *filled schedule*; the empty space
   is inside the anchored day, not instead of it. State that reconciliation explicitly so the
   two rules stop reading as opposed.

4. **Food weighting vs the profile.** `[CONTRADICTION]` D4 builds an entire food-system section
   and treats food as a primary axis; the travel-os gotcha is explicit that food is enjoyed but
   *not* the #1 priority. **Resolution:** keep D4's eat-local *tactics*, discard its *emphasis*
   — food is one supporting layer, not a planning spine.

5. **Longlist volume.** `[CONTRADICTION]` 20–40 (D5) vs 50–100 (D6). Resolved in §2 (adopt the
   scene unit, the smaller volume, governed by the hard cap).

6. **Anchor-every-day vs energy/recovery rotation.** Minor. "Every full day needs an anchor"
   (D8) vs "recovery/admin days" as a legitimate day-type (D8 itself, P). Self-resolving once a
   Recovery day is understood to have a low-intensity anchor (rest *is* the reason), but worth
   noting so the anchor rule isn't read as "every day must be a Wonder day."

---

## 9. Overbuilt vs underdeveloped

**Overbuilt** (more machinery than the job needs — cut or simplify):

- **D6's full magical-system apparatus** — 6 phases + 50–100 candidates + formal scoring model
  + A/B/C/Trap tiering. The clearest overbuild; flagged by its own appendix. Keep the *ideas*
  (scenes, hidden conditions, crowd arbitrage), drop the *apparatus*.
- **Three parallel scoring rubrics** (§7) — collapse to one quick filter.
- **Template sprawl** (§3) — five overlapping formats collapse to two.
- **The maintained live dashboard** — risks becoming admin overhead on a phone; high upkeep,
  unclear payoff, and constraint-adjacent. Keep only as a minimal Notes page if at all.
- **Over-formalized micro-tactics** — Sunday test, one-bold-move, second-place-rec are good as a
  menu but become overhead if elevated to mandatory steps.

**Underdeveloped** (right instinct, missing mechanism — needs building out):

- **The review → profile/principles feedback wiring** (§7). The most important gap. The notes
  describe review *content* exhaustively but never the loop that makes the system *compound*.
- **Local-lead capture** (§6). Rich on gathering, near-silent on where leads are stored and how
  they reach the board.
- **Decision triggers as an actual ruleset** (§5). Always examples, never a codified table.
- **The experience pattern library** (§3). Strong idea, no build/store/maintain mechanism —
  though `dossier-data.json` is the obvious latent home.
- **"Scenes" as stored data.** D6 says save scenes not places, but never specifies the
  structure. The existing place-record model (lat/lng/tags/hook) is most of the way there; the
  notes just don't connect scene-thinking to it.
- **Energy/fatigue as a tracked input.** Asserted as a planning constraint; no mechanism for
  actually registering fatigue state into the next day's plan.

---

## 10. The keep pile — strongest logic, distilled

If everything else were discarded, these survive:

1. **Plan scenes, not destinations** + name the **hidden condition** for each. (D6)
2. **Increase the surface area for luck** — engineer odds, don't control outcomes. (D6)
3. **Design experiences, not attractions** — and the **D7 experience-design prompt** as the
   ready-to-use instrument. (D3/D4/D6/D7/F)
4. **The rolling 5-day board** + **three-layer day** (anchor → route → backup). (D2/D8)
5. **Soft commitment, lock at the last responsible moment**, with the status enum. (D2/D8/P)
6. **The local-intelligence loop** — right people, better questions, repeated signal → board.
   (6 sources)
7. **Crowd arbitrage / overnight-in-day-trip-places** + protect a daily **magic window**. (D6)
8. **Search experiences not cities, in the local language**; Maps as reality-check;
   inspiration-source ≠ decision-source. (D5/L)
9. **Weekly budget envelope + strategic-splurge gate.** (D4/P)
10. **Post-trip learning loop** built on *"could I have predicted it?"*, plus the
    **do-not-repeat list**. (D6/F)
11. **Day-type taxonomy + cadence** (evening / 3-day / weekly) for sustainable rhythm. (D8)

---

## 11. The cut pile — what didn't survive (and why)

- **The magic-probability scoring model** — overbuilt; replaced by the single quick filter.
- **Two of the three scoring rubrics** — redundant.
- **Three of the five templates** — collapsed into the pre-trip and in-trip canonical shapes.
- **D6's 50–100 candidate volume** — over-scoped against the hard cap; reduced to ~30–50.
- **D4's food-as-spine emphasis** — conflicts with the profile; tactic kept, weighting cut.
- **The "amateur vs professional" framing** — true but redundant with experience-design.
- **Backward planning as a general habit** — kept only scoped to fixed-timing days.
- **The maintained dashboard as a system** — reduced to (at most) a minimal Notes page.
- **Micro-tactics as mandatory rules** — demoted to an optional tactics menu.

---

*End of consolidation pass. Analytical only; no implementation steps included by design.*
