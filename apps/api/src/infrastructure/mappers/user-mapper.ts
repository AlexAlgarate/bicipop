import { User } from '@domain/entities/User';
import { UserCreateInput } from '@domain/types/user/UserCreateInput';

export class UserMapper {
  static toDomain(prismaUser: {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}): User {
  return new User({
    id: prismaUser.id,
    username: prismaUser.username,
    email: prismaUser.email,
    password: prismaUser.password,
    createdAt: prismaUser.createdAt,
  });
  }

  static toCreateInput(data: {
  username: string;
  email: string;
  password: string;
}): UserCreateInput {
  return {
    username: data.username,
    email: data.email,
    password: data.password,
  };
  }
}