"use strict";

const mongoose = require("mongoose");
const User = require("../models/User");
const Ledger = require("../models/Ledger");

/**
 * Updates user coins with atomic transaction and ledger entry
 * @param {string} userId - User ID
 * @param {number} amount - Amount to credit/debit
 * @param {string} type - 'credit' or 'debit'
 * @param {string} reason - Reason for the transaction
 * @param {string} createdBy - ID of the user/admin performing the action
 * @returns {Promise<{balanceBefore: number, balanceAfter: number}>}
 */
const updateUserCoins = async (userId, amount, type, reason, createdBy) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch user with session
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error("User not found");
        }

        const balanceBefore = user.coins;
        let balanceAfter;

        if (type === "credit") {
            balanceAfter = balanceBefore + amount;
        } else if (type === "debit") {
            if (balanceBefore < amount) {
                throw new Error("Insufficient balance");
            }
            balanceAfter = balanceBefore - amount;
        } else {
            throw new Error("Invalid transaction type");
        }

        // Create immutable ledger entry
        await Ledger.create(
            [
                {
                    userId,
                    amount,
                    type,
                    reason,
                    createdBy,
                    balanceBefore,
                    balanceAfter,
                },
            ],
            { session }
        );

        // Update user balance
        user.coins = balanceAfter;
        await user.save({ session });

        // Commit transaction
        await session.commitTransaction();

        console.log(
            `Wallet transaction successful: User ${userId}, ${type} ${amount}, Balance: ${balanceBefore} -> ${balanceAfter}`
        );

        return { balanceBefore, balanceAfter };
    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        console.error("Wallet transaction failed:", error.message);
        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = { updateUserCoins };