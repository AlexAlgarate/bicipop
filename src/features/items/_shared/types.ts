import type { FormState } from '@/utils/types/form-state';

export type ProductFormState = FormState<{
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: string;
}>;

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface FilterProducts extends SearchFilters {
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
