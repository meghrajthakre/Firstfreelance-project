const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/** Role constants — single source of truth */
const ROLES = Object.freeze({
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  USER: "user",
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username may only contain letters, numbers, and underscores",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
      select: false, // never returned by default
    },

    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: "Role must be superadmin, admin, or user",
      },
      default: ROLES.USER,
    },

    coins: {
      type: Number,
      default: 0,
      min: [0, "Coins cannot be negative"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    /** Stored hashed refresh token for rotation + reuse detection */
    refreshTokenHash: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshTokenHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Compound indexes ─────────────────────────────────────────────────────────
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdBy: 1, role: 1 });

// ── Pre-save: hash password only when modified ───────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

userSchema.methods.compareRefreshToken = function (plaintext) {
  if (!this.refreshTokenHash) return Promise.resolve(false);
  return bcrypt.compare(plaintext, this.refreshTokenHash);
};

// ── Static helpers ───────────────────────────────────────────────────────────
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase().trim() }).select(
    "+password +refreshTokenHash"
  );
};

const User = mongoose.model("User", userSchema);

module.exports = { User, ROLES };
