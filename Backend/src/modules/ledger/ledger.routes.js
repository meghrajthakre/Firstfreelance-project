"use strict";

const express = require("express");
const { creditCoins, debitCoins } = require("./ledger.controller");

const router = express.Router();

// POST /ledger/credit
router.post("/credit", creditCoins);

// POST /ledger/debit
router.post("/debit", debitCoins);

module.exports = router;