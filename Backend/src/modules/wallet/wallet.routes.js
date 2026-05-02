"use strict";

const express = require("express");
const { getBalance, getHistory, credit, debit } = require("./wallet.controller");

const router = express.Router();

// GET /wallet/:userId/balance
router.get("/:userId/balance", getBalance);

// GET /wallet/:userId/history
router.get("/:userId/history", getHistory);

// POST /wallet/credit
router.post("/credit", credit);

// POST /wallet/debit
router.post("/debit", debit);

module.exports = router;