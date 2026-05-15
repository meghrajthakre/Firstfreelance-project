import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

/* ─── palette ─── */
const C = {
  primary:      "#1E3A5F",
  primaryLight: "#2E5080",
  banner:       "#4B75B8",
  bgMain:       "#E8EDF3",
  inputBg:      "#FFFFFF",
  textDark:     "#1A2B3C",
  border:       "#CDD9E5",
  accent:       "#90B4D4",
  btnBg:        "#2B4A7A",
  lagai:        "#4A90D9",
  khai:         "#C94070",
  noBg:         "#2B4A7A",
  yesBg:        "#1A8070",
  hlRow:        "#D4E3F5",
  pnlGreen:     "#1A8070",
  sectionHdr:   "#1E3A5F",
  tableHdr:     "#2B4A7A",
};

const EXPOSURE_LIMIT = 10000;

/* ── Indian number formatter (e.g. 300000 → "3,00,000") ── */
const fmtINR = (n) =>
  Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

/* ── Format odds in Indian bookmaker style (e.g. 1.95 → "95") ── */
const fmtOdds = (raw) => {
  if (raw == null) return null;
  const n = parseFloat(raw);
  if (isNaN(n) || n <= 0) return null;
  // If value is already expressed as paise/points (> 10), show as-is
  // If it's in decimal odds format (e.g. 1.95), convert to paise: (n - 1) * 100
  if (n <= 10) {
    // Decimal odds (like 1.05 – 3.0) → convert to Indian paise
    return String(Math.round((n - 1) * 100));
  }
  // Already in paise/points format (e.g. 95, 100, 5)
  return String(Math.round(n));
};

/* ══════════════════════════════════════════════════════════════
   BETTING LOGIC HELPERS
══════════════════════════════════════════════════════════════ */

const normalizeType = (type) => {
  if (type === "Lagai" || type === "Yes") return "yes";
  if (type === "Khai"  || type === "No")  return "no";
  return type;
};

const calculateProfit = (type, rate, stake) => {
  const t = normalizeType(type);
  const r = parseFloat(rate)  || 0;
  const s = parseFloat(stake) || 0;
  if (t === "yes") return parseFloat(((r * s) / 100).toFixed(2));
  if (t === "no")  return parseFloat(s.toFixed(2));
  return 0;
};

const calculateLiability = (type, rate, stake) => {
  const t = normalizeType(type);
  const r = parseFloat(rate)  || 0;
  const s = parseFloat(stake) || 0;
  if (t === "yes") return parseFloat(s.toFixed(2));
  if (t === "no")  return parseFloat(((r * s) / 100).toFixed(2));
  return 0;
};

const calculateExposure = (bets) =>
  bets
    .filter((b) => b.status === "OPEN" || b.status === "MATCHED")
    .reduce((sum, b) => sum + b.liability, 0);

const calcRunnerPnlSplit = (bets, runner) => {
  let profit = 0, loss = 0;
  bets
    .filter((b) => b.runner === runner && (b.status === "OPEN" || b.status === "MATCHED"))
    .forEach((b) => {
      const t = normalizeType(b.type);
      if (t === "yes") { profit += b.profit;    loss += b.liability; }
      if (t === "no")  { profit += b.liability; loss += b.profit;    }
    });
  return { profit: parseFloat(profit.toFixed(2)), loss: parseFloat(loss.toFixed(2)) };
};

const calcSessionPnlSplit = (bets, name) => {
  let profit = 0, loss = 0;
  bets
    .filter((b) => b.runner === name && (b.status === "OPEN" || b.status === "MATCHED"))
    .forEach((b) => {
      const t = normalizeType(b.type);
      if (t === "yes") { profit += b.profit;    loss += b.liability; }
      if (t === "no")  { profit += b.liability; loss += b.profit;    }
    });
  return { profit: parseFloat(profit.toFixed(2)), loss: parseFloat(loss.toFixed(2)) };
};

