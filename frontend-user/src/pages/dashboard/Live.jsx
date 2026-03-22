import { useState } from "react";
import { GiCricket, GiSoccerBall, GiTennisBall, GiPerson, GiVote, GiTrophyCup } from "react-icons/gi";
import { 
  CricketIcon, 
 
} from "@phosphor-icons/react"; 

const SPORTS = [
  { id: "cricket",    label: "CRICKET",    icon: <CricketIcon  size={18} /> },
  { id: "football",   label: "FOOTBALL",   icon: <GiSoccerBall size={18} /> },
  { id: "tennis",     label: "TENNIS",     icon: <GiTennisBall size={18} /> },
  { id: "kabaddi",    label: "KABADDI",    icon: <GiPerson     size={18} /> },
  { id: "elections",  label: "ELECTIONS",  icon: <GiVote       size={18} /> },
  { id: "tournament", label: "TOURNAMENT", icon: <GiTrophyCup  size={18} /> },
];

const MATCHES = {
  cricket: [
    {
      id: 1,
      title: "NEW ZEALAND VS SOUTH AFRICA",
      subtitle: "4th T20I",
      matchBets: 0,
      sessionBets: 0,
      day: "22",
      month: "March",
      time: "11:45 AM",
    },
    {
      id: 2,
      title: "INDIA VS AUSTRALIA",
      subtitle: "3rd ODI",
      matchBets: 12,
      sessionBets: 5,
      day: "23",
      month: "March",
      time: "02:30 PM",
    },
  ],
  football: [
    {
      id: 3,
      title: "MANCHESTER UNITED VS CHELSEA",
      subtitle: "Premier League",
      matchBets: 8,
      sessionBets: 3,
      day: "22",
      month: "March",
      time: "07:00 PM",
    },
  ],
  tennis:     [],
  kabaddi:    [],
  elections:  [],
  tournament: [],
};

const Live = () => {
  const [active, setActive] = useState("cricket");
  const matches = MATCHES[active] ?? [];
  const activeSport = SPORTS.find((s) => s.id === active);

  return (
    <div
      className="min-h-screen px-3 sm:px-6 py-6"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      {/* ── Sport tabs ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {SPORTS.map((sport) => {
          const isActive = active === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setActive(sport.id)}
              className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded font-rajdhani font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 cursor-pointer"
              style={
                isActive
                  ? {
                      backgroundColor: "var(--color-input-bg)",
                      color: "var(--color-primary)",
                      border: "1.5px solid var(--color-border)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }
                  : {
                      backgroundColor: "var(--color-btn-bg)",
                      color: "var(--color-text-muted)",
                      border: "1.5px solid var(--color-btn-border)",
                    }
              }
            >
              {sport.icon}
              <span>{sport.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Match list ─────────────────────────────────────────────────────── */}
      {matches.length === 0 ? (
        <div
          className="rounded-lg py-16 flex flex-col items-center gap-3"
          style={{
            backgroundColor: "var(--color-input-bg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <GiTrophyCup size={48} style={{ color: "var(--color-accent)" }} />
          <p
            className="font-rajdhani font-semibold text-lg tracking-wide"
            style={{ color: "var(--color-primary)" }}
          >
            No matches available
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-lg overflow-hidden flex flex-col sm:flex-row cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--color-input-bg)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              {/* Sport icon panel */}
              <div
                className="flex items-center justify-center w-full sm:w-20 h-16 sm:h-auto shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <span className="text-white text-2xl">
                  {activeSport?.icon}
                </span>
              </div>

              {/* Match info */}
              <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-1">
                <h3
                  className="font-rajdhani font-bold text-base sm:text-lg leading-tight tracking-wide"
                  style={{ color: "var(--color-primary)" }}
                >
                  {match.title}
                </h3>
                <p
                  className="font-nunito text-sm"
                  style={{ color: "var(--color-text-dark)", opacity: 0.7 }}
                >
                  {match.subtitle}
                </p>
                <div className="flex gap-4 mt-1">
                  <span
                    className="font-nunito text-xs"
                    style={{ color: "var(--color-text-dark)", opacity: 0.65 }}
                  >
                    Match Bets : {match.matchBets}
                  </span>
                  <span
                    className="font-nunito text-xs"
                    style={{ color: "var(--color-text-dark)", opacity: 0.65 }}
                  >
                    Session Bets : {match.sessionBets}
                  </span>
                </div>
              </div>

              {/* Date box */}
              <div
                className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 px-4 sm:px-6 py-3 sm:py-0 sm:min-w-[100px]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <span
                  className="font-rajdhani font-bold text-2xl sm:text-3xl leading-none"
                  style={{ color: "var(--color-input-bg)" }}
                >
                  {match.day}
                </span>
                <span
                  className="font-rajdhani font-semibold text-sm sm:text-base"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {match.month}
                </span>
                <span
                  className="font-nunito text-xs sm:text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {match.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Live;