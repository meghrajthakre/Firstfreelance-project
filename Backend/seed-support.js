// seed-support.js  (run with: node seed-support.js)
require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./src/models/User");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const exists = await User.findOne({ username: "support1" });
  if (exists) {
    console.log("Support user already exists");
    process.exit(0);
  }

  await User.create({
    username:  "support1",
    password:  "Support@123",
    firstName: "Support",
    role:      "support",
    isActive:  true,
  });

  console.log("✅ Support user created");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });