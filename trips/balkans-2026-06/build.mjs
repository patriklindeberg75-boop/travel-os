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
