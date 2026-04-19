import z from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(30, 'El título es demasiado largo. Máx. 30 caracteres.'),
  description: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .max(200, 'La descripción no puede tener más de 200 caracteres'),
  price: z.number().min(1, 'El precio tiene que ser positivo y como mínimo 1€.'),
  categoryId: z.string(),
  location: z
    .string()
    .min(1, 'La localidad es obligatoria')
    .max(20, 'La localidad es demasiado largoa. Máx. 20 caracteres.'),
});
