import redis from "./redis";

// ── TTL constants (seconds) ──────────────────────────────────
export const TTL = {
  HERO:         300,   //  5 min  — rarely changes
  EXPERIENCE:   300,   //  5 min
  ACHIEVEMENTS: 300,   //  5 min
  COURSES:      300,   //  5 min
  SKILLS:       600,   // 10 min  — almost never changes
  PROJECTS:     600,   // 10 min
  SHORT:        60,    //  1 min  — for frequently-changing data
} as const;

// ── Cache key namespaces ──────────────────────────────────────
export const KEYS = {
  hero:               "portfolio:hero",
  experience:         "portfolio:experience:all",
  experienceFeatured: "portfolio:experience:featured",
  achievement:        "portfolio:achievement:all",
  achievementFeatured:"portfolio:achievement:featured",
  course:             "portfolio:course:all",
  courseFeatured:     "portfolio:course:featured",
  skill:              "portfolio:skill:all",
  skillFeatured:      "portfolio:skill:featured",
  project:            "portfolio:project:all",
  projectFeatured:    "portfolio:project:featured",
} as const;

// ── Core helpers ──────────────────────────────────────────────

/**
 * Get cached value. Returns null on miss or Redis unavailable.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Set a value with TTL. Silently skips if Redis unavailable.
 */
export async function cacheSet(key: string, value: unknown, ttl: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    // non-fatal
  }
}

/**
 * Delete one or more cache keys. Used to invalidate on write.
 */
export async function cacheDel(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // non-fatal
  }
}

/**
 * Delete all keys matching a pattern (e.g. "portfolio:skill:*").
 */
export async function cacheDelPattern(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // non-fatal
  }
}

/**
 * Cache-aside helper — checks cache first, runs loader on miss,
 * stores result, then returns it.
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await loader();
  await cacheSet(key, fresh, ttl);
  return fresh;
}
