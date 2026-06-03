#!/bin/bash
# sync-from-ai-resources.sh — travel-os-LOCAL SessionStart hook
#
# Adapted from ai-resources/.claude/hooks/auto-sync-shared.sh. travel-os lives
# OUTSIDE the Axcíon repo tree (~/Claude Code/personal/travel-os/), so the
# original walk-up discovery of ai-resources fails. Two deltas vs the canonical:
#   1. AI_RESOURCES is hardcoded to the absolute Axcíon path (no walk-up).
#   2. Symlinks are emitted with ABSOLUTE targets (no python3 relpath) — correct
#      for an out-of-tree, single-machine project where ai-resources never moves.
# Everything else (manifest exclusions, idempotency guard, drift detection) is
# preserved from the canonical hook. This file is project-owned and moves with
# travel-os. The shared ai-resources hook is NOT touched.

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
MANIFEST="$PROJECT_DIR/.claude/shared-manifest.json"

# Bail if no manifest — project opts out of managed symlinks entirely.
[ -f "$MANIFEST" ] || exit 0

# Hardcoded absolute ai-resources location (DELTA 1 — no walk-up).
AI_RESOURCES="/Users/patrik.lindeberg/Claude Code/Axcion AI Repo/ai-resources"
[ -d "$AI_RESOURCES/.claude/commands" ] || exit 0

# Baked-in exclusions: ai-resources-meta files that never belong in projects.
EXCLUDE_COMMANDS="new-project deploy-workflow run-sufficiency pipeline-review"
EXCLUDE_AGENT_GLOBS="pipeline-stage-* session-guide-generator pipeline-review-*"

# Read project-local exclusions from manifest.
LOCAL_COMMANDS=$(jq -r '.commands.local[]?' "$MANIFEST" 2>/dev/null)
LOCAL_AGENTS=$(jq -r '.agents.local[]?' "$MANIFEST" 2>/dev/null)

in_list() {
  local needle="$1"; shift
  for item in $@; do
    [ "$item" = "$needle" ] && return 0
  done
  return 1
}

matches_glob() {
  local needle="$1"; shift
  for pattern in $@; do
    case "$needle" in $pattern) return 0;; esac
  done
  return 1
}

synced=""

# Sync commands — emit ABSOLUTE symlinks (DELTA 2).
for src in "$AI_RESOURCES"/.claude/commands/*.md; do
  [ -f "$src" ] || continue
  name=$(basename "$src" .md)
  in_list "$name" "$EXCLUDE_COMMANDS" && continue
  in_list "$name" "$LOCAL_COMMANDS" && continue
  target="$PROJECT_DIR/.claude/commands/${name}.md"
  [ -e "$target" ] || [ -L "$target" ] && continue
  mkdir -p "$PROJECT_DIR/.claude/commands"
  ln -s "$src" "$target"  # absolute target — see header DELTA 2
  synced="$synced ${name}.md"
done

# Sync agents — emit ABSOLUTE symlinks (DELTA 2).
for src in "$AI_RESOURCES"/.claude/agents/*.md; do
  [ -f "$src" ] || continue
  name=$(basename "$src" .md)
  matches_glob "$name" "$EXCLUDE_AGENT_GLOBS" && continue
  in_list "$name" "$LOCAL_AGENTS" && continue
  target="$PROJECT_DIR/.claude/agents/${name}.md"
  [ -e "$target" ] || [ -L "$target" ] && continue
  mkdir -p "$PROJECT_DIR/.claude/agents"
  ln -s "$src" "$target"  # absolute target — see header DELTA 2
  synced="$synced ${name}.md"
done

# Drift detection: targets that exist as regular files (not symlinks) but differ
# from the canonical source. Uses "AI-RESOURCES DRIFT:" prefix.
drifted=""

for src in "$AI_RESOURCES"/.claude/commands/*.md; do
  [ -f "$src" ] || continue
  name=$(basename "$src" .md)
  in_list "$name" "$EXCLUDE_COMMANDS" && continue
  in_list "$name" "$LOCAL_COMMANDS" && continue
  target="$PROJECT_DIR/.claude/commands/${name}.md"
  [ -f "$target" ] && [ ! -L "$target" ] || continue
  diff -q "$src" "$target" >/dev/null 2>&1 || drifted="$drifted ${name}.md"
done

for src in "$AI_RESOURCES"/.claude/agents/*.md; do
  [ -f "$src" ] || continue
  name=$(basename "$src" .md)
  matches_glob "$name" "$EXCLUDE_AGENT_GLOBS" && continue
  in_list "$name" "$LOCAL_AGENTS" && continue
  target="$PROJECT_DIR/.claude/agents/${name}.md"
  [ -f "$target" ] && [ ! -L "$target" ] || continue
  diff -q "$src" "$target" >/dev/null 2>&1 || drifted="$drifted ${name}.md"
done

if [ -n "$synced" ] || [ -n "$drifted" ]; then
  msg=""
  if [ -n "$synced" ]; then
    count=$(echo $synced | wc -w | tr -d ' ')
    msg="Auto-synced $count new shared file(s) from ai-resources (absolute symlinks):$synced"
  fi
  if [ -n "$drifted" ]; then
    drift_count=$(echo $drifted | wc -w | tr -d ' ')
    drift_msg="AI-RESOURCES DRIFT: $drift_count file(s) differ from canonical (regular files, not symlinks):$drifted. Run /sync-workflow or replace with symlink."
    [ -n "$msg" ] && msg="$msg | $drift_msg" || msg="$drift_msg"
  fi
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"SessionStart\",\"additionalContext\":\"$msg\"}}"
fi
