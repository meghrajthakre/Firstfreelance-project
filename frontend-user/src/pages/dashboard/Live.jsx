import { useState } from "react";
import {
  MdSportsCricket,
  MdSportsFootball,
  MdSportsTennis,
  MdEmojiEvents,
  MdHowToVote,
  MdChevronRight,
  MdAccessTime,
} from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";

const SPORTS = [
  { id: "cricket",    label: "Cricket",    Icon: MdSportsCricket },
  { id: "football",   label: "Football",   Icon: MdSportsFootball },
  { id: "tennis",     label: "Tennis",     Icon: MdSportsTennis },
  { id: "kabaddi",    label: "Kabaddi",    Icon: MdSportsCricket },
  { id: "elections",  label: "Elections",  Icon: MdHowToVote },
  { id: "tournament", label: "Tournament", Icon: MdEmojiEvents },
];

const MATCHES = {
  cricket: [
    {
      id: 1,
      title: "New Zealand vs South Africa",
      subtitle: "4th T20I",
      matchBets: 0,
      sessionBets: 0,
      day: "22",
      month: "March",
      time: "11:45 AM",
    },
    {
      id: 2,
      title: "India vs Australia",
      subtitle: "3rd ODI",
      matchBets: 12,
      sessionBets: 5,
      day: "23",
      month: "March",
      time: "02:30 PM",
    },
    {
      id: 3,
      title: "England vs West Indies",
      subtitle: "1st Test",
      matchBets: 4,
      sessionBets: 2,
      day: "23",
      month: "March",
      time: "09:30 AM",
    },
  ],
  football: [
    {
      id: 4,
      title: "Manchester United vs Chelsea",
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

function groupByDate(matches) {
  const groups = {};
  matches.forEach((m) => {
    const key = `${m.day} ${m.month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

const Live = () => {
  const [active, setActive] = useState("cricket");
  const [hoveredId, setHoveredId] = useState(null);
  const matches = MATCHES[active] ?? [];
  const activeSport = SPORTS.find((s) => s.id === active);
  const grouped = groupByDate(matches);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-main)",
        fontFamily: "var(--font-nunito)",
      }}
    >
      {/* ── Sport tabs ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "var(--color-input-bg)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "6px 10px",
            gap: "4px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {SPORTS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "8px 14px 6px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: isActive
                    ? "var(--color-primary)"
                    : "transparent",
                  color: isActive
                    ? "var(--color-input-bg)"
                    : "var(--color-accent)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "background 0.18s, color 0.18s",
                  outline: "none",
                }}
              >
                <Icon size={22} />
                <span
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    fontWeight: "700",
                    fontSize: "10px",
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Match list ── */}
      <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {matches.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 24px",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "var(--color-input-bg)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoTrophyOutline size={28} style={{ color: "var(--color-accent)", opacity: 0.5 }} />
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-rajdhani)",
                fontWeight: "700",
                fontSize: "15px",
                letterSpacing: "0.3px",
                color: "var(--color-text-dark)",
                opacity: 0.45,
              }}
            >
              No matches available
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--color-text-dark)",
                opacity: 0.35,
              }}
            >
              Check back later for upcoming games
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, groupMatches]) => (
            <div key={dateLabel} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Date divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    fontWeight: "700",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "var(--color-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {dateLabel}
                </span>
                <span
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "var(--color-border)",
                  }}
                />
              </div>

              {/* Cards */}
              {groupMatches.map((match) => {
                const isHovered = hoveredId === match.id;
                const ActiveIcon = activeSport?.Icon;
                return (
                  <div
                    key={match.id}
                    onMouseEnter={() => setHoveredId(match.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      backgroundColor: "var(--color-input-bg)",
                      borderRadius: "14px",
                      border: `1px solid ${isHovered ? "var(--color-primary)" : "var(--color-border)"}`,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "border-color 0.18s, transform 0.15s",
                      transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    {/* Top accent bar on hover */}
                    <div
                      style={{
                        height: "3px",
                        backgroundColor: "var(--color-primary)",
                        transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.25s ease",
                      }}
                    />

                    <div style={{ padding: "14px 16px" }}>
                      {/* Row 1: icon + subtitle + time */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {/* Sport icon in a pill */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              backgroundColor: "var(--color-primary)",
                              flexShrink: 0,
                            }}
                          >
                            {ActiveIcon && (
                              <ActiveIcon size={18} style={{ color: "var(--color-text-muted)" }} />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "var(--color-text-dark)",
                              opacity: 0.5,
                              fontFamily: "var(--font-nunito)",
                            }}
                          >
                            {match.subtitle}
                          </span>
                        </div>

                        {/* Time badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 8px",
                            borderRadius: "20px",
                            backgroundColor: "var(--color-bg-main)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <MdAccessTime size={12} style={{ color: "var(--color-primary)", opacity: 0.8 }} />
                          <span
                            style={{
                              fontFamily: "var(--font-rajdhani)",
                              fontWeight: "700",
                              fontSize: "11px",
                              color: "var(--color-primary)",
                              letterSpacing: "0.4px",
                            }}
                          >
                            {match.time}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: match title */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-rajdhani)",
                            fontWeight: "700",
                            fontSize: "15px",
                            letterSpacing: "0.2px",
                            color: "var(--color-text-dark)",
                            lineHeight: "1.3",
                          }}
                        >
                          {match.title}
                        </h3>
                        <MdChevronRight
                          size={20}
                          style={{
                            color: "var(--color-accent)",
                            flexShrink: 0,
                            marginLeft: "8px",
                            transition: "transform 0.15s",
                            transform: isHovered ? "translateX(3px)" : "translateX(0)",
                          }}
                        />
                      </div>

                      {/* Row 3: bet pills */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <BetPill label="Match Bets" value={match.matchBets} />
                        <BetPill label="Session Bets" value={match.sessionBets} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const BetPill = ({ label, value }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      borderRadius: "6px",
      backgroundColor: "var(--color-bg-main)",
      border: "1px solid var(--color-border)",
    }}
  >
    <span
      style={{
        fontSize: "11px",
        color: "var(--color-text-dark)",
        opacity: 0.55,
        fontFamily: "var(--font-nunito)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "12px",
        fontWeight: "700",
        color: "var(--color-primary)",
        fontFamily: "var(--font-rajdhani)",
      }}
    >
      {value}
    </span>
  </div>
);

export default Live;