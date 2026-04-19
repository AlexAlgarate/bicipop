export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isSale: boolean;
  tags: string[];
  imageUrl?: string;
  authorId: string;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
