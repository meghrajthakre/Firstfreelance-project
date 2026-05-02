"use strict";

const mongoose = require("mongoose");

const BET_STATUS = Object.freeze({
    PENDING: "pending",
    WON: "won",
    LOST: "lost",
    CANCELLED: "cancelled",
});

const betSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "userId is required"],
            index: true,
        },
        matchId: {
            type: String,
            required: [true, "matchId is required"],
        },
        amount: {
            type: Number,
            required: [true, "amount is required"],
            min: [0.01, "Amount must be greater than 0"],
        },
        odds: {
            type: Number,
            required: [true, "odds is required"],
            min: [1, "Odds must be at least 1"],
        },
        status: {
            type: String,
            enum: Object.values(BET_STATUS),
            default: BET_STATUS.PENDING,
        },
        potentialWin: {
            type: Number,
            required: true,
        },
        settledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
betSchema.index({ userId: 1, createdAt: -1 });
betSchema.index({ matchId: 1, status: 1 });

const Bet = mongoose.model("Bet", betSchema);

module.exports = { Bet, BET_STATUS };