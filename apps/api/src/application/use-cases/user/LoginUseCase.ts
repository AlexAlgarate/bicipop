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
    const user = await this.userRepository.findByEmail(query.email);
    if (!user) throw new EntityNotFoundError('User', query.email);

    const isValid = await this.passwordHasher.compare(query.password, user.password);
    if (!isValid) throw new UnauthorizedError('Wrong password');

    const token = this.tokenService.generate({ userId: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
