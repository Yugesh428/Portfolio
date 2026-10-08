import Redis from "ioredis";

// ── Singleton Redis client ──────────────────────────────────
// Reuses the same connection across hot-reloads in dev mode.
// Falls back gracefully if REDIS_URL is not configured.

const REDIS_URL = process.env.REDIS_URL;

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | null | undefined;
}

function createRedisClient(): Redis | null {
  if (!REDIS_URL) {
    console.warn("⚠️  REDIS_URL not set — caching disabled, falling back to DB.");
    return null;
  }
  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: true,          // connect on first command, not at import time
      tls: REDIS_URL.startsWith("rediss://") ? {} : undefined,
    });

    client.on("connect",      () => console.log("✅ Redis connected"));
    client.on("ready",        () => console.log("✅ Redis ready"));
    client.on("error",        (err) => console.error("❌ Redis error:", err.message));
    client.on("reconnecting", () => console.log("🔄 Redis reconnecting…"));

    // Trigger the connection now so we get the log on startup
    client.ping().catch(() => {});

    return client;
  } catch (err: any) {
    console.error("❌ Redis init failed:", err.message);
    return null;
  }
}

// Singleton — one client per process
const redis: Redis | null =
  globalThis.__redis ?? (globalThis.__redis = createRedisClient());

export default redis;
