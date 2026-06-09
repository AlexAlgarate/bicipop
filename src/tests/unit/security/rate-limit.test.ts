import { describe, expect, test, vi } from 'vitest';

import { checkRateLimit } from '@/infrastructure/security/rate-limit';

const makeStore = () => new Map<string, { count: number; resetAt: number }>();

describe('checkRateLimit', () => {
  describe('First request', () => {
    test('Should allow the first request for a new key', () => {
      const store = makeStore();

      const result = checkRateLimit(store, 'login', 5, 60_000);

      expect(result).toBe(true);
    });

    test('Should create an entry in the store', () => {
      const store = makeStore();

      checkRateLimit(store, 'login', 5, 60_000);

      const entry = store.get('login');
      expect(entry?.count).toBe(1);
      expect(entry?.resetAt).toBeGreaterThan(Date.now());
    });
  });

  describe('Within limits', () => {
    test('Should allow requests up to the limit', () => {
      const maxRequests = 3;
      const store = makeStore();

      for (let i = 0; i < maxRequests; i++) {
        expect(checkRateLimit(store, 'register', maxRequests, 60_000)).toBe(true);
      }
    });

    test('Should increment the counter on each request', () => {
      const store = makeStore();

      checkRateLimit(store, 'login', 5, 60_000);
      checkRateLimit(store, 'login', 5, 60_000);

      expect(store.get('login')?.count).toBe(2);
    });
  });

  describe('Rate limit exceeded', () => {
    test('Should block requests that exceed the limit', () => {
      const maxRequests = 3;
      const store = makeStore();

      for (let i = 0; i < maxRequests; i++) {
        checkRateLimit(store, 'login', maxRequests, 60_000);
      }

      expect(checkRateLimit(store, 'login', maxRequests, 60_000)).toBe(false);
    });

    test('Should block all subsequent requests until reset', () => {
      const maxRequests = 2;
      const store = makeStore();

      checkRateLimit(store, 'login', maxRequests, 60_000);
      checkRateLimit(store, 'login', maxRequests, 60_000);
      checkRateLimit(store, 'login', maxRequests, 60_000);
      checkRateLimit(store, 'login', maxRequests, 60_000);

      expect(checkRateLimit(store, 'login', maxRequests, 60_000)).toBe(false);
    });
  });

  describe('Window expiration', () => {
    test('Should reset the counter after the window expires', () => {
      vi.useFakeTimers();
      const store = makeStore();
      const maxRequests = 2;

      checkRateLimit(store, 'login', maxRequests, 60_000);
      checkRateLimit(store, 'login', maxRequests, 60_000);
      expect(checkRateLimit(store, 'login', maxRequests, 60_000)).toBe(false);

      vi.advanceTimersByTime(60_001);

      expect(checkRateLimit(store, 'login', maxRequests, 60_000)).toBe(true);
      vi.useRealTimers();
    });
  });

  describe('Independent keys', () => {
    test('Should track different keys independently', () => {
      const store = makeStore();
      const maxRequests = 2;

      checkRateLimit(store, 'login', maxRequests, 60_000);
      checkRateLimit(store, 'login', maxRequests, 60_000);
      expect(checkRateLimit(store, 'login', maxRequests, 60_000)).toBe(false);

      expect(checkRateLimit(store, 'register', maxRequests, 60_000)).toBe(true);
    });

    test('Should track different IPs independently', () => {
      const store = makeStore();
      const maxRequests = 2;

      checkRateLimit(store, '192.168.1.1:login', maxRequests, 60_000);
      checkRateLimit(store, '192.168.1.1:login', maxRequests, 60_000);
      expect(checkRateLimit(store, '192.168.1.1:login', maxRequests, 60_000)).toBe(false);

      expect(checkRateLimit(store, '10.0.0.1:login', maxRequests, 60_000)).toBe(true);
    });
  });

  describe('Custom window and limit', () => {
    test('Should accept custom maxRequests', () => {
      const store = makeStore();

      expect(checkRateLimit(store, 'api', 1, 60_000)).toBe(true);
      expect(checkRateLimit(store, 'api', 1, 60_000)).toBe(false);
    });

    test('Should accept custom windowMs', () => {
      vi.useFakeTimers();
      const store = makeStore();

      checkRateLimit(store, 'api', 1, 10_000);
      expect(checkRateLimit(store, 'api', 1, 10_000)).toBe(false);

      vi.advanceTimersByTime(10_001);
      expect(checkRateLimit(store, 'api', 1, 10_000)).toBe(true);
      vi.useRealTimers();
    });
  });
});
