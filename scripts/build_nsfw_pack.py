#!/usr/bin/env python3
"""Validate and refresh master-pack-full.json builder fields."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from redo_refactor import refresh_builder_fields


def validate(data: dict) -> list[str]:
    issues = []
    prompts = data.get("prompts", [])
    if len(prompts) != 237:
        issues.append(f"expected 237 prompts, got {len(prompts)}")
    for entry in prompts:
        subject = entry.get("builder", {}).get("subject", "")
        if "Append ." in subject:
            issues.append(f"#{entry.get('number')}: corrupted subject contains 'Append .'")
        if not entry.get("builder", {}).get("style_id"):
            issues.append(f"#{entry.get('number')}: missing builder.style_id")
    return issues


def main() -> None:
    path = ROOT / "master-pack-full.json"
    data = json.loads(path.read_text().replace("\\~", "~"))
    refresh_builder_fields(data)
    issues = validate(data)
    if issues:
        print("Validation issues:")
        for issue in issues:
            print(f"  - {issue}")
        raise SystemExit(1)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(data['prompts'])} NSFW prompts to {path.name}")


if __name__ == "__main__":
    main()