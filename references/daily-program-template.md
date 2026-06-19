# Daily-Program Output Template

Output contract for the day plan produced by `/daily-program`. The plan is written
to `trips/{slug}/day-plans/{YYYY-MM-DD}-{city-kebab}.md` and the same content is
printed in chat.

**Primary target: Notion.** Unlike the dossier (iPhone Notes, no inline links), the
day plan is optimised to paste into a Notion page — so **every place is a bullet
with an inline clickable Google Maps link**. This intentionally overrides the
dossier's "no inline links in section bodies" rule, for this artifact only.

---

## Formatting rules (load-bearing)

- Notion-friendly GitHub-flavoured markdown.
- **Inline Google Maps link on every place**, in both Section C and Section F.
- Time-of-day **bands**, never clock times: Morning / Midday / Afternoon / Evening
  / Night (use only the bands the day needs).
- Short lines (~80 chars). No horizontal-scrolling tables. No `|---|` tables.
- Section headers are `## `. Sub-labels use `**bold**`, not `### `.
- Each section ends with `---` on its own line before the next header.
- Show **distance / transit between consecutive stops** ("~10 min walk",
  "Bus 66, ~25 min").
- **Cheap-first framing** when the splurge dial is restrictive — lead with free /
  low-cost picks; flag anything above the daily floor.
- Place identity is always `Name — Neighborhood, City` (Google-Maps-searchable).

---

## Gmaps link format (construct inline)

There is no `map_link` field and `lat`/`lng` are null in `dossier-data.json`, so
build each link in the plan:

```
https://www.google.com/maps/search/?api=1&query={URL-encoded "{nm} {neighborhood} {city}"}
```

Example — `Banicharnitsa`, Oborishte, Sofia →
`https://www.google.com/maps/search/?api=1&query=Banicharnitsa%20Oborishte%20Sofia`

If a place ever has non-null `lat`/`lng`, use `...query={lat}%2C{lng}` instead.
Never fabricate coordinates. (Do not call `build.mjs` — it is trip-local to
`trips/balkans-2026-06/`, not a shared utility.)

---

## Section structure

Title line: `# {City} — {Weekday}, {Date} — {day type}` (e.g.
`# Sofia — Monday, 22 Jun 2026 — full day`).

**Route logic intro** — 2–3 sentences immediately under the title, no header: why
this route, the flow, where backtracking was avoided, roughly how much is on foot vs
transit, where the rest pocket sits, the one unplanned pocket left open, and the
weather basis (static dossier forecast vs Patrik's fresh read).

**The plan** — time-of-day bands directly after the intro. Under each band header
(`**Morning**`, `**Midday**`, etc.), one bullet per place:

```
- [Zlatnite Mostove — Vitosha, Sofia](https://www.google.com/maps/search/?api=1&query=Zlatnite%20Mostove%20Vitosha%20Sofia)
  Boulder-river + waterfall loop, shaded and non-tourist · half-day · **must-do**
  → ~25 min on Bus 66 from Hladilnika to next stop
  Tip: confirm Bus 66 last return the evening before — ask the hostel.
```

Each place bullet carries, on its sub-lines:
- the `hook` description
- `duration` · the **must-do** / **optional** tag
- distance/transit to the next stop (`→ …`)
- one **Tip** drawn from `tips[]`
- for hikes, a short data line (distance · gain · water · last transport back) from
  `hike{}`.

Insert the rest pocket as its own bullet where it belongs (e.g.
`- Rest / long lunch — shade through the midday heat`). Mark the protected work
block if the work dial is ON.

---

### Optional add-ons
Bullets (same place format, inline link) for `optional` items to fold in **only if
energy permits**. Keep short.

---

### Skip for another day
Pool items deliberately left out of this route, each a one-line bullet with the
reason (backtracking, wrong timing, too far, already saturated).

---

End the chat output by reminding Patrik to report back what he actually did (so the
done ledger stays current).
