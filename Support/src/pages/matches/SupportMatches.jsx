import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, logout } from "@/services/api";

const COLOR = "#32759A";
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
    { label: "HOME", path: "/support/matches" },
    { label: "Add Match", path: "/support/matches/add" },
    { label: "Master Page", path: "/support/master" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav style={{ background: COLOR }} className="sticky top-0 z-50 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-white text-lg sm:text-xl font-semibold tracking-wide truncate">
            {import.meta.env.VITE_APP_NAME || "Support"}
          </span>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                className="text-white/90 text-sm font-medium hover:text-white transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-all duration-200"
            >
              LOGOUT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-2 border-t border-white/20 space-y-1">
            {links.map((l) => (
              <button
                key={l.path}
                onClick={() => handleNavClick(l.path)}
                className="block w-full text-left text-white/90 text-sm font-medium px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="block w-full text-left text-white text-sm font-medium px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Page Component ──────────────────────────────────────────────────────────
export default function SupportMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/matches/saved");
      setMatches(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch matches");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRefresh = () => fetchMatches(true);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center sm:text-left"
            style={{ color: COLOR }}
          >
            In Play Matches
          </h1>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed self-center sm:self-auto"
            style={{ background: COLOR_LIGHT, color: COLOR }}
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 border-4 rounded-full animate-spin"
              style={{ borderColor: `${COLOR}22`, borderTopColor: COLOR }}
            />
            <p className="text-sm text-gray-400">Loading matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center gap-4 py-12 sm:py-16">
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-6 py-4 text-sm text-center max-w-md">
              <p className="font-medium mb-1">Failed to load matches</p>
              <p className="text-red-400 break-words">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="text-sm font-medium px-5 py-2 rounded-lg border transition-all duration-200 hover:opacity-80"
              style={{ color: COLOR, borderColor: COLOR }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No saved matches found.</p>
            <button
              onClick={() => navigate("/support/matches/add")}
              className="mt-2 text-sm font-medium px-5 py-2 rounded-lg transition-all duration-200"
              style={{ background: COLOR, color: "white" }}
            >
              + Add Your First Match
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {matches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Enhanced Match Card ──────────────────────────────────────────────────────
function MatchCard({ match }) {
  const navigate = useNavigate();
  const upcoming = isUpcoming(match.commenceTime);

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Card Header */}
      <div className="px-4 py-3 flex items-center justify-between gap-2" style={{ background: COLOR }}>
        <span className="text-white text-xs font-semibold tracking-wide uppercase truncate">
          {formatSport(match.sportKey)}
        </span>
        <span
          className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm"
          style={
            upcoming
              ? { background: "#fef9c3", color: "#92400e" }
              : { background: "#bbf7d0", color: "#065f46" }
          }
        >
          {upcoming ? "UPCOMING" : "LIVE"}
        </span>
      </div>

      {/* Teams Section */}
      <div className="px-4 py-4 sm:py-5" style={{ background: COLOR_LIGHT }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5 font-medium">Home</p>
            <p className="text-sm sm:text-base font-bold truncate" style={{ color: COLOR }}>
              {match.homeTeam || "—"}
            </p>
          </div>
          <div
            className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200
                        flex items-center justify-center text-xs font-bold text-gray-400 shadow-sm"
          >
            VS
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-xs text-gray-500 mb-0.5 font-medium">Away</p>
            <p className="text-sm sm:text-base font-bold truncate" style={{ color: COLOR }}>
              {match.awayTeam || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        {/* Date & Time Row */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 shrink-0" style={{ color: COLOR }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium text-gray-700">{formatDate(match.commenceTime)}</span>
          <span className="text-gray-300">•</span>
          <span>{formatTime(match.commenceTime)}</span>
        </div>

        {/* Odds Row */}
        {match.odds && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 shrink-0" style={{ color: COLOR }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Odds Range:</span>
            <span
              className="font-semibold px-2 py-0.5 rounded text-xs"
              style={{ background: COLOR_LIGHT, color: COLOR }}
            >
              {match.odds.minRate}
            </span>
            <span className="text-gray-300">→</span>
            <span
              className="font-semibold px-2 py-0.5 rounded text-xs"
              style={{ background: COLOR_LIGHT, color: COLOR }}
            >
              {match.odds.maxRate}
            </span>
          </div>
        )}

       
      </div>

      {/* Card Footer Button */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={() => navigate(`/support/matches/${match._id}`)}
          className="w-full text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl
                     transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
          style={{ background: COLOR }}
        >
          View Match Details →
        </button>
      </div>
    </div>
  );
}