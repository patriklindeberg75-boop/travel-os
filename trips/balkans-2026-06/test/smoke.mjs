import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// jsdom is not vendored. Resolve it from the test's own ancestors, else from an
// absolute path in the JSDOM env var (ESM bare imports ignore NODE_PATH, so we
// require() from an absolute path). See test/README.md.
const require = createRequire(import.meta.url);
let JSDOM;
try { ({ JSDOM } = require('jsdom')); }
catch { ({ JSDOM } = require(process.env.JSDOM || '/tmp/dossier-test/node_modules/jsdom')); }

const HTML = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const html = fs.readFileSync(HTML, 'utf8');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('  ✗ FAIL: ' + m); } };

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'https://example.org/',
  pretendToBeVisual: true,
  beforeParse(win) { win.scrollTo = () => {}; },
});
const { window } = dom;
const { document } = window;
window.scrollTo = () => {};
// clipboard capture (code wraps in try/catch; we provide one to observe copies)
let lastCopy = null;
window.navigator.clipboard = { writeText: (t) => { lastCopy = t; return Promise.resolve(); } };

function nav(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.HashChangeEvent('hashchange', { newURL: 'https://example.org/' + hash }));
}
const activeView = () => document.querySelector('.view.active');
const txt = el => (el ? el.textContent : '');

console.log('— Smoke test: Balkans dossier v5 —');

// 1. Overview
nav('#/overview');
ok(document.getElementById('view-overview') && !document.getElementById('view-overview').hidden, 'overview view shows');
ok(/Tasks & reminders/.test(document.body.textContent), 'overview links to Tasks');
ok(/Critical pre-trip checklist/.test(document.body.textContent), 'overview links to Critical checklist');
const ovTemps = document.querySelectorAll('#view-overview .ov-temp');
ok(ovTemps.length >= 4, 'overview stop rows show plain temp pills (' + ovTemps.length + ')');
ok(!/comfortable|heat-flagged/.test(txt(document.getElementById('view-overview'))), 'overview temp has NO commentary words');

// 2. Budapest stop page — §1 intro + temp, §4 base (coords), §8 food-to-try, §6 resources, §9 richer rows
nav('#/budapest');
let bud = document.getElementById('view-budapest');
ok(bud && !bud.hidden, 'budapest view shows');
ok(bud.querySelector('.intro') && /Hungary/.test(txt(bud.querySelector('.intro'))), '§1 destination intro renders');
const temp = bud.querySelector('.stop-head .tempchip');
ok(temp && /27/.test(txt(temp)) && !/comfortable/.test(txt(temp)), '§1 plain temp chip (no commentary)');
ok(bud.querySelector('.base-block'), '§4 base block present');
ok(/Palace Quarter/.test(txt(bud.querySelector('.base-block'))), '§4 authored base shown (Budapest)');
ok(/suggested/.test(txt(bud.querySelector('.base-block'))), '§4 base marked "suggested" (authored default)');
const foodtry = [...bud.querySelectorAll('summary')].find(s => /Food to try/.test(s.textContent));
ok(foodtry, '§8 "Food to try" section present');
ok(/Lángos/.test(bud.textContent), '§8 food-to-try dish (Lángos) renders');
const places2eat = [...bud.querySelectorAll('summary')].find(s => /Places to eat/.test(s.textContent));
ok(places2eat, '§8 venue section renamed "Places to eat"');
const resources = [...bud.querySelectorAll('summary')].find(s => /Resources/.test(s.textContent));
ok(resources, '§6 Resources section present (Budapest)');
ok(/seat61/i.test(bud.textContent), '§6 resource (Seat61) renders');
// §9 richer rows — a row with a secondary line
const rowsub = bud.querySelector('.card.row .rowsub');
ok(rowsub, '§9 rows have a secondary line (.rowsub)');
// §4 distance estimate on a coord-bearing place row (Budapest base has coords; Erzsébet has none, Kerepesi has coords? check any distchip)
const distChips = bud.querySelectorAll('.card.row .distchip');
ok(distChips.length >= 1, '§4 from-base distance markers on rows (' + distChips.length + ')');
ok([...distChips].some(c => /min walk|km/.test(c.textContent)), '§4 at least one row shows an estimated distance');

// 3. Sofia — §4 no base (prompt), §1 no temp pill
nav('#/sofia');
const sof = document.getElementById('view-sofia');
ok(/No base set yet/.test(txt(sof.querySelector('.base-block'))), '§4 Sofia shows "add base" prompt (no authored base)');
ok(!sof.querySelector('.stop-head .tempchip'), '§1 Sofia shows no temp pill (no temp authored)');
ok(sof.querySelector('.intro'), '§1 Sofia still has an intro');

// 4. Card detail page — §5 research status, §7 best time, §9 tips, §4 distance
nav('#/budapest/veli-bej-baths-veli-bej-furdo');
let card = document.getElementById('view-card');
ok(card && !card.hidden, 'card page shows for Veli Bej');
ok(card.querySelector('.rs-dot.rs-needs'), '§5 "Needs research" badge on Veli Bej');
ok(card.querySelector('.researchbtn'), '§5 "Research in Claude Code" button present for needs item');
ok(/session times/.test(txt(card.querySelector('.rs-note'))), '§5 rsNote (open question) shown');
ok(card.querySelector('.besttime'), '§7 best-time block present');
ok(card.querySelector('.tips') && /Ottoman/.test(txt(card.querySelector('.tips'))), '§9 Tips section present');
ok(card.querySelector('.pgdist'), '§4 from-base distance line on detail page');
// research prompt copy
card.querySelector('.researchbtn').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(lastCopy && /Veli Bej/.test(lastCopy) && /Open question/.test(lastCopy), '§5 research button copies a focused prompt');

