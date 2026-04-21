import { useState, useEffect } from "react";
import {
  MdSportsCricket,
  MdSportsFootball,
  MdSportsTennis,
  MdEmojiEvents,
  MdHowToVote,
  MdChevronRight,
  MdAccessTime,
  MdRefresh,
} from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";

const CRICAPI_KEY = "6b0595be-1018-42d5-a9d2-d76a3fdf6d9d";
const CRICAPI_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${CRICAPI_KEY}&offset=0`;

const SPORTS = [
  { id: "cricket",    label: "Cricket",    Icon: MdSportsCricket },
  { id: "football",   label: "Football",   Icon: MdSportsFootball },
  { id: "tennis",     label: "Tennis",     Icon: MdSportsTennis },
  { id: "kabaddi",    label: "Kabaddi",    Icon: MdSportsCricket },
  { id: "elections",  label: "Elections",  Icon: MdHowToVote },
  { id: "tournament", label: "Tournament", Icon: MdEmojiEvents },
];

function isToday(dateStr) {
  if (!dateStr) return false;
  const matchDate = new Date(dateStr);
  const today     = new Date();
  return (
    matchDate.getFullYear() === today.getFullYear() &&
    matchDate.getMonth()    === today.getMonth()    &&
    matchDate.getDate()     === today.getDate()
  );
}

function parseDateTime(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return { day: "—", month: "—", time: "—" };
  return {
    day:   d.getDate().toString(),
    month: d.toLocaleString("en-IN", { month: "long" }),
    time:  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
  };
}

function getMatchStatus(m) {
  if (m.matchStarted && !m.matchEnded) return "live";
  if (m.matchEnded)                    return "completed";
  return "scheduled";
}

function getScore(m) {
  if (!m.score?.length) return null;
  return m.score
    .map(s => `${s.inning.replace(" Inning 1", "").replace(" Inning 2", "")} ${s.r}/${s.w} (${s.o})`)
    .join("  |  ");
}

function detectSport(m) {
  const name = (m.series_name || m.name || "").toLowerCase();
  if (name.includes("ipl") || name.includes("cricket") || ["t20", "odi", "test", "t10"].includes(m.matchType)) return "cricket";
  if (name.includes("football") || name.includes("soccer")) return "football";
  if (name.includes("tennis"))   return "tennis";
  if (name.includes("kabaddi"))  return "kabaddi";
  if (name.includes("election")) return "elections";
  return "cricket";
}

const BetPill = ({ label, value }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "4px 10px", borderRadius: "6px",
    backgroundColor: "var(--color-bg-main)",
    border: "1px solid var(--color-border)", flexShrink: 0,
  }}>
    <span style={{ fontSize: "11px", color: "var(--color-text-dark)", opacity: 0.5, fontFamily: "var(--font-nunito)", whiteSpace: "nowrap" }}>
      {label}
    </span>
    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-primary)", fontFamily: "var(--font-rajdhani)", lineHeight: 1 }}>
      {value}
    </span>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    live:      { label: "● LIVE",    color: "#ef4444", bg: "#fef2f2" },
    completed: { label: "Completed", color: "#6b7280", bg: "#f3f4f6" },
    scheduled: { label: "Upcoming",  color: "#0d9488", bg: "#f0fdfa" },
  }[status] || { label: status, color: "#6b7280", bg: "#f3f4f6" };

  return (
    <span style={{
      fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px",
      padding: "2px 7px", borderRadius: "20px",
      color: config.color, backgroundColor: config.bg,
      fontFamily: "var(--font-rajdhani)", flexShrink: 0,
    }}>
      {config.label}
    </span>
  );
};

const MatchCard = ({ match, activeSport }) => {
  const [hovered, setHovered] = useState(false);
  const ActiveIcon = activeSport?.Icon;
  const score = getScore(match);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        backgroundColor: "var(--color-input-bg)",
        borderRadius: "14px",
        border: `1.5px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        overflow: "hidden", cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 0.18s, transform 0.18s",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        height: "3px", width: "100%",
        backgroundColor: "var(--color-primary)",
        transformOrigin: "left",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 0.25s ease",
      }} />

      <div style={{ padding: "14px 16px" }}>
        {/* Row 1: icon + subtitle + time + status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <div style={{
              width: "34px", height: "34px", minWidth: "34px",
              borderRadius: "9px", backgroundColor: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {ActiveIcon && <ActiveIcon size={18} style={{ color: "var(--color-text-muted)" }} />}
            </div>
            <span style={{
              fontSize: "12px", fontWeight: "600", opacity: 0.45,
              color: "var(--color-text-dark)", fontFamily: "var(--font-nunito)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {match.subtitle}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <StatusBadge status={match.status} />
            <div style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "3px 8px", borderRadius: "20px",
              backgroundColor: "var(--color-bg-main)",
              border: "1px solid var(--color-border)",
            }}>
              <MdAccessTime size={12} style={{ color: "var(--color-primary)", opacity: 0.8 }} />
              <span style={{
                fontFamily: "var(--font-rajdhani)", fontWeight: "700",
                fontSize: "11px", color: "var(--color-primary)",
                letterSpacing: "0.4px", whiteSpace: "nowrap",
              }}>
                {match.time}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: title + chevron */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: score ? "8px" : "12px", gap: "8px" }}>
          <h3 style={{
            margin: 0, fontFamily: "var(--font-rajdhani)", fontWeight: "700",
            fontSize: "clamp(13px, 4vw, 15px)", color: "var(--color-text-dark)",
            lineHeight: "1.25", letterSpacing: "0.2px", minWidth: 0,
          }}>
            {match.title}
          </h3>
          <MdChevronRight size={20} style={{
            color: "var(--color-accent)", flexShrink: 0,
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            transition: "transform 0.18s",
          }} />
        </div>

        {/* Live score */}
        {score && (
          <div style={{
            fontSize: "11px", fontFamily: "var(--font-rajdhani)", fontWeight: "600",
            color: "var(--color-primary)", opacity: 0.85,
            marginBottom: "10px", letterSpacing: "0.3px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {score}
          </div>
        )}

        {/* Venue */}
        {match.venue && (
          <div style={{
            fontSize: "11px", color: "var(--color-text-dark)", opacity: 0.35,
            fontFamily: "var(--font-nunito)", marginBottom: "10px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            📍 {match.venue}
          </div>
        )}

        {/* Bet pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <BetPill label="Match Bets" value={match.matchBets} />
          <BetPill label="Session Bets" value={match.sessionBets} />
        </div>
      </div>
    </div>
  );
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
  const [active, setActive]    = useState("cricket");
  const [allMatches, setAll]   = useState({});
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState(null);
  const [lastFetched, setLast] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(CRICAPI_URL);
      const json = await res.json();
      console.log(json)

      if (json.status !== "success") throw new Error(json.reason || "API error");

      const grouped = { cricket: [], football: [], tennis: [], kabaddi: [], elections: [], tournament: [] };

      (json.data || [])
        .filter((m) => isToday(m.dateTimeGMT || m.date))
        .forEach((m, idx) => {
          const sport                = detectSport(m);
          const { day, month, time } = parseDateTime(m.dateTimeGMT || m.date);

          grouped[sport]?.push({
            id:          m.id || idx,
            title:       m.name || "Unknown Match",
            subtitle:    m.series_name || m.matchType?.toUpperCase() || "Cricket",
            matchBets:   0,
            sessionBets: 0,
            day,
            month,
            time,
            venue:       m.venue || "",
            status:      getMatchStatus(m),
            score:       m.score || [],
            raw:         m,
          });
        });

      setAll(grouped);
      setLast(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 60_000);
    return () => clearInterval(interval);
  }, []);

  const matches     = allMatches[active] ?? [];
  const activeSport = SPORTS.find((s) => s.id === active);
  const grouped     = groupByDate(matches);

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-main)", fontFamily: "var(--font-nunito)" }}>

      {/* ── Sport tab strip ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        backgroundColor: "var(--color-input-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <div style={{
          display: "flex", overflowX: "auto", gap: "4px",
          padding: "8px 10px", scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}>
          {SPORTS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            const count    = (allMatches[id] ?? []).length;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                  padding: "8px 14px 7px", borderRadius: "10px", border: "none",
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--color-input-bg)" : "var(--color-accent)",
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  outline: "none", transition: "background 0.18s, color 0.18s",
                  position: "relative",
                }}
              >
                <Icon size={20} />
                <span style={{
                  fontFamily: "var(--font-rajdhani)", fontWeight: "700",
                  fontSize: "10px", letterSpacing: "0.7px",
                  textTransform: "uppercase", lineHeight: 1,
                }}>
                  {label}
                </span>
                {count > 0 && (
                  <span style={{
                    position: "absolute", top: "4px", right: "4px",
                    width: "14px", height: "14px", borderRadius: "50%",
                    backgroundColor: isActive ? "rgba(255,255,255,0.35)" : "var(--color-primary)",
                    color: isActive ? "var(--color-primary)" : "var(--color-input-bg)",
                    fontSize: "8px", fontWeight: "700", lineHeight: "14px",
                    textAlign: "center", fontFamily: "var(--font-rajdhani)",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{
        padding: "16px 12px", maxWidth: "640px", margin: "0 auto",
        display: "flex", flexDirection: "column", gap: "20px",
      }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-dark)", opacity: 0.35, fontFamily: "var(--font-nunito)" }}>
            {lastFetched
              ? `Updated ${lastFetched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
              : "Fetching..."}
          </span>
          <button
            onClick={fetchMatches}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--color-border)",
              backgroundColor: "transparent", cursor: loading ? "not-allowed" : "pointer",
              fontSize: "11px", color: "var(--color-primary)",
              fontFamily: "var(--font-nunito)", fontWeight: "600", opacity: loading ? 0.5 : 1,
            }}
          >
            <MdRefresh size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && !Object.keys(allMatches).length && (
          [1, 2, 3].map(i => (
            <div key={i} style={{
              height: "130px", borderRadius: "14px",
              backgroundColor: "var(--color-input-bg)",
              border: "1.5px solid var(--color-border)",
              animation: "pulse 1.5s ease-in-out infinite",
              opacity: 1 - i * 0.2,
            }} />
          ))
        )}

        {/* Error state */}
        {error && (
          <div style={{
            padding: "16px", borderRadius: "12px",
            backgroundColor: "#fef2f2", border: "1px solid #fecaca",
            fontSize: "13px", color: "#dc2626", fontFamily: "var(--font-nunito)",
          }}>
            <strong>API error:</strong> {error}
            <br />
            <span style={{ fontSize: "11px", opacity: 0.7 }}>
              Make sure your CRICAPI_KEY is set. Get a free key at cricketdata.org
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && matches.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "64px 24px", gap: "12px", textAlign: "center",
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              backgroundColor: "var(--color-input-bg)", border: "1px solid var(--color-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <IoTrophyOutline size={26} style={{ color: "var(--color-accent)", opacity: 0.5 }} />
            </div>
            <p style={{ margin: 0, fontFamily: "var(--font-rajdhani)", fontWeight: "700", fontSize: "15px", letterSpacing: "0.3px", color: "var(--color-text-dark)", opacity: 0.4 }}>
              No matches today
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-dark)", opacity: 0.3 }}>
              {todayLabel}
            </p>
          </div>
        )}

        {/* Match groups */}
        {!error && Object.entries(grouped).map(([dateLabel, groupMatches]) => (
          <div key={dateLabel} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontFamily: "var(--font-rajdhani)", fontWeight: "700",
                fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase",
                color: "var(--color-primary)", whiteSpace: "nowrap",
              }}>
                {dateLabel}
              </span>
              <span style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
            </div>
            {groupMatches.map((match) => (
              <MatchCard key={match.id} match={match} activeSport={activeSport} />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:0.3; } }
      `}</style>
    </div>
  );
};

export default Live;