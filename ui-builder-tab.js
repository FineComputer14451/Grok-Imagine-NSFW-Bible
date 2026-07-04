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
