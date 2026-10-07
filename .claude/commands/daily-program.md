---
description: Plan tomorrow from an already-built dossier. Resolves the current trip + city, runs the personalization-spine gate, shows the remaining activity long-list (minus what's already done) so Patrik picks must-dos vs optional, then builds one sensibly-routed day (distances, rest, no over-walking) — re-biasing for a fresh weather read — runs an independent QC pass, and writes a Notion-paste-ready plan where every place is a bullet with an inline Google Maps link.
model: opus
---

Plan Patrik's next day as a routed selection from the trip's existing dossier — no
new research. You run this workflow inline in the main session (the long-list pick
is an interactive pause). Methodology and output format live in two references:

- `references/daily-program-workflow.md` — steps, halts, done-ledger, spine
  auto-apply, selection/routing logic, QC checklist. **This is the contract.**
- `references/daily-program-template.md` — the Notion-first output structure,
  formatting rules, and the inline Google Maps link format.

Read both before doing anything else. Follow the workflow reference exactly.

Input: `$ARGUMENTS` — optional `--trip {slug}`. If absent, auto-detect the most
recent `trips/{slug}/` by mtime (same rule as `/destination-dossier`).

---

### Step 0 — Read the references

Read `references/daily-program-workflow.md` and `references/daily-program-template.md`
in full. If either is missing, halt:

```
Required reference missing: {path}.
/daily-program cannot run without both daily-program references in references/.
```

### Step 1 — Resolve trip + city

1. Resolve `slug` from `--trip {slug}`, else most recent `trips/{slug}/` by mtime.
2. Read `trips/{slug}/trip-context.md`. If missing, halt and tell Patrik to run
   `/trip-init` first.
3. Resolve the current city per the workflow reference § City resolution: find the
   `route_stops` entry whose `dates` range contains **tomorrow** (today + 1), then
   fuzzy-match it to a stop in `dossier-data.json` `trip[]` by `name`. Note if
   tomorrow is a transit/depart day (§ Multi-stop awareness).
4. If the city can't be resolved, ask once which stop to plan for (Halt C).

### Step 2 — Personalization Spine Gate (Halt A)

Read the first lines of `profile/universal-traveler-profile.md` and
`profile/travel-principles.md`. If either is empty, missing, or only a placeholder
header, halt with the Halt A message from the workflow reference. Do not generate a
generic plan. If both are populated, read them fully — they drive the anti-tourist,
routine, spontaneity, and heat-timing judgments.

### Step 3 — Load pool + done-ledger (Halt B)

1. Read `trips/{slug}/dossier-data.json`. If missing, halt with the Halt B message.
2. Take the resolved stop's `do[]` + `eat[]` (and `foodToTry[]` for "eat this here"
   notes) as the pool. Use the field map in the workflow reference § Per-place data
   map (name `nm`, description `hook`, tips `tips[]`, tier `t`, etc.).
3. Read `trips/{slug}/day-plans/done.md` if present; fuzzy-exclude its `done:` items
   from the pool (ask on an ambiguous match — do not drop the wrong place).

### Step 4 — Compute spine defaults

