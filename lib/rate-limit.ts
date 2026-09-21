/**
 * Best-effort, in-memory rate limiter keyed by an arbitrary string (usually
 * an IP address). There's no shared store (Redis/Upstash) in this project,
 * so on Vercel this only limits requests landing on the same warm serverless
 * instance — it's a real deterrent against casual abuse, not a hard
 * distributed guarantee. Swap for a real store if that ever matters.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
