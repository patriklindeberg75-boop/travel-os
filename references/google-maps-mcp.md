# Google Maps MCP

Configured 2026-09-27 in [project Codex settings](../.codex/config.toml).
Codex CLI recognizes `google_maps` with Streamable HTTP and Keychain-backed
credentials. It is disabled pending Keychain access and an authenticated test.
No service, billing account or API key was created. No live Maps query has passed.

## Keychain connection

The local header helper reads the generic-password item with service
`Google Maps Demo API` and account `contact@axcioncapital.com`. The user identified
this credential on 2026-09-27. Its value is never stored in this repository.
Codex receives it over the helper pipe as an HTTP header.

The helper is [google-maps-keychain-headers.py](../scripts/google-maps-keychain-headers.py).
Do not run its default mode in a terminal or tool log, because that mode emits
credential JSON for Codex. Use the safe diagnostic instead:

```sh
python3 scripts/google-maps-keychain-headers.py --check
```

If macOS requests access to this item, approve the read. A locked keychain or
unanswered prompt makes the helper fail without exposing the credential.
The config uses an absolute helper path for this checkout; update it if moving
the repository to another machine or directory.

After the diagnostic succeeds, set `enabled = true` in `.codex/config.toml`,
restart the MCP connection and test `search_places` against Chez Elle Snack,
19 boulevard Allal Al Fassi, Marrakech, Morocco. Check the returned Google Maps
source link. Do not treat config discovery alone as a live connection test.

The demo key is for prototyping and excludes user-submitted reviews and photos.
See [Google's demo-key guidance](https://developers.google.com/maps/demo-key).
Before using Maps results in a model, verify that account training and retention
settings meet Google's compatible-LLM requirements. Account settings are unverified.
This setup does not establish ChatGPT voice or Codex Cloud access.

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
The key is supplied as `X-Goog-Api-Key` through `http_headers_helper`.
`required = false` keeps a Maps failure from blocking the assistant.

Verified locally with `codex mcp get google_maps --json`. The CLI loaded the actual
project configuration, reported the expected URL and header-helper configuration,
and confirmed the disabled state. TOML parsing and reference links passed.
An initial direct credential read succeeded, but the Python HTTP client failed TLS
verification. Subsequent Keychain reads timed out, including the helper test. The
macOS curl retry therefore never reached Maps. Authentication, tool discovery and
a place lookup remain pending. TLS verification was not disabled.

Sources checked 2026-09-27:

- [Google Maps Grounding Lite setup, capabilities and requirements](https://developers.google.com/maps/ai/grounding-lite).
- [OpenAI Docs on project MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).
