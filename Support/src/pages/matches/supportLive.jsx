import { useState } from "react";

// ── Exact colors from screenshots ──────────────────────────────────────────
const C = {
  headerBg:    "#4a6fa5",   // darker steel-blue for RUNNER/SESSION/Action headers
  laGaiBg:     "#b8d4e8",   // light blue header for LAGAI/NO RUN
  khaiBg:      "#f0b8c4",   // light pink header for KHAI/YES RUN
  laGaiCell:   "#d6eaf8",   // cell bg for lagai/no-run
  khaiCell:    "#fce4ea",   // cell bg for khai/yes-run
  actionHeader:"#b0bec5",   // grey for Action header
  suspendBtn:  "#f5a623",   // amber/orange for Suspend buttons
  openBtn:     "#2e7d32",   // dark green for Open buttons
  startManual: "#d9534f",   // red for Start Manual
  submitBtn:   "#3a9fbf",   // teal/cyan Submit buttons
  optionsBtn:  "#4caf50",   // green Options
  deleteBtn:   "#f5a623",   // amber Delete Session
  showingText: "#2e7d32",
  notText:     "#d9534f",
  matchBadge:  "#2c3e6b",   // dark navy pill
};

const MATCH = {
  homeTeam: "Bangladesh",
  awayTeam: "Australia",
  score: "AUS 25-3 (6.5)",
  centerScore: "0",
  balls: [1, 2, 0, 0, 3, 0],
  subtitle: "Australia opt to bat",
};

const RUNNERS_INIT = [
  { name: "Bangladesh", lagai: "0.37", khai: "0.39", status: "open" },
  { name: "Australia",  lagai: "",     khai: "",     status: "suspend" },
];

const SESSIONS_INIT = [
  { name: "10 Over Runs AUS Adv",         noRun: 40,  noRate: "1.0", yesRun: 42,  yesRate: "1.0", suspended: false },
  { name: "50 Over Runs AUS Adv",         noRun: 207, noRate: "1.0", yesRun: 210, yesRate: "1.0", suspended: false },
  { name: "J Inglis Runs",                noRun: 35,  noRate: "1.1", yesRun: 36,  yesRate: "0.9", suspended: false },
  { name: "Fall of 4th wkt Runs AUS Adv", noRun: 52,  noRate: "1.1", yesRun: 53,  yesRate: "0.9", suspended: false },
  { name: "A Carey Runs",                 noRun: 36,  noRate: "1.1", yesRun: 37,  yesRate: "0.9", suspended: false },
];

