import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon";

const ALL_MATCHES = [
  { id: 1, matchId: "1.255585123", name: "New Zealand VS South Africa",   dateTime: "2026-03-22 11:45 am", declare: "Yes", won: "South Africa",   pl: -25098.8 },
  { id: 2, matchId: "1.255584935", name: "New Zealand W VS South Africa W", dateTime: "2026-03-22 07:15 am", declare: "Yes", won: "New Zealand W",  pl: 19665.9 },
  { id: 3, matchId: "1.255578482", name: "West Indies W VS Australia W",   dateTime: "2026-03-22 04:00 am", declare: "Yes", won: "Australia W",     pl: 37198.5 },
  { id: 4, matchId: "1.255458334", name: "New Zealand VS South Africa",   dateTime: "2026-03-20 11:45 am", declare: "Yes", won: "New Zealand",      pl: 95054.3 },
  { id: 5, matchId: "1.255458555", name: "New Zealand W VS South Africa W", dateTime: "2026-03-20 07:15 am", declare: "Yes", won: "New Zealand W",  pl: 31263.8 },
  { id: 6, matchId: "1.255262676", name: "West Indies W VS Australia W",   dateTime: "2026-03-19 10:30 pm", declare: "Yes", won: "Australia W",     pl: 69155.0 },
  { id: 7, matchId: "1.255340970", name: "New Zealand VS South Africa",   dateTime: "2026-03-17 11:45 am", declare: "Yes", won: "New Zealand",      pl: 39045.4 },
  { id: 8, matchId: "1.255340460", name: "New Zealand W VS South Africa W", dateTime: "2026-03-17 07:15 am", declare: "Yes", won: "South Africa W", pl: 5424.7 },
  { id: 9, matchId: "1.255254071", name: "Bangladesh VS Pakistan",        dateTime: "2026-03-15 01:45 pm", declare: "Yes", won: "Bangladesh",       pl: 127121.9 },
  { id: 10, matchId: "1.255183167", name: "New Zealand VS South Africa",  dateTime: "2026-03-15 11:45 am", declare: "Yes", won: "South Africa",     pl: 172291.0 },
  { id: 11, matchId: "1.255102345", name: "India VS Australia",           dateTime: "2026-03-14 02:30 pm", declare: "Yes", won: "India",            pl: -15430.5 },
  { id: 12, matchId: "1.254998765", name: "England VS West Indies",       dateTime: "2026-03-13 06:00 pm", declare: "Yes", won: "England",          pl: 88234.0 },
  { id: 13, matchId: "1.254876543", name: "Pakistan VS Sri Lanka",        dateTime: "2026-03-12 10:00 am", declare: "Yes", won: "Sri Lanka",        pl: -9876.3 },
  { id: 14, matchId: "1.254765432", name: "South Africa VS Zimbabwe",     dateTime: "2026-03-11 03:00 pm", declare: "Yes", won: "South Africa",     pl: 44500.0 },
  { id: 15, matchId: "1.254654321", name: "Australia VS New Zealand",     dateTime: "2026-03-10 09:30 am", declare: "Yes", won: "Australia",        pl: 67890.5 },
  { id: 16, matchId: "1.254543210", name: "India VS England",             dateTime: "2026-03-09 01:00 pm", declare: "Yes", won: "India",            pl: -33210.0 },
  { id: 17, matchId: "1.254432109", name: "Bangladesh VS West Indies",    dateTime: "2026-03-08 11:00 am", declare: "Yes", won: "West Indies",      pl: 21345.7 },
  { id: 18, matchId: "1.254321098", name: "Sri Lanka VS Pakistan",        dateTime: "2026-03-07 08:00 am", declare: "Yes", won: "Pakistan",         pl: 55678.2 },
  { id: 19, matchId: "1.254210987", name: "Zimbabwe VS Afghanistan",      dateTime: "2026-03-06 04:30 pm", declare: "Yes", won: "Afghanistan",      pl: -7654.9 },
  { id: 20, matchId: "1.254100876", name: "Australia VS England",         dateTime: "2026-03-05 02:00 pm", declare: "Yes", won: "England",          pl: 99123.4 },
  { id: 21, matchId: "1.253990765", name: "India VS South Africa",        dateTime: "2026-03-04 10:30 am", declare: "Yes", won: "India",            pl: 143200.0 },
  { id: 22, matchId: "1.253880654", name: "New Zealand VS Pakistan",      dateTime: "2026-03-03 07:00 am", declare: "Yes", won: "New Zealand",      pl: -18900.6 },
  { id: 23, matchId: "1.253770543", name: "West Indies VS Bangladesh",    dateTime: "2026-03-02 12:00 pm", declare: "Yes", won: "West Indies",      pl: 34560.1 },
  { id: 24, matchId: "1.253660432", name: "England VS Sri Lanka",         dateTime: "2026-03-01 09:00 am", declare: "Yes", won: "Sri Lanka",        pl: 76540.8 },
  { id: 25, matchId: "1.253550321", name: "Australia VS India",           dateTime: "2026-02-28 03:30 pm", declare: "Yes", won: "Australia",        pl: -42100.3 },
  { id: 26, matchId: "1.253440210", name: "Pakistan VS Zimbabwe",         dateTime: "2026-02-27 06:00 pm", declare: "Yes", won: "Pakistan",         pl: 28900.5 },
  { id: 27, matchId: "1.253330109", name: "South Africa VS Bangladesh",   dateTime: "2026-02-26 01:30 pm", declare: "Yes", won: "South Africa",     pl: 61230.7 },
  { id: 28, matchId: "1.253219998", name: "New Zealand VS England",       dateTime: "2026-02-25 08:30 am", declare: "Yes", won: "England",          pl: -5640.2 },
  { id: 29, matchId: "1.253109887", name: "India VS West Indies",         dateTime: "2026-02-24 11:00 am", declare: "Yes", won: "India",            pl: 112000.0 },
  { id: 30, matchId: "1.252999776", name: "Afghanistan VS Sri Lanka",     dateTime: "2026-02-23 05:00 pm", declare: "Yes", won: "Afghanistan",      pl: 18750.9 },
];

