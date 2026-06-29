import { getCache, setCache } from "./redis";
import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateAIResponse(messages) {
  const cacheKey = `ai:${JSON.stringify(messages)}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const result = response.choices[0]?.message;

    await setCache(cacheKey, result, 600);

    return result;
  } catch (err) {
    console.error("❌ Groq AI error:", err.message);
    throw new Error("AI response generation failed (Groq)");
  }
}
