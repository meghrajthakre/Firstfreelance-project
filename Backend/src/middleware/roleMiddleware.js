"use strict";

const { ROLES } = require("../models/User");
const AppError = require("../utils/AppError");

/**
 * authorize(...roles) — factory that returns a middleware restricting access
 * to users whose role is in the provided list.
 *
 * Must be used AFTER `protect`.
 *
 * @param {...string} roles
 * @returns {import('express').RequestHandler}
 *
 * @example
 * router.get('/admins', protect, authorize(ROLES.SUPERADMIN), handler);
 */
const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) throw new AppError("Authentication required.", 401);

  if (!roles.includes(req.user.role)) {
    throw new AppError(
      `Forbidden. Required role(s): [${roles.join(", ")}]. Your role: ${req.user.role}`,
      403
    );
  }
  next();
};

// ── Pre-composed guards for convenience ───────────────────────────────────────

/** Only superadmin */
const superAdminOnly = authorize(ROLES.SUPERADMIN);

/** Admin or superadmin */
const adminAndAbove = authorize(ROLES.SUPERADMIN, ROLES.ADMIN);

/** Regular user only */
const userOnly = authorize(ROLES.USER);

module.exports = { authorize, superAdminOnly, adminAndAbove, userOnly };
