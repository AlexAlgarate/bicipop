import { PasswordHasher } from '@domain/services/PasswordHasher';
import bcrypt from 'bcryptjs';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly rounds: number) {}

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.rounds);
    return await bcrypt.hash(password, salt);
  }
}
