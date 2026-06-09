import { describe, expect, test } from 'vitest';

import { imageUrlSchema } from '@/features/products/upload/validation';
import { updateProductSchema } from '@/features/products/edit/validation';

describe('imageUrlSchema (upload)', () => {
  describe('Valid URLs', () => {
    test('Should accept a standard HTTPS URL', () => {
      const result = imageUrlSchema.safeParse('https://example.com/image.jpg');
      expect(result.success).toBe(true);
    });

    test('Should accept HTTPS URL with query parameters', () => {
      const result = imageUrlSchema.safeParse(
        'https://images.unsplash.com/photo-1234567890?w=400&h=300&fit=crop'
      );
      expect(result.success).toBe(true);
    });

    test('Should accept HTTPS URL with a path', () => {
      const result = imageUrlSchema.safeParse(
        'https://storage.googleapis.com/bucket/images/bike.png'
      );
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid URLs', () => {
    test('Should reject an empty string', () => {
      const result = imageUrlSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    test('Should reject a random string', () => {
      const result = imageUrlSchema.safeParse('not-a-url');
      expect(result.success).toBe(false);
    });

    test('Should reject a javascript: URL', () => {
      const result = imageUrlSchema.safeParse("javascript:alert('xss')");
      expect(result.success).toBe(false);
    });

    test('Should reject a data: URL', () => {
      const result = imageUrlSchema.safeParse('data:image/svg+xml,<svg></svg>');
      expect(result.success).toBe(false);
    });

    test('Should reject an FTP URL', () => {
      const result = imageUrlSchema.safeParse('ftp://files.example.com/image.jpg');
      expect(result.success).toBe(false);
    });
  });

  describe('Protocol enforcement', () => {
    test('Should reject an HTTP URL (not HTTPS)', () => {
      const result = imageUrlSchema.safeParse('http://example.com/image.jpg');
      expect(result.success).toBe(false);
    });
  });
});

describe('updateProductSchema imageUrl (edit)', () => {
  describe('Valid values', () => {
    const validBase = {
      productId: 'product-1',
      title: 'Bicicleta de montana',
      description: 'Bicicleta en perfecto estado con 21 velocidades',
      price: 150,
      categoryId: 'cat-1',
      location: 'Madrid',
      status: 'ACTIVE' as const,
    };

    test('Should accept a valid HTTPS URL', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: 'https://example.com/image.jpg',
      });
      expect(result.success).toBe(true);
    });

    test('Should accept empty string (no image change)', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: '',
      });
      expect(result.success).toBe(true);
    });

    test('Should accept undefined (no image change)', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: undefined,
      });
      expect(result.success).toBe(true);
    });

    test('Should accept when imageUrl is omitted entirely', () => {
      const { imageUrl: _, ...rest } = validBase;
      const result = updateProductSchema.safeParse(rest);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid values', () => {
    const validBase = {
      productId: 'product-1',
      title: 'Bicicleta de montana',
      description: 'Bicicleta en perfecto estado con 21 velocidades',
      price: 150,
      categoryId: 'cat-1',
      location: 'Madrid',
      status: 'ACTIVE' as const,
    };

    test('Should reject a random string', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    test('Should reject a javascript: URL', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: "javascript:alert('xss')",
      });
      expect(result.success).toBe(false);
    });

    test('Should reject a data: URL', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: 'data:image/svg+xml,<svg></svg>',
      });
      expect(result.success).toBe(false);
    });

    test('Should reject an HTTP URL', () => {
      const result = updateProductSchema.safeParse({
        ...validBase,
        imageUrl: 'http://example.com/image.jpg',
      });
      expect(result.success).toBe(false);
    });
  });
});
