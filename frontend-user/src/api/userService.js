import API from "./axios";

export const loginUser = (data) =>
  API.post("/auth/login", data).then((r) => r.data);

export const logoutUser = () =>
  API.post("/auth/logout").then((r) => r.data);

export const getMe = () =>
  API.get("/auth/me").then((r) => r.data);

export const getBanner    = () => API.get("/superadmin/banner").then((r) => r.data);
export const updateBanner = (text) => API.put("/superadmin/banner", { text }).then((r) => r.data);