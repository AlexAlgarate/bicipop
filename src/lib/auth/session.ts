import { cookies } from 'next/headers';
import { cache } from 'react';

import type { CurrentUser } from '@/domain/user/types';

import { prisma } from '../client';

import { type SessionTokenPayload, signSessionToken, verifySessionToken } from './jwt';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const getSessionExpiresAt = (): Date => {
  return new Date(Date.now() + SESSION_DURATION_MS);
};

export const createSession = async (userId: string): Promise<void> => {
  const expiresAt = getSessionExpiresAt();

  const token = await signSessionToken({ userId }, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
};

export const getSession = async (): Promise<SessionTokenPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySessionToken(token);
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();

  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });
});

export const deleteSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};
