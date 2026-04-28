export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  location: string;
  userId: string;
}

export type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  requestId: number;
  values?: Record<string, string | number>;
};

export interface Category {
  id: string;
  name: string;
}

export interface FilterProducts {
  query: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type SearchParamValue = string | string[] | undefined;

export type ProductsSearchParams = {
  query: string;
  order: 'asc' | 'desc';
  page: number;
  category: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
};

const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/jpg']);

export const isValidImage = (image: File | null): image is File =>
  !!image && VALID_IMAGE_TYPES.has(image.type);
