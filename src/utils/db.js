import mongoose from "mongoose";

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "ObsidianGPT",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw new Error("Failed to connect to MongoDB");
  }
}
