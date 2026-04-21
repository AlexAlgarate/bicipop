import { User } from '@domain/entities/User';
import { RegisterDTO } from '@domain/types/user/RegisterDTO';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: RegisterDTO): Promise<User>;
}
