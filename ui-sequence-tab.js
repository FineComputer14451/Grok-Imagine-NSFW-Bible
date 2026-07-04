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
