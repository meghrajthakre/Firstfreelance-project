import API from "./axios";

// ========== Auth ==========
export const loginUser  = (data) => API.post("/auth/login", data).then((r) => r.data);
export const logoutUser = ()     => API.post("/auth/logout").then((r) => r.data);
export const getMe      = ()     => API.get("/auth/me").then((r) => r.data);

// ========== Banner ==========
export const getBanner    = ()     => API.get("/banner").then((r) => r.data);
export const updateBanner = (text) => API.put("/banner", { text }).then((r) => r.data);

// ========== Saved Matches ==========
export const getSavedMatches    = ()          => API.get("/matches/saved").then((r) => r.data);
export const getSavedMatchById  = (matchId)   => API.get(`/matches/saved/${matchId}`).then((r) => r.data);

// ========== Wallet ==========
export const creditWallet    = (userId, amount)                => API.post("/wallet/credit", { userId, amount });
export const debitWallet     = (userId, amount)                => API.post("/wallet/debit", { userId, amount });
export const getWalletBalance= (userId)                        => API.get(`/wallet/${userId}/balance`);
export const getWalletHistory= (userId, limit = 10, skip = 0) => API.get(`/wallet/${userId}/history`, { params: { limit, skip } });

// ========== Betting ==========
/**
 * Place a bet
 * @param {string} userId
 * @param {string} matchId
 * @param {number} stake
 * @param {number} odds
 * @param {object} extra - optional: runner, type, isSession, etc.
 */
export const placeBet  = (userId, matchId, stake, odds, extra = {}) =>
  API.post("/bet/place", { userId, matchId, amount: stake, odds, ...extra }).then((r) => r.data);

export const getMyBets = (userId, matchId) =>
  API.get("/bets", { params: { userId, matchId } }).then((r) => r.data);

// ========== Live Cricket (cricketController) ==========

/**
 * GET /api/cricket/live
 * All in-play matches with h2h odds embedded.
 * Returns: { count, matches: NormalisedEvent[] }
 */
export const getLiveMatches = () =>
  API.get("/cricket/live").then((r) => r.data);

/**
 * GET /api/cricket/live/summary
 * Live matches merged with scorecard — single call for the Live listing page.
 * Returns: { count, matches: (NormalisedEvent & { scorecard })[] }
 */
export const getLiveSummary = () =>
  API.get("/cricket/live/summary").then((r) => r.data);

/**
 * GET /api/cricket/live/:sportKey/scores?daysFrom=1
 * Scorecard for a specific sport key.
 * @param {string} sportKey  e.g. "cricket_ipl"
 * @param {number} daysFrom  1–3, default 1
 * Returns: { sportKey, count, scores: ScorecardEvent[] }
 */
export const getLiveScores = (sportKey, daysFrom = 1) =>
  API.get(`/cricket/live/${sportKey}/scores`, { params: { daysFrom } }).then((r) => r.data);

/**
 * GET /api/cricket/live/:sportKey/match/:eventId/odds
 * All bookmaker markets (h2h + totals) for one specific match.
 * @param {string} sportKey  e.g. "cricket_ipl"
 * @param {string} eventId   matchId from the live list
 * Returns: { sportKey, eventId, data: RawOddsApiEvent }
 */
export const getMatchOdds = (sportKey, eventId) =>
  API.get(`/cricket/live/${sportKey}/match/${eventId}/odds`).then((r) => r.data);