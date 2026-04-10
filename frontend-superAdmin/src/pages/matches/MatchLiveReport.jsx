import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon";

export default function MatchLiveReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScorecard, setShowScorecard] = useState(false);

  useEffect(() => {
    // Fetch match details using the id
    const fetchMatchDetails = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        // const response = await getMatchById(id);
        // setMatch(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setMatch({
            id: id,
            name: "Lucknow Super Giants VS Kolkata Knight Riders",
            winner: "Lucknow Super Giants",
            winMargin: "3 wickets",
            dateTime: "2026-04-10 07:30 pm",
            status: "Match End",
            runnerData: {
              "Kolkata Knight Riders": -522131,
              "Lucknow Super Giants": -317029
            },
            sessionData: {
              "Market Tie": { noRun: 0, yesRun: 0, notPos: 0, yesPos: 0 },
              "Lagai": { noRun: 0, yesRun: 0, notPos: 0, yesPos: 0 },
              "Khai": { noRun: 0, yesRun: 0, notPos: 0, yesPos: 0 }
            }
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching match details:", error);
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Match not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-teal-500 hover:text-teal-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="mb-5 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Match Live Report</h1>
          </div>

          {/* Match Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{match.name}</h2>
              <p className="text-center text-gray-500 text-sm">{match.dateTime}</p>
            </div>
            
            <div className="p-6 text-center bg-gradient-to-r from-teal-50 to-blue-50">
              <h3 className="text-2xl font-bold text-teal-600 mb-2">
                {match.winner} won by {match.winMargin}
              </h3>
              <button 
                onClick={() => setShowScorecard(!showScorecard)}
                className="text-teal-500 hover:text-teal-600 text-sm font-medium flex items-center gap-1 mx-auto"
              >
                Show Full Scorecard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Scorecard Modal */}
          {showScorecard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Full Scorecard</h3>
                  <button onClick={() => setShowScorecard(false)} className="text-gray-400 hover:text-gray-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Scorecard details will be displayed here...</p>
                </div>
              </div>
            </div>
          )}

          {/* Match Status Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {match.status}
            </span>
          </div>

          {/* Runner Stats Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">RUNNER</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">LAGAI</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">KHAI</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(match.runnerData).map(([runner, value]) => (
                    <tr key={runner} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{runner}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${value < 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {value.toLocaleString()}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${value < 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {value.toLocaleString()}
                        </span>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Running Session Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Running Session</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SESSION</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">NO RUN</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">YES RUN</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">NOT POS</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">YES POS</th>
                   </tr>
                </thead>
                <tbody>
                  {Object.entries(match.sessionData).map(([session, data]) => (
                    <tr key={session} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{session}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{data.noRun || "-"}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{data.yesRun || "-"}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{data.notPos || "-"}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{data.yesPos || "-"}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Match Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Match</h3>
                <span className="text-xs text-gray-500">10-Apr 07:30 pm</span>
              </div>
              <p className="text-gray-700 font-medium">Rajashan Royals VS RC Bengaluru</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}