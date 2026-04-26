import z from 'zod';

export const updateProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  title: z
    .string()
    .min(3, 'Title is required')
    .max(30, 'Title is too long, max 30 characters'),
  description: z
    .string()
    .min(10, 'Description nust be at least 10 characters')
    .max(200, 'Description is too long, max 200 characters'),
  price: z.number().min(1, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(20, 'Location is too long, max 20 characters'),
  imageUrl: z.string().optional(),
  status: z.string().optional(),
});
