import { getCurrentUser } from '@/features/auth/api';
import prisma from '@/infrastructure/db/prisma/client';

export const deleteUser = async (): Promise<void> => {
  const user = await getCurrentUser();

  if (!user) throw new Error('User not found');

  await prisma.product.deleteMany({
    where: { userId: user.id },
  });

  await prisma.favorite.deleteMany({
    where: { userId: user.id },
  });

  await prisma.user.delete({
    where: { id: user.id },
  });
};
