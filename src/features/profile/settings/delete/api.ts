import { getCurrentUser } from '@/features/auth/api';
import prisma from '@/infrastructure/db/prisma/client';

export const deleteUserAccount = async (): Promise<void> => {
  const user = await getCurrentUser();

  if (!user) throw new Error('User not found');

  await prisma.user.delete({
    where: { id: user.id },
  });
};