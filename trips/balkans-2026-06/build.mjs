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

const problems = [];
for (const stop of data.trip) {
  for (const key of ['do', 'eat', 'avoid']) {
    for (const p of stop[key] || []) {
      if (!p.nm)            problems.push(`${stop.id}/${key}: place missing "nm"`);
      if (!p.neighborhood)  problems.push(`${stop.id}/${key}: "${p.nm}" missing required "neighborhood"`);
      if (!p.city)          problems.push(`${stop.id}/${key}: "${p.nm}" missing required "city"`);
      // Derive (overwrite any stale value so the build is the single authority).
      p.id = `${stop.id}-${kebab(p.nm)}`;
      p.map_link = mapLink(p);
    }
  }
}
if (problems.length) {
  console.error('V1 field self-check failed — every do/eat/avoid place needs nm, neighborhood, city:');
  for (const m of problems) console.error('  ' + m);
  process.exit(1);
}

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
