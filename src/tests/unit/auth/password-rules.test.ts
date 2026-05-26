import { describe, expect, test, vi, beforeEach } from 'vitest';

const DEV_PASSWORD_LENGTH = 3;
const PROD_PASSWORD_LENGTH = 8;

vi.mock('@/utils/constants', () => ({
  DEV_PASSWORD_LENGTH,
  PROD_PASSWORD_LENGTH,
}));

describe('getPasswordRulesStatus', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('Dev mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    test('Should return all rules as false when password is empty', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      const result = getPasswordRulesStatus('');

      expect(result).toEqual({
        length: false,
        upperLowerNumber: false,
        symbol: true,
      });
    });

    test('Should require minimum dev length (3 characters)', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      expect(getPasswordRulesStatus('ab').length).toBe(false);
      expect(getPasswordRulesStatus('abc').length).toBe(true);
    });

    test('Should always return symbol as true in dev mode', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      expect(getPasswordRulesStatus('abc').symbol).toBe(true);
      expect(getPasswordRulesStatus('').symbol).toBe(true);
    });

    test('Should check upper/lower/number rules', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      expect(getPasswordRulesStatus('abc').upperLowerNumber).toBe(false);
      expect(getPasswordRulesStatus('Ab1').upperLowerNumber).toBe(true);
    });
  });

  describe('Production mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    test('Should require minimum prod length (8 characters)', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      const short = 'Ab1!xyz';
      expect(getPasswordRulesStatus(short).length).toBe(false);

      const long = 'Ab1!xyzz';
      expect(getPasswordRulesStatus(long).length).toBe(true);
    });

    test('Should require at least one uppercase letter', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      expect(getPasswordRulesStatus('abcdef12!').upperLowerNumber).toBe(false);
      expect(getPasswordRulesStatus('Abcdef12!').upperLowerNumber).toBe(true);
    });

    test('Should require at least one lowercase letter', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      expect(getPasswordRulesStatus('ABCDEF12!').upperLowerNumber).toBe(false);
    });

    test('Should require at least one number', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      expect(getPasswordRulesStatus('Abcdefgh!').upperLowerNumber).toBe(false);
    });

    test('Should require at least one symbol', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      const result = getPasswordRulesStatus('Abcdef12');

      expect(result.symbol).toBe(false);
      expect(result.upperLowerNumber).toBe(true);
    });

    test('Should pass all rules with a valid password', async () => {
      const { getPasswordRulesStatus } = await import('@/features/auth/validation');

      const result = getPasswordRulesStatus('MyStr0ng!');

      expect(result).toEqual({
        length: true,
        upperLowerNumber: true,
        symbol: true,
      });
    });
  });
});

describe('isPasswordValid', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('Should return false for empty password in dev mode', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { isPasswordValid } = await import('@/features/auth/validation');

    expect(isPasswordValid('')).toBe(false);
  });

  test('Should return true for valid dev password (3+ chars with upper+lower+number)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { isPasswordValid } = await import('@/features/auth/validation');

    expect(isPasswordValid('Ab1')).toBe(true);
  });

  test('Should return false for dev password missing upper/lower/number', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { isPasswordValid } = await import('@/features/auth/validation');

    expect(isPasswordValid('abc')).toBe(false);
  });

  test('Should return false for short password in prod mode', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { isPasswordValid } = await import('@/features/auth/validation');

    expect(isPasswordValid('Ab1!')).toBe(false);
  });

  test('Should return true for valid prod password', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { isPasswordValid } = await import('@/features/auth/validation');

    // 8+ chars, upper+lower+number+symbol
    expect(isPasswordValid('MyStr0ng!')).toBe(true);
  });
});
