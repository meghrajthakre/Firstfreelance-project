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

// ─── CONFIG ────────────────────────────────────────────────────────────────
const ODDS_API_KEY = "8297e0b75b4fd8aefb660adb39809c17";
const ODDS_URL = `https://api.the-odds-api.com/v4/sports/cricket/odds/?apiKey=${ODDS_API_KEY}&regions=uk&markets=h2h`;

// ─── IPL Team colors ───────────────────────────────────────────────────────
const IPL_TEAMS = {
  "Mumbai Indians": {
    short: "MI",
    primary: "#004BA0",
    secondary: "#D1AB3E"
  },
  "Chennai Super Kings": {
    short: "CSK",
    primary: "#F9CD05",
    secondary: "#1D1D1B"
  },
  "Royal Challengers Bengaluru": {
    short: "RCB",
    primary: "#D11D1B",
    secondary: "#000000"
  },
  "Kolkata Knight Riders": {
    short: "KKR",
    primary: "#3A225D",
    secondary: "#C4A962"
  },
  "Sunrisers Hyderabad": {
    short: "SRH",
    primary: "#F7A721",
    secondary: "#000000"
  },
  "Delhi Capitals": {
    short: "DC",
    primary: "#0078BC",
    secondary: "#EF1B23"
  },
  "Punjab Kings": {
    short: "PBKS",
    primary: "#ED1F27",
    secondary: "#A7A9AC"
  },
  "Rajasthan Royals": {
    short: "RR",
    primary: "#EA1A85",
    secondary: "#254AA5"
  },
  "Gujarat Titans": {
    short: "GT",
    primary: "#1C1C1C",
    secondary: "#C5A253"
  },
  "Lucknow Super Giants": {
    short: "LSG",
    primary: "#00AEEF",
    secondary: "#F7A721"
  }
};

function getTeamMeta(name) {
  return IPL_TEAMS[name] || { short: name?.slice(0, 3).toUpperCase() || "—", primary: "#0d9488", secondary: "#ffffff" };
}

