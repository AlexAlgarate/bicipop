import z from 'zod';

import { MIN_PASSWORD_LENGTH } from '@/utils/constants';

export const registerSchema = z.object({
  email: z.email('Email no es válido').toLowerCase(),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, 'La contraseña debe tener al menos 8 caracteres')
    .max(16, 'La contraseña no puede tener más de 16 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial'),
  location: z.string().min(1, 'La localidad es obligatoria'),
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
});

export const loginSchema = z.object({
  email: z.email('Email no es válido'),
  password: z
    .string()
    .min(4, 'Recuerda que la contraseña debería tener al menos 4 caracteres'),
});
