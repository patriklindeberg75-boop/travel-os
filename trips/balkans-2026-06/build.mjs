// build.mjs — regenerate the inline data block in index.html from dossier-data.json.
//
// SINGLE SOURCE OF TRUTH: dossier-data.json (edit this).
// Then run:  node build.mjs
// It rewrites the `const TRIP=[…]; const LEGS=[…]; const META={…};` block in
// index.html between the DOSSIER DATA markers, leaving the rest of the file (CSS,
// renderer JS, markup) untouched. Output stays a single self-contained index.html —
// no external fetch, uploadable as-is.
//
// The build is the SINGLE AUTHORITY for derived fields. Authored fields carry human
// knowledge; derived fields are computed here so the JSON stays DRY and the renderer
// always receives a complete, validated object. Validation aborts the build (non-zero
// exit, no write) on any malformed authored value — a clean build is the gate.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, 'dossier-data.json');
const HTML = path.join(here, 'index.html');

const START = 'const TRIP=[';                       // first generated line
const END   = '/* === END DOSSIER DATA === */';     // marker after the generated literals

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
if (!Array.isArray(data.trip) || !Array.isArray(data.legs)) {
  console.error('dossier-data.json must have array fields "trip" and "legs".');
  process.exit(1);
}
const meta = (data.meta && typeof data.meta === 'object') ? data.meta : {};

/* ===== controlled vocabularies (canonical — keep in sync with references/) ===== */
const CATS = new Set(['sights', 'nature', 'walks', 'night', 'rest', 'street', 'cafes', 'work']);
const FOOD = new Set(['rest', 'street', 'cafes']);
const TIME_BLOCKS = new Set(['morning', 'daytime', 'evening']);              // §7
const PURPOSES    = new Set(['explore', 'eat', 'work', 'social', 'recovery']); // §10
const DURATIONS   = new Set(['quick', '2-3h', 'half-day', 'full-day']);        // §10
const RESEARCH    = new Set(['needs', 'researched', 'verified']);              // §5
const RES_TYPES   = new Set(['food', 'article', 'transport', 'neighborhood', 'source', 'reference']); // §6

// cat → default purpose (§10). A structured→structured derivation (not prose
// inference): every place gets a sensible Purpose axis for the filter without
// hand-authoring all of them. The workflow MAY author `purpose` to override.
const CAT_PURPOSE = {
  sights: ['explore'], nature: ['explore', 'recovery'], walks: ['explore'],
  night: ['social'], rest: ['eat'], street: ['eat'], cafes: ['eat'], work: ['work']
};

const kebab = (s) =>
  (s || '').toLowerCase()
   .normalize('NFD').replace(/[̀-ͯ]/g, '')   // strip diacritics
   .replace(/[^a-z0-9]+/g, '-')                          // non-alnum → hyphen
   .replace(/^-+|-+$/g, '');                             // trim hyphens

