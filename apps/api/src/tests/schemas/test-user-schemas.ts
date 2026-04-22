import { z } from 'zod';

export const signupResponseSchema = z.object({
  content: z.string(),
});

export const signinResponseSchema = z.object({
  user: z.record(z.string(), z.string()),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type SigninResponse = z.infer<typeof signinResponseSchema>;
