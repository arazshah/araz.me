type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();
export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count++;
  if (entry.count > limit)
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.reset - now) / 1000),
    };
  return { allowed: true, retryAfter: 0 };
}
