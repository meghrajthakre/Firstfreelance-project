"use strict";

const { Bet, BET_STATUS } = require("./bet.model");
const { updateUserCoins } = require("../ledger/ledger.service");

/**
 * Places a bet for a user
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {number} amount - Bet amount
 * @param {number} odds - Betting odds
 * @returns {Promise<Bet>}
 */
const placeBet = async (userId, matchId, amount, odds) => {
    const potentialWin = amount * odds;

    // Debit the bet amount from user wallet
    await updateUserCoins(userId, amount, "debit", `Bet placed on match ${matchId}`, userId);

    // Create the bet record
    const bet = await Bet.create({
        userId,
        matchId,
        amount,
        odds,
        potentialWin,
        status: BET_STATUS.PENDING,
    });

    console.log(`Bet placed: User ${userId}, Match ${matchId}, Amount ${amount}, Odds ${odds}`);
    return bet;
};

/**
 * Settles a bet (won or lost)
 * @param {string} betId - Bet ID
 * @param {boolean} won - Whether the bet won
 * @param {string} settledBy - ID of the user settling the bet
 * @returns {Promise<Bet>}
 */
const settleBet = async (betId, won, settledBy) => {
    const bet = await Bet.findById(betId);
    if (!bet) {
        throw new Error("Bet not found");
    }

    if (bet.status !== BET_STATUS.PENDING) {
        throw new Error("Bet already settled");
    }

    let newStatus;
    let creditAmount = 0;
    let reason;

    if (won) {
        newStatus = BET_STATUS.WON;
        creditAmount = bet.potentialWin;
        reason = `Bet won on match ${bet.matchId}`;
    } else {
        newStatus = BET_STATUS.LOST;
        reason = `Bet lost on match ${bet.matchId}`;
    }

    // Update bet status
    bet.status = newStatus;
    bet.settledAt = new Date();
    await bet.save();

    // Credit winnings if won
    if (won) {
        await updateUserCoins(bet.userId, creditAmount, "credit", reason, settledBy);
    }

    console.log(`Bet settled: ${betId}, Status: ${newStatus}, Credit: ${creditAmount}`);
    return bet;
};

module.exports = { placeBet, settleBet };