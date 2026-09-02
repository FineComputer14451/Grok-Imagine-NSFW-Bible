#!/usr/bin/env python3
"""Validate and refresh master-pack-full.json builder fields."""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from pack_lib import refresh_builder_fields


def validate(data: dict) -> list[str]:
    issues = []
    prompts = data.get("prompts", [])
    if len(prompts) != 231:
        issues.append(f"expected 231 prompts, got {len(prompts)}")
    for entry in prompts:
        subject = entry.get("builder", {}).get("subject", "")
        if "Append ." in subject:
            issues.append(f"#{entry.get('number')}: corrupted subject contains 'Append .'")
        if not entry.get("builder", {}).get("style_id"):
            issues.append(f"#{entry.get('number')}: missing builder.style_id")
    return issues


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate pack only; do not refresh builder fields or write the file",
    )
    args = parser.parse_args()

    path = ROOT / "master-pack-full.json"
    data = json.loads(path.read_text().replace("\\~", "~"))
    if not args.check:
        refresh_builder_fields(data)
    issues = validate(data)
    if issues:
        print("Validation issues:")
        for issue in issues:
            print(f"  - {issue}")
        raise SystemExit(1)
    if args.check:
        print(f"OK: {len(data['prompts'])} NSFW prompts validated")
        return
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(data['prompts'])} NSFW prompts to {path.name}")


if __name__ == "__main__":
    main()
