import prisma from '@/lib/prisma';
import { AuthUser, UserDto } from './types';

export const getUserByEmail = async (email: string): Promise<UserDto | null> => {
  const userDb = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  if (!userDb) return null;

  return {
    id: userDb.id,
    email: userDb.email,
  };
};

export const getUserById = async (id: string): Promise<UserDto | null> => {
  const userDb = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!userDb) return null;

  return {
    id: userDb.id,
    email: userDb.email,
  };
};

export const getAuthUserByEmail = async (email: string): Promise<AuthUser | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
    },
  });
};

export const createUser = async (
  email: string,
  username: string,
  passwordHash: string,
  location: string,
): Promise<void> => {
  await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      location,
    },
  });
};

export const deleteUser = async (email: string): Promise<void> => {
  // Get user first to get their ID
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Delete all products associated with the user (this will cascade delete favorites)
  await prisma.product.deleteMany({
    where: { userId: user.id },
  });

  // Delete remaining favorites (in case they exist)
  await prisma.favorite.deleteMany({
    where: { userId: user.id },
  });

  // Finally, delete the user
  await prisma.user.delete({
    where: { email },
  });
};
