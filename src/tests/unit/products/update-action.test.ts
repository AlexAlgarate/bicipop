import { beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/infrastructure/auth/session';
import { getProductById } from '@/features/products/_shared/api';
import { updateProduct } from '@/features/products/edit/api';
import { updateProductAction } from '@/features/products/edit/actions';
import { routes } from '@/config/routes';

import {
  VALID_USER_ID,
  VALID_PRODUCT_ID,
  makeSession,
  makeProductDTO,
  makeProductWithUserContext,
  buildUpdateFormData,
} from './__fixtures__/products.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/products/_shared/api', () => ({
  getProductById: vi.fn(),
}));

vi.mock('@/features/products/edit/api', () => ({
  updateProduct: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const setupAuthorizedEdit = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());

  vi.mocked(getProductById).mockResolvedValue(
    makeProductWithUserContext({ isOwner: true })
  );
  vi.mocked(updateProduct).mockResolvedValue(makeProductDTO());
};

describe('updateProductAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(updateProductAction(null, buildUpdateFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await expect(updateProductAction(null, buildUpdateFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call getProductById when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(updateProductAction(null, buildUpdateFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(getProductById).not.toHaveBeenCalled();
    });
  });

  describe('Ownership', () => {
    test('Should return unauthorized error when product does not exist', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(null);

      const result = await updateProductAction(null, buildUpdateFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('You are not authorized to edit this product');
    });

    test('Should return unauthorized error when user is not the owner', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: false })
      );

      const result = await updateProductAction(null, buildUpdateFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('You are not authorized to edit this product');
    });

    test('Should call getProductById with the productId from formData and the session userId', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(null);

      await updateProductAction(null, buildUpdateFormData());

      expect(getProductById).toHaveBeenCalledWith(VALID_PRODUCT_ID, VALID_USER_ID);
    });

    test('Should not call updateProduct when user is not the owner', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: false })
      );

      await updateProductAction(null, buildUpdateFormData());

      expect(updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('Schema validation', () => {
    test('Should fail when title is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );

      const result = await updateProductAction(null, buildUpdateFormData({ title: '' }));

      expect(result?.success).toBe(false);
      expect(result?.message).toContain('errors in the form');
      expect(result?.errors).toHaveProperty('title');
    });

    test('Should fail when description is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );

      const result = await updateProductAction(
        null,
        buildUpdateFormData({ description: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('description');
    });

    test('Should fail when price is not a valid number', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );

      const result = await updateProductAction(
        null,
        buildUpdateFormData({ price: 'not-a-number' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('price');
    });

    test('Should not call updateProduct when validation fails', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );

      await updateProductAction(null, buildUpdateFormData({ title: '' }));

      expect(updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call updateProduct with all form values', async () => {
      setupAuthorizedEdit();

      await updateProductAction(null, buildUpdateFormData());

      expect(updateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: VALID_PRODUCT_ID,
          title: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          location: expect.any(String),
          imageUrl: expect.any(String),
          categoryId: expect.any(String),
          status: expect.any(String),
        })
      );
    });

    test('Should revalidate home layout after a successful update', async () => {
      setupAuthorizedEdit();

      await updateProductAction(null, buildUpdateFormData());

      expect(revalidatePath).toHaveBeenCalledWith(routes.home, 'layout');
    });

    test('Should revalidate profile dashboard page after a successful update', async () => {
      setupAuthorizedEdit();

      await updateProductAction(null, buildUpdateFormData());

      expect(revalidatePath).toHaveBeenCalledWith(
        expect.stringContaining('dashboard'),
        'page'
      );
    });

    test('Should revalidate the product detail page after a successful update', async () => {
      setupAuthorizedEdit();

      await updateProductAction(null, buildUpdateFormData());

      expect(revalidatePath).toHaveBeenCalledWith(
        expect.stringContaining(VALID_PRODUCT_ID),
        'page'
      );
    });

    test('Should redirect to the profile dashboard after a successful update', async () => {
      setupAuthorizedEdit();

      await updateProductAction(null, buildUpdateFormData());

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('dashboard'));
    });
  });

  describe('updateProduct errors', () => {
    test('Should return failure when updateProduct throws a known error', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );
      vi.mocked(updateProduct).mockRejectedValue(new Error('DB connection lost'));

      const result = await updateProductAction(null, buildUpdateFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Failed to update product. Please try again');
    });

    test('Should include the error message in errors.general when updateProduct throws', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );
      vi.mocked(updateProduct).mockRejectedValue(new Error('Unique constraint failed'));

      const result = await updateProductAction(null, buildUpdateFormData());

      expect(result?.errors?.general).toContain('Unique constraint failed');
    });

    test('Should not include errors.general when the thrown value is not an Error instance', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );
      vi.mocked(updateProduct).mockRejectedValue('string error');

      const result = await updateProductAction(null, buildUpdateFormData());

      expect(result?.errors).toBeUndefined();
    });

    test('Should rethrow Next.js control flow errors (redirect/notFound)', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(getProductById).mockResolvedValue(
        makeProductWithUserContext({ isOwner: true })
      );
      const nextError = Object.assign(new Error('NEXT_REDIRECT'), {
        digest: 'NEXT_REDIRECT',
      });
      vi.mocked(updateProduct).mockRejectedValue(nextError);

      await expect(updateProductAction(null, buildUpdateFormData())).rejects.toThrow(
        'NEXT_REDIRECT'
      );
    });
  });
});