Apply the workflow reference § Spine auto-apply logic against `trip-context.md` + the
resolved stop (heat from `stop_weather`/`forecast_max_celsius`; work rhythm from
`work_load_hours_per_week` + tomorrow's weekday; splurge from the budget fields).
Hold the result; do not show a toggle menu.

### Step 4.5 — Confirm what's been done since the ledger (PAUSE — ASK THIS FIRST)

**This is always your first operator-facing question. Do not present the long-list,
and do not infer done-status from anything, until Patrik answers it.**

The done-ledger (`day-plans/done.md`) is the *only* source of truth for what's been
done. A `day-plans/{date}-{city}.md` file records what was *planned*, never what
actually happened — never treat a plan file (or your own prior recommendations) as
evidence an activity was done.

1. Find the last dated line in `day-plans/done.md` (its date = `last_ledger_date`;
   if the file is absent or has no dated line, `last_ledger_date` = trip start).
2. Detect the reporting gap: any day from `last_ledger_date` up to **today** that has
   no ledger line is unreported — especially today, and any day with a
   `day-plans/{date}-{city}.md` file but no matching ledger entry.
3. Ask, in plain language:

   ```
   Before I plan tomorrow — what did you actually do since {last_ledger_date}?
   The ledger's last entry is {last_ledger_date}, so I have no record of {gap days}.
   (I won't assume — a plan file only shows what was planned, not what you did.)
   List whatever you did/skipped and I'll update the ledger before building tomorrow.
   ```

   If a plan file exists for a gap day, you may list its items as a *memory jog*
   only — clearly flagged as "planned, not confirmed" — to make recall easier. Never
   pre-tick them.

4. **Stop and wait.** On reply, treat the stated activities as `done:` (and any
   `skip:`), update the ledger per Step 6's spec immediately, and re-filter the pool
   *before* showing the long-list. If Patrik says nothing was done (or "skip this"),
   record nothing and proceed.

### Step 5 — Show the long-list & collect picks (PAUSE)

Present the remaining pool (already re-filtered by Step 4.5's update) ranked by `t`
(3 = 🔥, 2 = 👍, 1 = 🆗). For each place
show: name + `neighborhood`, the `hook` description, and key facts (`best_time`,
`cost`, `duration`). Mark which look like must-dos (🔥 / anchors) vs optional, so
choosing is easy. Then ask Patrik for, in free text:

```
Reply with any of:
  must: …      (the ones you definitely want tomorrow)
  maybe: …     (fold in if they fit)
  done: …      (already did these — I'll drop them for good)
  skip: …      (not tomorrow, but keep for later)
  day type: full | half | slow | evening | nature   (default: full)
  energy: low | medium | high
  weather: …   (tomorrow's actual forecast if it differs from the dossier —
               e.g. "rain all day", "33°C clear"; I'll re-bias the day)
  constraints: … (e.g. leaving 14:00, work-focused, craving X)
```

**Stop and wait.** Do not build the plan until Patrik responds. If he gives no day
type, default to full day and say so.

### Step 6 — Update the done-ledger

Append a dated line to `trips/{slug}/day-plans/done.md` per the workflow reference
§ Done-ledger spec — `done:` items (permanent) and `skip:` items (this-run only,
prefixed `skip:`). Create the file with a header on first write; never overwrite
prior lines. Re-filter the pool with the new exclusions. This captures both the
Step 4.5 up-front "what did you do since the ledger" answer and any `done:`/`skip:`
given in the Step 5 pick.

### Step 7 — Build the routed plan

Follow the workflow reference § Selection & routing logic: assemble pool → cluster by
`neighborhood` + timing → select the cluster + anchors and surface **one runner-up
cluster** with the trade-off → classify anchors / nearby / optional / rejected →
apply the **walking-load + rest guard** (cap walking, transit for spread-out legs,
insert a rest pocket, honour routine + work block, don't over-pack) → add tightly
controlled `[extra — not from your list]` items only when they earn it. Honour the
priority model (must-dos first, never dropped) and the spontaneity guard (leave ≥ 1
unplanned pocket).

If Patrik gave a `weather:` read, apply § Weather-reactive planning **before**
locking the route (it overrides the static forecast and may flip outdoor anchors to
indoor/market/food).

Format strictly per `references/daily-program-template.md`, building an inline Google
Maps link for every place.

### Step 8 — Write the draft + independent QC

1. Write the draft plan to `trips/{slug}/day-plans/{YYYY-MM-DD}-{city-kebab}.md`
   (`{YYYY-MM-DD}` = tomorrow's date).
2. Delegate to the **`day-plan-qc`** agent via the Task tool, passing: the plan path,
   the `slug`, and the QC checklist from the workflow reference § QC checklist.
3. Read the verdict. On **REVISE**, apply the listed fixes to the plan file, note
   what changed, and do not re-loop more than once. On **GO**, continue.

### Step 9 — Output

Print the finished plan in chat exactly as written, then close with:

```
Plan written: trips/{slug}/day-plans/{YYYY-MM-DD}-{city-kebab}.md
QC: {GO | REVISE → fixed}

After the day, tell me what you did (or didn't) so the done ledger stays current.
```

---

### Notes for the executor

- **Run inline, in the main session.** The Step 5 long-list pick is a real
  pause-and-wait; do not delegate the whole flow to a subagent. Only the QC pass
  (Step 8) is delegated, to `day-plan-qc`, for independence.
- **No new research.** The pool is whatever the dossier already vetted. Never invent
  places beyond the controlled `[extra — not from your list]` additions.
- **Links are constructed inline** — there is no `map_link` field and `lat`/`lng`
  are null. Build every link per the template's § Gmaps link format.
- **Do not over-plan.** Bands not clock times, a rest pocket, and one open pocket are
  non-negotiable (travel-principles § 5.4 + § 6.1).
- The done ledger is the system's memory of what's done — keep it current in Step 6
  before filtering, so the same place is never recommended twice.
- **Never infer done-status.** Your first operator-facing question is always Step 4.5
  ("what did you actually do since the ledger?"). A plan file shows what was planned,
  not what happened — do not treat plan files or your own prior recommendations as
  evidence an activity was done. Only the ledger and Patrik's own report count.
