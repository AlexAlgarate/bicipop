import z from "zod";

export const deleteUserSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});