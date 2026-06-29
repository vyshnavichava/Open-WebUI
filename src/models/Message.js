import mongoose from "mongoose";

const { Schema } = mongoose;

const AttachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    provider: { type: String, enum: ["uploadcare", "cloudinary", "direct"], default: "direct" },
    mime: { type: String },
    filename: { type: String },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, default: "" }, // raw text / markdown
    attachments: { type: [AttachmentSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "streaming", "completed", "failed"],
      default: "pending",
      index: true,
    },
    error: { type: Schema.Types.Mixed, default: null },
    edited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/* Indexes for fast reads by conv + newest first */
MessageSchema.index({ conversationId: 1, createdAt: -1 });

function sanitizeText(input) {
  if (typeof input !== "string") return input;
  return input.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

MessageSchema.pre("save", function preSave(next) {
  try {
    if (this.isModified("content") && typeof this.content === "string") {
      this.content = sanitizeText(this.content);
    }
    if (this.isModified("edited") && this.edited) {
      this.editedAt = new Date();
    }
    next();
  } catch (err) {
    next(err);
  }
});

MessageSchema.methods.appendContent = async function appendContent(chunk) {
  if (!chunk) return this;
  this.content = (this.content || "") + String(chunk);
  this.status = "streaming";
  try {
    await this.save();
    return this;
  } catch (err) {
    err.message = `Message.appendContent failed: ${err.message}`;
    throw err;
  }
};

MessageSchema.methods.markComplete = async function markComplete() {
  this.status = "completed";
  try {
    await this.save();
    return this;
  } catch (err) {
    err.message = `Message.markComplete failed: ${err.message}`;
    throw err;
  }
};

MessageSchema.methods.markFailed = async function markFailed(errInfo) {
  this.status = "failed";
  this.error = errInfo ? (errInfo.message || errInfo) : { message: "unknown error" };
  try {
    await this.save();
    return this;
  } catch (err) {
    err.message = `Message.markFailed failed: ${err.message}`;
    throw err;
  }
};

MessageSchema.statics.createMessage = async function createMessage({ conversationId, role, content = "", attachments = [], touchConversation = true }) {
  if (!conversationId) throw new Error("conversationId is required to create a message");
  try {
    const msg = await this.create({ conversationId, role, content, attachments });
    if (touchConversation) {
      try {
        const Conversation = mongoose.model("Conversation");
        await Conversation.findByIdAndUpdate(conversationId, { $set: { lastMessageAt: new Date() } }).exec();
      } catch (err) {
        console.warn("Failed to touch conversation:", err);
      }
    }
    return msg;
  } catch (err) {
    err.message = `Message.createMessage failed: ${err.message}`;
    throw err;
  }
};

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
