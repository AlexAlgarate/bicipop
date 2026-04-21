import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { RegisterDTO } from '@domain/types/user/RegisterDTO';
import { prisma } from '@infrastructure/prisma/client';

export class PrismaUserRepository implements UserRepository {
  constructor() {}
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: RegisterDTO): Promise<User> {
    return prisma.user.create({ data });
  }
}
