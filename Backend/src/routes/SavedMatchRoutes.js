const express = require("express");

const { getMatches } = require("../controllers/InPlayController");
const {
  saveMatchHandler,
  getSavedMatchesHandler,
  deleteSavedMatchHandler,
  getSavedMatchByIdHandler,
} = require("../controllers/SavedMatchController");
const { protect } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// ─── Public ──────────────────────────────────────────────────────────────────
router.get("/",      getMatches);
router.get("/saved", getSavedMatchesHandler);  // ← public
router.get("/saved/:matchId", getSavedMatchByIdHandler); // ← public
// ─── Superadmin only ─────────────────────────────────────────────────────────
router.post("/save",       protect, superAdminOnly, saveMatchHandler);
router.delete("/:matchId", protect, superAdminOnly, deleteSavedMatchHandler);

module.exports = router;