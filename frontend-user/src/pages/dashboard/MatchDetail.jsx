// src/pages/MatchDetail.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";

const MatchDetail = () => {
  const { matchId } = useParams();

  // Mock match data (matches your screenshot)
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
      { name: "6 over run BAN W", noRate: "0", yesRate: "0" },
      { name: "Fall of 1st wkt B...", noRate: "0", yesRate: "0" },
      { name: "D Akter run(BA...", noRate: "0", yesRate: "0" },
      { name: "J Ferdous run(B...", noRate: "0", yesRate: "0" }
    ],
    matchTieLimit: { min: 100, max: 10000 }
  };

  const teamA = mockMatch.homeTeam;
  const teamB = mockMatch.awayTeam;

  // State for all betting inputs
  const [bets, setBets] = useState({
    match: { [teamA]: { lagai: "", khai: "" }, [teamB]: { lagai: "", khai: "" } },
    sessions: {},
    tie: { lagai: "", khai: "" }
  });

  const handleMatchBetChange = (team, field, value) => {
    setBets(prev => ({
      ...prev,
      match: {
        ...prev.match,
        [team]: { ...prev.match[team], [field]: value }
      }
    }));
  };

  const handleSessionBetChange = (sessionIndex, type, value) => {
    setBets(prev => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [`${sessionIndex}_${type}`]: value
      }
    }));
  };

  const handleTieBetChange = (field, value) => {
    setBets(prev => ({
      ...prev,
      tie: { ...prev.tie, [field]: value }
    }));
  };

  // Reusable table styles
  const tableStyle = {
    width: "100%",
    fontSize: "12px",
    fontFamily: "var(--font-nunito)",
    borderCollapse: "collapse",
  };

  const thStyle = {
    textAlign: "left",
    padding: "8px 4px",
    borderBottom: "1px solid var(--color-border)",
    fontWeight: "600",
    color: "var(--color-text-dark)",
    opacity: 0.6,
    fontSize: "11px",
  };

  const thRightStyle = {
    ...thStyle,
    textAlign: "right",
  };

  const tdStyle = {
    padding: "10px 4px",
    borderBottom: "1px solid var(--color-border)",
    color: "var(--color-text-dark)",
  };

  const tdRightStyle = {
    ...tdStyle,
    textAlign: "right",
  };

  const inputStyle = {
    width: "70px",
    textAlign: "right",
    padding: "4px 6px",
    borderRadius: "6px",
    border: `1px solid var(--color-border)`,
    backgroundColor: "var(--color-bg-main)",
    fontFamily: "var(--font-nunito)",
    fontSize: "12px",
    color: "var(--color-text-dark)",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-main)",
        fontFamily: "var(--font-nunito)",
        padding: "16px 12px",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Scorecard Card */}
        <div
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderRadius: "16px",
            border: "1.5px solid var(--color-border)",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "var(--color-text-dark)",
                opacity: 0.45,
              }}
            >
              {mockMatch.time}
            </span>
            <button
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--color-primary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-rajdhani)",
                letterSpacing: "0.5px",
              }}
            >
              Show Full Scorecard
            </button>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "4px",
              }}
            >
              <span>{teamA}</span>
              <span>
                {mockMatch.homeScore} ({mockMatch.homeOvers})
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              <span>{teamB}</span>
              <span>
                {mockMatch.awayScore} ({mockMatch.awayOvers})
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--color-text-dark)",
              opacity: 0.35,
            }}
          >
            {mockMatch.crOver}
          </div>
        </div>

        {/* Market (Match Winner) */}
        <div
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderRadius: "16px",
            border: "1.5px solid var(--color-border)",
            padding: "14px 12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "var(--color-text-dark)",
              opacity: 0.5,
              marginBottom: "12px",
              fontFamily: "var(--font-rajdhani)",
              letterSpacing: "0.5px",
            }}
          >
            Market (Min: {mockMatch.marketMinMax.min}, Max: {mockMatch.marketMinMax.max})
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>RUNNER</th>
                <th style={thRightStyle}>LAGAI</th>
                <th style={thRightStyle}>KHAI</th>
                <th style={thRightStyle}>+/-</th>
              </tr>
            </thead>
            <tbody>
              {[teamA, teamB].map((team) => (
                <tr key={team}>
                  <td style={tdStyle}>{team}</td>
                  <td style={tdRightStyle}>
                    <input
                      type="number"
                      placeholder="0"
                      style={inputStyle}
                      value={bets.match[team]?.lagai || ""}
                      onChange={(e) =>
                        handleMatchBetChange(team, "lagai", e.target.value)
                      }
                    />
                  </td>
                  <td style={tdRightStyle}>
                    <input
                      type="number"
                      placeholder="0"
                      style={inputStyle}
                      value={bets.match[team]?.khai || ""}
                      onChange={(e) =>
                        handleMatchBetChange(team, "khai", e.target.value)
                      }
                    />
                  </td>
                  <td style={tdRightStyle}>0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Session Bets */}
        <div
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderRadius: "16px",
            border: "1.5px solid var(--color-border)",
            padding: "14px 12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "var(--color-text-dark)",
              opacity: 0.5,
              marginBottom: "12px",
              fontFamily: "var(--font-rajdhani)",
              letterSpacing: "0.5px",
            }}
          >
            SESSION (Min: 100, Max: 100000)
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>SESSION</th>
                <th style={thRightStyle}>NO</th>
                <th style={thRightStyle}>RATE</th>
                <th style={thRightStyle}>YES</th>
                <th style={thRightStyle}>RATE</th>
              </tr>
            </thead>
            <tbody>
              {mockMatch.sessionMarkets.map((session, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{session.name}</td>
                  <td style={tdRightStyle}>
                    <input
                      type="number"
                      placeholder="0"
                      style={{ ...inputStyle, width: "60px" }}
                      value={bets.sessions[`${idx}_no`] || ""}
                      onChange={(e) =>
                        handleSessionBetChange(idx, "no", e.target.value)
                      }
                    />
                  </td>
                  <td style={tdRightStyle}>{session.noRate}</td>
                  <td style={tdRightStyle}>
                    <input
                      type="number"
                      placeholder="0"
                      style={{ ...inputStyle, width: "60px" }}
                      value={bets.sessions[`${idx}_yes`] || ""}
                      onChange={(e) =>
                        handleSessionBetChange(idx, "yes", e.target.value)
                      }
                    />
                  </td>
                  <td style={tdRightStyle}>{session.yesRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market : Match Tie */}
        <div
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderRadius: "16px",
            border: "1.5px solid var(--color-border)",
            padding: "14px 12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "var(--color-text-dark)",
              opacity: 0.5,
              marginBottom: "12px",
              fontFamily: "var(--font-rajdhani)",
              letterSpacing: "0.5px",
            }}
          >
            Market : Match Tie (Min: {mockMatch.matchTieLimit.min}, Max:{" "}
            {mockMatch.matchTieLimit.max})
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>RUNNER</th>
                <th style={thRightStyle}>Lagai</th>
                <th style={thRightStyle}>Khai</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Match Tie</td>
                <td style={tdRightStyle}>
                  <input
                    type="number"
                    placeholder="0"
                    style={inputStyle}
                    value={bets.tie.lagai}
                    onChange={(e) => handleTieBetChange("lagai", e.target.value)}
                  />
                </td>
                <td style={tdRightStyle}>
                  <input
                    type="number"
                    placeholder="0"
                    style={inputStyle}
                    value={bets.tie.khai}
                    onChange={(e) => handleTieBetChange("khai", e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: "10px",
            textAlign: "center",
            color: "var(--color-text-dark)",
            opacity: 0.3,
            paddingTop: "8px",
          }}
        >
          + ton11 tech
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;