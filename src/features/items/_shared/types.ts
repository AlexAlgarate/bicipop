import type { FormState } from '@/utils/types/form-state';

export type ProductFormState = FormState<{
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: string;
}>;

export interface FilterProducts {
  query?: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}
