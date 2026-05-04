import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

/* ─── palette ─── */
const C = {
  primary: "#1E3A5F",
  primaryLight: "#2E5080",
  banner: "#4B75B8",
  bgMain: "#E8EDF3",
  inputBg: "#FFFFFF",
  textDark: "#1A2B3C",
  border: "#CDD9E5",
  accent: "#90B4D4",
  btnBg: "#2B4A7A",
  lagai: "#4A90D9",
  khai: "#C94070",
  noBg: "#2B4A7A",
  yesBg: "#1A8070",
  hlRow: "#D4E3F5",
  pnlGreen: "#1A8070",
  sectionHdr: "#1E3A5F",
  tableHdr: "#2B4A7A",
};

const EXPOSURE_LIMIT = 10000;

/* ══════════════════════════════════════════════════════════════
   BETTING LOGIC HELPERS
══════════════════════════════════════════════════════════════ */

const normalizeType = (type) => {
  if (type === "Lagai" || type === "Yes") return "yes";
  if (type === "Khai" || type === "No") return "no";
  return type;
};

// For BACK/YES (Lagai): Profit = (rate × stake) / 100 | Loss = stake
// For LAY/NO  (Khai):   Profit = stake               | Loss = (rate × stake) / 100
const calculateProfit = (type, rate, stake) => {
  const t = normalizeType(type);
  const r = parseFloat(rate) || 0;
  const s = parseFloat(stake) || 0;
  if (t === "yes") return parseFloat(((r * s) / 100).toFixed(2));
  if (t === "no") return parseFloat(s.toFixed(2));
  return 0;
};

const calculateLiability = (type, rate, stake) => {
  const t = normalizeType(type);
  const r = parseFloat(rate) || 0;
  const s = parseFloat(stake) || 0;
  if (t === "yes") return parseFloat(s.toFixed(2));
  if (t === "no") return parseFloat(((r * s) / 100).toFixed(2));
  return 0;
};

const calculateExposure = (bets) =>
  bets
    .filter((b) => b.status === "OPEN" || b.status === "MATCHED")
    .reduce((sum, b) => sum + b.liability, 0);

// Returns { profit, loss } for a runner — used for split +/- display in market table
const calcRunnerPnlSplit = (bets, runner) => {
  let profit = 0;
  let loss = 0;
  bets
    .filter(
      (b) =>
        b.runner === runner &&
        (b.status === "OPEN" || b.status === "MATCHED")
    )
    .forEach((b) => {
      const t = normalizeType(b.type);
      if (t === "yes") {
        // Back bet: if runner wins → earn profit; if runner loses → lose liability
        profit += b.profit;
        loss += b.liability;
      }
      if (t === "no") {
        // Lay bet: if runner loses → earn liability as profit; if runner wins → lose profit amount
        profit += b.liability;
        loss += b.profit;
      }
    });
  return {
    profit: parseFloat(profit.toFixed(2)),
    loss: parseFloat(loss.toFixed(2)),
  };
};

// Net PnL for a runner (used for simple single-value display where needed)
const calcRunnerPnl = (bets, runner) => {
  const { profit, loss } = calcRunnerPnlSplit(bets, runner);
  return parseFloat((profit - loss).toFixed(2));
};

const calcSessionPnlSplit = (bets, name) => {
  let profit = 0;
  let loss = 0;
  bets
    .filter(
      (b) =>
        b.runner === name &&
        (b.status === "OPEN" || b.status === "MATCHED")
    )
    .forEach((b) => {
      const t = normalizeType(b.type);
      if (t === "yes") {
        profit += b.profit;
        loss += b.liability;
      }
      if (t === "no") {
        profit += b.liability;
        loss += b.profit;
      }
    });
  return {
    profit: parseFloat(profit.toFixed(2)),
    loss: parseFloat(loss.toFixed(2)),
  };
};

