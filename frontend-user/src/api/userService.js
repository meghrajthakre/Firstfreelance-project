import API from "./axios";

export const loginUser = (data) =>
  API.post("/auth/login", data).then((r) => r.data);

export const logoutUser = () =>
  API.post("/auth/logout").then((r) => r.data);

export const getMe = () =>
  API.get("/auth/me").then((r) => r.data);

export const getBanner    = () => API.get("/banner").then((r) => r.data);
export const updateBanner = (text) => API.put("/banner", { text }).then((r) => r.data);

export const getSavedMatches = () =>
  API.get("/matches/saved").then((res) => res.data);

  export const creditWallet = (userId, amount) =>
  api.post("/wallet/credit", { userId, amount });

export const debitWallet = (userId, amount) =>
  API.post("/wallet/debit", { userId, amount });

export const getWalletBalance = (userId) =>
  API.get(`/wallet/${userId}/balance`);

export const getWalletHistory = (userId, limit = 10, skip = 0) =>
  API.get(`/wallet/${userId}/history`, { params: { limit, skip } });