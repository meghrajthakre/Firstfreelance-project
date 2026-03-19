"use strict";

const mongoose = require("mongoose");
const { User, ROLES } = require("../models/User");
const { Ledger, TX_TYPES } = require("../models/Ledger");
const asyncHandler = require("../utils/asyncHandler");
const { ok, paginationMeta } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

// ── POST /superadmin/create-admin ─────────────────────────────────────────────
const createAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Duplicate check (provides a better error than the 11000 mongo duplicate)
  const exists = await User.exists({ username });
  if (exists) throw new AppError("Username already taken", 409);

  const admin = await User.create({
    username,
    password,
    role: ROLES.ADMIN,
    createdBy: req.user._id,
  });

  return ok(res, 201, "Admin created successfully", {
    admin: {
      _id: admin._id,
      username: admin.username,
      role: admin.role,
      coins: admin.coins,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    },
  });
});

// ── GET /superadmin/admins ────────────────────────────────────────────────────
const getAdmins = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const filter = { role: ROLES.ADMIN };

  const [admins, total] = await Promise.all([
    User.find(filter)
      .populate("createdBy", "username role")
      .select("-password -refreshTokenHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return ok(res, 200, "Admins retrieved", { admins }, paginationMeta(total, page, limit));
});

// ── PATCH /superadmin/add-coins/:adminId ──────────────────────────────────────
const addCoinsToAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { amount, reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(adminId))
    throw new AppError("Invalid admin ID", 400);

  const admin = await User.findOne({ _id: adminId, role: ROLES.ADMIN });
  if (!admin) throw new AppError("Admin not found", 404);

  const balanceBefore = admin.coins;
  admin.coins = +(admin.coins + amount).toFixed(2); // avoid floating-point drift
  await admin.save({ validateBeforeSave: false });

  await Ledger.create({
    userId: admin._id,
    amount,
    type: TX_TYPES.CREDIT,
    reason,
    createdBy: req.user._id,
    balanceBefore,
    balanceAfter: admin.coins,
  });

  return ok(res, 200, `${amount} coins credited to ${admin.username}`, {
    adminId: admin._id,
    username: admin.username,
    balanceBefore,
    credited: amount,
    balanceAfter: admin.coins,
  });
});

// ── PATCH /superadmin/block/:id ───────────────────────────────────────────────
const toggleBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid user ID", 400);
  if (id === req.user._id.toString()) throw new AppError("You cannot block your own account", 400);

  const target = await User.findById(id).select("+refreshTokenHash");
  if (!target) throw new AppError("User not found", 404);
  if (target.role === ROLES.SUPERADMIN)
    throw new AppError("Cannot block another superadmin", 403);

  target.isActive = !target.isActive;

  // Invalidate active sessions when blocking
  if (!target.isActive) target.refreshTokenHash = null;

  await target.save({ validateBeforeSave: false });

  const action = target.isActive ? "unblocked" : "blocked";
  return ok(res, 200, `User ${action} successfully`, {
    userId: target._id,
    username: target.username,
    role: target.role,
    isActive: target.isActive,
  });
});

module.exports = { createAdmin, getAdmins, addCoinsToAdmin, toggleBlock };
