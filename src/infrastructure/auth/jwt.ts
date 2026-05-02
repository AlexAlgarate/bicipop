import { SignJWT, jwtVerify } from 'jose';

import type { SessionTokenPayload } from '@/infrastructure/auth/types';
import { getJwtSecretKey, JWT_ALGORITHM } from '@/infrastructure/auth/constants';

const jwtSecret = getJwtSecretKey();

export const signSessionToken = async (
  payload: SessionTokenPayload,
  expiresAt: Date
): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(jwtSecret);
};

export const verifySessionToken = async (
  token: string
): Promise<SessionTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, jwtSecret, {
      algorithms: [JWT_ALGORITHM],
    });
    if (typeof payload.userId !== 'string') return null;

    return { userId: payload.userId };
  } catch {
    return null;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  const result = await verifySessionToken(token);
  return result !== null;
};
