import { Prisma } from '@/generated/client/client';
import { getSession } from '@/infrastructure/auth/session';
import prisma from '@/infrastructure/db/prisma/client';
import { comparePassword } from '@/infrastructure/security/bcrypt-password-hasher';

export const updateUserProfile = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const session = await getSession();

  if (!session?.userId) throw new Error('User not found');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });

  if (!currentUser) throw new Error('User not found');

  const isValid = await comparePassword(data.password, currentUser.password);

  if (!isValid) throw new Error('Incorrect password');

  try {
    return await prisma.user.update({
      where: { id: session.userId },
      data: { email: data.email, username: data.username },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;

        if (target?.includes('email')) throw new Error('Email already in use');
        if (target?.includes('username')) throw new Error('Username already in use');
        throw new Error('Duplicate field');
      }
    }
    throw error;
  }
};
