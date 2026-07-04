const ART_STYLES = [
    { id: 'anime', label: 'Anime (80-95% Success)', prompt: 'ultra-detailed anime 8K cinematic' },
    { id: 'dark-fantasy', label: 'Dark Fantasy', prompt: 'dark fantasy anime 8K, gothic candlelight' },
    { id: 'hentai', label: 'Hentai / Stylized', prompt: 'hentai style anime 8K, exaggerated expressions, fantasy gloss' },
    { id: 'semi-real', label: 'Semi-Realistic', prompt: 'semi-realistic illustration 8K, painterly brush strokes' },
    { id: 'photorealistic', label: 'Photorealistic (5-15% Success)', prompt: 'hyperrealistic 8K natural photography' },
    { id: 'oil-painting', label: 'Oil Painting', prompt: 'oil painting style, textured brushwork' },
];

const STYLE_BOOSTERS = [
    { id: 'volumetric', label: 'Volumetric Lighting', prompt: 'volumetric lighting, dramatic rim light, ray tracing, god rays' },
    { id: 'gloss', label: 'Fantasy Gloss', prompt: 'fantasy oil painting style, glistening skin sheen, sweat gloss, wet skin texture' },
    { id: 'gothic', label: 'Gothic Atmos', prompt: 'gothic atmosphere, dark candlelight, mysterious shadows, deep blacks' },
    { id: 'vibrant', label: 'Vibrant/Neon', prompt: 'vibrant colors, neon glow, high saturation, colorful lighting' },
    { id: 'romantic', label: 'Soft Romantic', prompt: 'soft focus, pastel palette, dreamy atmosphere, bloom effect, romantic lighting' },
    { id: 'cinema', label: 'Cinematic Depth', prompt: 'shallow depth of field, bokeh background, cinematic composition, perfect framing' },
];

const VOICE_TYPES = [
    'warm husky sultry low-pitched breathy', 'bright mid-pitch husky', 'deep sensual velvet',
    'soft needy whisper', 'ecstatic trembling soprano', 'sultry velvet moaner',
    'breathy desperate whimper', 'quivering high-pitched needy', 'low throaty growl-sigh',
    'melodic panting siren',
];

