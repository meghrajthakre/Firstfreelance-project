const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in environment variables");

  mongoose.connection.on("connected", () =>
    console.log(` MongoDB connected → ${mongoose.connection.host}`)
  );
  mongoose.connection.on("error", (err) =>
    console.error("MongoDB error:", err.message)
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("⚠️ MongoDB disconnected")
  );

  // Graceful shutdown
  const shutdown = async (signal) => {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed (${signal})`);
    process.exit(0);
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));

  await mongoose.connect(uri, { autoIndex: true });
};

module.exports = connectDB;
