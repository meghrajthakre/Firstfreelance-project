const axios = require("axios");

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "cricket-live-line1.p.rapidapi.com";
const BASE_URL      = `https://${RAPIDAPI_HOST}`;

// Shared headers for every request
const headers = () => ({
  "x-rapidapi-key":  RAPIDAPI_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * "12 May 2026, Tuesday" + "07:30 PM"  →  ISO string (or null)
 */
const buildCommenceTime = (dateWise, matchTime) => {
  try {
    const datePart = dateWise.split(",")[0].trim(); // "12 May 2026"
    const parsed   = new Date(`${datePart} ${matchTime}`);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString();
  } catch {
    return null;
  }
};

/**
 * Raw Cricket Live Line match → normalised internal shape
 */
const normaliseMatch = (raw) => ({
  matchId:       raw.match_id,
  sportKey:      "cricket",
  homeTeam:      raw.team_a,
  awayTeam:      raw.team_b,
  commenceTime:  buildCommenceTime(raw.date_wise, raw.match_time),
  matchType:     raw.match_type,      // "T20" | "ODI" | "Test"
  series:        raw.series,
  venue:         raw.venue,
  matchNumber:   raw.matchs,
  seriesType:    raw.series_type,
  homeTeamImg:   raw.team_a_img,
  awayTeamImg:   raw.team_b_img,
  homeTeamShort: raw.team_a_short,
  awayTeamShort: raw.team_b_short,
  status:        raw.match_status,    // "Upcoming" | "Live" | …
  favTeam:       raw.fav_team || null,
  odds:
    raw.min_rate && raw.min_rate !== "0.00"
      ? { minRate: parseFloat(raw.min_rate), maxRate: parseFloat(raw.max_rate) }
      : null,
});

/**
 * Centralised API caller — logs clear errors and re-throws
 */
const callApi = async (path, params = {}) => {
  const url = `${BASE_URL}/${path}`;

  try {
    const { data } = await axios.get(url, {
      headers: headers(),
      params,
      timeout: 10_000,
    });

    // API always wraps in { msg, data: [...], status }
    if (!data.status || !Array.isArray(data.data)) {
      throw new Error(
        `Cricket Live Line [${path}]: ${data.msg || "unexpected response"}`
      );
    }

    return data.data;
  } catch (err) {
    if (err.response) {
      // HTTP-level error (404, 401, 500, …)
      console.error(
        `[cricketService] HTTP ${err.response.status} ← GET ${url}`,
        "\nResponse:", JSON.stringify(err.response.data ?? {}, null, 2)
      );
      throw new Error(
        `Cricket Live Line API returned ${err.response.status} for /${path}. ` +
        `Check RAPIDAPI_KEY and the endpoint name.`
      );
    }
    // Network / timeout errors
    console.error(`[cricketService] Network error calling ${url}:`, err.message);
    throw err;
  }
};

// ─── Exported functions ───────────────────────────────────────────────────────

/**
 * Upcoming matches.
 *
 * filter  "today"    → only matches that start today
 *         "upcoming" → all future matches
 *         undefined  → everything the API returns (no filter)
 *
 * NOTE: If you still get 404 here, open your RapidAPI playground, click
 *       "Upcoming Matches" in the sidebar, and paste the exact path segment
 *       after https://cricket-live-line1.p.rapidapi.com/ into the `callApi`
 *       call below.  Common variants are:
 *         upcomingmatch  |  upcomingmatches  |  upcoming-matches
 */
const fetchMatches = async (filter) => {
  const raw = await callApi("upcomingMatches");   // ← adjust if still 404

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

/** Live matches */
const fetchLiveMatches = async () => {
  const raw = await callApi("livematch");       // ← adjust if 404
  return raw.map(normaliseMatch);
};

/** Betting line / match info */
const fetchMatchLine = async (matchId) => {
  return callApi("matchinfo", { match_id: matchId });
};

/** Scorecard */
const fetchScorecard = async (matchId) => {
  return callApi("matchscorecard", { match_id: matchId });
};

module.exports = { fetchMatches, fetchLiveMatches, fetchMatchLine, fetchScorecard };