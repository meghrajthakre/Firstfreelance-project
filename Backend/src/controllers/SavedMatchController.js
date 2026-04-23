const { validationResult } = require("express-validator");
const {
  saveMatch,
  getSavedMatches,
  deleteSavedMatch,
} = require("../services/Savedmatchservice");

/**
 * POST /api/matches/save
 * Save a match for the authenticated user.
 */
const saveMatchHandler = async (req, res) => {
  // express-validator errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array(),
    });
  }

  try {
    const userId = req.user.id;
    const saved = await saveMatch(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Match saved successfully.",
      data: saved,
    });
  } catch (err) {
    console.error("[savedMatchController.saveMatchHandler]", err.message);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to save match.",
    });
  }
};

/**
 * GET /api/matches/saved
 * Retrieve all saved matches for the authenticated user.
 */
const getSavedMatchesHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const matches = await getSavedMatches(userId);

    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    console.error(
      "[savedMatchController.getSavedMatchesHandler]",
      err.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve saved matches.",
    });
  }
};

/**
 * DELETE /api/matches/:matchId
 * Remove a saved match for the authenticated user.
 */
const deleteSavedMatchHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;

    const deleted = await deleteSavedMatch(userId, matchId);

    return res.status(200).json({
      success: true,
      message: "Saved match removed.",
      data: deleted,
    });
  } catch (err) {
    console.error(
      "[savedMatchController.deleteSavedMatchHandler]",
      err.message
    );
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to delete saved match.",
    });
  }
};

module.exports = {
  saveMatchHandler,
  getSavedMatchesHandler,
  deleteSavedMatchHandler,
};