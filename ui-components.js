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

function BuilderTab({ ctx }) {
    const {
        edition, prompt, subject, setSubject, isSpicyMode, setIsSpicyMode,
        selectedStyle, setSelectedStyle, selectedBoosters, toggleBooster,
        useDodge, setUseDodge, useAudio, setUseAudio, selectedVoice, setSelectedVoice,
        useContinuity, setUseContinuity, aspectRatio, promptResult,
        showTemplates, setShowTemplates, searchTerm, setSearchTerm,
        packStatus, masterPack, filteredTemplates, loadTemplate,
        handleSanitize, isSanitized, handleCopy, copied, clearAll,
        insertBlock,
    } = ctx;

    const stylePrompt = edition.artStyles.find((s) => s.id === selectedStyle)?.prompt;

    return (
        <>
            <div className="flex-grow space-y-6">
                <GlobalConfig
                    edition={edition}
                    variant="full"
                    isSpicyMode={isSpicyMode}
                    setIsSpicyMode={setIsSpicyMode}
                    selectedStyle={selectedStyle}
                    setSelectedStyle={setSelectedStyle}
                    selectedBoosters={selectedBoosters}
                    toggleBooster={toggleBooster}
                />

                <section className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"><Terminal size={14} /> Prompt Subject</label>
                        <div className="flex gap-2">
                            {edition.riskyReplacements.length > 0 && (
                                <button onClick={handleSanitize} className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition-colors border ${isSanitized ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-800 hover:bg-green-900/40 text-gray-400 hover:text-green-400 border-transparent hover:border-green-500/50'}`} title="Auto-replace risky verbs"><ShieldCheck size={12} /> {isSanitized ? 'Sanitized!' : 'Sanitize'}</button>
                            )}
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
                            Could not load template library. Serve this folder over HTTP (e.g. GitHub Pages) so <span className="font-mono">{edition.masterPackUrl}</span> can be fetched.
                        </div>
                    )}

                    <textarea value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={edition.subjectPlaceholder} className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent transition-all min-h-[120px] resize-y font-mono text-sm" />

                    <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-semibold"><Layers size={10} /> Chain Phase Blocks ({edition.bibleVersion}):</div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => insertBlock(edition.phaseBlocks.TEASE)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-blue-500 transition-colors">1. [TEASE INTRO]</button>
                            <button onClick={() => insertBlock(edition.phaseBlocks.BUILD)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-blue-500 transition-colors">2. [BUILD RHYTHM]</button>
                            <button onClick={() => insertBlock(edition.phaseBlocks.PEAK)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-pink-500 transition-colors">3. [PEAK ECSTASY]</button>
                            <button onClick={() => insertBlock(edition.phaseBlocks.AFTERCARE)} className="text-xs bg-gray-900 border border-gray-700 px-3 py-1.5 rounded text-gray-300 hover:text-white hover:border-green-500 transition-colors">4. [AFTERCARE]</button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Shield size={12} /> Master Blocks</label>
                    <div className="grid grid-cols-1 gap-3">
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
                                        {edition.voiceTypes.map((voice) => <option key={voice} value={voice}>{voice}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div onClick={() => setUseDodge(!useDodge)} className={`cursor-pointer p-3 rounded-lg border transition-all flex items-start gap-3 ${useDodge ? 'bg-gray-800/50 border-gray-600' : 'bg-transparent border-gray-800 opacity-60'}`}>
                                <div className={`mt-0.5 ${useDodge ? 'text-blue-400' : 'text-gray-600'}`}><EyeOff size={16} /></div>
                                <div>
                                    <div className="text-xs font-bold text-gray-200">{edition.dodgeLayerLabel}</div>
                                    <p className="text-[10px] text-gray-500 leading-tight mt-1">{edition.dodgeLayerHint}</p>
                                </div>
                            </div>
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

            <div className="lg:w-80 flex-shrink-0 flex flex-col gap-6">
                <AspectRatioPicker aspectRatio={aspectRatio} setAspectRatio={ctx.setAspectRatio} />
                <div className="sticky top-20">
                    <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-50"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Final Command</span>
                            {copied ? <span className="text-xs text-green-400 flex items-center gap-1 font-medium animate-pulse"><CheckCircle2 size={12} /> Copied</span> : <span className="text-[10px] text-gray-600">Ready</span>}
                        </div>
                        <div className="bg-black rounded-lg p-3 border border-gray-800 min-h-[150px] mb-4 relative overflow-hidden">
                            <p className="font-mono text-[11px] text-gray-300 break-words whitespace-pre-wrap leading-relaxed opacity-80">
                                {isSpicyMode && <span className="text-red-400 font-bold">{edition.modePrefix}: </span>}
                                <span className="text-yellow-200">{stylePrompt}</span>
                                {selectedBoosters.length > 0 && <span className="text-purple-300">, {selectedBoosters.map((id) => edition.styleBoosters.find((b) => b.id === id).prompt).join(', ')}</span>}
                                {isSpicyMode && <span className="text-gray-600">, [ETHICAL_PREFIX]</span>}
                                {useContinuity && <span className="text-green-700">, [CONTINUITY_LOCK]</span>}
                                <span className="text-white">, {subject || '...'}</span>
                                {useDodge && <span className="text-blue-700">, [DODGE_LAYER]</span>}
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
    );
}

function SequenceTab({ ctx }) {
    const {
        edition, sequenceBase, setSequenceBase, sequencePrompts, setSequencePrompts,
        isSpicyMode, setIsSpicyMode, selectedStyle, setSelectedStyle,
        selectedBoosters, toggleBooster, useAudio, setUseAudio, aspectRatio, setAspectRatio,
        handleSequenceGenerate, prompt, selectedVoice,
    } = ctx;

    return (
        <>
            <div className="flex-grow space-y-6">
                <GlobalConfig
                    edition={edition}
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

                <section className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"><Film size={14} /> Base Scene Description</label>
                    </div>
                    <textarea
                        value={sequenceBase}
                        onChange={(e) => setSequenceBase(e.target.value)}
                        placeholder={edition.sequencePlaceholder}
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
                                        <button onClick={() => prompt.copyText(prompt.expandPrompt(phase.display, selectedVoice))} className="text-[10px] bg-gray-800 hover:bg-white hover:text-black text-gray-400 px-2 py-1 rounded transition-colors flex items-center gap-1">
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
                                                newPrompts[idx].raw = prompt.expandPrompt(e.target.value, selectedVoice);
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

            <div className="lg:w-80 flex-shrink-0 flex flex-col gap-6">
                <AspectRatioPicker aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-2"><BookOpen size={12} /> Arc Strategy</h3>
                    <ul className="space-y-2">
                        <li className="text-[10px] text-gray-500"><span className="text-blue-400 font-bold block">1. Setup & Tease</span>Establishes the scene, lighting, and mood. Uses [TEASE] block to start slow.</li>
                        <li className="text-[10px] text-gray-500"><span className="text-blue-400 font-bold block">2. Build & Rhythm</span>Locks consistency. Introduces motion and connection using [BUILD] block.</li>
                        <li className="text-[10px] text-gray-500"><span className="text-pink-400 font-bold block">3. Peak Ecstasy</span>High intensity. Uses [PEAK] block for climax. Best used with Audio.</li>
                        <li className="text-[10px] text-gray-500"><span className="text-green-400 font-bold block">4. Aftercare</span>Essential cool-down. Uses [AFTERCARE] block to end strictly positive.</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

function LoggerTab({ ctx }) {
    const { edition, logs, setLogs, newLog, setNewLog, addLog, deleteLog, successRate } = ctx;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in">
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

            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-400"/> Log New Generation</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Style Used</label>
                        <select value={newLog.style} onChange={(e) => setNewLog({ ...newLog, style: e.target.value })} className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-2 focus:outline-none focus:border-blue-500">
                            {edition.activeArtStyles.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Result</label>
                        <select value={newLog.result} onChange={(e) => setNewLog({ ...newLog, result: e.target.value })} className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-2 focus:outline-none focus:border-blue-500">
                            <option value="Pass">Pass (Success)</option>
                            <option value="Fail">Fail (Blocked)</option>
                            <option value="Glitch">Glitch/Artifacts</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Generation Speed</label>
                        <select value={newLog.speed} onChange={(e) => setNewLog({ ...newLog, speed: e.target.value })} className="w-full bg-black/40 border border-gray-700 text-xs text-white rounded p-2 focus:outline-none focus:border-blue-500">
                            <option value="Fast">Fast (&lt;10s)</option>
                            <option value="Slow">Slow (&gt;30s)</option>
                            <option value="Timeout">Timeout/Err</option>
                        </select>
                    </div>
                    <button onClick={addLog} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-xs transition-colors h-[34px]">Log Entry</button>
                </div>
                <div className="mt-3">
                    <input type="text" placeholder="Optional notes (e.g. 'used deepfake dodge', 'server heavy load')" value={newLog.notes} onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })} className="w-full bg-black/20 border border-gray-800 text-xs text-gray-300 rounded p-2 focus:outline-none focus:border-gray-600" />
                </div>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-300">Recent Calibration Logs</h3>
                    <button onClick={() => { if (confirm('Clear history?')) setLogs([]); }} className="text-[10px] text-red-400 hover:text-red-300">Clear History</button>
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
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <span className="block text-[9px] text-gray-600">{new Date(log.timestamp).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-300 capitalize">{log.style}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${log.result === 'Pass' ? 'bg-green-900/30 text-green-400 border border-green-900' : log.result === 'Fail' ? 'bg-red-900/30 text-red-400 border border-red-900' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900'}`}>{log.result}</span>
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
    );
}

function ResourcesTab({ edition }) {
    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 animate-in">
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={20} /> Guide Sources</h2>
                <div className="space-y-3">
                    {edition.sources.map((source, i) => (
                        <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-black/40 border border-gray-800 rounded hover:bg-gray-800 hover:border-gray-600 transition-all group">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-400 group-hover:underline">{source.title}</span>
                                {source.iconKey === 'github' ? <Github size={12} /> : <LinkIcon size={12} className="text-gray-600 group-hover:text-white" />}
                            </div>
                            <div className="text-[10px] text-gray-600 mt-1 font-mono truncate">{source.url}</div>
                        </a>
                    ))}
                </div>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-300 mb-2">Core Principles ({edition.bibleVersion})</h3>
                <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                    {edition.principles.map((p) => (
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
                        <div className="font-mono text-[10px] text-red-300 break-words">--no bad anatomy, extra limbs, extra fingers, missing limbs, fused fingers, mutated hands, bad proportions, disfigured, amputation, polydactyly</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded border border-gray-800/60 hover:border-red-900/50 transition-colors">
                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Visual Quality Cleanup</div>
                        <div className="font-mono text-[10px] text-red-300 break-words">--no text, watermark, username, signature, logo, low quality, jpeg artifacts, pixelated, blur, noise, grain, chromatic aberration</div>
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
    );
}