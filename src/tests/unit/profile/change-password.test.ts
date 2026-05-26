import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { changePasswordAction } from '@/features/profile/settings/change-password/actions';
import { getSession } from '@/infrastructure/auth/session';
import { changeUserPassword } from '@/features/profile/settings/change-password/api';

import {
  VALID_CURRENT_PASSWORD,
  VALID_NEW_PASSWORD,
  makeSession,
  buildChangePasswordFormData,
} from './__fixtures__/profile.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/profile/settings/change-password/api', () => ({
  changeUserPassword: vi.fn(),
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
};

describe('changePasswordAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(
        changePasswordAction(null, buildChangePasswordFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(
        changePasswordAction(null, buildChangePasswordFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call changeUserPassword when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(
        changePasswordAction(null, buildChangePasswordFormData())
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(changeUserPassword).not.toHaveBeenCalled();
    });
  });

  describe('Schema validation', () => {
    test('Should fail when currentPassword is missing', async () => {
      setupAuthenticatedSession();
      vi.spyOn(Date, 'now').mockReturnValue(123456789);

      const result = await changePasswordAction(
        null,
        buildChangePasswordFormData({ currentPassword: '' })
      );

      expect(result).toEqual({
        errors: {
          currentPassword: ['Current password is required'],
        },

        message: 'Something was wrong. Check fields',
        requestId: 123456789,
        success: false,
        values: {
          currentPassword: '',
          newPassword: 'NewPassword1.',
          confirmPassword: 'NewPassword1.',
        },
      });
    });

    test('Should fail when newPassword is missing', async () => {
      setupAuthenticatedSession();
      vi.spyOn(Date, 'now').mockReturnValue(123456789);
      const result = await changePasswordAction(
        null,
        buildChangePasswordFormData({ newPassword: '' })
      );
      expect(result).toEqual({
        errors: {
          newPassword: ['Password must be at least 3 characters'],
          confirmPassword: ['Please confirm your password'],
        },

        message: 'Something was wrong. Check fields',
        requestId: 123456789,
        success: false,
        values: {
          currentPassword: 'CurrentPassword1.',
          newPassword: '',
          confirmPassword: '',
        },
      });
    });
  });

  test('Should fail when confirmPassword does not match newPassword', async () => {
    setupAuthenticatedSession();
    vi.spyOn(Date, 'now').mockReturnValue(123456789);

    const result = await changePasswordAction(
      null,
      buildChangePasswordFormData({ confirmPassword: 'DifferentPassword1.' })
    );
    expect(result).toEqual({
      errors: {
        confirmPassword: ['Passwords do not match'],
      },

      message: 'Something was wrong. Check fields',
      requestId: 123456789,
      success: false,
      values: {
        currentPassword: 'CurrentPassword1.',
        newPassword: 'NewPassword1.',
        confirmPassword: 'DifferentPassword1.',
      },
    });
  });

  test('Should preserve raw values on validation failure', async () => {
    setupAuthenticatedSession();

    const result = await changePasswordAction(
      null,
      buildChangePasswordFormData({ currentPassword: '' })
    );

    expect(result?.values).toMatchObject({
      currentPassword: '',
      newPassword: VALID_NEW_PASSWORD,
    });
  });

  test('Should not call changeUserPassword when validation fails', async () => {
    setupAuthenticatedSession();

    await changePasswordAction(null, buildChangePasswordFormData({ newPassword: '' }));

    expect(changeUserPassword).not.toHaveBeenCalled();
  });
});

describe('Success', () => {
  test('Should call changeUserPassword with currentPassword and newPassword', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockResolvedValue(undefined);

    await changePasswordAction(null, buildChangePasswordFormData());

    expect(changeUserPassword).toHaveBeenCalledWith(
      VALID_CURRENT_PASSWORD,
      VALID_NEW_PASSWORD
    );
  });

  test('Should revalidate the settings page after a successful password change', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockResolvedValue(undefined);

    await changePasswordAction(null, buildChangePasswordFormData());

    expect(revalidatePath).toHaveBeenCalledWith(expect.stringContaining('settings'));
  });

  test('Should redirect to settings after a successful password change', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockResolvedValue(undefined);

    await changePasswordAction(null, buildChangePasswordFormData());

    expect(redirect).toHaveBeenCalledWith(expect.stringContaining('settings'));
  });
});

describe('changeUserPassword errors', () => {
  test('Should return failure when current password is incorrect', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockRejectedValue(
      new Error('Current password is incorrect')
    );

    const result = await changePasswordAction(null, buildChangePasswordFormData());

    expect(result?.success).toBe(false);
    expect(result?.message).toBe('Failed to change password. Please try again');
  });

  test('Should include the error message in errors.general when changeUserPassword throws', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockRejectedValue(
      new Error('Current password is incorrect')
    );

    const result = await changePasswordAction(null, buildChangePasswordFormData());

    expect(result?.errors?.general).toContain('Current password is incorrect');
  });

  test('Should not include errors.general when the thrown value is not an Error instance', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockRejectedValue('string error');

    const result = await changePasswordAction(null, buildChangePasswordFormData());

    expect(result?.errors).toBeUndefined();
  });

  test('Should preserve raw values when changeUserPassword throws', async () => {
    setupAuthenticatedSession();
    vi.mocked(changeUserPassword).mockRejectedValue(
      new Error('Current password is incorrect')
    );

    const result = await changePasswordAction(null, buildChangePasswordFormData());

    expect(result?.values).toMatchObject({
      currentPassword: VALID_CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
    });
  });

  test('Should rethrow Next.js control flow errors', async () => {
    setupAuthenticatedSession();
    const nextError = Object.assign(new Error('NEXT_REDIRECT'), {
      digest: 'NEXT_REDIRECT',
    });
    vi.mocked(changeUserPassword).mockRejectedValue(nextError);

    await expect(
      changePasswordAction(null, buildChangePasswordFormData())
    ).rejects.toThrow('NEXT_REDIRECT');
  });
});
