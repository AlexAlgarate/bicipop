import { User } from '@domain/entities/User';
import { UserCreateInput } from '@domain/types/user/UserCreateInput';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: UserCreateInput): Promise<User>;
}
