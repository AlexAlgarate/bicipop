import dotenv, { config } from 'dotenv';
import * as z from 'zod';

const environmentVariablesValidator = z.object({
  ENVIRONMENT: z.enum(['local', 'production']),
  API_PORT: z.string(),
  JWT_SECRET: z.string(),
  SENTRY_DSN: z.url(),
  CORS_ORIGIN: z.string().optional(),
  DATABASE_URL: z.string(),
});

type EnvironmentVariables = z.infer<typeof environmentVariablesValidator>;

export class EnvironmentService {
  private environmentVariables: EnvironmentVariables | null = null;

  load(): void {
    if (this.environmentVariables) return;

    const currentEnvironment = process.env.NODE_ENV ?? '';
    const environmentFile = this.getEnvironmentFile(currentEnvironment);

    const variables: dotenv.DotenvConfigOutput = config({
      path: environmentFile,
      quiet: true,
    });

    if (variables.error) {
      throw new Error(`Error reading environment variables: ${variables.error.message}`);
    }

    try {
      this.environmentVariables = environmentVariablesValidator.parse({
        ...variables.parsed,
        ...process.env,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? `Error validating environment variables ${error.message}` : '';
      throw new Error(`Error validating environment variables: ${errorMessage}`);
    }
  }

  get(): EnvironmentVariables | null {
    if (!this.environmentVariables) {
      this.load();
    }
    return this.environmentVariables;
  }

  private getEnvironmentFile(currentEnvironment: string): '.env.production' | '.env' {
    switch (currentEnvironment) {
      case 'production':
        return '.env.production';
      default:
        return '.env';
    }
  }
}
