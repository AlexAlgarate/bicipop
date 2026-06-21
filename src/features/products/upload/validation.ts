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
  price: z
    .number()
    .min(1, 'Price must be positive')
    .max(100000, 'Price cannot be greather than 100.000 €'),
  categoryId: z.string().min(1, 'Category is required'),
  location: z
    .string()
    .min(3, 'Location is too short, try again')
    .max(30, 'Location is too long, max 20 characters'),
});
const VALID_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
]);

export const isValidImage = (image: File): image is File => {
  if (!image.type) {
    const ext = image.name.split('.').pop()?.toLowerCase();
    const validExtensions = new Set([
      'jpg',
      'jpeg',
      'png',
      'webp',
      'heic',
      'heif',
      'gif',
    ]);
    return !!ext && validExtensions.has(ext);
  }

  return VALID_IMAGE_TYPES.has(image.type);
};
