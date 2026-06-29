import { getAuth } from "@clerk/nextjs/server";

export function getAuthUser(req) {
  const { userId, sessionId } = getAuth(req);

  if (!userId) {
    console.error("❌ Auth error: User not authenticated");
    return null;
  }

  return { userId, sessionId };
}
