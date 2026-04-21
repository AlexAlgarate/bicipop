import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordHasher } from '@domain/services/PasswordHasher';
import { TokenService } from '@domain/services/TokenService';

import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user-repository';
import { JwtTokenService } from '@infrastructure/services/jwt-token-service';
import { BcryptPasswordHasher } from '@infrastructure/services/bcrypt-password-hasher';

import { container } from './container';
import { USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE, ENVIRONMENT_SERVICE } from './tokens';
import { EnvironmentService } from '@infrastructure/services/environment-service';

export function registerInfrastructure(): void {
  container.bind<UserRepository>(USER_REPOSITORY).to(PrismaUserRepository).inSingletonScope();

  container.bind(ENVIRONMENT_SERVICE).to(EnvironmentService).inSingletonScope();

  container
    .bind<PasswordHasher>(PASSWORD_HASHER)
    .toDynamicValue(() => {
      const SECURE_ROUNDS = 14;
      const TEST_ROUNDS = 1;
      const rounds = process.env.NODE_ENV === 'test' ? TEST_ROUNDS : SECURE_ROUNDS;
      return new BcryptPasswordHasher(rounds);
    })
    .inSingletonScope();

  container
    .bind<TokenService>(TOKEN_SERVICE)
    .toDynamicValue(() => {
      const environmentService = container.get<EnvironmentService>(ENVIRONMENT_SERVICE);
      return new JwtTokenService(environmentService);
    })
    .inSingletonScope();
}
