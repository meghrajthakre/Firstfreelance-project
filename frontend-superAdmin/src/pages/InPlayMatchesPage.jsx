import { useState } from "react";

const INITIAL_MATCHES = [
  { id: 1,  title: "Lucknow Super Giants vs Delhi Capitals",  sport: "Cricket", dateTime: "2026-04-01 18:30:00", toss: "Hide", score: "Over" },
  { id: 2,  title: "Punjab Kings vs Gujarat Titans",          sport: "Cricket", dateTime: "2026-03-31 18:30:00", toss: "Hide", score: "Over" },
  { id: 3,  title: "Rajasthan Royals vs Chennai Super Kings", sport: "Cricket", dateTime: "2026-03-30 18:30:00", toss: "Hide", score: "Over" },
  { id: 4,  title: "Mumbai Indians vs Kolkata Knight Riders", sport: "Cricket", dateTime: "2026-03-29 18:30:00", toss: "Hide", score: "Over" },
  { id: 5,  title: "Multan Sultans vs Islamabad United",      sport: "Cricket", dateTime: "2026-03-28 20:30:00", toss: "Hide", score: "Over" },
  { id: 6,  title: "RC Bengaluru vs Sunrisers Hyderabad",     sport: "Cricket", dateTime: "2026-03-28 19:30:00", toss: "Hide", score: "Over" },
  { id: 7,  title: "Peshawar Zalmi vs Rawalpindi Pindiz",     sport: "Cricket", dateTime: "2026-03-28 15:00:00", toss: "Hide", score: "Over" },
  { id: 8,  title: "Quetta Gladiators vs Karachi Kings",      sport: "Cricket", dateTime: "2026-03-27 20:30:00", toss: "Hide", score: "Over" },
  { id: 9,  title: "Lahore Qalandars vs Hyderabad Kingsmen",  sport: "Cricket", dateTime: "2026-03-26 20:30:00", toss: "Hide", score: "Over" },
  { id: 10, title: "Delhi Capitals vs Mumbai Indians",        sport: "Cricket", dateTime: "2026-03-25 19:30:00", toss: "Hide", score: "Over" },
  { id: 11, title: "Gujarat Titans vs Rajasthan Royals",      sport: "Cricket", dateTime: "2026-03-24 18:30:00", toss: "Hide", score: "Over" },
  { id: 12, title: "Chennai Super Kings vs Punjab Kings",     sport: "Cricket", dateTime: "2026-03-23 18:30:00", toss: "Hide", score: "Over" },
];

const TOSS_OPTIONS  = ["Hide", "Show"];
const SCORE_OPTIONS = ["Over", "Ball", "Run"];

export default function InPlayMatchesPage() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2200);
  };

  const update = (id, field, value) =>
    setMatches(p => p.map(m => m.id === id ? { ...m, [field]: value } : m));

  const handleAdd = id => {
    const m = matches.find(x => x.id === id);
    showToast(`Added: ${m.title}`);
  };

  const handleDelete = id => {
    setMatches(p => p.filter(m => m.id !== id));
    showToast("Match deleted", true);
  };

  const selectCls = "border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer";

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-2xl font-bold text-gray-800 mb-5">In Play Matches</h1>

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
                  {matches.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-gray-400">No matches found.</td>
                    </tr>
                  )}
                  {matches.map(m => (
                    <tr key={m.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">

                      {/* Title */}
                      <td className="px-5 py-3 text-gray-800 font-medium">{m.title}</td>

                      {/* Sport */}
                      <td className="px-4 py-3 text-gray-600">{m.sport}</td>

                      {/* Date/Time */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap tabular-nums">{m.dateTime}</td>

                      {/* Toss dropdown */}
                      <td className="px-4 py-3">
                        <select value={m.toss} onChange={e => update(m.id, "toss", e.target.value)}
                          className={selectCls}>
                          {TOSS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>

                      {/* Score dropdown */}
                      <td className="px-4 py-3">
                        <select value={m.score} onChange={e => update(m.id, "score", e.target.value)}
                          className={selectCls}>
                          {SCORE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>

                      {/* Add button */}
                      <td className="px-4 py-3">
                        <button onClick={() => handleAdd(m.id)}
                          className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors">
                          Add
                        </button>
                      </td>

                      {/* Delete */}
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

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl z-50 text-white
          ${toast.err ? "bg-red-500" : "bg-teal-500"}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}