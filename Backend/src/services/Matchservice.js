const axios = require("axios");

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "cricket-live-line1.p.rapidapi.com";
const BASE_URL      = `https://${RAPIDAPI_HOST}`;

const headers = () => ({
  "x-rapidapi-key":  RAPIDAPI_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildCommenceTime = (dateWise, matchTime) => {
  try {
    const datePart = dateWise.split(",")[0].trim();
    const parsed   = new Date(`${datePart} ${matchTime}`);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString();
  } catch {
    return null;
  }
};

/**
 * Normalise an upcoming match (no live score fields)
 */
const normaliseMatch = (raw) => ({
  matchId:       raw.match_id,
  sportKey:      "cricket",
  homeTeam:      raw.team_a,
  awayTeam:      raw.team_b,
  commenceTime:  buildCommenceTime(raw.date_wise, raw.match_time),
  matchTime:     raw.match_time   ?? "",
  matchType:     raw.match_type   ?? "",
  series:        raw.series       ?? "",
  venue:         raw.venue        ?? "",
  matchNumber:   raw.matchs       ?? "",
  seriesType:    raw.series_type  ?? "",
  homeTeamImg:   raw.team_a_img   ?? "",
  awayTeamImg:   raw.team_b_img   ?? "",
  homeTeamShort: raw.team_a_short ?? "",
  awayTeamShort: raw.team_b_short ?? "",
  status:        raw.match_status ?? "Upcoming",
  favTeam:       raw.fav_team    || null,
  odds:
    raw.min_rate && raw.min_rate !== "0" && raw.min_rate !== "0.00"
      ? { minRate: parseFloat(raw.min_rate), maxRate: parseFloat(raw.max_rate) }
      : null,
});

/**
 * Normalise a LIVE match — includes full scoring data from the live API.
 *
 * Raw live fields (from the API sample):
 *   team_a_scores   "83-4"       team_b_scores  ""
 *   team_a_over     "26.0"       team_b_over    ""
 *   need_run_ball   ""           batting_team   "1128"
 *   toss            "Sri Lanka A Women have won the toss…"
 *   result          ""           current_inning 1
 *   s_ovr / s_min / s_max       (session market range, currently unused)
 *   session         null
 */
const normaliseLiveMatch = (raw) => {
  // Build odds — live API uses min_rate / max_rate
  let odds = null;
  const minR = parseFloat(raw.min_rate);
  const maxR = parseFloat(raw.max_rate);
  if (raw.min_rate && raw.min_rate !== "0" && !isNaN(minR) && minR > 0) {
    odds = { minRate: minR, maxRate: isNaN(maxR) ? minR : maxR };
  }

  return {
    matchId:       raw.match_id,
    sportKey:      "cricket",
    homeTeam:      raw.team_a        ?? "Team A",
    awayTeam:      raw.team_b        ?? "Team B",
    homeTeamShort: raw.team_a_short  ?? "",
    awayTeamShort: raw.team_b_short  ?? "",
    homeTeamImg:   raw.team_a_img    ?? "",
    awayTeamImg:   raw.team_b_img    ?? "",
    matchTime:     raw.match_time    ?? "",
    matchDate:     raw.match_date    ?? "",
    matchType:     raw.match_type    ?? "",
    matchNumber:   raw.matchs        ?? "",
    series:        raw.series        ?? "",
    seriesType:    raw.series_type   ?? "",
    venue:         raw.venue         ?? "",
    status:        raw.match_status  ?? "Live",
    favTeam:       raw.fav_team     || null,
    odds,

    // ── Scoring ──────────────────────────────────────────────
    teamAScores:   raw.team_a_scores ?? "",   // "83-4"
    teamAOver:     raw.team_a_over   ?? "",   // "26.0"
    teamBScores:   raw.team_b_scores ?? "",   // ""
    teamBOver:     raw.team_b_over   ?? "",   // ""
    needRunBall:   raw.need_run_ball ?? "",   // target / RRR string

    // Per-inning score detail (array of { over, score } objects)
    teamAScoreDetail: Array.isArray(raw.team_a_scores_over)
      ? raw.team_a_scores_over
      : [],
    teamBScoreDetail: Array.isArray(raw.team_b_scores_over)
      ? raw.team_b_scores_over
      : [],

    // Batting / bowling sides
    battingTeamId:  raw.batting_team  ?? null,
    ballingTeamId:  raw.balling_team  ?? null,
    currentInning:  raw.current_inning ?? 1,

    // Match narrative
    toss:    raw.toss   ?? "",
    result:  raw.result ?? "",

    // Session market meta (for future use)
    sessionOver: raw.s_ovr ?? "",
    sessionMin:  raw.s_min ?? "0",
    sessionMax:  raw.s_max ?? "0",
  };
};

// ─── Centralised API caller ───────────────────────────────────────────────────

const callApi = async (path, params = {}) => {
  const url = `${BASE_URL}/${path}`;
  try {
    const { data } = await axios.get(url, {
      headers: headers(),
      params,
      timeout: 10_000,
    });

    if (!data.status || !Array.isArray(data.data)) {
      throw new Error(
        `Cricket Live Line [${path}]: ${data.msg || "unexpected response"}`
      );
    }

    return data.data;
  } catch (err) {
    if (err.response) {
      console.error(
        `[cricketService] HTTP ${err.response.status} ← GET ${url}`,
        "\nResponse:", JSON.stringify(err.response.data ?? {}, null, 2)
      );
      throw new Error(
        `Cricket Live Line API returned ${err.response.status} for /${path}. ` +
        `Check RAPIDAPI_KEY and the endpoint name.`
      );
    }
    console.error(`[cricketService] Network error calling ${url}:`, err.message);
    throw err;
  }
};

// ─── Exported functions ───────────────────────────────────────────────────────

/**
 * Upcoming matches.
 * filter: "today" | "upcoming" | undefined
 */
const fetchMatches = async (filter) => {
  const raw = await callApi("upcomingMatches");

  const now        = new Date();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  let matches = raw;

  if (filter === "today") {
    matches = raw.filter((m) => {
      const t = new Date(buildCommenceTime(m.date_wise, m.match_time));
      return t >= now && t <= endOfToday;
    });
  } else if (filter === "upcoming") {
    matches = raw.filter((m) => {
      const t = new Date(buildCommenceTime(m.date_wise, m.match_time));
      return t > now;
    });
  }

  return matches.map(normaliseMatch);
};

/**
 * Live matches — full scoring data normalised via normaliseLiveMatch.
 */
const fetchLiveMatches = async () => {
  const raw = await callApi("liveMatches");
  return raw.map(normaliseLiveMatch);
};

/** Betting line / match info */
const fetchMatchLine = async (matchId) => {
  return callApi("matchinfo", { match_id: matchId });
};

/** Scorecard */
const fetchScorecard = async (matchId) => {
  return callApi("matchscorecard", { match_id: matchId });
};

module.exports = {
  fetchMatches,
  fetchLiveMatches,
  fetchMatchLine,
  fetchScorecard,
  normaliseLiveMatch, // exported for unit-testing
};