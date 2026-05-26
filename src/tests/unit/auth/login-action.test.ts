import { describe, expect, test, vi } from 'vitest';
import { revalidatePath } from 'next/cache';

import { loginAction } from '@/features/auth/actions';
import { initialRegisterState } from '@/features/auth/types';
import { getUserForAuth } from '@/features/auth/api';
import { comparePassword } from '@/infrastructure/security/bcrypt-password-hasher';
import { createSession } from '@/infrastructure/auth/session';

import {
  buildLoginFormData,
  makeUser,
  VALID_EMAIL,
  VALID_PASSWORD,
} from './__fixtures__/auth.fixtures';

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
}));

const setupCredentials = (password: boolean = true) => {
  vi.mocked(getUserForAuth).mockResolvedValue(makeUser());
  vi.mocked(comparePassword).mockResolvedValue(password);
};

describe('Login action', () => {
  describe('Validation', () => {
    test('Should fail when email is missing', async () => {
      const result = await loginAction(
        initialRegisterState,
        buildLoginFormData('', VALID_PASSWORD)
      );

      expect(result).toEqual({
        success: false,
        message: 'Check wrong fields',
        errors: { email: ['Invalid email format'] },
        values: { email: '' },
      });
    });

    test('Should fail when password is missing', async () => {
      const result = await loginAction(
        initialRegisterState,
        buildLoginFormData(VALID_EMAIL, '')
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('Check wrong fields');
    });

    test('Should preserve email value on validation failure', async () => {
      const result = await loginAction(
        initialRegisterState,
        buildLoginFormData(VALID_EMAIL, '')
      );

      expect(result.success).toBe(false);
      expect(result.values).toEqual({ email: VALID_EMAIL });
    });

    test('Should not call getUserForAuth when validation fails', async () => {
      await loginAction(initialRegisterState, buildLoginFormData('', ''));

      expect(getUserForAuth).not.toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    test('Should return invalid credentials when user does not exist', async () => {
      vi.mocked(getUserForAuth).mockResolvedValue(null);

      const result = await loginAction(initialRegisterState, buildLoginFormData());

      expect(result).toEqual({
        success: false,
        message: 'Invalid credentials',
        errors: {},
        values: { email: 'test@test.com' },
      });
    });

    test('Should return invalid credentials when password is wrong', async () => {
      setupCredentials(false);

      const result = await loginAction(initialRegisterState, buildLoginFormData());

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
      expect(comparePassword).toHaveBeenCalled();
    });

    test('Should call comparePassword with the input password and the stores hash', async () => {
      setupCredentials(false);

      await loginAction(initialRegisterState, buildLoginFormData());

      expect(comparePassword).toHaveBeenCalledWith(VALID_PASSWORD, 'hashed-password');
    });

    test('Should not call createSession when password is wrong', async () => {
      setupCredentials(false);

      await loginAction(initialRegisterState, buildLoginFormData());

      expect(createSession).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should return success when credentials are valid', async () => {
      setupCredentials();

      const result = await loginAction(initialRegisterState, buildLoginFormData());

      expect(result).toEqual({
        success: true,
        message: 'Successful login',
        errors: {},
        values: {},
      });
    });

    test('Should create session with the user id', async () => {
      setupCredentials();

      await loginAction(initialRegisterState, buildLoginFormData());

      expect(createSession).toHaveBeenCalledWith('123');
    });

    test('Should revalidate the home page after login', async () => {
      setupCredentials();

      await loginAction(initialRegisterState, buildLoginFormData());

      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('Session errors', () => {
    test('Should return failure when createSession throws a known error', async () => {
      setupCredentials();
      vi.mocked(createSession).mockRejectedValue(
        new Error('Session storage unavailable')
      );

      const result = await loginAction(initialRegisterState, buildLoginFormData());

      expect(result.success).toBe(false);
      expect(result.message).toBe('Session storage unavailable');
    });

    test('Should preserve the email value when createSession throws', async () => {
      setupCredentials();
      vi.mocked(createSession).mockRejectedValue(new Error('fail'));

      const result = await loginAction(initialRegisterState, buildLoginFormData());

      expect(result.values).toEqual({ email: VALID_EMAIL });
    });
  });
});
