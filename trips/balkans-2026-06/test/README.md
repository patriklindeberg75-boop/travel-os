# Dossier smoke test

`smoke.mjs` is a jsdom functional test for `../index.html` — it loads the built
page, drives the real user journeys (route navigation, base entry, task/critical
toggles, research-prompt copy, filters), and asserts the rendered DOM.

`jsdom` is the only dependency and is **not** vendored into this repo. Install it
once in a scratch dir, then point the test at it with the `JSDOM` env var (ESM
bare imports ignore `NODE_PATH`, so the test `require()`s jsdom from an absolute
path):

```bash
mkdir -p /tmp/dossier-test && cd /tmp/dossier-test
npm init -y >/dev/null && npm install jsdom >/dev/null
JSDOM=/tmp/dossier-test/node_modules/jsdom \
  node "/Users/patrik.lindeberg/Claude Code/Personal Repo/travel-os/trips/balkans-2026-06/test/smoke.mjs"
```

`/tmp/dossier-test/node_modules/jsdom` is also the test's default fallback path,
so once installed there you can omit the `JSDOM=` prefix.

Always run `node build.mjs` first if you changed `dossier-data.json` — the test
reads the built `index.html`, not the JSON.

Exit code 0 = all assertions pass. Each failure prints `✗ FAIL: <what>`.
