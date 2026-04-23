const axios = require("axios");

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";
const ODDS_API_KEY = process.env.ODDS_API_KEY;
const DEFAULT_SPORT = process.env.DEFAULT_SPORT_KEY || "cricket"; // ✅ fixed

/**
 * Fetch live + upcoming matches from the Odds API.
 * filter: "today" | "upcoming" | undefined (all)
 */
const fetchMatches = async (filter) => {
  const url = `${ODDS_API_BASE}/sports/${DEFAULT_SPORT}/odds`; // ✅ now resolves correctly

  const { data } = await axios.get(url, {
    params: {
      apiKey: ODDS_API_KEY,
      regions: "uk",
      markets: "h2h",
      oddsFormat: "decimal",
      dateFormat: "iso",
    },
  });

  const now = new Date();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  let matches = data;

  if (filter === "today") {
    matches = data.filter((m) => {
      const t = new Date(m.commence_time);
      return t >= now && t <= endOfToday;
    });
  } else if (filter === "upcoming") {
    matches = data.filter((m) => new Date(m.commence_time) > now);
  }

  return matches.map(normaliseMatch);
};

/**
 * Map raw Odds API object → clean internal shape.
 */
const normaliseMatch = (raw) => ({
  matchId:      raw.id,
  sportKey:     raw.sport_key,
  homeTeam:     raw.home_team,
  awayTeam:     raw.away_team,
  commenceTime: raw.commence_time,
  odds:         extractOdds(raw.bookmakers),
});

/**
 * Pull the first available h2h odds block.
 */
const extractOdds = (bookmakers = []) => {
  if (!bookmakers.length) return null;
  const market = bookmakers[0]?.markets?.find((m) => m.key === "h2h");
  if (!market) return null;
  return market.outcomes.reduce((acc, o) => {
    acc[o.name] = o.price;
    return acc;
  }, {});
};

module.exports = { fetchMatches };