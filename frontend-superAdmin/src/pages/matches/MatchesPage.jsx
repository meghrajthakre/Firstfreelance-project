import { useState, useMemo } from "react";

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

// Dropdown menu for Action button
function ActionMenu({ onClose }) {
  return (
    <div className="absolute left-0 top-9 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] py-1"
      onClick={e => e.stopPropagation()}>
      {["View Details", "Edit Match", "Declare Result", "Delete"].map(item => (
        <button key={item} onClick={onClose}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          {item}
        </button>
      ))}
    </div>
  );
}

export default function MatchesPage() {
  const [page, setPage]           = useState(1);
  const [openAction, setOpenAction] = useState(null);

  const totalPages = Math.ceil(ALL_MATCHES.length / PAGE_SIZE);

  const rows = useMemo(() =>
    ALL_MATCHES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page]
  );

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

      <div className="min-h-screen bg-gray-100 p-3" onClick={handleWrapperClick}>
        <div className="max-w-7xl mx-auto">

          <h1 className="text-2xl font-bold text-gray-800 mb-5">Matches</h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-28"></th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Match ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date/Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Declare</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Won</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Profit &amp; Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(match => (
                    <tr key={match.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">

                      {/* Action button */}
                      <td className="px-4 py-3">
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenAction(openAction === match.id ? null : match.id)}
                            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                            Action
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </button>
                          {openAction === match.id && (
                            <ActionMenu onClose={() => setOpenAction(null)} />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-600 tabular-nums">{match.matchId}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{match.name}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{match.dateTime}</td>
                      <td className="px-4 py-3 text-gray-700">{match.declare}</td>
                      <td className="px-4 py-3 text-gray-700">{match.won}</td>
                      <td className="px-4 py-3 text-right">
                        <PLCell value={match.pl} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 px-5 py-4 border-t border-gray-100">
              {/* Prev */}
              <button disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                &lt;
              </button>

              {visiblePages.map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded font-medium transition-colors
                    ${page === p
                      ? "bg-teal-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"}`}>
                  {p}
                </button>
              ))}

              {/* Next */}
              <button disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                &gt;
              </button>

              {/* Last */}
              <button onClick={() => setPage(totalPages)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
                Last
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}