/* ─── API helpers ─── */
async function placeBetApi(payload) {
  const res  = await fetch("http://localhost:5000/api/bet/place", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

/**
 * GET /api/matches/live  →  { success, data: [ normalisedLiveMatch, … ] }
 *
 * Strategy (in order):
 *  1. Exact matchId match  (RapidAPI ID stored in URL)
 *  2. upcomingMatchId match (your DB ID stored in the live record)
 *  3. Team-name match       (fallback: same teams = same game)
 *  4. If only ONE live match exists, return it directly
 */
async function fetchLiveMatchData(matchId, homeTeam, awayTeam) {
  const res  = await fetch("http://localhost:5000/api/matches/live");
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch live matches");

  const list = json.data || [];
  if (list.length === 0) return null;

  // 1. Exact RapidAPI match_id
  let match = list.find((m) => String(m.matchId) === String(matchId));
  if (match) return match;

  // 2. upcomingMatchId field (set by backend if you store it)
  match = list.find((m) => String(m.upcomingMatchId) === String(matchId));
  if (match) return match;

  // 3. Team name match (compare both orderings)
  if (homeTeam && awayTeam) {
    const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
    const ha = norm(homeTeam), ba = norm(awayTeam);
    match = list.find((m) => {
      const mha = norm(m.homeTeam), mba = norm(m.awayTeam);
      return (mha === ha && mba === ba) || (mha === ba && mba === ha);
    });
    if (match) return match;
  }

  // 4. Only one live match — return it (single-match platforms)
  if (list.length === 1) return list[0];

  return null;
}

/* ─── UI atoms ─── */
const card = {
  backgroundColor: C.inputBg,
  borderRadius: 14,
  border: `1.5px solid ${C.border}`,
  overflow: "hidden",
};

const sectionBar = (extra = {}) => ({
  backgroundColor: C.sectionHdr,
  padding: "9px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  ...extra,
});

const tblHdr = { backgroundColor: C.tableHdr };

const TH = ({ left, children, w }) => (
  <th style={{ padding:"8px 10px", fontSize:11, fontWeight:700, color:"#fff",
    textAlign: left ? "left" : "center", letterSpacing:0.5,
    fontFamily:"var(--font-rajdhani)", width: w }}>
    {children}
  </th>
);

const TD = ({ left, bold, green, red, small, children, style: s }) => (
  <td style={{ padding:"9px 10px", fontSize: small ? 11 : 12,
    color: red ? "#e05560" : green ? C.pnlGreen : C.textDark,
    fontWeight: bold || green || red ? 700 : 400,
    textAlign: left ? "left" : "center",
    borderBottom:`1px solid ${C.border}`,
    fontFamily:"var(--font-nunito)", verticalAlign:"middle", ...s }}>
    {children}
  </td>
);

const OddsBtn = ({ color, label, flash, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background: disabled ? "#bbb" : color, border:"none", borderRadius:5,
      color:"#fff", fontWeight:700, fontSize:13, padding:"7px 14px",
      cursor: disabled ? "not-allowed" : "pointer", minWidth:42,
      fontFamily:"var(--font-rajdhani)", letterSpacing:0.3,
      transition:"filter 0.15s, transform 0.1s",
      filter: flash ? "brightness(2)" : "brightness(1)",
      transform: flash ? "scale(0.93)" : "scale(1)",
      opacity: disabled ? 0.5 : 1 }}>
    {label ?? "—"}
  </button>
);

const LiveDot = () => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
    <span style={{ width:7, height:7, borderRadius:"50%", background:"#4cef9a",
      display:"inline-block", animation:"livePulse 1.2s ease-in-out infinite" }} />
    <style>{`@keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}`}</style>
    <span style={{ fontSize:10, fontWeight:700, color:"#4cef9a",
      fontFamily:"var(--font-rajdhani)", letterSpacing:1 }}>LIVE</span>
  </span>
);

