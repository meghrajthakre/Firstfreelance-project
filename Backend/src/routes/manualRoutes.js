"use strict";

const { Router } = require("express");
const {
    updateRunner,
    updateSettings,
    events,
    state,
    getSettings,  
} = require("../controllers/manualController");

const router = Router();

// Initial State
router.get("/state/:matchId", state);

// Settings
router.get("/settings/:matchId", getSettings);  // Add this
router.post("/settings/update", updateSettings);

// SSE
router.get("/events", events);

// Update Runner Odds
router.post("/update", updateRunner);

module.exports = router;