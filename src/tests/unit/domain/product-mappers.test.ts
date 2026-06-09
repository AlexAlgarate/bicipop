import { describe, expect, test } from 'vitest';

import { mapToProductDTO, mapToProductWithUserContext } from '@/domain/products/mappers';

const makePrismaProduct = (overrides?: Record<string, unknown>) => ({
  id: 'product-123',
  title: 'Bicicleta de montana',
  description: 'Bicicleta en perfecto estado con 21 velocidades',
  price: 150,
  imageUrl: 'https://example.com/bike.jpg',
  userId: 'user-456',
  categoryId: 'cat-789',
  location: 'Madrid',
  status: 'ACTIVE' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  user: { username: 'testuser' },
  category: { name: 'Bicycles', slug: 'bicycles' },
  favorites: [],
  ...overrides,
});

describe('mapToProductDTO', () => {
  test('Should map all fields from Prisma product to DTO', () => {
    const prismaProduct = makePrismaProduct();

    const result = mapToProductDTO(prismaProduct);

    expect(result).toEqual({
      id: 'product-123',
      title: 'Bicicleta de montana',
      description: 'Bicicleta en perfecto estado con 21 velocidades',
      price: 150,
      imageUrl: 'https://example.com/bike.jpg',
      userId: 'user-456',
      categoryId: 'cat-789',
      location: 'Madrid',
      status: 'ACTIVE',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      username: 'testuser',
      categorySlug: 'bicycles',
      categoryName: 'Bicycles',
    });
  });

  test('Should extract username from nested user relation', () => {
    const prismaProduct = makePrismaProduct({ user: { username: 'montanero99' } });

    const result = mapToProductDTO(prismaProduct);

    expect(result.username).toBe('montanero99');
  });

  test('Should extract category slug and name from nested category relation', () => {
    const prismaProduct = makePrismaProduct({
      category: { name: 'Electric', slug: 'electric' },
    });

    const result = mapToProductDTO(prismaProduct);

    expect(result.categorySlug).toBe('electric');
    expect(result.categoryName).toBe('Electric');
  });
});

describe('mapToProductWithUserContext', () => {
  test('Should include isOwner true when userId matches current user', () => {
    const prismaProduct = makePrismaProduct({
      userId: 'current-user',
      favorites: [],
    });

    const result = mapToProductWithUserContext(prismaProduct, 'current-user');

    expect(result.isOwner).toBe(true);
  });

  test('Should include isOwner false when userId does not match current user', () => {
    const prismaProduct = makePrismaProduct({
      userId: 'other-user',
      favorites: [],
    });

    const result = mapToProductWithUserContext(prismaProduct, 'current-user');

    expect(result.isOwner).toBe(false);
  });

  test('Should set isOwner false when currentUserId is null', () => {
    const prismaProduct = makePrismaProduct({
      userId: 'some-user',
      favorites: [],
    });

    const result = mapToProductWithUserContext(prismaProduct, null);

    expect(result.isOwner).toBe(false);
  });

  test('Should set isLiked true when favorites array is non-empty', () => {
    const prismaProduct = makePrismaProduct({
      favorites: [{ userId: 'current-user' }],
    });

    const result = mapToProductWithUserContext(prismaProduct, 'current-user');

    expect(result.isLiked).toBe(true);
  });

  test('Should set isLiked false when favorites array is empty', () => {
    const prismaProduct = makePrismaProduct({
      favorites: [],
    });

    const result = mapToProductWithUserContext(prismaProduct, 'current-user');

    expect(result.isLiked).toBe(false);
  });

  test('Should include all ProductDTO fields alongside context', () => {
    const prismaProduct = makePrismaProduct({ favorites: [] });

    const result = mapToProductWithUserContext(prismaProduct, null);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('price');
    expect(result).toHaveProperty('imageUrl');
    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('categoryId');
    expect(result).toHaveProperty('location');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('categorySlug');
    expect(result).toHaveProperty('categoryName');
    expect(result).toHaveProperty('isOwner');
    expect(result).toHaveProperty('isLiked');
  });
});
