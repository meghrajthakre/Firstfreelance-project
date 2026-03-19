"use strict";

/**
 * AppError — represents a known, operational HTTP error.
 *
 * Operational errors (e.g. "user not found", "wrong password") are safe to
 * expose to clients. Non-operational errors (programming mistakes) will be
 * caught by errorMiddleware and returned as a generic 500.
 */
class AppError extends Error {
  /**
   * @param {string} message  — client-facing error message
   * @param {number} statusCode  — HTTP status code
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // flag for errorMiddleware
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
