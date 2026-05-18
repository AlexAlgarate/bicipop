import { describe, expect, test, vi, beforeEach } from 'vitest';

vi.mock('@/utils/constants', () => ({
  PRODUCTS_PER_PAGE: 12,
}));

describe('validatePagination', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('Should throw ZodError when page is NaN', async () => {
    const { validatePagination } =
      await import('@/features/items/_shared/utils/validate-pagination');

    expect(() => validatePagination(NaN, 12)).toThrow();
  });

  test('Should throw ZodError when pageSize is NaN', async () => {
    const { validatePagination } =
      await import('@/features/items/_shared/utils/validate-pagination');

    expect(() => validatePagination(1, NaN)).toThrow();
  });

  test('Should throw for page less than 1', async () => {
    const { validatePagination } =
      await import('@/features/items/_shared/utils/validate-pagination');

    expect(() => validatePagination(0, 12)).toThrow();
    expect(() => validatePagination(-1, 12)).toThrow();
  });

  test('Should throw for pageSize less than 1', async () => {
    const { validatePagination } =
      await import('@/features/items/_shared/utils/validate-pagination');

    expect(() => validatePagination(1, 0)).toThrow();
    expect(() => validatePagination(1, -5)).toThrow();
  });

  test('Should return the provided page and pageSize when valid', async () => {
    const { validatePagination } =
      await import('@/features/items/_shared/utils/validate-pagination');

    const result = validatePagination(3, 12);

    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(12);
  });

  test('Should accept custom pageSize values', async () => {
    const { validatePagination } =
      await import('@/features/items/_shared/utils/validate-pagination');

    const result = validatePagination(2, 24);

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(24);
  });
});
