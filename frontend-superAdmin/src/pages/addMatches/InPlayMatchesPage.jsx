import { useState, useEffect } from "react";

const TOSS_OPTIONS  = ["Hide", "Show"];
const SCORE_OPTIONS = ["Over", "Ball", "Run"];

const API_BASE =  "http://localhost:5000";

export default function InPlayMatchesPage() {
  const [matches, setMatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [saving, setSaving]     = useState(null); // matchId currently being saved
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ─── Fetch live/upcoming matches from backend ──────────────────────────────
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/matches?filter=upcoming`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch matches.");

        // Normalise API shape → local shape expected by the table
        const normalised = json.data.map((m) => ({
          id:          m.matchId,
          matchId:     m.matchId,
          title:       `${m.homeTeam} vs ${m.awayTeam}`,
          sport:       m.sportKey ?? "Cricket",
          dateTime:    m.commenceTime
                         ? new Date(m.commenceTime).toLocaleString("en-IN", {
                             dateStyle: "medium",
                             timeStyle: "short",
                           })
                         : "—",
          commenceTime: m.commenceTime,
          homeTeam:    m.homeTeam,
          awayTeam:    m.awayTeam,
          sportKey:    m.sportKey,
          odds:        m.odds ?? null,
          toss:        "Hide",
          score:       "Over",
        }));

        setMatches(normalised);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // ─── Save match for logged-in user ────────────────────────────────────────
  const handleAdd = async (id) => {
    const m = matches.find((x) => x.id === id);
    if (!m) return;

    setSaving(id);
    try {
      const token = localStorage.getItem("token"); // adjust if stored differently

      const res = await fetch(`${API_BASE}/api/matches/save`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId:      m.matchId,
          homeTeam:     m.homeTeam,
          awayTeam:     m.awayTeam,
          commenceTime: m.commenceTime,
          sportKey:     m.sportKey,
          odds:         m.odds,
        }),
      });

      const json = await res.json();

      if (res.status === 409) {
        showToast("Already saved.", "warning");
        return;
      }
      if (!res.ok) throw new Error(json.message || "Could not save match.");

      showToast(`Saved: ${m.title}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(null);
    }
  };

  // ─── Remove match from local list (not from DB — use saved page for that) ─
  const handleDelete = (id) => {
    setMatches((p) => p.filter((m) => m.id !== id));
    showToast("Removed from list.", "error");
  };

  const update = (id, field, value) =>
    setMatches((p) => p.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  const selectCls =
    "border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-2xl font-bold text-gray-800 mb-5">In Play Matches</h1>

          {/* ── Error state ── */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Sport</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date/Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Toss</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Score</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Delete</th>
                  </tr>
                </thead>
                <tbody>

                  {/* ── Loading skeleton ── */}
                  {loading && Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-5 py-3">
                          <div className="h-4 bg-gray-100 rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* ── Empty state ── */}
                  {!loading && matches.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                        No matches available.
                      </td>
                    </tr>
                  )}

                  {/* ── Rows ── */}
                  {!loading && matches.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">

                      <td className="px-5 py-3 text-gray-800 font-medium">{m.title}</td>

                      <td className="px-4 py-3 text-gray-600">{m.sport}</td>

                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap tabular-nums">{m.dateTime}</td>

                      <td className="px-4 py-3">
                        <select value={m.toss} onChange={(e) => update(m.id, "toss", e.target.value)}
                          className={selectCls}>
                          {TOSS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <select value={m.score} onChange={(e) => update(m.id, "score", e.target.value)}
                          className={selectCls}>
                          {SCORE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleAdd(m.id)}
                          disabled={saving === m.id}
                          className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors min-w-[52px]">
                          {saving === m.id ? "..." : "Add"}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(m.id)}
                          className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl z-50 text-white transition-all
          ${toast.type === "error"   ? "bg-red-500"    : ""}
          ${toast.type === "warning" ? "bg-amber-500"  : ""}
          ${toast.type === "success" ? "bg-teal-500"   : ""}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}