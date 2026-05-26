import { beforeEach, describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { uploadProductAction } from '@/features/products/upload/actions';
import { getSession } from '@/infrastructure/auth/session';
import { createProduct } from '@/features/products/upload/api';
import { uploadImgInSupabaseBucket } from '@/infrastructure/db/supabase/upload-image';
import { routes } from '@/config/routes';

import {
  SUPABASE_PUBLIC_URL,
  VALID_IMAGE_URL,
  VALID_USER_ID,
  buildFileImageFormData,
  buildInvalidImageModeFormData,
  buildUrlImageFormData,
  makeEmptyFile,
  makeNonImageFile,
  makeProductDTO,
  makeSession,
} from './__fixtures__/products.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/products/upload/api', () => ({
  createProduct: vi.fn(),
}));

vi.mock('@/infrastructure/db/supabase/upload-image', () => ({
  uploadImgInSupabaseBucket: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

const setupAuthenticatedSession = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());
};

const setupSuccessfulUpload = () => {
  setupAuthenticatedSession();
  vi.mocked(uploadImgInSupabaseBucket).mockResolvedValue(SUPABASE_PUBLIC_URL);
  vi.mocked(createProduct).mockResolvedValue(makeProductDTO());
};

describe('uploadProductAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await uploadProductAction(null, buildUrlImageFormData());

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should redirect to login when session has no userId', async () => {
      // getSession could return an object without userId if the token is malformed
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await uploadProductAction(null, buildUrlImageFormData());

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call createProduct when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await uploadProductAction(null, buildUrlImageFormData());

      expect(createProduct).not.toHaveBeenCalled();
    });
  });

  describe('Schema validation', () => {
    test('Should fail when title is missing', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildUrlImageFormData({ title: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('title');
      expect(createProduct).not.toHaveBeenCalled();
    });

    test('Should fail when description is missing', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildUrlImageFormData({ description: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('description');
    });

    test('Should fail when price is not a number', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildUrlImageFormData({ price: 'is-not-a-number' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('price');
    });

    test('Should fail when categoryId is missing', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildUrlImageFormData({ categoryId: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.errors).toHaveProperty('categoryId');
    });

    test('Should preserve form values on validation failure', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildUrlImageFormData({ title: '' })
      );

      expect(result?.values).toMatchObject({
        description: expect.any(String),
        price: expect.any(Number),
        location: expect.any(String),
        categoryId: expect.any(String),
      });
    });

    test('Should not call uploadImgInSupabaseBucket when validation fails', async () => {
      setupAuthenticatedSession();

      await uploadProductAction(null, buildUrlImageFormData({ title: '' }));

      expect(uploadImgInSupabaseBucket).not.toHaveBeenCalled();
    });
  });

  describe('Image mode: url', () => {
    test('Should fail when imageUrl is empty', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildUrlImageFormData({ imageUrl: '' })
      );

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Image URL is required');
    });

    test('Should not call createProduct when imageUrl is empty', async () => {
      setupAuthenticatedSession();

      await uploadProductAction(null, buildUrlImageFormData({ imageUrl: '' }));

      expect(createProduct).not.toHaveBeenCalled();
    });

    test('Should call createProduct with the provided URL when imageUrl is valid', async () => {
      setupAuthenticatedSession();
      vi.mocked(createProduct).mockResolvedValue(makeProductDTO());

      await uploadProductAction(null, buildUrlImageFormData());

      expect(createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ imageUrl: VALID_IMAGE_URL })
      );
    });
  });

  describe('Image mode: file', () => {
    test('Should fail when no file is provided', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildFileImageFormData({ file: makeEmptyFile() })
      );

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Image file is required');
    });

    test('Should fail when the file is not an image', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(
        null,
        buildFileImageFormData({ file: makeNonImageFile() })
      );

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('File must be an image');
    });

    test('Should call uploadImgInSupabaseBucket with the file', async () => {
      setupAuthenticatedSession();
      vi.mocked(uploadImgInSupabaseBucket).mockResolvedValue(SUPABASE_PUBLIC_URL);
      vi.mocked(createProduct).mockResolvedValue(makeProductDTO());

      await uploadProductAction(null, buildFileImageFormData());

      expect(uploadImgInSupabaseBucket).toHaveBeenCalledWith(expect.any(File));
    });

    test('Should call createProduct with the URL returned by Supabase', async () => {
      setupAuthenticatedSession();
      vi.mocked(uploadImgInSupabaseBucket).mockResolvedValue(SUPABASE_PUBLIC_URL);
      vi.mocked(createProduct).mockResolvedValue(makeProductDTO());

      await uploadProductAction(null, buildFileImageFormData());

      expect(createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ imageUrl: SUPABASE_PUBLIC_URL })
      );
    });

    test('Should fail when uploadImgInSupabaseBucket throws', async () => {
      setupAuthenticatedSession();
      vi.mocked(uploadImgInSupabaseBucket).mockRejectedValue(new Error('Supabase error'));

      const result = await uploadProductAction(null, buildFileImageFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Failed to upload the product. Please try again');
    });
  });

  describe('Image mode: invalid', () => {
    test('Should fail when imageMode is not recognized', async () => {
      setupAuthenticatedSession();

      const result = await uploadProductAction(null, buildInvalidImageModeFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Invalid image mode');
    });
  });

  describe('Success', () => {
    test('Should call createProduct with all parsed data and the userId from session', async () => {
      setupSuccessfulUpload();

      await uploadProductAction(null, buildFileImageFormData());

      expect(createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ userId: VALID_USER_ID })
      );
    });

    test('Should revalidate the home path after a successful upload', async () => {
      setupSuccessfulUpload();

      await uploadProductAction(null, buildFileImageFormData());

      expect(revalidatePath).toHaveBeenCalledWith(routes.home);
    });

    test('Should redirect to home after a successful upload', async () => {
      setupSuccessfulUpload();

      await uploadProductAction(null, buildFileImageFormData());

      expect(redirect).toHaveBeenCalledWith(routes.home);
    });
  });

  describe('createProduct errors', () => {
    test('Should return failure when createProduct throws a known error', async () => {
      setupAuthenticatedSession();
      vi.mocked(uploadImgInSupabaseBucket).mockResolvedValue(SUPABASE_PUBLIC_URL);
      vi.mocked(createProduct).mockRejectedValue(new Error('DB connection lost'));

      const result = await uploadProductAction(null, buildFileImageFormData());

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Failed to upload the product. Please try again');
    });
  });
});
