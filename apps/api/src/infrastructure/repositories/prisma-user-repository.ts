import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { UserCreateInput } from '@domain/types/user/UserCreateInput';
import { prisma } from '@infrastructure/prisma/client';
import { UserMapper } from '@infrastructure/mappers/user-mapper';

export class PrismaUserRepository implements UserRepository {
  constructor() {}
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { email } });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { id } });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async create(data: UserCreateInput): Promise<User> {
    const prismaUser = await prisma.user.create({ data });
    return UserMapper.toDomain(prismaUser);
  }
}
