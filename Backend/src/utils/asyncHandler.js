"use strict";

/**
 * Wraps an async Express route handler and forwards any rejected promise
 * to the next() error middleware — eliminating repetitive try/catch blocks.
 *
 * @param {import('express').RequestHandler} fn
 * @returns {import('express').RequestHandler}
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
