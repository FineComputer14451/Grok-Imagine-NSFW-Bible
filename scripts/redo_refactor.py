#!/usr/bin/env python3
"""Re-apply refactor steps 1-7 from origin/main baseline."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

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


def refresh_builder_fields(data: dict) -> None:
    for entry in data["prompts"]:
        subject = extract_subject(entry.get("prompt", ""))
        if len(subject) < 40:
            subject = entry.get("description", subject)
        entry["builder"] = {
            "subject": subject,
            "style_id": map_style_id(entry.get("style", ""), entry.get("prompt", "")),
            "spicy": True,
            "dodge": True,
            "audio": "video" in (entry.get("type") or "").lower(),
            "continuity": "[CONTINUITY_LOCK]" in (entry.get("prompt") or ""),
            "boosters": [],
        }


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
        text = text.replace(
            "| 231    | Infinite Aftercare Horizon",
            "| 231    | Infinite Aftercare Horizon",
        )
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


PROMPT_HELPERS = '''
        const expandPrompt = (text, voice) => {
            const audioBlock = `${BASE_AUDIO_BLOCK} ${voice}`;
            return String(text)
                .replace(/\\[ETHICAL_PREFIX\\]/g, ETHICAL_PREFIX)
                .replace(/\\[AUDIO_BLOCK\\]/g, audioBlock)
                .replace(/\\[CONTINUITY_LOCK\\]/g, CONTINUITY_LOCK)
                .replace(/\\[ULTIMATE_DODGE_LAYER\\]/g, ULTIMATE_DODGE_LAYER);
        };

        const composePrompt = (parts, { isSpicyMode = false, aspectRatio = null } = {}) => {
            const core = parts.filter(Boolean).map((p) => String(p).trim()).filter(Boolean).join(', ');
            let display = isSpicyMode ? `Spicy mode: ${core}` : core;
            if (aspectRatio) display += ` --ar ${aspectRatio}`;
            return display;
        };

        const toPrompt = (parts, options) => {
            const display = composePrompt(parts, options);
            return { display, raw: expandPrompt(display, options.voice) };
        };

        const copyText = (text, onSuccess) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                if (onSuccess) onSuccess();
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
        };
'''

GLOBAL_CONFIG = r'''
function GlobalConfig({
    variant = 'full',
    isSpicyMode,
    setIsSpicyMode,
    selectedStyle,
    setSelectedStyle,
    selectedBoosters,
    toggleBooster,
    useAudio,
    setUseAudio,
}) {
    const isCompact = variant === 'compact';

    const spicyToggle = (
        <button
            onClick={() => setIsSpicyMode(!isSpicyMode)}
            className={`${isCompact ? 'w-full px-2 py-1.5' : 'px-2 py-0.5'} text-xs rounded border transition-colors ${isSpicyMode ? 'bg-red-500/20 border-red-500 text-red-200' : 'border-gray-700 text-gray-500'}`}
        >
            {isCompact ? (isSpicyMode ? 'Enabled' : 'Disabled') : `Spicy Mode: ${isSpicyMode ? 'ON' : 'OFF'}`}
        </button>
    );

    const boosters = isCompact ? (
        <div className="flex flex-wrap gap-2">
            {STYLE_BOOSTERS.map((booster) => {
                const isActive = selectedBoosters.includes(booster.id);
                return (
                    <button
                        key={booster.id}
                        onClick={() => toggleBooster(booster.id)}
                        className={`px-2 py-1 rounded text-[10px] border transition-all ${isActive ? 'bg-purple-900/30 border-purple-500 text-purple-200' : 'bg-transparent border-gray-800 text-gray-600'}`}
                    >
                        {booster.label}
                    </button>
                );
            })}
        </div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STYLE_BOOSTERS.map((booster) => {
                const isActive = selectedBoosters.includes(booster.id);
                return (
                    <button
                        key={booster.id}
                        onClick={() => toggleBooster(booster.id)}
                        className={`px-3 py-2 rounded-md text-xs text-left transition-all border flex items-center justify-between group ${isActive ? 'bg-purple-900/30 border-purple-500 text-purple-200' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700'}`}
                    >
                        <span>{booster.label}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>}
                    </button>
                );
            })}
        </div>
    );

    return (
        <section className="space-y-4 bg-gray-900/20 border border-gray-800 p-4 rounded-xl">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                    <Settings size={12} /> {isCompact ? 'Global Config' : 'Configuration'}
                </label>
                {isCompact ? (
                    <div className="text-xs text-gray-400">Settings apply to all generated clips</div>
                ) : (
                    spicyToggle
                )}
            </div>

            {isCompact ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Spicy Mode</label>
                        {spicyToggle}
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Audio</label>
                        <button
                            onClick={() => setUseAudio(!useAudio)}
                            className={`w-full text-xs px-2 py-1.5 rounded border transition-colors ${useAudio ? 'bg-pink-500/20 border-pink-500 text-pink-200' : 'border-gray-700 text-gray-500'}`}
                        >
                            {useAudio ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-1">Art Style</label>
                        <select
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-1.5 focus:outline-none focus:border-blue-500"
                        >
                            {ART_STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>
                    <div className="col-span-4 border-t border-gray-800 pt-3 mt-1">
                        <label className="block text-[10px] text-gray-500 mb-2">Applied Visual Boosters</label>
                        {boosters}
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Base Art Style</span>
                            {selectedStyle === 'photorealistic' && (
                                <span className="text-[10px] text-red-400 flex items-center gap-1 bg-red-900/20 px-2 rounded animate-pulse">
                                    <AlertTriangle size={10} /> 5-15% Success Rate
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {ART_STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`px-3 py-2 rounded-md text-xs text-left transition-all border ${selectedStyle === style.id ? 'bg-gray-800 border-white text-white' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700'}`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-gray-800/50">
                        <span className="text-sm text-gray-300 flex items-center gap-2">
                            <Wand2 size={12} className="text-purple-400" /> Visual Boosters (Stackable)
                        </span>
                        {boosters}
                    </div>
                </>
            )}
        </section>
    );
}

'''


def step_split_and_patch(html: str) -> None:
    start_marker = "        // --- FULL MASTER PACK (Appendix B) ---\n"
    end_marker = "        // --- APP COMPONENT ---"
    start = html.index(start_marker)
    end = html.index(end_marker)

    shell = (
        html[:start]
        + "        // --- FULL MASTER PACK (canonical JSON, fetched at runtime) ---\n"
        + "        const MASTER_PACK_URL = 'master-pack-full.json';\n\n"
        + html[end:]
    )

    script_start = shell.index("<script type=\"text/babel\">\n") + len("<script type=\"text/babel\">\n")
    script_end = shell.rindex("    </script>")
    js = shell[script_start:script_end]

    # Remove inline MASTER_PACK if still present in js chunk - actually js is full script from shell after replacement
    # Re-read: shell still has full script with MASTER_PACK removed only at constants level... 
    # Wait, we only replaced MASTER_PACK in html before extracting - need to fix

    # Rebuild shell from original html with pack removed
    shell = (
        html[:start]
        + "        // --- FULL MASTER PACK (canonical JSON, fetched at runtime) ---\n"
        + "        const MASTER_PACK_URL = 'master-pack-full.json';\n\n"
        + html[end:]
    )
    script_start = shell.index("<script type=\"text/babel\">\n") + len("<script type=\"text/babel\">\n")
    script_end = shell.rindex("    </script>")
    js = shell[script_start:script_end]

    # PHASE_BLOCKS dodge tokens
    js = js.replace(
        'BUILD: "hips press flush, slow undulating grind begins, rhythmic pulsing connection implied, glistening sheen spreading, synced breathing rising, [ULTIMATE_DODGE_LAYER]",',
        'BUILD: "hips press flush, slow undulating grind begins, rhythmic pulsing connection implied, glistening sheen spreading, synced breathing rising",',
    )
    js = js.replace(
        'PEAK: "peak synchronized shuddering ecstasy waves, body arch/tremble, dramatic light flares, moans crescendo to gasps, overwhelmed expressions, [ULTIMATE_DODGE_LAYER]",',
        'PEAK: "peak synchronized shuddering ecstasy waves, body arch/tremble, dramatic light flares, moans crescendo to gasps, overwhelmed expressions",',
    )

    js = js.replace(
        "        const RISKY_REPLACEMENTS = [",
        PROMPT_HELPERS + "\n        const RISKY_REPLACEMENTS = [",
    )

    js = js.replace(
        "// --- APP COMPONENT ---\n\n        function App() {",
        GLOBAL_CONFIG + "\n// --- APP COMPONENT ---\n\nfunction App() {",
    )

    js = js.replace(
        "            const [isSanitized, setIsSanitized] = useState(false);\n            \n            // Logger State",
        "            const [isSanitized, setIsSanitized] = useState(false);\n            const [masterPack, setMasterPack] = useState([]);\n            const [packStatus, setPackStatus] = useState('loading');\n\n            // Logger State",
    )

    js = js.replace(
        """            // Persist logs
            useEffect(() => {
                localStorage.setItem('grok_logs', JSON.stringify(logs));
            }, [logs]);

            const insertBlock""",
        """            // Persist logs
            useEffect(() => {
                localStorage.setItem('grok_logs', JSON.stringify(logs));
            }, [logs]);

            useEffect(() => {
                let cancelled = false;
                fetch(MASTER_PACK_URL)
                    .then((res) => {
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return res.json();
                    })
                    .then((data) => {
                        if (cancelled) return;
                        setMasterPack(Array.isArray(data.prompts) ? data.prompts : []);
                        setPackStatus('ready');
                    })
                    .catch((err) => {
                        if (cancelled) return;
                        console.error('Failed to load master pack:', err);
                        setPackStatus('error');
                    });
                return () => { cancelled = true; };
            }, []);

            const insertBlock""",
    )

    # loadTemplate
    old_load = """            const loadTemplate = (t) => {
                // Style mapping
                if (t.style === 'dark-fantasy' || t.style === 'anime (dark fantasy)') setSelectedStyle('dark-fantasy');
                else if (t.style === 'photorealistic') setSelectedStyle('photorealistic');
                else if (t.style === 'hentai' || t.style === 'anime (hentai)') setSelectedStyle('hentai');
                else setSelectedStyle('anime');

                const isVideo = t.type.includes('Video');
                setUseAudio(isVideo);
                setUseDodge(true);
                setIsSpicyMode(true);
                setSelectedBoosters([]); // Reset boosters on template load

                // Smart Parsing: Remove boilerplate to isolate the Subject
                let cleanText = t.prompt;
                cleanText = cleanText.replace(/^Spicy mode:\\s*/i, '');
                
                // Remove style prefixes
                const stylePatterns = [
                    /ultra-detailed anime 8K cinematic 10s animation \\(extendable via keyframe chaining\\),?\\s*/gi,
                    /vibrant anime 8K cinematic 10s animation \\(extendable\\),?\\s*/gi,
                    /ultra-detailed anime 8K 10s animation \\(extendable\\),?\\s*/gi,
                    /dreamy anime 8K 10s animation \\(extendable\\),?\\s*/gi,
                    /hyper-detailed anime 8K 10s animation \\(extendable\\),?\\s*/gi,
                    /dark fantasy anime 8K 10s animation \\(extendable\\),?\\s*/gi,
                    /hentai style anime 8K 10s animation \\(extendable\\),?\\s*/gi,
                    /ultra-detailed anime 8K 10s:?\\s*/gi,
                    /ultra-detailed anime 8K cinematic 10s animation \\(extendable\\),?\\s*/gi,
                    /ultra-detailed anime 8K:?\\s*/gi
                ];
                stylePatterns.forEach(p => cleanText = cleanText.replace(p, ''));

                // Remove known blocks
                cleanText = cleanText.split('[ETHICAL_PREFIX]').pop() || cleanText;
                cleanText = cleanText.replace(/\\[ULTIMATE_DODGE_LAYER\\],?/g, '');
                cleanText = cleanText.replace(/\\[AUDIO_BLOCK\\]\\.?/g, '');
                cleanText = cleanText.replace(/Append \\[AUDIO_BLOCK\\]\\.?/gi, '');
                cleanText = cleanText.replace(/Append soft breathing fade audio\\.?/gi, '');
                
                cleanText = cleanText.replace(/^[\\s,]+/, '').trim();
                cleanText = cleanText.replace(/,[\\s]*$/, '').trim();

                setSubject(cleanText);
                setShowTemplates(false);
            };"""

    new_load = """            const loadTemplate = (t) => {
                const b = t.builder || {};
                const validStyles = ART_STYLES.map((s) => s.id);

                setSelectedStyle(validStyles.includes(b.style_id) ? b.style_id : 'anime');
                setUseAudio(b.audio ?? t.type.toLowerCase().includes('video'));
                setUseDodge(b.dodge ?? true);
                setIsSpicyMode(b.spicy ?? true);
                setUseContinuity(b.continuity ?? false);
                setSelectedBoosters(Array.isArray(b.boosters) ? b.boosters : []);
                setSubject(b.subject || t.description || '');
                setShowTemplates(false);
            };"""

    if old_load not in js:
        raise SystemExit("loadTemplate block not found")
    js = js.replace(old_load, new_load)

    js = js.replace(
        "                return MASTER_PACK.filter(t => \n",
        "                return masterPack.filter(t => \n",
    )
    js = js.replace(
        "            }, [searchTerm]);",
        "            }, [searchTerm, masterPack]);",
    )

    # generatePrompt block -> useMemo - read from file and replace large block
    gen_start = js.index("            const generatePrompt = () => {")
    gen_end = js.index("            const handleSequenceGenerate = () => {")
    new_prompt = """            const promptResult = useMemo(() => {
                const parts = [];
                const styleObj = ART_STYLES.find(s => s.id === selectedStyle);
                if (styleObj) parts.push(styleObj.prompt);

                selectedBoosters.forEach((bId) => {
                    const booster = STYLE_BOOSTERS.find(b => b.id === bId);
                    if (booster) parts.push(booster.prompt);
                });

                if (isSpicyMode) parts.push('[ETHICAL_PREFIX]');
                if (useContinuity) parts.push('[CONTINUITY_LOCK]');
                if (subject) parts.push(subject);
                if (useDodge) parts.push('[ULTIMATE_DODGE_LAYER]');
                if (useAudio) parts.push('[AUDIO_BLOCK]');

                return toPrompt(parts, { isSpicyMode, aspectRatio, voice: selectedVoice });
            }, [selectedStyle, selectedBoosters, isSpicyMode, useContinuity, subject, useDodge, useAudio, aspectRatio, selectedVoice]);

            const { raw: finalPrompt } = promptResult;

