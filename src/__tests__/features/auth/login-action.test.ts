import { beforeEach, describe, expect, test, vi } from 'vitest';
import { revalidatePath } from 'next/cache';

import { loginAction } from '@/features/auth/actions';
import { initialRegisterState } from '@/features/auth/types';
import { getUserForAuth } from '@/features/auth/api';
import { comparePassword } from '@/infrastructure/security/bcrypt-password-hasher';
import { createSession } from '@/infrastructure/auth/session';

import { buildLoginFormData, makeUser } from './__fixtures__/auth.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  createSession: vi.fn(),
}));

vi.mock('@/infrastructure/security/bcrypt-password-hasher', () => ({
  comparePassword: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/features/auth/api', () => ({
  getUserForAuth: vi.fn(),
  getUserByEmail: vi.fn(),
  getUserByUsername: vi.fn(),
  registerUser: vi.fn(),
}));

describe('Login action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should return an error when user does not exist', async () => {
    vi.mocked(getUserForAuth).mockResolvedValue(null);

    const result = await loginAction(initialRegisterState, buildLoginFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid credentials');
    expect(result.errors).toEqual({});
    expect(result.values).toEqual({ email: 'test@test.com' });
  });

  test('Return invalid credentials when password is wrong', async () => {
    vi.mocked(getUserForAuth).mockResolvedValue(makeUser());

    vi.mocked(comparePassword).mockResolvedValue(false);

    const result = await loginAction(initialRegisterState, buildLoginFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid credentials');
    expect(comparePassword).toHaveBeenCalled();
  });

  test('Creates session when credentials are valid', async () => {
    vi.mocked(getUserForAuth).mockResolvedValue(makeUser());
    vi.mocked(comparePassword).mockResolvedValue(true);

    const result = await loginAction(initialRegisterState, buildLoginFormData());

    expect(result.success).toBe(true);
    expect(createSession).toHaveBeenCalledWith('123');
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });
});
