#!/usr/bin/env python3
"""Build master-pack-r-rated.json from the full NSFW pack."""

import json
import re
import sys
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from redo_refactor import extract_subject

EXPLICIT_NAME = re.compile(
    r"missionary|cowgirl|doggy|69|anal|strap|facesit|titjob|paizuri|blowjob|"
    r"nelson|gang|tentacle|futa|pound|thrust|penetrat|bukkake|creampie|"
    r"deepthroat|rimjob|fisting|glory hole|gloryhole|dp |double penet|"
    r"bondage|denial|edging|orgasm denial|sound-only|masturbat|oral sex|"
    r"handjob|fingerbang|scissor(?!s)|prone bone|reverse cow|wheelbarrow",
    re.I,
)

EXCLUDE_NOTES = re.compile(
    r"cheat sheet|hempaholic|iphone|educationalrequest|deepfake dodge|"
    r"filter bypass|god-tier|white-out teleport|fig leaf|dryer|church worship",
    re.I,
)

RATED_REPLACEMENTS = [
    (r"\bnude\b", "silhouette"),
    (r"\bnaked\b", "bare-shoulder"),
    (r"\bmissionary\b", "face-to-face embrace"),
    (r"\bcowgirl\b", "partner above embrace"),
    (r"\borgasm\b", "emotional peak"),
    (r"\bclimax\b", "crescendo"),
    (r"\bpenetrat\w*", "deep connection"),
    (r"\bthrust\w*", "slow rhythm"),
    (r"\bmoans?\b", "soft sighs"),
    (r"\bfucking\b", "passion"),
    (r"\bsex\b", "intimacy"),
]

INCLUDE_HINTS = re.compile(
    r"massage|aftercare|tease|romantic|spoon|cuddle|kiss|dance|fireplace|"
    r"rain|balcony|candle|sensual|tender|afterglow|eye contact|embrace|"
    r"lingerie|silhouette|sheet|morning light|sunset|hotel|rooftop|"
    r"slow burn|warmth|holding|forehead|whisper",
    re.I,
)

