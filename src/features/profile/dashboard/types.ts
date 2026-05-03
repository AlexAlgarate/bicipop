import type { ProductWithUserContext } from '@/domain/products/types';

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
  products: ProductWithUserContext[];
}
export interface DashboardData {
  items: ProductWithUserContext[];
  totalCount: number;
  statusCounts: {
    active: number;
    reserved: number;
    sold: number;
  };
}
