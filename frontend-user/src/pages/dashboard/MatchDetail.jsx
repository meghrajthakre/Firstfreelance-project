import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/* ─── palette (mirrors your index.css @theme) ─── */
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
  /* betting colours */
  lagai:        "#4A90D9",   /* blue  – back */
  khai:         "#C94070",   /* pink  – lay  */
  noBg:         "#2B4A7A",   /* dark navy NO */
  yesBg:        "#1A8070",   /* teal YES     */
  hlRow:        "#D4E3F5",   /* Sri Lanka W highlight */
  pnlGreen:     "#1A8070",
  sectionHdr:   "#1E3A5F",
  tableHdr:     "#2B4A7A",
};

/* ─── reusable style helpers ─── */
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
  <th style={{
    padding: "8px 10px", fontSize: 11, fontWeight: 700, color: "#fff",
    textAlign: left ? "left" : "center", letterSpacing: 0.5,
    fontFamily: "var(--font-rajdhani)", width: w,
  }}>{children}</th>
);

const TD = ({ left, bold, green, small, children, style: s }) => (
  <td style={{
    padding: "9px 10px", fontSize: small ? 11 : 12,
    color: green ? C.pnlGreen : C.textDark,
    fontWeight: bold || green ? 700 : 400,
    textAlign: left ? "left" : "center",
    borderBottom: `1px solid ${C.border}`,
    fontFamily: "var(--font-nunito)",
    verticalAlign: "middle",
    ...s,
  }}>{children}</td>
);

const OddsBtn = ({ color, label, flash, onClick }) => (
  <button onClick={onClick} style={{
    background: color, border: "none", borderRadius: 5,
    color: "#fff", fontWeight: 700, fontSize: 13,
    padding: "7px 14px", cursor: "pointer", minWidth: 42,
    fontFamily: "var(--font-rajdhani)", letterSpacing: 0.3,
    transition: "filter 0.15s, transform 0.1s",
    filter: flash ? "brightness(2)" : "brightness(1)",
    transform: flash ? "scale(0.93)" : "scale(1)",
  }}>
    {label ?? ""}
  </button>
);

