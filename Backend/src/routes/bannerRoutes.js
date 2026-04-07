"use strict";
const express = require("express");
const router = express.Router();

const { getBanner, upsertBanner } = require("../controllers/bannerController"); // adjust path
const { protect } = require("../middleware/authMiddleware");    // adjust to your actual middleware names

// GET  /api/superadmin/banner  — any logged-in user can read the banner
router.get("/",  getBanner);

// PUT  /api/superadmin/banner  — only SuperAdmin can write
router.put("/",protect, upsertBanner);

module.exports = router;