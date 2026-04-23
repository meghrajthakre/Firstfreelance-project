const express = require("express");

const { getMatches } = require("../controllers/InPlayController");
const {
  saveMatchHandler,
  getSavedMatchesHandler,
  deleteSavedMatchHandler,
} = require("../controllers/SavedMatchController");  // Capital S and M

const router = express.Router();


// ─── Public ──────────────────────────────────────────────────────────────────

/**
 * GET /api/matches
 * Query params: ?filter=today | ?filter=upcoming
 */
router.get("/", getMatches);

// ─── Protected ───────────────────────────────────────────────────────────────

/**
 * POST /api/matches/save
 */
router.post("/save", saveMatchHandler);

/**
 * GET /api/matches/saved
 */
router.get("/saved", getSavedMatchesHandler);

/**
 * DELETE /api/matches/:matchId
 */
router.delete("/:matchId", deleteSavedMatchHandler);

module.exports = router;