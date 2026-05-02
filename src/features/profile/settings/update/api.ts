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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error(getUniqueConstraintMessage(error));
    }
    throw error;
  }
};
const UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
  email: 'Email already in use',
  username: 'Username already in use',
};

const getUniqueConstraintMessage = (
  error: Prisma.PrismaClientKnownRequestError
): string => {
  const driverError = error.meta?.driverAdapterError as
    | { cause?: { constraint?: { fields?: string[] } } }
    | undefined;

  const fields = driverError?.cause?.constraint?.fields;

  if (Array.isArray(fields)) {
    for (const field of fields) {
      if (UNIQUE_CONSTRAINT_MESSAGES[field]) {
        return UNIQUE_CONSTRAINT_MESSAGES[field];
      }
    }
  }

  return 'A user with that information already exists';
};
