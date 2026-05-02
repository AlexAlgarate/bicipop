import { getCurrentUser } from '@/features/auth/api';
import prisma from '@/infrastructure/db/prisma/client';

export const updateUserProfile = async (data: { email: string; username: string }) => {
  const user = await getCurrentUser();

  if (!user) throw new Error('User not found');

  return await prisma.user.update({
    where: { id: user.id },
    data: { ...data },
  });
};