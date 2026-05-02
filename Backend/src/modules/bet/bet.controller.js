"use strict";

const { placeBet, settleBet } = require("./bet.service");
const { z } = require("zod");
const mongoose = require("mongoose");

// Validation schemas
const placeBetSchema = z.object({
    userId: z
        .string({ required_error: "userId is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid userId format",
        }),
    matchId: z.string({ required_error: "matchId is required" }),
    amount: z
        .number({ required_error: "amount is required", invalid_type_error: "amount must be a number" })
        .positive("amount must be greater than 0")
        .finite("amount must be a finite number")
        .multipleOf(0.01, "amount supports up to 2 decimal places"),
    odds: z
        .number({ required_error: "odds is required", invalid_type_error: "odds must be a number" })
        .min(1, "odds must be at least 1")
        .finite("odds must be a finite number"),
});

const settleBetSchema = z.object({
    betId: z
        .string({ required_error: "betId is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid betId format",
        }),
    won: z.boolean({ required_error: "won is required" }),
    settledBy: z
        .string({ required_error: "settledBy is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid settledBy format",
        }),
});

/**
 * Place a bet
 */
const placeBetController = async (req, res) => {
    try {
        const validatedData = placeBetSchema.parse(req.body);
        const { userId, matchId, amount, odds } = validatedData;

        const bet = await placeBet(userId, matchId, amount, odds);

        res.status(201).json({
            success: true,
            message: "Bet placed successfully",
            data: bet,
        });
    } catch (error) {
        console.error("Place bet error:", error.message);
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

/**
 * Settle a bet
 */
const settleBetController = async (req, res) => {
    try {
        const validatedData = settleBetSchema.parse(req.body);
        const { betId, won, settledBy } = validatedData;

        const bet = await settleBet(betId, won, settledBy);

        res.status(200).json({
            success: true,
            message: "Bet settled successfully",
            data: bet,
        });
    } catch (error) {
        console.error("Settle bet error:", error.message);
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = { placeBetController, settleBetController };