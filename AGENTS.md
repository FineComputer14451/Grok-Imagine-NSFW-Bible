# AGENTS.md — Grok Imagine NSFW Bible

Instructions for Grok Build, Cursor, and other coding agents working in this repository.

## Project summary

Static **React 18** prompt architect for Grok Imagine NSFW and R-rated editions. No bundler — JSX is compiled in-browser via Babel standalone. Template data lives in JSON packs fetched at runtime.

**Live site:** https://finecomputer14451.github.io/Grok-Imagine-NSFW-Bible/

## Critical constraints

1. **HTTP only** — `file://` breaks `fetch()` for `config/*.json` and `master-pack-*.json`. Always test with `python3 -m http.server`.
2. **Do not inline master packs in HTML** — canonical data is `master-pack-full.json` / `master-pack-r-rated.json`.
3. **Edition behavior** splits across two layers:
   - `config/nsfw.json` / `config/r-rated.json` — UI strings, URLs, principles
   - `edition.js` `EDITION_PRESETS` — ethical prefixes, phase blocks, sanitize rules, excluded styles
4. **Never run** `scripts/redo_refactor.py` expecting HTML migration — `merge_html_entries` is legacy; current `index.html` has no inline pack.

## File map

| Path | Purpose |
|------|---------|
| `index.html` | NSFW entry → loads `config/nsfw.json` |
| `index-r.html` | R-rated entry → loads `config/r-rated.json` |
| `index-nsfw.html` | Redirect to `index.html` |
| `app.js` | App shell, state, tab routing |
| `edition.js` | `resolveAppConfig()`, `EDITION_PRESETS` |
| `prompt-engine.js` | `createPromptEngine()` — token expansion, sanitize, compose |
| `icons.js` | Inline SVG icon components |
| `ui-shared.js` | `GlobalConfig`, `AspectRatioPicker` |
| `ui-builder-tab.js` | Builder tab |
| `ui-sequence-tab.js` | Sequence tab |
| `ui-logger-tab.js` | Logger tab |
| `ui-resources-tab.js` | Resources tab |
| `master-pack-full.json` | **237** NSFW templates (source of truth) |
| `master-pack-r-rated.json` | **102** R-rated templates (derived) |
| `master-pack-summary.md` | Human-readable pack index |
| `scripts/pack_lib.py` | Shared `extract_subject`, `build_builder_fields` |
| `scripts/build_nsfw_pack.py` | Validate/refresh NSFW pack |
| `scripts/build_r_rated_pack.py` | Rebuild R-rated pack from full pack |
| `scripts/smoke_test.sh` | Asset + count verification |

### Script load order (in HTML)

```
icons.js → edition.js → prompt-engine.js → ui-shared.js → ui-*-tab.js → app.js
```

## Common commands

```bash
# Local preview
python3 -m http.server 8000
# open http://localhost:8000/index.html

# Smoke test (default port 8765)
python3 -m http.server 8765 &
./scripts/smoke_test.sh http://localhost:8765

# Production smoke test
./scripts/smoke_test.sh https://finecomputer14451.github.io/Grok-Imagine-NSFW-Bible

# Validate NSFW pack (no writes)
python3 scripts/build_nsfw_pack.py --check

# Refresh NSFW pack builder fields (writes master-pack-full.json)
python3 scripts/build_nsfw_pack.py

# Rebuild R-rated pack after editing full pack
python3 scripts/build_r_rated_pack.py
```

## Editing guidelines

### Adding or changing templates

1. Edit `master-pack-full.json` (keep `number` sequential, include `builder`-compatible fields).
2. Run `python3 scripts/build_nsfw_pack.py` to refresh `builder` blocks.
3. Run `python3 scripts/build_r_rated_pack.py` if R-rated edition should pick up changes.
4. Update `master-pack-summary.md` if adding new ranges or highlights.
5. Run `./scripts/smoke_test.sh` — expects **237** NSFW and **102** R-rated prompts.

### Adding a new edition

1. Add preset to `EDITION_PRESETS` in `edition.js`.
2. Add `config/<edition>.json`.
3. Add HTML shell or query-param loader.
4. Add pack JSON and update `smoke_test.sh` paths/counts.

### Prompt tokens (expanded at copy time)

| Token | Resolved from |
|-------|----------------|
| `[ETHICAL_PREFIX]` | edition preset |
| `[AUDIO_BLOCK]` | edition `baseAudioBlock` + voice |
| `[CONTINUITY_LOCK]` | edition preset |
| `[DODGE_LAYER]` | edition `dodgeLayer` |
| `[ULTIMATE_DODGE_LAYER]` / `[R_RATED_DODGE_LAYER]` | legacy aliases in packs |

### Code style

- Plain JS modules use globals (no import/export) — loaded via script tags.
- JSX files use `type="text/babel"`.
- Keep modules under ~300 lines; split tabs rather than growing `app.js`.
- Prefer `edition` object over `IS_R_RATED` conditionals.
- Use `prompt.buildPromptParts()` for both builder and sequence paths.

## CI

GitHub Actions runs on push/PR to `main`:

1. `python3 scripts/build_nsfw_pack.py --check`
2. `python3 -m http.server 8765` + `./scripts/smoke_test.sh`

## Documentation

- **README.md** — user-facing guide (sections 1–9). Appendices A/B point to pack files, not inline duplicates.
- **master-pack-summary.md** — template index table (237 entries).
- Do not re-embed full JSON tables in README.

## What not to do

- Do not restore inline `MASTER_PACK` arrays in HTML.
- Do not duplicate config between `config/*.json` and `edition.js` presets without reason.
- Do not commit `scripts/__pycache__/` (gitignored).
- Do not run `redo_refactor.py` `step_split_and_patch` — removed; it would overwrite the modular app.