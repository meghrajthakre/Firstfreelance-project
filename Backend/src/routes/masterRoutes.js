const { Router } = require("express");
const {
  createAdmin,
  createUser,
  getAdmins,
  getUsers,
  addCoins,
  toggleBlock,
  deleteUser,
} = require("../controllers/masterController");
const { protect } = require("../middleware/authMiddleware");
const { masterAndAbove } = require("../middleware/roleMiddleware");
const {
  validateBody,
  validateQuery,
  createAdminSchema,
  createUserSchema,
  addCoinsSchema,
  paginationSchema,
} = require("../utils/validators");

const router = Router();

router.use(protect, masterAndAbove);

// ── Create ────────────────────────────────────────────────────────────────────
router.post("/admins", validateBody(createAdminSchema), createAdmin);
router.post("/users",  validateBody(createUserSchema),  createUser);

// ── List ──────────────────────────────────────────────────────────────────────
router.get("/admins", validateQuery(paginationSchema), getAdmins);
router.get("/users",  validateQuery(paginationSchema), getUsers);

// ── Coins ─────────────────────────────────────────────────────────────────────
router.patch("/add-coins/:userId", validateBody(addCoinsSchema), addCoins);

// ── Manage ────────────────────────────────────────────────────────────────────
router.patch("/toggle-block/:id", toggleBlock);
router.delete("/:id",             deleteUser);

module.exports = router;