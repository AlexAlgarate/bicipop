import z from 'zod';

type PasswordMode = 'dev' | 'prod';

const createPasswordSchema = (mode: PasswordMode) => {
  const DEV_PASSWORD_LENGTH = 6;
  const PROD_PASSWORD_LENGTH = 8;

  const base = z
    .string()
    .min(mode === 'dev' ? DEV_PASSWORD_LENGTH : PROD_PASSWORD_LENGTH);

  if (mode === 'dev') return base;

  return base
    .max(16, 'Password cannot have more than 16 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');
};

const passwordSchema = createPasswordSchema(
  process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
);

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot have more than 20 characters'),
  email: z.email('Invalid email format').transform(val => val.toLowerCase()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.email('Invalid email format').transform(val => val.toLowerCase()),
  password: z.string().min(1),
});