const mapLink = (p) => {
  // Coordinates win when present; never fabricate them.
  if (typeof p.lat === 'number' && typeof p.lng === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${p.lat}%2C${p.lng}`;
  }
  const q = [p.nm, p.neighborhood, p.city].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
};

// LEGACY time-of-day tag (transitional). The v5 renderer filters on the authored
// `time[]` array (§7); this single-value `when` is retained only until the old
// time filter is removed, and is a CONSERVATIVE read of existing copy — it never
// overrides an authored `time[]`. New dossiers should author `time[]`, not rely
// on this.
const deriveWhen = (p) => {
  if (Array.isArray(p.time) && p.time.length) {
    if (p.time.includes('morning') && !p.time.includes('evening')) return 'morning';
    if (p.time.includes('evening') && !p.time.includes('morning')) return 'evening';
    return 'any';
  }
  const t = `${p.nm || ''} ${p.hook || ''} ${(p.facts || []).map(f => f[1]).join(' ')}`.toLowerCase();
  const morning = /\b(morning|breakfast|sunrise|early|dawn)\b/.test(t);
  const evening = /\b(evening|sunset|nightlife|night|dinner|dusk|jazz|after dark)\b/.test(t);
  if (morning && !evening) return 'morning';
  if (evening && !morning) return 'evening';
  return 'any';
};

// budget-friendly (§10 constraint filter) — DERIVED, documented heuristic.
// True when the place reads as low-cost: a 1–2 price tier, an explicit `free`
// signal in tags/facts, or an authored `bf:true`. Absent signal → false (the §10
// rule: a place lacking the attribute must NOT match the Budget-friendly filter).
const deriveBudgetFriendly = (p) => {
  if (typeof p.bf === 'boolean') return p.bf;
  if (typeof p.pt === 'number' && p.pt >= 1 && p.pt <= 2) return true;
  const freeRe = /\bfree\b/i;
  if ((p.tags || []).some(t => freeRe.test(t))) return true;
  if ((p.facts || []).some(f => freeRe.test(f[1] || ''))) return true;
  return false;
};

// research status (§5) — assign by ACTUAL research completeness, never blanket
// "researched". Authored `rs` wins. Otherwise: a place with both a hook AND at
// least one fact has enough to justify inclusion → `researched`; anything
// thinner → `needs`. `verified` is NEVER auto-assigned (it means time-sensitive
// facts were checked for THIS trip — only an author/verification pass sets it).
const deriveResearch = (p) => {
  if (p.rs && RESEARCH.has(p.rs)) return p.rs;
  return ((p.hook && p.hook.trim()) && (p.facts || []).length >= 1) ? 'researched' : 'needs';
};

const problems = [];
const coordsMissing = [];   // map coverage worklist — never guess coordinates
const todoPrice = [];       // food-homed cards without a derivable tier
const researchTodo = [];    // §5 research worklist — `needs` items + what's missing

/* ===== per-place validation + derivation ===== */
for (const stop of data.trip) {
  for (const key of ['do', 'eat', 'avoid']) {
    for (const p of stop[key] || []) {
      if (!p.nm)            problems.push(`${stop.id}/${key}: place missing "nm"`);
      if (!p.neighborhood)  problems.push(`${stop.id}/${key}: "${p.nm}" missing required "neighborhood"`);
      if (!p.city)          problems.push(`${stop.id}/${key}: "${p.nm}" missing required "city"`);

      if (key !== 'avoid') {
        if (!p.cat || !CATS.has(p.cat)) problems.push(`${stop.id}/${key}: "${p.nm}" missing/invalid "cat" (${p.cat})`);
        for (const a of p.also || []) if (!CATS.has(a)) problems.push(`${stop.id}/${key}: "${p.nm}" invalid also "${a}"`);
        const inFood = FOOD.has(p.cat) || (p.also || []).some(a => FOOD.has(a));
        if (inFood && !p.pt) todoPrice.push(`${stop.name}: ${p.nm}`);
        if (p.pt && ![1, 2, 3].includes(p.pt)) problems.push(`${stop.id}/${key}: "${p.nm}" pt must be 1|2|3`);

        // v5 controlled-value validation (validate when present; default when absent)
        if (p.time != null) {
          if (!Array.isArray(p.time)) problems.push(`${stop.id}/${key}: "${p.nm}" time must be an array`);
          else for (const b of p.time) if (!TIME_BLOCKS.has(b)) problems.push(`${stop.id}/${key}: "${p.nm}" invalid time block "${b}" (use morning|daytime|evening)`);
        }
        if (p.purpose != null) {
          if (!Array.isArray(p.purpose)) problems.push(`${stop.id}/${key}: "${p.nm}" purpose must be an array`);
          else for (const v of p.purpose) if (!PURPOSES.has(v)) problems.push(`${stop.id}/${key}: "${p.nm}" invalid purpose "${v}"`);
        }
        if (p.dur != null && !DURATIONS.has(p.dur)) problems.push(`${stop.id}/${key}: "${p.nm}" invalid dur "${p.dur}" (use quick|2-3h|half-day|full-day)`);
        if (p.rs != null && !RESEARCH.has(p.rs)) problems.push(`${stop.id}/${key}: "${p.nm}" invalid rs "${p.rs}" (use needs|researched|verified)`);
        if (p.tips != null && !Array.isArray(p.tips)) problems.push(`${stop.id}/${key}: "${p.nm}" tips must be an array of strings`);
      }

      if (!(typeof p.lat === 'number' && typeof p.lng === 'number'))
        coordsMissing.push({ stop: stop.name, nm: p.nm, where: [p.neighborhood, p.city].filter(Boolean).join(', '), top: p.t === 3 });

      // --- derive (overwrite any stale value so the build is the single authority) ---
      p.id = `${stop.id}-${kebab(p.nm)}`;
      p.map_link = mapLink(p);
      if (key !== 'avoid') {
        p.when = deriveWhen(p);                                  // legacy time lens (transitional)
        p.time = Array.isArray(p.time) ? p.time : [];            // §7 (default empty — no keyword inference)
        p.purpose = (Array.isArray(p.purpose) && p.purpose.length) ? p.purpose : (CAT_PURPOSE[p.cat] || []); // §10
        p.bf = deriveBudgetFriendly(p);                          // §10 budget-friendly
        p.rs = deriveResearch(p);                                // §5 research status
        if (p.rs === 'needs') researchTodo.push({ stop: stop.name, nm: p.nm, note: p.rsNote || '(no rsNote — specify what remains)' });
      }
    }
  }

  /* ===== per-stop authored-collection validation + id derivation ===== */
  // base (§4) — optional authored default; user value (localStorage) overrides at runtime.
  if (stop.base != null) {
    if (typeof stop.base !== 'object' || !stop.base.label) problems.push(`${stop.id}: base must be an object with a "label"`);
    if (stop.base && (('lat' in stop.base) !== ('lng' in stop.base))) problems.push(`${stop.id}: base needs both lat and lng, or neither`);
  }
  // tasks (§2) — destination-scoped. Derive id; require title.
  for (const t of stop.tasks || []) {
    if (!t.title) problems.push(`${stop.id}/tasks: task missing "title"`);
    else t.id = `task:${stop.id}-${kebab(t.title)}`;
    t.stop = stop.id;
  }
  // resources (§6) — require title + link + type + why; validate type.
  for (const r of stop.resources || []) {
    if (!r.title) problems.push(`${stop.id}/resources: resource missing "title"`);
    if (!r.link)  problems.push(`${stop.id}/resources: "${r.title}" missing "link"`);
    if (!r.why)   problems.push(`${stop.id}/resources: "${r.title}" missing "why"`);
    if (!r.type || !RES_TYPES.has(r.type)) problems.push(`${stop.id}/resources: "${r.title}" invalid type "${r.type}" (use ${[...RES_TYPES].join('|')})`);
  }
  // foodToTry (§8) — dishes, not venues. Require name + what.
  for (const f of stop.foodToTry || []) {
    if (!f.name) problems.push(`${stop.id}/foodToTry: item missing "name"`);
    if (!f.what) problems.push(`${stop.id}/foodToTry: "${f.name}" missing "what"`);
  }
}

/* ===== trip-level meta validation + id derivation ===== */
// meta.tasks (§2) — trip-wide actions (assoc may name a stop).
for (const t of meta.tasks || []) {
  if (!t.title) problems.push(`meta/tasks: task missing "title"`);
  else t.id = `task:trip-${kebab(t.title)}`;
}
// meta.critical (§3) — high-consequence checklist only.
for (const c of meta.critical || []) {
  if (!c.title) problems.push(`meta/critical: item missing "title"`);
  else c.id = `crit:${kebab(c.title)}`;
}

if (problems.length) {
  console.error('Field self-check failed — fix these authored values in dossier-data.json:');
  for (const m of problems) console.error('  ' + m);
  process.exit(1);
}

/* ===== build reports (worklists — never block, never fabricate) ===== */
// coords-missing.md (map coverage worklist — hero set = stop centers + top picks first).
{
  const lines = ['# Coordinates missing — map coverage worklist', '',
    'Generated by build.mjs. Cards without `lat`/`lng` don\'t appear on the per-stop map',
    '(they keep their name-based Google Maps link). Hero set = ★★★ top picks, marked below.', ''];
  let cur = '';
  for (const c of coordsMissing) {
    if (c.stop !== cur) { cur = c.stop; lines.push(`## ${cur}`, ''); }
    lines.push(`- [ ] ${c.top ? '★ ' : ''}${c.nm} — ${c.where}`);
  }
  lines.push('', `Total: ${coordsMissing.length} cards without coordinates.`, '');
  fs.writeFileSync(path.join(here, 'coords-missing.md'), lines.join('\n'), 'utf8');
}
// research-todo.md (§5 worklist — every `needs` place + what remains to research).
{
  const lines = ['# Research to-do — `Needs research` worklist', '',
    'Generated by build.mjs. Each place below resolved to research status `needs`',
    '(authored, or defaulted because it lacks a hook + at least one fact). Resolve by',
    'researching the open question, then set `rs: "researched"` (or `"verified"` once',
    'time-sensitive facts are checked for this trip) in dossier-data.json.', ''];
  let cur = '';
  for (const r of researchTodo) {
    if (r.stop !== cur) { cur = r.stop; lines.push(`## ${cur}`, ''); }
    lines.push(`- [ ] ${r.nm} — ${r.note}`);
  }
  lines.push('', `Total: ${researchTodo.length} places needing research.`, '');
  fs.writeFileSync(path.join(here, 'research-todo.md'), lines.join('\n'), 'utf8');
}
if (todoPrice.length) console.log(`TODO-PRICE (${todoPrice.length}): ` + todoPrice.join(' · '));

/* ===== splice the generated block into index.html ===== */
const html = fs.readFileSync(HTML, 'utf8');
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a < 0 || b < 0) {
  console.error('Could not find the DOSSIER DATA markers in index.html — aborting (no write).');
  process.exit(1);
}

// JSON is a subset of JS object-literal syntax, so JSON.stringify output is valid JS.
const block =
  'const TRIP=' + JSON.stringify(data.trip, null, 2) + ';\n\n' +
  'const LEGS=' + JSON.stringify(data.legs, null, 2) + ';\n\n' +
  'const META=' + JSON.stringify(meta, null, 2) + ';\n';

const out = html.slice(0, a) + block + html.slice(b);
fs.writeFileSync(HTML, out, 'utf8');
console.log(`Rebuilt index.html — ${data.trip.length} stops, ${data.legs.length} legs, ` +
  `${(meta.tasks||[]).length} trip tasks, ${(meta.critical||[]).length} critical items. ` +
  `Research: ${researchTodo.length} need work.`);
