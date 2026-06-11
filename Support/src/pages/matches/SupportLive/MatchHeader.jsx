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
          Start Manual
        </button>
      </div>

      {/* Subtitle */}
      <div className="text-center text-gray-500 text-sm mb-2">
        {MATCH.subtitle}
      </div>

      {/* Ball-by-ball numbers */}
      <div className="flex justify-center gap-4 mb-3 text-gray-600 text-sm">
        {MATCH.balls.map((b, i) => <span key={i}>{b}</span>)}
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