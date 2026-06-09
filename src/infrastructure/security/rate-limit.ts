import { headers } from 'next/headers';

const store = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 10;

export const checkRateLimit = (
  entries: Map<string, { count: number; resetAt: number }>,
  key: string,
  maxRequests: number,
  windowMs: number
): boolean => {
  const now = Date.now();
  const entry = entries.get(key);

  if (!entry || now > entry.resetAt) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
};

export const rateLimit = async (
  action: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): Promise<boolean> => {
  if (process.env.NODE_ENV === 'test') return true;

  const ip = await getClientIp();
  const key = `${ip}:${action}`;

  return checkRateLimit(store, key, maxRequests, windowMs);
};

export const resetRateLimitStore = (): void => {
  store.clear();
};

const getClientIp = async (): Promise<string> => {
  try {
    const header = await headers();
    const forwarded = header.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0]!.trim();
    const realIp = header.get('x-real-ip');
    if (realIp) return realIp;
  } catch {}
  return 'unknown';
};
