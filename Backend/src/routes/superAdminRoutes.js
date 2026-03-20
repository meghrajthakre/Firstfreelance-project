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
const { superAdminOnly } = require("../middleware/authorize");
const {
  validateBody,
  validateQuery,
  createAdminSchema,
  createUserSchema,
  addCoinsSchema,
  paginationSchema,
} = require("../utils/validators");

const router = Router();

router.use(protect, superAdminOnly);

// ── Create ────────────────────────────────────────────────────────────────────
router.post("/masters", validateBody(createAdminSchema), createMaster);
router.post("/admins",  validateBody(createAdminSchema), createAdmin);
router.post("/users",   validateBody(createUserSchema),  createUser);

// ── List ──────────────────────────────────────────────────────────────────────
router.get("/masters", validateQuery(paginationSchema), getMasters);
router.get("/admins",  validateQuery(paginationSchema), getAdmins);
router.get("/users",   validateQuery(paginationSchema), getUsers);

// ── Coins ─────────────────────────────────────────────────────────────────────
router.patch("/add-coins/:userId", validateBody(addCoinsSchema), addCoins);

// ── Manage ────────────────────────────────────────────────────────────────────
router.patch("/toggle-block/:id", toggleBlock);
router.delete("/:id",             deleteUser);

module.exports = router;