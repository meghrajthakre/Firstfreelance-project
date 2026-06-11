import { C, MATCH } from "./constants";

export default function MatchHeader() {
    return (
        <>
            {/* Start Manual */}
            <div className="flex justify-end mb-3">
                <button
                    className="text-white text-sm font-semibold px-5 py-2 rounded"
                    style={{ background: C.startManual }}
                >
                    Start Manuall
                </button>
            </div>

            {/* Subtitle */}
            <div className="text-center text-gray-500 text-sm mb-2">
                {MATCH.Toss}
            </div>

            {/* Ball-by-ball numbers */}
            <div className="flex justify-center mb-3">
                <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-4 py-2">
                    <span className="text-xs font-medium text-gray-400 tracking-wider mr-1">BALLS</span>
                    {MATCH.balls.map((b, i) => (
                        <div
                            key={i}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                            style={{
                                background: b > 0 ? "#2c3e6b" : "#d6eaf8",
                                color: b > 0 ? "#ffffff" : "#1a3a5c",
                                border: b > 0 ? "none" : "1.5px solid #b8d4e8",
                            }}
                        >
                            {b}
                        </div>
                    ))}
                </div>
            </div>

            {/* Match badge */}
            <div className="flex justify-center mb-3">
                <span
                    className="text-white text-sm font-semibold px-6 py-1.5 rounded-full"
                    style={{ background: C.matchBadge }}
                >
                    Match : {MATCH.homeTeam} VS {MATCH.awayTeam}
                </span>
            </div>

            {/* Score row */}
            <div className="grid grid-cols-3 border border-gray-300 rounded overflow-hidden mb-4 bg-white">
                <div className="py-2.5 pl-4 text-sm font-bold" style={{ color: C.notText }}>
                    {MATCH.homeTeam.slice(0, 3).toUpperCase()}
                </div>
                <div
                    className="py-2.5 text-xl font-bold text-white text-center"
                    style={{ background: C.openBtn }}
                >
                    {MATCH.centerScore}
                </div>
                <div className="py-2.5 pr-4 text-sm font-bold text-right" style={{ color: C.notText }}>
                    {MATCH.score}
                </div>
            </div>
        </>
    );
}