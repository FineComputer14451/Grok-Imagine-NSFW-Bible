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