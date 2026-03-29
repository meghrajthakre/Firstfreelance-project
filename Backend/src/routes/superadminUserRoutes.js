"use strict";

const express = require("express");
const router  = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  toggleUserStatus,
  changeUserPassword,
  deleteUser,
} = require("../controllers/superadminUserController");

// const { protect, restrictTo } = require("../middlewares/authMiddleware");

// All routes require auth + superadmin role
// router.use(protect, restrictTo("SUPERADMIN"));

/* ── Collection ─────────────────────────────────────────────── */
router
  .route("/")
  .get(getUsers)      // GET    /superadmin/users
  .post(createUser);  // POST   /superadmin/users

/* ── Single resource ────────────────────────────────────────── */
router
  .route("/:id")
  .get(getUser)       // GET    /superadmin/users/:id
  .patch(updateUser)  // PATCH  /superadmin/users/:id
  .delete(deleteUser); // DELETE /superadmin/users/:id

/* ── Sub-resources ──────────────────────────────────────────── */
router.patch("/:id/status",   toggleUserStatus);    // PATCH /superadmin/users/:id/status
router.patch("/:id/password", changeUserPassword);  // PATCH /superadmin/users/:id/password

module.exports = router;