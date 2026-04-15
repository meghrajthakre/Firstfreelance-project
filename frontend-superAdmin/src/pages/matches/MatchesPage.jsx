import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon";
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreVertical,
  Filter,
  Calendar,
  Trophy,
  TrendingUp,
  TrendingDown
} from "lucide-react";

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
  const Icon = isNeg ? TrendingDown : TrendingUp;
  
  return (
    <div className={`inline-flex items-center gap-2 font-bold tabular-nums px-3 py-1.5 rounded-lg ${
      isNeg 
        ? "text-red-600 bg-red-50" 
        : "text-green-600 bg-green-50"
    }`}>
      <Icon size={14} className={isNeg ? "text-red-500" : "text-green-500"} />
      <span>₹ {Math.abs(value).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
      {isNeg && <span className="text-xs">(Loss)</span>}
    </div>
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
    { label: "Match Live Report", icon: "📊", color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Live Report Admin Sharing", icon: "📤", color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Client Report / Profit Loss", icon: "💰", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "Match & Session Plus Minus", icon: "➕", color: "text-orange-600", bgColor: "bg-orange-50" },
    { label: "Session Plus Minus", icon: "⏱️", color: "text-pink-600", bgColor: "bg-pink-50" },
    { label: "Display Match Bets", icon: "🎲", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { label: "Display Session Bets", icon: "📋", color: "text-cyan-600", bgColor: "bg-cyan-50" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        className="absolute left-0 top-full mt-2 z-20 bg-white rounded-xl shadow-2xl min-w-[280px] py-2 animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Match Actions
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto py-1">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleAction(item.label)}
              className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${item.bgColor} ${item.color} group-hover:scale-105`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <span className="flex-1">{item.label}</span>
              <svg className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Click to navigate</p>
        </div>
      </div>
    </>
  );
}

// Mobile Card View Component
function MatchCard({ match, onActionClick, isOpen }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="text-xs text-gray-500 font-mono mb-1">{match.matchId}</div>
          <h3 className="font-bold text-gray-800 text-base">{match.name}</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => onActionClick(match.id)}
            className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          {isOpen === match.id && (
            <ActionMenu onClose={() => onActionClick(null)} matchId={match.id} />
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} /> Date/Time
          </span>
          <span className="text-sm font-medium text-gray-700">{match.dateTime}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Status</span>
          {match.declare === "Yes" ? (
            <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              <Trophy size={10} /> Declared
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-gray-400 text-white text-xs font-semibold px-2 py-1 rounded">
              Pending
            </span>
          )}
        </div>
        
        {match.declare === "Yes" && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Winner</span>
            <span className="text-sm font-semibold text-gray-800">{match.won}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Profit/Loss</span>
          <PLCell value={match.pl} />
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleWrapperClick = () => setOpenAction(null);
  const visiblePages = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages.slice(Math.max(0, page - 2), Math.min(totalPages, page + 1));
  }, [page, totalPages]);

  const summary = {
    total: filteredMatches.length,
    declared: filteredMatches.filter(m => m.declare === "Yes").length,
    totalPL: filteredMatches.reduce((sum, m) => sum + m.pl, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" onClick={handleWrapperClick}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Matches
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">Manage and monitor all cricket matches</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Matches</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">{summary.total}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Declared</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{summary.declared}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total P&L</div>
            <div className={`text-2xl font-bold mt-1 ${summary.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹ {summary.totalPL.toLocaleString("en-IN", { minimumFractionDigits: 1 })}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-500">
                Showing {rows.length} of {filteredMatches.length} matches
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by match name or ID..."
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          {!isMobile && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Match ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Winner</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Profit & Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <Filter size={48} className="text-gray-300" />
                          <p>No matches found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rows.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setOpenAction(openAction === match.id ? null : match.id)}
                              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                              <MoreVertical size={14} />
                              Actions
                              <ChevronDown size={14} className={`transition-transform duration-200 ${openAction === match.id ? 'rotate-180' : ''}`} />
                            </button>
                            {openAction === match.id && (
                              <ActionMenu onClose={() => setOpenAction(null)} matchId={match.id} />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-600">{match.matchId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">{match.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{match.dateTime}</td>
                        <td className="px-6 py-4">
                          {match.declare === "Yes" ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                              <Trophy size={12} /> Declared
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {match.declare === "Yes" ? (
                            <span className="text-sm font-semibold text-gray-700">{match.won}</span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <PLCell value={match.pl} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <div className="p-4">
              {rows.length === 0 ? (
                <div className="text-center py-12">
                  <Filter size={48} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400">No matches found</p>
                </div>
              ) : (
                rows.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onActionClick={setOpenAction}
                    isOpen={openAction}
                  />
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-gray-500 text-center sm:text-left">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-1 px-2">
                    {visiblePages.map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-[36px] h-9 text-sm rounded-lg font-medium transition-all duration-200
                          ${page === p
                            ? "bg-teal-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-200"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-top-2 { animation-name: slideInFromTop; }
      `}</style>
    </div>
  );
}