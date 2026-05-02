import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

export interface ProductState {
  success: boolean;
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
    imageUrl?: string[];
    location?: string[];
    categoryId?: string[];
  };
}

export interface DashboardProductProps {
  products: ProductsWithFavoriteStatus[];
}
export interface DashboardData {
  items: ProductsWithFavoriteStatus[];
  totalCount: number;
  statusCounts: {
    active: number;
    reserved: number;
    sold: number;
  };
}
