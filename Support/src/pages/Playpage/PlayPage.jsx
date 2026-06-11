import { useState } from "react";

const COLOR = "#32759A";

const MATCH = {
  homeTeam: "Bangladesh",
  awayTeam: "Australia",
  score: "AUS 25-3 (6.5)",
  centerScore: "0",
  balls: [1, 2, 0, 0, 3, 0],
  subtitle: "Australia opt to bat",
};

const RUNNERS_DATA = [
  { name: "Bangladesh", lagai: "0.37", khai: "0.39", status: "open" },
  { name: "Australia",  lagai: "",     khai: "",     status: "suspend" },
];

const SESSIONS_DATA = [
  { name: "10 Over Runs AUS Adv",         noRun: 40,  noRate: 1.0, yesRun: 42,  yesRate: 1.0 },
  { name: "50 Over Runs AUS Adv",         noRun: 207, noRate: 1.0, yesRun: 210, yesRate: 1.0 },
  { name: "J Inglis Runs",                noRun: 35,  noRate: 1.1, yesRun: 36,  yesRate: 0.9 },
  { name: "Fall of 4th wkt Runs AUS Adv", noRun: 52,  noRate: 1.1, yesRun: 53,  yesRate: 0.9 },
  { name: "A Carey Runs",                 noRun: 36,  noRate: 1.1, yesRun: 37,  yesRate: 0.9 },
];

const MANAGEMENT_DATA = [
  { name: "50OverRunsAUSAdv",       status: "Showing", diff: "3", visible: true  },
  { name: "JInglisRuns",            status: "Showing", diff: "1", visible: true  },
  { name: "10OverRunsAUSAdv",       status: "Showing", diff: "2", visible: true  },
  { name: "ACareyRuns",             status: "Showing", diff: "1", visible: true  },
  { name: "Fallof4thwktRunsAUSAdv", status: "Showing", diff: "1", visible: true  },
  { name: "6OverRunsAUS",           status: "Not",     diff: "1", visible: false },
  { name: "4.3OverRunsAUS",         status: "Not",     diff: "1", visible: false },
  { name: "9OverRunsAUS",           status: "Not",     diff: "1", visible: false },
  { name: "5.1BallRunAUS",          status: "Not",     diff: "1", visible: false },
];

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] py-4 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Start Manual */}
        <div className="flex justify-end mb-3">
          <button className="bg-[#e05252] hover:bg-[#c94444] text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Start Manual
          </button>
        </div>

        {/* Match header */}
        <div className="text-center mb-3">
          <p className="text-sm text-gray-500 mb-2">{MATCH.subtitle}</p>
          <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
            {MATCH.balls.map((b, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ background: COLOR }}
              >
                {b}
              </div>
            ))}
          </div>
          <span
            className="inline-block text-white text-sm font-medium px-5 py-1.5 rounded-full"
            style={{ background: COLOR }}
          >
            Match : {MATCH.homeTeam} VS {MATCH.awayTeam}
          </span>
        </div>

        {/* Score row */}
        <div className="grid grid-cols-3 border border-gray-300 rounded overflow-hidden mb-4">
          <div className="p-2.5 text-sm font-semibold text-[#e05252] text-left pl-6 bg-white">
            {MATCH.homeTeam.slice(0, 3).toUpperCase()}
          </div>
          <div className="p-2.5 text-xl font-bold text-white text-center bg-[#2e7d32]">
            {MATCH.centerScore}
          </div>
          <div className="p-2.5 text-sm font-semibold text-[#e05252] text-right pr-6 bg-white">
            {MATCH.score}
          </div>
        </div>

        <OddsTable />
        <SessionTable />
        <Controls />
        <SessionManagement />

      </div>
    </div>
  );
}

