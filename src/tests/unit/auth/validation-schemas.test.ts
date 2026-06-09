import { describe, expect, test } from 'vitest';

import { registerSchema, loginSchema } from '@/features/auth/validation';

describe('registerSchema', () => {
  test('Should transform email to lowercase', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'Test@Example.COM',
      password: 'abc',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});

describe('loginSchema', () => {
  test('Should transform email to lowercase', () => {
    const result = loginSchema.safeParse({
      email: 'User@Example.COM',
      password: 'secret',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });
});