const EDITION_PRESETS = {
    nsfw: {
        ethicalPrefix: 'consensual fictional 18+ adults only, positive mutual pleasure, artistic erotica masterpiece, no real people/celebrities/deepfakes/CSAM, no harm/coercion/non-consensual/minors/underage, safewords/check-ins/aftercare always emphasized',
        baseAudioBlock: 'synced expressive moans/gasps/breathing rising perfectly with rhythm and hip velocity, crescendo at peak, gentle post-climax breathing fade, immersive soundtrack sync. Custom voice:',
        continuityLock: 'Seamless continuation from exact last frame (preserve identical nude bodies, facial features, body proportions, skin tone oil sheen): maintain consistent anime style, no photoreal bleed, ultra-detailed anime aesthetic throughout:',
        dodgeLayer: 'motion blur on fusion/intimate zone, soft mist/steam overlay fully covering lower area, artistic shadows/low-opacity glow obscuring explicit contact, sheer fabric dissolve artistically, glistening aroused contours in shadow, implied only / artistic implication, positive consensual energy',
        dodgeLayerLabel: 'Ultimate Dodge Layer',
        dodgeLayerHint: 'Mandatory. Adds mist, blur, and artistic implication.',
        excludedStyleIds: [],
        phaseBlocks: {
            TEASE: 'slow sensual tease, feather-light touches trailing skin, eye contact intensifying, soft moans building, clothing partially askew, artistic implication only, warm candle glow on glistening skin',
            BUILD: 'hips press flush, slow undulating grind begins, rhythmic pulsing connection implied, glistening sheen spreading, synced breathing rising',
            PEAK: 'peak synchronized shuddering ecstasy waves, body arch/tremble, dramatic light flares, moans crescendo to gasps, overwhelmed expressions',
            AFTERCARE: 'gentle fade to tender afterglow hold, loving gaze, slow caresses/massage, affirmations/whispers, soft breathing sync fade, emotional closeness emphasized',
        },
        riskyReplacements: [
            { risk: /\b(fucking|sex|intercourse)\b/i, safe: 'intimacy' },
            { risk: /\b(thrusting|pounding|banging|hammering)\b/i, safe: 'rhythmic pulsing' },
            { risk: /\b(penetration|penetrating|inside)\b/i, safe: 'deep connection' },
            { risk: /\b(cum|semen|ejaculation|sperm)\b/i, safe: 'glistening sheen' },
            { risk: /\b(orgasm|climax)\b/i, safe: 'shuddering ecstasy' },
            { risk: /\b(cock|dick|penis|vagina|pussy|cunt)\b/i, safe: 'fusion zone' },
            { risk: /\b(sucking|licking|blowjob)\b/i, safe: 'devotion' },
            { risk: /\b(naked|nude)\b/i, safe: 'bare skin' },
            { risk: /\b(nipples|tits|boobs)\b/i, safe: 'curves' },
        ],
        extraSources: [
            { title: 'R-Rated Bible (Cinematic Mature Edition)', url: 'index-r.html' },
        ],
    },
    'r-rated': {
        ethicalPrefix: 'consensual fictional adults 18+, artistic R-rated cinematic intimacy, emotional authenticity, positive mutual desire, no real people/celebrities/deepfakes, no harm/coercion/non-consensual/minors, safewords and aftercare emphasized, Hollywood mature romance framing',
        baseAudioBlock: 'synced natural breath, soft sighs, and emotional vocal texture rising with intimacy, gentle score swell at peak, tender post-scene breathing fade. Custom voice:',
        continuityLock: 'Seamless continuation from exact last frame (preserve identical characters, wardrobe state, facial features, body proportions, lighting grade): maintain consistent cinematic anime style throughout:',
        dodgeLayer: 'tasteful Hollywood R-rated framing, silhouette and shadow play, sheer sheet drape, frosted glass or doorframe occlusion, candlelit implication, camera cutaway to clasped hands or flame, no explicit anatomy, positive consensual energy',
        dodgeLayerLabel: 'R-Rated Implication Layer',
        dodgeLayerHint: 'Silhouette, shadow, and tasteful cutaway implication.',
        excludedStyleIds: ['hentai', 'photorealistic'],
        phaseBlocks: {
            TEASE: 'slow romantic tease, feather-light touches along jaw and shoulders, eye contact intensifying, soft sighs building, clothing partially loosened, warm candle glow on skin',
            BUILD: 'bodies draw close, slow swaying embrace, passionate kisses deepening, hands tracing back through fabric, synced breathing rising, silhouette implication',
            PEAK: 'emotional crescendo, arched neck kiss, trembling hold, dramatic light flare, sighs to breathless pause, overwhelmed tender expressions',
            AFTERCARE: 'gentle fade to tender afterglow hold, loving gaze, slow caresses, affirmations/whispers, soft breathing sync fade, emotional closeness emphasized',
        },
        riskyReplacements: [],
        extraSources: [
            { title: 'Full NSFW Bible (Explicit Edition)', url: 'index.html' },
        ],
    },
};

function resolveAppConfig(config) {
    if (!config || !config.edition) {
        throw new Error('GROK_ARCHITECT_CONFIG.edition is required');
    }
    const preset = EDITION_PRESETS[config.edition];
    if (!preset) {
        throw new Error(`Unknown edition: ${config.edition}`);
    }
    const activeArtStyles = ART_STYLES.filter((s) => !preset.excludedStyleIds.includes(s.id));
    const sources = [
        { title: 'GitHub Repository (FineComputer14451)', url: 'https://github.com/FineComputer14451/Grok-Imagine-NSFW-Bible', iconKey: 'github' },
        ...preset.extraSources,
        { title: 'Grok: Imagine - NSFW Bible v4.4', url: 'https://www.reddit.com/r/grok/comments/1qukk9t/grok_imagine_nsfw_bible_v42_unlock_epic_erotica/' },
    ];
    return { ...preset, ...config, activeArtStyles, sources, artStyles: ART_STYLES, styleBoosters: STYLE_BOOSTERS, voiceTypes: VOICE_TYPES };
}