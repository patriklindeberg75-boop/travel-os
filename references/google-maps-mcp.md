# Google Maps MCP

Configured 2026-09-27 in [project Codex settings](../.codex/config.toml).
Codex CLI recognizes `google_maps` with Streamable HTTP and environment-backed
credentials. It is disabled pending credentials and an authenticated test.
No service, billing account or API key was created. No live Maps query has passed.

## Activate locally

1. For the first test, obtain a [Maps Demo Key](https://developers.google.com/maps/demo-key).
   Google offers it without billing for prototyping. It excludes user-submitted
   reviews and photos. For ongoing travel use, use a Google Cloud project with
   billing and the Maps Grounding Lite service enabled, with an appropriately
   restricted API key.
2. Supply `GOOGLE_MAPS_API_KEY` to the process that launches Codex. Do not paste
   it into chat, commit it, or put its literal value in the project configuration.
   A terminal variable does not automatically reach an already-running desktop app.
3. Before sending Maps content into the model, verify that your account's training
   and retention settings meet Google's compatible-LLM requirements. This has not
   been verified for this account.
4. Set `enabled = true` in `.codex/config.toml`. Restart the MCP connection or start
   a fresh Codex session in this trusted project.
5. Check `/mcp` for `google_maps`. Ask it to locate Chez Elle Snack, 19 boulevard
   Allal Al Fassi, Marrakech, Morocco. Verify that `search_places` actually runs
   and returns the intended place with its Google Maps source link.

For a temporary CLI test, enter the key at a hidden zsh prompt. It is not written
as a literal in shell history. The one-session override avoids enabling the server
permanently before a successful check.

```zsh
read -r -s 'GOOGLE_MAPS_API_KEY?Google Maps API key: '
export GOOGLE_MAPS_API_KEY
codex -c 'mcp_servers.google_maps.enabled=true'
unset GOOGLE_MAPS_API_KEY
```

This config is local Codex integration. It does not establish ChatGPT voice or
Codex Cloud access. Other machines need their own credential environment.

## Use in Travel OS

Use the server for place identity, Maps links, weather and walking/driving route
context. It does not provide transit timetables, real-time traffic or navigation.
Use operator sources for trains and buses. Keep the
[food discovery playbook](food-discovery.md) for food-quality judgments.
A Maps summary is not a full review audit or a guarantee of quality.

Put returned Google Maps source links immediately after the claims they support,
labelled Google Maps. Do not archive tool responses, reviews, photos or Maps-derived
summaries in this repository. Keep independent research and Patrik's own observations
separate. If the tool is unavailable, use web sources and disclose the gap.

## Configuration and verification

The server is Google's hosted endpoint `https://mapstools.googleapis.com/mcp`.
The key is supplied as `X-Goog-Api-Key` through `env_http_headers`.
`required = false` keeps a Maps failure from blocking the assistant.

Verified locally with `codex mcp get google_maps --json`. The CLI loaded the actual
project configuration, reported the expected URL and environment-variable mapping,
and confirmed the disabled state. TOML parsing and reference links passed.
Authentication, tool discovery and a place lookup remain pending.

Sources checked 2026-09-27:

- [Google Maps Grounding Lite setup, capabilities and requirements](https://developers.google.com/maps/ai/grounding-lite).
- [OpenAI Docs on project MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).