// ─── Sports tabs ───────────────────────────────────────────────────────────
const SPORTS = [
  { id: "ipl",        label: "IPL",        Icon: MdSportsCricket },
  { id: "cricket",    label: "Cricket",    Icon: MdSportsCricket },
  { id: "football",   label: "Football",   Icon: MdSportsFootball },
  { id: "tennis",     label: "Tennis",     Icon: MdSportsTennis },
  { id: "kabaddi",    label: "Kabaddi",    Icon: MdSportsCricket },
  { id: "elections",  label: "Elections",  Icon: MdHowToVote },
  { id: "tournament", label: "Tournament", Icon: MdEmojiEvents },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function isToday(dateStr) {
  if (!dateStr) return false;
  const d     = new Date(dateStr);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth()    === today.getMonth()    &&
    d.getDate()     === today.getDate()
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
    .map(s => `${s.inning.replace(" Inning 1","").replace(" Inning 2","")} ${s.r}/${s.w} (${s.o})`)
    .join("  |  ");
}

function isIPL(m) {
  return (m.series_name || m.name || "").toLowerCase().includes("indian premier league");
}

function detectSport(m) {
  const sport = m.sport_key?.toLowerCase() || "";
  if (sport.includes("ipl")) return "ipl";
  if (sport.includes("psl")) return "cricket";
  if (sport.includes("odi") || sport.includes("t20") || sport.includes("test")) return "cricket";
  if (sport.includes("football")) return "football";
  if (sport.includes("tennis")) return "tennis";
  if (sport.includes("kabaddi")) return "kabaddi";
  return "cricket";
}

// ─── TeamBadge ─────────────────────────────────────────────────────────────
const TeamBadge = ({ name }) => {
  const { short, primary, secondary } = getTeamMeta(name);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1,
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "50%",
        backgroundColor: primary + "18",
        border: `2px solid ${primary}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-rajdhani)", fontWeight: "700",
        fontSize: "11px", color: primary, letterSpacing: "0.5px",
      }}>
        {short}
      </div>
      <span style={{
        fontSize: "11px", fontWeight: "600", color: "var(--color-text-dark)",
        fontFamily: "var(--font-nunito)", textAlign: "center",
        maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {name}
      </span>
    </div>
  );
};

// ─── IPLMatchCard ──────────────────────────────────────────────────────────
const IPLMatchCard = ({ match }) => {
  const [hovered, setHovered] = useState(false);
  const teamA  = match.teams?.[0] || match.raw?.home_team || "TBA";
  const teamB  = match.teams?.[1] || match.raw?.away_team || "TBA";
  const isLive = match.status === "live";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        backgroundColor: "var(--color-input-bg)",
        borderRadius: "16px",
        border: `1.5px solid ${isLive ? "#ef444440" : hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        overflow: "hidden", cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 0.18s, transform 0.18s",
      }}
    >
      {/* Live glow bar */}
      {isLive && (
        <div style={{
          position: "absolute", top: 0, left: 0, height: "3px", width: "100%",
          background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
        }} />
      )}
      {/* Hover accent bar */}
      {!isLive && (
        <div style={{
          position: "absolute", top: 0, left: 0, height: "3px", width: "100%",
          backgroundColor: "var(--color-primary)",
          transformOrigin: "left",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.25s ease",
        }} />
      )}

      <div style={{ padding: "14px 16px" }}>
        {/* Header: subtitle + badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{
            fontSize: "11px", fontWeight: "600", opacity: 0.45,
            color: "var(--color-text-dark)", fontFamily: "var(--font-nunito)",
          }}>
            {match.subtitle}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                fontSize: "11px", color: "var(--color-primary)", letterSpacing: "0.4px",
              }}>
                {match.time}
              </span>
            </div>
          </div>
        </div>

        {/* Teams row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <TeamBadge name={teamA} />
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "var(--font-rajdhani)", fontWeight: "700",
              fontSize: "13px", color: "var(--color-text-dark)", opacity: 0.3,
            }}>VS</span>
          </div>
          <TeamBadge name={teamB} />
        </div>

        {/* Live score */}
        {match.score && (
          <div style={{
            padding: "8px 10px", borderRadius: "8px",
            backgroundColor: "var(--color-bg-main)",
            border: "1px solid var(--color-border)",
            fontSize: "11px", fontFamily: "var(--font-rajdhani)", fontWeight: "600",
            color: "var(--color-primary)", letterSpacing: "0.3px",
            marginBottom: "10px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            🏏 {match.score}
          </div>
        )}

        {/* Match status text */}
        {match.raw?.status && match.raw.status !== "Match not started" && (
          <div style={{
            fontSize: "11px", color: "var(--color-text-dark)", opacity: 0.5,
            fontFamily: "var(--font-nunito)", marginBottom: "10px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {match.raw.status}
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
          <BetPill label="Match Bets"   value={match.matchBets} />
          <BetPill label="Session Bets" value={match.sessionBets} />
        </div>
      </div>
    </div>
  );
};

// ─── BetPill ───────────────────────────────────────────────────────────────
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

// ─── StatusBadge ───────────────────────────────────────────────────────────
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

// ─── MatchCard (non-IPL) ───────────────────────────────────────────────────
const MatchCard = ({ match, activeSport }) => {
  const [hovered, setHovered] = useState(false);
  const ActiveIcon = activeSport?.Icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", backgroundColor: "var(--color-input-bg)",
        borderRadius: "14px",
        border: `1.5px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        overflow: "hidden", cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 0.18s, transform 0.18s",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, height: "3px", width: "100%",
        backgroundColor: "var(--color-primary)", transformOrigin: "left",
        transform: hovered ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.25s ease",
      }} />
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <div style={{
              width: "34px", height: "34px", minWidth: "34px", borderRadius: "9px",
              backgroundColor: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {ActiveIcon && <ActiveIcon size={18} style={{ color: "var(--color-text-muted)" }} />}
            </div>
            <span style={{ fontSize: "12px", fontWeight: "600", opacity: 0.45, color: "var(--color-text-dark)", fontFamily: "var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {match.subtitle}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <StatusBadge status={match.status} />
            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "20px", backgroundColor: "var(--color-bg-main)", border: "1px solid var(--color-border)" }}>
              <MdAccessTime size={12} style={{ color: "var(--color-primary)", opacity: 0.8 }} />
              <span style={{ fontFamily: "var(--font-rajdhani)", fontWeight: "700", fontSize: "11px", color: "var(--color-primary)", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
                {match.time}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-rajdhani)", fontWeight: "700", fontSize: "clamp(13px, 4vw, 15px)", color: "var(--color-text-dark)", lineHeight: "1.25", letterSpacing: "0.2px", minWidth: 0 }}>
            {match.title}
          </h3>
          <MdChevronRight size={20} style={{ color: "var(--color-accent)", flexShrink: 0, transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.18s" }} />
        </div>
        {match.venue && (
          <div style={{ fontSize: "11px", color: "var(--color-text-dark)", opacity: 0.35, fontFamily: "var(--font-nunito)", marginBottom: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            📍 {match.venue}
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <BetPill label="Match Bets"   value={match.matchBets} />
          <BetPill label="Session Bets" value={match.sessionBets} />
        </div>
      </div>
    </div>
  );
};

// ─── groupByDate ───────────────────────────────────────────────────────────
function groupByDate(matches) {
  const groups = {};
  matches.forEach((m) => {
    const key = `${m.day} ${m.month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

// ─── normalizeMatch ────────────────────────────────────────────────────────
function extractBestOdds(match) {
  if (!match.bookmakers || match.bookmakers.length === 0) return { matchBets: "—", sessionBets: "—" };
  
  let bestOdds = [];
  match.bookmakers.forEach(bookmaker => {
    if (bookmaker.markets && bookmaker.markets.length > 0) {
      const market = bookmaker.markets[0];
      if (market.outcomes && market.outcomes.length >= 2) {
        bestOdds.push(market.outcomes[0].price);
        bestOdds.push(market.outcomes[1].price);
      }
    }
  });
  
  if (bestOdds.length === 0) return { matchBets: "—", sessionBets: "—" };
  const maxOdds = Math.max(...bestOdds).toFixed(2);
  const minOdds = Math.min(...bestOdds).toFixed(2);
  return { matchBets: maxOdds, sessionBets: minOdds };
}

function normalizeMatch(m, idx) {
  const { day, month, time } = parseDateTime(m.commence_time);
  const { matchBets, sessionBets } = extractBestOdds(m);
  
  return {
    id:          m.id || idx,
    title:       `${m.home_team} vs ${m.away_team}`,
    subtitle:    m.sport_title || "Cricket",
    matchBets:   matchBets,
    sessionBets: sessionBets,
    day, month, time,
    venue:       m.venue || "",
    status:      "scheduled",
    score:       null,
    raw:         m,
    teams:       [m.home_team, m.away_team],
  };
}

// ─── Live (main) ───────────────────────────────────────────────────────────
const Live = () => {
  const [allMatches, setAll]   = useState([]);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState(null);
  const [lastFetched, setLast] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(ODDS_URL);
      const data = await res.json();
      
      if (!Array.isArray(data)) throw new Error("Invalid API response format");

      const todayMatches = [];

      data.forEach((m, idx) => {
        const dateToUse  = m.commence_time;

        // Show only today's matches
        if (isToday(dateToUse)) {
          todayMatches.push(normalizeMatch(m, idx));
        }
      });

      setAll(todayMatches);
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

  const grouped = groupByDate(allMatches);

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-main)", fontFamily: "var(--font-nunito)" }}>
      {/* ── Content ── */}
      <div style={{
        padding: "16px 12px", maxWidth: "640px", margin: "0 auto",
        display: "flex", flexDirection: "column", gap: "20px",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-dark)", opacity: 0.35, fontFamily: "var(--font-nunito)" }}>
            {lastFetched
              ? `Updated ${lastFetched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
              : "Fetching..."}
          </span>
        </div>

        {/* Loading skeleton */}
        {loading && !Object.keys(allMatches).length && (
          [1, 2, 3].map(i => (
            <div key={i} style={{
              height: "160px", borderRadius: "16px",
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
              Make sure your ODDS_API_KEY is valid. Please check the API configuration.
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && allMatches.length === 0 && (
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
                color: "var(--color-primary)",
                whiteSpace: "nowrap",
              }}>
                {dateLabel}
              </span>
              <span style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
            </div>
            {groupMatches.map((match) => <IPLMatchCard key={match.id} match={match} />)}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:0.6; } 50% { opacity:0.3; } }
        @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
      `}</style>
    </div>
  );
};

export default Live;