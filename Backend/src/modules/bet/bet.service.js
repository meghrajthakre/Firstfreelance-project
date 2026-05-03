"use strict";

const { Bet, BET_STATUS, BET_TYPE } = require("./bet.model");
const { updateUserCoins } = require("../ledger/ledger.service");
const { getUserBalance } = require("../wallet/wallet.service");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Calculates profit and liability for a rate-based Indian bet.
 *
 * YES (Lagai — backing the outcome):
 *   profit    = (rate × amount) / 100   ← what you WIN
 *   liability = amount                  ← what you RISK / lose
 *
 * NO (Khai — laying the outcome):
 *   profit    = amount                  ← what you WIN
 *   liability = (rate × amount) / 100   ← what you RISK / lose
 *
 * @param {"yes"|"no"} type
 * @param {number} amount
 * @param {number} rate
 * @returns {{ profit: number, liability: number }}
 */
const calculateBetFinancials = (type, amount, rate) => {
    if (type === BET_TYPE.YES) {
        const profit    = parseFloat(((rate * amount) / 100).toFixed(2));
        const liability = parseFloat(amount.toFixed(2));
        return { profit, liability };
    }

    // type === BET_TYPE.NO
    const profit    = parseFloat(amount.toFixed(2));
    const liability = parseFloat(((rate * amount) / 100).toFixed(2));
    return { profit, liability };
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Places a bet for a user using the Indian khai/lagai rate system.
 *
 * Only the `liability` (loss) is debited at placement — NOT the full amount.
 *
 * @param {string}      userId  - User placing the bet
 * @param {string}      matchId - Match the bet is on
 * @param {number}      amount  - Face-value stake
 * @param {number}      rate    - Indian percentage rate (e.g. 90)
 * @param {"yes"|"no"}  type    - Lagai (yes) or Khai (no)
 * @returns {Promise<import("./bet.model").Bet>}
 */
const placeBet = async (userId, matchId, amount, rate, type) => {
    // --- Validate inputs -------------------------------------------------------
    if (!amount || amount <= 0) {
        throw new Error("Bet amount must be greater than 0");
    }
    if (!rate || rate <= 0) {
        throw new Error("Rate must be greater than 0");
    }
    if (!Object.values(BET_TYPE).includes(type)) {
        throw new Error(`Bet type must be one of: ${Object.values(BET_TYPE).join(", ")}`);
    }

    // --- Calculate financials --------------------------------------------------
    const { profit, liability } = calculateBetFinancials(type, amount, rate);

    // --- Check user has enough coins to cover the liability -------------------
    const balance = await getUserBalance(userId);
    if (balance < liability) {
        throw new Error(
            `Insufficient balance. Required: ${liability}, Available: ${balance}`
        );
    }

    console.log(
        `[placeBet] User=${userId} | Match=${matchId} | Type=${type.toUpperCase()} | ` +
        `Amount=${amount} | Rate=${rate}% | Profit=${profit} | Liability=${liability} | Balance=${balance}`
    );

    // --- Debit only the liability from the user's wallet ----------------------
    await updateUserCoins(
        userId,
        liability,
        "debit",
        `${type.toUpperCase()} bet placed on match ${matchId} (liability)`,
        userId
    );

    // --- Persist the bet -------------------------------------------------------
    const bet = await Bet.create({
        userId,
        matchId,
        amount,
        rate,
        type,
        profit,
        loss: liability,   // `loss` stores the liability that was debited
        status: BET_STATUS.PENDING,
    });

    console.log(`[placeBet] Bet created: betId=${bet._id}`);
    return bet;
};

/**
 * Settles a pending bet.
 *
 * WIN  → credit (profit + liability)  [liability was already debited at placement]
 * LOSE → do nothing                   [liability was already debited at placement]
 *
 * @param {string}  betId      - Bet to settle
 * @param {boolean} won        - Whether the bet won
 * @param {string}  settledBy  - Admin / system user performing settlement
 * @returns {Promise<import("./bet.model").Bet>}
 */
const settleBet = async (betId, won, settledBy) => {
    // --- Fetch & guard ---------------------------------------------------------
    const bet = await Bet.findById(betId);
    if (!bet) {
        throw new Error("Bet not found");
    }
    if (bet.status !== BET_STATUS.PENDING) {
        throw new Error(`Bet has already been settled (current status: ${bet.status})`);
    }

    // --- Determine outcome -----------------------------------------------------
    const newStatus = won ? BET_STATUS.WON : BET_STATUS.LOST;

    /*
     * On a WIN we return the liability the user originally risked
     * PLUS the profit they earned.
     *
     *   creditAmount = profit + loss  (loss === liability that was debited)
     *
     * On a LOSS nothing is credited — the liability is already gone.
     */
    const creditAmount = won ? parseFloat((bet.profit + bet.loss).toFixed(2)) : 0;

    // --- Update bet record first (guard against double-settlement) ------------
    bet.status    = newStatus;
    bet.settledAt = new Date();
    bet.settledBy = settledBy;
    await bet.save();

    // --- Credit wallet on win --------------------------------------------------
    if (won) {
        await updateUserCoins(
            bet.userId,
            creditAmount,
            "credit",
            `${bet.type.toUpperCase()} bet won on match ${bet.matchId} (profit + liability returned)`,
            settledBy
        );
    }

    console.log(
        `[settleBet] betId=${betId} | Status=${newStatus} | ` +
        `Credited=${creditAmount} | SettledBy=${settledBy}`
    );

    return bet;
};

module.exports = { placeBet, settleBet };