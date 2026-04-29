export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  location: string;
  userId: string;
}
