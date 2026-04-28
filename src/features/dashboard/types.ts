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