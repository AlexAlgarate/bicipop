import { beforeEach, describe, expect, test, vi } from 'vitest';

import { registerAction } from '@/features/auth/actions';
import { initialRegisterState } from '@/features/auth/types';
import { registerUser, checkIfUserExists } from '@/features/auth/api';
import { hashPassword } from '@/infrastructure/security/bcrypt-password-hasher';

import {
  buildRegisterFormData,
  VALID_EMAIL,
  VALID_PASSWORD,
  VALID_USERNAME,
} from './__fixtures__/auth.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  createSession: vi.fn(),
}));

vi.mock('@/infrastructure/security/bcrypt-password-hasher', () => ({
  comparePassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/features/auth/api', () => ({
  checkIfUserExists: vi.fn(),
  registerUser: vi.fn(),
}));

const setupUserExits = ({
  emailExists = false,
  usernameExists = false,
}: {
  emailExists?: boolean;
  usernameExists?: boolean;
}) => {
  vi.mocked(checkIfUserExists).mockResolvedValue({
    existingEmail: emailExists,
    existingUsername: usernameExists,
  });
  vi.mocked(hashPassword).mockResolvedValue('hashed-password');
};

describe('Register Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Schema validation', () => {
    test('Should fail when email is missing', async () => {
      const result = await registerAction(
        initialRegisterState,
        buildRegisterFormData({ email: '' })
      );

      expect(result).toEqual({
        success: false,
        values: {
          email: '',
          username: VALID_USERNAME,
        },
        message: 'Check wrong fields',
        errors: {
          email: ['Invalid email format'],
        },
      });
    });

    test('Should fail when username is missing', async () => {
      const result = await registerAction(
        initialRegisterState,
        buildRegisterFormData({ username: '' })
      );

      expect(result).toEqual({
        success: false,
        values: {
          email: VALID_EMAIL,
          username: '',
        },
        message: 'Check wrong fields',
        errors: {
          username: ['Username must be at least 3 characters'],
        },
      });
    });

    test('Should fail when password is missing', async () => {
      const result = await registerAction(
        initialRegisterState,
        buildRegisterFormData({ password: '' })
      );

      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('password');
    });

    test('Should preserve email and username values on validation failure', async () => {
      const result = await registerAction(
        initialRegisterState,
        buildRegisterFormData({ email: 'bad-email' })
      );

      expect(result.values).toEqual({ email: 'bad-email', username: VALID_USERNAME });
    });

    test('Should not call checkIfUserExists on validation failure', async () => {
      await registerAction(
        initialRegisterState,
        buildRegisterFormData({ email: 'bad-email' })
      );

      expect(checkIfUserExists).not.toHaveBeenCalled();
    });
  });

  describe('Password confirmation', () => {
    test('Should fail when password do not match and preserve email and username', async () => {
      const result = await registerAction(
        initialRegisterState,
        buildRegisterFormData({ confirmPassword: 'different-password' })
      );

      expect(result).toEqual({
        success: false,
        values: {
          email: VALID_EMAIL,
          username: VALID_USERNAME,
        },
        message: 'Passwords do not match',
        errors: {},
      });
    });

    test('Should not call checkIfUserExists on password mismatch', async () => {
      await registerAction(
        initialRegisterState,
        buildRegisterFormData({ confirmPassword: 'different-password' })
      );

      expect(checkIfUserExists).not.toHaveBeenCalled();
    });
  });

  describe('Duplicate checks', () => {
    test('Should fail when email or username already exists', async () => {
      setupUserExits({ emailExists: true });

      const result = await registerAction(initialRegisterState, buildRegisterFormData());

      expect(result).toEqual({
        success: false,
        message: 'Credentials invalid',
        errors: {},
        values: {},
      });
    });

    test('Should fail when username already exists', async () => {
      setupUserExits({ usernameExists: true });

      const result = await registerAction(initialRegisterState, buildRegisterFormData());

      expect(result).toEqual({
        success: false,
        message: 'Credentials invalid',
        errors: {},
        values: {},
      });
    });

    test('Should not call registerAction when email or username exist', async () => {
      setupUserExits({ emailExists: true, usernameExists: true });

      await registerAction(initialRegisterState, buildRegisterFormData());

      expect(registerUser).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should successfully register user when all data is valid', async () => {
      setupUserExits({ emailExists: false, usernameExists: false });

      const result = await registerAction(initialRegisterState, buildRegisterFormData());

      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        errors: {},
        values: {},
      });
      expect(registerUser).toHaveBeenCalledWith(
        VALID_USERNAME,
        VALID_EMAIL,
        'hashed-password'
      );
    });

    test('Should hash the password before registering', async () => {
      setupUserExits({ emailExists: false, usernameExists: false });

      await registerAction(initialRegisterState, buildRegisterFormData());

      expect(hashPassword).toHaveBeenCalledWith(VALID_PASSWORD);
    });
  });

  describe('Register errors', () => {
    test('Should return failure when registerUser throws a known error', async () => {
      setupUserExits({ emailExists: false, usernameExists: false });
      vi.mocked(registerUser).mockRejectedValue(new Error('Database unavailable'));

      const result = await registerAction(initialRegisterState, buildRegisterFormData());

      expect(result.success).toBe(false);
      expect(result.message).toBe('Database unavailable');
    });

    test('Should preserve email and username when registerUser throws', async () => {
      setupUserExits({ emailExists: false, usernameExists: false });
      vi.mocked(registerUser).mockRejectedValue(new Error('fail'));

      const result = await registerAction(initialRegisterState, buildRegisterFormData());

      expect(result.values).toEqual({ email: VALID_EMAIL, username: VALID_USERNAME });
    });
  });
});
