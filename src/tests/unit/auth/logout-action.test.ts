import { describe, expect, test, vi } from 'vitest';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { logout } from '@/features/auth/actions';
import { getSession, deleteSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';

const VALID_USER_ID = 'user-123';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock('@/infrastructure/db/prisma/client', () => ({
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

const setupAuthenticatedSession = () => {
  vi.mocked(getSession).mockResolvedValue({ userId: VALID_USER_ID });
};

describe('Logout action', () => {
  test('Should increment tokenVersion, delete session, revalidate and redirect', async () => {
    setupAuthenticatedSession();

    await expect(logout()).rejects.toThrow('NEXT_REDIRECT');

    expect(getSession).toHaveBeenCalledTimes(1);

    const { default: prisma } = await import('@/infrastructure/db/prisma/client');
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: VALID_USER_ID },
      data: { tokenVersion: { increment: 1 } },
    });

    expect(deleteSession).toHaveBeenCalledTimes(1);

    expect(revalidatePath).toHaveBeenCalledWith(routes.home);

    expect(redirect).toHaveBeenCalledWith(routes.home);
  });

  test('Should still delete session even when there is no active session', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(logout()).rejects.toThrow('NEXT_REDIRECT');

    expect(deleteSession).toHaveBeenCalled();
  });
});
