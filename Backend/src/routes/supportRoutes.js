"use strict";

const { Router } = require("express");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/authMiddleware");
const { getSupportProfile } = require("../controllers/supportController");

const router = Router();

// All support routes require login + support role
router.use(protect);
router.use(allowRoles("support", "superadmin")); // superadmin can also access

/**
 * GET /support/me
 * Returns support user's own profile
 */
router.get("/me", getSupportProfile);

module.exports = router;