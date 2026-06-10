import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, logout } from "@/services/api";

const COLOR      = "#32759A";
const COLOR_LIGHT = "#e8f4fa";

// ── helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";

const formatSport = (key) =>
  key ? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

const isUpcoming = (iso) => iso && new Date(iso) > new Date();

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "HOME",        path: "/support/matches" },
    { label: "Add Match",   path: "/support/matches/add" },
    { label: "Master Page", path: "/support/master" },
  ];

  return (
    <nav style={{ background: COLOR }} className="px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-white text-base sm:text-lg font-semibold tracking-wide">
          {import.meta.env.VITE_APP_NAME || "Support"}
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <button key={l.path} onClick={() => navigate(l.path)}
              className="text-white/90 text-sm font-medium hover:text-white transition">
              {l.label}
            </button>
          ))}
          <button onClick={onLogout}
            className="text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">
            LOGOUT
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen((p) => !p)}
          className="md:hidden text-white p-1 rounded focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 pb-2 flex flex-col gap-1 border-t border-white/20 pt-2">
          {links.map((l) => (
            <button key={l.path} onClick={() => { navigate(l.path); setMenuOpen(false); }}
              className="text-white/90 text-sm font-medium text-left px-2 py-2 hover:bg-white/10 rounded-lg transition">
              {l.label}
            </button>
          ))}
          <button onClick={onLogout}
            className="text-white text-sm font-medium text-left px-2 py-2 hover:bg-white/10 rounded-lg transition">
            LOGOUT
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SupportMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get("/matches/saved");
      setMatches(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-widest"
            style={{ color: COLOR }}>
            IN PLAY MATCHES
          </h1>
          {!loading && !error && (
            <span className="text-xs sm:text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full">
              {matches.length} match{matches.length !== 1 ? "es" : ""}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-9 h-9 border-4 rounded-full animate-spin"
              style={{ borderColor: `${COLOR}22`, borderTopColor: COLOR }} />
            <span className="text-sm text-gray-400">Loading matches...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-6 py-4 text-sm text-center max-w-sm">
              <p className="font-medium mb-1">Failed to load matches</p>
              <p className="text-red-400">{error}</p>
            </div>
            <button onClick={fetchMatches}
              className="text-sm font-medium px-4 py-2 rounded-lg border transition"
              style={{ color: COLOR, borderColor: COLOR }}>
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-sm">No saved matches found.</p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {matches.map((match, i) => (
              <MatchCard key={match._id || i} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function MatchCard({ match }) {
  const navigate  = useNavigate();
  const upcoming  = isUpcoming(match.commenceTime);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden
                    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* Card header */}
      <div className="px-4 py-3 flex items-center justify-between gap-2"
        style={{ background: COLOR }}>
        <span className="text-white text-xs font-medium tracking-wide uppercase truncate">
          {formatSport(match.sportKey)}
        </span>
        <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
          style={upcoming
            ? { background: "#fef9c3", color: "#92400e" }
            : { background: "#bbf7d0", color: "#065f46" }}>
          {upcoming ? "UPCOMING" : "LIVE"}
        </span>
      </div>

      {/* Teams row */}
      <div className="px-4 py-4" style={{ background: COLOR_LIGHT }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Home</p>
            <p className="text-sm font-bold truncate" style={{ color: COLOR }}>
              {match.homeTeam || "—"}
            </p>
          </div>
          <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200
                          flex items-center justify-center text-xs font-bold text-gray-400">
            VS
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-xs text-gray-500 mb-0.5">Away</p>
            <p className="text-sm font-bold truncate" style={{ color: COLOR }}>
              {match.awayTeam || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-3 flex flex-col gap-2.5 flex-1">

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 shrink-0" style={{ color: COLOR }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-gray-700">{formatDate(match.commenceTime)}</span>
          <span className="text-gray-300">|</span>
          <span>{formatTime(match.commenceTime)}</span>
        </div>

        {/* Odds */}
        {match.odds && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 shrink-0" style={{ color: COLOR }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Odds:</span>
            <span className="font-semibold px-1.5 py-0.5 rounded text-[11px]"
              style={{ background: COLOR_LIGHT, color: COLOR }}>
              {match.odds.minRate}
            </span>
            <span className="text-gray-300">–</span>
            <span className="font-semibold px-1.5 py-0.5 rounded text-[11px]"
              style={{ background: COLOR_LIGHT, color: COLOR }}>
              {match.odds.maxRate}
            </span>
          </div>
        )}

        {/* Match ID */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <span className="font-mono truncate">{match.matchId?.slice(0, 20)}…</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={() => navigate(`/support/matches/${match._id}`)}
          className="w-full text-white text-xs font-semibold py-2.5 rounded-xl
                     transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: COLOR }}>
          Open Match →
        </button>
      </div>
    </div>
  );
}