"use strict";

/**
 * Send a uniform success response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} [data]
 * @param {object} [meta]  — pagination, totals, etc.
 */
const ok = (res, statusCode = 200, message = "Success", data = undefined, meta = undefined) => {
  const body = { success: true, message };
  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * Send a uniform error response.
 * (Primarily used by errorMiddleware — controllers should call next(err) instead.)
 *
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Array} [errors]  — field-level validation errors
 */
const fail = (res, statusCode = 500, message = "Internal Server Error", errors = undefined) => {
  const body = { success: false, message };
  if (errors !== undefined) body.errors = errors;
  return res.status(statusCode).json(body);
};

/**
 * Build pagination meta object for list endpoints.
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { ok, fail, paginationMeta };
