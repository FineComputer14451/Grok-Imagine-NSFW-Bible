const { useState, useMemo, useEffect } = React;

const TAB_COMPONENTS = {
    builder: BuilderTab,
    sequence: SequenceTab,
    logger: LoggerTab,
    resources: ResourcesTab,
};

function App({ edition }) {
    const prompt = useMemo(() => createPromptEngine(edition), [edition]);

    const [subject, setSubject] = useState('');
    const [isSpicyMode, setIsSpicyMode] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState('anime');
    const [selectedBoosters, setSelectedBoosters] = useState([]);
    const [useDodge, setUseDodge] = useState(true);
    const [useAudio, setUseAudio] = useState(true);
    const [selectedVoice, setSelectedVoice] = useState(edition.voiceTypes[0]);
    const [useContinuity, setUseContinuity] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [activeTab, setActiveTab] = useState('builder');
    const [copied, setCopied] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSanitized, setIsSanitized] = useState(false);
    const [masterPack, setMasterPack] = useState([]);
    const [packStatus, setPackStatus] = useState('loading');

    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('grok_logs');
        return saved ? JSON.parse(saved) : [];
    });
    const [newLog, setNewLog] = useState({ style: 'anime', result: 'Pass', speed: 'Fast', notes: '' });

    const [sequenceBase, setSequenceBase] = useState('');
    const [sequencePrompts, setSequencePrompts] = useState([]);

    useEffect(() => {
        localStorage.setItem('grok_logs', JSON.stringify(logs));
    }, [logs]);

    useEffect(() => {
        let cancelled = false;
        fetch(edition.masterPackUrl)
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
    }, [edition.masterPackUrl]);

    const insertBlock = (text) => {
        setSubject((prev) => prev + (prev ? ' ' : '') + text);
    };

    const toggleBooster = (id) => {
        setSelectedBoosters((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    };

    const loadTemplate = (t) => {
        const b = t.builder || {};
        const validStyles = edition.activeArtStyles.map((s) => s.id);
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
        const { text, changed } = prompt.sanitizeText(subject);
        if (changed) {
            setSubject(text);
            setIsSanitized(true);
            setTimeout(() => setIsSanitized(false), 2000);
        }
    };

    const addLog = () => {
        const entry = { id: Date.now(), timestamp: new Date().toISOString(), ...newLog };
        setLogs([entry, ...logs]);
        setNewLog({ ...newLog, notes: '' });
    };

    const deleteLog = (id) => {
        setLogs(logs.filter((l) => l.id !== id));
    };

    const successRate = useMemo(() => {
        if (logs.length === 0) return 0;
        const wins = logs.filter((l) => l.result === 'Pass').length;
        return Math.round((wins / logs.length) * 100);
    }, [logs]);

    const filteredTemplates = useMemo(() => {
        return masterPack.filter((t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.prompt.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, masterPack]);

    const promptResult = useMemo(() => {
        const parts = prompt.buildPromptParts({
            styleId: selectedStyle,
            boosterIds: selectedBoosters,
            isSpicyMode,
            useContinuity,
            subject,
            useDodge,
            useAudio,
        });
        return prompt.toPrompt(parts, { isSpicyMode, aspectRatio, voice: selectedVoice });
    }, [prompt, selectedStyle, selectedBoosters, isSpicyMode, useContinuity, subject, useDodge, useAudio, aspectRatio, selectedVoice]);

    const handleSequenceGenerate = () => {
        const stylePrompt = edition.artStyles.find((s) => s.id === selectedStyle)?.prompt || 'anime 8K';
        const boosterPrompts = selectedBoosters
            .map((bId) => edition.styleBoosters.find((b) => b.id === bId)?.prompt)
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
            if (!isLast && useDodge) parts.push('[DODGE_LAYER]');
            if (useAudio) parts.push('[AUDIO_BLOCK]');
            return prompt.toPrompt(parts, {
                isSpicyMode: isFirst && isSpicyMode,
                aspectRatio: isFirst ? aspectRatio : null,
                voice: selectedVoice,
            });
        };

        setSequencePrompts([
            { title: 'Phase 1: Setup & Tease', ...createPhase(`${sequenceBase}. ${edition.phaseBlocks.TEASE}`, { isFirst: true, isLast: false }) },
            { title: 'Phase 2: Build & Rhythm', ...createPhase(`Intensify action: ${sequenceBase}, ${edition.phaseBlocks.BUILD}`, { isFirst: false, isLast: false }) },
            { title: 'Phase 3: Peak Ecstasy', ...createPhase(`Climax phase: ${edition.phaseBlocks.PEAK}`, { isFirst: false, isLast: false }) },
            { title: 'Phase 4: Aftercare Fade', ...createPhase(`Aftercare: ${edition.phaseBlocks.AFTERCARE}`, { isFirst: false, isLast: true }) },
        ]);
    };

    const handleCopy = () => {
        prompt.copyText(promptResult.raw, () => {
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

    const ctx = {
        edition,
        prompt,
        subject, setSubject,
        isSpicyMode, setIsSpicyMode,
        selectedStyle, setSelectedStyle,
        selectedBoosters, toggleBooster,
        useDodge, setUseDodge,
        useAudio, setUseAudio,
        selectedVoice, setSelectedVoice,
        useContinuity, setUseContinuity,
        aspectRatio, setAspectRatio,
        activeTab, setActiveTab,
        copied, setCopied,
        showTemplates, setShowTemplates,
        searchTerm, setSearchTerm,
        isSanitized, setIsSanitized,
        masterPack, packStatus, filteredTemplates,
        loadTemplate, handleSanitize, handleCopy, clearAll, insertBlock,
        promptResult,
        sequenceBase, setSequenceBase,
        sequencePrompts, setSequencePrompts,
        handleSequenceGenerate,
        logs, setLogs, newLog, setNewLog,
        addLog, deleteLog, successRate,
    };

    const ActiveTab = TAB_COMPONENTS[activeTab] || BuilderTab;

    return (
        <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans">
            <header className="border-b border-gray-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-sm font-bold text-xl font-mono">/</div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white leading-none">{edition.title}</h1>
                            <span className="text-[10px] text-gray-500 font-mono">{edition.versionLabel}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {edition.alternateEdition && (
                            <a href={edition.alternateEdition.href} className="hidden sm:inline text-[10px] px-2 py-1 rounded border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                                {edition.alternateEdition.label}
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
                {activeTab === 'resources' || activeTab === 'logger'
                    ? <ActiveTab ctx={ctx} edition={edition} />
                    : <ActiveTab ctx={ctx} />}
            </main>

            <footer className="border-t border-gray-900 mt-auto py-6">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-[10px] text-gray-600">
                    <p>Community Tool • Not official xAI software</p>
                    <p>Last Refreshed: {edition.footerDate}</p>
                </div>
            </footer>
        </div>
    );
}

function AppRoot() {
    const [edition, setEdition] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const promise = window.GROK_ARCHITECT_CONFIG_PROMISE || Promise.resolve(window.GROK_ARCHITECT_CONFIG);
        promise
            .then((cfg) => {
                window.GROK_ARCHITECT_CONFIG = cfg;
                setEdition(resolveAppConfig(cfg));
            })
            .catch((err) => setError(err.message || String(err)));
    }, []);

    if (error) {
        return <div className="min-h-screen bg-black text-red-400 flex items-center justify-center p-8 text-sm">{error}</div>;
    }
    if (!edition) {
        return <div className="min-h-screen bg-black text-gray-500 flex items-center justify-center text-sm">Loading…</div>;
    }
    return <App edition={edition} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppRoot />);