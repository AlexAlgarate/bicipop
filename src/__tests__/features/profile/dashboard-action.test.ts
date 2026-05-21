import { beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  deleteProductAction,
  updateProductStatusAction,
} from '@/features/profile/dashboard/actions';
import { getSession } from '@/infrastructure/auth/session';
import { getProductById } from '@/features/items/_shared/api';
import { deleteProduct, updateProductStatus } from '@/features/profile/dashboard/api';
import type { ProductStatus } from '@/generated/client/enums';
import { routes } from '@/config/routes';

import {
  VALID_USER_ID,
  VALID_PRODUCT_ID,
  makeSession,
  makeProductWithUserContext,
} from './__fixtures__/profile.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/items/_shared/api', () => ({
  getProductById: vi.fn(),
}));

vi.mock('@/features/profile/dashboard/api', () => ({
  deleteProduct: vi.fn(),
  updateProductStatus: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const setupAuthenticatedWithProduct = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());
  vi.mocked(getProductById).mockResolvedValue(makeProductWithUserContext());
};

const ACTIVE_STATUS = 'ACTIVE' as ProductStatus;
const SOLD_STATUS = 'SOLD' as ProductStatus;

describe('deleteProductAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteProductAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(deleteProductAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call getProductById when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteProductAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(getProductById).not.toHaveBeenCalled();
    });
  });

  describe('Product existence', () => {
    test('Should redirect to home and not call deleteProduct when product does not exist', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(null);

      await expect(deleteProductAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(routes.profile.dashboard);
    });

    test('Should not call deleteProduct when product does not exist', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(null);

      await expect(deleteProductAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(deleteProduct).not.toHaveBeenCalled();
    });

    test('Should call getProductById with the productId and session userId', async () => {
      setupAuthenticatedWithProduct();

      await deleteProductAction(VALID_PRODUCT_ID);

      expect(getProductById).toHaveBeenCalledWith(VALID_PRODUCT_ID, VALID_USER_ID);
    });
  });

  describe('Authorization', () => {
    test('Should redirect to dashboard and not call deleteProduct when product exists but user is not the owner', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: false })
      );

      await expect(deleteProductAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(routes.profile.dashboard);
      expect(deleteProduct).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call deleteProduct with the productId', async () => {
      setupAuthenticatedWithProduct();

      await deleteProductAction(VALID_PRODUCT_ID);

      expect(deleteProduct).toHaveBeenCalledWith(VALID_PRODUCT_ID);
    });

    test('Should revalidate home layout and profile dashboard after deletion', async () => {
      setupAuthenticatedWithProduct();

      await deleteProductAction(VALID_PRODUCT_ID);

      expect(revalidatePath).toHaveBeenCalledWith(routes.home, 'layout');
      expect(revalidatePath).toHaveBeenCalledWith(routes.profile.dashboard, 'page');
    });
  });
});

describe('updateProductStatusAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(
        updateProductStatusAction(VALID_PRODUCT_ID, ACTIVE_STATUS)
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(
        updateProductStatusAction(VALID_PRODUCT_ID, ACTIVE_STATUS)
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });
  });

  describe('Authorization', () => {
    test('Should return unauthorized error and not call updateProductStatus when product does not exist', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(null);

      const result = await updateProductStatusAction(VALID_PRODUCT_ID, ACTIVE_STATUS);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Product does not exist or you are not authorized to update this product'
      );
      expect(updateProductStatus).not.toHaveBeenCalled();
    });

    test('Should return unauthorized error and not call updateProductStatus when product exists but user is not the owner', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: false })
      );

      const result = await updateProductStatusAction(VALID_PRODUCT_ID, ACTIVE_STATUS);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Product does not exist or you are not authorized to update this product'
      );
      expect(updateProductStatus).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should return success when status is updated', async () => {
      setupAuthenticatedWithProduct();

      const result = await updateProductStatusAction(VALID_PRODUCT_ID, SOLD_STATUS);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Product status updated successfully');
      expect(updateProductStatus).toHaveBeenCalledWith(VALID_PRODUCT_ID, SOLD_STATUS);
    });

    test('Should revalidate home layout and progile page after status update', async () => {
      setupAuthenticatedWithProduct();

      await updateProductStatusAction(VALID_PRODUCT_ID, SOLD_STATUS);

      expect(revalidatePath).toHaveBeenCalledWith(routes.home, 'layout');
      expect(revalidatePath).toHaveBeenCalledWith(routes.profile.dashboard, 'page');
    });
  });

  describe('updateProductStatus errors', () => {
    test('Should return failure when updateProductStatus throws', async () => {
      setupAuthenticatedWithProduct();
      vi.mocked(updateProductStatus).mockRejectedValue(new Error('DB error'));

      const result = await updateProductStatusAction(VALID_PRODUCT_ID, ACTIVE_STATUS);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to update product status. Please try again.');
    });

    test('Should not revalidate when updateProductStatus throws', async () => {
      setupAuthenticatedWithProduct();
      vi.mocked(updateProductStatus).mockRejectedValue(new Error('DB error'));

      await updateProductStatusAction(VALID_PRODUCT_ID, ACTIVE_STATUS);

      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});