/* ═══════════════════════════════════════════════════════════ */
const MatchDetail = () => {
  const { matchId } = useParams();

  const mockMatch = {
    id: matchId,
    homeTeam: "Bangladesh Women",
    awayTeam: "Sri Lanka Women",
    homeScore: "0-0", homeOvers: "0",
    awayScore: "161-4", awayOvers: "20.0",
    time: "2:34 PM", crOver: "CR Over",
    marketMinMax: { min: 100, max: 300000 },
    sessionMarkets: [
      { name: "6 over run BAN W",    no: 42, noRate: "1.0", yes: 44, yesRate: "1.0" },
      { name: "Fall of 1st wkt B...", no: 18, noRate: "1.0", yes: 20, yesRate: "1.0" },
      { name: "D Akter run(BA...",    no: 12, noRate: "1.0", yes: 14, yesRate: "1.0" },
      { name: "J Ferdous run(B...",   no: 8,  noRate: "1.0", yes: 10, yesRate: "1.0" },
    ],
    matchTieLimit: { min: 100, max: 10000 },
  };

  const teamA = mockMatch.homeTeam;
  const teamB = mockMatch.awayTeam;

  const [sessions, setSessions]   = useState(mockMatch.sessionMarkets);
  const [flashMap, setFlashMap]   = useState({});
  const [betSlip,  setBetSlip]    = useState(null);   /* { runner, type, odds } */
  const [stake,    setStake]      = useState("500");
  const [confirmed, setConfirmed] = useState(false);
  const [chatOpen, setChatOpen]   = useState(false);

  /* live odds jitter */
  useEffect(() => {
    const id = setInterval(() => {
      const idx  = Math.floor(Math.random() * sessions.length);
      const side = Math.random() > 0.5 ? "no" : "yes";
      const key  = `${idx}_${side}`;
      setSessions(prev =>
        prev.map((s, i) => i !== idx ? s : {
          ...s,
          [side]: Math.max(1, s[side] + Math.floor((Math.random() - 0.5) * 4)),
        })
      );
      setFlashMap(p => ({ ...p, [key]: true }));
      setTimeout(() => setFlashMap(p => ({ ...p, [key]: false })), 320);
    }, 2600);
    return () => clearInterval(id);
  }, [sessions]);

  const openBet = (runner, type, odds) => {
    setConfirmed(false);
    setStake("500");
    setBetSlip({ runner, type, odds });
  };

  const liability = betSlip
    ? Math.round((parseFloat(betSlip.odds) - 1) * (parseFloat(stake) || 0))
    : 0;

  /* ── market rows ── */
  const marketRows = [
    { short: "Bangladesh W", full: teamA, hl: false, lagaiO: "1.95", khaiO: "2.05" },
    { short: "Sri Lanka W",  full: teamB, hl: true,  lagaiO: "1.50", khaiO: "1.55" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bgMain, fontFamily: "var(--font-nunito)", paddingBottom: 90 }}>
      <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10, padding: "12px 10px" }}>

        {/* ══ SCORECARD ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-rajdhani)" }}>
              {mockMatch.time}
            </span>
            <button style={{
              fontSize: 12, fontWeight: 700, color: "#fff",
              background: C.primaryLight, border: "none",
              borderRadius: 5, padding: "4px 13px", cursor: "pointer",
              fontFamily: "var(--font-rajdhani)", letterSpacing: 0.4,
            }}>
              Show Full Scorecard
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{ flex: 1, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>{teamA}</span>
                <span style={{ fontSize: 13, color: "#5a7a99" }}>{mockMatch.homeScore} ({mockMatch.homeOvers})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>{teamB}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.pnlGreen }}>{mockMatch.awayScore} ({mockMatch.awayOvers})</span>
              </div>
              <div style={{ fontSize: 10, color: C.accent, marginTop: 5 }}>{mockMatch.crOver}</div>
            </div>
            <div style={{ width: 76, backgroundColor: C.yesBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-rajdhani)", letterSpacing: 1 }}>Inni…</span>
            </div>
          </div>

          {/* action bar */}
          <div style={{ backgroundColor: C.banner, height: 30 }} />
        </div>

        {/* ══ MARKET ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-rajdhani)", letterSpacing: 0.4 }}>
              Market (Min: {mockMatch.marketMinMax.min.toLocaleString()}, Max: {mockMatch.marketMinMax.max.toLocaleString()})
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4cef9a" }}>0</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={tblHdr}>
                <TH left w="40%">RUNNER</TH>
                <TH>LAGAI</TH>
                <TH>KHAI</TH>
                <TH>+/-</TH>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row, i) => (
                <tr key={i} style={{ backgroundColor: row.hl ? C.hlRow : "transparent" }}>
                  <TD left bold style={{ color: row.hl ? C.primary : C.textDark }}>{row.short}</TD>
                  <TD>
                    <OddsBtn color={C.lagai} onClick={() => openBet(row.full, "Lagai", row.lagaiO)} />
                  </TD>
                  <TD>
                    <OddsBtn color={C.khai} onClick={() => openBet(row.full, "Khai", row.khaiO)} />
                  </TD>
                  <TD green>0</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ══ SESSION ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-rajdhani)", letterSpacing: 0.4 }}>
              SESSION (Min: 100, Max: 1,00,000)
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4cef9a" }}>0</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "30%" }} /><col style={{ width: "14%" }} />
              <col style={{ width: "11%" }} /><col style={{ width: "14%" }} />
              <col style={{ width: "11%" }} /><col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr style={tblHdr}>
                <TH left>SESSION</TH>
                <TH>NO</TH><TH>RATE</TH>
                <TH>YES</TH><TH>RATE</TH>
                <TH>+/-</TH>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f4f8fd" : C.inputBg }}>
                  <TD left small>{s.name}</TD>
                  <TD>
                    <OddsBtn color={C.noBg} label={s.no} flash={!!flashMap[`${idx}_no`]}
                      onClick={() => openBet(s.name, "No", String(s.no))} />
                  </TD>
                  <TD><span style={{ color: C.accent, fontSize: 11 }}>{s.noRate}</span></TD>
                  <TD>
                    <OddsBtn color={C.yesBg} label={s.yes} flash={!!flashMap[`${idx}_yes`]}
                      onClick={() => openBet(s.name, "Yes", String(s.yes))} />
                  </TD>
                  <TD><span style={{ color: C.accent, fontSize: 11 }}>{s.yesRate}</span></TD>
                  <TD green>0</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ══ MATCH TIE ══ */}
        <div style={card}>
          <div style={sectionBar()}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-rajdhani)", letterSpacing: 0.4 }}>
              Market : Match Tie (Min: {mockMatch.matchTieLimit.min}, Max: {mockMatch.matchTieLimit.max.toLocaleString()})
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={tblHdr}>
                <TH left w="42%">RUNNER</TH>
                <TH>Lagai</TH><TH>Khai</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD left bold>Match Tie</TD>
                <TD><OddsBtn color={C.lagai} onClick={() => openBet("Match Tie", "Lagai", "90")} /></TD>
                <TD><OddsBtn color={C.khai}  onClick={() => openBet("Match Tie", "Khai",  "100")} /></TD>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* ══ BET SLIP BOTTOM SHEET ══ */}
      {betSlip && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "100%", maxWidth: 520,
          backgroundColor: C.primary,
          borderTop: `3px solid ${C.banner}`,
          borderRadius: "16px 16px 0 0",
          padding: 18, zIndex: 400,
          animation: "betSlideUp 0.26s ease",
        }}>
          <style>{`@keyframes betSlideUp{from{opacity:0;transform:translateX(-50%) translateY(50px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>

          {!confirmed ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "var(--font-rajdhani)", letterSpacing: 0.4 }}>
                    {betSlip.type} · {betSlip.runner}
                  </span>
                  <span style={{
                    background: ["Lagai","Yes"].includes(betSlip.type) ? C.lagai : C.khai,
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    padding: "2px 10px", borderRadius: 4,
                    fontFamily: "var(--font-rajdhani)",
                  }}>{betSlip.odds}</span>
                </div>
                <button onClick={() => setBetSlip(null)} style={{
                  background: "rgba(255,255,255,0.12)", border: "none",
                  color: "#fff", borderRadius: "50%", width: 26, height: 26,
                  cursor: "pointer", fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>✕</button>
              </div>

              <input type="number" value={stake} onChange={e => setStake(e.target.value)}
                placeholder="Enter stake (Min: 100)"
                style={{
                  width: "100%", background: "rgba(255,255,255,0.09)",
                  border: `1px solid ${C.banner}`, borderRadius: 8,
                  color: "#fff", fontSize: 15, padding: "9px 12px",
                  outline: "none", marginBottom: 10,
                  fontFamily: "var(--font-nunito)",
                }}
              />

              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[100, 500, 1000, 5000].map(v => (
                  <button key={v} onClick={() => setStake(s => String((parseInt(s)||0)+v))} style={{
                    flex: 1, background: C.primaryLight, border: `1px solid ${C.banner}`,
                    color: C.accent, fontSize: 12, fontWeight: 600, padding: "5px 0",
                    borderRadius: 5, cursor: "pointer", fontFamily: "var(--font-rajdhani)",
                  }}>+{v}</button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Stake",    val: `₹${parseInt(stake)||0}`, color: "#fff"     },
                  { label: "Liability",val: `₹${liability}`,          color: "#e05560"  },
                  { label: "Profit",   val: `₹${parseInt(stake)||0}`, color: "#4cef9a"  },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3, fontFamily: "var(--font-rajdhani)" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "var(--font-rajdhani)" }}>{val}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => setConfirmed(true)} style={{
                width: "100%", background: C.yesBg, border: "none",
                borderRadius: 8, color: "#fff", fontWeight: 700,
                fontSize: 14, padding: 11, cursor: "pointer",
                fontFamily: "var(--font-rajdhani)", letterSpacing: 0.5, marginBottom: 8,
              }}>Confirm Bet</button>
              <button onClick={() => setBetSlip(null)} style={{
                width: "100%", background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8,
                color: "rgba(255,255,255,0.5)", fontSize: 13, padding: 9,
                cursor: "pointer", fontFamily: "var(--font-nunito)",
              }}>Cancel</button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.yesBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#4cef9a", fontFamily: "var(--font-rajdhani)", marginBottom: 4 }}>Bet Placed!</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
                {betSlip.type} · {betSlip.runner} · ₹{stake} @ {betSlip.odds}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Liability", val: `₹${liability}`, color: "#e05560" },
                  { label: "Profit",    val: `₹${stake}`,     color: "#4cef9a" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3, fontFamily: "var(--font-rajdhani)" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "var(--font-rajdhani)" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>Bet ID: BET{Date.now().toString().slice(-8)}</div>
              <button onClick={() => setBetSlip(null)} style={{
                width: "100%", background: C.primaryLight, border: "none",
                borderRadius: 8, color: "#fff", fontWeight: 700,
                fontSize: 13, padding: 10, cursor: "pointer",
                fontFamily: "var(--font-rajdhani)",
              }}>Done</button>
            </div>
          )}
        </div>
      )}

      {/* ══ CHAT BUTTON ══ */}
      <button onClick={() => setChatOpen(o => !o)} style={{
        position: "fixed", bottom: 22, right: 18,
        width: 48, height: 48, borderRadius: "50%",
        background: C.yesBg, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 3px 14px rgba(0,0,0,0.25)", zIndex: 300,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>

      {chatOpen && (
        <div style={{
          position: "fixed", bottom: 78, right: 14,
          background: C.primary, border: `1px solid ${C.banner}`,
          borderRadius: 12, padding: "14px 16px", width: 210,
          fontSize: 12, color: "rgba(255,255,255,0.65)", zIndex: 299,
          boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
        }}>
          <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6, fontSize: 13, fontFamily: "var(--font-rajdhani)" }}>Need help?</div>
          <p style={{ lineHeight: 1.6 }}>Support available 24/7 for all betting queries and account issues.</p>
        </div>
      )}
    </div>
  );
};

export default MatchDetail;