"""
    js = js[:gen_start] + new_prompt + js[gen_end:]

    # handleSequenceGenerate through copyToClipboard and handleCopy
    seq_start = js.index("            const handleSequenceGenerate = () => {")
    copy_start = js.index("            const copyToClipboard = (text, idx) => {")
    handle_copy_end = js.index("            const clearAll = () => {")

    new_seq_copy = """            const handleSequenceGenerate = () => {
                const styleObj = ART_STYLES.find(s => s.id === selectedStyle);
                const stylePrompt = styleObj ? styleObj.prompt : 'anime 8K';
                const boosterPrompts = selectedBoosters
                    .map((bId) => STYLE_BOOSTERS.find(b => b.id === bId)?.prompt)
                    .filter(Boolean);

                const createPhase = (phaseSubject, { isFirst, isLast }) => {
                    const parts = [];
                    if (isFirst) {
                        parts.push(stylePrompt);
                        parts.push(...boosterPrompts);
                        if (isSpicyMode) parts.push('[ETHICAL_PREFIX]');
                    } else {
                        parts.push('[CONTINUITY_LOCK]');
                    }
                    parts.push(phaseSubject);
                    if (!isLast && useDodge) parts.push('[ULTIMATE_DODGE_LAYER]');
                    if (useAudio) parts.push('[AUDIO_BLOCK]');
                    return toPrompt(parts, {
                        isSpicyMode: isFirst && isSpicyMode,
                        aspectRatio: isFirst ? aspectRatio : null,
                        voice: selectedVoice,
                    });
                };

                setSequencePrompts([
                    { title: 'Phase 1: Setup & Tease', ...createPhase(`${sequenceBase}. ${PHASE_BLOCKS.TEASE}`, { isFirst: true, isLast: false }) },
                    { title: 'Phase 2: Build & Rhythm', ...createPhase(`Intensify action: ${sequenceBase}, ${PHASE_BLOCKS.BUILD}`, { isFirst: false, isLast: false }) },
                    { title: 'Phase 3: Peak Ecstasy', ...createPhase(`Climax phase: ${PHASE_BLOCKS.PEAK}`, { isFirst: false, isLast: false }) },
                    { title: 'Phase 4: Aftercare Fade', ...createPhase(`Aftercare: ${PHASE_BLOCKS.AFTERCARE}`, { isFirst: false, isLast: true }) },
                ]);
            };

            const handleCopy = () => {
                copyText(finalPrompt, () => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
            };

"""
    js = js[:seq_start] + new_seq_copy + js[handle_copy_end:]

    # Remove duplicate generatePrompt line if present
    js = js.replace(
        "            const { display: displayPrompt, raw: finalPrompt } = generatePrompt();\n\n",
        "",
    )

    # Builder config -> GlobalConfig
    builder_cfg_start = js.index("                            {/* Config */}")
    builder_cfg_end = js.index("                            {/* Editor */}")
    js = (
        js[:builder_cfg_start]
        + """                            <GlobalConfig
                                variant="full"
                                isSpicyMode={isSpicyMode}
                                setIsSpicyMode={setIsSpicyMode}
                                selectedStyle={selectedStyle}
                                setSelectedStyle={setSelectedStyle}
                                selectedBoosters={selectedBoosters}
                                toggleBooster={toggleBooster}
                            />

"""
        + js[builder_cfg_end:]
    )

    # Template button updates
    js = js.replace(
        '<button onClick={() => setShowTemplates(!showTemplates)} className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors"><BookOpen size={12} /> Load Template ({MASTER_PACK.length})</button>',
        '<button onClick={() => setShowTemplates(!showTemplates)} disabled={packStatus !== \'ready\'} className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition-colors ${packStatus === \'ready\' ? \'bg-gray-800 hover:bg-gray-700 text-white\' : \'bg-gray-900 text-gray-600 cursor-not-allowed\'}`}><BookOpen size={12} /> Load Template ({packStatus === \'ready\' ? masterPack.length : packStatus === \'loading\' ? \'…\' : \'!\'})</button>',
    )

    js = js.replace(
        '{showTemplates && (',
        "{showTemplates && packStatus === 'ready' && (",
        1,
    )
    js = js.replace(
        'placeholder="Search 86+ positions..."',
        'placeholder={`Search ${masterPack.length} templates...`}',
    )

    js = js.replace(
        """                                                </div>
                                            </div>
                                        )}

                                        <textarea value={subject}""",
        """                                                </div>
                                            </div>
                                        )}
                                        {packStatus === 'error' && (
                                            <div className="mb-4 text-xs text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-3">
                                                Could not load template library. Serve this folder over HTTP (e.g. GitHub Pages) so <span className="font-mono">master-pack-full.json</span> can be fetched.
                                            </div>
                                        )}

                                        <textarea value={subject}""",
    )

    # Sequence config
    seq_cfg_start = js.index("                             {/* Config (Condensed for Sequence) */}")
    seq_cfg_end = js.index("                            {/* Sequence Input */}")
    js = (
        js[:seq_cfg_start]
        + """                            <GlobalConfig
                                variant="compact"
                                isSpicyMode={isSpicyMode}
                                setIsSpicyMode={setIsSpicyMode}
                                selectedStyle={selectedStyle}
                                setSelectedStyle={setSelectedStyle}
                                selectedBoosters={selectedBoosters}
                                toggleBooster={toggleBooster}
                                useAudio={useAudio}
                                setUseAudio={setUseAudio}
                            />

