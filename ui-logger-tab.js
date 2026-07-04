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
