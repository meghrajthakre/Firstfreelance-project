"use strict";

const express = require("express");
const { placeBetController, settleBetController } = require("./bet.controller");

const router = express.Router();

// POST /bet/place
router.post("/place", placeBetController);

// POST /bet/settle
router.post("/settle", settleBetController);

module.exports = router;