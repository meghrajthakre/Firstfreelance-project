"use strict";

const jwt = require("jsonwebtoken");

// ── Token generation ──────────────────────────────────────────────────────────

/**
 * Generate a short-lived access token.
 * @param {{ id: string, role: string }} payload
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "60m",
    issuer: "betting-dashboard",
    audience: "betting-dashboard-client",
  });

/**
 * Generate a long-lived refresh token.
 * @param {{ id: string, role: string }} payload
 */
const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer: "betting-dashboard",
    audience: "betting-dashboard-client",
  });

// ── Token verification ────────────────────────────────────────────────────────

/** @throws {jwt.TokenExpiredError | jwt.JsonWebTokenError} */
const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: "betting-dashboard",
    audience: "betting-dashboard-client",
  });

/** @throws {jwt.TokenExpiredError | jwt.JsonWebTokenError} */
const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: "betting-dashboard",
    audience: "betting-dashboard-client",
  });

// ── Cookie helpers ────────────────────────────────────────────────────────────

const IS_PROD = () => process.env.NODE_ENV === "production";

/** httpOnly cookie options for access token */
const accessCookieOptions = () => ({
  httpOnly: true,
  secure: IS_PROD(),
  sameSite: IS_PROD() ? "strict" : "lax",
  maxAge: 30 * 60 * 1000, // 15 min
  path: "/",
});

/** httpOnly cookie options for refresh token — path-scoped to /auth/refresh */
const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: IS_PROD(),
  sameSite: IS_PROD() ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/auth/refresh",
});

/** Attach both tokens as httpOnly cookies to the response */
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, accessCookieOptions());
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
};

/** Clear both auth cookies */
const clearAuthCookies = (res) => {
  const base = { httpOnly: true, secure: IS_PROD() };
  res.clearCookie("accessToken", { ...base, path: "/" });
  res.clearCookie("refreshToken", { ...base, path: "/auth/refresh" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
