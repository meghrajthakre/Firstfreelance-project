import { useState } from "react";
import { C, RUNNERS_INIT, SESSIONS_INIT, MANAGEMENT_INIT } from "../constants";

const BET_LOCK_OPTIONS = ["Unlock", "Lock"];
const MODE_OPTIONS = ["Select Mode", "Auto", "Manual"];
const SESSION_LOCK_OPTS = ["Select Type", "Lock All", "Unlock All"];
const RATE_DIFF_OPTS = ["Select Rate Diff", "1", "2", "3", "4", "5"];

export default function ManualPage({ onClose, match }) {
    const [runners, setRunners] = useState(RUNNERS_INIT.map(r => ({ 
        ...r, 
        manualLagai: r.lagai, 
        manualKhai: r.khai, 
        diff: 1 
    })));
    const [sessions, setSessions] = useState(SESSIONS_INIT);
    const [management, setManagement] = useState(MANAGEMENT_INIT);
    const [betLock, setBetLock] = useState("Unlock");
    const [mode, setMode] = useState("Select Mode");
    const [sessionLock, setSessionLock] = useState("Select Type");
    const [rateDiff, setRateDiff] = useState("Select Rate Diff");

    const toggleRunnerStatus = (i) =>
        setRunners(r => r.map((x, idx) =>
            idx === i ? { ...x, status: x.status === "open" ? "suspend" : "open" } : x
        ));

    // Update manual Lagai with range 1-97
    const updateManualLagai = (i, value) => {
        let num = parseInt(value) || 1;
        num = Math.min(97, Math.max(1, num));
        setRunners(r => r.map((x, idx) => idx === i ? { ...x, manualLagai: num } : x));
    };

    // Update manual Khai with range 1-97
    const updateManualKhai = (i, value) => {
        let num = parseInt(value) || 1;
        num = Math.min(97, Math.max(1, num));
        setRunners(r => r.map((x, idx) => idx === i ? { ...x, manualKhai: num } : x));
    };

    // Update diff value (range 1-97)
    const updateDiff = (i, value) => {
        let num = parseInt(value) || 1;
        num = Math.min(97, Math.max(1, num));
        setRunners(r => r.map((x, idx) => idx === i ? { ...x, diff: num } : x));
    };

    // Apply diff to Lagai
    const applyDiffToLagai = (i) => {
        setRunners(r => r.map((x, idx) => {
            if (idx !== i) return x;
            let newVal = x.manualLagai + x.diff;
            newVal = Math.min(97, Math.max(1, newVal));
            return { ...x, manualLagai: newVal };
        }));
    };

    // Apply diff to Khai
    const applyDiffToKhai = (i) => {
        setRunners(r => r.map((x, idx) => {
            if (idx !== i) return x;
            let newVal = x.manualKhai + x.diff;
            newVal = Math.min(97, Math.max(1, newVal));
            return { ...x, manualKhai: newVal };
        }));
    };

    // Apply diff to both
    const applyDiffToBoth = (i) => {
        setRunners(r => r.map((x, idx) => {
            if (idx !== i) return x;
            let newLagai = x.manualLagai + x.diff;
            let newKhai = x.manualKhai + x.diff;
            newLagai = Math.min(97, Math.max(1, newLagai));
            newKhai = Math.min(97, Math.max(1, newKhai));
            return { ...x, manualLagai: newLagai, manualKhai: newKhai };
        }));
    };

    // Reset odds to original
    const resetOdds = (i) => {
        setRunners(r => r.map((x, idx) => idx === i ? { 
            ...x, 
            manualLagai: x.lagai, 
            manualKhai: x.khai,
            diff: 1
        } : x));
    };

    const toggleSession = (i) =>
        setSessions(s => s.map((x, idx) =>
            idx === i ? { ...x, suspended: !x.suspended } : x
        ));

    const toggleVisible = (i) =>
        setManagement(m => m.map((x, idx) =>
            idx === i ? { ...x, visible: !x.visible, status: !x.visible ? "Showing" : "Not" } : x
        ));

    const deleteItem = (i) =>
        setManagement(m => m.filter((_, idx) => idx !== i));

    const handleManual = () => {
        window.location.href = `/support/matches/${match?.id || 1}/manual`;
    }

    const handleClose = () => {
        window.location.href = `/support/matches/${match?.id || 1}/play`;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-4 px-3 font-sans text-sm">
            <div className="max-w-7xl mx-auto">

                {/* Header with Start Manual button */}
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClose}
                            className="text-gray-600 hover:text-gray-800 font-semibold px-3 py-2 rounded-lg bg-white shadow-sm"
                        >
                            ← Back
                        </button>
                        <h1 className="text-xl font-bold text-gray-700">Manual Control — Odds Adjustment</h1>
                    </div>
                    <button
                        className="group text-white text-lg cursor-pointer font-bold px-6 py-2.5 rounded-lg 
                           transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95
                           shadow-md relative overflow-hidden"
                        style={{ background: C.startManual || "#3b82f6" }}
                        onClick={handleManual}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Start Manual
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Match Info Banner */}
                <div className="bg-white rounded-lg shadow-sm mb-4 p-3 flex flex-wrap justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800">🏏 {match?.homeTeam || "England W"} vs {match?.awayTeam || "Sri Lanka W"}</span>
                        <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">{match?.centerScore || "142/3"} ({match?.overs || "18.2"})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <span>🌡️ 35°C</span>
                        <span>☁️ Mostly cloudy</span>
                    </div>
                </div>

                {/* Info Banner for Manual Mode */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded-r text-sm text-blue-800">
                    ⚡ Manual Mode Active | Odds Range: <strong>1 to 97</strong> | Diff Range: <strong>1 to 97</strong> | Use +Diff buttons to increment odds
                </div>

                {/* Runner Table with Manual Odds Inputs */}
                <div className="rounded-xl overflow-hidden shadow-lg mb-6 bg-white border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="py-3 px-3 text-white text-left font-bold text-xs uppercase" style={{ background: C.headerBg || "#1e293b", width: "18%" }}>RUNNER</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: C.laGaiBg || "#fef9c3", color: "#854d0e", width: "18%" }}>LAGAI (Manual)</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: C.khaiBg || "#fee2e2", color: "#991b1b", width: "18%" }}>KHAI (Manual)</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: "#e2e8f0", color: "#334155", width: "12%" }}>DIFF (1-97)</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: "#f1f5f9", color: "#334155", width: "22%" }}>Diff Actions</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: "#e2e8f0", color: "#334155", width: "12%" }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {runners.map((r, i) => (
                                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                    <td className="py-3 px-3 font-bold text-gray-800">{r.name}</td>
                                    
                                    {/* Manual Lagai Input */}
                                    <td className="py-2 px-2 text-center" style={{ background: C.laGaiCell ? `${C.laGaiCell}20` : "#fefce8" }}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="97"
                                            value={r.manualLagai}
                                            onChange={(e) => updateManualLagai(i, e.target.value)}
                                            disabled={r.status === "suspend"}
                                            className="w-20 text-center font-bold text-gray-900 border-2 border-amber-200 rounded-lg 
                                                       py-1.5 px-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-300
                                                       bg-white shadow-sm disabled:bg-gray-100 disabled:opacity-60"
                                        />
                                    </td>
                                    
                                    {/* Manual Khai Input */}
                                    <td className="py-2 px-2 text-center" style={{ background: C.khaiCell ? `${C.khaiCell}20` : "#fff5f5" }}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="97"
                                            value={r.manualKhai}
                                            onChange={(e) => updateManualKhai(i, e.target.value)}
                                            disabled={r.status === "suspend"}
                                            className="w-20 text-center font-bold text-gray-900 border-2 border-red-200 rounded-lg 
                                                       py-1.5 px-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-300
                                                       bg-white shadow-sm disabled:bg-gray-100 disabled:opacity-60"
                                        />
                                    </td>
                                    
                                    {/* Diff Input */}
                                    <td className="py-2 px-2 text-center bg-gray-50">
                                        <input
                                            type="number"
                                            min="1"
                                            max="97"
                                            value={r.diff}
                                            onChange={(e) => updateDiff(i, e.target.value)}
                                            disabled={r.status === "suspend"}
                                            className="w-16 text-center font-bold text-indigo-700 border-2 border-indigo-200 rounded-lg 
                                                       py-1.5 px-1 focus:outline-none focus:border-indigo-500 bg-white
                                                       disabled:bg-gray-100 disabled:opacity-60"
                                        />
                                    </td>
                                    
                                    {/* Diff Action Buttons */}
                                    <td className="py-2 px-2 text-center bg-gray-50">
                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            <button
                                                onClick={() => applyDiffToLagai(i)}
                                                disabled={r.status === "suspend"}
                                                className={`text-white text-xs font-bold px-2.5 py-1.5 rounded-md transition-all 
                                                           hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                                                           ${r.status === "suspend" ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"}`}
                                            >
                                                +Diff LAGAI
                                            </button>
                                            <button
                                                onClick={() => applyDiffToKhai(i)}
                                                disabled={r.status === "suspend"}
                                                className={`text-white text-xs font-bold px-2.5 py-1.5 rounded-md transition-all 
                                                           hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                                                           ${r.status === "suspend" ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                                            >
                                                +Diff KHAI
                                            </button>
                                            <button
                                                onClick={() => applyDiffToBoth(i)}
                                                disabled={r.status === "suspend"}
                                                className={`text-white text-xs font-bold px-2.5 py-1.5 rounded-md transition-all 
                                                           hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                                                           ${r.status === "suspend" ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
                                            >
                                                +Diff BOTH
                                            </button>
                                            <button
                                                onClick={() => resetOdds(i)}
                                                disabled={r.status === "suspend"}
                                                className={`text-gray-700 text-xs font-bold px-2.5 py-1.5 rounded-md transition-all 
                                                           border border-gray-300 hover:bg-gray-100 active:scale-95 shadow-sm
                                                           disabled:opacity-50 disabled:cursor-not-allowed bg-white`}
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </td>
                                    
                                    {/* Action Button */}
                                    <td className="py-2 px-2 text-center">
                                        <button
                                            onClick={() => toggleRunnerStatus(i)}
                                            className="text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95"
                                            style={{ background: r.status === "open" ? (C.suspendBtn || "#ef4444") : (C.openBtn || "#22c55e") }}
                                        >
                                            {r.status === "open" ? "Suspend Rate" : "Open Rate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Session Table */}
                <div className="rounded-xl overflow-hidden shadow-lg mb-6 bg-white border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="py-3 px-3 text-white text-left font-bold text-xs uppercase" style={{ background: C.headerBg || "#1e293b" }}>SESSION</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: C.laGaiBg || "#fef9c3", color: "#854d0e" }}>NO RUN</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: C.khaiBg || "#fee2e2", color: "#991b1b" }}>YES RUN</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: "#f8d7da", color: "#721c24" }}>Suspend</th>
                                <th className="py-3 px-2 text-center font-bold text-xs uppercase" style={{ background: "#d4edda", color: "#155724" }}>Open</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((s, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="py-3 px-3 font-medium text-blue-700">{s.name}</td>
                                    <td className="py-2 px-2 text-center" style={{ background: C.laGaiCell ? `${C.laGaiCell}20` : "#fefce8" }}>
                                        <div className="font-bold text-gray-800 text-base">{s.noRun}</div>
                                        <div className="text-xs text-gray-500">{s.noRate}</div>
                                    </td>
                                    <td className="py-2 px-2 text-center" style={{ background: C.khaiCell ? `${C.khaiCell}20` : "#fff5f5" }}>
                                        <div className="font-bold text-gray-800 text-base">{s.yesRun}</div>
                                        <div className="text-xs text-gray-500">{s.yesRate}</div>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <button onClick={() => toggleSession(i)} className="text-white text-xs font-semibold px-3 py-1 rounded transition-all hover:scale-105" style={{ background: C.suspendBtn || "#ef4444" }}>
                                            Suspend
                                        </button>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <button onClick={() => toggleSession(i)} className="text-white text-xs font-semibold px-3 py-1 rounded transition-all hover:scale-105" style={{ background: C.openBtn || "#22c55e" }}>
                                            Open
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bet Lock / Mode Controls */}
                <div className="bg-white rounded-xl shadow-md mb-4 p-4 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div>
                            <div className="font-semibold text-gray-600 mb-1 text-sm">Bet Lock</div>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white" value={betLock} onChange={e => setBetLock(e.target.value)}>
                                {BET_LOCK_OPTIONS.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-600 mb-1 text-sm">Select Mode</div>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white" value={mode} onChange={e => setMode(e.target.value)}>
                                {MODE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <button className="text-white text-sm font-semibold px-6 py-2 rounded-lg w-full transition-all hover:scale-105 active:scale-95" style={{ background: C.submitBtn || "#3b82f6" }}>Submit</button>
                        </div>
                    </div>
                </div>

                {/* Session Lock/Unlock */}
                <div className="bg-white rounded-xl shadow-md mb-4 p-4 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div className="sm:col-span-2">
                            <div className="font-semibold text-gray-600 mb-1 text-sm">Session Lock/Unlock</div>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 w-48 bg-white" value={sessionLock} onChange={e => setSessionLock(e.target.value)}>
                                {SESSION_LOCK_OPTS.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <button className="text-white text-sm font-semibold px-6 py-2 rounded-lg w-full transition-all hover:scale-105 active:scale-95" style={{ background: C.submitBtn || "#3b82f6" }}>Submit</button>
                        </div>
                    </div>
                </div>

                {/* Match Rate Difference */}
                <div className="bg-white rounded-xl shadow-md mb-4 p-4 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div>
                            <div className="font-semibold text-gray-600 mb-1 text-sm">Name</div>
                            <div className="text-gray-800 py-2 font-medium">Match Rate Difference</div>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-600 mb-1 text-sm">Select Rate Diff</div>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white" value={rateDiff} onChange={e => setRateDiff(e.target.value)}>
                                {RATE_DIFF_OPTS.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <button className="text-white text-sm font-semibold px-6 py-2 rounded-lg w-full transition-all hover:scale-105 active:scale-95" style={{ background: C.submitBtn || "#3b82f6" }}>Submit</button>
                        </div>
                    </div>
                </div>

                {/* Options / Management Table */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 mb-6">
                    <button className="text-white text-sm font-semibold px-5 py-2 rounded-lg mb-4 transition-all hover:scale-105" style={{ background: C.optionsBtn || "#6b7280" }}>➕ Options</button>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-2 px-3 text-left text-gray-600 font-semibold">Name</th>
                                <th className="py-2 px-3 text-center text-gray-600 font-semibold">Status</th>
                                <th className="py-2 px-3 text-center text-gray-600 font-semibold">Diff</th>
                                <th className="py-2 px-3 text-center text-gray-600 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {management.map((m, i) => (
                                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-3 text-gray-700">{m.name}</td>
                                    <td className="py-2 px-3 text-center">
                                        <span className="text-sm font-semibold" style={{ color: m.status === "Showing" ? (C.showingText || "#22c55e") : (C.notText || "#ef4444") }}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-center text-gray-600">{m.diff}</td>
                                    <td className="py-2 px-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => toggleVisible(i)} className="text-white text-xs font-semibold px-3 py-1 rounded transition-all hover:scale-105" style={{ background: m.visible ? (C.suspendBtn || "#ef4444") : (C.openBtn || "#22c55e") }}>
                                                {m.visible ? "Hide" : "Show"}
                                            </button>
                                            <button onClick={() => deleteItem(i)} className="text-white text-xs font-semibold px-3 py-1 rounded transition-all hover:scale-105" style={{ background: C.deleteBtn || "#ef4444" }}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-xs py-4">
                    Manual Odds Control • Range: 1-97 • Diff increments available
                </div>
            </div>
        </div>
    );
}