/* ── Batting indicator dot ── */
const BattingDot = () => (
  <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%",
    background:"#f5c842", marginLeft:5, verticalAlign:"middle",
    boxShadow:"0 0 4px #f5c842" }} title="Batting" />
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const MatchDetail = () => {
  const { matchId } = useParams();
  const user        = useAuthStore((s) => s.user);
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn);

  /*
   * Team names passed via React Router navigate state:
   *   navigate(`/match/${m.matchId}`, { state: { homeTeam: m.homeTeam, awayTeam: m.awayTeam } })
   * Used as fallback when the live matchId differs from the URL matchId.
   */
  const locationState = typeof window !== "undefined"
    ? (window.history.state?.usr ?? {})
    : {};
  const stateHomeTeam = locationState.homeTeam ?? null;
  const stateAwayTeam = locationState.awayTeam ?? null;

  /* ── Live data state ── */
  const [liveMatch,   setLiveMatch]   = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError,   setLiveError]   = useState(null);

  /* Poll every 15 s */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchLiveMatchData(matchId, stateHomeTeam, stateAwayTeam);
        if (!cancelled) { setLiveMatch(data); setLiveError(null); }
      } catch (err) {
        if (!cancelled) setLiveError(err.message);
      } finally {
        if (!cancelled) setLiveLoading(false);
      }
    };
    load();
    const iv = setInterval(load, 15_000);
    return () => { cancelled = true; clearInterval(iv); };
  }, [matchId]);

  /* ── Derived display values ── */
  const teamA       = liveMatch?.homeTeam      ?? "Team A";
  const teamB       = liveMatch?.awayTeam      ?? "Team B";
  const teamAShort  = liveMatch?.homeTeamShort ?? "A";
  const teamBShort  = liveMatch?.awayTeamShort ?? "B";
  const teamAId     = liveMatch?.homeTeamId    ?? null;
  const battingTeam = liveMatch?.battingTeamId ?? null;

  /* Scores — show dash only when empty */
  const teamAScore  = liveMatch?.teamAScores && liveMatch.teamAScores !== ""
    ? liveMatch.teamAScores : null;
  const teamAOver   = liveMatch?.teamAOver   && liveMatch.teamAOver !== ""
    ? liveMatch.teamAOver   : null;
  const teamBScore  = liveMatch?.teamBScores && liveMatch.teamBScores !== ""
    ? liveMatch.teamBScores : null;
  const teamBOver   = liveMatch?.teamBOver   && liveMatch.teamBOver !== ""
    ? liveMatch.teamBOver   : null;

  const needRunBall = liveMatch?.needRunBall  ?? "";
  const matchLabel  = liveMatch?.matchNumber  ?? "";
  const matchTime   = liveMatch?.matchTime    ?? "";
  const matchType   = liveMatch?.matchType    ?? "";
  const favTeam     = liveMatch?.favTeam      ?? null;
  const toss        = liveMatch?.toss         ?? "";
  const result      = liveMatch?.result       ?? "";
  const isLive      = liveMatch?.status       === "Live";

  /* Odds in Indian format (rate/paise) */
  const lagaiOddsRaw = liveMatch?.odds?.minRate ?? null;
  const khaiOddsRaw  = liveMatch?.odds?.maxRate ?? null;
  const lagaiOdds    = fmtOdds(lagaiOddsRaw);  // e.g. "95" or null
  const khaiOdds     = fmtOdds(khaiOddsRaw);   // e.g. "100" or null

  /* ── Batting indicator helper ── */
  const isBatting = (teamId) =>
    battingTeam != null && String(battingTeam) === String(teamId);

  /* ── Fallback session data ── */
  const mockMatch = {
    marketMinMax:   { min: 100, max: 300000 },
    sessionMarkets: [
      { name:"6 over run",     no:42, noRate:"1.0", yes:44, yesRate:"1.0" },
      { name:"Fall of 1st wkt",no:18, noRate:"1.0", yes:20, yesRate:"1.0" },
      { name:"Top batter runs",no:12, noRate:"1.0", yes:14, yesRate:"1.0" },
      { name:"Extra runs",     no:8,  noRate:"1.0", yes:10, yesRate:"1.0" },
    ],
    matchTieLimit: { min:100, max:10000 },
  };

  const [sessions,   setSessions]   = useState(mockMatch.sessionMarkets);
  const [flashMap,   setFlashMap]   = useState({});
  const [betSlip,    setBetSlip]    = useState(null);
  const [stake,      setStake]      = useState("0");
  const [confirmed,  setConfirmed]  = useState(false);
  const [chatOpen,   setChatOpen]   = useState(false);
  const [bets,       setBets]       = useState([]);
  const [myBetsOpen, setMyBetsOpen] = useState(false);

  const sessionsRef = useRef(sessions);
  useEffect(() => { sessionsRef.current = sessions; }, [sessions]);

  /* Simulated session odds tick */
  useEffect(() => {
    const id = setInterval(() => {
      const cur = sessionsRef.current;
      const idx  = Math.floor(Math.random() * cur.length);
      const side = Math.random() > 0.5 ? "no" : "yes";
      const key  = `${idx}_${side}`;
      setSessions((prev) =>
        prev.map((s, i) => i !== idx ? s : {
          ...s,
          [side]: Math.max(1, s[side] + Math.floor((Math.random() - 0.5) * 4)),
        })
      );
      setFlashMap((p) => ({ ...p, [key]: true }));
      setTimeout(() => setFlashMap((p) => ({ ...p, [key]: false })), 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const openBet = (runner, type, odds, isSession = false) => {
    if (!odds) return;
    if (!isLoggedIn || !user?._id) { alert("Please log in to place a bet."); return; }
    setConfirmed(false);
    setStake("0");
    setBetSlip({ runner, type, odds, isSession });
  };

  const stakeNum       = parseFloat(stake) || 0;
  const slipProfit     = betSlip ? calculateProfit   (betSlip.type, betSlip.odds, stakeNum) : 0;
  const slipLiability  = betSlip ? calculateLiability(betSlip.type, betSlip.odds, stakeNum) : 0;
  const totalExposure  = calculateExposure(bets);
  const overLimit      = totalExposure + slipLiability > EXPOSURE_LIMIT;

  const handlePlaceBet = async () => {
    if (stakeNum < 100) return;
    if (overLimit) { alert(`Exposure limit ₹${fmtINR(EXPOSURE_LIMIT)} exceeded!`); return; }
    if (!user?._id) { alert("Session expired. Please log in again."); return; }
    try {
      const result = await placeBetApi({
        userId: user._id, matchId,
        amount: stakeNum, rate: parseFloat(betSlip.odds),
        type: normalizeType(betSlip.type),
      });
      setBets((prev) => [{
        id:        result._id || `BET${Date.now().toString().slice(-8)}`,
        runner:    betSlip.runner,
        type:      betSlip.type,
        betKind:   betSlip.type === "Lagai" ? "BACK"
                 : betSlip.type === "Khai"  ? "LAY"
                 : betSlip.type,
        odds:      betSlip.odds,
        stake:     stakeNum,
        profit:    slipProfit,
        liability: slipLiability,
        isSession: betSlip.isSession,
        status:    "MATCHED",
        placedAt:  new Date().toLocaleTimeString(),
      }, ...prev]);
      setConfirmed(true);
    } catch (err) {
      alert(`Bet failed: ${err.message}`);
    }
  };

  /* Market rows — use full team names, Indian odds */
  const marketRows = [
    {
      teamId: liveMatch?.homeTeamId ?? "A",
      full:   teamA,
      hl:     false,
      lagaiO: lagaiOdds,
      khaiO:  khaiOdds,
      isFav:  favTeam === teamAShort,
    },
    {
      teamId: liveMatch?.awayTeamId ?? "B",
      full:   teamB,
      hl:     true,
      lagaiO: lagaiOdds,
      khaiO:  khaiOdds,
      isFav:  favTeam === teamBShort,
    },
  ];

  /* ══════════════ RENDER ══════════════ */
  return (
    <div style={{ minHeight:"100vh", backgroundColor:C.bgMain,
      fontFamily:"var(--font-nunito)", paddingBottom:90 }}>
      <div style={{ maxWidth:520, margin:"0 auto", display:"flex",
        flexDirection:"column", gap:10, padding:"12px 10px" }}>

        {/* ══ SCORECARD ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.55)",
                fontFamily:"var(--font-rajdhani)", letterSpacing:0.3 }}>
                {[matchLabel, matchType, matchTime].filter(Boolean).join(" · ")}
              </span>
              {isLive ? <LiveDot /> : (
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)",
                  fontFamily:"var(--font-rajdhani)" }}>
                  {liveMatch?.status ?? "—"}
                </span>
              )}
            </div>
            <button style={{ fontSize:12, fontWeight:700, color:"#fff",
              background:C.primaryLight, border:"none", borderRadius:5,
              padding:"4px 13px", cursor:"pointer",
              fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>
              Full Scorecard
            </button>
          </div>

          {liveLoading ? (
            <div style={{ padding:"18px 14px", color:C.accent, fontSize:12 }}>
              Loading live data…
            </div>
          ) : liveError ? (
            <div style={{ padding:"18px 14px", color:"#e05560", fontSize:12 }}>
              ⚠ {liveError}
            </div>
          ) : (
            <>
              <div style={{ display:"flex", alignItems:"stretch" }}>

                {/* ── Score panel ── */}
                <div style={{ flex:1, padding:"12px 14px" }}>

                  {/* Team A */}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.textDark,
                      display:"flex", alignItems:"center" }}>
                      {teamA}
                      {isBatting(liveMatch?.homeTeamId) && <BattingDot />}
                    </span>
                    {teamAScore ? (
                      <span style={{ textAlign:"right" }}>
                        <span style={{ fontSize:15, fontWeight:700,
                          fontFamily:"var(--font-rajdhani)", color:C.textDark }}>
                          {teamAScore}
                        </span>
                        {teamAOver && (
                          <span style={{ fontSize:11, marginLeft:5, color:C.accent }}>
                            ({teamAOver} ov)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span style={{ fontSize:12, color:"#aaa" }}>Yet to bat</span>
                    )}
                  </div>

                  {/* Team B */}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.textDark,
                      display:"flex", alignItems:"center" }}>
                      {teamB}
                      {isBatting(liveMatch?.awayTeamId) && <BattingDot />}
                    </span>
                    {teamBScore ? (
                      <span style={{ textAlign:"right" }}>
                        <span style={{ fontSize:15, fontWeight:700,
                          fontFamily:"var(--font-rajdhani)", color:C.pnlGreen }}>
                          {teamBScore}
                        </span>
                        {teamBOver && (
                          <span style={{ fontSize:11, marginLeft:5, color:C.accent }}>
                            ({teamBOver} ov)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span style={{ fontSize:12, color:"#aaa" }}>Yet to bat</span>
                    )}
                  </div>

                  {/* Need-run / target / result */}
                  {result ? (
                    <div style={{ fontSize:11, color:"#4cef9a", lineHeight:1.5,
                      fontFamily:"var(--font-rajdhani)", letterSpacing:0.3,
                      fontWeight:600 }}>
                      {result}
                    </div>
                  ) : needRunBall ? (
                    <div style={{ fontSize:10, color:"#f5c842", lineHeight:1.5,
                      fontFamily:"var(--font-rajdhani)", letterSpacing:0.3 }}>
                      {needRunBall}
                    </div>
                  ) : null}

                  {/* Toss */}
                  {toss && (
                    <div style={{ fontSize:9, color:C.accent, marginTop:5,
                      letterSpacing:0.2, lineHeight:1.4 }}>
                      🪙 {toss}
                    </div>
                  )}

                  {/* Venue */}
                  {liveMatch?.venue && (
                    <div style={{ fontSize:9, color:C.accent, marginTop:4, letterSpacing:0.2 }}>
                      📍 {liveMatch.venue}
                    </div>
                  )}
                </div>

                {/* ── Rate badge — show only when odds are available ── */}
                {(lagaiOdds || khaiOdds) && (
                  <div style={{ minWidth:82, backgroundColor:C.yesBg,
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    padding:"10px 6px", gap:6 }}>

                    <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)",
                      fontFamily:"var(--font-rajdhani)", letterSpacing:0.8,
                      textTransform:"uppercase" }}>Rate</span>

                    {/* Lagai */}
                    {lagaiOdds && (
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)",
                          fontFamily:"var(--font-rajdhani)", marginBottom:1 }}>Lagai</div>
                        <div style={{ fontSize:20, fontWeight:700, color:"#fff",
                          fontFamily:"var(--font-rajdhani)", letterSpacing:1 }}>
                          {lagaiOdds}
                        </div>
                      </div>
                    )}

                    {/* Khai — only when different from Lagai */}
                    {khaiOdds && khaiOdds !== lagaiOdds && (
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)",
                          fontFamily:"var(--font-rajdhani)", marginBottom:1 }}>Khai</div>
                        <div style={{ fontSize:14, fontWeight:600,
                          color:"rgba(255,255,255,0.85)",
                          fontFamily:"var(--font-rajdhani)" }}>
                          {khaiOdds}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ backgroundColor:C.banner, height:30 }} />
        </div>

        {/* ══ EXPOSURE METER ══ */}
        {totalExposure > 0 && (
          <div style={{ background:C.primary, borderRadius:10, padding:"8px 14px",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            border:`1px solid ${C.banner}` }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)",
              fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>TOTAL EXPOSURE</span>
            <span style={{ fontSize:13, fontWeight:700, fontFamily:"var(--font-rajdhani)",
              color: totalExposure > EXPOSURE_LIMIT * 0.8 ? "#e05560" : "#f5c842" }}>
              ₹{fmtINR(totalExposure)} / ₹{fmtINR(EXPOSURE_LIMIT)}
            </span>
          </div>
        )}

        {/* ══ MARKET ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff",
              fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>
              Market (Min: {fmtINR(mockMatch.marketMinMax.min)}, Max:{" "}
              {fmtINR(mockMatch.marketMinMax.max)})
            </span>
            <span style={{ fontSize:13, fontWeight:700, color:"#4cef9a" }}>
              {bets.filter((b) => !b.isSession).length || 0}
            </span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={tblHdr}>
                <TH left w="40%">TEAM</TH>
                <TH>LAGAI</TH>
                <TH>KHAI</TH>
                <TH>+/-</TH>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row, i) => {
                const { profit, loss } = calcRunnerPnlSplit(bets, row.full);
                const hasActivity = profit > 0 || loss > 0;
                return (
                  <tr key={i} style={{
                    backgroundColor: row.hl ? C.hlRow : "transparent",
                    opacity: (!lagaiOdds && !khaiOdds) ? 0.55 : 1,
                  }}>
                    <TD left bold style={{ color: row.hl ? C.primary : C.textDark }}>
                      <span style={{ display:"flex", alignItems:"center", gap:5,
                        flexWrap:"wrap" }}>
                        {/* Full team name, wrap on small screens */}
                        <span style={{ lineHeight:1.3 }}>{row.full}</span>
                        {row.isFav && (
                          <span style={{ fontSize:9, background:C.yesBg, color:"#fff",
                            borderRadius:3, padding:"1px 5px", whiteSpace:"nowrap",
                            fontFamily:"var(--font-rajdhani)", fontWeight:700 }}>
                            FAV
                          </span>
                        )}
                      </span>
                    </TD>

                    <TD>
                      <OddsBtn
                        color={C.lagai}
                        label={row.lagaiO ?? "—"}
                        disabled={!row.lagaiO}
                        onClick={() => openBet(row.full, "Lagai", row.lagaiO, false)}
                      />
                    </TD>

                    <TD>
                      <OddsBtn
                        color={C.khai}
                        label={row.khaiO ?? "—"}
                        disabled={!row.khaiO}
                        onClick={() => openBet(row.full, "Khai", row.khaiO, false)}
                      />
                    </TD>

                    <TD>
                      {!hasActivity ? (
                        <span style={{ color:"#aaa" }}>0</span>
                      ) : (
                        <span style={{ display:"flex", flexDirection:"column",
                          alignItems:"center", gap:1 }}>
                          <span style={{ color:C.pnlGreen, fontWeight:700, fontSize:11 }}>
                            +{fmtINR(profit)}
                          </span>
                          <span style={{ color:"#e05560", fontWeight:700, fontSize:11 }}>
                            -{fmtINR(loss)}
                          </span>
                        </span>
                      )}
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ══ SESSION ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff",
              fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>
              Session (Min: 100, Max: 1,00,000)
            </span>
            <span style={{ fontSize:13, fontWeight:700, color:"#4cef9a" }}>
              {bets.filter((b) => b.isSession).length || 0}
            </span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
            <colgroup>
              <col style={{ width:"28%" }} /><col style={{ width:"13%" }} />
              <col style={{ width:"10%" }} /><col style={{ width:"13%" }} />
              <col style={{ width:"10%" }} /><col style={{ width:"26%" }} />
            </colgroup>
            <thead>
              <tr style={tblHdr}>
                <TH left>SESSION</TH><TH>NO</TH><TH>RATE</TH>
                <TH>YES</TH><TH>RATE</TH><TH>+/-</TH>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, idx) => {
                const { profit, loss } = calcSessionPnlSplit(bets, s.name);
                const hasActivity = profit > 0 || loss > 0;
                return (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f4f8fd" : C.inputBg }}>
                    <TD left small>{s.name}</TD>
                    <TD>
                      <OddsBtn color={C.noBg} label={s.no}
                        flash={!!flashMap[`${idx}_no`]}
                        onClick={() => openBet(s.name, "No", String(s.no), true)} />
                    </TD>
                    <TD><span style={{ color:C.accent, fontSize:11 }}>{s.noRate}</span></TD>
                    <TD>
                      <OddsBtn color={C.yesBg} label={s.yes}
                        flash={!!flashMap[`${idx}_yes`]}
                        onClick={() => openBet(s.name, "Yes", String(s.yes), true)} />
                    </TD>
                    <TD><span style={{ color:C.accent, fontSize:11 }}>{s.yesRate}</span></TD>
                    <TD>
                      {!hasActivity ? (
                        <span style={{ color:"#aaa" }}>0</span>
                      ) : (
                        <span style={{ display:"flex", flexDirection:"column",
                          alignItems:"center", gap:1 }}>
                          <span style={{ color:C.pnlGreen, fontWeight:700, fontSize:11 }}>
                            +{profit.toFixed(2)}
                          </span>
                          <span style={{ color:"#e05560", fontWeight:700, fontSize:11 }}>
                            -{loss.toFixed(2)}
                          </span>
                        </span>
                      )}
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ══ MATCH TIE ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff",
              fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>
              Match Tie (Min: {fmtINR(mockMatch.matchTieLimit.min)}, Max:{" "}
              {fmtINR(mockMatch.matchTieLimit.max)})
            </span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={tblHdr}>
                <TH left w="42%">RUNNER</TH><TH>LAGAI</TH><TH>KHAI</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD left bold>Match Tie</TD>
                <TD>
                  <OddsBtn color={C.lagai} label="90"
                    onClick={() => openBet("Match Tie", "Lagai", "90", false)} />
                </TD>
                <TD>
                  <OddsBtn color={C.khai} label="100"
                    onClick={() => openBet("Match Tie", "Khai", "100", false)} />
                </TD>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ MY BETS ══ */}
        {bets.length > 0 && (
          <div style={card}>
            <div style={{ ...sectionBar(), cursor:"pointer" }}
              onClick={() => setMyBetsOpen((o) => !o)}>
              <span style={{ fontSize:12, fontWeight:700, color:"#fff",
                fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>
                MY BETS ({bets.length})
              </span>
              <span style={{ fontSize:11, color:"#4cef9a", fontFamily:"var(--font-rajdhani)" }}>
                {myBetsOpen ? "▲ Hide" : "▼ Show"}
              </span>
            </div>
            {myBetsOpen && (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={tblHdr}>
                    <TH left>RUNNER</TH><TH>KIND</TH><TH>ODDS</TH>
                    <TH>STAKE</TH><TH>PROFIT</TH><TH>LIAB.</TH>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((b) => (
                    <tr key={b.id} style={{ backgroundColor:C.inputBg }}>
                      <TD left small>{b.runner}</TD>
                      <TD>
                        <span style={{ padding:"2px 7px", borderRadius:4, fontSize:10,
                          fontWeight:700, color:"#fff", fontFamily:"var(--font-rajdhani)",
                          background: b.type === "Lagai" || b.type === "Yes"
                            ? C.lagai : C.khai }}>
                          {b.betKind}
                        </span>
                      </TD>
                      <TD small>{b.odds}</TD>
                      <TD small>₹{fmtINR(b.stake)}</TD>
                      <TD green small>+₹{fmtINR(b.profit)}</TD>
                      <TD red  small>₹{fmtINR(b.liability)}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ══ BET SLIP BOTTOM SHEET ══ */}
      {betSlip && (
        <div style={{ position:"fixed", bottom:0, left:"50%",
          transform:"translateX(-50%)", width:"100%", maxWidth:520,
          backgroundColor:C.primary, borderTop:`3px solid ${C.banner}`,
          borderRadius:"16px 16px 0 0", padding:18, zIndex:400,
          animation:"betSlideUp 0.26s ease" }}>
          <style>{`@keyframes betSlideUp{from{opacity:0;transform:translateX(-50%) translateY(50px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>

          {!confirmed ? (
            <>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#fff",
                    fontFamily:"var(--font-rajdhani)", letterSpacing:0.4 }}>
                    {betSlip.type === "Lagai" ? "BACK"
                    : betSlip.type === "Khai"  ? "LAY"
                    : betSlip.type}
                    {" · "}{betSlip.runner}
                  </span>
                  <span style={{
                    background: ["Lagai","Yes"].includes(betSlip.type) ? C.lagai : C.khai,
                    color:"#fff", fontSize:12, fontWeight:700,
                    padding:"2px 10px", borderRadius:4,
                    fontFamily:"var(--font-rajdhani)" }}>
                    {betSlip.odds}
                  </span>
                  {betSlip.isSession && (
                    <span style={{ background:"rgba(255,255,255,0.13)",
                      color:"rgba(255,255,255,0.75)", fontSize:10,
                      padding:"2px 8px", borderRadius:4,
                      fontFamily:"var(--font-rajdhani)" }}>
                      SESSION
                    </span>
                  )}
                </div>
                <button onClick={() => setBetSlip(null)}
                  style={{ background:"rgba(255,255,255,0.12)", border:"none", color:"#fff",
                    borderRadius:"50%", width:26, height:26, cursor:"pointer",
                    fontSize:13, fontWeight:700, flexShrink:0 }}>
                  ✕
                </button>
              </div>

              <input type="number" value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="Enter stake (Min: ₹100)"
                style={{ width:"100%", background:"rgba(255,255,255,0.09)",
                  border:`1px solid ${C.banner}`, borderRadius:8, color:"#fff",
                  fontSize:15, padding:"9px 12px", outline:"none",
                  marginBottom:10, fontFamily:"var(--font-nunito)",
                  boxSizing:"border-box" }} />

              <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                {[100, 500, 1000, 5000].map((v) => (
                  <button key={v}
                    onClick={() => setStake((s) => String((parseInt(s) || 0) + v))}
                    style={{ flex:1, background:C.primaryLight,
                      border:`1px solid ${C.banner}`, color:C.accent,
                      fontSize:12, fontWeight:600, padding:"5px 0",
                      borderRadius:5, cursor:"pointer",
                      fontFamily:"var(--font-rajdhani)" }}>
                    +{fmtINR(v)}
                  </button>
                ))}
              </div>

              {overLimit && (
                <div style={{ background:"rgba(224,85,96,0.18)", border:"1px solid #e05560",
                  borderRadius:7, padding:"7px 12px", marginBottom:10,
                  fontSize:11, color:"#e05560", fontFamily:"var(--font-rajdhani)" }}>
                  ⚠ Exposure limit ₹{fmtINR(EXPOSURE_LIMIT)} exceeded. Reduce stake.
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                gap:8, marginBottom:14 }}>
                {[
                  { label:"Stake",     val:`₹${fmtINR(stakeNum)}`,      color:"#fff"    },
                  { label:"Liability", val:`₹${fmtINR(slipLiability)}`, color:"#e05560" },
                  { label:"Profit",    val:`₹${fmtINR(slipProfit)}`,    color:"#4cef9a" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background:"rgba(255,255,255,0.07)",
                    borderRadius:8, padding:"8px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)",
                      textTransform:"uppercase", letterSpacing:0.4, marginBottom:3,
                      fontFamily:"var(--font-rajdhani)" }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:700, color,
                      fontFamily:"var(--font-rajdhani)" }}>{val}</div>
                  </div>
                ))}
              </div>

              <button onClick={handlePlaceBet} disabled={overLimit || stakeNum < 100}
                style={{ width:"100%", background: overLimit ? "#4a4a5a" : C.yesBg,
                  border:"none", borderRadius:8, color:"#fff", fontWeight:700,
                  fontSize:14, padding:11,
                  cursor: overLimit || stakeNum < 100 ? "not-allowed" : "pointer",
                  fontFamily:"var(--font-rajdhani)", letterSpacing:0.5, marginBottom:8,
                  opacity: overLimit || stakeNum < 100 ? 0.55 : 1,
                  transition:"opacity 0.2s" }}>
                Confirm Bet
              </button>
              <button onClick={() => setBetSlip(null)}
                style={{ width:"100%", background:"transparent",
                  border:"1px solid rgba(255,255,255,0.18)", borderRadius:8,
                  color:"rgba(255,255,255,0.5)", fontSize:13, padding:9,
                  cursor:"pointer", fontFamily:"var(--font-nunito)" }}>
                Cancel
              </button>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"10px 0" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:C.yesBg,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color:"#4cef9a",
                fontFamily:"var(--font-rajdhani)", marginBottom:4 }}>Bet Placed!</div>
              <div style={{ fontSize:11, color:"#a0c4e0", marginBottom:6,
                fontFamily:"var(--font-rajdhani)", letterSpacing:0.5 }}>
                STATUS: <span style={{ color:"#4cef9a", fontWeight:700 }}>MATCHED</span>
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:14 }}>
                {betSlip.type === "Lagai" ? "BACK"
                : betSlip.type === "Khai"  ? "LAY"
                : betSlip.type}
                {" · "}{betSlip.runner} · ₹{fmtINR(stakeNum)} @ {betSlip.odds}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {[
                  { label:"Liability", val:`₹${fmtINR(slipLiability)}`, color:"#e05560" },
                  { label:"Profit",    val:`₹${fmtINR(slipProfit)}`,    color:"#4cef9a" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background:"rgba(255,255,255,0.07)",
                    borderRadius:8, padding:"8px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)",
                      textTransform:"uppercase", letterSpacing:0.4, marginBottom:3,
                      fontFamily:"var(--font-rajdhani)" }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:700, color,
                      fontFamily:"var(--font-rajdhani)" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.28)", marginBottom:14 }}>
                Bet ID: {bets[0]?.id ?? "—"}
              </div>
              <button onClick={() => setBetSlip(null)}
                style={{ width:"100%", background:C.primaryLight, border:"none",
                  borderRadius:8, color:"#fff", fontWeight:700, fontSize:13,
                  padding:10, cursor:"pointer", fontFamily:"var(--font-rajdhani)" }}>
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══ CHAT BUTTON ══ */}
      <button onClick={() => setChatOpen((o) => !o)}
        style={{ position:"fixed", bottom:22, right:18, width:48, height:48,
          borderRadius:"50%", background:C.yesBg, border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 3px 14px rgba(0,0,0,0.25)", zIndex:300 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>

      {chatOpen && (
        <div style={{ position:"fixed", bottom:78, right:14, background:C.primary,
          border:`1px solid ${C.banner}`, borderRadius:12, padding:"14px 16px",
          width:210, fontSize:12, color:"rgba(255,255,255,0.65)",
          zIndex:299, boxShadow:"0 4px 18px rgba(0,0,0,0.25)" }}>
          <div style={{ color:"#fff", fontWeight:700, marginBottom:6, fontSize:13,
            fontFamily:"var(--font-rajdhani)" }}>Need help?</div>
          <p style={{ lineHeight:1.6 }}>
            Support available 24/7 for all betting queries and account issues.
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchDetail;