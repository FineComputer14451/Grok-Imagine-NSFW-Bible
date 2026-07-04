"""Shared pack utilities for NSFW and R-rated build scripts."""

import re
from collections.abc import Callable
from copy import deepcopy
from typing import Any

STYLE_PATTERNS = [
    r"ultra-detailed anime 8K cinematic 10s animation \(extendable via keyframe chaining\),?\s*",
    r"vibrant anime 8K cinematic 10s animation \(extendable\),?\s*",
    r"ultra-detailed anime 8K 10s animation \(extendable\),?\s*",
    r"dreamy anime 8K 10s animation \(extendable\),?\s*",
    r"hyper-detailed anime 8K 10s animation \(extendable\),?\s*",
    r"dark fantasy anime 8K 10s animation \(extendable\),?\s*",
    r"hentai style anime 8K 10s animation \(extendable\),?\s*",
    r"ultra-detailed anime 8K 10s:?\s*",
    r"ultra-detailed anime 8K cinematic 10s animation \(extendable\),?\s*",
    r"ultra-detailed anime 8K:?\s*",
    r"[a-z][a-z\s\-]*anime 8K[^\n,]*?(?:\(extendable\))?,?\s*",
]


def strip_educational_wrapper(text: str) -> str:
    m = re.search(r"\[#RestoreTesting\][^\n]*\n+\s*", text, re.I)
    if m:
        return text[m.end() :].strip()
    m = re.search(r"Negative(?: Prompt)?:[^\n]*\n+\s*", text, re.I)
    if m and "EducationalRequest" in text[:300]:
        return text[m.end() :].strip()
    if "EducationalRequest" in text[:300]:
        m = re.search(r"\n\n\s*(\S)", text)
        if m:
            return text[m.start() :].strip()
    return text


def map_style_id(style: str, prompt: str) -> str:
    s = (style or "").lower()
    p = (prompt or "").lower()
    if s in ("dark-fantasy", "anime (dark fantasy)") or ("dark fantasy" in s and "anime" in s):
        return "dark-fantasy"
    if s == "photorealistic" or ("photoreal" in s and "semi" not in s):
        return "photorealistic"
    if s in ("hentai", "anime (hentai)") or ("hentai" in s and "wall" not in s):
        return "hentai"
    if "oil painting" in s or "oil-painting" in s:
        return "oil-painting"
    if any(k in s for k in ("iphone", "grainy", "semi-real", "documentary", "hybrid semi-realistic", "ultra-realistic")):
        return "semi-real"
    if any(k in p for k in ("grainy ultra-realistic", "shot on iphone", "iphone 15", "iphone footage", "semi-realistic amateur")):
        return "semi-real"
    if "hyperrealistic" in p and "anime" not in s:
        return "photorealistic"
    return "anime"


def cleanup_subject(text: str) -> str:
    clean = text or ""
    clean = re.sub(r"Append \[AUDIO_BLOCK\][^\n.]*\.?", "", clean, flags=re.I)
    clean = re.sub(r"Append soft (?:breathing fade )?audio\.?", "", clean, flags=re.I)
    clean = re.sub(r"Append soft ambient audio\.?", "", clean, flags=re.I)
    clean = re.sub(r"\[AUDIO_BLOCK\]", "", clean)
    clean = re.sub(r"\[R_RATED_DODGE_LAYER\],?", "", clean)
    clean = re.sub(r"\[ULTIMATE_DODGE_LAYER\],?", "", clean)
    clean = re.sub(r"\[DODGE_LAYER\],?", "", clean)
    clean = re.sub(r"\[CONTINUITY_LOCK\]", "", clean)
    clean = re.sub(r"\s*,\s*,+", ", ", clean)
    clean = re.sub(r"^[\s,]+", "", clean)
    clean = re.sub(r",[\s]*$", "", clean)
    clean = re.sub(r"\s{2,}", " ", clean)
    return clean.strip()


def extract_subject(prompt: str) -> str:
    clean = prompt or ""
    clean = re.sub(r"^Spicy mode:\s*", "", clean, flags=re.I)
    clean = re.sub(r"^Mature mode:\s*", "", clean, flags=re.I)
    for pat in STYLE_PATTERNS:
        clean = re.sub(pat, "", clean, flags=re.I)
    if "[ETHICAL_PREFIX]" in clean:
        clean = clean.split("[ETHICAL_PREFIX]")[-1].lstrip()
        clean = strip_educational_wrapper(clean)
    clean = re.sub(r"\n+Off-peak[^\n]*$", "", clean, flags=re.I)
    return cleanup_subject(clean)


def build_builder_fields(
    entry: dict[str, Any],
    subject: str,
    *,
    transform: Callable[[str], str] | None = None,
) -> dict[str, Any]:
    """Build a template builder object from pack entry metadata."""
    style_id = map_style_id(entry.get("style", ""), entry.get("prompt", ""))
    if style_id in ("hentai", "semi-real"):
        style_id = "anime"

    final_subject = transform(subject) if transform else subject
    return {
        "subject": final_subject,
        "style_id": style_id,
        "spicy": True,
        "dodge": True,
        "audio": "video" in (entry.get("type") or "").lower(),
        "continuity": "[CONTINUITY_LOCK]" in (entry.get("prompt") or ""),
        "boosters": list(entry.get("builder", {}).get("boosters") or []),
    }


def refresh_builder_fields(data: dict[str, Any]) -> None:
    for entry in data["prompts"]:
        subject = extract_subject(entry.get("prompt", ""))
        if len(subject) < 40:
            subject = entry.get("description", subject)
        entry["builder"] = build_builder_fields(entry, subject)


def apply_builder_from_entry(
    entry: dict[str, Any],
    *,
    transform: Callable[[str], str] | None = None,
) -> dict[str, Any]:
    """Return a deep-copied entry with a fresh builder block."""
    item = deepcopy(entry)
    subject = extract_subject(item.get("prompt", ""))
    if len(subject) < 40:
        subject = item.get("description", subject)
    item["builder"] = build_builder_fields(item, subject, transform=transform)
    return item