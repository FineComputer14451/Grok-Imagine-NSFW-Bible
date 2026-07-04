function GlobalConfig({
    edition,
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
            {isCompact ? (isSpicyMode ? 'Enabled' : 'Disabled') : `${edition.modeLabel}: ${isSpicyMode ? 'ON' : 'OFF'}`}
        </button>
    );

    const boosters = isCompact ? (
        <div className="flex flex-wrap gap-2">
            {edition.styleBoosters.map((booster) => {
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
            {edition.styleBoosters.map((booster) => {
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
                        <label className="block text-[10px] text-gray-500 mb-1">{edition.modeLabel}</label>
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
                            {edition.activeArtStyles.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
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
                            {edition.activeArtStyles.map((style) => (
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

function AspectRatioPicker({ aspectRatio, setAspectRatio }) {
    return (
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 space-y-4">
            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Maximize2 size={12} /> Aspect Ratio</label>
            <div className="flex gap-2">
                {['16:9', '1:1', '9:16'].map((ratio) => (
                    <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 py-1.5 rounded text-xs border ${aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'}`}>{ratio}</button>
                ))}
            </div>
        </div>
    );
}
