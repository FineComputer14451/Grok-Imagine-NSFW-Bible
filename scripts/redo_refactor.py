#!/usr/bin/env python3
"""Refresh master-pack metadata and summary (legacy HTML merge optional)."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from pack_lib import refresh_builder_fields


def merge_html_entries(data: dict, html: str) -> None:
    """Legacy path: pull entries 232+ from inline HTML pack (pre-refactor only)."""
    if '"number": 232' not in html or "];\n\n        // --- APP COMPONENT ---" not in html:
        return
    if data["prompts"] and data["prompts"][-1]["number"] >= 232:
        return
    start = html.index('"number": 232')
    obj_start = html.rfind("  {", 0, start)
    end = html.index("];\n\n        // --- APP COMPONENT ---")
    chunk = html[obj_start:end].strip()
    if chunk.endswith("];"):
        chunk = chunk[:-2].strip()
    new_entries = json.loads("[" + chunk.replace("\\~", "~") + "]")
    data["prompts"].extend(new_entries)


def step_json(html: str | None = None) -> None:
    json_path = ROOT / "master-pack-full.json"
    raw = json_path.read_text().replace("\\~", "~")
    data = json.loads(raw)

    if html:
        merge_html_entries(data, html)

    data["category"] = "All Positions & Scenarios Master Pack – Global Release Edition (v4.4 + Community Expansions to 237)"
    data["date"] = "February 2026 (expanded to 237 entries)"
    desc = data["description"]
    if "Hempaholic619" not in desc:
        data["description"] = desc.replace(
            "and extreme denial themes.",
            "and extreme denial themes, plus Hempaholic619 cheat-sheet dodge patterns (grainy iPhone, sticker border, teleport reset).",
        )
    data["version"] = "4.4-expanded-237"

    refresh_builder_fields(data)

    json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    json.loads(json_path.read_text())
    assert len(data["prompts"]) == 237


def step_summary() -> None:
    path = ROOT / "master-pack-summary.md"
    text = path.read_text()
    text = text.replace("# Master Pack Summary – 231 Entries", "# Master Pack Summary – 237 Entries")
    text = text.replace("- Total: **231**", "- Total: **237**")
    if "232–237" not in text:
        text = text.replace(
            "- Cyber/mythical/denial/aftercare: 202–231",
            "- Cyber/mythical/denial/aftercare: 202–231\n- Hempaholic619 cheat-sheet dodge patterns: 232–237",
        )
    if "| 232    |" not in text:
        insert = (
            "| 232    | Anime Sticker Border God-Tier + Green Filter Lock | hybrid semi-realistic iPhone + sticker frame | Image / Video base | Very High | 92–97% | Core high-pass combo (u/Hempaholic619) |\n"
            "| 237    | Eve Fig Leaves + Anime Hentai Wall Posters + Foggy Reset | grainy fogged realism + sticker border | Image / Video (reset chain) | Very High | 90–96% | Multi-layer dodge finisher |\n\n"
        )
        text = text.replace(
            "**Full list**: See [master-pack-full.json](../master-pack-full.json) for all 231 prompt objects",
            insert + "**Full list**: See [master-pack-full.json](../master-pack-full.json) for all 237 prompt objects",
        )
    else:
        text = text.replace("for all 231 prompt objects", "for all 237 prompt objects")
    path.write_text(text)


def main() -> None:
    html_path = ROOT / "index.html"
    html = html_path.read_text() if html_path.exists() else None
    step_json(html)
    step_summary()
    data = json.loads((ROOT / "master-pack-full.json").read_text())
    print(f"Refreshed master pack: {len(data['prompts'])} prompts")


if __name__ == "__main__":
    main()