const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

// ── POST /auth/login ──────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // validated by Zod middleware

  const user = await User.findByUsername(username);
  if (!user) throw new AppError("Invalid username or password", 401);
  if (!user.isActive) throw new AppError("Account is blocked. Contact support.", 403);

  const valid = await user.comparePassword(password);
  if (!valid) throw new AppError("Invalid username or password", 401);

  // ── Generate tokens ──────────────────────────────────────────────────────
  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // ── Persist hashed refresh token (bcrypt, 10 rounds is fine for tokens) ──
  const HASH_ROUNDS = 10;
  user.refreshTokenHash = await bcrypt.hash(refreshToken, HASH_ROUNDS);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);

  return ok(res, 200, "Login successful", {
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      coins: user.coins,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    },
  });
});

// ── POST /auth/logout ─────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  await User.findByIdAndUpdate(req.user._id, { refreshTokenHash: null });
  clearAuthCookies(res);
  return ok(res, 200, "Logged out successfully");
});

// ── POST /auth/refresh ────────────────────────────────────────────────────────
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("Refresh token not provided", 401);

  // ── Verify signature & expiry ────────────────────────────────────────────
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    clearAuthCookies(res);
    if (err.name === "TokenExpiredError")
      throw new AppError("Refresh token expired. Please log in again.", 401);
    throw new AppError("Invalid refresh token.", 401);
  }

  // ── Match against stored hash (detect reuse / theft) ─────────────────────
  const user = await User.findById(decoded.id).select("+refreshTokenHash");
  if (!user) {
    clearAuthCookies(res);
    throw new AppError("User not found.", 401);
  }

  const tokenMatches = await user.compareRefreshToken(token);
  if (!tokenMatches) {
    // Possible token-reuse attack — nuke all sessions
    user.refreshTokenHash = null;
    await user.save({ validateBeforeSave: false });
    clearAuthCookies(res);
    throw new AppError("Refresh token reuse detected. Please log in again.", 401);
  }

  if (!user.isActive) {
    clearAuthCookies(res);
    throw new AppError("Account is blocked.", 403);
  }

  // ── Issue new tokens (rotation) ───────────────────────────────────────────
  const payload = { id: user._id, role: user.role };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  const HASH_ROUNDS = 10;
  user.refreshTokenHash = await bcrypt.hash(newRefreshToken, HASH_ROUNDS);
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, newAccessToken, newRefreshToken);

  return ok(res, 200, "Token refreshed successfully");
});

// ── GET /auth/me ──────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // Reload fresh data (coins etc. may have changed since token was issued)
  const user = await User.findById(req.user._id)
    .populate("createdBy", "username role")
    .select("-password -refreshTokenHash");

  if (!user) throw new AppError("User not found.", 404);

  return ok(res, 200, "Profile retrieved", { user });
});

module.exports = { login, logout, refresh, getMe };
