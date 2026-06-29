import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, trim: true },
    username: { type: String, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferences: { type: Schema.Types.Mixed, default: {} },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.statics.upsertFromClerk = async function upsertFromClerk(clerkProfile = {}) {
  if (!clerkProfile || !clerkProfile.id) {
    throw new Error("Invalid clerkProfile passed to upsertFromClerk");
  }

  const data = {
    clerkId: clerkProfile.id,
    displayName:
      clerkProfile.fullName || clerkProfile.firstName || clerkProfile.username || clerkProfile.name,
    username: clerkProfile.username,
    email:
      (Array.isArray(clerkProfile.emailAddresses) && clerkProfile.emailAddresses[0]?.emailAddress) ||
      clerkProfile.email ||
      null,
    avatarUrl: clerkProfile.imageUrl || clerkProfile.avatarUrl || null,
    metadata: { raw: clerkProfile },
  };

  try {
    const user = await this.findOneAndUpdate(
      { clerkId: data.clerkId },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
    return user;
  } catch (err) {
    err.message = `User.upsertFromClerk failed: ${err.message}`;
    throw err;
  }
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
