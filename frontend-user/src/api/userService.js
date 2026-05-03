import API from "./axios";

// ========== Existing exports ==========
export const loginUser = (data) => API.post("/auth/login", data).then((r) => r.data);
export const logoutUser = () => API.post("/auth/logout").then((r) => r.data);
export const getMe = () => API.get("/auth/me").then((r) => r.data);
export const getBanner = () => API.get("/banner").then((r) => r.data);
export const updateBanner = (text) => API.put("/banner", { text }).then((r) => r.data);
export const getSavedMatches = () => API.get("/matches/saved").then((res) => res.data);

export const creditWallet = (userId, amount) =>
  API.post("/wallet/credit", { userId, amount });
export const debitWallet = (userId, amount) =>
  API.post("/wallet/debit", { userId, amount });
export const getWalletBalance = (userId) =>
  API.get(`/wallet/${userId}/balance`);
export const getWalletHistory = (userId, limit = 10, skip = 0) =>
  API.get(`/wallet/${userId}/history`, { params: { limit, skip } });

// ========== NEW: Betting exports ==========
/**
 * Place a bet
 * @param {string} userId
 * @param {string} matchId
 * @param {number} stake
 * @param {number} odds
 * @param {object} extra - optional fields like runner, type, isSession
 */
export const placeBet = (userId, matchId, stake, odds, extra = {}) =>
  API.post("/bet/place", {
    userId,
    matchId,
    amount: stake,
    odds,
    ...extra,
  }).then((r) => r.data);

/**
 * Get user's bets for a match
 * @param {string} userId
 * @param {string} matchId
 */
export const getMyBets = (userId, matchId) =>
  API.get("/bets", { params: { userId, matchId } }).then((r) => r.data);