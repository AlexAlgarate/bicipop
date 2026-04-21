import { EntityNotFoundError, UnauthorizedError } from '@domain/errors';
import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordHasher } from '@domain/services/PasswordHasher';
import { TokenService } from '@domain/services/TokenService';
import { LoginDTO } from '@domain/types/user/LoginDTO';
import { AuthResponseDTO } from '@domain/types/user/AuthResponseDTO';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(query: LoginDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(query.email);
    if (!existingUser) throw new EntityNotFoundError('User', query.email);

    const isValid = await this.passwordHasher.compare(query.password, existingUser.password);
    if (!isValid) throw new UnauthorizedError('Wrong password');

    const token = this.tokenService.generate({
      userId: existingUser.id,
      email: existingUser.email,
    });

    return {
      token,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
    };
  }
}
