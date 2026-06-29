import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import Memory from "@/models/Memory";
import { generateAIResponse } from "@/utils/vercelAI";

export async function POST(req) {
  try {
    await dbConnect();
    const payload = await req.json();

    if (!payload || !payload.type) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const { type, data } = payload;

    switch (type) {
      case "ai_response_request":
        if (!data?.messages) {
          return NextResponse.json({ error: "Missing messages for AI response" }, { status: 400 });
        }

        const aiResult = await generateAIResponse(data.messages);

        return NextResponse.json({ message: aiResult });

      case "memory_update":
        if (!data?.ownerId || !data?.key || !data?.value) {
          return NextResponse.json({ error: "Missing memory data" }, { status: 400 });
        }

        const memory = await Memory.upsert(data.ownerId, data.key, data.value, {
          tags: data.tags || [],
          source: data.source || "system",
        });

        return NextResponse.json({ memory });

      case "file_uploaded":
        console.log("File uploaded webhook:", data);
        return NextResponse.json({ received: true });

      default:
        return NextResponse.json({ error: "Unknown webhook type" }, { status: 400 });
    }
  } catch (err) {
    console.error("Webhook POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
