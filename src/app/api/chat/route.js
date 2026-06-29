import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Conversation from "@/models/Conversation";
import { generateAIResponse } from "@/utils/vercelAI";
import { estimateTokens } from "@/utils/token";
import { AI } from "@/helpers/constants";

export async function GET(req) {
  try {
    await dbConnect();

    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const conversations = await Conversation.find({ ownerId: user.userId })
      .sort({ lastMessageAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("Chat GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    // If sending AI messages
    if (body.conversationId && body.messages) {
      const { conversationId, messages } = body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
      }

      // Check total tokens
      const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
      if (totalTokens > AI.MAX_MESSAGE_LENGTH) {
        return NextResponse.json({ error: "Message too long." }, { status: 400 });
      }

      const aiResponse = await generateAIResponse(messages);

      return NextResponse.json({
        message: aiResponse,
        cached: aiResponse.cached || false,
      });
    }

    // If creating a new conversation
    const { title } = body;
    const conversation = await Conversation.createForUser(user.userId, {
      title: title || "New Conversation",
    });

    return NextResponse.json({ conversation });
  } catch (err) {
    console.error("Chat POST error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
