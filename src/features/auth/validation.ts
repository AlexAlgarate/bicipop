import z from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot have more than 20 characters'),
  email: z.email('Invalid email format').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 4 characters')
    .max(16, 'Password cannot have more than 16 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
});

export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 4 characters')
    .max(16, 'Password cannot have more than 16 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
});
