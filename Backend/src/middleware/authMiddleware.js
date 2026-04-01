const { verifyAccessToken } = require("../utils/generateToken");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const protect = asyncHandler(async (req, _res, next) => {
  // Try both cookies — decode whichever is present
  const saToken   = req.cookies?.sa_accessToken;
  const userToken = req.cookies?.accessToken;

  // Prefer sa_accessToken but fall back to accessToken
  const token = saToken || userToken;
  if (!token) throw new AppError("Access denied. Please log in.", 401);

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    // If sa_accessToken failed, try falling back to userToken
    if (saToken && userToken) {
      try {
        decoded = verifyAccessToken(userToken);
      } catch {
        throw new AppError("Invalid access token.", 401);
      }
    } else if (err.name === "TokenExpiredError") {
      throw new AppError("Session expired. Please log in again.", 401);
    } else {
      throw new AppError("Invalid access token.", 401);
    }
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user)      throw new AppError("Token user no longer exists.", 401);
  if (!user.isActive) throw new AppError("Your account has been blocked. Contact support.", 403);

  // Attach decoded role for authorize() middleware
  req.user = user;
  next();
});

module.exports = { protect };