"""
        + js[seq_cfg_end:]
    )

    # Sequence phase copy/display
    js = js.replace(
        "onClick={() => copyToClipboard(phase.text)}",
        "onClick={() => copyText(expandPrompt(phase.display, selectedVoice))}",
    )
    js = js.replace("value={phase.text}", "value={phase.display}")
    js = js.replace("newPrompts[idx].text = e.target.value;", "newPrompts[idx].display = e.target.value;\n                                                                    newPrompts[idx].raw = expandPrompt(e.target.value, selectedVoice);")

    # Strip 8-space indent from js
    lines = js.splitlines()
    if lines and lines[0].startswith("        "):
        js = "\n".join(line[8:] if line.startswith("        ") else line for line in lines)
        if not js.endswith("\n"):
            js += "\n"

    (ROOT / "app.js").write_text(js)

    thin_shell = shell[: shell.index("<script type=\"text/babel\">")] + '    <script type="text/babel" src="app.js"></script>\n' + shell[shell.rindex("    </script>") + len("    </script>") :]
    (ROOT / "index.html").write_text(thin_shell)


def main() -> None:
    html = (ROOT / "index.html").read_text()
    step_json(html)
    step_summary()
    step_split_and_patch(html)
    print("Redo complete:")
    print("  index.html:", len((ROOT / "index.html").read_text().splitlines()), "lines")
    print("  app.js:", len((ROOT / "app.js").read_text().splitlines()), "lines")
    data = json.loads((ROOT / "master-pack-full.json").read_text())
    print("  prompts:", len(data["prompts"]))


if __name__ == "__main__":
    main()