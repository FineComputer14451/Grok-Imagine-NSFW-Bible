#!/usr/bin/env python3
"""Fail closed if pack entries look like minors, real-person undress, or NCII."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

NEGATION = re.compile(
    r"\b(?:no|not|never|without|ban|zero|forbid(?:den)?|against|except)\b",
    re.I,
)

AGE = re.compile(
    r"\b(?:minors?|underage|loli|shota|pedoph\w*|csam|kidd(?:y|ie)|"
    r"teen(?:ager|s)?|under[- ]?18|barely[- ]?18|just[- ]turned[- ]18|"
    r"(?:1[0-7])[- ]year|high[- ]school|middle[- ]school|elementary|"
    r"kindergarten|schoolgirl|schoolboy|young[- ]looking|age[- ]ambiguous|"
    r"little girl|little boy)\b",
    re.I,
)
CHILD = re.compile(r"\bchildren\b|\bchild\b", re.I)
CHILD_OK = re.compile(r"\bchildhood\b", re.I)

REAL = re.compile(
    r"\b(?:celebrit\w*|deepfake|nudif\w*|real person|real people|"
    r"this photo|this image|photo of a real)\b|"
    r"undress(?:ing)? (?:her|him|this|the photo|the image)",
    re.I,
)

NONCONSENT = re.compile(
    r"\b(?:non[- ]?consens\w*|without (?:her|his|their) consent|"
    r"unconscious|drugged|rohypnol|hidden cam(?:era)?|revenge porn|"
    r"\brape\b|kidnap\w*|passed out|blacked out|doesn'?t know|"
    r"spiked)\b",
    re.I,
)

ADVERSARIAL = re.compile(
    r"EducationalRequest|ConsentBoundSimulacrum|ContextuallyFictionalized|"
    r"VisualNarrativeTesting|#RestoreTesting|cheat[- ]?sheet|"
    r"jailbreak|prompt injection|filter bypass|green filter|"
    r"sticker border|white-out teleport|fig leaves?",
    re.I,
)

CHEAT_NUMBERS = {232, 233, 234, 235, 236, 237}
FIELDS = ("name", "description", "prompt", "notes", "style", "dodge_level")


def haystack(entry: dict) -> str:
    parts = [str(entry.get(f, "")) for f in FIELDS]
    builder = entry.get("builder") or {}
    if isinstance(builder, dict):
        parts.extend(str(v) for v in builder.values())
    return "\n".join(parts)


def negated(text: str, match: re.Match) -> bool:
    window = text[max(0, match.start() - 48) : match.end() + 16]
    return bool(NEGATION.search(window))


def scan_entry(entry: dict) -> list[str]:
    issues: list[str] = []
    text = haystack(entry)
    num = entry.get("number")
    try:
        n = int(num)
    except (TypeError, ValueError):
        n = None
    if n in CHEAT_NUMBERS:
        issues.append("cheat-sheet number 232–237 must stay out of the public pack")

    for label, rx in (
        ("AGE", AGE),
        ("REAL_PERSON", REAL),
        ("NONCONSENT", NONCONSENT),
        ("ADVERSARIAL", ADVERSARIAL),
    ):
        for m in rx.finditer(text):
            if negated(text, m):
                continue
            issues.append(f"{label} token {m.group(0)!r}")

    for m in CHILD.finditer(text):
        if CHILD_OK.search(text[max(0, m.start() - 8) : m.end() + 8]):
            continue
        if negated(text, m):
            continue
        issues.append(f"AGE token {m.group(0)!r}")
    return issues


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pack", default=str(ROOT / "master-pack-full.json"))
    parser.add_argument("--expect-count", type=int, default=231)
    args = parser.parse_args()
    path = Path(args.pack)
    data = json.loads(path.read_text())
    prompts = data.get("prompts", [])
    failures = []
    if args.expect_count is not None and len(prompts) != args.expect_count:
        failures.append(
            f"{path.name}: expected {args.expect_count} prompts, got {len(prompts)}"
        )
    for entry in prompts:
        hits = scan_entry(entry)
        if hits:
            failures.append(f"#{entry.get('number')} {entry.get('name')}: " + "; ".join(hits))
    if failures:
        print("AUDIT FAIL")
        for line in failures:
            print(f"  - {line}")
        raise SystemExit(1)
    print(f"OK: {path.name} {len(prompts)} prompts passed token audit")


if __name__ == "__main__":
    main()
