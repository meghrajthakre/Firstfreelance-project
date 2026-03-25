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
  secure: IS_PROD(),
  sameSite: IS_PROD() ? "strict" : "lax",
  maxAge: 180 * 60 * 1000,
  path: "/",
});

/** Attach access token as httpOnly cookie to the response */
const setAuthCookies = (res, accessToken) => {
  res.cookie("accessToken", accessToken, accessCookieOptions());
};

/** Clear access token cookie */
const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: IS_PROD(), path: "/" });
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  setAuthCookies,
  clearAuthCookies,
};