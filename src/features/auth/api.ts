import { prisma } from '@/lib/client';

export const registerUser = async (username: string, email: string, password: string) => {
  await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getAuthUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });
};
