import type { ProductWithUserContext } from '@/domain/products/types';
import type { ProductStatus } from '@/generated/client/enums';

export const VALID_USER_ID = 'user-123';
export const VALID_PRODUCT_ID = 'product-123';

export const VALID_CURRENT_PASSWORD = 'CurrentPassword1.';
export const VALID_NEW_PASSWORD = 'NewPassword1.';
export const VALID_EMAIL = 'user@example.com';
export const VALID_USERNAME = 'testuser';

export const makeSession = (userId = VALID_USER_ID) => ({ userId });

export const makeProductWithUserContext = (
  overrides?: Partial<ProductWithUserContext>
): ProductWithUserContext => ({
  id: VALID_PRODUCT_ID,
  title: 'Bicicleta de montana',
  description: 'Bicicleta en perfecto estado',
  price: 150,
  imageUrl: 'https://example.com/bike.jpg',
  userId: VALID_USER_ID,
  categoryId: 'cat-1',
  location: 'Madrid',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  username: VALID_USERNAME,
  status: 'ACTIVE' as ProductStatus,
  categorySlug: 'bicycles',
  categoryName: 'Bicycles',
  isOwner: true,
  isLiked: false,
  ...overrides,
});

export const buildDeleteProductFormData = (productId = VALID_PRODUCT_ID): FormData => {
  const formData = new FormData();
  formData.set('productId', productId);

  return formData;
};

export const buildChangePasswordFormData = (overrides?: {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}): FormData => {
  const newPassword = overrides?.newPassword ?? VALID_NEW_PASSWORD;
  const formData = new FormData();
  formData.set('currentPassword', overrides?.currentPassword ?? VALID_CURRENT_PASSWORD);
  formData.set('newPassword', newPassword);
  formData.set('confirmPassword', overrides?.confirmPassword ?? newPassword);

  return formData;
};

export const buildDeleteUserFormData = (password = VALID_CURRENT_PASSWORD): FormData => {
  const formData = new FormData();
  formData.set('password', password);

  return formData;
};

export const buildUpdateProfileFormData = (overrides?: {
  email?: string;
  username?: string;
  password?: string;
}): FormData => {
  const formData = new FormData();
  formData.set('email', overrides?.email ?? VALID_EMAIL);
  formData.set('username', overrides?.username ?? VALID_USERNAME);
  formData.set('password', overrides?.password ?? VALID_CURRENT_PASSWORD);

  return formData;
};
