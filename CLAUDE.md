# Travel OS in Claude Code

Read [AGENTS.md](AGENTS.md) for the shared assistant instructions. Read
[the workflow guide](references/assistant-workflows.md) for record handling.
These documents replace the former dossier-first workflow and phase gates.

Ordinary conversation is the primary interface. `/trip-init` and
`/destination-check` are optional aliases for the same workflows.
`/destination-dossier` is a legacy entry point, not a prerequisite.

Keep the user's selected model. Do not add a project-wide model override or require
Patrik to move prompts between model providers. Use available tools directly.

Commit approved local work with explicit file paths. Do not push without a request.
Preserve supplied source files and unrelated edits. When continuing after context
compaction, resume from the current plan and records rather than old session phases.
