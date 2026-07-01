"use strict";

const ManualRunner = require("../models/ManualModel/ManualRunner");
const ManualSettings = require('../models/ManualModel/ManualSettings');

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



async function getSettings(matchId) {
    let settings = await ManualSettings.findOne({ matchId });
    if (!settings) {
        // Create default settings if not exists
        settings = await ManualSettings.create({
            matchId,
            rateDiff: 1,
            betLock: false,
            sessionLock: false,
            mode: 'Lagai',
            marketStatus: 'OPEN'
        });
    }
    return settings;
}

async function updateSettings(data) {
    const { matchId, rateDiff, betLock, sessionLock, mode, marketStatus } = data;
    
    let settings = await ManualSettings.findOne({ matchId });
    
    if (!settings) {
        settings = new ManualSettings({ matchId });
    }
    
    if (rateDiff !== undefined) settings.rateDiff = rateDiff;
    if (betLock !== undefined) settings.betLock = betLock;
    if (sessionLock !== undefined) settings.sessionLock = sessionLock;
    if (mode !== undefined) settings.mode = mode;
    if (marketStatus !== undefined) settings.marketStatus = marketStatus;
    
    await settings.save();
    return settings;
}

module.exports = { 
    saveRunner, 
    getState, 
    getSettings, 
    updateSettings 
};

