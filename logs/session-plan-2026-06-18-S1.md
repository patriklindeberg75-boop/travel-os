# Session Plan — 2026-06-18 S1

## Intent
Resolve the three "needs-verification" flags in the completed Bulgaria dossier — Baba Vuna opening hours, Bunderitsa Chalet opening hours, The Red Flat location — against current web sources, and update `destination-dossier.md` in place with confirmed details, corrections, or an explicit "could not verify (confirm on arrival)" note.

## Model
Recommended: Sonnet (execution-tier: web lookups + light dossier edits). Active session: Opus 4.8. Mismatch is acceptable — operator chose to proceed on Opus.

## Source Material
- `trips/bulgaria-2026-06/destination-dossier.md` — the three flagged entries:
  - The Red Flat (line ~143–150) — Sofia centre; "Hours: verify current programming on arrival"; relocates, address via hostel.
  - Baba Vuna (line ~439–449) — Bansko old town, ul. Tsar Simeon 16; "Hours: UNVERIFIED (dynamic; often reduces in low summer season)".
  - Bunderitsa Chalet — trail fuel (line ~451–459) — Pirin NP mountain hut; "Hours: UNVERIFIED (opens early for hikers; dynamic)".
- Trip dates: 2026-06-22 → 2026-06-29 (low summer / shoulder season — relevant to whether seasonal venues are open).

## Findings / Items to Address
1. **Baba Vuna (Bansko canteen)** — best web-verifiable of the three. Check Google Maps / TripAdvisor / Bulgarian sources for a current listing + posted hours. If a listing exists, capture posted hours and note them as "web-listed, confirm on arrival" (small local canteens routinely diverge from posted hours).
2. **Bunderitsa Chalet (Pirin mountain hut)** — likely NOT web-verifiable in any reliable way; food/opening depends on staff and week. Confirm there is no authoritative source; keep the on-arrival-confirm posture and tighten the wording.
3. **The Red Flat (Sofia)** — relocating art/social space; address deliberately not fixed. Verify whether it still operates and whether any current address/programming is published. If unfindable, keep "ask hostel / confirm on arrival" and note the verification attempt.

## Execution Sequence
1. Web-search each of the three places (current operating status, hours, address/location).
2. Cross-check Baba Vuna against a second source if a first listing is found.
3. Update each dossier entry: replace the bare "UNVERIFIED / verify on arrival" with the verification outcome — confirmed hours (sourced), a correction, or an explicit "checked the web on 2026-06-18, no reliable source — confirm on arrival" note so the flag is resolved rather than left ambiguous.
4. Re-scan the dossier's closing "Confirm…" checklist (lines ~784+) for consistency with any changes.
5. Commit the dossier update (no push).

## Scope Alternatives
- **Minimal:** Only update the three entries' Hours/Find-it lines. (Default.)
- **Broader (not this run):** Re-verify every "confirm the day before" item in the dossier — explicitly out of scope; only the 3 flagged places are in mandate.

## Autonomy Posture
Full autonomy. No structural change class touched. Web research + dossier text edits + one commit.

## Risk
None structural. Worst case: a place cannot be verified from the web (expected for the mountain hut and the relocating art space) — handled by converting the flag into an explicit, dated "could not verify, confirm on arrival" note rather than leaving it open.
