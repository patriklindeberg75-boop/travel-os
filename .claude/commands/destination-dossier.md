---
description: Generate a destination dossier for a named trip — runs the dossier-orchestrator agent against trips/{slug}/trip-context.md. Runs a 5-pass operator-gated research funnel (locations, activities, food, practicalities — each with long-list → short-list narrowing) then synthesizes into an iPhone-paste-ready dossier with eight sections. Mode 1 manual subagent delegation (ChatGPT Pro / Perplexity Pro). Supports auto-resume from prior pass state. Halts on empty profile/principles.
model: opus
---

Generate a destination dossier for a named trip. Delegates to the `dossier-orchestrator` agent (Sonnet); the agent runs a 5-pass operator-gated research funnel — for each pass it generates a long-list subagent prompt, pauses for Patrik to run it and narrow to a short list, then proceeds to the next pass. After all 5 passes, it synthesizes through profile + principles, formats per the dossier template, writes the dossier to `trips/{slug}/destination-dossier.md`, and logs the run grounding to `logs/dossier-runs.md`.

**Auto-resume:** If you exit mid-flow and re-run, the orchestrator auto-detects completed passes from `trips/{slug}/dossier/pass-*-state.md` and resumes from the next incomplete pass. No `--resume` flag needed.

Input: `$ARGUMENTS` — optional. Forms:

- `/destination-dossier` — picks the most recently created `trips/{slug}/` directory.
- `/destination-dossier --trip albania-2026-05` — explicit slug.

---

### Step 1 — Resolve the trip slug

1. If `$ARGUMENTS` includes `--trip {slug}`, set `SLUG = {slug}`.
2. Otherwise, glob `trips/*/` and pick the directory with the most recent mtime. Set `SLUG` to that directory name.
3. If `trips/` is empty, abort with:

```
No trips found in trips/. Run /trip-init first.
Example: /trip-init Lisbon 2026-06-15 2026-06-29 "anti-tourist remote-work"
```

4. Verify `trips/{SLUG}/trip-context.md` exists. If not, abort with:

```
Trip context missing at trips/{SLUG}/trip-context.md.
Run /trip-init for this trip, or correct the --trip slug.
```

### Step 2 — Spine pre-check (cheap fail-fast)

Read the first 10 lines of each of:
- `profile/universal-traveler-profile.md`
- `profile/travel-principles.md`

If either file is empty, contains only an unpopulated placeholder header, or does not exist, abort with:

```
Personalization Spine Gate — Phase 0 prerequisite not met.

Empty or missing:
- {path that failed}
- {second path if also failed}

Populate both profile files before running /destination-dossier. See
CLAUDE.md § Personalization Spine Gate.
```

This is the cheap version of the gate; the orchestrator agent re-checks more thoroughly in Phase B of its procedure. The redundancy is intentional — it fails fast without spinning up the agent.

### Step 3 — Delegate to the `dossier-orchestrator` agent

Spawn the `dossier-orchestrator` subagent via the `Task` tool with this brief:

```
You are the dossier-orchestrator. Execute the destination-dossier workflow per
references/dossier-workflow.md.

Trip slug: {SLUG}
Trip context path: trips/{SLUG}/trip-context.md

Apply the procedure in your agent definition. Halt on Personalization Spine Gate
failure (Halt 1), trip context invalid (Halt 2), or viability FAIL (Step 2.5).

Run the 5-pass research funnel (Steps 3–10.5). For each pass: generate the
long-list prompt, present it to the operator, wait for paste-back and KEEP
selection, write the pass state file, then proceed to the next pass.

Check for existing pass-N-state.md files first (Phase C.5 auto-resume).
If passes are already complete, skip to the first incomplete pass.
```

Wait for the agent. If the agent halts on a gate, return its halt message to Patrik unmodified.

### Step 4 — Relay agent output

When the agent completes (or pauses), return its output to Patrik unmodified. Do not summarize the prompts; do not paraphrase the halt messages. The agent's voice is the orchestrator voice.

If the agent reports completion (Step 10 of the workflow), forward its status summary and add this one-line reminder:

```
Paste the dossier into iPhone Notes section by section. Use the ## headers as paste
boundaries — each section is independently paste-ready.
```

---

### Notes for the executor

- This is a thin command shell. Workflow logic lives in `dossier-orchestrator` and `references/dossier-workflow.md`.
- The command's model is Opus per `ai-resources/docs/agent-tier-table.md` (synthesis is judgment-heavy). The agent itself is Sonnet (mechanical orchestration). If first-trip output is shallow, escalate the agent to Opus in retro (architecture.md Decision 4).
- The redundant spine pre-check in Step 2 is a fail-fast optimization. It does not replace the agent's own Phase B gate — both must pass.
- Auto-resume is handled by the orchestrator reading `dossier/pass-N-state.md` files (Phase C.5). No special flag or state management needed in this command shell.
- Expect 4–5 operator interactions (one per pass) before the dossier ships. Pass 5 groups all four practicalities prompts into one batch.
