export interface CreateAdDTO {
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
  errors?: Record<string, string[]>;
  requestId: number;
  values?: Record<string, string | number>;
};

export type Category = { id: string; name: string };
