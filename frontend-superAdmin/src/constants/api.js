// src/api/adminApi.js
import axios from "axios";

/* ── Axios instance ─────────────────────────────────────────────────────── */
const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,                // sends httpOnly accessToken cookie
  headers: { "Content-Type": "application/json" },
});

// Surface clean error messages from backend
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(new Error(err.response?.data?.message || err.message || "Something went wrong."))
);

/* ── Admin API calls ────────────────────────────────────────────────────── */

// GET /superadmin/admins?page=&limit=&search=
export const getAdminsAPI = ({ page = 1, limit = 10, search = "" } = {}) =>
  api.get("/superadmin/admins", { params: { page, limit, search } }).then(r => r.data);

// POST /superadmin/admins
export const createAdminAPI = (payload) =>
  api.post("/superadmin/admins", payload).then(r => r.data);

// PATCH /superadmin/toggle-block/:id
export const toggleBlockAPI = (id) =>
  api.patch(`/superadmin/toggle-block/${id}`).then(r => r.data);

// PATCH /superadmin/admins/:id/change-password
export const changeAdminPasswordAPI = (id, password) =>
  api.patch(`/superadmin/admins/${id}/change-password`, { password }).then(r => r.data);