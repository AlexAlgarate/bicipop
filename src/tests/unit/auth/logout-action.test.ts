import { describe, expect, test, vi } from 'vitest';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { logout } from '@/features/auth/actions';
import { deleteSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';

vi.mock('@/infrastructure/auth/session', () => ({
  deleteSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

describe('Logout action', () => {
  test('Should delete session, revalidates and redirects', async () => {
    await expect(logout()).rejects.toThrow('NEXT_REDIRECT');

    expect(deleteSession).toHaveBeenCalledTimes(1);

    expect(revalidatePath).toHaveBeenCalledWith(routes.home);

    expect(redirect).toHaveBeenCalledWith(routes.home);
  });
});
