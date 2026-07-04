#!/usr/bin/env bash
# Smoke-test static app assets (local dir or GitHub Pages base URL).
set -euo pipefail

BASE="${1:-http://localhost:8765}"
BASE="${BASE%/}"

paths=(
  index.html
  index-r.html
  index-nsfw.html
  config/nsfw.json
  config/r-rated.json
  icons.js
  edition.js
  prompt-engine.js
  ui-shared.js
  ui-builder-tab.js
  ui-sequence-tab.js
  ui-logger-tab.js
  ui-resources-tab.js
  app.js
  master-pack-full.json
  master-pack-r-rated.json
)

echo "Smoke test: $BASE"
failed=0
for path in "${paths[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$path")
  if [[ "$code" != "200" ]]; then
    echo "FAIL $code $path"
    failed=1
  else
    echo "OK   $code $path"
  fi
done

python3 - "$BASE" <<'PY'
import json
import sys
import urllib.request

base = sys.argv[1].rstrip("/")

def fetch(path):
    with urllib.request.urlopen(f"{base}/{path}") as resp:
        return resp.read()

nsfw = json.loads(fetch("config/nsfw.json"))
rated = json.loads(fetch("config/r-rated.json"))
full = json.loads(fetch("master-pack-full.json"))
rr = json.loads(fetch("master-pack-r-rated.json"))
html = fetch("index.html").decode()

assert nsfw["edition"] == "nsfw", nsfw["edition"]
assert rated["edition"] == "r-rated", rated["edition"]
assert len(full["prompts"]) == 237, len(full["prompts"])
assert len(rr["prompts"]) == 102, len(rr["prompts"])

for script in (
    "ui-shared.js",
    "ui-builder-tab.js",
    "ui-sequence-tab.js",
    "ui-logger-tab.js",
    "ui-resources-tab.js",
    "app.js",
):
    assert f'src="{script}"' in html, script

print(f"OK   config editions: nsfw + r-rated")
print(f"OK   pack counts: {len(full['prompts'])} NSFW, {len(rr['prompts'])} R-rated")
print(f"OK   index.html loads split UI modules")
PY

if [[ "$failed" -eq 0 ]]; then
  echo "All smoke checks passed."
else
  exit 1
fi