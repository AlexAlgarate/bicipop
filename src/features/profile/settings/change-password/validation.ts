import z from "zod";

import { DEV_PASSWORD_LENGTH, PROD_PASSWORD_LENGTH } from '@/utils/constants';

const mode = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const basePasswordSchema = z.string().min(
  mode === 'dev' ? DEV_PASSWORD_LENGTH : PROD_PASSWORD_LENGTH,
  `Password must be at least ${mode === 'dev' ? DEV_PASSWORD_LENGTH : PROD_PASSWORD_LENGTH} characters`
);

const passwordSchema = mode === 'prod'
  ? basePasswordSchema
      .max(16, 'Password cannot have more than 16 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character')
  : basePasswordSchema;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});