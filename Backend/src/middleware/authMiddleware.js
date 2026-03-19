"use strict";

const { verifyAccessToken } = require("../utils/generateToken");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

/**
 * protect — verifies the httpOnly accessToken cookie and attaches the
 * authenticated user to req.user.
 *
 * Must be placed before any role-based middleware.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new AppError("Access denied. Please log in.", 401);

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const e = new AppError("Access token expired. Please refresh.", 401);
      e.code = "TOKEN_EXPIRED";
      throw e;
    }
    throw new AppError("Invalid access token.", 401);
  }

  const user = await User.findById(decoded.id).select(
    "-password -refreshTokenHash"
  );
  if (!user) throw new AppError("Token user no longer exists.", 401);
  if (!user.isActive)
    throw new AppError("Your account has been blocked. Contact support.", 403);

  req.user = user;
  next();
});

module.exports = { protect };
