import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import Memory from "@/models/Memory";
import { getAuthUser } from "@/utils/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const user = getAuthUser();
    const url = new URL(req.url);
    const tags = url.searchParams.get("tags")?.split(",") || [];

    const memories = await Memory.getForOwner(user.userId, tags);

    return NextResponse.json({ memories });
  } catch (err) {
    console.error("Memory GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = getAuthUser();
    const { key, value, tags = [], source = "user" } = await req.json();

    if (!key || !value) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const memory = await Memory.upsert(user.userId, key, value, { tags, source });

    return NextResponse.json({ memory });
  } catch (err) {
    console.error("Memory POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const user = getAuthUser();
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const deleted = await Memory.deleteForKey(user.userId, key);

    if (!deleted) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Memory deleted successfully" });
  } catch (err) {
    console.error("Memory DELETE error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
