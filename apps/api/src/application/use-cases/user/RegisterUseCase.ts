import { User } from '@domain/entities/User';
import { BusinessConflictError } from '@domain/errors';
import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordHasher } from '@domain/services/PasswordHasher';
import { RegisterDTO } from '@domain/types/user/RegisterDTO';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(query: RegisterDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(query.email);
    if (existingUser) throw new BusinessConflictError('Email already exists');

    const passwordHash = await this.passwordHasher.hash(query.password);

    const newUser = await this.userRepository.create({
      username: query.username,
      email: query.email,
      password: passwordHash,
    });

    return newUser;
  }
}
