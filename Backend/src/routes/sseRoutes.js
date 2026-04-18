// routes/sseRoutes.js

const express = require("express");
const { proxySSE, getMatchFallback } = require("../controllers/Ssecontroller");

const router = express.Router();

/**
 * GET /sse/:matchId
 * Main SSE proxy — streams live match data from the upstream source.
 * The client should connect via EventSource('/sse/<matchId>').
 */
router.get("/:matchId", proxySSE);

/**
 * GET /sse/:matchId/fallback
 * REST fallback used by the frontend when the SSE stream fails.
 * Returns the last-known JSON snapshot of the match data (or an empty shell).
 */
router.get("/:matchId/fallback", getMatchFallback);

module.exports = router;