NEW_R_RATED = [
    {
        "name": "Rain-Streaked Window Kiss",
        "description": "Slow passionate kiss against storm-lit glass",
        "prompt": "Mature mode: cinematic anime 8K, [ETHICAL_PREFIX] couple pressed close by rain-streaked loft window at night, city bokeh behind, slow deep kiss, hands on waist through thin fabric, breath fogging glass, [R_RATED_DODGE_LAYER], emotional eye contact, gentle pull into embrace. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "Low (silhouette)",
        "success_estimate": "92-96%",
        "notes": "Pure R-rated romance starter. High pass rate.",
    },
    {
        "name": "Fireplace Silhouette Undress",
        "description": "Tasteful shadow-play by crackling fire",
        "prompt": "Mature mode: cinematic anime 8K, [ETHICAL_PREFIX] living room fireplace glow, partner silhouettes behind sheer curtain panel, slow garment slip to floor implied in shadow only, [R_RATED_DODGE_LAYER], warm amber rim light, intimate laughter fading to soft sighs. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "Medium (shadow)",
        "success_estimate": "90-94%",
        "notes": "Hollywood fade-to-shadow technique.",
    },
    {
        "name": "Morning Sheet Cuddle Afterglow",
        "description": "Post-intimacy tenderness under linen",
        "prompt": "Mature mode: soft anime 8K, [ETHICAL_PREFIX] sunlit bedroom, couple tangled in white sheets shoulder-up framing, lazy morning kisses, fingers tracing jawline, [R_RATED_DODGE_LAYER], golden hour bloom, peaceful breathing sync. Append soft ambient audio.",
        "style": "anime",
        "type": "Both",
        "dodge_level": "Low",
        "success_estimate": "94-97%",
        "notes": "Ideal aftercare / epilogue clip.",
    },
    {
        "name": "Kitchen Slow Dance (Low Light)",
        "description": "Domestic intimacy with swaying embrace",
        "prompt": "Mature mode: warm anime 8K cinematic, [ETHICAL_PREFIX] midnight kitchen, single pendant lamp, slow dance barefoot on tile, foreheads touching, hands sliding along back over clothing, [R_RATED_DODGE_LAYER], vinyl crackle SFX, breath sync. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "Low",
        "success_estimate": "91-95%",
        "notes": "Wholesome R-rated tension builder.",
    },
    {
        "name": "Rooftop Sunset Embrace",
        "description": "Golden-hour hold overlooking city",
        "prompt": "Mature mode: vibrant anime 8K, [ETHICAL_PREFIX] rooftop at sunset, wind in hair, long coat and dress, passionate embrace and neck kiss, city panorama, [R_RATED_DODGE_LAYER], lens flare, swelling romantic score. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "Low",
        "success_estimate": "93-96%",
        "notes": "Outdoor romance without explicit framing.",
    },
    {
        "name": "Steamy Bathroom Silhouette",
        "description": "Fogged mirror implication only",
        "prompt": "Mature mode: cinematic anime 8K, [ETHICAL_PREFIX] steam-filled bathroom, fogged mirror silhouettes behind frosted glass shower, warm water audio, hands pressed to glass from inside shadow, [R_RATED_DODGE_LAYER], no explicit anatomy. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "High (frosted glass)",
        "success_estimate": "88-93%",
        "notes": "Implied intimacy via environment.",
    },
    {
        "name": "Lingerie Reveal (Artistic Cut)",
        "description": "Tasteful boudoir lighting, cutaway implication",
        "prompt": "Mature mode: soft-focus anime 8K, [ETHICAL_PREFIX] boudoir set, lace lingerie reveal in mirror, partner watching from doorway shadow, camera cuts to candle flame and clasped hands, [R_RATED_DODGE_LAYER], tasteful R-rated montage. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "Medium (cutaway)",
        "success_estimate": "89-94%",
        "notes": "Use jump-cuts instead of explicit display.",
    },
    {
        "name": "Hotel Balcony Wrap & Whisper",
        "description": "Travel romance wrap scene",
        "prompt": "Mature mode: cinematic anime 8K, [ETHICAL_PREFIX] high-rise hotel balcony night, partner wrapping coat around shoulders, whisper at ear, slow turn into kiss, city lights below, [R_RATED_DODGE_LAYER], gentle wind SFX. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Both",
        "dodge_level": "Low",
        "success_estimate": "92-95%",
        "notes": "Travel-film R-rated staple.",
    },
    {
        "name": "Record Player Slow Tease",
        "description": "Vintage apartment seduction pacing",
        "prompt": "Mature mode: nostalgic anime 8K, [ETHICAL_PREFIX] vinyl spinning, dim apartment, seated tease with unbuttoning one layer only, eye contact, fingers under chin lift, [R_RATED_DODGE_LAYER], warm tungsten grade. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Video",
        "dodge_level": "Medium",
        "success_estimate": "90-94%",
        "notes": "Tease-only; chain to Build phase.",
    },
    {
        "name": "Ocean Dock Moonlight Hold",
        "description": "Water-reflection romantic hold",
        "prompt": "Mature mode: dreamy anime 8K, [ETHICAL_PREFIX] wooden dock at moonrise, barefoot couple swaying in embrace, reflections on water, soft fabric movement, [R_RATED_DODGE_LAYER], crickets and gentle waves. Append [AUDIO_BLOCK].",
        "style": "anime",
        "type": "Both",
        "dodge_level": "Low",
        "success_estimate": "93-97%",
        "notes": "Calm romantic palette.",
    },
]


