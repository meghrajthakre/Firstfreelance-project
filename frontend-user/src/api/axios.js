import axios from "axios";

const API = axios.create({
  baseURL: "https://bet-web-gjde.onrender.com/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler — redirect to login if session expires
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;