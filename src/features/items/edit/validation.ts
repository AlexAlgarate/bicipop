import z from 'zod';

export const updateProductSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required')
    .max(30, 'Title is too long, max 30 characters'),
  description: z
    .string()
    .min(10, 'Description nust be at least 10 characters')
    .max(200, 'Description is too long, max 200 characters'),
  price: z.number().min(1, 'Price must be positive'),
  categoryId: z.string(),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(20, 'Location is too long, max 20 characters'),
});
