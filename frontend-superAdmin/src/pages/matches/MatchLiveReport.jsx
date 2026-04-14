import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";

// ─── Helpers ────────────────────────────────────────────────────────────────

function PLValue({ value }) {
  if (value === null || value === undefined) return <span className="text-gray-400">—</span>;
  const neg = value < 0;
  return (
    <span className={neg ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
      {value.toLocaleString("en-IN")}
    </span>
  );
}

// ─── Sub-tables ──────────────────────────────────────────────────────────────

function RunnerTable({ runners }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-500 w-1/4">RUNNER</th>
          <th className="bg-blue-200 text-gray-700 text-center text-xs font-semibold px-4 py-2.5 border border-blue-300 w-1/4">LAGAI</th>
          <th className="bg-pink-200 text-gray-700 text-center text-xs font-semibold px-4 py-2.5 border border-pink-300 w-1/4">KHAI</th>
          <th className="bg-teal-600 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-500 w-1/4">+  /  -</th>
        </tr>
      </thead>
      <tbody>
        {runners.map((r, i) => (
          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-700 font-medium border border-gray-200">{r.name}</td>
            <td className="px-4 py-3 text-center border border-gray-200 bg-blue-50">{r.lagai !== undefined ? <PLValue value={r.lagai} /> : ""}</td>
            <td className="px-4 py-3 text-center border border-gray-200 bg-pink-50">{r.khai !== undefined ? <PLValue value={r.khai} /> : ""}</td>
            <td className="px-4 py-3 text-center border border-gray-200"><PLValue value={r.plusMinus} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SessionTabTable({ sessions }) {
  const tabs = ["SESSION", "NO RUN", "YES RUN", "NOT POS", "YES POS"];
  const [activeTab] = useState("SESSION");

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 mb-0">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`px-4 py-2 text-xs font-semibold border border-gray-300 cursor-default select-none
              ${tab === "SESSION" ? "bg-teal-600 text-white" :
                tab === "YES RUN" ? "bg-pink-300 text-gray-800" :
                tab === "NOT POS" ? "bg-blue-500 text-white" :
                tab === "YES POS" ? "bg-teal-500 text-white" :
                "bg-gray-100 text-gray-700"}`}
          >
            {tab}
          </div>
        ))}
      </div>

      {sessions.map((section, si) => (
        <div key={si}>
          {/* Section header */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-teal-500 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-400 w-1/4">{section.title}</th>
                <th className="bg-blue-200 text-gray-700 text-center text-xs font-semibold px-4 py-2.5 border border-blue-300 w-1/4">Lagai</th>
                <th className="bg-pink-200 text-gray-700 text-center text-xs font-semibold px-4 py-2.5 border border-pink-300 w-1/4">Khai</th>
                <th className="bg-teal-600 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-500 w-1/4">+  /  -</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-gray-700 border border-gray-200">{row.label}</td>
                  <td className="px-4 py-3 text-center border border-gray-200 bg-blue-50">{row.lagai}</td>
                  <td className="px-4 py-3 text-center border border-gray-200 bg-pink-50">{row.khai}</td>
                  <td className="px-4 py-3 text-center border border-gray-200"><PLValue value={row.plusMinus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function DeclaredSessionTable({ sessions }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="bg-teal-500 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-400 w-1/2">Session</th>
          <th className="bg-teal-500 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-400 w-1/4">Declared Run</th>
          <th className="bg-teal-500 text-white text-center text-xs font-semibold px-4 py-2.5 border border-teal-400 w-1/4">Plus Minus</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((s, i) => (
          <tr key={i} className="hover:bg-gray-50 border-b border-gray-100">
            <td className="px-4 py-3 text-center text-gray-700 border border-gray-200">{s.session}</td>
            <td className="px-4 py-3 text-center text-gray-700 border border-gray-200">{s.declaredRun ?? ""}</td>
            <td className="px-4 py-3 text-center border border-gray-200"><PLValue value={s.plusMinus} /></td>
          </tr>
        ))}
        {/* Total row */}
        <tr className="bg-gray-50 font-semibold">
          <td className="px-4 py-3 border border-gray-200" />
          <td className="px-4 py-3 text-center text-gray-700 border border-gray-200">Total</td>
          <td className="px-4 py-3 text-center border border-gray-200">
            <PLValue value={sessions.reduce((acc, s) => acc + (s.plusMinus ?? 0), 0)} />
          </td>
        </tr>
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

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK = {
  id: "1.256639183",
  name: "Sunrisers Hyderabad VS Rajasthan Royals",
  winner: "Sunrisers Hyderabad",
  winMargin: "57 runs",
  dateTime: "14-Apr 07:30 pm",
  status: "Match End",
  team1Score: "Sunrisers Hyderabad 216-6 (20.0)",
  team2Score: "Rajasthan Royals 159-10 (19.0)",
  runners: [
    { name: "Sunrisers Hyderabad", plusMinus: -117891 },
    { name: "Rajasthan Royals", plusMinus: -1150243 },
  ],
  runningSession: [
    {
      title: "Market Tie",
      rows: [
        { label: "YES", lagai: "", khai: "", plusMinus: -22950 },
        { label: "No",  lagai: "", khai: "", plusMinus: 369 },
      ],
    },
  ],
  declaredSessions: [
    { session: "R Jadeja run",               declaredRun: 45,  plusMinus: -790 },
    { session: "D Ferreira run",              declaredRun: 69,  plusMinus: 730 },
    { session: "15 over run RR",              declaredRun: 127, plusMinus: -36688 },
    { session: "Fall of 6th wkt RR",          declaredRun: 127, plusMinus: -800 },
    { session: "10 over run RR",              declaredRun: 70,  plusMinus: 26530 },
    { session: "6 over run RR",               declaredRun: 40,  plusMinus: -5085 },
    { session: "4 over run RR",               declaredRun: 20,  plusMinus: 1375 },
    { session: "Y Jaiswal run(SRH vs RR)adv", declaredRun: 1,   plusMinus: 180 },
    { session: "R Parag run",                 declaredRun: 4,   plusMinus: -1075 },
    { session: "1st 4 wkt runs RR",           declaredRun: 2,   plusMinus: 220 },
    { session: "1 over run RR",               declaredRun: 1,   plusMinus: -25 },
    { session: "V Sooryavanshi run(SRH vs RR)adv", declaredRun: 0, plusMinus: 215 },
    { session: "Fall of 1st wkt RR(SRH vs RR)adv", declaredRun: 1, plusMinus: 155 },
    { session: "Toss Winner",   declaredRun: "Rajasthan Royals", plusMinus: 1155 },
  ],
  matchBets: [
    { id: 388, client: "Anurag (SP6131)", rate: 0.01, amount: 10000, mode: "LAGAI", team: "Sunrisers Hyderabad", admin: "raju (STAR)", sst: "", ss: "Star786 (SS236)", agent: "", myShare: "50%", team1: 50,      team2: -5000,  dateTime: "2026-04-13 10:56:04" },
    { id: 387, client: "AKRAM BHAI (SP6069)", rate: 0.02, amount: 100000, mode: "KHAI", team: "Sunrisers Hyderabad", admin: "raju (STAR)", sst: "KGN 786 NEW (SST652)", ss: "Umar (SS700)", agent: "Safa (SA701)", myShare: "25%", team1: -500, team2: 25000, dateTime: "2026-04-13 10:52:23" },
    { id: 386, client: "Farhan (SP6031)", rate: 0.02, amount: 5000, mode: "KHAI", team: "Sunrisers Hyderabad", admin: "raju (STAR)", sst: "KGN 786 NEW (SST652)", ss: "", agent: "", myShare: "75%", team1: -75, team2: 3750, dateTime: "2026-04-13 10:52:11" },
  ],
  upcomingMatch: { name: "Chennai Super Kings VS Kolkata Knight Riders", dateTime: "14-Apr 07:30 pm" },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MatchLiveReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showMatchBets, setShowMatchBets] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMatch(MOCK);
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={40} variant="rainbow" />
          <p className="mt-4 text-gray-600 text-sm">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-500">Match not found.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Back + Title */}
          <div className="mb-5 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 transition-colors text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
          
          </div>

          {/* ── Match header card ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Winner banner */}
            <div className="bg-white px-6 py-4 text-center border-b border-gray-100">
              <p className="text-gray-800 font-bold text-lg">
                {match.winner} won by {match.winMargin}
              </p>
              <button
                onClick={() => setShowScorecard(!showScorecard)}
                className="mt-2 inline-flex items-center gap-1 bg-gray-800 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-700 transition-colors"
              >
                Show Full Scorecard
              </button>
            </div>

            {/* Score row — teal header with team scores */}
            <div className="grid grid-cols-3 bg-teal-600 text-white text-sm font-semibold">
              <div className="px-4 py-3 text-center border-r border-teal-500">{match.team1Score}</div>
              <div className="px-4 py-3 text-center text-xl font-bold border-r border-teal-500">Match<br/>End</div>
              <div className="px-4 py-3 text-center">{match.team2Score}</div>
            </div>
          </div>

          {/* ── Runner table ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            <RunnerTable runners={match.runners} />
          </div>

          {/* ── Running Session ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Section label */}
            <div className="bg-teal-600 text-white text-center text-sm font-semibold py-2.5 px-4">
              Running Session
            </div>
            <SessionTabTable sessions={match.runningSession} />
          </div>

          {/* ── Declared Session ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            <div className="bg-teal-600 text-white text-center text-sm font-semibold py-2.5 px-4">
              Declared Session
            </div>
            <DeclaredSessionTable sessions={match.declaredSessions} />
          </div>

          {/* ── Show Match Bets toggle ── */}
          <div className="mb-4">
            <button
              onClick={() => setShowMatchBets(!showMatchBets)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors text-center"
            >
              {showMatchBets ? "Hide Match Bets" : "Show Match Bets"}
            </button>
          </div>

          {/* ── Match Bets table ── */}
          {showMatchBets && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Match Bets</h3>
              </div>
              <MatchBetsTable bets={match.matchBets} />
            </div>
          )}

          {/* ── Upcoming match ── */}
          <div className="bg-teal-600 text-white rounded-xl px-6 py-4 text-center">
            <p className="font-semibold text-sm">{match.upcomingMatch.name}</p>
            <p className="text-teal-100 text-xs mt-0.5">{match.upcomingMatch.dateTime}</p>
          </div>

        </div>
      </div>

      {/* ── Scorecard modal ── */}
      {showScorecard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">Full Scorecard</h3>
              <button onClick={() => setShowScorecard(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-5 text-sm text-gray-500">Scorecard details will appear here...</div>
          </div>
        </div>
      )}
    </>
  );
}