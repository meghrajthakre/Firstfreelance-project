"use strict";

const { Router } = require("express");
const {
  createMaster,
  createAdmin,
  createUser,
  getMasters,
  getAdmins,
  getUsers,
  addCoins,
  toggleBlock,
  deleteUser,
} = require("../controllers/superAdminController");
const { protect } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/roleMiddleware");
const {
  validateBody,
  createAdminSchema,
  createUserSchema,
  addCoinsSchema,
} = require("../utils/validators");

const router = Router();

router.use(protect, superAdminOnly);

// ── Create ────────────────────────────────────────────────────────────────────
router.post("/masters", validateBody(createAdminSchema), createMaster);
router.post("/admins",  validateBody(createAdminSchema), createAdmin);
router.post("/users",   validateBody(createUserSchema),  createUser);

// ── List ──────────────────────────────────────────────────────────────────────
router.get("/masters", getMasters);
router.get("/admins",  getAdmins);
router.get("/users",   getUsers);

// ── Coins ─────────────────────────────────────────────────────────────────────
router.patch("/add-coins/:userId", validateBody(addCoinsSchema), addCoins);

// ── Manage ────────────────────────────────────────────────────────────────────
router.patch("/toggle-block/:id", toggleBlock);
router.delete("/:id",             deleteUser);

module.exports = router;