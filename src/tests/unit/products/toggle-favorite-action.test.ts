import { beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { toggleFavoriteAction } from '@/features/products/_shared/actions';
import { getSession } from '@/infrastructure/auth/session';
import { verifyProductOwnership, toggleFavorite } from '@/features/products/_shared/api';

import {
  VALID_USER_ID,
  VALID_PRODUCT_ID,
  makeSession,
} from './__fixtures__/products.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/products/_shared/api', () => ({
  verifyProductOwnership: vi.fn(),
  toggleFavorite: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const setupNonOwnerSession = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());

  vi.mocked(verifyProductOwnership).mockResolvedValue(false);
};

describe('toggleFavoriteAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(toggleFavoriteAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(toggleFavoriteAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call verifyProductOwnership when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(toggleFavoriteAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(verifyProductOwnership).not.toHaveBeenCalled();
    });
  });

  describe('Ownership guard', () => {
    test('Should throw when the user tries to favorite their own product', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(verifyProductOwnership).mockResolvedValue(true);

      await expect(toggleFavoriteAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'Cannot favorite your own product'
      );
    });

    test('Should not call toggleFavorite when user owns the product', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(verifyProductOwnership).mockResolvedValue(true);

      await toggleFavoriteAction(VALID_PRODUCT_ID).catch(() => {});

      expect(toggleFavorite).not.toHaveBeenCalled();
    });

    test('Should call verifyProductOwnership with the productId and the session userId', async () => {
      setupNonOwnerSession();
      vi.mocked(toggleFavorite).mockResolvedValue({ liked: true });

      await toggleFavoriteAction(VALID_PRODUCT_ID);

      expect(verifyProductOwnership).toHaveBeenCalledWith(
        VALID_PRODUCT_ID,
        VALID_USER_ID
      );
    });
  });

  describe('Toggle behavior', () => {
    test('Should return liked: true when the product was not previously liked', async () => {
      setupNonOwnerSession();
      vi.mocked(toggleFavorite).mockResolvedValue({ liked: true });

      const result = await toggleFavoriteAction(VALID_PRODUCT_ID);

      expect(result).toEqual({ liked: true });
    });

    test('Should return liked: false when the product was previously liked', async () => {
      setupNonOwnerSession();
      vi.mocked(toggleFavorite).mockResolvedValue({ liked: false });

      const result = await toggleFavoriteAction(VALID_PRODUCT_ID);

      expect(result).toEqual({ liked: false });
    });

    test('Should call toggleFavorite with the session userId and the productId', async () => {
      setupNonOwnerSession();
      vi.mocked(toggleFavorite).mockResolvedValue({ liked: true });

      await toggleFavoriteAction(VALID_PRODUCT_ID);

      expect(toggleFavorite).toHaveBeenCalledWith(VALID_USER_ID, VALID_PRODUCT_ID);
    });
  });

  describe('Revalidation', () => {
    test('Should revalidate the product detail page after toggling', async () => {
      setupNonOwnerSession();
      vi.mocked(toggleFavorite).mockResolvedValue({ liked: true });

      await toggleFavoriteAction(VALID_PRODUCT_ID);

      expect(revalidatePath).toHaveBeenCalledWith(
        expect.stringContaining(VALID_PRODUCT_ID)
      );
    });

    test('Should revalidate the home page after toggling', async () => {
      setupNonOwnerSession();
      vi.mocked(toggleFavorite).mockResolvedValue({ liked: true });

      await toggleFavoriteAction(VALID_PRODUCT_ID);

      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    test('Should not revalidate when the user owns the product', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(verifyProductOwnership).mockResolvedValue(true);

      await toggleFavoriteAction(VALID_PRODUCT_ID).catch(() => {});

      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});
