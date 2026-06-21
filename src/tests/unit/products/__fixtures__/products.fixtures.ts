import type { ProductDTO, ProductWithUserContext } from '@/domain/products/types';
import type { ProductStatus } from '@/generated/client/enums';

export const VALID_USER_ID = 'user-123';
export const OTHER_USER_ID = 'user-123';
export const VALID_PRODUCT_ID = 'product-123';

export const VALID_IMAGE_URL = 'https://example.com/image.jpg';
export const SUPABASE_PUBLIC_URL =
  'https://supabase.example.com/storage/products/bike.jpg';

export const VALID_PRODUCT_VALUES = {
  title: 'Bicicleta de montana',
  description: 'Bicicleta en perfecto estado con 21 velocidades',
  location: 'Madrid',
  price: '150',
  categoryId: 'cat-1',
} as const;

export const makeSession = (userId = VALID_USER_ID) => ({ userId });

type ProductFormOverrides = Partial<{
  title: string;
  description: string;
  location: string;
  price: string;
  categoryId: string;
}>;

const applyProductFields = (
  formData: FormData,
  overrides: ProductFormOverrides = {}
): void => {
  const values = { ...VALID_PRODUCT_VALUES, ...overrides };
  formData.set('title', values.title);
  formData.set('description', values.description);
  formData.set('location', values.location);
  formData.set('price', values.price);
  formData.set('categoryId', values.categoryId);
};

export const buildUrlImageFormData = (
  overrides: ProductFormOverrides & { imageUrl?: string } = {}
): FormData => {
  const formData = new FormData();
  applyProductFields(formData, overrides);
  formData.set('imageUrl', overrides.imageUrl ?? VALID_IMAGE_URL);

  return formData;
};

export const buildFileImageFormData = (
  overrides: ProductFormOverrides & { file?: File } = {}
): FormData => {
  const formData = new FormData();
  applyProductFields(formData, overrides);
  formData.set('imageFile', overrides.file ?? makeImageFile());
  return formData;
};

export const makeImageFile = (
  overrides?: Partial<{ name: string; type: string; size: number }>
): File => {
  const name = overrides?.name ?? 'photo.jpg';
  const type = overrides?.type ?? 'image/jpeg';
  const content = new Uint8Array(overrides?.size ?? 1024);
  return new File([content], name, { type });
};

export const makeNonImageFile = (): File =>
  new File([new Uint8Array(512)], 'document.pdf', { type: 'application/pdf' });

export const makeEmptyFile = (): File =>
  new File([], 'empty.jpg', { type: 'image/jpeg' });

export const makeProductDTO = (overrides?: Partial<ProductDTO>): ProductDTO => ({
  id: 'product-123',
  title: VALID_PRODUCT_VALUES.title,
  description: VALID_PRODUCT_VALUES.description,
  price: Number(VALID_PRODUCT_VALUES.price),
  imageUrl: VALID_IMAGE_URL,
  userId: VALID_USER_ID,
  categoryId: VALID_PRODUCT_VALUES.categoryId,
  location: VALID_PRODUCT_VALUES.location,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  username: 'testuser',
  status: 'ACTIVE' as ProductStatus,
  categorySlug: 'bicycles',
  categoryName: 'Bicycles',
  ...overrides,
});

export const makeProductWithUserContext = (
  overrides?: Partial<ProductWithUserContext>
): ProductWithUserContext => ({
  ...makeProductDTO(),
  isOwner: true,
  isLiked: false,
  ...overrides,
});

type UpdateFormOverrides = Partial<{
  productId: string;
  title: string;
  description: string;
  location: string;
  price: string;
  categoryId: string;
  file: File;
  status: string;
}>;

export const buildUpdateFormData = (overrides: UpdateFormOverrides = {}): FormData => {
  const formData = new FormData();
  formData.set('productId', overrides.productId ?? VALID_PRODUCT_ID);
  formData.set('title', overrides.title ?? VALID_PRODUCT_VALUES.title);
  formData.set('description', overrides.description ?? VALID_PRODUCT_VALUES.description);
  formData.set('location', overrides.location ?? VALID_PRODUCT_VALUES.location);
  formData.set('price', overrides.price ?? VALID_PRODUCT_VALUES.price);
  formData.set('categoryId', overrides.categoryId ?? VALID_PRODUCT_VALUES.categoryId);
  if (overrides.file) formData.set('imageFile', overrides.file);
  if (overrides.status) formData.set('status', overrides.status);

  return formData;
};
