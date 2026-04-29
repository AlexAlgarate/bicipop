import z from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is too short, try again')
    .max(30, 'Title is too long, max 30 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description is too long, max 200 characters'),
  price: z.number().min(1, 'Price must be positive'),
  categoryId: z.string(),
  location: z
    .string()
    .min(3, 'Location is too short, try again')
    .max(30, 'Location is too long, max 20 characters'),
});

const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/jpg']);

export const isValidImage = (image: File | null): image is File =>
  !!image && VALID_IMAGE_TYPES.has(image.type);
