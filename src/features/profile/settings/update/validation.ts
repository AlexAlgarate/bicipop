import z from "zod";

export const updateUserProfileSchema = z.object({
  email: z.email('Invalid email format').transform(val => val.toLowerCase()),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot have more than 20 characters'),
});