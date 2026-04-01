"use strict";

const jwt = require("jsonwebtoken");

// ── Token generation ──────────────────────────────────────────────────────────

/**
 * Generate a short-lived access token.
 * @param {{ id: string, role: string }} payload
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "180m",
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

// ── Cookie helpers ────────────────────────────────────────────────────────────

const IS_PROD = () => process.env.NODE_ENV === "production";

/** httpOnly cookie options for access token */
const accessCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: "none", //  cross-site ke liye required
  maxAge: 180 * 60 * 1000,
});

const COOKIE_NAME = (role) => role === "superadmin" ? "sa_accessToken" : "accessToken";

const setAuthCookies = (res, accessToken, role) => {
  res.cookie(COOKIE_NAME(role), accessToken, accessCookieOptions());
};

const clearAuthCookies = (res) => {
  const opts = { httpOnly: true, secure: true, sameSite: "none", path: "/" };
  res.clearCookie("sa_accessToken", opts);
  res.clearCookie("accessToken", opts);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  setAuthCookies,
  clearAuthCookies,
};