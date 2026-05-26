import { beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { updateUserProfileAction } from '@/features/profile/settings/update/actions';
import { getSession } from '@/infrastructure/auth/session';
import { updateUserProfile } from '@/features/profile/settings/update/api';

import {
  VALID_EMAIL,
  VALID_USERNAME,
  VALID_CURRENT_PASSWORD,
  makeSession,
  buildUpdateProfileFormData,
} from './__fixtures__/profile.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/profile/settings/update/api', () => ({
  updateUserProfile: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    const err = Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT' });
    throw err;
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const setupAuthenticatedSession = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());
};

describe('updateUserProfileAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call updateUserProfile when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(updateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('Schema validation', () => {
    test('Should fail when email is missing', async () => {
      setupAuthenticatedSession();

      const result = await updateUserProfileAction(
        null,
        buildUpdateProfileFormData({ email: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('email');
    });

    test('Should fail when email is malformed', async () => {
      setupAuthenticatedSession();

      const result = await updateUserProfileAction(
        null,
        buildUpdateProfileFormData({ email: 'not-an-email' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('email');
    });

    test('Should fail when username is too short', async () => {
      setupAuthenticatedSession();

      const result = await updateUserProfileAction(
        null,
        buildUpdateProfileFormData({ username: 'ab' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('username');
    });

    test('Should fail when username is too long', async () => {
      setupAuthenticatedSession();

      const result = await updateUserProfileAction(
        null,
        buildUpdateProfileFormData({ username: 'a'.repeat(21) })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('username');
    });

    test('Should fail when password is missing', async () => {
      setupAuthenticatedSession();

      const result = await updateUserProfileAction(
        null,
        buildUpdateProfileFormData({ password: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('password');
    });

    test('Should preserve email and username values on validation failure', async () => {
      setupAuthenticatedSession();

      const result = await updateUserProfileAction(
        null,
        buildUpdateProfileFormData({ email: 'bad' })
      );

      expect(result?.values).toEqual({ email: 'bad', username: VALID_USERNAME });
    });

    test('Should not call updateUserProfile when validation fails', async () => {
      setupAuthenticatedSession();

      await updateUserProfileAction(null, buildUpdateProfileFormData({ email: '' }));

      expect(updateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call updateUserProfile with email, username and password', async () => {
      setupAuthenticatedSession();

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(updateUserProfile).toHaveBeenCalledWith({
        email: VALID_EMAIL,
        username: VALID_USERNAME,
        password: VALID_CURRENT_PASSWORD,
      });
    });

    test('Should normalize the email to lowercase before calling updateUserProfile', async () => {
      setupAuthenticatedSession();

      await expect(
        updateUserProfileAction(
          null,
          buildUpdateProfileFormData({ email: 'USER@EXAMPLE.COM' })
        )
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'user@example.com' })
      );
    });

    test('Should revalidate the settings page after a successful update', async () => {
      setupAuthenticatedSession();

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(revalidatePath).toHaveBeenCalledWith(expect.stringContaining('settings'));
    });

    test('Should redirect to settings after a successful update', async () => {
      setupAuthenticatedSession();

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('settings'));
    });
  });

  describe('updateUserProfile errors', () => {
    test('Should return the error message when password is incorrect', async () => {
      setupAuthenticatedSession();
      vi.mocked(updateUserProfile).mockRejectedValue(new Error('Incorrect password'));

      const result = await updateUserProfileAction(null, buildUpdateProfileFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Incorrect password');
    });

    test('Should return the error message when email is already in use', async () => {
      setupAuthenticatedSession();
      vi.mocked(updateUserProfile).mockRejectedValue(new Error('Email already in use'));

      const result = await updateUserProfileAction(null, buildUpdateProfileFormData());

      expect(result?.message).toBe('Email already in use');
    });

    test('Should return the error message when username is already in use', async () => {
      setupAuthenticatedSession();
      vi.mocked(updateUserProfile).mockRejectedValue(
        new Error('Username already in use')
      );

      const result = await updateUserProfileAction(null, buildUpdateProfileFormData());

      expect(result?.message).toBe('Username already in use');
    });

    test('Should include the error message in errors.general when updateUserProfile throws', async () => {
      setupAuthenticatedSession();
      vi.mocked(updateUserProfile).mockRejectedValue(new Error('Incorrect password'));

      const result = await updateUserProfileAction(null, buildUpdateProfileFormData());

      expect(result?.errors?.general).toContain('Incorrect password');
    });

    test('Should return a generic message when the thrown value is not an Error instance', async () => {
      setupAuthenticatedSession();
      vi.mocked(updateUserProfile).mockRejectedValue('string error');

      const result = await updateUserProfileAction(null, buildUpdateProfileFormData());

      expect(result?.message).toBe('Failed to update profile. Please try again');
    });

    test('Should preserve email and username when updateUserProfile throws', async () => {
      setupAuthenticatedSession();
      vi.mocked(updateUserProfile).mockRejectedValue(new Error('Incorrect password'));

      const result = await updateUserProfileAction(null, buildUpdateProfileFormData());

      expect(result?.values).toEqual({ email: VALID_EMAIL, username: VALID_USERNAME });
    });

    test('Should rethrow Next.js control flow errors', async () => {
      setupAuthenticatedSession();
      const nextError = Object.assign(new Error('NEXT_REDIRECT'), {
        digest: 'NEXT_REDIRECT',
      });
      vi.mocked(updateUserProfile).mockRejectedValue(nextError);

      await expect(
        updateUserProfileAction(null, buildUpdateProfileFormData())
      ).rejects.toThrow('NEXT_REDIRECT');
    });
  });
});
