import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, logout } from "@/services/api";

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
      setMatches(data.data?.matches || data.data || data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <nav className="bg-gradient-to-r from-[#1a2a5e] to-[#2a3f8f] px-8 py-4 flex items-center justify-between">
        <span className="text-white text-lg font-semibold tracking-wide">Nicee7777</span>
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/support/matches")} className="text-white text-sm font-medium hover:opacity-80 transition">HOME</button>
          <button onClick={() => navigate("/support/matches/add")} className="text-white text-sm font-medium hover:opacity-80 transition">Add Match</button>
          <button onClick={() => navigate("/support/master")} className="text-white text-sm font-medium hover:opacity-80 transition">Master Page</button>
          <button onClick={handleLogout} className="text-white text-sm font-medium hover:opacity-80 transition">LOGOUT</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-center text-[#1a2a5e] text-3xl font-semibold tracking-widest mb-10">
          IN PLAY MATCHES
        </h1>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#1a2a5e]/20 border-t-[#1a2a5e] rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-lg px-6 py-4 max-w-md mx-auto">
            {error}
            <button onClick={fetchMatches} className="block mx-auto mt-3 text-sm text-[#1a2a5e] underline">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-20">No live matches at the moment.</p>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((match, i) => (
              <MatchCard key={match._id || match.id || i} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1a2a5e] to-[#2a3f8f] px-4 py-3 flex items-center justify-between">
        <span className="text-white text-xs font-medium tracking-wide uppercase truncate">
          {match.competition?.name || match.league || match.series || "Match"}
        </span>
        <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">LIVE</span>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#1a2a5e] text-sm font-semibold truncate max-w-[40%]">
            {match.teams?.[0]?.name || match.team1 || match.home || "Team A"}
          </span>
          <span className="text-gray-400 text-xs">vs</span>
          <span className="text-[#1a2a5e] text-sm font-semibold truncate max-w-[40%] text-right">
            {match.teams?.[1]?.name || match.team2 || match.away || "Team B"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
          <span>{match.matchType || match.type || "T20"}</span>
          <span>{match.venue || match.stadium || "—"}</span>
          <span>{match.status || "In Play"}</span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button className="w-full bg-[#1a2a5e] hover:bg-[#2a3f8f] text-white text-xs font-medium py-2 rounded-lg transition-colors">
          Open Match
        </button>
      </div>
    </div>
  );
}