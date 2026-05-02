import prisma from '@/infrastructure/db/prisma/client';
import { getSession } from '@/infrastructure/auth/session';
import { comparePassword, hashPassword } from '@/infrastructure/security/bcrypt-password-hasher';

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const session = await getSession();

  if (!session?.userId) throw new Error('User not found');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });

  if (!user) throw new Error('User not found');

  const isValid = await comparePassword(currentPassword, user.password);

  if (!isValid) throw new Error('Current password is incorrect');

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: session.userId },
    data: { password: passwordHash },
  });
};