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

// 10. §10/§13 — grouped filter engine (Time / Purpose / Duration / Constraints), defect fix, combos, empty-clear, no leak
nav('#/budapest');
bud = document.getElementById('view-budapest');
const bar = document.getElementById('filterbar');
const fclick = el => el && el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const cardsOf = v => [...v.querySelectorAll('.card:not(.avoid)')];
const vis = v => cardsOf(v).filter(c => !c.classList.contains('filtered'));
const clearF = () => fclick(bar.querySelector('.fclear'));

// filter bar reveal + four-group rebuild (legacy Rank/Type chips dropped per Stage-3 redesign)
ok(bar.hasAttribute('hidden'), 'filter bar starts hidden');
fclick(document.getElementById('filterToggle'));
ok(!bar.hasAttribute('hidden'), 'Filters toggle reveals the bar');
ok(!bar.querySelector('.chip.tier') && !bar.querySelector('.chip.tag'), 'legacy Rank-tier & Type-tag chips removed');
ok(bar.querySelector('.chip.time') && bar.querySelector('.chip.purpose') && bar.querySelector('.chip.cons'), 'Time / Purpose / Constraints chip groups present');

// (a) Time filter + the `any`-defect fix: a card with NO data-time must NOT match a time selection
const morningChip = bar.querySelector('.chip.time[data-time="morning"]');
ok(morningChip, 'Morning time chip present');
const noTimeCard = cardsOf(bud).find(c => !(c.getAttribute('data-time') || '').trim());
ok(noTimeCard, 'precondition: at least one Budapest card has empty data-time');
fclick(morningChip);
ok(vis(bud).length > 0 && vis(bud).every(c => (c.getAttribute('data-time') || '').split(' ').includes('morning')), 'Time=Morning: every visible card is tagged morning');
ok(noTimeCard.classList.contains('filtered'), 'DEFECT FIX: a card lacking data-time is hidden under a time filter (no longer "any"-matched)');
clearF();
ok(vis(bud).length === cardsOf(bud).length, 'Clear restores all cards');

// (b) OR within a group: Morning OR Evening
const eveningChip = bar.querySelector('.chip.time[data-time="evening"]');
fclick(morningChip);
if (eveningChip) fclick(eveningChip);
ok(vis(bud).every(c => { const t = (c.getAttribute('data-time') || '').split(' '); return t.includes('morning') || (eveningChip && t.includes('evening')); }), 'OR within Time group (morning ∪ evening)');
clearF();

// (c) Purpose filter — a single present purpose leaves a non-empty, correct set
const purposeChip = bar.querySelector('.chip.purpose');
const pv = purposeChip.getAttribute('data-purpose');
fclick(purposeChip);
ok(vis(bud).length > 0 && vis(bud).every(c => (c.getAttribute('data-purpose') || '').split(' ').includes(pv)), 'Purpose filter: visible cards all carry the selected purpose');
clearF();

// (d) AND between groups: Time ∩ Purpose (soundness — visible cards satisfy both)
fclick(morningChip);
fclick(purposeChip);
ok(vis(bud).every(c => { const t = (c.getAttribute('data-time') || '').split(' '); const p = (c.getAttribute('data-purpose') || '').split(' '); return t.includes('morning') && p.includes(pv); }), 'AND between groups: visible cards satisfy BOTH Time and Purpose');
clearF();

// (e) Duration constraint, if any present
const durChip = bar.querySelector('.chip.dur');
if (durChip) {
  const dv = durChip.getAttribute('data-dur');
  fclick(durChip);
  ok(vis(bud).every(c => (c.getAttribute('data-dur') || '') === dv), 'Duration filter: visible cards all match the selected duration');
  clearF();
}

// (f) Budget-friendly constraint
const bfChip = bar.querySelector('.chip.cons[data-cons="bf"]');
if (bfChip) {
  fclick(bfChip);
  ok(vis(bud).every(c => c.getAttribute('data-bf') === '1'), 'Budget-friendly: visible cards all have data-bf=1');
  clearF();
}

// (g) Saved constraint — ervin-szabo-library was saved in test 8
nav('#/budapest');
bud = document.getElementById('view-budapest');
fclick(bar.querySelector('.chip.cons[data-cons="saved"]'));
const placesLS = () => JSON.parse(window.localStorage.getItem('balkans:places') || '{}');
const visSaved = vis(bud);
ok(visSaved.length >= 1 && visSaved.every(c => (placesLS()[c.getAttribute('data-id')] || {}).w), 'Saved filter: only saved cards visible');
clearF();

// (h) empty-state + inline clear: Sofia has no saved card → Saved filter guts the view
nav('#/sofia');
const sof2 = document.getElementById('view-sofia');
fclick(bar.querySelector('.chip.cons[data-cons="saved"]'));
ok(vis(sof2).length === 0, 'Sofia has no saved cards → all filtered');
const es = sof2.querySelector('.filter-empty');
ok(es && !es.hidden, 'empty-state appears when a filter guts the view');
fclick(es.querySelector('.fclear-inline'));
ok(vis(sof2).length === cardsOf(sof2).length && (!sof2.querySelector('.filter-empty') || sof2.querySelector('.filter-empty').hidden), 'inline Clear restores cards and hides empty-state');

// (i) no cross-destination leak: filtering the active view, then switching + clearing, leaves the new view unfiltered
nav('#/budapest');
bud = document.getElementById('view-budapest');
fclick(morningChip);
ok(cardsOf(bud).filter(c => c.classList.contains('filtered')).length > 0, 'morning filter hides some Budapest cards');
nav('#/belgrade');
const beg2 = document.getElementById('view-belgrade');
clearF();
ok(vis(beg2).length === cardsOf(beg2).length, 'after Clear, Belgrade shows all cards (no stuck cross-destination filter)');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