const MANAGEMENT_INIT = [
  { name: "50OverRunsAUSAdv",       status: "Showing", diff: "3", visible: true  },
  { name: "JInglisRuns",            status: "Showing", diff: "1", visible: true  },
  { name: "10OverRunsAUSAdv",       status: "Showing", diff: "2", visible: true  },
  { name: "ACareyRuns",             status: "Showing", diff: "1", visible: true  },
  { name: "Fallof4thwktRunsAUSAdv", status: "Showing", diff: "1", visible: true  },
  { name: "6OverRunsAUS",           status: "Not",     diff: "1", visible: false },
  { name: "4.3OverRunsAUS",         status: "Not",     diff: "1", visible: false },
  { name: "9OverRunsAUS",           status: "Not",     diff: "1", visible: false },
  { name: "5.1BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "4.6BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "4.5BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "5.3OverRunsAUS",         status: "Not",     diff: "1", visible: false },
  { name: "4.4BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "4.3BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "4.2BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "Only6OverRunsAUS",       status: "Not",     diff: "1", visible: false },
  { name: "5OverRunsAUS",           status: "Not",     diff: "1", visible: false },
  { name: "4.1BallRunAUS",          status: "Not",     diff: "1", visible: false },
  { name: "3.6BallRunAUS",          status: "Not",     diff: "1", visible: false },
];

// ── Small reusable select ─────────────────────────────────────────────────────
function Sel({ children, defaultVal, small }) {
  const cls = small
    ? "border border-gray-300 rounded px-1 py-0.5 text-xs bg-white text-gray-700 focus:outline-none"
    : "border border-gray-300 rounded px-2 py-1.5 text-sm bg-white text-gray-700 focus:outline-none w-full";
  return (
    <select defaultValue={defaultVal} className={cls}>
      {children}
    </select>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function SupportLive() {
  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3 font-sans text-sm">
      <div className="max-w-5xl mx-auto">

        {/* ── Start Manual ── */}
        <div className="flex justify-end mb-3">
          <button
            className="text-white text-sm font-semibold px-5 py-2 rounded"
            style={{ background: C.startManual }}
          >
            Start Manual
          </button>
        </div>

        {/* ── Match subtitle ── */}
        <div className="text-center text-gray-500 text-sm mb-2">
          {MATCH.subtitle}
        </div>

        {/* ── Ball-by-ball numbers (plain, no circles) ── */}
        <div className="flex justify-center gap-4 mb-3 text-gray-600 text-sm">
          {MATCH.balls.map((b, i) => <span key={i}>{b}</span>)}
        </div>

        {/* ── Match badge ── */}
        <div className="flex justify-center mb-3">
          <span
            className="text-white text-sm font-semibold px-6 py-1.5 rounded-full"
            style={{ background: C.matchBadge }}
          >
            Match : {MATCH.homeTeam} VS {MATCH.awayTeam}
          </span>
        </div>

        {/* ── Score row ── */}
        <div className="grid grid-cols-3 border border-gray-300 rounded overflow-hidden mb-4 bg-white">
          <div className="py-2.5 pl-4 text-sm font-bold" style={{ color: C.notText }}>
            {MATCH.homeTeam.slice(0, 3).toUpperCase()}
          </div>
          <div
            className="py-2.5 text-xl font-bold text-white text-center"
            style={{ background: C.openBtn }}
          >
            {MATCH.centerScore}
          </div>
          <div className="py-2.5 pr-4 text-sm font-bold text-right" style={{ color: C.notText }}>
            {MATCH.score}
          </div>
        </div>

        {/* ── Odds / Runner Table ── */}
        <RunnerTable />

        {/* ── Session Table ── */}
        <SessionTable />

        {/* ── Controls (Bet Lock / Session Lock / Rate Diff) ── */}
        <Controls />

        {/* ── Session Management ── */}
        <SessionManagement />

      </div>
    </div>
  );
}

// ── Runner Table ──────────────────────────────────────────────────────────────
function RunnerTable() {
  const [runners, setRunners] = useState(RUNNERS_INIT);
  const toggle = (i) =>
    setRunners((p) =>
      p.map((r, idx) =>
        idx === i ? { ...r, status: r.status === "open" ? "suspend" : "open" } : r
      )
    );

  return (
    <div className="overflow-hidden rounded border border-gray-300 mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="py-2.5 px-4 text-white text-center font-semibold text-xs uppercase tracking-wide"
              style={{ background: C.headerBg }}>RUNNER</th>
            <th className="py-2.5 px-4 text-center font-semibold text-xs uppercase"
              style={{ background: C.laGaiBg, color: "#1a3a5c" }}>LAGAI</th>
            <th className="py-2.5 px-4 text-center font-semibold text-xs uppercase"
              style={{ background: C.khaiBg, color: "#7a1a2e" }}>KHAI</th>
            <th className="py-2.5 px-4 text-center font-semibold text-xs"
              style={{ background: C.actionHeader, color: "#333" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {runners.map((r, i) => (
            <tr key={r.name} className="border-t border-gray-200 bg-white">
              <td className="py-2.5 px-4 text-center text-gray-800">{r.name}</td>
              <td className="py-2.5 px-4 text-center font-medium text-gray-900"
                style={{ background: C.laGaiCell }}>{r.lagai}</td>
              <td className="py-2.5 px-4 text-center font-medium text-gray-900"
                style={{ background: C.khaiCell }}>{r.khai}</td>
              <td className="py-2.5 px-4 text-center">
                <button
                  onClick={() => toggle(i)}
                  className="text-white text-xs px-3 py-1 rounded font-medium"
                  style={{ background: r.status === "open" ? C.openBtn : C.suspendBtn }}
                >
                  {r.status === "open" ? "Open Rate" : "Suspend Rate"}
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
  const [sessions, setSessions] = useState(SESSIONS_INIT);
  const toggle = (i) =>
    setSessions((p) =>
      p.map((s, idx) => (idx === i ? { ...s, suspended: !s.suspended } : s))
    );

  const thBase = "py-2.5 px-3 text-center font-semibold text-xs uppercase tracking-wide";

  return (
    <div className="overflow-hidden rounded border border-gray-300 mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className={`${thBase} text-white`} style={{ background: C.headerBg }}>SESSION</th>
            <th className={thBase} style={{ background: C.laGaiBg, color: "#1a3a5c" }}>NO RUN</th>
            <th className={thBase} style={{ background: C.khaiBg, color: "#7a1a2e" }}>YES RUN</th>
            <th className={`${thBase}`} style={{ background: C.khaiBg, color: "#7a1a2e" }}>Suspend</th>
            <th className={`${thBase}`} style={{ background: C.laGaiBg, color: "#1a3a5c" }}>Open</th>
          </tr>
        </thead>
        <tbody>
          {/* Global action row */}
          <tr className="border-t border-gray-200 bg-white">
            <td className="py-2 px-3" />
            <td className="py-2 px-3" style={{ background: C.laGaiCell }} />
            <td className="py-2 px-3" style={{ background: C.khaiCell }} />
            <td className="py-2 px-3 text-center">
              <button
                onClick={() => setSessions((p) => p.map((s) => ({ ...s, suspended: true })))}
                className="text-white text-xs px-3 py-1 rounded font-medium"
                style={{ background: C.suspendBtn }}
              >
                Suspend Rate
              </button>
            </td>
            <td className="py-2 px-3 text-center">
              <button
                onClick={() => setSessions((p) => p.map((s) => ({ ...s, suspended: false })))}
                className="text-white text-xs px-3 py-1 rounded font-medium"
                style={{ background: C.openBtn }}
              >
                Open Rate
              </button>
            </td>
          </tr>

          {sessions.map((s, i) => (
            <tr key={s.name} className="border-t border-gray-200 bg-white">
              <td className="py-2.5 px-4 text-gray-700">{s.name}</td>
              <td className="py-2 px-3 text-center" style={{ background: C.laGaiCell }}>
                <div className="font-bold text-gray-900">{s.noRun}</div>
                <div className="text-xs text-gray-500">{s.noRate}</div>
              </td>
              <td className="py-2 px-3 text-center" style={{ background: C.khaiCell }}>
                <div className="font-bold text-gray-900">{s.yesRun}</div>
                <div className="text-xs text-gray-500">{s.yesRate}</div>
              </td>
              <td className="py-2 px-3 text-center">
                <button
                  onClick={() => toggle(i)}
                  className="text-white text-xs px-3 py-1 rounded font-medium"
                  style={{ background: C.suspendBtn }}
                >
                  {s.suspended ? "Suspended" : "Suspend"}
                </button>
              </td>
              <td className="py-2 px-3 text-center">
                <button
                  onClick={() => toggle(i)}
                  className="text-white text-xs px-3 py-1 rounded font-medium"
                  style={{ background: C.openBtn }}
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Controls ──────────────────────────────────────────────────────────────────
// Screenshot 2 shows: plain table rows with column labels as row headers (not card)
// Bet Lock | Mode | Action  →  dropdowns + Submit
// Session Lock/Unlock | (blank) | Action → dropdown + Submit
// Name | Diff | Action → label + dropdown + Submit
function Controls() {
  const thCls = "text-left px-4 py-2 text-gray-600 font-medium text-sm border-b border-gray-200 bg-white";
  const tdCls = "px-4 py-3 bg-white";

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-4">
      {/* ── Bet Lock ── */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={thCls}>Bet Lock</th>
            <th className={thCls}>Mode</th>
            <th className={thCls}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-100">
            <td className={tdCls}>
              <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none w-36">
                <option>Unlock</option>
                <option>Lock</option>
              </select>
            </td>
            <td className={tdCls}>
              <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none w-36">
                <option>Lagai</option>
                <option>Khai</option>
              </select>
            </td>
            <td className={tdCls}>
              <button
                className="text-white text-sm font-semibold px-6 py-1.5 rounded"
                style={{ background: C.submitBtn }}
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Session Lock/Unlock ── */}
      <table className="w-full border-collapse border-t-2 border-gray-200">
        <thead>
          <tr>
            <th className={thCls}>Session Lock/Unlock</th>
            <th className={thCls}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-100">
            <td className={tdCls}>
              <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none w-36">
                <option>Unlock</option>
                <option>Lock</option>
              </select>
            </td>
            <td className={tdCls}>
              <button
                className="text-white text-sm font-semibold px-6 py-1.5 rounded"
                style={{ background: C.submitBtn }}
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Match Rate Difference ── */}
      <table className="w-full border-collapse border-t-2 border-gray-200">
        <thead>
          <tr>
            <th className={thCls}>Name</th>
            <th className={thCls}>Diff</th>
            <th className={thCls}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-100">
            <td className={`${tdCls} text-gray-700`}>Match Rate Difference</td>
            <td className={tdCls}>
              <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none w-28">
                <option>0.02</option>
                <option>0.05</option>
                <option>0.10</option>
              </select>
            </td>
            <td className={tdCls}>
              <button
                className="text-white text-sm font-semibold px-6 py-1.5 rounded"
                style={{ background: C.submitBtn }}
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Session Management ────────────────────────────────────────────────────────
function SessionManagement() {
  const [sessions, setSessions] = useState(MANAGEMENT_INIT);

  const toggleVisible = (i) =>
    setSessions((p) =>
      p.map((s, idx) =>
        idx === i
          ? { ...s, visible: !s.visible, status: !s.visible ? "Showing" : "Not" }
          : s
      )
    );

  const updateDiff = (i, val) =>
    setSessions((p) => p.map((s, idx) => (idx === i ? { ...s, diff: val } : s)));

  return (
    <>
      {/* Options / Delete Session */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="text-white text-sm font-semibold px-8 py-2 rounded"
          style={{ background: C.optionsBtn }}
        >
          Options
        </button>
        <button
          className="text-white text-sm font-semibold px-8 py-2 rounded"
          style={{ background: C.deleteBtn }}
        >
          Delete Session
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-200 mb-10">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Session</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Status</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Lock/Unlock</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Rate Diff</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Group</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Max Amt</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Odd Even</th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={s.name} className="border-b border-gray-100 bg-white hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-800">{s.name}</td>
                <td className="px-3 py-2 font-medium"
                  style={{ color: s.status === "Showing" ? C.showingText : C.notText }}>
                  {s.status}
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>Unlock</option>
                    <option>Lock</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    value={s.diff}
                    onChange={(e) => updateDiff(i, e.target.value)}
                    className="w-10 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-center bg-white focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>Select</option>
                    <option>Group A</option>
                    <option>Group B</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>Select</option>
                    <option>1000</option>
                    <option>5000</option>
                    <option>10000</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white text-gray-700 focus:outline-none">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleVisible(i)}
                    className="text-xs font-medium underline"
                    style={{ color: s.visible ? C.notText : "#2563eb" }}
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