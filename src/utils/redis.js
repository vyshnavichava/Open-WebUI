import Redis from "ioredis";

let redis;

export function getRedisClient() {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("❌ Missing REDIS_URL in environment");
    }

    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    redis.on("connect", () => console.log("✅ Redis connected"));
    redis.on("error", (err) =>
      console.error("❌ Redis error:", err.message)
    );
  }
  return redis;
}

export async function setCache(key, value, ttl = 3600) {
  const client = getRedisClient();
  try {
    await client.set(key, JSON.stringify(value), "EX", ttl);
  } catch (err) {
    console.error("❌ Redis setCache error:", err.message);
  }
}

export async function getCache(key) {
  const client = getRedisClient();
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("❌ Redis getCache error:", err.message);
    return null;
  }
}

export async function delCache(key) {
  const client = getRedisClient();
  try {
    await client.del(key);
  } catch (err) {
    console.error("❌ Redis delCache error:", err.message);
  }
}
