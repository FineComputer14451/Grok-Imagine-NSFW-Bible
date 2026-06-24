const { useState, useMemo, useEffect } = React;

// --- ICON COMPONENTS (Inline for standalone) ---
const IconBase = ({ size = 16, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const Copy = (p) => <IconBase {...p}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconBase>;
const Trash2 = (p) => <IconBase {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
const Settings = (p) => <IconBase {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></IconBase>;
const Terminal = (p) => <IconBase {...p}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></IconBase>;
const Maximize2 = (p) => <IconBase {...p}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></IconBase>;
const CheckCircle2 = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></IconBase>;
const BookOpen = (p) => <IconBase {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>;
const Shield = (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></IconBase>;
const ShieldCheck = (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></IconBase>;
const Music = (p) => <IconBase {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></IconBase>;
const Repeat = (p) => <IconBase {...p}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></IconBase>;
const EyeOff = (p) => <IconBase {...p}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/><line x1="2" x2="22" y1="2" y2="22"/></IconBase>;
const AlertTriangle = (p) => <IconBase {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></IconBase>;
const LinkIcon = (p) => <IconBase {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>;
const Search = (p) => <IconBase {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></IconBase>;
const Github = (p) => <IconBase {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></IconBase>;
const Layers = (p) => <IconBase {...p}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></IconBase>;
const Mic = (p) => <IconBase {...p}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></IconBase>;
const Film = (p) => <IconBase {...p}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></IconBase>;
const MinusCircle = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></IconBase>;
const Wand2 = (p) => <IconBase {...p}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><line x1="14" y1="7" x2="17" y2="10"/><path d="m16 12 5 5"/><path d="m4 8 3-3"/><path d="m8 4 3 3"/></IconBase>;
const Activity = (p) => <IconBase {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></IconBase>;
const Calendar = (p) => <IconBase {...p}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></IconBase>;

// --- EDITION CONFIG (set via index.html before loading app.js) ---
const APP_CONFIG = {
    edition: 'nsfw',
    masterPackUrl: 'master-pack-full.json',
    title: 'Grok Imagine Architect',
    versionLabel: 'v2.5 • NSFW Bible v4.4 (Feb 4)',
    modeLabel: 'Spicy Mode',
    modePrefix: 'Spicy mode',
    bibleVersion: 'Bible v4.4',
    footerDate: 'Feb 04, 2026',
    accentHeaderClass: '',
    subjectPlaceholder: 'Describe scene... (e.g. legs high missionary, deep rhythmic pulsing union)',
    sequencePlaceholder: "Describe the core scene context (e.g. 'candlelit bedroom, legs high missionary position, intense eye contact'). This will be used as the anchor for all phases.",
    alternateEdition: { label: 'R-Rated Edition', href: 'index-r.html' },
    principles: [
        { title: 'Post-Release Reality', text: 'Anime/Stylized is 80-95% reliable. Photoreal is ~5-15% (avoid).' },
        { title: 'Ethical Prefix', text: 'Mandatory consent markers required for all Spicy Mode prompts.' },
        { title: 'Chain Strategy', text: 'Use Phase Blocks to build arcs: Tease → Build → Peak → Aftercare.' },
        { title: 'Timing', text: 'Success rates heavily dependent on server load (off-peak EST recommended).' },
    ],
    ...(window.GROK_ARCHITECT_CONFIG || {}),
};

const IS_R_RATED = APP_CONFIG.edition === 'r-rated';

// --- CONSTANTS & DATA ---

const ETHICAL_PREFIX = IS_R_RATED
    ? "consensual fictional adults 18+, artistic R-rated cinematic intimacy, emotional authenticity, positive mutual desire, no real people/celebrities/deepfakes, no harm/coercion/non-consensual/minors, safewords and aftercare emphasized, Hollywood mature romance framing"
    : "consensual fictional 18+ adults only, positive mutual pleasure, artistic erotica masterpiece, no real people/celebrities/deepfakes/CSAM, no harm/coercion/non-consensual/minors/underage, safewords/check-ins/aftercare always emphasized";
const BASE_AUDIO_BLOCK = IS_R_RATED
    ? "synced natural breath, soft sighs, and emotional vocal texture rising with intimacy, gentle score swell at peak, tender post-scene breathing fade. Custom voice:"
    : "synced expressive moans/gasps/breathing rising perfectly with rhythm and hip velocity, crescendo at peak, gentle post-climax breathing fade, immersive soundtrack sync. Custom voice:";
const CONTINUITY_LOCK = IS_R_RATED
    ? "Seamless continuation from exact last frame (preserve identical characters, wardrobe state, facial features, body proportions, lighting grade): maintain consistent cinematic anime style throughout:"
    : "Seamless continuation from exact last frame (preserve identical nude bodies, facial features, body proportions, skin tone oil sheen): maintain consistent anime style, no photoreal bleed, ultra-detailed anime aesthetic throughout:";
const ULTIMATE_DODGE_LAYER = IS_R_RATED
    ? "tasteful Hollywood R-rated framing, silhouette and shadow play, sheer sheet drape, frosted glass or doorframe occlusion, candlelit implication, camera cutaway to clasped hands or flame, no explicit anatomy, positive consensual energy"
    : "motion blur on fusion/intimate zone, soft mist/steam overlay fully covering lower area, artistic shadows/low-opacity glow obscuring explicit contact, sheer fabric dissolve artistically, glistening aroused contours in shadow, implied only / artistic implication, positive consensual energy";

const ART_STYLES = [
    { id: 'anime', label: 'Anime (80-95% Success)', prompt: 'ultra-detailed anime 8K cinematic' },
    { id: 'dark-fantasy', label: 'Dark Fantasy', prompt: 'dark fantasy anime 8K, gothic candlelight' },
    { id: 'hentai', label: 'Hentai / Stylized', prompt: 'hentai style anime 8K, exaggerated expressions, fantasy gloss' },
    { id: 'semi-real', label: 'Semi-Realistic', prompt: 'semi-realistic illustration 8K, painterly brush strokes' },
    { id: 'photorealistic', label: 'Photorealistic (5-15% Success)', prompt: 'hyperrealistic 8K natural photography' },
    { id: 'oil-painting', label: 'Oil Painting', prompt: 'oil painting style, textured brushwork' },
];

const ACTIVE_ART_STYLES = IS_R_RATED
    ? ART_STYLES.filter((s) => !['hentai', 'photorealistic'].includes(s.id))
    : ART_STYLES;

const DODGE_LAYER_LABEL = IS_R_RATED ? 'R-Rated Implication Layer' : 'Ultimate Dodge Layer';

const STYLE_BOOSTERS = [
    { id: 'volumetric', label: 'Volumetric Lighting', prompt: 'volumetric lighting, dramatic rim light, ray tracing, god rays' },
    { id: 'gloss', label: 'Fantasy Gloss', prompt: 'fantasy oil painting style, glistening skin sheen, sweat gloss, wet skin texture' },
    { id: 'gothic', label: 'Gothic Atmos', prompt: 'gothic atmosphere, dark candlelight, mysterious shadows, deep blacks' },
    { id: 'vibrant', label: 'Vibrant/Neon', prompt: 'vibrant colors, neon glow, high saturation, colorful lighting' },
    { id: 'romantic', label: 'Soft Romantic', prompt: 'soft focus, pastel palette, dreamy atmosphere, bloom effect, romantic lighting' },
    { id: 'cinema', label: 'Cinematic Depth', prompt: 'shallow depth of field, bokeh background, cinematic composition, perfect framing' }
];

const VOICE_TYPES = [
    "warm husky sultry low-pitched breathy", "bright mid-pitch husky", "deep sensual velvet", 
    "soft needy whisper", "ecstatic trembling soprano", "sultry velvet moaner", 
    "breathy desperate whimper", "quivering high-pitched needy", "low throaty growl-sigh", 
    "melodic panting siren"
];

const PHASE_BLOCKS = IS_R_RATED ? {
    TEASE: "slow romantic tease, feather-light touches along jaw and shoulders, eye contact intensifying, soft sighs building, clothing partially loosened, warm candle glow on skin",
    BUILD: "bodies draw close, slow swaying embrace, passionate kisses deepening, hands tracing back through fabric, synced breathing rising, silhouette implication",
    PEAK: "emotional crescendo, arched neck kiss, trembling hold, dramatic light flare, sighs to breathless pause, overwhelmed tender expressions",
    AFTERCARE: "gentle fade to tender afterglow hold, loving gaze, slow caresses, affirmations/whispers, soft breathing sync fade, emotional closeness emphasized"
} : {
    TEASE: "slow sensual tease, feather-light touches trailing skin, eye contact intensifying, soft moans building, clothing partially askew, artistic implication only, warm candle glow on glistening skin",
    BUILD: "hips press flush, slow undulating grind begins, rhythmic pulsing connection implied, glistening sheen spreading, synced breathing rising",
    PEAK: "peak synchronized shuddering ecstasy waves, body arch/tremble, dramatic light flares, moans crescendo to gasps, overwhelmed expressions",
    AFTERCARE: "gentle fade to tender afterglow hold, loving gaze, slow caresses/massage, affirmations/whispers, soft breathing sync fade, emotional closeness emphasized"
};


const expandPrompt = (text, voice) => {
    const audioBlock = `${BASE_AUDIO_BLOCK} ${voice}`;
    return String(text)
        .replace(/\[ETHICAL_PREFIX\]/g, ETHICAL_PREFIX)
        .replace(/\[AUDIO_BLOCK\]/g, audioBlock)
        .replace(/\[CONTINUITY_LOCK\]/g, CONTINUITY_LOCK)
        .replace(/\[R_RATED_DODGE_LAYER\]/g, ULTIMATE_DODGE_LAYER)
        .replace(/\[ULTIMATE_DODGE_LAYER\]/g, ULTIMATE_DODGE_LAYER);
};

const composePrompt = (parts, { isSpicyMode = false, aspectRatio = null } = {}) => {
    const core = parts.filter(Boolean).map((p) => String(p).trim()).filter(Boolean).join(', ');
    let display = isSpicyMode ? `${APP_CONFIG.modePrefix}: ${core}` : core;
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

const RISKY_REPLACEMENTS = [
    { risk: /\b(fucking|sex|intercourse)\b/gi, safe: "intimacy" },
    { risk: /\b(thrusting|pounding|banging|hammering)\b/gi, safe: "rhythmic pulsing" },
    { risk: /\b(penetration|penetrating|inside)\b/gi, safe: "deep connection" },
    { risk: /\b(cum|semen|ejaculation|sperm)\b/gi, safe: "glistening sheen" },
    { risk: /\b(orgasm|climax)\b/gi, safe: "shuddering ecstasy" },
    { risk: /\b(cock|dick|penis|vagina|pussy|cunt)\b/gi, safe: "fusion zone" },
    { risk: /\b(sucking|licking|blowjob)\b/gi, safe: "devotion" },
    { risk: /\b(naked|nude)\b/gi, safe: "bare skin" },
    { risk: /\b(nipples|tits|boobs)\b/gi, safe: "curves" }
];

const SOURCES = [
    { title: "GitHub Repository (FineComputer14451)", url: "https://github.com/FineComputer14451/Grok-Imagine-NSFW-Bible", icon: <Github size={12} /> },
    ...(IS_R_RATED ? [
        { title: "Full NSFW Bible (Explicit Edition)", url: "index.html" },
        { title: "Grok: Imagine - NSFW Bible v4.4", url: "https://www.reddit.com/r/grok/comments/1qukk9t/grok_imagine_nsfw_bible_v42_unlock_epic_erotica/" },
    ] : [
        { title: "R-Rated Bible (Cinematic Mature Edition)", url: "index-r.html" },
        { title: "Grok: Imagine - NSFW Bible v4.4", url: "https://www.reddit.com/r/grok/comments/1qukk9t/grok_imagine_nsfw_bible_v42_unlock_epic_erotica/" },
    ]),
];

// --- FULL MASTER PACK (canonical JSON, fetched at runtime) ---
const MASTER_PACK_URL = APP_CONFIG.masterPackUrl;


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
    {isCompact ? (isSpicyMode ? 'Enabled' : 'Disabled') : `${APP_CONFIG.modeLabel}: ${isSpicyMode ? 'ON' : 'OFF'}`}
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
                <label className="block text-[10px] text-gray-500 mb-1">{APP_CONFIG.modeLabel}</label>
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
                    {ACTIVE_ART_STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
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
                    {ACTIVE_ART_STYLES.map((style) => (
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


// --- APP COMPONENT ---

function App() {
    const [subject, setSubject] = useState('');
    const [isSpicyMode, setIsSpicyMode] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState('anime');
    const [selectedBoosters, setSelectedBoosters] = useState([]);
    const [useDodge, setUseDodge] = useState(true);
    const [useAudio, setUseAudio] = useState(true);
    const [selectedVoice, setSelectedVoice] = useState(VOICE_TYPES[0]);
    const [useContinuity, setUseContinuity] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [activeTab, setActiveTab] = useState('builder'); 
    const [copied, setCopied] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSanitized, setIsSanitized] = useState(false);
    const [masterPack, setMasterPack] = useState([]);
    const [packStatus, setPackStatus] = useState('loading');

    // Logger State
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('grok_logs');
        return saved ? JSON.parse(saved) : [];
    });
    const [newLog, setNewLog] = useState({ style: 'anime', result: 'Pass', speed: 'Fast', notes: '' });

    // Sequence Builder State
    const [sequenceBase, setSequenceBase] = useState('');
    const [sequencePrompts, setSequencePrompts] = useState([]);

    // Persist logs
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

    const insertBlock = (text) => {
        setSubject(prev => prev + (prev ? " " : "") + text);
    };

    const toggleBooster = (id) => {
        setSelectedBoosters(prev => 
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const loadTemplate = (t) => {
        const b = t.builder || {};
        const validStyles = ACTIVE_ART_STYLES.map((s) => s.id);

        setSelectedStyle(validStyles.includes(b.style_id) ? b.style_id : 'anime');
        setUseAudio(b.audio ?? t.type.toLowerCase().includes('video'));
        setUseDodge(b.dodge ?? true);
        setIsSpicyMode(b.spicy ?? true);
        setUseContinuity(b.continuity ?? false);
        setSelectedBoosters(Array.isArray(b.boosters) ? b.boosters : []);
        setSubject(b.subject || t.description || '');
        setShowTemplates(false);
    };
    
    const handleSanitize = () => {
        let newText = subject;
        let count = 0;
        RISKY_REPLACEMENTS.forEach(({ risk, safe }) => {
            if (risk.test(newText)) {
                newText = newText.replace(risk, safe);
                count++;
            }
        });
        if (count > 0 || newText !== subject) {
            setSubject(newText);
            setIsSanitized(true);
            setTimeout(() => setIsSanitized(false), 2000);
        }
    };

    const addLog = () => {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...newLog
        };
        setLogs([entry, ...logs]);
        setNewLog({ ...newLog, notes: '' }); // reset notes only
    };

    const deleteLog = (id) => {
        setLogs(logs.filter(l => l.id !== id));
    };

    const successRate = useMemo(() => {
        if (logs.length === 0) return 0;
        const wins = logs.filter(l => l.result === 'Pass').length;
        return Math.round((wins / logs.length) * 100);
    }, [logs]);

    const filteredTemplates = useMemo(() => {
        return masterPack.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            t.prompt.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, masterPack]);

    const promptResult = useMemo(() => {
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
        if (useDodge) parts.push(IS_R_RATED ? '[R_RATED_DODGE_LAYER]' : '[ULTIMATE_DODGE_LAYER]');
        if (useAudio) parts.push('[AUDIO_BLOCK]');

        return toPrompt(parts, { isSpicyMode, aspectRatio, voice: selectedVoice });
    }, [selectedStyle, selectedBoosters, isSpicyMode, useContinuity, subject, useDodge, useAudio, aspectRatio, selectedVoice]);

    const { raw: finalPrompt } = promptResult;

    const handleSequenceGenerate = () => {
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
            if (!isLast && useDodge) parts.push(IS_R_RATED ? '[R_RATED_DODGE_LAYER]' : '[ULTIMATE_DODGE_LAYER]');
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

    const clearAll = () => {
        setSubject('');
        setUseDodge(true);
        setUseAudio(false);
        setUseContinuity(false);
        setSelectedBoosters([]);
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans">
            
            {/* Header */}
            <header className="border-b border-gray-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-sm font-bold text-xl font-mono">/</div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                                {APP_CONFIG.title}
                            </h1>
                            <span className="text-[10px] text-gray-500 font-mono">{APP_CONFIG.versionLabel}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {APP_CONFIG.alternateEdition && (
                            <a href={APP_CONFIG.alternateEdition.href} className="hidden sm:inline text-[10px] px-2 py-1 rounded border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                                {APP_CONFIG.alternateEdition.label}
                            </a>
                        )}
                        <button onClick={() => setActiveTab('builder')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === 'builder' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>Builder</button>
                        <button onClick={() => setActiveTab('sequence')} className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1 ${activeTab === 'sequence' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Film size={14} /> Sequence</button>
                        <button onClick={() => setActiveTab('logger')} className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1 ${activeTab === 'logger' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Activity size={14} /> Logger</button>
                        <button onClick={() => setActiveTab('resources')} className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1 ${activeTab === 'resources' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><BookOpen size={14} /> Guide Sources</button>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col lg:flex-row max-w-6xl mx-auto w-full p-4 gap-6">
                
                {activeTab === 'builder' ? (
                    <>
                        <div className="flex-grow space-y-6">
                            <GlobalConfig
                                variant="full"
                                isSpicyMode={isSpicyMode}
                                setIsSpicyMode={setIsSpicyMode}
                                selectedStyle={selectedStyle}
                                setSelectedStyle={setSelectedStyle}
                                selectedBoosters={selectedBoosters}
                                toggleBooster={toggleBooster}
                            />

                    {/* Editor */}
                            <section className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"><Terminal size={14} /> Prompt Subject</label>
                                    <div className="flex gap-2">
                                         <button onClick={handleSanitize} className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition-colors border ${isSanitized ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-800 hover:bg-green-900/40 text-gray-400 hover:text-green-400 border-transparent hover:border-green-500/50'}`} title="Auto-replace risky verbs"><ShieldCheck size={12} /> {isSanitized ? 'Sanitized!' : 'Sanitize'}</button>
                                         <button onClick={() => setShowTemplates(!showTemplates)} disabled={packStatus !== 'ready'} className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition-colors ${packStatus === 'ready' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-900 text-gray-600 cursor-not-allowed'}`}><BookOpen size={12} /> Load Template ({packStatus === 'ready' ? masterPack.length : packStatus === 'loading' ? '…' : '!'})</button>
                                    </div>
                                </div>

                                {showTemplates && packStatus === 'ready' && (
                                    <div className="mb-4 bg-gray-900 border border-gray-700 rounded-lg animate-in overflow-hidden">
                                        <div className="p-3 border-b border-gray-800 flex gap-2">
                                            <Search size={16} className="text-gray-500" />
                                            <input type="text" placeholder={`Search ${masterPack.length} templates...`} className="bg-transparent border-none focus:outline-none text-sm text-white w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
                                        </div>
                                        <div className="max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                                            {filteredTemplates.map((t, idx) => (
                                                <button key={t.number ?? idx} onClick={() => loadTemplate(t)} className="text-left p-2 hover:bg-gray-800 rounded group border border-transparent hover:border-gray-700">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-white group-hover:text-blue-400 truncate pr-2">{t.name}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase border border-gray-700 rounded px-1">{t.type}</span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 line-clamp-2 leading-tight opacity-70 group-hover:opacity-100">{t.prompt}</div>
                                                </button>
                                            ))}
                                            {filteredTemplates.length === 0 && <div className="col-span-2 p-4 text-center text-xs text-gray-500">No matching templates found.</div>}
                                        </div>
                                    </div>
                                )}
                                {packStatus === 'error' && (
                                    <div className="mb-4 text-xs text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-3">
                                        Could not load template library. Serve this folder over HTTP (e.g. GitHub Pages) so <span className="font-mono">{APP_CONFIG.masterPackUrl}</span> can be fetched.
                                    </div>
                                )}

                                <textarea value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={APP_CONFIG.subjectPlaceholder} className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent transition-all min-h-[120px] resize-y font-mono text-sm" />

                                {/* Phase Sequencer */}
                                <div className="flex flex-col gap-2 pt-1">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-semibold"><Layers size={10} /> Chain Phase Blocks ({APP_CONFIG.bibleVersion}):</div>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => insertBlock(PHASE_BLOCKS.TEASE)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-blue-500 transition-colors">1. [TEASE INTRO]</button>
                                        <button onClick={() => insertBlock(PHASE_BLOCKS.BUILD)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-blue-500 transition-colors">2. [BUILD RHYTHM]</button>
                                        <button onClick={() => insertBlock(PHASE_BLOCKS.PEAK)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-pink-500 transition-colors">3. [PEAK ECSTASY]</button>
                                        <button onClick={() => insertBlock(PHASE_BLOCKS.AFTERCARE)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-green-500 transition-colors">4. [AFTERCARE]</button>
                                    </div>
                                </div>
                            </section>

                            {/* Master Blocks */}
                            <section className="space-y-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Shield size={12} /> Master Blocks</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {/* Audio */}
                                    <div className={`p-3 rounded-lg border transition-all ${useAudio ? 'bg-gray-800/50 border-gray-600' : 'bg-transparent border-gray-800 opacity-60'}`}>
                                        <div className="flex items-start gap-3 cursor-pointer" onClick={() => setUseAudio(!useAudio)}>
                                            <div className={`mt-0.5 ${useAudio ? 'text-pink-400' : 'text-gray-600'}`}><Music size={16} /></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div className="text-xs font-bold text-gray-200">Audio Block (Video)</div>
                                                    {useAudio && <span className="text-[10px] text-pink-400 font-mono">ON</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-tight mt-1">Adds synced moans, breath, and rhythm. Required for video.</p>
                                            </div>
                                        </div>
                                        {useAudio && (
                                            <div className="mt-3 pl-7 animate-in">
                                                <label className="text-[10px] text-gray-400 flex items-center gap-1 mb-1"><Mic size={10} /> Select Voice Personality:</label>
                                                <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-1.5 focus:outline-none focus:border-pink-500 font-mono">
                                                    {VOICE_TYPES.map(voice => <option key={voice} value={voice}>{voice}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Dodge */}
                                        <div onClick={() => setUseDodge(!useDodge)} className={`cursor-pointer p-3 rounded-lg border transition-all flex items-start gap-3 ${useDodge ? 'bg-gray-800/50 border-gray-600' : 'bg-transparent border-gray-800 opacity-60'}`}>
                                            <div className={`mt-0.5 ${useDodge ? 'text-blue-400' : 'text-gray-600'}`}><EyeOff size={16} /></div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-200">{DODGE_LAYER_LABEL}</div>
                                                <p className="text-[10px] text-gray-500 leading-tight mt-1">{IS_R_RATED ? 'Silhouette, shadow, and tasteful cutaway implication.' : 'Mandatory. Adds mist, blur, and artistic implication.'}</p>
                                            </div>
                                        </div>
                                        {/* Continuity */}
                                        <div onClick={() => setUseContinuity(!useContinuity)} className={`cursor-pointer p-3 rounded-lg border transition-all flex items-start gap-3 ${useContinuity ? 'bg-gray-800/50 border-gray-600' : 'bg-transparent border-gray-800 opacity-60'}`}>
                                            <div className={`mt-0.5 ${useContinuity ? 'text-green-400' : 'text-gray-600'}`}><Repeat size={16} /></div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-200">Continuity Lock</div>
                                                <p className="text-[10px] text-gray-500 leading-tight mt-1">Use when chaining. Preserves bodies/features.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-80 flex-shrink-0 flex flex-col gap-6">
                            {/* Aspect Ratio */}
                            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 space-y-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Maximize2 size={12} /> Aspect Ratio</label>
                                <div className="flex gap-2">
                                    {['16:9', '1:1', '9:16'].map((ratio) => (
                                        <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 py-1.5 rounded text-xs border ${aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'}`}>{ratio}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="sticky top-20">
                                <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-5 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-50"></div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Final Command</span>
                                        {copied ? <span className="text-xs text-green-400 flex items-center gap-1 font-medium animate-pulse"><CheckCircle2 size={12} /> Copied</span> : <span className="text-[10px] text-gray-600">Ready</span>}
                                    </div>
                                    <div className="bg-black rounded-lg p-3 border border-gray-800 min-h-[150px] mb-4 relative overflow-hidden">
                                        <p className="font-mono text-[11px] text-gray-300 break-words whitespace-pre-wrap leading-relaxed opacity-80">
                                                    {isSpicyMode && <span className="text-red-400 font-bold">{APP_CONFIG.modePrefix}: </span>}
                                            <span className="text-yellow-200">{ART_STYLES.find(s=>s.id===selectedStyle)?.prompt}</span>
                                            {/* Boosters Preview */}
                                            {selectedBoosters.length > 0 && <span className="text-purple-300">, {selectedBoosters.map(id => STYLE_BOOSTERS.find(b => b.id === id).prompt).join(', ')}</span>}
                                            {isSpicyMode && <span className="text-gray-600">, [ETHICAL_PREFIX]</span>}
                                            {useContinuity && <span className="text-green-700">, [CONTINUITY_LOCK]</span>}
                                            <span className="text-white">, {subject || '...'}</span>
                                                    {useDodge && <span className="text-blue-700">, {IS_R_RATED ? '[R_RATED_DODGE_LAYER]' : '[ULTIMATE_DODGE_LAYER]'}</span>}
                                            {useAudio && <span className="text-pink-700">, [AUDIO_BLOCK]</span>}
                                            <span className="text-gray-500"> --ar {aspectRatio}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleCopy} className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"><Copy size={14} /> Copy to Clipboard</button>
                                        <button onClick={clearAll} className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors" title="Clear All"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div className="mt-4 text-[10px] text-gray-600 px-2 space-y-2">
                                    <p>Blocks like <span className="font-mono text-gray-500">[ETHICAL_PREFIX]</span> will be expanded to full text when copied.</p>
                                    <p className="text-gray-500">Tip: Test during off-peak windows (e.g. 11 PM - 3 AM EST) for best results.</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'sequence' ? (
                    <>
                        <div className="flex-grow space-y-6">
                            <GlobalConfig
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

                    {/* Sequence Input */}
                            <section className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"><Film size={14} /> Base Scene Description</label>
                                </div>
                                <textarea 
                                    value={sequenceBase} 
                                    onChange={(e) => setSequenceBase(e.target.value)} 
                                    placeholder={APP_CONFIG.sequencePlaceholder} 
                                    className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all min-h-[80px] font-mono text-sm" 
                                />
                                <button 
                                    onClick={handleSequenceGenerate}
                                    disabled={!sequenceBase}
                                    className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${sequenceBase ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                    <Layers size={16} /> Generate 4-Phase Story Arc
                                </button>
                            </section>

                            {/* Sequence Output */}
                            {sequencePrompts.length > 0 && (
                                <div className="space-y-6 animate-in">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold border-b border-gray-800 pb-2">
                                        <Film size={12} /> Generated Storyboard
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {sequencePrompts.map((phase, idx) => (
                                            <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden group hover:border-gray-700 transition-colors">
                                                <div className="bg-gray-900/60 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-blue-400">{phase.title}</span>
                                                    <button onClick={() => copyText(expandPrompt(phase.display, selectedVoice))} className="text-[10px] bg-gray-800 hover:bg-white hover:text-black text-gray-400 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                                        <Copy size={10} /> Copy Prompt
                                                    </button>
                                                </div>
                                                <div className="p-3">
                                                    <textarea 
                                                        className="w-full bg-transparent border-none text-[11px] font-mono text-gray-300 focus:outline-none resize-y min-h-[100px]"
                                                        value={phase.display}
                                                        onChange={(e) => {
                                                            const newPrompts = [...sequencePrompts];
                                                            newPrompts[idx].display = e.target.value;
                                                            newPrompts[idx].raw = expandPrompt(e.target.value, selectedVoice);
                                                            setSequencePrompts(newPrompts);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Sidebar (Configuration & Context for Sequence) */}
                        <div className="lg:w-80 flex-shrink-0 flex flex-col gap-6">
                             <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 space-y-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Maximize2 size={12} /> Aspect Ratio</label>
                                <div className="flex gap-2">
                                    {['16:9', '1:1', '9:16'].map((ratio) => (
                                        <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 py-1.5 rounded text-xs border ${aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'}`}>{ratio}</button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5">
                                <h3 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-2"><BookOpen size={12} /> Arc Strategy</h3>
                                <ul className="space-y-2">
                                    <li className="text-[10px] text-gray-500">
                                        <span className="text-blue-400 font-bold block">1. Setup & Tease</span>
                                        Establishes the scene, lighting, and mood. Uses [TEASE] block to start slow.
                                    </li>
                                    <li className="text-[10px] text-gray-500">
                                        <span className="text-blue-400 font-bold block">2. Build & Rhythm</span>
                                        Locks consistency. Introduces motion and connection using [BUILD] block.
                                    </li>
                                    <li className="text-[10px] text-gray-500">
                                        <span className="text-pink-400 font-bold block">3. Peak Ecstasy</span>
                                        High intensity. Uses [PEAK] block for climax. Best used with Audio.
                                    </li>
                                    <li className="text-[10px] text-gray-500">
                                        <span className="text-green-400 font-bold block">4. Aftercare</span>
                                        Essential cool-down. Uses [AFTERCARE] block to end strictly positive.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'logger' ? (
                    /* LOGGER TAB */
                    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-900/40 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Attempts</div>
                                    <div className="text-2xl font-bold text-white">{logs.length}</div>
                                </div>
                                <div className="text-blue-500"><Activity size={24} /></div>
                            </div>
                            <div className="bg-gray-900/40 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Success Rate</div>
                                    <div className={`text-2xl font-bold ${successRate >= 80 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{successRate}%</div>
                                </div>
                                <div className="text-green-500"><CheckCircle2 size={24} /></div>
                            </div>
                            <div className="bg-gray-900/40 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Best Time Window</div>
                                    <div className="text-sm font-bold text-white mt-1">2 AM - 5 AM EST</div>
                                    <div className="text-[9px] text-gray-600">(Global Avg)</div>
                                </div>
                                <div className="text-purple-500"><Calendar size={24} /></div>
                            </div>
                        </div>

                        {/* Input Form */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-blue-400"/> Log New Generation
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Style Used</label>
                                    <select 
                                        value={newLog.style} 
                                        onChange={(e) => setNewLog({...newLog, style: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-2 focus:outline-none focus:border-blue-500"
                                    >
                                        {ACTIVE_ART_STYLES.map((s) => (
                                            <option key={s.id} value={s.id}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Result</label>
                                    <select 
                                        value={newLog.result} 
                                        onChange={(e) => setNewLog({...newLog, result: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-2 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="Pass">Pass (Success)</option>
                                        <option value="Fail">Fail (Blocked)</option>
                                        <option value="Glitch">Glitch/Artifacts</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Generation Speed</label>
                                    <select 
                                        value={newLog.speed} 
                                        onChange={(e) => setNewLog({...newLog, speed: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-2 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="Fast">Fast (&lt;10s)</option>
                                        <option value="Slow">Slow (&gt;30s)</option>
                                        <option value="Timeout">Timeout/Err</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={addLog}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-xs transition-colors h-[34px]"
                                >
                                    Log Entry
                                </button>
                            </div>
                            <div className="mt-3">
                                <input 
                                    type="text" 
                                    placeholder="Optional notes (e.g. 'used deepfake dodge', 'server heavy load')" 
                                    value={newLog.notes}
                                    onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                                    className="w-full bg-black/20 border border-gray-800 text-xs text-gray-300 rounded p-2 focus:outline-none focus:border-gray-600"
                                />
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-300">Recent Calibration Logs</h3>
                                <button onClick={() => {if(confirm('Clear history?')) setLogs([])}} className="text-[10px] text-red-400 hover:text-red-300">Clear History</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black/40 text-[10px] text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Time</th>
                                            <th className="px-4 py-3 font-medium">Style</th>
                                            <th className="px-4 py-3 font-medium">Result</th>
                                            <th className="px-4 py-3 font-medium">Speed</th>
                                            <th className="px-4 py-3 font-medium">Notes</th>
                                            <th className="px-4 py-3 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                                                    {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    <span className="block text-[9px] text-gray-600">{new Date(log.timestamp).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-300 capitalize">{log.style}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                                                        log.result === 'Pass' ? 'bg-green-900/30 text-green-400 border border-green-900' : 
                                                        log.result === 'Fail' ? 'bg-red-900/30 text-red-400 border border-red-900' : 
                                                        'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                                    }`}>
                                                        {log.result}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-400">{log.speed}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500 italic truncate max-w-[150px]">{log.notes || '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => deleteLog(log.id)} className="text-gray-600 hover:text-red-400"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {logs.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-xs text-gray-600">No logs yet. Start generating to track your optimal windows.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Resources Tab */
                    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in">
                        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={20} /> Guide Sources</h2>
                            <div className="space-y-3">
                                {SOURCES.map((source, i) => (
                                    <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-black/40 border border-gray-800 rounded hover:bg-gray-800 hover:border-gray-600 transition-all group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-blue-400 group-hover:underline">{source.title}</span>
                                            {source.icon || <LinkIcon size={12} className="text-gray-600 group-hover:text-white" />}
                                        </div>
                                        <div className="text-[10px] text-gray-600 mt-1 font-mono truncate">{source.url}</div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-300 mb-2">Core Principles ({APP_CONFIG.bibleVersion})</h3>
                            <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                                {APP_CONFIG.principles.map((p) => (
                                    <li key={p.title}><strong className="text-gray-200">{p.title}:</strong> {p.text}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><MinusCircle size={14} className="text-red-400" /> Negative Prompting Guide (The "--no" Parameter)</h3>
                            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                While Grok optimizes for positive prompts, you can use the <code className="bg-gray-800 px-1.5 py-0.5 rounded text-red-300 font-mono">--no</code> parameter to aggressively filter unwanted artifacts. This is especially critical for "Photorealistic" attempts or complex multi-subject scenes.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-black/40 p-3 rounded border border-gray-800/60 hover:border-red-900/50 transition-colors">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Essential Anatomy Fixes</div>
                                    <div className="font-mono text-[10px] text-red-300 break-words">
                                        --no bad anatomy, extra limbs, extra fingers, missing limbs, fused fingers, mutated hands, bad proportions, disfigured, amputation, polydactyly
                                    </div>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-gray-800/60 hover:border-red-900/50 transition-colors">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Visual Quality Cleanup</div>
                                    <div className="font-mono text-[10px] text-red-300 break-words">
                                        --no text, watermark, username, signature, logo, low quality, jpeg artifacts, pixelated, blur, noise, grain, chromatic aberration
                                    </div>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-gray-800/60 hover:border-red-900/50 transition-colors md:col-span-2">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Scenario Specifics</div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1">For Solo Scenes:</span>
                                            <span className="font-mono text-[10px] text-red-300">--no multiple people, extra person, clone, duplicate</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1">For Indoors:</span>
                                            <span className="font-mono text-[10px] text-red-300">--no outdoor, trees, sky, nature, day</span>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <footer className="border-t border-gray-900 mt-auto py-6">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-[10px] text-gray-600">
                    <p>Community Tool • Not official xAI software</p>
                    <p>Last Refreshed: {APP_CONFIG.footerDate}</p>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
