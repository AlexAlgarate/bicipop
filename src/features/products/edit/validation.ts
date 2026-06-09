import z from 'zod';

import { ProductStatus } from '@/generated/client/enums';

export const updateProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  title: z
    .string()
    .min(3, 'Title is too short, try again')
    .max(30, 'Title is too long, max 30 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description is too long, max 200 characters'),
  price: z.number().min(1, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  location: z
    .string()
    .min(3, 'Location is too short, try again')
    .max(30, 'Location is too long, max 30 characters'),
  imageUrl: z
    .url({ protocol: /^https?$/, message: 'URL must be https' })

    .optional()
    .or(z.literal('')),
  status: z.enum([ProductStatus.ACTIVE, ProductStatus.RESERVED, ProductStatus.SOLD]),
});
