"use strict";

const { Router } = require("express");
const {
  createAdmin,
  getAdmins,
  addCoinsToAdmin,
  toggleBlock,
} = require("../controllers/superAdminController");
const { protect } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/roleMiddleware");
const {
  validateBody,
  validateQuery,
  createAdminSchema,
  addCoinsSchema,
  paginationSchema,
} = require("../utils/validators");

const router = Router();

// Every route in this file requires: valid JWT + superadmin role
router.use(protect, superAdminOnly);

/**
 * POST /superadmin/create-admin
 * Body: { username, password }
 */
router.post("/create-admin", validateBody(createAdminSchema), createAdmin);

/**
 * GET /superadmin/admins?page=1&limit=10
 */
router.get("/admins", validateQuery(paginationSchema), getAdmins);

/**
 * PATCH /superadmin/add-coins/:adminId
 * Body: { amount, reason }
 */
router.patch("/add-coins/:adminId", validateBody(addCoinsSchema), addCoinsToAdmin);

/**
 * PATCH /superadmin/block/:id
 * Toggles isActive on any non-superadmin account
 */
router.patch("/block/:id", toggleBlock);

module.exports = router;