const PAGE_SIZE = 10;

function PLCell({ value }) {
  const isNeg = value < 0;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${isNeg ? "text-red-500" : "text-green-600"}`}>
      {value.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      {isNeg
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
      }
    </span>
  );
}

function ActionMenu({ onClose, matchId }) {
  const navigate = useNavigate();

  const handleAction = (action) => {
    onClose();
    const basePath = `/superadmin/matches/${matchId}`;
    const actionPaths = {
      "Match Live Report": `${basePath}/live-report`,
      "Live Report Admin Sharing": `${basePath}/admin-sharing`,
      "Client Report / Profit Loss": `${basePath}/client-report`,
      "Match & Session Plus Minus": `${basePath}/plus-minus`,
      "Session Plus Minus": `${basePath}/session-plus-minus`,
      "Display Match Bets": `${basePath}/match-bets`,
      "Display Session Bets": `${basePath}/session-bets`,
    };
    const path = actionPaths[action];
    if (path) navigate(path);
  };

  const menuItems = [
    {
      label: "Match Live Report",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    {
      label: "Live Report Admin Sharing",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      ),
    },
    {
      label: "Client Report / Profit Loss",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
    {
      label: "Match & Session Plus Minus",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
    {
      label: "Session Plus Minus",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: "Display Match Bets",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      label: "Display Session Bets",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      className="absolute left-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[220px] py-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Match Actions
        </span>
      </div>
      {menuItems.map((item, idx) => (
        <button
          key={idx}
          onClick={() => handleAction(item.label)}
          className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-150 flex items-center gap-2.5 group"
        >
          <span className="text-gray-400 group-hover:text-teal-500 transition-colors duration-150">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function MatchesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  // Filter matches based on search
  const filteredMatches = useMemo(() => {
    if (!search) return ALL_MATCHES;
    return ALL_MATCHES.filter(match => 
      match.name.toLowerCase().includes(search.toLowerCase()) ||
      match.matchId.includes(search)
    );
  }, [search]);

  const totalPages = Math.ceil(filteredMatches.length / PAGE_SIZE);

  const rows = useMemo(() =>
    filteredMatches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page, filteredMatches]
  );

  // Reset to page 1 when search changes - FIXED: Changed useState to useEffect
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Close dropdown on outside click
  const handleWrapperClick = () => setOpenAction(null);

  // Pagination helpers
  const pages = useMemo(() => {
    const p = [];
    for (let i = 1; i <= totalPages; i++) p.push(i);
    return p;
  }, [totalPages]);

  // Show max 3 page numbers around current
  const visiblePages = pages.slice(Math.max(0, page - 2), Math.min(totalPages, page + 1));

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen p-2" onClick={handleWrapperClick}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">Matches</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-wrap gap-3">
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Search:</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Match name or ID…"
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-teal-400 w-64"
                />
              </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 w-28">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200">Match ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 whitespace-nowrap">Date/Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200">Declare</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200">Won</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 whitespace-nowrap">Profit &amp; Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                        No matches found.
                       </td>
                    </tr>
                  ) : (
                    rows.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                        {/* Action button */}
                        <td className="px-4 py-3 border border-gray-100">
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setOpenAction(openAction === match.id ? null : match.id)}
                              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer w-full justify-center"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="19" cy="12" r="1"/>
                                <circle cx="5" cy="12" r="1"/>
                              </svg>
                              Actions
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${openAction === match.id ? 'rotate-180' : ''}`}>
                                <polyline points="6 9 12 15 18 9"/>
                              </svg>
                            </button>
                            {openAction === match.id && (
                              <ActionMenu onClose={() => setOpenAction(null)} matchId={match.id} />
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 border border-gray-100 text-gray-600 tabular-nums">{match.matchId}</td>
                        <td className="px-4 py-3 border border-gray-100 font-medium text-gray-800">{match.name}</td>
                        <td className="px-4 py-3 border border-gray-100 text-gray-600 whitespace-nowrap">{match.dateTime}</td>
                        <td className="px-4 py-3 border border-gray-100">
                          {match.declare === "Yes" ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
                              <Icon d="M20 6L9 17l-5-5" size={11} /> Declared
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 border border-gray-100 text-gray-700">{match.won}</td>
                        <td className="px-4 py-3 border border-gray-100 text-right">
                          <PLCell value={match.pl} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &lt;
                </button>
                
                {visiblePages.map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded font-medium transition-colors
                      ${page === p
                        ? "bg-teal-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {p}
                  </button>
                ))}
                
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &gt;
                </button>
                
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
                >
                  Last
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}