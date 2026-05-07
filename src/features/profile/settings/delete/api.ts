import { getSession } from '@/infrastructure/auth/session';
import prisma from '@/infrastructure/db/prisma/client';
import { comparePassword } from '@/infrastructure/security/bcrypt-password-hasher';

export const deleteUserAccount = async (password: string): Promise<void> => {
  const session = await getSession();
  if (!session?.userId) throw new Error('User not found');
  await prisma.$transaction(async tx => {
    const user = await tx.user.findUnique({
      where: { id: session.userId },
      select: { password: true },
    });

    if (!user) throw new Error('User not found');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Incorrect password');

    return await tx.user.delete({
      where: { id: session.userId },
    });
  });
};
