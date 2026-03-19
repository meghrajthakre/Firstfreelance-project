"use strict";

const { Router } = require("express");
const { login, logout, refresh, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validateBody, loginSchema } = require("../utils/validators");

const router = Router();

/**
 * POST /auth/login
 * Body: { username, password }
 * Returns: httpOnly access + refresh token cookies
 */
router.post("/login", validateBody(loginSchema), login);

/**
 * POST /auth/logout
 * Clears cookies + invalidates refresh token in DB
 */
router.post("/logout", protect, logout);

/**
 * POST /auth/refresh
 * Uses the refreshToken httpOnly cookie to issue a new access token (+ rotated refresh token).
 * No protect middleware here — the refresh token IS the credential.
 */
router.post("/refresh", refresh);

/**
 * GET /auth/me
 * Returns current authenticated user's profile
 */
router.get("/me", protect, getMe);

module.exports = router;
