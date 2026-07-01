"use strict";

const ManualRunner = require("../models/ManualRunner");

async function saveRunner(matchId, runner) {
    // Upsert runner document by matchId + runnerId
    const filter = { matchId: matchId, runnerId: runner.runnerId };
    const update = {
        $set: {
            runnerName: runner.runnerName,
            lagai: runner.lagai ?? 0,
            khai: runner.khai ?? 0,
            status: runner.status ?? 'open',
        },
    };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const doc = await ManualRunner.findOneAndUpdate(filter, update, opts).lean();
    return doc;
}

async function getState(matchId) {
    const rows = await ManualRunner.find({ matchId }).lean();
    return rows || [];
}

module.exports = { saveRunner, getState };
