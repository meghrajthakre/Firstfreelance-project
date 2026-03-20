"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = Object.freeze({
  SUPERADMIN: "superadmin",
  MASTER: "master",
  ADMIN: "admin",
  USER: "user",
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: "Role must be superadmin, master, admin, or user",
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Compound indexes
userSchema.index({ createdBy: 1, role: 1 });

// ── Pre-save: hash password only when modified 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ── Instance methods 
userSchema.methods.comparePassword = function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

// ── Static helpers 
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase().trim() }).select("+password");
};

const User = mongoose.model("User", userSchema);

module.exports = { User, ROLES };