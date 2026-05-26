import { beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { deleteUserAction } from '@/features/profile/settings/delete/actions';
import { getSession, deleteSession } from '@/infrastructure/auth/session';
import { deleteUserAccount } from '@/features/profile/settings/delete/api';

import {
  VALID_CURRENT_PASSWORD,
  makeSession,
  buildDeleteUserFormData,
} from './__fixtures__/profile.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock('@/features/profile/settings/delete/api', () => ({
  deleteUserAccount: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const setupAuthenticatedSession = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());
  vi.mocked(deleteSession).mockResolvedValue(undefined);
};

describe('deleteUserAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call deleteUserAccount when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(deleteUserAccount).not.toHaveBeenCalled();
    });
  });

  describe('Schema validation', () => {
    test('Should fail when password is missing', async () => {
      setupAuthenticatedSession();

      const result = await deleteUserAction(null, buildDeleteUserFormData(''));

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('password');
    });

    test('Should not call deleteUserAccount when validation fails', async () => {
      setupAuthenticatedSession();

      await deleteUserAction(null, buildDeleteUserFormData(''));

      expect(deleteUserAccount).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call deleteUserAccount with the provided password', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockResolvedValue(undefined);

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(deleteUserAccount).toHaveBeenCalledWith(VALID_CURRENT_PASSWORD);
    });

    test('Should delete the session cookie after a successful account deletion', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockResolvedValue(undefined);

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(deleteSession).toHaveBeenCalled();
    });

    test('Should revalidate the home page after a successful account deletion', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockResolvedValue(undefined);

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    test('Should redirect to home after a successful account deletion', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockResolvedValue(undefined);

      await expect(deleteUserAction(null, buildDeleteUserFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('deleteUserAccount errors', () => {
    test('Should return failure when password is incorrect', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockRejectedValue(new Error('Incorrect password'));

      const result = await deleteUserAction(null, buildDeleteUserFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Incorrect password');
    });

    test('Should include the error message in errors.general when deleteUserAccount throws', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockRejectedValue(new Error('Incorrect password'));

      const result = await deleteUserAction(null, buildDeleteUserFormData());

      expect(result?.errors?.general).toContain('Incorrect password');
    });

    test('Should return a generic message when the thrown value is not an Error instance', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockRejectedValue('string error');

      const result = await deleteUserAction(null, buildDeleteUserFormData());

      expect(result?.message).toBe('Failed to delete account');
    });

    test('Should not delete the session cookie when deleteUserAccount throws', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockRejectedValue(new Error('Incorrect password'));

      await deleteUserAction(null, buildDeleteUserFormData());

      expect(deleteSession).not.toHaveBeenCalled();
    });

    test('Should not redirect to home when deleteUserAccount throws', async () => {
      setupAuthenticatedSession();
      vi.mocked(deleteUserAccount).mockRejectedValue(new Error('Incorrect password'));

      await deleteUserAction(null, buildDeleteUserFormData());

      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
