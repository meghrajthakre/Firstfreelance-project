import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";

// ─── Constants ───────────────────────────────────────────────────────────────

const PRODUCTION_URL = "https://your-server.com"; // ← CHANGE THIS
const MAX_SSE_FAILURES = 3;          // Switch to polling after N consecutive SSE failures
const FALLBACK_POLL_INTERVAL = 8000; // ms between fallback REST polls

// ─── Helpers ─────────────────────────────────────────────────────────────────

function PLValue({ value }) {
  if (value === null || value === undefined || value === "")
    return <span className="text-gray-400">—</span>;
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return <span className="text-gray-400">—</span>;
  const neg = num < 0;
  return (
    <span className={neg ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
      {num.toLocaleString("en-IN")}
    </span>
  );
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function parseBalls(html) {
  if (!html) return [];
  const matches = [...html.matchAll(/class='([^']+)'>([^<]*)<\/span>/g)];
  return matches.map((m) => ({ cls: m[1], val: m[2] }));
}

function BallDot({ cls, val }) {
  let bg = "bg-gray-700 text-white";
  if (cls?.includes("wkt")) bg = "bg-red-600 text-white";
  else if (val === "4") bg = "bg-blue-500 text-white";
  else if (val === "6") bg = "bg-green-500 text-white";
  else if (val === "0" || cls?.includes("dot-black")) bg = "bg-gray-800 text-white";
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${bg} shadow-sm`}>
      {val || "·"}
    </span>
  );
}

// ─── Data transformation ──────────────────────────────────────────────────────

function transformSSEData(dataArray) {
  const result = {
    runners: [],
    sessions: [],
    tossMsg: "",
    lastBalls: [],
    newBatter: "",
    localScore: "",
    visitorScore: "",
    suspendMsg: "",
  };

  if (!Array.isArray(dataArray)) return result;

  dataArray.forEach((item) => {
    if (item.toss_msg !== undefined) {
      result.tossMsg = item.toss_msg || "";
      result.suspendMsg = item.suspend_msg || "";
      if (item.last_balls) result.lastBalls = parseBalls(item.last_balls);
      if (item.url) result.newBatter = item.url;
      result.runners.push({
        name: item.name,
        lagai: item.Lagai || "",
        khai: item.Khai || "",
        notPos: null,
        yesPos: null,
      });
      if (item.LocalScore) result.localScore = item.LocalScore;
      if (item.VisitorScore) result.visitorScore = item.VisitorScore;
    } else if (item.name && item.Lagai !== undefined && item.AutoNo === undefined) {
      result.runners.push({
        name: item.name,
        lagai: item.Lagai || "",
        khai: item.Khai || "",
        notPos: null,
        yesPos: null,
      });
      if (item.LocalScore) result.localScore = item.LocalScore;
      if (item.VisitorScore) result.visitorScore = item.VisitorScore;
    } else if (item.AutoNo !== undefined) {
      result.sessions.push({
        id: item.AutoNo,
        name: item.name,
        noRun: item.NO_RUN ?? "",
        noRate: item.NO_RATE ?? "",
        yesRun: item.YES_RUN ?? "",
        yesRate: item.YES_RATE ?? "",
        notPos: item.NOT_POS ?? "",
        yesPos: item.YES_POS ?? "",
      });
    }
  });

  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RunnerTable({ runners }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-500">RUNNER</th>
          <th className="bg-blue-200 text-gray-700 text-center text-xs font-semibold px-4 py-2.5 border border-blue-300">LAGAI</th>
          <th className="bg-pink-200 text-gray-700 text-center text-xs font-semibold px-4 py-2.5 border border-pink-300">KHAI</th>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-500">+ / -</th>
        </tr>
      </thead>
      <tbody>
        {runners.map((r, i) => {
          const hasOdds = parseFloat(r.lagai) > 0 || parseFloat(r.khai) > 0;
          return (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-200">
                {i === 0 ? (
                  <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded">
                    {r.name}
                  </span>
                ) : (
                  <span className="text-gray-700 font-medium">{r.name}</span>
                )}
              </td>
              <td className="px-4 py-3 text-center border border-gray-200 bg-blue-50">
                {hasOdds && r.lagai ? (
                  <span className="font-semibold text-gray-800">{r.lagai}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center border border-gray-200 bg-pink-50">
                {hasOdds && r.khai ? (
                  <span className="font-semibold text-gray-800">{r.khai}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center border border-gray-200">
                <PLValue value={r.notPos} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SessionTable({ sessions }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-3 py-2.5 border border-teal-500 w-2/5">SESSION</th>
          <th className="bg-blue-200 text-gray-700 text-center text-xs font-semibold px-3 py-2.5 border border-blue-300">NO RUN</th>
          <th className="bg-pink-200 text-gray-700 text-center text-xs font-semibold px-3 py-2.5 border border-pink-300">YES RUN</th>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-3 py-2.5 border border-teal-500">NOT POS</th>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-3 py-2.5 border border-teal-500">YES POS</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((s, i) => (
          <tr key={s.id || i} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-3 py-2.5 border border-gray-200">
              <span className="text-pink-600 font-semibold text-xs">{s.name}</span>
            </td>
            <td className="px-3 py-2.5 text-center border border-gray-200 bg-blue-50">
              <div className="font-bold text-gray-800">{s.noRun}</div>
              <div className="text-xs text-gray-500">{s.noRate}</div>
            </td>
            <td className="px-3 py-2.5 text-center border border-gray-200 bg-pink-50">
              <div className="font-bold text-gray-800">{s.yesRun}</div>
              <div className="text-xs text-gray-500">{s.yesRate}</div>
            </td>
            <td className="px-3 py-2.5 text-center border border-gray-200">
              <PLValue value={s.notPos} />
            </td>
            <td className="px-3 py-2.5 text-center border border-gray-200">
              <PLValue value={s.yesPos} />
            </td>
          </tr>
        ))}
        {sessions.length === 0 && (
          <tr>
            <td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">
              No running sessions
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function MatchBetsTable({ bets }) {
  const cols = ["ID", "Client", "Rate", "Amount", "Mode", "Team", "Admin", "SST", "SS", "Agent", "My Share", "Team 1", "Team 2", "Date Time"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs min-w-[1100px]">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} className="bg-gray-50 text-gray-600 font-semibold px-3 py-2.5 border border-gray-200 text-left whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bets.map((bet, i) => (
            <tr key={i} className="hover:bg-gray-50 border-b border-gray-100">
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.id}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-800 font-medium whitespace-nowrap">{bet.client}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.rate}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.amount?.toLocaleString()}</td>
              <td className="px-3 py-2.5 border border-gray-100">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${bet.mode === "LAGAI" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                  {bet.mode}
                </span>
              </td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-700 whitespace-nowrap">{bet.team}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.admin}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.sst}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.ss}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.agent}</td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-600">{bet.myShare}</td>
              <td className="px-3 py-2.5 border border-gray-100"><PLValue value={bet.team1} /></td>
              <td className="px-3 py-2.5 border border-gray-100"><PLValue value={bet.team2} /></td>
              <td className="px-3 py-2.5 border border-gray-100 text-gray-500 whitespace-nowrap">{bet.dateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Connection-mode badge ────────────────────────────────────────────────────

function ConnectionBadge({ connected, usingFallback }) {
  if (usingFallback) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
        </span>
        Polling (SSE unavailable)
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${connected ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connected ? "bg-green-400" : "bg-yellow-400"}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? "bg-green-500" : "bg-yellow-500"}`} />
      </span>
      {connected ? "LIVE" : "Connecting…"}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MatchLiveReport() {
  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showMatchBets, setShowMatchBets] = useState(false);

  // Match ID
  const [matchId, setMatchId] = useState("1.256594918");
  const [inputId, setInputId] = useState("1.256594918");

  // Live data state
  const [runners, setRunners] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tossMsg, setTossMsg] = useState("");
  const [lastBalls, setLastBalls] = useState([]);
  const [newBatter, setNewBatter] = useState("");
  const [localScore, setLocalScore] = useState("");
  const [visitorScore, setVisitorScore] = useState("");
  const [suspendMsg, setSuspendMsg] = useState("");

  // Connection state
  const [connected, setConnected] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Refs
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const keepAliveIntervalRef = useRef(null);
  const fallbackIntervalRef = useRef(null);
  const sseFailCountRef = useRef(0);
  const reconnectAttemptsRef = useRef(0);

  // ── Server URL ──────────────────────────────────────────────────────────────
  const getServerUrl = () =>
    process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:5000";

  // ── Apply transformed data to state ────────────────────────────────────────
  const applyData = useCallback((t) => {
    if (t.runners.length > 0) setRunners(t.runners);
    if (t.sessions.length > 0) setSessions(t.sessions);
    if (t.tossMsg) setTossMsg(t.tossMsg);
    if (t.lastBalls.length > 0) setLastBalls(t.lastBalls);
    if (t.newBatter) setNewBatter(t.newBatter);
    if (t.localScore) setLocalScore(t.localScore);
    if (t.visitorScore) setVisitorScore(t.visitorScore);
    if (t.suspendMsg !== undefined) setSuspendMsg(t.suspendMsg);
    setLastUpdated(new Date());
    setLoading(false);
    setError(null);
  }, []);

  // ── Fallback: REST polling ──────────────────────────────────────────────────
  const startFallbackPolling = useCallback(
    (id) => {
      // Clear any existing poll
      if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);

      const poll = async () => {
        try {
          const res = await fetch(`${getServerUrl()}/sse/${id}/fallback`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
            applyData(transformSSEData(json.data));
          }
        } catch (err) {
          console.warn("[Fallback poll] Failed:", err.message);
          // Don't set error here — keep polling silently
        }
      };

      poll(); // immediate first hit
      fallbackIntervalRef.current = setInterval(poll, FALLBACK_POLL_INTERVAL);
      setUsingFallback(true);
      setConnected(false);
    },
    [applyData]
  );

  // ── SSE connection ──────────────────────────────────────────────────────────
  const initSSE = useCallback(
    (id) => {
      // Guard
      if (!id) return;

      // Tear down any previous connection
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);

      const sseUrl = `${getServerUrl()}/sse/${id}`;
      console.log("[SSE] Connecting:", sseUrl);

      let es;
      try {
        es = new EventSource(sseUrl);
      } catch (e) {
        console.error("[SSE] EventSource creation failed:", e);
        startFallbackPolling(id);
        return;
      }
      eventSourceRef.current = es;

      // ── onopen ──────────────────────────────────────────────────────────────
      es.onopen = () => {
        console.log("[SSE] Connected");
        setConnected(true);
        setUsingFallback(false);
        setError(null);
        sseFailCountRef.current = 0;
        reconnectAttemptsRef.current = 0;

        // Keep-alive for mobile Safari
        keepAliveIntervalRef.current = setInterval(() => {
          if (eventSourceRef.current?.readyState === EventSource.OPEN) {
            // ping is silent — the server sends ":" heartbeat lines
          }
        }, 15000);
      };

      // ── onmessage (default event) ────────────────────────────────────────────
      es.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          applyData(transformSSEData(raw));
        } catch (e) {
          console.error("[SSE] Parse error:", e);
        }
      };

      // ── Named "retry" event from server ────────────────────────────────────
      es.addEventListener("retry", (event) => {
        try {
          const { message } = JSON.parse(event.data);
          console.warn("[SSE] Server retry notice:", message);
        } catch {
          // non-critical
        }
      });

      // ── Named "error" event from server (all retries exhausted) ───────────
      es.addEventListener("error", (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.fallback) {
            console.warn("[SSE] Server signalled fallback mode");
            es.close();
            startFallbackPolling(id);
          }
        } catch {
          // handled in onerror below
        }
      });

      // ── onerror (network-level) ──────────────────────────────────────────────
      es.onerror = () => {
        console.error("[SSE] Connection error");
        setConnected(false);
        es.close();
        if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);

        sseFailCountRef.current += 1;

        if (sseFailCountRef.current >= MAX_SSE_FAILURES) {
          console.warn(`[SSE] ${MAX_SSE_FAILURES} failures — switching to fallback polling`);
          startFallbackPolling(id);
          return;
        }

        // Exponential back-off reconnect
        const delay = Math.min(5000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current += 1;
        console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
        reconnectTimeoutRef.current = setTimeout(() => initSSE(id), delay);
      };
    },
    [applyData, startFallbackPolling]
  );

  // ── Full cleanup ────────────────────────────────────────────────────────────
  const cleanupAll = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    clearTimeout(reconnectTimeoutRef.current);
    clearInterval(keepAliveIntervalRef.current);
    clearInterval(fallbackIntervalRef.current);
  }, []);

  // ── Connect / Reconnect triggered by matchId change ─────────────────────────
  useEffect(() => {
    sseFailCountRef.current = 0;
    reconnectAttemptsRef.current = 0;
    setUsingFallback(false);
    setConnected(false);
    setLoading(true);
    setError(null);
    initSSE(matchId);
    return () => cleanupAll();
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Manual connect button ────────────────────────────────────────────────────
  const handleConnect = () => {
    const trimmed = inputId.trim();
    if (!trimmed) return;
    cleanupAll();
    setRunners([]);
    setSessions([]);
    setMatchId(trimmed);
  };

  // ── Toss message renderer ───────────────────────────────────────────────────
  const renderTossMsg = () => {
    if (!tossMsg) return "Connecting to live match…";
    const raw = stripHtml(tossMsg);
    const rrrIdx = raw.indexOf("RRR");
    if (rrrIdx === -1) return raw;
    return (
      <>
        {raw.slice(0, rrrIdx)}
        <span className="text-red-500 font-bold">{raw.slice(rrrIdx)}</span>
      </>
    );
  };

  // ── Error screen ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-800 font-semibold mb-2">Connection Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={handleConnect}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────────────────
  if (loading && runners.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={40} variant="rainbow" />
          <p className="mt-4 text-gray-600 text-sm">Connecting to live match data…</p>
          <p className="text-gray-400 text-xs mt-2">Match ID: {matchId}</p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-2 py-4 md:px-4">

          {/* ─── Header bar ─── */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <div>
                <h1 className="text-base font-bold text-gray-800">Match Live Report</h1>
                <p className="text-xs text-gray-400">ID: {matchId}</p>
              </div>
            </div>
            <ConnectionBadge connected={connected} usingFallback={usingFallback} />
          </div>

          {/* ─── Fallback notice banner ─── */}
          {usingFallback && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-3 flex items-start gap-3">
              <span className="text-orange-500 text-lg mt-0.5">⚡</span>
              <div>
                <p className="text-orange-700 text-xs font-semibold">Live stream unavailable</p>
                <p className="text-orange-600 text-xs mt-0.5">
                  Switched to polling mode — data refreshes every {FALLBACK_POLL_INTERVAL / 1000}s.
                  {lastUpdated && (
                    <> Last update: {lastUpdated.toLocaleTimeString()}</>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  sseFailCountRef.current = 0;
                  cleanupAll();
                  setUsingFallback(false);
                  setLoading(true);
                  initSSE(matchId);
                }}
                className="ml-auto text-xs text-orange-700 underline whitespace-nowrap"
              >
                Retry SSE
              </button>
            </div>
          )}

          {/* ─── Manual ID Input ─── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Match ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                placeholder="Enter Match ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleConnect}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
              >
                Connect
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Current ID: {matchId}</p>
          </div>

          {/* ─── Toss / Target message ─── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
            <div className="px-5 py-4 text-center border-b border-gray-100">
              <p className="text-gray-800 font-bold text-sm md:text-base">{renderTossMsg()}</p>
              {newBatter && (
                <p className="text-yellow-600 text-xs mt-1 font-medium animate-pulse">{newBatter}</p>
              )}
              {suspendMsg && (
                <p className="text-red-500 text-xs mt-1 font-semibold uppercase tracking-widest">{suspendMsg}</p>
              )}
            </div>

            {/* Scorecard toggle */}
            <div className="px-5 py-2 flex justify-center border-b border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowScorecard(!showScorecard)}
                className="inline-flex items-center gap-1 bg-gray-800 text-white text-xs font-semibold px-5 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                {showScorecard ? "Hide Scorecard" : "Show Full Scorecard"}
              </button>
            </div>

            <div className="bg-teal-600 text-white text-center text-xs font-bold py-1.5 tracking-widest">
              CR Over — 0
            </div>
            <div className="grid grid-cols-3 border-t border-gray-200 bg-white text-sm font-semibold">
              <div className="px-3 py-3 text-left text-gray-700 border-r border-gray-200 text-xs">
                {localScore || "—"}
              </div>
              <div className="flex items-center justify-center py-3">
                <span className="text-2xl font-black text-gray-400">0</span>
              </div>
              <div className="px-3 py-3 text-right text-gray-700 border-l border-gray-200 text-xs">
                {visitorScore || "—"}
              </div>
            </div>
          </div>

          {/* ── Last balls ── */}
          {lastBalls.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 px-4 py-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-semibold">Last:</span>
              {lastBalls.map((b, i) => <BallDot key={i} cls={b.cls} val={b.val} />)}
            </div>
          )}

          {/* ── Runner / Match Odds table ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
            <RunnerTable runners={runners} />
          </div>

          {/* ── Running Session table ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
            <div className="bg-teal-600 text-white text-center text-xs font-bold py-2 tracking-widest">
              Running Session
            </div>
            <SessionTable sessions={sessions} />
          </div>

          {/* ── No data yet ── */}
          {runners.length === 0 && sessions.length === 0 && !loading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 p-8 text-center">
              <p className="text-gray-400 text-sm">Waiting for live data…</p>
              <p className="text-gray-300 text-xs mt-1">Data will appear once available from the source</p>
              {usingFallback && (
                <p className="text-orange-400 text-xs mt-2">
                  Polling every {FALLBACK_POLL_INTERVAL / 1000}s via fallback endpoint
                </p>
              )}
            </div>
          )}

          {/* ── Show Match Bets toggle ── */}
          <div className="mb-3">
            <button
              onClick={() => setShowMatchBets(!showMatchBets)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {showMatchBets ? "Hide Match Bets" : "Show Match Bets"}
            </button>
          </div>

          {showMatchBets && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Match Bets</h3>
              </div>
              <div className="p-8 text-center text-gray-400 text-sm">
                No bet data available for live match
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Scorecard modal ── */}
      {showScorecard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">Live Scorecard</h3>
              <button onClick={() => setShowScorecard(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                <p className="font-semibold mb-1">Local: {localScore || "—"}</p>
                <p className="font-semibold">Visitor: {visitorScore || "—"}</p>
                {tossMsg && <p className="text-xs text-gray-500 mt-2">{stripHtml(tossMsg)}</p>}
              </div>
              <p className="text-xs text-gray-400 text-center">
                {usingFallback
                  ? `Polling mode — refreshes every ${FALLBACK_POLL_INTERVAL / 1000}s`
                  : "Live updates streaming in real-time"}
              </p>
              {lastUpdated && (
                <p className="text-xs text-gray-400 text-center">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}