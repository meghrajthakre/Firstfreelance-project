const SavedMatch = require("../models/SavedMatch");

/**
 * Save a match for a user.
 * - Rejects if the match has already started (commenceTime in the past).
 * - Uses the compound unique index to prevent duplicates (catches error code 11000).
 */
const saveMatch = async (userId, matchData) => {
  const { matchId, homeTeam, awayTeam, commenceTime, sportKey, odds } =
    matchData;

  // Prevent saving past matches
  if (commenceTime && new Date(commenceTime) < new Date()) {
    const err = new Error("Cannot save a match that has already started.");
    err.statusCode = 400;
    throw err;
  }

  try {
    const saved = await SavedMatch.create({
      user: userId,
      matchId,
      homeTeam,
      awayTeam,
      commenceTime,
      sportKey,
      odds,
    });

    return saved;
  } catch (err) {
    if (err.code === 11000) {
      const dupErr = new Error("Match already saved.");
      dupErr.statusCode = 409;
      throw dupErr;
    }
    throw err;
  }
};

/**
 * Get all saved matches for a user, newest first.
 * Uses lean() for plain JS objects — faster reads, no Mongoose overhead.
 */
const getSavedMatches = async (userId) => {
  return SavedMatch.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Delete a saved match for a user by matchId.
 * Returns the deleted document so the caller can confirm.
 */
const deleteSavedMatch = async (userId, matchId) => {
  const deleted = await SavedMatch.findOneAndDelete({
    user: userId,
    matchId,
  }).lean();

  if (!deleted) {
    const err = new Error("Saved match not found.");
    err.statusCode = 404;
    throw err;
  }

  return deleted;
};

/**
 * Remove all saved matches whose commence time is in the past.
 * Called by the optional cron job.
 */
const deleteExpiredMatches = async () => {
  const result = await SavedMatch.deleteMany({
    commenceTime: { $lt: new Date() },
  });
  return result.deletedCount;
};

module.exports = {
  saveMatch,
  getSavedMatches,
  deleteSavedMatch,
  deleteExpiredMatches,
};