"use strict";

const { Router } = require('express');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { updateRunner, events, state } = require('../controllers/manualController');

const router = Router();

// Public endpoints
router.get('/events', events); // SSE endpoint (public)
router.get('/state/:matchId', state); // current manual state for match (public)

// Support-only update endpoint
router.post('/update', updateRunner);

module.exports = router;