// ── Odds Table ────────────────────────────────────────────────────────────────
function OddsTable() {
  const [runners, setRunners] = useState(RUNNERS_DATA);

  const toggleStatus = (index) => {
    setRunners((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, status: r.status === "open" ? "suspend" : "open" }
          : r
      )
    );
  };

  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2.5 text-center text-white text-xs font-medium"
              style={{ background: "#5b7fa6" }}>
              RUNNER
            </th>
            <th className="p-2.5 text-center text-xs font-medium text-[#1a3a5c]"
              style={{ background: "#bfd8ef" }}>
              LAGAI
            </th>
            <th className="p-2.5 text-center text-xs font-medium text-[#7a1a2e]"
              style={{ background: "#f5c6d0" }}>
              KHAI
            </th>
            <th className="p-2.5 text-center text-xs font-medium text-gray-600"
              style={{ background: "#c5c5c5" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {runners.map((runner, idx) => (
            <tr key={runner.name} className="border-b border-gray-200">
              <td className="p-2.5 text-left pl-4 font-medium text-black">
                {runner.name}
              </td>
              <td className="p-2.5 text-center text-black" style={{ background: "#daeaf7" }}>
                {runner.lagai}
              </td>
              <td className="p-2.5 text-center text-black" style={{ background: "#fce4ea" }}>
                {runner.khai}
              </td>
              <td className="p-2.5 text-center">
                <button
                  onClick={() => toggleStatus(idx)}
                  className={`text-xs px-3 py-1 rounded transition ${
                    runner.status === "open"
                      ? "bg-[#2e7d32] text-white hover:bg-[#1b5e20]"
                      : "bg-[#f5a623] text-white hover:bg-[#e69500]"
                  }`}
                >
                  {runner.status === "open" ? "Open Rate" : "Suspend Rate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Session Table ─────────────────────────────────────────────────────────────
function SessionTable() {
  const [sessions, setSessions] = useState(
    SESSIONS_DATA.map((s) => ({ ...s, suspended: false }))
  );

  const toggleSession = (i) => {
    setSessions((prev) =>
      prev.map((s, idx) =>
        idx === i ? { ...s, suspended: !s.suspended } : s
      )
    );
  };

  const cols = "1.6fr 0.9fr 0.9fr 0.8fr 0.8fr";

  return (
    <div className="border border-gray-300 rounded overflow-hidden mb-4">

      {/* Header */}
      <div className="grid text-xs font-medium" style={{ gridTemplateColumns: cols }}>
        <div className="p-2.5 text-white text-center" style={{ background: "#5b7fa6" }}>SESSION</div>
        <div className="p-2.5 text-center text-[#1a3a5c]" style={{ background: "#bfd8ef" }}>NO RUN</div>
        <div className="p-2.5 text-center text-[#7a1a2e]" style={{ background: "#f5c6d0" }}>YES RUN</div>
        <div className="p-2.5 text-center text-[#7a1a2e]" style={{ background: "#f5c6d0" }}>Suspend</div>
        <div className="p-2.5 text-center text-[#1a3a5c]" style={{ background: "#daeaf7" }}>Open</div>
      </div>

      {/* Global action row */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: cols }}>
        <div className="p-2" />
        <div className="p-2" />
        <div className="p-2" />
        <div className="p-2 text-center">
          <button
            onClick={() => setSessions((prev) => prev.map((s) => ({ ...s, suspended: true })))}
            className="bg-[#f5a623] hover:bg-[#e69500] text-white text-xs px-2 py-1 rounded transition"
          >
            Suspend Rate
          </button>
        </div>
        <div className="p-2 text-center">
          <button
            onClick={() => setSessions((prev) => prev.map((s) => ({ ...s, suspended: false })))}
            className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs px-2 py-1 rounded transition"
          >
            Open Rate
          </button>
        </div>
      </div>

      {/* Session rows */}
      {sessions.map((s, i) => (
        <div
          key={s.name}
          className="grid border-b border-gray-100"
          style={{ gridTemplateColumns: cols }}
        >
          <div className="p-2.5 text-xs font-medium text-left pl-3 text-black">{s.name}</div>
          <div className="p-2.5 text-center" style={{ background: "#daeaf7" }}>
            <div className="font-bold text-sm text-black">{s.noRun}</div>
            <div className="text-xs text-gray-600">{s.noRate}</div>
          </div>
          <div className="p-2.5 text-center" style={{ background: "#fce4ea" }}>
            <div className="font-bold text-sm text-black">{s.yesRun}</div>
            <div className="text-xs text-gray-600">{s.yesRate}</div>
          </div>
          <div className="p-2.5 text-center">
            <button
              onClick={() => toggleSession(i)}
              className="bg-[#f5a623] hover:bg-[#e69500] text-white text-xs px-3 py-1 rounded transition"
            >
              {s.suspended ? "Suspended" : "Suspend"}
            </button>
          </div>
          <div className="p-2.5 text-center">
            <button
              onClick={() => toggleSession(i)}
              className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs px-3 py-1 rounded transition"
            >
              Open
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Controls ──────────────────────────────────────────────────────────────────
function Controls() {
  const [betLock, setBetLock]       = useState("Unlock");
  const [mode, setMode]             = useState("Lagai");
  const [sessionLock, setSessionLock] = useState("Unlock");
  const [rateDiff, setRateDiff]     = useState("0.02");

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-4">

      {/* Bet Lock + Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-b border-gray-100 pb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Bet Lock</label>
          <select
            value={betLock}
            onChange={(e) => setBetLock(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#32759A]"
          >
            <option>Unlock</option>
            <option>Lock</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#32759A]"
          >
            <option>Lagai</option>
            <option>Khai</option>
          </select>
        </div>
        <button
          className="text-white text-sm font-medium py-2 px-4 rounded-lg transition hover:opacity-90"
          style={{ background: COLOR }}
        >
          Submit
        </button>
      </div>

      {/* Session Lock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-b border-gray-100 pb-4">
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-500 mb-1 font-medium">
            Session Lock/Unlock
          </label>
          <select
            value={sessionLock}
            onChange={(e) => setSessionLock(e.target.value)}
            className="w-full sm:w-48 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#32759A]"
          >
            <option>Unlock</option>
            <option>Lock</option>
          </select>
        </div>
        <button
          className="text-white text-sm font-medium py-2 px-4 rounded-lg transition hover:opacity-90"
          style={{ background: COLOR }}
        >
          Submit
        </button>
      </div>

      {/* Match Rate Diff */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">Name</p>
          <p className="text-sm font-medium text-gray-700">Match Rate Difference</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Diff</label>
          <select
            value={rateDiff}
            onChange={(e) => setRateDiff(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#32759A]"
          >
            <option>0.02</option>
            <option>0.05</option>
            <option>0.10</option>
          </select>
        </div>
        <button
          className="text-white text-sm font-medium py-2 px-4 rounded-lg transition hover:opacity-90"
          style={{ background: COLOR }}
        >
          Submit
        </button>
      </div>

    </div>
  );
}

// ── Session Management ────────────────────────────────────────────────────────
function SessionManagement() {
  const [sessions, setSessions] = useState(MANAGEMENT_DATA);

  const toggleVisible = (i) => {
    setSessions((prev) =>
      prev.map((s, idx) =>
        idx === i
          ? { ...s, visible: !s.visible, status: !s.visible ? "Showing" : "Not" }
          : s
      )
    );
  };

  const updateDiff = (i, val) => {
    setSessions((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, diff: val } : s))
    );
  };

  return (
    <>
      <div className="flex justify-center gap-3 mb-4">
        <button className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-sm px-5 py-2 rounded-lg transition">
          Options
        </button>
        <button className="bg-[#f5a623] hover:bg-[#e69500] text-white text-sm px-5 py-2 rounded-lg transition">
          Delete Session
        </button>
      </div>

      <div className="overflow-x-auto pb-6">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-2.5 text-left font-medium text-gray-700">Session</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Status</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Lock/Unlock</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Rate Diff</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Group</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Max Amt</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Odd Even</th>
              <th className="p-2.5 text-left font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={s.name} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-2.5 text-black">{s.name}</td>
                <td className="p-2.5">
                  <span className={`text-xs font-medium ${
                    s.status === "Showing" ? "text-[#2e7d32]" : "text-[#e05252]"
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-2.5">
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#32759A]">
                    <option>Unlock</option>
                    <option>Lock</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <input
                    value={s.diff}
                    onChange={(e) => updateDiff(i, e.target.value)}
                    className="w-12 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#32759A]"
                  />
                </td>
                <td className="p-2.5">
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#32759A]">
                    <option>Select</option>
                    <option>Group A</option>
                    <option>Group B</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#32759A]">
                    <option>Select</option>
                    <option>1000</option>
                    <option>5000</option>
                    <option>10000</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#32759A]">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => toggleVisible(i)}
                    className="text-[#32759A] hover:text-[#1a4a6e] underline text-xs font-medium transition"
                  >
                    {s.visible ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}