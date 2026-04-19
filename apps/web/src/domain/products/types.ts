export interface ProductDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  categoryId: string;
  location: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  userName: string;
}

export type ProductWithRelations = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  categoryId: string;
  location: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string };
  user: { username: string };
};
