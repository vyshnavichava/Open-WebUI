import mongoose from "mongoose";

const { Schema } = mongoose;

const MemorySchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true },
    tags: { type: [String], default: [] },
    source: { type: String, enum: ["user", "system", "auto"], default: "user" },
    version: { type: Number, default: 1 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MemorySchema.index({ ownerId: 1, key: 1 }, { unique: true });

MemorySchema.statics.upsert = async function upsertMemory(ownerId, key, value, extra = {}) {
  if (!ownerId || !key) throw new Error("ownerId and key are required for Memory.upsert");
  try {
    const doc = await this.findOneAndUpdate(
      { ownerId, key },
      { $set: { value, ...extra }, $inc: { version: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
    return doc;
  } catch (err) {
    err.message = `Memory.upsert failed: ${err.message}`;
    throw err;
  }
};

MemorySchema.statics.getForOwner = async function getForOwner(ownerId, tags = []) {
  if (!ownerId) throw new Error("ownerId is required for Memory.getForOwner");
  try {
    const q = { ownerId };
    if (Array.isArray(tags) && tags.length) q.tags = { $in: tags };
    return this.find(q).sort({ updatedAt: -1 }).lean().exec();
  } catch (err) {
    err.message = `Memory.getForOwner failed: ${err.message}`;
    throw err;
  }
};

MemorySchema.statics.deleteForKey = async function deleteForKey(ownerId, key) {
  if (!ownerId || !key) throw new Error("ownerId and key required for Memory.deleteForKey");
  try {
    return this.findOneAndDelete({ ownerId, key }).exec();
  } catch (err) {
    err.message = `Memory.deleteForKey failed: ${err.message}`;
    throw err;
  }
};

export default mongoose.models.Memory || mongoose.model("Memory", MemorySchema);
