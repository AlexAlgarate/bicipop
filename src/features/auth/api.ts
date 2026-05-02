import { cache } from 'react';

import type { UserDTO } from '@/domain/user/types';
import { getSession } from '@/infrastructure/auth/session';
import prisma from '@/infrastructure/db/prisma/client';

export const registerUser = async (username: string, email: string, password: string) => {
  await prisma.user.create({ data: { username, email, password } });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const getUserForAuth = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });
};

export const getCurrentUserWithPassword = cache(async (): Promise<{ id: string; passwordHash: string } | null> => {
  const session = await getSession();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, password: true },
  });

  if (!user) return null;

  return { id: user.id, passwordHash: user.password };
});

export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const session = await getSession();

  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, username: true, createdAt: true },
  });
});
