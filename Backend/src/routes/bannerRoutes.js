"use strict";
const express = require("express");
const router = express.Router();

const { getBanner, upsertBanner } = require("../controllers/bannerController"); // adjust path


// GET  /api/superadmin/banner  — any logged-in user can read the banner
router.get("/",  getBanner);

// PUT  /api/superadmin/banner  — only SuperAdmin can write
router.put("/", upsertBanner);

module.exports = router;