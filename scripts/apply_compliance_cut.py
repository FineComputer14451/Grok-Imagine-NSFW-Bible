#!/usr/bin/env python3
"""Drop cheat-sheet entries 232–237 and rename overstim 'forced peaks' wording."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT / "master-pack-full.json"

REPLACEMENTS = [
    (re.compile(r"multiple forced peaks", re.I), "multiple consensual overstim peaks"),
    (re.compile(r"forced multiple peaks", re.I), "consensual overstim multiple peaks"),
    (re.compile(r"extended forced peaks", re.I), "extended consensual overstim peaks"),
    (re.compile(r"Repeated drain & forced peaks"), "Repeated drain and consensual overstim peaks"),
    (re.compile(r"only audio cues force release", re.I), "only audio cues invite consensual release"),
    (re.compile(r"\bforced peaks\b", re.I), "consensual overstim peaks"),
]


def walk(obj):
    if isinstance(obj, dict):
        return {k: walk(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [walk(v) for v in obj]
    if isinstance(obj, str):
        s = obj
        for rx, repl in REPLACEMENTS:
            s = rx.sub(repl, s)
        return s
    return obj


def main() -> None:
    data = json.loads(PACK.read_text())
    before = len(data.get("prompts", []))
    kept = []
    dropped = []
    for entry in data.get("prompts", []):
        try:
            n = int(entry.get("number", 0))
        except (TypeError, ValueError):
            n = 0
        if n >= 232:
            dropped.append((n, entry.get("name")))
            continue
        kept.append(walk(entry))
    data["prompts"] = kept
    data["version"] = "4.4-compliance-231"
    data["date"] = "September 2026 (232–237 cheat-sheet removed)"
    data["category"] = (
        "All Positions & Scenarios Master Pack – Compliance Edition "
        "(v4.4, 231 entries; cheat-sheet 232–237 removed)"
    )
    PACK.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {PACK.name}: {before} -> {len(kept)}; dropped {dropped}")


if __name__ == "__main__":
    main()