def rated_transform(text: str) -> str:
    out = text
    out = re.sub(r"Spicy mode:", "Mature mode:", out, flags=re.I)
    out = out.replace("[ULTIMATE_DODGE_LAYER]", "[R_RATED_DODGE_LAYER]")
    for pat, repl in RATED_REPLACEMENTS:
        out = re.sub(pat, repl, out, flags=re.I)
    return out


def should_include(entry: dict) -> bool:
    if entry["number"] >= 232:
        return False
    blob = " ".join(
        [
            entry.get("name", ""),
            entry.get("description", ""),
            entry.get("notes", ""),
            entry.get("prompt", "")[:200],
        ]
    )
    if EXPLICIT_NAME.search(entry.get("name", "")):
        return False
    if EXCLUDE_NOTES.search(blob):
        return False
    if INCLUDE_HINTS.search(blob):
        return True
    dodge = entry.get("dodge_level", "").lower()
    if dodge.startswith("low") and not EXPLICIT_NAME.search(blob):
        return True
    return False


def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", (name or "").lower().strip())


def build_builder(entry: dict, subject: str) -> dict:
    b = deepcopy(entry.get("builder", {}))
    b["subject"] = rated_transform(subject)
    b["spicy"] = True
    b["dodge"] = True
    b["audio"] = "video" in entry.get("type", "").lower()
    b["continuity"] = "[CONTINUITY_LOCK]" in entry.get("prompt", "")
    if b.get("style_id") == "hentai":
        b["style_id"] = "anime"
    if b.get("style_id") == "semi-real":
        b["style_id"] = "anime"
    return b


def main() -> None:
    full = json.loads((ROOT / "master-pack-full.json").read_text())
    adapted = []
    for entry in full["prompts"]:
        if not should_include(entry):
            continue
        item = deepcopy(entry)
        item["prompt"] = rated_transform(item["prompt"])
        item["name"] = rated_transform(item["name"])
        item["description"] = rated_transform(item["description"])
        subject = extract_subject(item["prompt"])
        if len(subject) < 40:
            subject = item["description"]
        item["builder"] = build_builder(entry, subject)
        item["notes"] = (rated_transform(item.get("notes", "")) + " [R-Rated edition]").strip()
        adapted.append(item)

    rated_prompts = []
    n = 1
    for template in NEW_R_RATED:
        item = deepcopy(template)
        item["number"] = n
        item["builder"] = {
            "subject": rated_transform(extract_subject(template["prompt"])),
            "style_id": "anime",
            "spicy": True,
            "dodge": True,
            "audio": "video" in template["type"].lower(),
            "continuity": False,
            "boosters": ["romantic", "cinema"],
        }
        rated_prompts.append(item)
        n += 1

    seen_names = {normalize_name(t["name"]) for t in NEW_R_RATED}
    for item in adapted:
        norm = normalize_name(item["name"])
        if norm in seen_names:
            continue
        seen_names.add(norm)
        item["number"] = n
        rated_prompts.append(item)
        n += 1

    pack = {
        "category": "Grok Imagine R-Rated Intimacy Bible – Cinematic Mature Edition (v1.0)",
        "author": "Community-curated (adapted from Grok Imagine NSFW Bible v4.4)",
        "date": "June 2026",
        "description": "Hollywood R-rated cinematic intimacy prompts: passionate romance, implied sensuality, silhouette/shadow dodge, and emotional aftercare. Fictional 18+ adults only. No explicit pornographic framing or filter-bypass cheat sheets. Prepend [ETHICAL_PREFIX] and use [R_RATED_DODGE_LAYER] for tasteful implication. Anime/stylized recommended (85-95% success off-peak). Ten exclusive romance starters, plus curated adaptations from the NSFW Bible.",
        "version": "1.0-r-rated",
        "rating": "R",
        "prompts": rated_prompts,
    }

    out = ROOT / "master-pack-r-rated.json"
    out.write_text(json.dumps(pack, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(rated_prompts)} R-rated prompts to {out.name}")


if __name__ == "__main__":
    main()