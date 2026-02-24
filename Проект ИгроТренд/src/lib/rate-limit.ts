type RateEntry = { count: number; expiresAt: number };
const store = new Map<string, RateEntry>();

/**
 * Simple in-memory rate limiter.
 * @param key unique identifier (e.g. ip or ip:endpoint)
 * @param limit maximum number of requests in window
 * @param windowMs window in milliseconds
 * @returns true if limited (too many requests)
 */
export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.expiresAt <= now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }
  existing.count += 1;
  if (existing.count > limit) {
    return true;
  }
  return false;
}