// a researched item should NOT show the research button
nav('#/budapest/cogwheel-railway-fogaskeru');
nav('#/budapest/kerepesi-cemetery-fiumei-uti-sirkert');
card = document.getElementById('view-card');
ok(card.querySelector('.rs-dot.rs-researched'), '§5 researched item shows researched badge');
ok(!card.querySelector('.researchbtn'), '§5 researched item has NO research button');

// 5. Tasks view — §2
nav('#/tasks');
const tasksV = document.getElementById('view-tasks');
ok(tasksV && !tasksV.hidden, 'tasks view shows');
const taskEls = tasksV.querySelectorAll('.task');
ok(taskEls.length >= 4, '§2 tasks render (' + taskEls.length + ')');
ok([...tasksV.querySelectorAll('.cl-group h3')].some(h => /Whole trip/.test(h.textContent)), '§2 tasks grouped (Whole trip)');
ok(tasksV.querySelector('.todoist'), '§2 "Add to Todoist" action present');
ok(/todoist\.com\/add\?content=/.test(tasksV.querySelector('.todoist').href), '§2 Todoist deep-link prefills title');
// toggle a task done → persists
const firstBox = tasksV.querySelector('.task-box');
const taskId = firstBox.getAttribute('data-taskbox');
firstBox.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(firstBox.closest('.task').classList.contains('is-done'), '§2 task completion toggles visible state');
ok(JSON.parse(window.localStorage.getItem('balkans:tasksdone'))[taskId] === 1, '§2 task completion persists to localStorage');
// task still visible after "Add to Todoist"
const todo = tasksV.querySelector('.todoist');
todo.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(lastCopy && lastCopy.length > 0, '§2 Todoist click copies title (fallback)');
ok(document.querySelectorAll('#view-tasks .task').length === taskEls.length, '§2 tasks remain visible after Todoist');

// 6. Critical checklist — §3
nav('#/checklist');
const crit = document.getElementById('view-checklist');
ok(/Critical pre-trip checklist/.test(txt(crit.querySelector('h2'))), '§3 critical checklist titled');
ok(crit.querySelectorAll('.task.crit').length >= 5, '§3 critical items render (' + crit.querySelectorAll('.task.crit').length + ')');
ok(/insurance/i.test(crit.textContent) && /Serbia/.test(crit.textContent), '§3 high-consequence content (insurance, borders)');
ok(!/restaurant|opening hours/i.test(crit.textContent), '§3 no routine reminders in critical list');

// 7. §4 base entry flow — set a user base on Belgrade (area only, no coords → directions fallback), then with coords
nav('#/belgrade');
let beg = document.getElementById('view-belgrade');
ok(/Donji Dorćol/.test(txt(beg.querySelector('.base-block'))), '§4 Belgrade authored area base shown');
// Belgrade base has NO coords → rows should show "from base" directions link, not an estimate
const begDist = beg.querySelectorAll('.card.row .distchip');
ok(begDist.length >= 1 && [...begDist].every(c => /from base/.test(c.textContent)), '§4 area-only base → directions link (no false estimate)');
// open form, set a user base WITH coords
beg.querySelector('[data-baseedit]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
beg = document.getElementById('view-belgrade');
const form = document.getElementById('baseform-belgrade');
form.querySelector('.bf-label').value = 'My hostel, Dorćol';
form.querySelector('.bf-coords').value = '44.8200, 20.4650';
form.querySelector('[data-basesave]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(JSON.parse(window.localStorage.getItem('balkans:bases')).belgrade.lat === 44.82, '§4 user base persists with coords');
beg = document.getElementById('view-belgrade');
ok(/My hostel/.test(txt(beg.querySelector('.base-block'))) && /yours/.test(txt(beg.querySelector('.base-block'))), '§4 user base overrides authored, marked "yours"');
const begDist2 = beg.querySelectorAll('.card.row .distchip');
ok([...begDist2].some(c => /min walk|km/.test(c.textContent)), '§4 user coords now yield distance estimates');

// 8. Persisted place state still works (regression)
nav('#/budapest/ervin-szabo-library');
card = document.getElementById('view-card');
const saveBtn = card.querySelector('.act.want');
saveBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(JSON.parse(window.localStorage.getItem('balkans:places'))['budapest-ervin-szabo-library'].w === 1, 'regression: Save (want) state still persists');

// 9. data attributes for Stage-3 filters present
nav('#/budapest');
bud = document.getElementById('view-budapest');
const sampleRow = bud.querySelector('.card.row[data-purpose]');
ok(sampleRow && sampleRow.hasAttribute('data-time') && sampleRow.hasAttribute('data-dur') && sampleRow.hasAttribute('data-bf') && sampleRow.hasAttribute('data-rs'), 'filter data-attributes present on rows');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
