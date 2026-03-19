const mongoose = require("mongoose");
const { User, ROLES } = require("../models/User");
const { Ledger, TX_TYPES } = require("../models/Ledger");
const asyncHandler = require("../utils/asyncHandler");
const { ok, paginationMeta } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

// ── POST /admin/create-user ───────────────────────────────────────────────────
const createUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const exists = await User.exists({ username });
  if (exists) throw new AppError("Username already taken", 409);

  const user = await User.create({
    username,
    password,
    role: ROLES.USER,
    createdBy: req.user._id, // this admin owns the new user
  });

  return ok(res, 201, "User created successfully", {
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      coins: user.coins,
      isActive: user.isActive,
      createdBy: user.createdBy,
      createdAt: user.createdAt,
    },
  });
});

// ── GET /admin/users ──────────────────────────────────────────────────────────
// Admin → only their users | Superadmin → all users
const getUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const filter =
    req.user.role === ROLES.SUPERADMIN
      ? { role: ROLES.USER }
      : { role: ROLES.USER, createdBy: req.user._id };

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate("createdBy", "username role")
      .select("-password -refreshTokenHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return ok(res, 200, "Users retrieved", { users }, paginationMeta(total, page, limit));
});

// ── PATCH /admin/add-coins/:userId ────────────────────────────────────────────
// Admin can only top-up their own users; superadmin can top-up any user
const addCoinsToUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { amount, reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new AppError("Invalid user ID", 400);

  // Build filter — enforce ownership for admins
  const filter = { _id: userId, role: ROLES.USER };
  if (req.user.role === ROLES.ADMIN) filter.createdBy = req.user._id;

  const user = await User.findOne(filter);
  if (!user)
    throw new AppError(
      "User not found or you do not have permission to manage this user",
      404
    );

  const balanceBefore = user.coins;
  user.coins = +(user.coins + amount).toFixed(2);
  await user.save({ validateBeforeSave: false });

  await Ledger.create({
    userId: user._id,
    amount,
    type: TX_TYPES.CREDIT,
    reason,
    createdBy: req.user._id,
    balanceBefore,
    balanceAfter: user.coins,
  });

  return ok(res, 200, `${amount} coins credited to ${user.username}`, {
    userId: user._id,
    username: user.username,
    balanceBefore,
    credited: amount,
    balanceAfter: user.coins,
  });
});

// ── GET /admin/ledger ─────────────────────────────────────────────────────────
// Admin → ledger entries for their users only | Superadmin → all entries
const getLedger = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  let filter = {};

  if (req.user.role === ROLES.ADMIN) {
    // Get IDs of all users this admin created
    const myUserIds = await User.distinct("_id", {
      createdBy: req.user._id,
      role: ROLES.USER,
    });
    filter = { userId: { $in: myUserIds } };
  }

  const [entries, total] = await Promise.all([
    Ledger.find(filter)
      .populate("userId", "username role")
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Ledger.countDocuments(filter),
  ]);

  return ok(res, 200, "Ledger retrieved", { entries }, paginationMeta(total, page, limit));
});

module.exports = { createUser, getUsers, addCoinsToUser, getLedger };
