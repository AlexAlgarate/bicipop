import { RegisterUseCase } from '@application/use-cases/user/RegisterUseCase';
import { LoginUseCase } from '@application/use-cases/user/LoginUseCase';
import { PasswordHasher } from '@domain/services/PasswordHasher';
import { TokenService } from '@domain/services/TokenService';
import { UserRepository } from '@domain/repositories/UserRepository';

import { container } from './container';
import {
  LOGIN_USE_CASE,
  PASSWORD_HASHER,
  REGISTER_USE_CASE,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from './tokens';

export function registerUseCases(): void {
  container.bind(REGISTER_USE_CASE).toDynamicValue(context => {
    const userRepo = context.get<UserRepository>(USER_REPOSITORY);
    const passwordHasherService = context.get<PasswordHasher>(PASSWORD_HASHER);
    return new RegisterUseCase(userRepo, passwordHasherService);
  });

  container.bind(LOGIN_USE_CASE).toDynamicValue(context => {
    const userRepo = context.get<UserRepository>(USER_REPOSITORY);
    const passwordHasherService = context.get<PasswordHasher>(PASSWORD_HASHER);
    const tokenService = context.get<TokenService>(TOKEN_SERVICE);
    return new LoginUseCase(userRepo, passwordHasherService, tokenService);
  });
}
