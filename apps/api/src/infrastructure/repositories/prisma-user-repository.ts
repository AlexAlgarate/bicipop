import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { UserCreateInput } from '@domain/types/user/UserCreateInput';
import { prisma } from '@infrastructure/prisma/client';
import { UserMapper } from '@infrastructure/mappers/user-mapper';
import { BusinessConflictError } from '@domain/errors';

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
    try {
      const prismaUser = await prisma.user.create({ data });
      return UserMapper.toDomain(prismaUser);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        console.log('field -->', field);
        if (field === 'email') {
          throw new BusinessConflictError('Email already exists');
        } else if (field === 'username') {
          throw new BusinessConflictError('Username already exists');
        }
        throw new BusinessConflictError('User already exists');
      }
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { username } });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }
}
