const mongoose = require("mongoose");
const { User, ROLES } = require("../models/User");
const { Ledger, TX_TYPES } = require("../models/Ledger");
const asyncHandler = require("../utils/asyncHandler");
const { ok, paginationMeta } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

// ── helpers ───────────────────────────────────────────────────────────────────
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Validate and parse pagination query parameters
 * @param {Object} query - req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Defaults
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  // Optional: cap limit to avoid excessive data load
  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Check if a username already exists (case-insensitive) and throw AppError if so
 */
const checkUsernameExists = async (username) => {
  const existing = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  if (existing) {
    throw new AppError("Username already taken", 409);
  }
};

// ── POST /superadmin/masters ──────────────────────────────────────────────────
const createMaster = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }
  await checkUsernameExists(username);

  const master = await User.create({
    username,
    password,
    role: ROLES.MASTER,
    createdBy: req.user._id,
  });

  return ok(res, 201, "Master created successfully", { user: master });
});

// ── POST /superadmin/admins ───────────────────────────────────────────────────
const createAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }
  await checkUsernameExists(username);

  const admin = await User.create({
    username,
    password,
    role: ROLES.ADMIN,
    createdBy: req.user._id,
  });

  return ok(res, 201, "Admin created successfully", { user: admin });
});

// ── POST /superadmin/users ────────────────────────────────────────────────────
const createUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }
  await checkUsernameExists(username);

  const user = await User.create({
    username,
    password,
    role: ROLES.USER,
    createdBy: req.user._id,
  });

  return ok(res, 201, "User created successfully", { user });
});

// ── GET /superadmin/masters ───────────────────────────────────────────────────
const getMasters = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { role: ROLES.MASTER };

  const [masters, total] = await Promise.all([
    User.find(filter)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return ok(
    res,
    200,
    "Masters retrieved",
    { users: masters },
    paginationMeta(total, page, limit)
  );
});

// ── GET /superadmin/admins ────────────────────────────────────────────────────
const getAdmins = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { role: ROLES.ADMIN };

  const [admins, total] = await Promise.all([
    User.find(filter)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return ok(
    res,
    200,
    "Admins retrieved",
    { users: admins },
    paginationMeta(total, page, limit)
  );
});

// ── GET /superadmin/users ─────────────────────────────────────────────────────
const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { role: ROLES.USER };

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return ok(
    res,
    200,
    "Users retrieved",
    { users },
    paginationMeta(total, page, limit)
  );
});

// ── PATCH /superadmin/add-coins/:userId ───────────────────────────────────────
const addCoins = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  let { amount, reason } = req.body;

  if (!validId(userId)) throw new AppError("Invalid user ID", 400);
  if (!amount || isNaN(amount)) throw new AppError("Valid amount is required", 400);
  amount = parseFloat(amount);
  if (amount <= 0) throw new AppError("Amount must be a positive number", 400);

  const target = await User.findById(userId);
  if (!target) throw new AppError("User not found", 404);
  if (target.role === ROLES.SUPERADMIN) throw new AppError("Cannot credit a superadmin", 403);

  const balanceBefore = target.coins;
  // Use decimal arithmetic to avoid floating point issues
  target.coins = +(balanceBefore + amount).toFixed(4);
  await target.save({ validateBeforeSave: false });

  await Ledger.create({
    userId: target._id,
    amount,
    type: TX_TYPES.CREDIT,
    reason: reason || "Admin credit",
    createdBy: req.user._id,
    balanceBefore,
    balanceAfter: target.coins,
  });

  return ok(res, 200, `${amount} coins credited to ${target.username}`, {
    userId: target._id,
    username: target.username,
    balanceBefore,
    credited: amount,
    balanceAfter: target.coins,
  });
});

// ── PATCH /superadmin/toggle-block/:id ───────────────────────────────────────
const toggleBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validId(id)) throw new AppError("Invalid user ID", 400);
  if (id === req.user._id.toString()) throw new AppError("You cannot block your own account", 400);

  const target = await User.findById(id);
  if (!target) throw new AppError("User not found", 404);
  if (target.role === ROLES.SUPERADMIN) throw new AppError("Cannot block a superadmin", 403);

  target.isActive = !target.isActive;
  await target.save({ validateBeforeSave: false });

  const action = target.isActive ? "unblocked" : "blocked";
  return ok(res, 200, `User ${action} successfully`, {
    userId: target._id,
    username: target.username,
    role: target.role,
    isActive: target.isActive,
  });
});

// ── DELETE /superadmin/:id ────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validId(id)) throw new AppError("Invalid user ID", 400);

  // Use findByIdAndDelete to avoid race conditions and fetch the document in one operation
  const target = await User.findByIdAndDelete(id);
  if (!target) throw new AppError("User not found", 404);
  if (target.role === ROLES.SUPERADMIN) throw new AppError("Cannot delete a superadmin", 403);

  return ok(res, 200, "User deleted successfully");
});

module.exports = {
  createMaster,
  createAdmin,
  createUser,
  getMasters,
  getAdmins,
  getUsers,
  addCoins,
  toggleBlock,
  deleteUser,
};