"use strict";

const mongoose = require("mongoose");
const { User, ROLES } = require("../models/User");
const { Ledger, TX_TYPES } = require("../models/Ledger");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

// ── Helpers ───────────────────────────────────────────────────────────────────

const validId   = (id) => mongoose.Types.ObjectId.isValid(id);
const notSelf   = (a, b) => a.toString() !== b.toString();
const canManage = (role) => role !== ROLES.SUPERADMIN;

const getUser = async (id, projection = "username role isActive createdBy") => {
  if (!validId(id)) throw new AppError("Invalid user ID.", 400);
  const user = await User.findById(id).select(projection);
  if (!user) throw new AppError("User not found.", 404);
  return user;
};

// ── Create ────────────────────────────────────────────────────────────────────

const createMaster = asyncHandler(async (req, res) => {
  const user = await User.create({ ...req.body, role: ROLES.MASTER, createdBy: req.user._id });
  return ok(res, 201, "Master created successfully", { user });
});

const createAdmin = asyncHandler(async (req, res) => {
  const user = await User.create({ ...req.body, role: ROLES.ADMIN, createdBy: req.user._id });
  return ok(res, 201, "Admin created successfully", { user });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create({ ...req.body, role: ROLES.USER, createdBy: req.user._id });
  return ok(res, 201, "User created successfully", { user });
});

// ── List ──────────────────────────────────────────────────────────────────────

const LIST_PROJECTION = "username role coins isActive createdAt createdBy";

const listByRole = (role, label) =>
  asyncHandler(async (req, res) => {
    const users = await User.find({ role })
      .select(LIST_PROJECTION)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .lean();
    return ok(res, 200, `${label} retrieved`, { users });
  });

const getMasters = listByRole(ROLES.MASTER, "Masters");
const getAdmins  = listByRole(ROLES.ADMIN,  "Admins");
const getUsers   = listByRole(ROLES.USER,   "Users");

// ── Coins ─────────────────────────────────────────────────────────────────────

const addCoins = asyncHandler(async (req, res) => {
  const { amount, reason } = req.body;

  const target = await getUser(req.params.userId, "username role coins isActive");
  if (!canManage(target.role)) throw new AppError("Cannot credit a superadmin.", 403);
  if (!target.isActive)        throw new AppError("Cannot credit a blocked user.", 403);

  const balanceBefore  = target.coins;
  target.coins         = +(target.coins + amount).toFixed(2);

  await Promise.all([
    target.save({ validateBeforeSave: false }),
    Ledger.create({
      userId: target._id, amount, type: TX_TYPES.CREDIT,
      reason, createdBy: req.user._id, balanceBefore, balanceAfter: target.coins,
    }),
  ]);

  return ok(res, 200, `${amount} coins credited to ${target.username}`, {
    userId: target._id, username: target.username,
    balanceBefore, credited: amount, balanceAfter: target.coins,
  });
});

// ── Block / Unblock ───────────────────────────────────────────────────────────

const toggleBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!notSelf(req.user._id, id)) throw new AppError("You cannot block your own account.", 400);

  const target = await getUser(id);
  if (!canManage(target.role)) throw new AppError("Cannot block a superadmin.", 403);

  target.isActive = !target.isActive;
  await target.save({ validateBeforeSave: false });

  return ok(res, 200, `User ${target.isActive ? "unblocked" : "blocked"} successfully`, {
    userId: target._id, username: target.username,
    role: target.role,  isActive: target.isActive,
  });
});

// ── Delete ────────────────────────────────────────────────────────────────────

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!notSelf(req.user._id, id)) throw new AppError("You cannot delete your own account.", 400);

  const target = await getUser(id, "username role");
  if (!canManage(target.role)) throw new AppError("Cannot delete a superadmin.", 403);

  await target.deleteOne();

  return ok(res, 200, "User deleted successfully", {
    userId: target._id, username: target.username, role: target.role,
  });
});

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  createMaster, createAdmin, createUser,
  getMasters,   getAdmins,   getUsers,
  addCoins,     toggleBlock, deleteUser,
};