/* ─── API ─── */
async function placeBetApi(payload) {
  const res = await fetch("http://localhost:5000/api/bet/place", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

/* ─── UI Atoms ─── */
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
  <th
    style={{
      padding: "8px 10px",
      fontSize: 11,
      fontWeight: 700,
      color: "#fff",
      textAlign: left ? "left" : "center",
      letterSpacing: 0.5,
      fontFamily: "var(--font-rajdhani)",
      width: w,
    }}
  >
    {children}
  </th>
);

const TD = ({ left, bold, green, red, small, children, style: s }) => (
  <td
    style={{
      padding: "9px 10px",
      fontSize: small ? 11 : 12,
      color: red ? "#e05560" : green ? C.pnlGreen : C.textDark,
      fontWeight: bold || green || red ? 700 : 400,
      textAlign: left ? "left" : "center",
      borderBottom: `1px solid ${C.border}`,
      fontFamily: "var(--font-nunito)",
      verticalAlign: "middle",
      ...s,
    }}
  >
    {children}
  </td>
);

const OddsBtn = ({ color, label, flash, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: color,
      border: "none",
      borderRadius: 5,
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
      padding: "7px 14px",
      cursor: "pointer",
      minWidth: 42,
      fontFamily: "var(--font-rajdhani)",
      letterSpacing: 0.3,
      transition: "filter 0.15s, transform 0.1s",
      filter: flash ? "brightness(2)" : "brightness(1)",
      transform: flash ? "scale(0.93)" : "scale(1)",
    }}
  >
    {label ?? ""}
  </button>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const MatchDetail = () => {
  const { matchId } = useParams();

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const mockMatch = {
    id: matchId,
    homeTeam: "Bangladesh Women",
    awayTeam: "Sri Lanka Women",
    homeScore: "0-0",
    homeOvers: "0",
    awayScore: "161-4",
    awayOvers: "20.0",
    time: "2:34 PM",
    crOver: "CR Over",
    marketMinMax: { min: 100, max: 300000 },
    sessionMarkets: [
      { name: "6 over run BAN W", no: 42, noRate: "1.0", yes: 44, yesRate: "1.0" },
      { name: "Fall of 1st wkt B...", no: 18, noRate: "1.0", yes: 20, yesRate: "1.0" },
      { name: "D Akter run(BA...", no: 12, noRate: "1.0", yes: 14, yesRate: "1.0" },
      { name: "J Ferdous run(B...", no: 8, noRate: "1.0", yes: 10, yesRate: "1.0" },
    ],
    matchTieLimit: { min: 100, max: 10000 },
  };

  const teamA = mockMatch.homeTeam;
  const teamB = mockMatch.awayTeam;

  const [sessions, setSessions] = useState(mockMatch.sessionMarkets);
  const [flashMap, setFlashMap] = useState({});
  const [betSlip, setBetSlip] = useState(null);
  const [stake, setStake] = useState("0");       // ← default 0
  const [confirmed, setConfirmed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [bets, setBets] = useState([]);
  const [myBetsOpen, setMyBetsOpen] = useState(false);

  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    const id = setInterval(() => {
      const cur = sessionsRef.current;
      const idx = Math.floor(Math.random() * cur.length);
      const side = Math.random() > 0.5 ? "no" : "yes";
      const key = `${idx}_${side}`;
      setSessions((prev) =>
        prev.map((s, i) =>
          i !== idx
            ? s
            : {
                ...s,
                [side]: Math.max(
                  1,
                  s[side] + Math.floor((Math.random() - 0.5) * 4)
                ),
              }
        )
      );
      setFlashMap((p) => ({ ...p, [key]: true }));
      setTimeout(() => setFlashMap((p) => ({ ...p, [key]: false })), 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  /* ── openBet: stake always starts at 0 ── */
  const openBet = (runner, type, odds, isSession = false) => {
    if (!isLoggedIn || !user?._id) {
      alert("Please log in to place a bet.");
      return;
    }
    setConfirmed(false);
    setStake("0");           // ← was "500", now "0"
    setBetSlip({ runner, type, odds, isSession });
  };

  /* Derived slip values — all 0 when stake is 0 */
  const stakeNum = parseFloat(stake) || 0;
  const slipProfit = betSlip
    ? calculateProfit(betSlip.type, betSlip.odds, stakeNum)
    : 0;
  const slipLiability = betSlip
    ? calculateLiability(betSlip.type, betSlip.odds, stakeNum)
    : 0;
  const totalExposure = calculateExposure(bets);
  const exposureAfter = totalExposure + slipLiability;
  const overLimit = exposureAfter > EXPOSURE_LIMIT;

  /* ── handlePlaceBet ── */
  const handlePlaceBet = async () => {
    if (stakeNum < 100) return;
    if (overLimit) {
      alert(`Exposure limit ₹${EXPOSURE_LIMIT.toLocaleString()} exceeded!`);
      return;
    }
    if (!user?._id) {
      alert("Session expired. Please log in again.");
      return;
    }

    const betType = normalizeType(betSlip.type);

    const payload = {
      userId: user._id,
      matchId: matchId,
      amount: stakeNum,
      rate: parseFloat(betSlip.odds),
      type: betType,
    };

    try {
      const result = await placeBetApi(payload);

      const newBet = {
        id: result._id || `BET${Date.now().toString().slice(-8)}`,
        runner: betSlip.runner,
        type: betSlip.type,
        betKind:
          betSlip.type === "Lagai"
            ? "BACK"
            : betSlip.type === "Khai"
            ? "LAY"
            : betSlip.type,
        odds: betSlip.odds,
        stake: stakeNum,
        profit: slipProfit,
        liability: slipLiability,
        isSession: betSlip.isSession,
        status: "MATCHED",
        placedAt: new Date().toLocaleTimeString(),
      };

      setBets((prev) => [newBet, ...prev]);
      setConfirmed(true);
    } catch (error) {
      alert(`Bet failed: ${error.message}`);
    }
  };

  /* ── Market rows definition ── */
  const marketRows = [
    { short: "Bangladesh W", full: teamA, hl: false, lagaiO: "48", khaiO: "50" },
    { short: "Sri Lanka W",  full: teamB, hl: true,  lagaiO: "48", khaiO: "50" },
  ];

  // Determine favourite: team with the lowest lagaiO (back) odds
  const minLagaiOdds = Math.min(...marketRows.map((r) => parseFloat(r.lagaiO)));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: C.bgMain,
        fontFamily: "var(--font-nunito)",
        paddingBottom: 90,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "12px 10px",
        }}
      >
        {/* ══ SCORECARD ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-rajdhani)",
              }}
            >
              {mockMatch.time}
            </span>
            <button
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                background: C.primaryLight,
                border: "none",
                borderRadius: 5,
                padding: "4px 13px",
                cursor: "pointer",
                fontFamily: "var(--font-rajdhani)",
                letterSpacing: 0.4,
              }}
            >
              Show Full Scorecard
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{ flex: 1, padding: "12px 14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>
                  {teamA}
                </span>
                <span style={{ fontSize: 13, color: "#5a7a99" }}>
                  {mockMatch.homeScore} ({mockMatch.homeOvers})
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>
                  {teamB}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.pnlGreen }}>
                  {mockMatch.awayScore} ({mockMatch.awayOvers})
                </span>
              </div>
              <div style={{ fontSize: 10, color: C.accent, marginTop: 5 }}>
                {mockMatch.crOver}
              </div>
            </div>
            <div
              style={{
                width: 76,
                backgroundColor: C.yesBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "var(--font-rajdhani)",
                  letterSpacing: 1,
                }}
              >
                Inni…
              </span>
            </div>
          </div>
          <div style={{ backgroundColor: C.banner, height: 30 }} />
        </div>

        {/* ══ EXPOSURE METER ══ */}
        {totalExposure > 0 && (
          <div
            style={{
              background: C.primary,
              borderRadius: 10,
              padding: "8px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: `1px solid ${C.banner}`,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "var(--font-rajdhani)",
                letterSpacing: 0.4,
              }}
            >
              TOTAL EXPOSURE
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-rajdhani)",
                color:
                  totalExposure > EXPOSURE_LIMIT * 0.8 ? "#e05560" : "#f5c842",
              }}
            >
              ₹{totalExposure.toFixed(2)} / ₹{EXPOSURE_LIMIT.toLocaleString()}
            </span>
          </div>
        )}

        {/* ══ MARKET ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "var(--font-rajdhani)",
                letterSpacing: 0.4,
              }}
            >
              Market (Min: {mockMatch.marketMinMax.min.toLocaleString()}, Max:{" "}
              {mockMatch.marketMinMax.max.toLocaleString()})
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4cef9a" }}>
              {bets.filter((b) => !b.isSession).length || 0}
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={tblHdr}>
                <TH left w="38%">RUNNER</TH>
                <TH>LAGAI</TH>
                <TH>KHAI</TH>
                <TH>+/-</TH>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row, i) => {
                const { profit, loss } = calcRunnerPnlSplit(bets, row.full);
                const hasActivity = profit > 0 || loss > 0;
                const isFavourite =
                  parseFloat(row.lagaiO) === minLagaiOdds;

                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: row.hl ? C.hlRow : "transparent",
                      // Dim non-favourite row slightly
                      opacity: !isFavourite ? 0.62 : 1,
                    }}
                  >
                    {/* Runner name + FAV badge */}
                    <TD
                      left
                      bold
                      style={{ color: row.hl ? C.primary : C.textDark }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {row.short}
                        {isFavourite && (
                          <span
                            style={{
                              fontSize: 9,
                              background: C.yesBg,
                              color: "#fff",
                              borderRadius: 3,
                              padding: "1px 5px",
                              fontFamily: "var(--font-rajdhani)",
                              letterSpacing: 0.3,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            FAV
                          </span>
                        )}
                      </span>
                    </TD>

                    {/* Lagai button — use full colour for favourite, muted for other */}
                    <TD>
                      <OddsBtn
                        color={isFavourite ? C.lagai : C.accent}
                        label={row.lagaiO}
                        onClick={() =>
                          openBet(row.full, "Lagai", row.lagaiO, false)
                        }
                      />
                    </TD>

                    {/* Khai button */}
                    <TD>
                      <OddsBtn
                        color={isFavourite ? C.khai : "#9a607a"}
                        label={row.khaiO}
                        onClick={() =>
                          openBet(row.full, "Khai", row.khaiO, false)
                        }
                      />
                    </TD>

                    {/* +/- column: show profit in green AND loss in red */}
                    <TD>
                      {!hasActivity ? (
                        <span style={{ color: "#aaa" }}>0</span>
                      ) : (
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span
                            style={{
                              color: C.pnlGreen,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            +{profit}
                          </span>
                          <span
                            style={{
                              color: "#e05560",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            -{loss}
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
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "var(--font-rajdhani)",
                letterSpacing: 0.4,
              }}
            >
              SESSION (Min: 100, Max: 1,00,000)
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4cef9a" }}>
              {bets.filter((b) => b.isSession).length || 0}
            </span>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>
            <thead>
              <tr style={tblHdr}>
                <TH left>SESSION</TH>
                <TH>NO</TH>
                <TH>RATE</TH>
                <TH>YES</TH>
                <TH>RATE</TH>
                <TH>+/-</TH>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, idx) => {
                const { profit, loss } = calcSessionPnlSplit(bets, s.name);
                const hasActivity = profit > 0 || loss > 0;

                return (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f4f8fd" : C.inputBg,
                    }}
                  >
                    <TD left small>{s.name}</TD>
                    <TD>
                      <OddsBtn
                        color={C.noBg}
                        label={s.no}
                        flash={!!flashMap[`${idx}_no`]}
                        onClick={() =>
                          openBet(s.name, "No", String(s.no), true)
                        }
                      />
                    </TD>
                    <TD>
                      <span style={{ color: C.accent, fontSize: 11 }}>
                        {s.noRate}
                      </span>
                    </TD>
                    <TD>
                      <OddsBtn
                        color={C.yesBg}
                        label={s.yes}
                        flash={!!flashMap[`${idx}_yes`]}
                        onClick={() =>
                          openBet(s.name, "Yes", String(s.yes), true)
                        }
                      />
                    </TD>
                    <TD>
                      <span style={{ color: C.accent, fontSize: 11 }}>
                        {s.yesRate}
                      </span>
                    </TD>

                    {/* Session +/- column: profit green / loss red */}
                    <TD>
                      {!hasActivity ? (
                        <span style={{ color: "#aaa" }}>0</span>
                      ) : (
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span
                            style={{
                              color: C.pnlGreen,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            +{profit.toFixed(2)}
                          </span>
                          <span
                            style={{
                              color: "#e05560",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
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
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "var(--font-rajdhani)",
                letterSpacing: 0.4,
              }}
            >
              Market : Match Tie (Min: {mockMatch.matchTieLimit.min}, Max:{" "}
              {mockMatch.matchTieLimit.max.toLocaleString()})
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={tblHdr}>
                <TH left w="42%">RUNNER</TH>
                <TH>Lagai</TH>
                <TH>Khai</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD left bold>Match Tie</TD>
                <TD>
                  <OddsBtn
                    color={C.lagai}
                    label="90"
                    onClick={() => openBet("Match Tie", "Lagai", "90", false)}
                  />
                </TD>
                <TD>
                  <OddsBtn
                    color={C.khai}
                    label="100"
                    onClick={() => openBet("Match Tie", "Khai", "100", false)}
                  />
                </TD>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ MY BETS ══ */}
        {bets.length > 0 && (
          <div style={card}>
            <div
              style={{ ...sectionBar(), cursor: "pointer" }}
              onClick={() => setMyBetsOpen((o) => !o)}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "var(--font-rajdhani)",
                  letterSpacing: 0.4,
                }}
              >
                MY BETS ({bets.length})
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#4cef9a",
                  fontFamily: "var(--font-rajdhani)",
                }}
              >
                {myBetsOpen ? "▲ Hide" : "▼ Show"}
              </span>
            </div>

            {myBetsOpen && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={tblHdr}>
                    <TH left>RUNNER</TH>
                    <TH>KIND</TH>
                    <TH>ODDS</TH>
                    <TH>STAKE</TH>
                    <TH>PROFIT</TH>
                    <TH>LIAB.</TH>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((b) => (
                    <tr key={b.id} style={{ backgroundColor: C.inputBg }}>
                      <TD left small>{b.runner}</TD>
                      <TD>
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#fff",
                            fontFamily: "var(--font-rajdhani)",
                            background:
                              b.type === "Lagai" || b.type === "Yes"
                                ? C.lagai
                                : C.khai,
                          }}
                        >
                          {b.betKind}
                        </span>
                      </TD>
                      <TD small>{b.odds}</TD>
                      <TD small>₹{b.stake}</TD>
                      <TD green small>+₹{b.profit}</TD>
                      <TD red small>₹{b.liability}</TD>
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
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 520,
            backgroundColor: C.primary,
            borderTop: `3px solid ${C.banner}`,
            borderRadius: "16px 16px 0 0",
            padding: 18,
            zIndex: 400,
            animation: "betSlideUp 0.26s ease",
          }}
        >
          <style>{`@keyframes betSlideUp{from{opacity:0;transform:translateX(-50%) translateY(50px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>

          {!confirmed ? (
            <>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "var(--font-rajdhani)",
                      letterSpacing: 0.4,
                    }}
                  >
                    {betSlip.type === "Lagai"
                      ? "BACK"
                      : betSlip.type === "Khai"
                      ? "LAY"
                      : betSlip.type}{" "}
                    · {betSlip.runner}
                  </span>
                  <span
                    style={{
                      background: ["Lagai", "Yes"].includes(betSlip.type)
                        ? C.lagai
                        : C.khai,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 4,
                      fontFamily: "var(--font-rajdhani)",
                    }}
                  >
                    {betSlip.odds}
                  </span>
                  {betSlip.isSession && (
                    <span
                      style={{
                        background: "rgba(255,255,255,0.13)",
                        color: "rgba(255,255,255,0.75)",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontFamily: "var(--font-rajdhani)",
                      }}
                    >
                      SESSION
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setBetSlip(null)}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Stake input */}
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="Enter stake (Min: 100)"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.09)",
                  border: `1px solid ${C.banner}`,
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 15,
                  padding: "9px 12px",
                  outline: "none",
                  marginBottom: 10,
                  fontFamily: "var(--font-nunito)",
                  boxSizing: "border-box",
                }}
              />

              {/* Quick-add buttons */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[100, 500, 1000, 5000].map((v) => (
                  <button
                    key={v}
                    onClick={() =>
                      setStake((s) => String((parseInt(s) || 0) + v))
                    }
                    style={{
                      flex: 1,
                      background: C.primaryLight,
                      border: `1px solid ${C.banner}`,
                      color: C.accent,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "5px 0",
                      borderRadius: 5,
                      cursor: "pointer",
                      fontFamily: "var(--font-rajdhani)",
                    }}
                  >
                    +{v}
                  </button>
                ))}
              </div>

              {/* Exposure warning */}
              {overLimit && (
                <div
                  style={{
                    background: "rgba(224,85,96,0.18)",
                    border: "1px solid #e05560",
                    borderRadius: 7,
                    padding: "7px 12px",
                    marginBottom: 10,
                    fontSize: 11,
                    color: "#e05560",
                    fontFamily: "var(--font-rajdhani)",
                  }}
                >
                  ⚠ Exposure limit of ₹{EXPOSURE_LIMIT.toLocaleString()}{" "}
                  exceeded. Reduce stake.
                </div>
              )}

              {/* Stats: Stake / Liability / Profit — all 0 on open, live update on type */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  { label: "Stake",     val: `₹${stakeNum}`,      color: "#fff"    },
                  { label: "Liability", val: `₹${slipLiability}`, color: "#e05560" },
                  { label: "Profit",    val: `₹${slipProfit}`,    color: "#4cef9a" },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 8,
                      padding: "8px 6px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.45)",
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        marginBottom: 3,
                        fontFamily: "var(--font-rajdhani)",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color,
                        fontFamily: "var(--font-rajdhani)",
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePlaceBet}
                disabled={overLimit || stakeNum < 100}
                style={{
                  width: "100%",
                  background: overLimit ? "#4a4a5a" : C.yesBg,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: 11,
                  cursor: overLimit || stakeNum < 100 ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-rajdhani)",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  opacity: overLimit || stakeNum < 100 ? 0.55 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                Confirm Bet
              </button>
              <button
                onClick={() => setBetSlip(null)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  padding: 9,
                  cursor: "pointer",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            /* ── Confirmation screen ── */
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: C.yesBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#4cef9a",
                  fontFamily: "var(--font-rajdhani)",
                  marginBottom: 4,
                }}
              >
                Bet Placed!
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#a0c4e0",
                  marginBottom: 6,
                  fontFamily: "var(--font-rajdhani)",
                  letterSpacing: 0.5,
                }}
              >
                STATUS:{" "}
                <span style={{ color: "#4cef9a", fontWeight: 700 }}>
                  MATCHED
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 14,
                }}
              >
                {betSlip.type === "Lagai"
                  ? "BACK"
                  : betSlip.type === "Khai"
                  ? "LAY"
                  : betSlip.type}{" "}
                · {betSlip.runner} · ₹{stake} @ {betSlip.odds}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  { label: "Liability", val: `₹${slipLiability}`, color: "#e05560" },
                  { label: "Profit",    val: `₹${slipProfit}`,    color: "#4cef9a" },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 8,
                      padding: "8px 6px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        marginBottom: 3,
                        fontFamily: "var(--font-rajdhani)",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color,
                        fontFamily: "var(--font-rajdhani)",
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.28)",
                  marginBottom: 14,
                }}
              >
                Bet ID: {bets[0]?.id ?? "—"}
              </div>
              <button
                onClick={() => setBetSlip(null)}
                style={{
                  width: "100%",
                  background: C.primaryLight,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: 10,
                  cursor: "pointer",
                  fontFamily: "var(--font-rajdhani)",
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══ CHAT BUTTON ══ */}
      <button
        onClick={() => setChatOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 22,
          right: 18,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: C.yesBg,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 14px rgba(0,0,0,0.25)",
          zIndex: 300,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>

      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 78,
            right: 14,
            background: C.primary,
            border: `1px solid ${C.banner}`,
            borderRadius: 12,
            padding: "14px 16px",
            width: 210,
            fontSize: 12,
            color: "rgba(255,255,255,0.65)",
            zIndex: 299,
            boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              marginBottom: 6,
              fontSize: 13,
              fontFamily: "var(--font-rajdhani)",
            }}
          >
            Need help?
          </div>
          <p style={{ lineHeight: 1.6 }}>
            Support available 24/7 for all betting queries and account issues.
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchDetail;