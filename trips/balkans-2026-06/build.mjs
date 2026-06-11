// build.mjs — regenerate the inline data block in index.html from dossier-data.json.
//
// SINGLE SOURCE OF TRUTH: dossier-data.json (edit this).
// Then run:  node build.mjs
// It rewrites the `const TRIP=[…]; const LEGS=[…];` block in index.html between the
// DOSSIER DATA markers, leaving the rest of the file (CSS, renderer JS, markup) untouched.
// Output stays a single self-contained index.html — no external fetch, uploadable as-is.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, 'dossier-data.json');
const HTML = path.join(here, 'index.html');

const START = 'const TRIP=[';                       // first generated line
const END   = '/* === END DOSSIER DATA === */';     // marker after the LEGS literal

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
if (!Array.isArray(data.trip) || !Array.isArray(data.legs)) {
  console.error('dossier-data.json must have array fields "trip" and "legs".');
  process.exit(1);
}

// --- V1 derived fields (id + map_link) ---
// id and map_link are DETERMINISTIC, so they are derived here rather than
// hand-authored in the JSON (which keeps it DRY and removes a 114-place error
// surface). The authored fields (`neighborhood`, `city`) carry the human knowledge;
// these two are computed from them. The generated TRIP block the renderer reads
// therefore ships all four required fields. See references/dossier-workflow.md
// Step 12.5 (A2/A3) and trips/.../ux-workflow-additions.md.
const kebab = (s) =>
  s.toLowerCase()
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

// time-of-day tag (v3 D8) — CONSERVATIVE derive from existing copy only.
// Tags `morning` / `evening` only when the place's own text clearly implies it;
// everything else stays `any` and is never hidden by a time filter. No fabrication:
// this reads the authored nm/hook/facts, it does not invent a schedule.
const deriveWhen = (p) => {
  const t = `${p.nm || ''} ${p.hook || ''} ${(p.facts || []).map(f => f[1]).join(' ')}`.toLowerCase();
  const morning = /\b(morning|breakfast|sunrise|early|dawn)\b/.test(t);
  const evening = /\b(evening|sunset|nightlife|night|dinner|dusk|jazz|after dark)\b/.test(t);
  if (morning && !evening) return 'morning';
  if (evening && !morning) return 'evening';
  return 'any';
};

// v4 taxonomy (§11.1–11.2): every do/eat card must declare a category home.
const CATS = new Set(['sights', 'nature', 'walks', 'night', 'rest', 'street', 'cafes', 'work']);
const FOOD = new Set(['rest', 'street', 'cafes']);

const problems = [];
const coordsMissing = [];   // P0-4 / 11.5 worklist — never guess coordinates
const todoPrice = [];       // 11.3 — food-homed cards without a derivable tier
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
      }
      if (!(typeof p.lat === 'number' && typeof p.lng === 'number'))
        coordsMissing.push({ stop: stop.name, nm: p.nm, where: [p.neighborhood, p.city].filter(Boolean).join(', '), top: p.t === 3 });
      // Derive (overwrite any stale value so the build is the single authority).
      p.id = `${stop.id}-${kebab(p.nm)}`;
      p.map_link = mapLink(p);
      if (key !== 'avoid') p.when = deriveWhen(p);   // time-of-day lens (do/eat only)
    }
  }
}
if (problems.length) {
  console.error('Field self-check failed — every do/eat/avoid place needs nm, neighborhood, city (+cat on do/eat):');
  for (const m of problems) console.error('  ' + m);
  process.exit(1);
}

// Build report: coords-missing.md (map coverage worklist — hero set = stop centers + top picks first).
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
if (todoPrice.length) console.log(`TODO-PRICE (${todoPrice.length}): ` + todoPrice.join(' · '));

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
  'const LEGS=' + JSON.stringify(data.legs, null, 2) + ';\n';

const out = html.slice(0, a) + block + html.slice(b);
fs.writeFileSync(HTML, out, 'utf8');
console.log(`Rebuilt index.html from dossier-data.json — ${data.trip.length} stops, ${data.legs.length} legs.`);
