"use strict";

const { Router } = require("express");
const {
  createUser,
  getUsers,
  addCoinsToUser,
  getLedger,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminAndAbove } = require("../middleware/roleMiddleware");
const {
  validateBody,
  validateQuery,
  createUserSchema,
  addCoinsSchema,
  paginationSchema,
} = require("../utils/validators");

const router = Router();

// Every route requires: valid JWT + admin or superadmin role
router.use(protect, adminAndAbove);

/**
 * POST /admin/create-user
 * Body: { username, password }
 * Note: createdBy is automatically set to req.user._id
 */
router.post("/create-user", validateBody(createUserSchema), createUser);

/**
 * GET /admin/users?page=1&limit=10
 * Admin sees only their own users; superadmin sees all users
 */
router.get("/users", validateQuery(paginationSchema), getUsers);

/**
 * PATCH /admin/add-coins/:userId
 * Body: { amount, reason }
 * Admin can only top-up users they created; superadmin can top-up any user
 */
router.patch("/add-coins/:userId", validateBody(addCoinsSchema), addCoinsToUser);

/**
 * GET /admin/ledger?page=1&limit=10
 * Admin sees ledger for their users only; superadmin sees all entries
 */
router.get("/ledger", validateQuery(paginationSchema), getLedger);

module.exports = router;
