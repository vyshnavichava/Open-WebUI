import mongoose from "mongoose";

const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, default: "Untitled conversation", trim: true },
    participants: { type: [String], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ConversationSchema.index({ ownerId: 1, lastMessageAt: -1 });

ConversationSchema.methods.touch = async function touch() {
  this.lastMessageAt = new Date();
  try {
    await this.save();
    return this;
  } catch (err) {
    err.message = `Conversation.touch failed: ${err.message}`;
    throw err;
  }
};

ConversationSchema.statics.createForUser = async function createForUser(ownerId, overrides = {}) {
  if (!ownerId) throw new Error("ownerId is required to create a conversation");
  try {
    const conv = await this.create({ ownerId, ...overrides });
    return conv;
  } catch (err) {
    err.message = `Conversation.createForUser failed: ${err.message}`;
    throw err;
  }
};

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
