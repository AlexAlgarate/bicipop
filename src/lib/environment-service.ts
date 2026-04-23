import * as z from 'zod';

const environmentVariablesValidator = z
  .object({
    ENVIRONMENT: z.enum(['local', 'production']).optional().default('local'),
    NEXT_PUBLIC_API_URL: z.string().optional().default('http://localhost:4000/api/v1'),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .optional()
      .default('https://szclxuchqtsjavxvrxba.supabase.co'),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().optional().default(''),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
    AUTH_COOKIE_NAME: z.string(),
  })
  .transform((val) => ({
    ENVIRONMENT: val.ENVIRONMENT ?? 'local',
    NEXT_PUBLIC_API_URL: val.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
    NEXT_PUBLIC_SUPABASE_URL:
      val.NEXT_PUBLIC_SUPABASE_URL ?? 'https://szclxuchqtsjavxvrxba.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
      val.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
    SUPABASE_SERVICE_ROLE_KEcookiesY: val.SUPABASE_SERVICE_ROLE_KEY,
    SENTRY_DSN: val.SENTRY_DSN,
    AUTH_COOKIE_NAME: val.AUTH_COOKIE_NAME,
  }));

type EnvironmentVariables = z.infer<typeof environmentVariablesValidator>;

class EnvironmentService {
  private environmentVariables: EnvironmentVariables | null = null;

  load(): void {
    if (this.environmentVariables) return;

    try {
      this.environmentVariables = environmentVariablesValidator.parse({
        ...process.env,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Error validating environment variables: ${error.message}`
          : 'Unknown error';
      throw new Error(errorMessage);
    }
  }

  get(): EnvironmentVariables {
    if (!this.environmentVariables) {
      this.load();
    }
    return this.environmentVariables!;
  }
}

export const env = new EnvironmentService();
