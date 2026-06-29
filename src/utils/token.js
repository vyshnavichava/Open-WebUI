import GPT3Tokenizer from "gpt3-tokenizer";
import { getCache, setCache } from "./redis";

const tokenizer = new GPT3Tokenizer({ type: "gpt3" });

export const MODEL_LIMITS = {
  "llama-3.1-70b-versatile": 8192,
  "llama-3.1-8b-instant": 8192,
  "mixtral-8x7b": 32768,
};

export async function countTokensCached(text) {
  const cacheKey = `tokens:${text}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const tokens = tokenizer.encode(text).bpe.length;
  await setCache(cacheKey, tokens, 3600); // cache for 1h
  return tokens;
}

export function estimateTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  return messages.reduce((sum, m) => sum + countTokens(m.content), 0);
}

export function withinLimit(messages, model) {
  const limit = MODEL_LIMITS[model] || 8192;
  return estimateTokens(messages) <= limit;
}

export function truncateMessages(messages, model) {
  const limit = MODEL_LIMITS[model] || 8192;
  let total = 0;
  const safe = [];

  // Iterate backwards (newest first)
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = countTokens(messages[i].content);
    if (total + tokens > limit) break;
    safe.unshift(messages[i]);
    total += tokens;
  }

  return safe;
}
